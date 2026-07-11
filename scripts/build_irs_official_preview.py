from __future__ import annotations

import json
import re
from html.parser import HTMLParser
from pathlib import Path


class RichTextParser(HTMLParser):
    BLOCK_TAGS = {"p", "li", "div", "h1", "h2", "h3", "h4"}

    def __init__(self) -> None:
        super().__init__()
        self.blocks: list[dict[str, str]] = []
        self.current: dict[str, object] | None = None
        self.list_stack: list[str] = []
        self.strong_depth = 0

    def flush_current(self) -> None:
        if self.current is None:
            return
        text = " ".join(str(self.current["text"]).split())
        if text:
            strong_text = " ".join(str(self.current.get("strongText") or "").split())
            plain_text = " ".join(str(self.current.get("plainText") or "").split())
            block = {
                "type": str(self.current["type"]),
                "text": text,
                "strongOnly": bool(strong_text and not plain_text and strong_text == text),
            }
            if self.current.get("listType"):
                block["listType"] = self.current["listType"]
            self.blocks.append(block)
        self.current = None

    def handle_starttag(self, tag: str, attrs) -> None:
        tag = tag.lower()
        if tag in {"ul", "ol"}:
            self.list_stack.append(tag)
            return
        if tag == "br":
            if self.current is not None:
                self.current["text"] += "\n"
                if self.strong_depth:
                    self.current["strongText"] += "\n"
                else:
                    self.current["plainText"] += "\n"
            return
        if tag in {"strong", "b"}:
            self.strong_depth += 1
            return
        if tag in self.BLOCK_TAGS:
            self.flush_current()
            block_type = "li" if tag == "li" else "p"
            current = {"type": block_type, "text": "", "strongText": "", "plainText": ""}
            if tag == "li":
                current["listType"] = self.list_stack[-1] if self.list_stack else "ul"
            self.current = current

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag in self.BLOCK_TAGS:
            self.flush_current()
        elif tag in {"strong", "b"} and self.strong_depth:
            self.strong_depth -= 1
        elif tag in {"ul", "ol"} and self.list_stack:
            self.list_stack.pop()

    def handle_data(self, data: str) -> None:
        if self.current is None:
            stripped = data.strip()
            if not stripped:
                return
            self.current = {"type": "p", "text": stripped, "strongText": "", "plainText": stripped}
            return
        self.current["text"] += data
        if self.strong_depth:
            self.current["strongText"] += data
        else:
            self.current["plainText"] += data


def parse_rich_text(html: str) -> list[dict[str, str]]:
    parser = RichTextParser()
    parser.feed(html or "")
    parser.close()
    parser.flush_current()
    if parser.blocks:
        return parser.blocks
    plain_text = " ".join((html or "").replace("&nbsp;", " ").replace("<br>", " ").replace("<br/>", " ").replace("<br />", " ").split())
    return [{"type": "p", "text": plain_text, "strongOnly": False}] if plain_text else []


def line_kind(text: str) -> str:
    if re.match(r"^[IVX]+\.\s+[A-Z]", text):
        return "section-heading"
    if text.startswith("Sample Attachment") or text.startswith("Reference A.") or text.startswith("Resource Links"):
        return "section-heading"
    if re.match(r"^[A-Z][A-Z\s&()/-]{8,}$", text):
        return "section-heading"
    if re.match(r"^[A-Z]\.\s", text) or re.match(r"^[a-z]\.\s", text):
        return "list"
    if text.startswith(("y ", "▪", "}", "•", "-", "I. ", "II. ", "III. ")):
        return "list"
    if len(text) < 90 and text.endswith("Policy"):
        return "subheading"
    return "paragraph"


