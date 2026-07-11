from __future__ import annotations

import argparse
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import xml.etree.ElementTree as ET

NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
W_NS = '{%s}' % NS['w']
ET.register_namespace('w', NS['w'])


def paragraph_text(node: ET.Element) -> str:
    return ''.join(t.text or '' for t in node.findall('.//w:t', NS)).strip()


def find_body_start_index(body: ET.Element, marker: str) -> int:
    children = list(body)
    for idx, child in enumerate(children):
        if child.tag != f'{W_NS}p':
            continue
        if paragraph_text(child) == marker:
            return idx
    raise ValueError(f'Marker not found: {marker!r}')


def clean_document_xml(xml_bytes: bytes, marker: str, drop_marker: bool) -> bytes:
    root = ET.fromstring(xml_bytes)
    body = root.find('.//w:body', NS)
    if body is None:
        raise ValueError('DOCX body not found')
    start_idx = find_body_start_index(body, marker)
    remove_until = start_idx + 1 if drop_marker else start_idx
    children = list(body)
    for child in children[:remove_until]:
        body.remove(child)
    return ET.tostring(root, encoding='utf-8', xml_declaration=True)


def clean_docx(src: Path, dst: Path, marker: str, drop_marker: bool = True) -> None:
    with ZipFile(src, 'r') as zin:
        document_xml = zin.read('word/document.xml')
        cleaned_xml = clean_document_xml(document_xml, marker, drop_marker)
        with ZipFile(dst, 'w', ZIP_DEFLATED) as zout:
            for info in zin.infolist():
                data = cleaned_xml if info.filename == 'word/document.xml' else zin.read(info.filename)
                zout.writestr(info, data)


def main() -> None:
    parser = argparse.ArgumentParser(description='Create a cleaned WISP template DOCX from a noisy source copy.')
    parser.add_argument('src', type=Path)
    parser.add_argument('dst', type=Path)
    parser.add_argument('--marker', default='Sample Template')
    parser.add_argument('--keep-marker', action='store_true')
    args = parser.parse_args()
    args.dst.parent.mkdir(parents=True, exist_ok=True)
    clean_docx(args.src, args.dst, marker=args.marker, drop_marker=not args.keep_marker)
    print(f'cleaned template written to {args.dst}')


if __name__ == '__main__':
    main()
