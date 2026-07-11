from __future__ import annotations

import argparse
import copy
import json
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import xml.etree.ElementTree as ET

NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
W_NS = '{%s}' % NS['w']
XML_NS = '{http://www.w3.org/XML/1998/namespace}'
ET.register_namespace('w', NS['w'])

EMPLOYEE_NAME_PLACEHOLDERS = ("[Employee's Name]", "[Employee?s Name]", '[Employee???s Name]')
FIRM_NAME_PLACEHOLDERS = ('[Your Firm Name Here]', '[Your Firm Name]', '[The Firm]')

SECTION_REPLACEMENTS = [
    ('objective', 'OBJECTIVE', 'PURPOSE'),
    ('purpose', 'PURPOSE', 'SCOPE'),
    ('scope', 'SCOPE', 'IDENTIFIED RESPONSIBLE OFFICIALS'),
    ('inside-firm-intro', 'INSIDE THE FIRM RISK MITIGATION', 'PII Collection and Retention Policy'),
    ('inside-firm-collection', 'PII Collection and Retention Policy', 'Personnel Accountability Policy'),
    ('inside-firm-personnel', 'Personnel Accountability Policy', 'PII Disclosure Policy'),
    ('inside-firm-disclosure', 'PII Disclosure Policy', 'Reportable Event Policy'),
    ('inside-firm-reportable', 'Reportable Event Policy', 'OUTSIDE THE FIRM RISK MITIGATION'),
    ('outside-firm-intro', 'OUTSIDE THE FIRM RISK MITIGATION', 'Network Protection Policy'),
    ('outside-firm-network', 'Network Protection Policy', 'Firm User Access Control Policy'),
    ('outside-firm-access', 'Firm User Access Control Policy', 'Electronic Exchange of PII Policy'),
    ('outside-firm-exchange', 'Electronic Exchange of PII Policy', 'Wi-Fi Access Policy'),
    ('outside-firm-wifi', 'Wi-Fi Access Policy', 'Remote Access Policy'),
    ('outside-firm-remote', 'Remote Access Policy', 'Connected Devices Policy'),
    ('outside-firm-devices', 'Connected Devices Policy', 'Information Security Training Policy'),
    ('outside-firm-training', 'Information Security Training Policy', 'IMPLEMENTATION'),
]

ROLE_REPLACEMENTS = [
    ('officials-dsc', 'IDENTIFIED RESPONSIBLE OFFICIALS', 'Data Security Coordinator', 'Public Information Officer'),
    ('officials-pio', 'IDENTIFIED RESPONSIBLE OFFICIALS', 'Public Information Officer', 'INSIDE THE FIRM RISK MITIGATION'),
]


class RichTextParser(HTMLParser):
    BLOCK_TAGS = {'p', 'li', 'div', 'h1', 'h2', 'h3', 'h4'}

    def __init__(self) -> None:
        super().__init__()
        self.blocks: list[dict[str, str]] = []
        self.current: dict[str, str] | None = None
        self.list_stack: list[str] = []

    def flush_current(self) -> None:
        if self.current is None:
            return
        text = ' '.join(self.current['text'].split())
        if text:
            self.blocks.append({'type': self.current['type'], 'text': text})
        self.current = None

    def handle_starttag(self, tag: str, attrs) -> None:
        tag = tag.lower()
        if tag in {'ol', 'ul'}:
            self.list_stack.append(tag)
            return
        if tag == 'br':
            if self.current is not None:
                self.current['text'] += '\n'
            return
        if tag in self.BLOCK_TAGS:
            self.flush_current()
            block_type = 'li' if tag == 'li' else 'p'
            self.current = {'type': block_type, 'text': ''}

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag in self.BLOCK_TAGS:
            self.flush_current()
        elif tag in {'ol', 'ul'} and self.list_stack:
            self.list_stack.pop()

    def handle_data(self, data: str) -> None:
        if self.current is None:
            stripped = data.strip()
            if stripped:
                self.current = {'type': 'p', 'text': stripped}
            return
        self.current['text'] += data


def strip_html_to_plain_text(html: str) -> str:
    return ' '.join((html or '').replace('<br>', ' ').replace('<br/>', ' ').replace('<br />', ' ').split('<')).replace('>', ' ')