def blocks_from_lines(lines: list[str], *, title: str = "", cover: bool = False) -> list[dict[str, str]]:
    blocks: list[dict[str, str]] = []
    filtered = [line for line in lines if line and not re.fullmatch(r"\d+", line)]
    if cover:
        if filtered:
            blocks.append({"kind": "cover-title", "text": filtered[0]})
        for line in filtered[1:]:
            if line == "For":
                blocks.append({"kind": "cover-bridge", "text": line})
            elif line.startswith("[Your Firm Name") or line.startswith("[The Firm]"):
                blocks.append({"kind": "cover-firm", "text": line})
            elif line.startswith("This Document"):
                blocks.append({"kind": "cover-note", "text": line})
            elif line.startswith("Last Modified/Reviewed"):
                blocks.append({"kind": "cover-footer", "text": line})
            else:
                blocks.append({"kind": "cover-note", "text": line})
        return blocks

    for line in filtered:
        blocks.append({"kind": line_kind(line), "text": line})
    if title and not any(block["kind"] == "section-heading" for block in blocks):
        blocks.insert(0, {"kind": "section-heading", "text": title})
    return blocks


def html_blocks_as_preview(html: str) -> list[dict[str, str]]:
    preview: list[dict[str, str]] = []
    subheading_texts = {
        "PII Collection and Retention Policy",
        "Personnel Accountability Policy",
        "PII Disclosure Policy",
        "Reportable Event Policy",
        "Network Protection Policy",
        "Firm User Access Control Policy",
        "Electronic Exchange of PII Policy",
        "Wi-Fi Access Policy",
        "Remote Access Policy",
        "Connected Devices Policy",
        "Information Security Training Policy",
    }
    for block in parse_rich_text(html):
        kind = "list" if block["type"] == "li" else "paragraph"
        if kind == "paragraph":
            if re.match(r"^[IVX]+\.\s+[A-Z]", block["text"]):
                kind = "section-heading"
            elif block["text"] in subheading_texts:
                kind = "subheading"
        entry = {
            "kind": kind,
            "text": block["text"],
        }
        if block.get("strongOnly"):
            entry["strongOnly"] = True
        if block.get("listType"):
            entry["listType"] = block["listType"]
        preview.append(entry)
    return preview


def blocks_without_leading_heading(blocks: list[dict], heading_text: str) -> list[dict]:
    if not blocks:
        return blocks
    first = blocks[0]
    first_text = str(first.get("text") or "").strip()
    if first_text == heading_text.strip() and first.get("kind") in {"paragraph", "subheading", "section-heading"}:
        return blocks[1:]
    return blocks


def resource_link_blocks(sections: list[dict] | None) -> list[dict[str, str]]:
    blocks: list[dict[str, str]] = []
    for section in sections or []:
        title = str(section.get("title") or "").strip()
        if title:
            blocks.append({"kind": "subheading", "text": title, "section": "resources"})
        for link in section.get("links") or []:
            label = str(link.get("label") or "").strip()
            url = str(link.get("url") or "").strip()
            if label and url:
                blocks.append({"kind": "resource-link", "text": label, "href": url, "section": "resources"})
            elif label:
                blocks.append({"kind": "resource-link", "text": label, "section": "resources"})
    return blocks


def page(title: str, blocks: list[dict[str, str]], *, cover: bool = False, layout: str = "default") -> dict:
    return {
        "type": "docx-preview",
        "title": title,
        "isCover": cover,
        "layout": layout,
        "blocks": blocks,
    }


def official_static_page(source_page: dict, *, title: str = "", cover: bool = False, layout: str = "irs-static") -> dict:
    page_title = title or next((line for line in source_page["lines"] if line and not line.isdigit()), f"Page {source_page['pageNumber']}")
    return page(page_title, blocks_from_lines(source_page["lines"], title=page_title, cover=cover), cover=cover, layout=layout)


def source_static_page(source_page: dict, *, title: str = "", layout: str = "irs-static") -> dict:
    page_title = title or f"Page {source_page['pageNumber']}"
    return page(page_title, blocks_from_lines(source_page["lines"], title="", cover=False), cover=False, layout=layout)


def merge_payload(payload: dict) -> dict:
    return {
        **(payload.get("mergeFields") or {}),
        **(payload.get("blocks") or {}),
    }


