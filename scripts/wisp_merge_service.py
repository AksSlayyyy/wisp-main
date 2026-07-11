from __future__ import annotations

import base64
import importlib.util
import json
import os
import shutil
import subprocess
import tempfile
from html import escape
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
HOST = os.environ.get('WISP_MERGE_HOST', '127.0.0.1')
PORT = int(os.environ.get('WISP_MERGE_PORT', '8766'))
TEMPLATE_PATH = ROOT / 'design' / 'templates' / 'wisp-template-cleaned.docx'
OFFICIAL_SOURCE_JSON = ROOT / 'design' / 'templates' / 'wisp-draft-plan-source.json'
CHROME_CANDIDATES = [
    os.environ.get('WISP_CHROME_PATH'),
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
]
PYTHON_CANDIDATES = [
    os.environ.get('WISP_PYTHON_PATH'),
    r'C:\Users\Kilometre Morales\AppData\Local\Python\bin\python.exe',
    r'C:\Users\Kilometre Morales\AppData\Local\Python\bin\python3.exe',
    r'C:\Windows\py.exe',
]


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f'Unable to load module from {path}')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


merge_mod = load_module('merge_wisp_template', ROOT / 'scripts' / 'merge_wisp_template.py')
official_preview_mod = load_module('build_irs_official_preview', ROOT / 'scripts' / 'build_irs_official_preview.py')
merge_docx = merge_mod.merge_docx
build_official_preview = official_preview_mod.build_preview


def merge_payload(payload: dict) -> dict:
    return {**(payload.get('mergeFields') or {}), **(payload.get('blocks') or {})}


def find_python() -> str:
    for candidate in PYTHON_CANDIDATES:
        if candidate and Path(candidate).exists():
            return candidate
    return 'python'


def find_chrome() -> str:
    for candidate in CHROME_CANDIDATES:
        if candidate and Path(candidate).exists():
            return candidate
    return ''


def sanitize_slug(value: str | None) -> str:
    text = (value or 'wisp').lower()
    cleaned = []
    dash = False
    for ch in text:
        if ch.isalnum():
            cleaned.append(ch)
            dash = False
        else:
            if not dash:
                cleaned.append('-')
                dash = True
    slug = ''.join(cleaned).strip('-')
    return slug or 'wisp'


def payload_to_merge_data(payload: dict) -> dict:
    return {**(payload.get('mergeFields') or {}), **(payload.get('blocks') or {})}