def parse_rich_text(html: str) -> list[dict[str, str]]:
    parser = RichTextParser()
    parser.feed(html or '')
    parser.close()
    parser.flush_current()
    if parser.blocks:
        return parser.blocks
    plain_text = ' '.join((html or '').replace('&nbsp;', ' ').replace('<br>', ' ').replace('<br/>', ' ').replace('<br />', ' ').split())
    return [{'type': 'p', 'text': plain_text}] if plain_text else []


def paragraph_text(node: ET.Element) -> str:
    return ''.join(t.text or '' for t in node.findall('.//w:t', NS)).strip()


def get_body(root: ET.Element) -> ET.Element:
    body = root.find('.//w:body', NS)
    if body is None:
        raise ValueError('DOCX body not found')
    return body


def body_children(body: ET.Element) -> list[ET.Element]:
    return [child for child in list(body) if child.tag != f'{W_NS}sectPr']


def find_first_index(children: list[ET.Element], text: str, *, contains: bool = False, start: int = 0) -> int:
    for idx in range(start, len(children)):
        child = children[idx]
        if child.tag != f'{W_NS}p':
            continue
        value = paragraph_text(child)
        if contains:
            if text in value:
                return idx
        elif value == text:
            return idx
    raise ValueError(f'Paragraph not found: {text!r}')


def replace_in_runs(node: ET.Element, replacements: dict[str, str]) -> None:
    for t in node.findall('.//w:t', NS):
        text = t.text or ''
        for old, new in replacements.items():
            if old in text:
                text = text.replace(old, new)
        t.text = text


def replace_paragraph_text(node: ET.Element, text: str) -> None:
    for child in list(node):
        if child.tag == f'{W_NS}r':
            node.remove(child)
    run = ET.Element(f'{W_NS}r')
    t = ET.SubElement(run, f'{W_NS}t')
    if text.startswith(' ') or text.endswith(' ') or '  ' in text:
        t.set(f'{XML_NS}space', 'preserve')
    t.text = text
    node.append(run)


def clone_with_text(template: ET.Element, text: str) -> ET.Element:
    new_para = copy.deepcopy(template)
    for child in list(new_para):
        if child.tag == f'{W_NS}r':
            new_para.remove(child)
    run = ET.Element(f'{W_NS}r')
    t = ET.SubElement(run, f'{W_NS}t')
    if text.startswith(' ') or text.endswith(' ') or '  ' in text:
        t.set(f'{XML_NS}space', 'preserve')
    t.text = text
    new_para.append(run)
    return new_para


def choose_templates(existing: list[ET.Element]) -> tuple[ET.Element, ET.Element]:
    paragraph_template = None
    list_template = None
    for node in existing:
        if node.tag != f'{W_NS}p':
            continue
        is_list = node.find('./w:pPr/w:numPr', NS) is not None
        if is_list and list_template is None:
            list_template = node
        if not is_list and paragraph_template is None:
            paragraph_template = node
    fallback = next((node for node in existing if node.tag == f'{W_NS}p'), None)
    if paragraph_template is None:
        if fallback is None:
            raise ValueError('No paragraph template available')
        paragraph_template = fallback
    if list_template is None:
        list_template = paragraph_template
    return paragraph_template, list_template


def replace_block_range(body: ET.Element, start_idx: int, end_idx: int, blocks: list[dict[str, str]]) -> None:
    current = body_children(body)
    existing = current[start_idx:end_idx]
    if not existing:
        raise ValueError('No existing nodes found for replacement range')
    paragraph_template, list_template = choose_templates(existing)
    for node in existing:
        body.remove(node)
    current = body_children(body)
    insert_before = current[end_idx - len(existing)] if (end_idx - len(existing)) < len(current) else None
    insert_at = list(body).index(insert_before) if insert_before is not None else len(list(body))
    for block in blocks:
        template = list_template if block['type'] == 'li' else paragraph_template
        body.insert(insert_at, clone_with_text(template, block['text']))
        insert_at += 1