def _wrapped_line_count(text: str, width: int) -> int:
    text = " ".join((text or "").split())
    if not text:
        return 1
    lines = 1
    current = 0
    for word in text.split(" "):
        word_len = len(word)
        if current == 0:
            current = word_len
            continue
        if current + 1 + word_len <= width:
            current += 1 + word_len
        else:
            lines += 1
            current = word_len
    return lines


def estimate_body_block_units(block: dict) -> float:
    kind = block.get("kind")
    text = str(block.get("text") or "")
    section = str(block.get("section") or "")
    if kind == "section-heading":
        if section in {"resources", "glossary"}:
            lines = _wrapped_line_count(text, 42)
            return lines * 0.58 + 0.10
        lines = _wrapped_line_count(text, 34)
        return lines * 1.25 + 0.45
    if kind == "subheading":
        if section in {"resources", "glossary"}:
            lines = _wrapped_line_count(text, 46)
            return lines * 0.50 + 0.10
        lines = _wrapped_line_count(text, 40)
        return lines * 1.6 + 0.8
    if kind == "list":
        if section == "glossary":
            width = 84 if block.get("listType") == "ol" else 88
            lines = _wrapped_line_count(text, width)
            return lines * 0.48 + 0.06
        width = 74 if block.get("listType") == "ol" else 80
        lines = _wrapped_line_count(text, width)
        return lines * 0.82 + 0.18
    if kind == "resource-link":
        lines = _wrapped_line_count(text, 90 if section == "resources" else 82)
        return lines * (0.22 if section == "resources" else 0.34) + 0.05
    if kind == "paragraph" and section in {"glossary", "resources"}:
        lines = _wrapped_line_count(text, 100 if section == "glossary" else 96)
        return lines * (0.46 if section == "glossary" else 0.40) + 0.05
    if kind == "signature":
        lines = _wrapped_line_count(text, 64)
        return lines * 0.95 + 0.28
    if kind == "signature-section":
        return 2.1
    lines = _wrapped_line_count(text, 92)
    return lines * 0.86 + 0.2


def cleanup_preview_blocks(blocks: list[dict]) -> list[dict]:
    cleaned: list[dict] = []
    for index, block in enumerate(blocks):
        text = str(block.get("text") or "").strip()
        lower = text.lower()
        if lower in {"for example:", "example:", "examples:"}:
            remaining = [candidate for candidate in blocks[index + 1:] if str(candidate.get("text") or "").strip()]
            if not remaining or all(candidate.get("kind") == "section-heading" for candidate in remaining[:2]):
                continue
        cleaned.append(block)
    return cleaned


def tag_blocks(blocks: list[dict], section: str) -> list[dict]:
    tagged: list[dict] = []
    for block in blocks:
        current = dict(block)
        current["section"] = section
        tagged.append(current)
    return tagged


def page_layout_for_title(title: str, default_layout: str) -> str:
    if title.startswith("IX. RESOURCE LINKS"):
        return "irs-reference-body"
    if title.startswith("X. GLOSSARY"):
        return "irs-glossary-body"
    return default_layout


def effective_page_capacity(title: str, base_capacity: float) -> float:
    if title == "IX. RESOURCE LINKS":
        return base_capacity + 4.0
    if title == "X. GLOSSARY":
        return base_capacity + 10.0
    return base_capacity