def build_preview_html(preview: dict) -> str:
    pages = preview.get('pages') or []
    total_pages = len(pages) or 1
    cover_page = next((page for page in pages if page.get('isCover')), None)
    cover_blocks = (cover_page or {}).get('blocks') or []
    firm_name = escape(
        next((block.get('text') for block in cover_blocks if block.get('kind') == 'cover-firm'), None)
        or preview.get('firmName')
        or 'Your Firm'
    )
    review_label = escape(
        next((block.get('text') for block in cover_blocks if block.get('kind') == 'cover-footer'), None)
        or 'Last updated recently'
    )

    def render_blocks(blocks: list[dict], page_title_raw: str, is_cover: bool) -> str:
        parts: list[str] = []
        cover_bottom_parts: list[str] = []
        current_list_type: str | None = None
        list_items: list[str] = []
        current_list_start: int | None = None
        skipped_heading = False
        last_heading_text: str | None = None

        def append_part(html: str, *, cover_bottom: bool = False) -> None:
            if is_cover and cover_bottom:
                cover_bottom_parts.append(html)
            else:
                parts.append(html)

        def flush_list() -> None:
            nonlocal list_items, current_list_type, current_list_start
            if not list_items:
                return
            tag = current_list_type or 'ul'
            list_class = 'docx-list is-ordered' if tag == 'ol' else 'docx-list'
            start_attr = f' start="{current_list_start}"' if tag == 'ol' and current_list_start and current_list_start > 1 else ''
            append_part(f'<{tag} class="{list_class}"{start_attr}>{"".join(list_items)}</{tag}>')
            list_items = []
            current_list_type = None
            current_list_start = None

        for block in blocks:
            raw_text = block.get('text') or ''
            trimmed = raw_text.strip()
            text = escape(raw_text)
            if block.get('kind') == 'signature-section':
                name = escape(str(block.get('name') or '').strip())
                title = escape(str(block.get('title') or '').strip())
                append_part(f'''
                  <div class="docx-signature-section">
                    <div class="docx-signature-rule"></div>
                    <div class="docx-signature-row"><span class="docx-signature-label">Name:</span> <strong>{name}</strong></div>
                    <div class="docx-signature-row"><span class="docx-signature-label">Title:</span> <strong>{title}</strong></div>
                  </div>
                ''')
                continue
            if not text:
                continue
            if not is_cover and not skipped_heading and block.get('kind') == 'section-heading' and trimmed == page_title_raw and False:
                skipped_heading = True
                last_heading_text = trimmed
                continue
            if block.get('kind') == 'paragraph' and trimmed == last_heading_text:
                continue
            if block.get('kind') in {'section-heading', 'subheading'} and trimmed == last_heading_text:
                continue
            if block.get('kind') == 'resource-link':
                href = str(block.get('href') or '').strip()
                link_html = f'<a href="{escape(href)}" target="_blank" rel="noreferrer">{text}</a>' if href else text
                append_part(f'<p class="docx-resource-link">{link_html}</p>')
                continue
            if block.get('kind') == 'list':
                list_type = 'ol' if block.get('listType') == 'ol' else 'ul'
                list_index = int(block.get('listItemIndex') or 0) if list_type == 'ol' else 0
                href = str(block.get('href') or '').strip()
                item_text = f'<a href="{escape(href)}" target="_blank" rel="noreferrer">{text}</a>' if href else text
                if list_items and current_list_type != list_type:
                    flush_list()
                current_list_type = list_type
                if list_type == 'ol' and not list_items:
                    current_list_start = list_index or 1
                list_items.append(f'<li>{item_text}</li>')
                continue
            flush_list()
            if block.get('kind') == 'cover-title':
                append_part(f'<h1 class="cover-title">{text}</h1>')
            elif block.get('kind') == 'cover-bridge':
                append_part(f'<p class="cover-bridge">{text}</p>')
            elif block.get('kind') == 'cover-firm':
                append_part(f'<p class="cover-firm">{text}</p>')
            elif block.get('kind') == 'cover-note':
                append_part(f'<p class="cover-note">{text}</p>', cover_bottom=True)
            elif block.get('kind') == 'cover-footer':
                append_part(f'<p class="cover-footer">{text}</p>', cover_bottom=True)
            elif block.get('kind') == 'paragraph' and trimmed == 'Written Information Security Plan (WISP)':
                append_part(f'<p class="docx-overline">{text}</p>')
            elif block.get('kind') == 'paragraph' and block.get('strongOnly'):
                append_part(f'<p class="docx-paragraph docx-paragraph-strong">{text}</p>')
            elif block.get('kind') == 'section-heading':
                append_part(f'<h2 class="docx-heading">{text}</h2>')
                last_heading_text = trimmed
            elif block.get('kind') == 'subheading':
                append_part(f'<h3 class="docx-subheading">{text}</h3>')
                last_heading_text = trimmed
            elif block.get('kind') == 'signature':
                append_part(f'<p class="docx-signature">{text}</p>')
            elif block.get('kind') == 'centered':
                append_part(f'<p class="docx-centered">{text}</p>')
            else:
                append_part(f'<p class="docx-paragraph">{text}</p>')
        flush_list()
        if is_cover:
            return f'<div class="cover-main">{"".join(parts)}</div><div class="cover-support">{"".join(cover_bottom_parts)}</div>'
        return ''.join(parts)

    page_markup: list[str] = []
    for page_index, page in enumerate(pages):
        blocks = page.get('blocks') or []
        layout = str(page.get('layout') or '').strip()
        layout_class = f"layout-{layout.replace(' ', '-').lower()}" if layout else ''
        page_title_raw = str(page.get('title') or f'Page {page_index + 1}').strip()
        page_title = escape(page_title_raw)
        is_cover = bool(page.get('isCover'))
        if 'attachment' in layout_class:
            page_category = 'Appendix'
        elif 'reference' in layout_class:
            page_category = 'Reference'
        elif 'guide' in layout_class:
            page_category = 'Implementation Guide'
        else:
            page_category = 'Policy Section'
        content_html = render_blocks(blocks, page_title_raw, is_cover)
        if is_cover:
            section_html = f'''
            <div class="cover-shell">
              <div class="cover-body">
                {content_html}
              </div>
              <div class="cover-meta-row">
                <div>
                  <label>Prepared for</label>
                  <strong>{firm_name}</strong>
                </div>
                <div>
                  <label>Document</label>
                  <strong>Enterprise WISP</strong>
                </div>
                <div>
                  <label>Status</label>
                  <strong>{review_label}</strong>
                </div>
              </div>
            </div>
            '''
        else:
            section_html = f'''
            <div class="page-content">
              {content_html}
            </div>
            <div class="page-footer"><span>{page_index + 1} / {total_pages}</span></div>
            '''
        page_markup.append(f'''
      <section class="pdf-page {'is-cover' if is_cover else ''} {layout_class}" data-page="{page_index + 1}">
        <div class="page-frame {layout_class}">
          {section_html}
        </div>
      </section>
        ''')

    return f'''<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>WISP Preview PDF</title>
  <style>
    @page {{ size: Letter; margin: 0; }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; background: #ffffff; font-family: Georgia, Cambria, "Times New Roman", serif; color: #24364a; }}
    .pdf-page {{ width: 8.5in; margin: 0 auto 0.18in; break-before: page; break-inside: auto; page-break-before: always; page-break-inside: auto; overflow: visible; background: #ffffff; }}
    .pdf-page:last-child {{ page-break-after: auto; }}
    .page-frame {{ position: relative; width: 100%; min-height: 10.82in; border: 0; border-radius: 0; background: #ffffff; padding: 0.52in 0.53in 0.42in; overflow: visible; -webkit-box-decoration-break: clone; box-decoration-break: clone; }}
    .page-frame::before {{ content: ''; position: absolute; inset: 0 0 auto 0; height: 0.46in; background: #123f69; pointer-events: none; }}
    .cover-shell {{ position: relative; width: 100%; height: 100%; padding: 0.46in 0.62in 0.42in 0.62in; background: #ffffff; }}
    .cover-topbar {{ height: 0.22in; margin: -0.46in -0.62in 0.52in; background: #123f69; }}
    .cover-body {{ display: flex; min-height: 7.35in; flex-direction: column; align-items: center; justify-content: flex-start; }}
    .cover-title {{ margin: 0.46in 0 0; color: #10283f; font-family: Cambria, Georgia, serif; font-size: 33px; line-height: 1.14; text-align: center; max-width: 5.3in; }}
    .cover-bridge {{ margin: 0.58in 0 0; color: #5f6f7f; font-size: 11px; font-weight: 700; letter-spacing: 0.26em; text-align: center; text-transform: uppercase; }}
    .cover-firm {{ margin: 0.18in 0 auto; color: #122b43; font-family: Cambria, Georgia, serif; font-size: 31px; line-height: 1.14; text-align: center; max-width: 5.1in; }}
    .cover-note, .cover-footer {{ margin: 0; color: #617488; font-size: 10.5px; line-height: 1.5; text-align: center; max-width: 5.3in; }}
    .cover-footer {{ margin-top: 0.14in; font-weight: 700; letter-spacing: 0.01em; }}
    .cover-meta-row {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding-top: 0.2in; border-top: 1px solid #dbe3ea; }}
    .cover-meta-row div {{ display: flex; flex-direction: column; gap: 5px; text-align: center; }}
    .cover-meta-row label {{ color: #6b7d8f; font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }}
    .cover-meta-row strong {{ color: #162d43; font-size: 12px; font-weight: 700; }}
    .page-content {{ padding: 0.24in 0 0.18in; color: #1f2937; }}
    .page-footer {{ position: absolute; right: 0.53in; bottom: 0.16in; display: block; margin: 0; color: #6c7d8e; font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-align: right; }}
    .docx-overline {{ margin: 0 0 11px; color: #6b7d8f; font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }}
    .docx-heading {{ margin: 0 0 12px; color: #123f69; font-family: Cambria, Georgia, serif; font-size: 18px; line-height: 1.12; font-weight: 700; }}
    .docx-subheading {{ margin: 12px 0 6px; color: #111827; font-family: Georgia, Cambria, "Times New Roman", serif; font-size: 12.8px; line-height: 1.18; font-weight: 700; letter-spacing: 0; text-transform: none; }}
    .docx-paragraph, .docx-centered, .docx-signature {{ margin: 0 0 8px; color: #111827; font-size: 12.3px; line-height: 1.34; }}
    .docx-paragraph-strong {{ font-weight: 700; margin-top: 6px; margin-bottom: 5px; }}
    .docx-centered {{ text-align: center; }}
    .docx-signature {{ margin-top: 13px; font-weight: 700; }}
    .docx-signature-section {{ margin: 16px 0 0; padding-top: 8px; }}
    .docx-signature-rule {{ height: 1px; background: #1b1b1b; margin: 0 0 10px; }}
    .docx-signature-row {{ display: flex; align-items: baseline; gap: 8px; margin: 0 0 6px; color: #111827; font-size: 12.3px; line-height: 1.34; }}
    .docx-signature-label {{ min-width: 38px; font-weight: 700; }}
    .docx-list {{ margin: 0 0 8px 22px; padding: 0; color: #111827; }}
    .docx-list li {{ margin: 0 0 4px; font-size: 12.3px; line-height: 1.32; }}
    .docx-list.is-ordered {{ list-style-type: upper-alpha; margin-left: 21px; }}
    .docx-list.is-ordered li::marker {{ color: #111827; font-weight: 700; }}
    .docx-list a {{ color: #1a56c5; text-decoration: underline; text-underline-offset: 2px; }}
    .docx-resource-link {{ margin: 0 0 4px 18px; color: #111827; font-size: 11.7px; line-height: 1.22; }}
    .docx-resource-link a {{ color: #1a56c5; text-decoration: underline; text-underline-offset: 2px; }}
    .layout-irs-reference-body .page-content,
    .layout-irs-glossary-body .page-content {{ padding-top: 0.20in; padding-bottom: 0.14in; }}
    .layout-irs-reference-body .docx-heading,
    .layout-irs-glossary-body .docx-heading {{ margin-bottom: 10px; }}
    .layout-irs-reference-body .docx-subheading,
    .layout-irs-glossary-body .docx-subheading {{ margin-top: 8px; margin-bottom: 5px; font-size: 12.2px; }}
    .layout-irs-reference-body .docx-paragraph,
    .layout-irs-glossary-body .docx-paragraph {{ margin-bottom: 6px; font-size: 11.6px; line-height: 1.28; }}
    .layout-irs-reference-body .docx-resource-link {{ margin: 0 0 3px 18px; font-size: 11.0px; line-height: 1.18; }}
    .layout-irs-glossary-body .docx-list {{ margin-bottom: 6px; }}
    .layout-irs-glossary-body .docx-list li {{ font-size: 11.2px; line-height: 1.27; }}
  </style>
</head>
<body>
{''.join(page_markup)}
</body>
</html>'''