def replace_section(body: ET.Element, start_anchor: str, end_anchor: str, html: str) -> None:
    blocks = parse_rich_text(html)
    if not blocks:
        raise ValueError(f'No content blocks parsed for section {start_anchor!r}')
    children = body_children(body)
    anchor_idx = find_first_index(children, start_anchor)
    start_idx = anchor_idx + 1
    end_idx = find_first_index(children, end_anchor, start=start_idx)
    replace_block_range(body, start_idx, end_idx, blocks)


def replace_role_block(body: ET.Element, section_anchor: str, role_marker: str, next_role_marker: str | None, html: str) -> None:
    blocks = parse_rich_text(html)
    if not blocks:
        raise ValueError(f'No content blocks parsed for role {role_marker!r}')
    children = body_children(body)
    section_idx = find_first_index(children, section_anchor)
    role_idx = find_first_index(children, role_marker, contains=True, start=section_idx + 1)
    if next_role_marker:
        end_idx = find_first_index(children, next_role_marker, contains=True, start=role_idx + 1)
    else:
        end_idx = len(children)
    replace_block_range(body, role_idx, end_idx, blocks)


def replace_first_matching_paragraph(root: ET.Element, contains: str, replacements: dict[str, str]) -> None:
    for node in root.findall('.//w:p', NS):
        text = paragraph_text(node)
        if contains in text:
            for old, new in replacements.items():
                text = text.replace(old, new)
            replace_paragraph_text(node, text)
            return


def apply_merge(root: ET.Element, merge_data: dict[str, str]) -> None:
    body = get_body(root)

    replacements: dict[str, str] = {}
    company = merge_data.get('companyName')
    if company:
        for placeholder in FIRM_NAME_PLACEHOLDERS:
            replacements[placeholder] = company
    if merge_data.get('signatureTitle'):
        replacements['[Principal Operating Officer/Owner Title]'] = merge_data['signatureTitle']
    generated_label = merge_data.get('lastModifiedLabel') or datetime.utcnow().strftime('%b %d, %Y')
    replacements['[Last Modified Date]'] = generated_label
    replacements['[Should review and update at least annually]'] = '(Review at least annually)'
    for node in root.findall('.//w:p', NS):
        replace_in_runs(node, replacements)

    if merge_data.get('dataSecurityCoordinator'):
        replace_first_matching_paragraph(
            root,
            'Data Security Coordinator',
            {placeholder: merge_data['dataSecurityCoordinator'] for placeholder in EMPLOYEE_NAME_PLACEHOLDERS},
        )

    if merge_data.get('publicInformationOfficer'):
        replace_first_matching_paragraph(
            root,
            'Public Information Officer',
            {placeholder: merge_data['publicInformationOfficer'] for placeholder in EMPLOYEE_NAME_PLACEHOLDERS},
        )

    for key, start_anchor, end_anchor in SECTION_REPLACEMENTS:
        html = merge_data.get(key)
        if html:
            replace_section(body, start_anchor, end_anchor, html)

    for key, section_anchor, role_marker, next_role_marker in ROLE_REPLACEMENTS:
        html = merge_data.get(key)
        if html:
            replace_role_block(body, section_anchor, role_marker, next_role_marker, html)


def merge_docx(src: Path, dst: Path, merge_data: dict[str, str]) -> None:
    with ZipFile(src, 'r') as zin:
        document_xml = zin.read('word/document.xml')
        root = ET.fromstring(document_xml)
        apply_merge(root, merge_data)
        merged_xml = ET.tostring(root, encoding='utf-8', xml_declaration=True)
        with ZipFile(dst, 'w', ZIP_DEFLATED) as zout:
            for info in zin.infolist():
                data = merged_xml if info.filename == 'word/document.xml' else zin.read(info.filename)
                zout.writestr(info, data)


def main() -> None:
    parser = argparse.ArgumentParser(description='Prototype merge for the cleaned WISP DOCX template.')
    parser.add_argument('src', type=Path)
    parser.add_argument('dst', type=Path)
    parser.add_argument('merge_json', type=Path)
    args = parser.parse_args()
    merge_data = json.loads(args.merge_json.read_text(encoding='utf-8'))
    args.dst.parent.mkdir(parents=True, exist_ok=True)
    merge_docx(args.src, args.dst, merge_data)
    print(f'merged template written to {args.dst}')


if __name__ == '__main__':
    main()