def rebalance_sparse_pages(pages: list[dict], *, base_capacity: float) -> list[dict]:
    if len(pages) < 2:
        return pages

    rebalanced = [dict(page_item) for page_item in pages]
    for index in range(len(rebalanced) - 1):
        current_page = rebalanced[index]
        next_page = rebalanced[index + 1]
        current_blocks = list(current_page.get("blocks") or [])
        next_blocks = list(next_page.get("blocks") or [])
        if not current_blocks or not next_blocks:
            continue

        current_title = str(current_page.get("title") or "")
        current_capacity = effective_page_capacity(current_title, base_capacity)
        current_units = sum(estimate_body_block_units(block) for block in current_blocks)

        # Pull forward only when the current page is visibly underfilled.
        threshold = 0.92 if current_title == "X. GLOSSARY" else 0.78
        if current_units >= current_capacity * threshold:
            continue

        moved_any = False
        while next_blocks:
            candidate = next_blocks[0]
            if candidate.get("kind") == "section-heading" and moved_any:
                break

            candidate_units = estimate_body_block_units(candidate)
            if current_units + candidate_units > current_capacity:
                break

            current_blocks.append(next_blocks.pop(0))
            current_units += candidate_units
            moved_any = True

        if moved_any:
            current_page["blocks"] = current_blocks
            next_page["blocks"] = next_blocks

    return [page_item for page_item in rebalanced if page_item.get("blocks")]


def annotate_ordered_list_continuation(blocks: list[dict]) -> list[dict]:
    annotated: list[dict] = []
    ordered_index = 0
    previous_was_ordered = False

    for block in blocks:
        current = dict(block)
        if current.get("kind") == "list" and current.get("listType") == "ol":
            ordered_index = ordered_index + 1 if previous_was_ordered else 1
            current["listItemIndex"] = ordered_index
            previous_was_ordered = True
        else:
            previous_was_ordered = False
            if current.get("kind") != "list":
                ordered_index = 0
        annotated.append(current)

    return annotated


def paginate_template_body(blocks: list[dict], *, layout: str = "irs-template-body", capacity: float = 57.0) -> list[dict]:
    pages: list[dict] = []
    current_blocks: list[dict] = []
    current_units = 0.0
    active_title = "I. OBJECTIVE"
    page_title = active_title

    blocks = annotate_ordered_list_continuation(cleanup_preview_blocks(blocks))

    for block in blocks:
        if block.get("kind") == "section-heading":
            active_title = str(block.get("text") or active_title)
        effective_capacity = effective_page_capacity(active_title, capacity)
        block_units = estimate_body_block_units(block)
        if current_blocks and current_units + block_units > effective_capacity:
            pages.append(page(page_title, current_blocks, layout=page_layout_for_title(page_title, layout)))
            current_blocks = []
            current_units = 0.0
            page_title = active_title
        if not current_blocks:
            page_title = active_title
        current_blocks.append(block)
        current_units += block_units

    if current_blocks:
        pages.append(page(page_title, current_blocks, layout=page_layout_for_title(page_title, layout)))
    return rebalance_sparse_pages(pages, base_capacity=capacity)