def render_pdf(preview: dict, temp_dir: Path, slug: str) -> bytes:
    chrome = find_chrome()
    if not chrome:
        raise RuntimeError('Chrome or Edge executable not found.')
    html_path = temp_dir / f'{slug}-preview.html'
    pdf_path = temp_dir / f'{slug}-preview.pdf'
    html_path.write_text(build_preview_html(preview), encoding='utf-8')
    result = subprocess.run(
        [
            chrome,
            '--headless=new',
            '--disable-gpu',
            '--allow-file-access-from-files',
            '--print-to-pdf-no-header',
            f'--print-to-pdf={pdf_path}',
            html_path.as_uri(),
        ],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError((result.stderr or result.stdout or f'chrome exited with code {result.returncode}').strip())
    if not pdf_path.exists():
        raise RuntimeError('PDF output was not created by Chrome.')
    return pdf_path.read_bytes()


def run_merge(payload: dict, temp_dir: Path | None = None) -> tuple[bytes, str, Path, Path]:
    if not TEMPLATE_PATH.exists():
        raise FileNotFoundError(f'Template not found: {TEMPLATE_PATH}')
    temp_dir = temp_dir or Path(tempfile.mkdtemp(prefix='wisp-merge-'))
    merge_json_path = temp_dir / 'merge-payload.json'
    merge_data = payload_to_merge_data(payload)
    slug = sanitize_slug((payload.get('mergeFields') or {}).get('companyName'))
    output_path = temp_dir / f'{slug}-merged.docx'
    merge_json_path.write_text(json.dumps(merge_data, indent=2), encoding='utf-8')
    merge_docx(TEMPLATE_PATH, output_path, merge_data)
    return output_path.read_bytes(), output_path.name, temp_dir, output_path


def json_response(handler: BaseHTTPRequestHandler, status: int, payload: dict) -> None:
    body = json.dumps(payload, ensure_ascii=True).encode('utf-8')
    handler.send_response(status)
    handler.send_header('Content-Type', 'application/json; charset=utf-8')
    handler.send_header('Access-Control-Allow-Origin', '*')
    handler.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    handler.send_header('Access-Control-Allow-Headers', 'Content-Type')
    handler.send_header('Content-Length', str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


class WispHandler(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def log_message(self, format: str, *args) -> None:
        return

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self) -> None:
        route = urlparse(self.path).path
        if route == '/health':
            json_response(self, 200, {
                'ok': True,
                'service': 'wisp-merge-service-python',
                'templatePath': str(TEMPLATE_PATH),
                'officialSourceJson': str(OFFICIAL_SOURCE_JSON),
                'chromePath': find_chrome(),
                'pythonPath': find_python(),
            })
            return
        json_response(self, 404, {'error': 'Not found'})

    def _read_json_body(self) -> dict:
        length = int(self.headers.get('Content-Length', '0') or '0')
        raw = self.rfile.read(length) if length else b'{}'
        return json.loads(raw.decode('utf-8') or '{}')

    def do_POST(self) -> None:
        route = urlparse(self.path).path
        try:
            payload = self._read_json_body()
            if route == '/merge':
                buffer, filename, temp_dir, _ = run_merge(payload)
                try:
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                    self.send_header('Content-Disposition', f'attachment; filename="{filename}"')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Content-Length', str(len(buffer)))
                    self.end_headers()
                    self.wfile.write(buffer)
                finally:
                    shutil.rmtree(temp_dir, ignore_errors=True)
                return

            if route == '/merge-preview':
                buffer, filename, temp_dir, _ = run_merge(payload)
                try:
                    preview_payload_path = temp_dir / 'official-preview-payload.json'
                    preview_payload_path.write_text(json.dumps(payload, ensure_ascii=True), encoding='utf-8')
                    preview = build_official_preview(OFFICIAL_SOURCE_JSON, preview_payload_path)
                    pdf_bytes = render_pdf(preview, temp_dir, sanitize_slug((payload.get('mergeFields') or {}).get('companyName')))
                    json_response(self, 200, {
                        'ok': True,
                        'fileName': filename,
                        'mimeType': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'docxBase64': base64.b64encode(buffer).decode('ascii'),
                        'pdfFileName': f"{sanitize_slug((payload.get('mergeFields') or {}).get('companyName'))}-preview.pdf",
                        'pdfBase64': base64.b64encode(pdf_bytes).decode('ascii'),
                        **preview,
                    })
                finally:
                    shutil.rmtree(temp_dir, ignore_errors=True)
                return

            json_response(self, 404, {'error': 'Not found'})
        except Exception as exc:
            json_response(self, 500, {'error': str(exc)})


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), WispHandler)
    print(f'wisp merge service listening on http://{HOST}:{PORT}')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
