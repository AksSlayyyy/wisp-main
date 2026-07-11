from __future__ import annotations

import json
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def paragraph_text(node: ET.Element) -> str:
    return "".join(t.text or "" for t in node.findall(".//w:t", NS)).strip()


def paragraph_style(node: ET.Element) -> str:
    style = node.find("./w:pPr/w:pStyle", NS)
    if style is None:
        return ""
    return style.attrib.get("{%s}val" % NS["w"], "")


def paragraph_align(node: ET.Element) -> str:
    align = node.find("./w:pPr/w:jc", NS)
    if align is None:
        return ""
    return align.attrib.get("{%s}val" % NS["w"], "")


def paragraph_is_list(node: ET.Element) -> bool:
    return node.find("./w:pPr/w:numPr", NS) is not None or paragraph_style(node) == "ListParagraph"


def classify_block(page_index: int, text: str, style: str, align: str, is_list: bool, visible_index: int) -> str:
    if page_index == 0:
        if visible_index == 0:
            return "cover-title"
        if text == "For":
            return "cover-bridge"
        if visible_index == 2:
            return "cover-firm"
        if text.startswith("This Document"):
            return "cover-note"
        if text.startswith("Last Modified/Reviewed"):
            return "cover-footer"
        return "cover-note"
    if is_list:
        return "list"
    if style.startswith("Heading"):
        return "signature"
    if text.isupper() and len(text) <= 90:
        return "section-heading"
    if text.endswith("Policy") and len(text) <= 80:
        return "subheading"
    if align == "center" and len(text) <= 120:
        return "centered"
    return "paragraph"


def build_preview(docx_path: Path) -> dict:
    with ZipFile(docx_path, "r") as archive:
        root = ET.fromstring(archive.read("word/document.xml"))

    body = root.find(".//w:body", NS)
    if body is None:
        raise ValueError("DOCX body not found")

    pages: list[list[dict[str, str]]] = [[]]
    visible_indexes: list[int] = [0]

    for node in body.findall("w:p", NS):
        text = paragraph_text(node)
        if node.find(".//w:lastRenderedPageBreak", NS) is not None and pages[-1]:
            pages.append([])
            visible_indexes.append(0)
        if not text:
            continue
        page_index = len(pages) - 1
        style = paragraph_style(node)
        align = paragraph_align(node)
        kind = classify_block(
            page_index,
            text,
            style,
            align,
            paragraph_is_list(node),
            visible_indexes[-1],
        )
        pages[-1].append({
            "kind": kind,
            "text": text,
            "style": style,
            "align": align,
        })
        visible_indexes[-1] += 1

    serialized_pages = []
    for index, blocks in enumerate(pages):
        first_heading = next(
            (block["text"] for block in blocks if block["kind"] in {"section-heading", "subheading", "cover-title"}),
            f"Page {index + 1}",
        )
        serialized_pages.append({
            "type": "docx-preview",
            "title": first_heading,
            "isCover": index == 0,
            "blocks": blocks,
        })

    return {
        "pageCount": len(serialized_pages),
        "pages": serialized_pages,
    }


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Render a merged WISP DOCX into structured preview pages.")
    parser.add_argument("docx_path", type=Path)
    args = parser.parse_args()
    preview = build_preview(args.docx_path)
    print(json.dumps(preview, ensure_ascii=True))


if __name__ == "__main__":
    main()