def build_dynamic_pages(source_pages: list[dict], merged: dict) -> list[dict]:
    firm_name = merged.get("companyName") or "[Your Firm Name Here]"
    dsc_name = merged.get("dataSecurityCoordinator") or "[Employees Name]"
    pio_name = merged.get("publicInformationOfficer") or "[Employees Name]"
    signature_title = merged.get("signatureTitle") or "[Principal Operating Officer/Owner Title]"
    principal_name = merged.get("principalOperatingOfficer") or dsc_name

    cover_blocks = [
        {"kind": "cover-title", "text": "Written Information Security Plan (WISP)"},
        {"kind": "cover-bridge", "text": "For"},
        {"kind": "cover-firm", "text": firm_name},
        {"kind": "cover-note", "text": "This Document is for general distribution and is available to all employees."},
        {"kind": "cover-note", "text": "This Document is available to Clients by request and with consent of the Firm's Data Security Coordinator."},
        {"kind": "cover-footer", "text": f"Last Modified/Reviewed {merged.get('lastModifiedLabel') or 'TBD'}"},
    ]

    objective_page = [
        {"kind": "paragraph", "text": "Written Information Security Plan (WISP)"},
        {"kind": "section-heading", "text": "I. OBJECTIVE"},
        *html_blocks_as_preview(merged.get("objective", "")),
        {"kind": "section-heading", "text": "II. PURPOSE"},
        *html_blocks_as_preview(merged.get("purpose", "")),
        {"kind": "section-heading", "text": "III. SCOPE"},
        *html_blocks_as_preview(merged.get("scope", "")),
    ]

    officials_page = [
        {"kind": "section-heading", "text": "IV. IDENTIFIED RESPONSIBLE OFFICIALS"},
        {"kind": "paragraph", "text": f"{firm_name} has designated {dsc_name} to be the Data Security Coordinator (hereinafter the DSC)."},
        *html_blocks_as_preview(merged.get("officials-dsc", "")),
        {"kind": "paragraph", "text": f"{firm_name} has designated {pio_name} to be the Public Information Officer (hereinafter PIO)."},
        *html_blocks_as_preview(merged.get("officials-pio", "")),
        {"kind": "section-heading", "text": "V. INSIDE THE FIRM RISK MITIGATION"},
        *html_blocks_as_preview(merged.get("inside-firm-intro", "")),
    ]

    inside_page_1 = [
        {"kind": "subheading", "text": "PII Collection and Retention Policy"},
        *blocks_without_leading_heading(
            html_blocks_as_preview(merged.get("inside-firm-collection", "")),
            "PII Collection and Retention Policy",
        ),
        {"kind": "subheading", "text": "Personnel Accountability Policy"},
        *blocks_without_leading_heading(
            html_blocks_as_preview(merged.get("inside-firm-personnel", "")),
            "Personnel Accountability Policy",
        ),
    ]

    inside_page_2 = [
        {"kind": "subheading", "text": "PII Disclosure Policy"},
        *blocks_without_leading_heading(
            html_blocks_as_preview(merged.get("inside-firm-disclosure", "")),
            "PII Disclosure Policy",
        ),
        {"kind": "subheading", "text": "Reportable Event Policy"},
        *blocks_without_leading_heading(
            html_blocks_as_preview(merged.get("inside-firm-reportable", "")),
            "Reportable Event Policy",
        ),
        {"kind": "section-heading", "text": "VI. OUTSIDE THE FIRM RISK MITIGATION"},
        *html_blocks_as_preview(merged.get("outside-firm-intro", "")),
    ]

    outside_page_1 = [
        {"kind": "subheading", "text": "Network Protection Policy"},
        *blocks_without_leading_heading(
            html_blocks_as_preview(merged.get("outside-firm-network", "")),
            "Network Protection Policy",
        ),
        {"kind": "subheading", "text": "Firm User Access Control Policy"},
        *blocks_without_leading_heading(
            html_blocks_as_preview(merged.get("outside-firm-access", "")),
            "Firm User Access Control Policy",
        ),
    ]

    outside_page_2 = [
        {"kind": "subheading", "text": "Electronic Exchange of PII Policy"},
        *blocks_without_leading_heading(
            html_blocks_as_preview(merged.get("outside-firm-exchange", "")),
            "Electronic Exchange of PII Policy",
        ),
        {"kind": "subheading", "text": "Wi-Fi Access Policy"},
        *blocks_without_leading_heading(
            html_blocks_as_preview(merged.get("outside-firm-wifi", "")),
            "Wi-Fi Access Policy",
        ),
    ]

    outside_page_3 = [
        {"kind": "subheading", "text": "Remote Access Policy"},
        *html_blocks_as_preview(merged.get("outside-firm-remote", "")),
        {"kind": "subheading", "text": "Connected Devices Policy"},
        *html_blocks_as_preview(merged.get("outside-firm-devices", "")),
        {"kind": "subheading", "text": "Information Security Training Policy"},
        *html_blocks_as_preview(merged.get("outside-firm-training", "")),
    ]

    implementation_page = [
        {"kind": "section-heading", "text": "VII. IMPLEMENTATION"},
        {"kind": "paragraph", "text": f"Effective [date of implementation], {firm_name} has created this Written Information Security Plan (WISP) in compliance with regulatory rulings regarding implementation of a written data security plan found in the Gramm-Leach-Bliley Act and the Federal Trade Commission Financial Privacy and Safeguards Rules."},
    ]

    additional_policy_prefix = [
        {"kind": "section-heading", "text": "VIII. ADDITIONAL POLICIES"},
        {"kind": "subheading", "text": "Record Retention Policy"},
        {"kind": "paragraph", "text": "Designated retained written and electronic records containing PII will be destroyed or deleted at the earliest opportunity consistent with business needs or legal retention requirements."},
        {"kind": "paragraph", "text": "It is Firm policy to retain no PII records longer than required by current regulations, practices, or standards."},
        {"kind": "list", "listType": "ol", "text": "In no case shall paper or electronic retained records containing PII be kept longer than 3 years."},
        {"kind": "list", "listType": "ol", "text": "Paper-based records shall be securely destroyed by cross-cut shredding or incineration at the end of their service life."},
        {"kind": "list", "listType": "ol", "text": "Electronic records shall be securely destroyed by deleting and overwriting the file directory or by reformatting the drive where they were housed or destroying the drive disks rendering them inoperable if they have reached the end of their service life."},
        {"kind": "section-heading", "text": "Rules of Behavior and Conduct Safeguarding Client PII"},
        *tag_blocks(
            blocks_without_leading_heading(
                html_blocks_as_preview(merged.get("policies-rules", "")),
                "Rules of Behavior and Conduct Safeguarding Client PII",
            ),
            "policies-rules",
        ),
        {"kind": "section-heading", "text": "Security Breach Notifications and Procedures"},
        *tag_blocks(
            blocks_without_leading_heading(
                html_blocks_as_preview(merged.get("policies-breach", "")),
                "Security Breach Notifications and Procedures",
            ),
            "breach",
        ),
    ]

    reference_blocks = [
        {"kind": "section-heading", "text": "IX. RESOURCE LINKS"},
        *blocks_without_leading_heading(
            html_blocks_as_preview(merged.get("resources-intro", "")),
            "IX. RESOURCE LINKS",
        ),
        *resource_link_blocks(merged.get("resource-links") or []),
    ]

    glossary_blocks = [
        {"kind": "section-heading", "text": "X. GLOSSARY"},
        *tag_blocks(
            blocks_without_leading_heading(
                html_blocks_as_preview(merged.get("glossary", "")),
                "X. GLOSSARY",
            ),
            "glossary",
        ),
    ]

    signature_page = [
        {"kind": "signature-section", "name": principal_name, "title": signature_title},
        {"kind": "signature-section", "name": dsc_name, "title": "Data Security Coordinator"},
    ]

    body_pages = paginate_template_body(
        objective_page
        + officials_page
        + inside_page_1
        + inside_page_2
        + outside_page_1
        + outside_page_2
        + outside_page_3
        + implementation_page
        + additional_policy_prefix
        + tag_blocks(reference_blocks, "resources")
        + tag_blocks(glossary_blocks, "glossary"),
        layout="irs-template-body",
    )
    return [
        page("Written Information Security Plan (WISP)", cover_blocks, cover=True, layout="irs-template-cover"),
        *body_pages,
        page("Signatures", signature_page, layout="irs-signature-body"),
    ]


def build_preview(source_json_path: Path, payload_path: Path) -> dict:
    source = json.loads(source_json_path.read_text(encoding="utf-8"))
    payload = json.loads(payload_path.read_text(encoding="utf-8"))
    merged = merge_payload(payload)
    pages = build_dynamic_pages(source["pages"], merged)
    return {
        "source": "wisp-draft-plan-source",
        "pageCount": len(pages),
        "pages": pages,
    }


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Build a merged preview model from the active WISP template PDF source.")
    parser.add_argument("source_json", type=Path)
    parser.add_argument("payload_json", type=Path)
    args = parser.parse_args()
    preview = build_preview(args.source_json, args.payload_json)
    print(json.dumps(preview, ensure_ascii=True))


if __name__ == "__main__":
    main()
