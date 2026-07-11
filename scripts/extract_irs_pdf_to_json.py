from __future__ import annotations

import json
from pathlib import Path

from pypdf import PdfReader


def extract_pdf(pdf_path: Path) -> dict:
    reader = PdfReader(str(pdf_path))
    pages = []
    for index, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        pages.append({
            "pageNumber": index,
            "lines": lines,
            "text": "\n".join(lines),
        })
    return {
        "source": str(pdf_path),
        "pageCount": len(pages),
        "pages": pages,
    }


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Extract the official IRS WISP PDF into structured JSON.")
    parser.add_argument("pdf_path", type=Path)
    parser.add_argument("json_path", type=Path)
    args = parser.parse_args()

    payload = extract_pdf(args.pdf_path)
    args.json_path.parent.mkdir(parents=True, exist_ok=True)
    args.json_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"wrote {args.json_path}")


if __name__ == "__main__":
    main()
