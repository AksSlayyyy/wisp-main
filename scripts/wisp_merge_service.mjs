import http from "node:http";
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const HOST = process.env.WISP_MERGE_HOST || "127.0.0.1";
const PORT = Number(process.env.WISP_MERGE_PORT || 8766);
const ROOT = process.cwd();
const TEMPLATE_PATH = path.join(ROOT, "design", "templates", "wisp-template-cleaned.docx");
const MERGE_SCRIPT = path.join(ROOT, "scripts", "merge_wisp_template.py");
const PREVIEW_SCRIPT = path.join(ROOT, "scripts", "render_wisp_preview.py");
const OFFICIAL_SOURCE_JSON = path.join(ROOT, "design", "templates", "wisp-draft-plan-source.json");
const OFFICIAL_PDF_PATH = path.join(ROOT, "design", "templates", "wisp-draft-plan-source.pdf");
const OFFICIAL_PREVIEW_SCRIPT = path.join(ROOT, "scripts", "build_irs_official_preview.py");
const PYTHON_CANDIDATES = [
  process.env.WISP_PYTHON_PATH,
  "C:\Users\Kilometre Morales\AppData\Local\Python\bin\python.exe",
  "C:\Users\Kilometre Morales\AppData\Local\Python\bin\python3.exe",
  "C:\Windows\py.exe",
].filter(Boolean);
const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

function signatureFontDataUrl(fileName) {
  try {
    return "data:font/ttf;base64," + readFileSync(path.join(ROOT, "assets", "fonts", fileName)).toString("base64");
  } catch {
    return "";
  }
}

const SIGNATURE_FONT_DATA_URLS = {
  handwritten: signatureFontDataUrl("signature-handwritten.ttf"),
  classic: signatureFontDataUrl("signature-classic.ttf"),
  elegant: signatureFontDataUrl("signature-elegant.ttf"),
  casual: signatureFontDataUrl("signature-casual.ttf"),
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload));
}

function sanitizeSlug(value) {
  return String(value || "wisp")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "wisp";
}

function payloadToMergeData(payload) {
  return {
    ...(payload?.mergeFields || {}),
    ...(payload?.blocks || {}),
  };
}

function findChromeExecutable() {
  return CHROME_CANDIDATES.find((candidate) => existsSync(candidate)) || "";
}

function findPythonExecutable() {
  return PYTHON_CANDIDATES.find((candidate) => existsSync(candidate)) || "python";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizePreviewForDirectPdf(preview) {
  const sanitizeText = (value) => String(value || "")
    .replace(/\uFEFF/g, "")
    .replace(/\uFFFD/g, "")
    .replace(/[\u2018\u2019\u2032]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2022\u25AA\u25CF\u25E6]/g, "-")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const pages = Array.isArray(preview?.pages)
    ? preview.pages.map((page) => ({
        ...page,
        title: sanitizeText(page?.title || ""),
        blocks: Array.isArray(page?.blocks)
          ? page.blocks.map((block) => ({
              ...block,
              text: sanitizeText(block?.text || ""),
            }))
          : [],
      }))
    : [];

  return {
    ...preview,
    firmName: sanitizeText(preview?.firmName || ""),
    pages,
  };
}

function buildPreviewHtml(preview) {
  const pages = Array.isArray(preview?.pages) ? preview.pages : [];
  const totalPages = pages.length || 1;
  const coverPage = pages.find((page) => page?.isCover);
  const coverBlocks = Array.isArray(coverPage?.blocks) ? coverPage.blocks : [];
  const firmName = escapeHtml(
    coverBlocks.find((block) => block?.kind === "cover-firm")?.text
      || preview?.firmName
      || "Your Firm"
  );
  const reviewLabel = escapeHtml(
    coverBlocks.find((block) => block?.kind === "cover-footer")?.text
      || "Last updated recently"
  );

  const pageMarkup = pages.map((page, pageIndex) => {
    const blocks = Array.isArray(page?.blocks) ? page.blocks : [];
    const layoutClass = page?.layout ? `layout-${String(page.layout).replace(/[^a-z0-9-]/gi, "-").toLowerCase()}` : "";
    const pageTitleRaw = String(page?.title || `Page ${pageIndex + 1}`).trim();
    const pageTitle = escapeHtml(pageTitleRaw);
    const isCover = Boolean(page?.isCover);
    const pageCategory = layoutClass.includes("attachment")
      ? "Appendix"
      : layoutClass.includes("reference")
        ? "Reference"
        : layoutClass.includes("guide")
          ? "Implementation Guide"
          : "Policy Section";
    let html = "";
    let listItems = [];
    let activeListType = "ul";
    let skippedMirroredHeading = false;
    const flushList = () => {
      if (!listItems.length) return;
      const tag = activeListType === "ol" ? "ol" : "ul";
      const listClass = activeListType === "ol" ? "docx-list is-ordered" : "docx-list";
      html += `<${tag} class="${listClass}">${listItems.join("")}</${tag}>`;
      listItems = [];
      activeListType = "ul";
    };

    for (const block of blocks) {
      const rawText = block?.text || "";
      const trimmedText = rawText.trim();
      const text = escapeHtml(rawText);
      if (!text) continue;
      if (!isCover && !skippedMirroredHeading && block?.kind === "section-heading" && trimmedText === pageTitleRaw) {
        skippedMirroredHeading = true;
        continue;
      }
      if (block?.kind === "list") {
        const blockListType = block?.listType === "ol" ? "ol" : "ul";
        if (listItems.length && activeListType !== blockListType) flushList();
        activeListType = blockListType;
        listItems.push(`<li>${text}</li>`);
        continue;
      }
      flushList();
      if (block?.kind === "cover-title") html += `<h1 class="cover-title">${text}</h1>`;
      else if (block?.kind === "cover-bridge") html += `<p class="cover-bridge">${text}</p>`;
      else if (block?.kind === "cover-firm") html += `<p class="cover-firm">${text}</p>`;
      else if (block?.kind === "cover-note") html += `<p class="cover-note">${text}</p>`;
      else if (block?.kind === "cover-footer") html += `<p class="cover-footer">${text}</p>`;
      else if (block?.kind === "paragraph" && trimmedText === "Written Information Security Plan (WISP)") html += `<p class="docx-overline">${text}</p>`;
      else if (block?.kind === "section-heading") html += `<h2 class="docx-heading">${text}</h2>`;
      else if (block?.kind === "subheading") html += `<h3 class="docx-subheading">${text}</h3>`;
      else if (block?.kind === "signature") html += `<p class="docx-signature">${text}</p>`;
      else if (block?.kind === "centered") html += `<p class="docx-centered">${text}</p>`;
      else html += `<p class="docx-paragraph">${text}</p>`;
    }
    flushList();

    const footer = isCover
      ? ""
      : `
        <footer class="page-footer">
          <span>${pageCategory}</span>
          <span>Written Information Security Plan</span>
          <strong>${pageIndex + 1} / ${totalPages}</strong>
        </footer>
      `;

    return `
      <section class="pdf-page ${isCover ? "is-cover" : ""} ${layoutClass}" data-page="${pageIndex + 1}">
        <div class="page-frame ${layoutClass}">
          ${isCover ? `
            <div class="cover-shell">
              <div class="cover-topbar"></div>
              <div class="cover-body">
                ${html}
              </div>
              <div class="cover-meta-row">
                <div>
                  <label>Prepared for</label>
                  <strong>${firmName}</strong>
                </div>
                <div>
                  <label>Document</label>
                  <strong>Enterprise WISP</strong>
                </div>
                <div>
                  <label>Status</label>
                  <strong>${reviewLabel}</strong>
                </div>
              </div>
            </div>
          ` : `
            <header class="page-header">
              <div class="page-header-copy">
                <p class="page-kicker">${pageCategory}</p>
                <div class="page-title-line">${pageTitle}</div>
              </div>
              <div class="page-header-meta">
                <span class="page-header-firm">${firmName}</span>
                <strong>${pageIndex + 1} / ${totalPages}</strong>
              </div>
            </header>
            <div class="page-accent"></div>
            <div class="page-content">
              ${html}
            </div>
            ${footer}
          `}
        </div>
      </section>
    `;
  }).join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>WISP Preview PDF</title>
  <style>
    @page { size: Letter; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; font-family: Corbel, "Segoe UI", Arial, sans-serif; color: #24364a; }
    .pdf-page { width: 8.5in; height: 11in; padding: 0; margin: 0 auto; page-break-after: always; break-after: page; overflow: hidden; background: #ffffff; }
    .pdf-page:last-child { page-break-after: auto; break-after: auto; }
    .page-frame { position: relative; width: 100%; height: 11in; border: 0; border-radius: 0; background: #ffffff; overflow: hidden; }
    .cover-shell { position: relative; width: 100%; height: 100%; padding: 0.46in 0.62in 0.42in 0.62in; background: #ffffff; }
    .cover-topbar { height: 0.22in; margin: -0.46in -0.62in 0.52in; background: #153f6d; }
    .cover-body { display: flex; min-height: 7.35in; flex-direction: column; align-items: center; justify-content: flex-start; }
    .cover-title { margin: 0.46in 0 0; color: #10283f; font-family: Cambria, Georgia, serif; font-size: 33px; line-height: 1.14; text-align: center; max-width: 5.3in; }
    .cover-bridge { margin: 0.58in 0 0; color: #5f6f7f; font-size: 11px; font-weight: 700; letter-spacing: 0.26em; text-align: center; text-transform: uppercase; }
    .cover-firm { margin: 0.18in 0 auto; color: #122b43; font-family: Cambria, Georgia, serif; font-size: 31px; line-height: 1.14; text-align: center; max-width: 5.1in; }
    .cover-note, .cover-footer { margin: 0; color: #617488; font-size: 10.5px; line-height: 1.5; text-align: center; max-width: 5.3in; }
    .cover-footer { margin-top: 0.14in; font-weight: 700; letter-spacing: 0.01em; }
    .cover-meta-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding-top: 0.2in; border-top: 1px solid #dbe3ea; }
    .cover-meta-row div { display: flex; flex-direction: column; gap: 5px; text-align: center; }
    .cover-meta-row label { color: #6b7d8f; font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
    .cover-meta-row strong { color: #162d43; font-size: 12px; font-weight: 700; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; padding: 0.34in 0.52in 0.1in; }
    .page-kicker { margin: 0 0 4px; color: #6c7d8e; font-size: 9px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; }
    .page-title-line { color: #10283f; font-family: Cambria, Georgia, serif; font-size: 23px; line-height: 1.1; font-weight: 700; }
    .page-header-meta { display: flex; min-width: 1.3in; flex-direction: column; align-items: flex-end; gap: 7px; color: #6c7d8e; }
    .page-header-firm { max-width: 2.1in; font-size: 10.5px; line-height: 1.35; font-weight: 600; text-align: right; }
    .page-header-meta strong { display: inline-flex; align-items: center; justify-content: center; min-width: 0.82in; padding: 6px 10px; border: 1px solid #d8e0e7; border-radius: 0; background: #ffffff; color: #20364b; font-size: 11.5px; }
    .page-accent { height: 0.22in; margin: 0 0 0.2in; background: #153f6d; }
    .page-content { padding: 0.1in 0.53in 0.64in; color: #24364a; }
    .docx-overline { margin: 0 0 11px; color: #6b7d8f; font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }
    .docx-heading { margin: 0 0 12px; color: #123f69; font-family: Cambria, Georgia, serif; font-size: 18px; line-height: 1.12; font-weight: 700; }
    .docx-subheading { margin: 16px 0 8px; color: #1f3349; font-size: 12.8px; line-height: 1.24; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    .docx-paragraph, .docx-centered, .docx-signature { margin: 0 0 9px; color: #26384b; font-size: 12.6px; line-height: 1.42; }
    .docx-centered { text-align: center; }
    .docx-signature { margin-top: 13px; font-weight: 700; }
    .docx-list { margin: 0 0 10px 22px; padding: 0; color: #26384b; }
    .docx-list li { margin: 0 0 5px; font-size: 12.6px; line-height: 1.38; }
    .docx-list.is-ordered { list-style-type: upper-alpha; margin-left: 21px; }
    .docx-list.is-ordered li::marker { color: #123f69; font-weight: 700; }
    .page-footer { position: absolute; left: 0.53in; right: 0.53in; bottom: 0.19in; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 0.12in; border-top: 0; color: #6c7d8e; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
  </style>
</head>
<body>${pageMarkup}</body>
</html>`;
}


function buildDownloadPreviewHtml(preview, signatures = []) {
  const pages = Array.isArray(preview?.pages) ? preview.pages : [];
  const coverPage = pages.find((page) => page?.isCover) || null;
  const signaturePage = pages.find((page) => !page?.isCover && (page?.layout === "irs-signature-body" || String(page?.title || "").trim() === "Signatures")) || null;
  const narrativePages = pages.filter((page) => !page?.isCover && page !== signaturePage);

  const renderCoverBlocks = (page) => {
    const blocks = Array.isArray(page?.blocks) ? page.blocks : [];
    return blocks.map((block) => {
      const text = escapeHtml(block?.text || "");
      if (!text) return "";
      if (block?.kind === "cover-footer") return "";
      if (block?.kind === "cover-title") return `<h1 class="export-docx-cover-title">${text}</h1>`;
      if (block?.kind === "cover-bridge") return `<p class="export-docx-cover-bridge">${text}</p>`;
      if (block?.kind === "cover-firm") return `<p class="export-docx-cover-firm">${text}</p>`;
      if (block?.kind === "cover-note") return `<p class="export-docx-cover-note">${text}</p>`;
      return `<p class="export-docx-cover-note">${text}</p>`;
    }).join("");
  };

  const renderBodyBlocks = (sourcePages) => {
    let html = "";
    let listItems = [];
    let activeListType = "ul";
    let renderedOverline = false;

    const flushList = () => {
      if (!listItems.length) return;
      const tag = activeListType === "ol" ? "ol" : "ul";
      const listClass = activeListType === "ol" ? "export-docx-list is-ordered" : "export-docx-list";
      html += `<${tag} class="${listClass}">${listItems.join("")}</${tag}>`;
      listItems = [];
      activeListType = "ul";
    };

    for (const page of sourcePages) {
      const blocks = Array.isArray(page?.blocks) ? page.blocks : [];
      const pageTitleRaw = String(page?.title || "").trim();
      let skippedMirroredHeading = false;

      for (const block of blocks) {
        const rawText = String(block?.text || "");
        const trimmedText = rawText.trim();
        const text = escapeHtml(rawText);
        if (!text && block?.kind !== "signature-section") continue;

        if (!skippedMirroredHeading && block?.kind === "section-heading" && trimmedText === pageTitleRaw) {
          skippedMirroredHeading = true;
          continue;
        }

        if (block?.kind === "paragraph" && trimmedText === "Written Information Security Plan (WISP)") {
          if (renderedOverline) continue;
          renderedOverline = true;
          flushList();
          html += `<p class="export-docx-overline">${text}</p>`;
          continue;
        }

        if (block?.kind === "list") {
          const blockListType = block?.listType === "ol" ? "ol" : "ul";
          if (listItems.length && activeListType !== blockListType) flushList();
          activeListType = blockListType;
          listItems.push(`<li>${text}</li>`);
          continue;
        }

        flushList();
        if (block?.kind === "section-heading") html += `<h2 class="export-docx-heading">${text}</h2>`;
        else if (block?.kind === "subheading") html += `<h3 class="export-docx-subheading">${text}</h3>`;
        else if (block?.kind === "signature") html += `<p class="export-docx-signature">${text}</p>`;
        else if (block?.kind === "signature-section") {
          const name = escapeHtml(block?.name || "");
          const title = escapeHtml(block?.title || "");
          html += `
            <section class="export-signature-section">
              <div class="export-signature-line"></div>
              <p class="export-signature-name">${name}</p>
              <p class="export-signature-title">${title}</p>
            </section>
          `;
        }
        else if (block?.kind === "resource-link") {
          const href = String(block?.href || "").trim();
          const safeHref = escapeHtml(href);
          html += href
            ? `<p class="export-docx-resource-link"><a href="${safeHref}">${text}</a></p>`
            : `<p class="export-docx-resource-link">${text}</p>`;
        }
        else if (block?.kind === "centered") html += `<p class="export-docx-centered">${text}</p>`;
        else html += `<p class="export-docx-paragraph">${text}</p>`;
      }
    }

    flushList();
    return html;
  };

  const renderSignatureMarkup = (page) => {
    if (!page) return "";
    const blocks = Array.isArray(page?.blocks) ? page.blocks : [];
    const sections = blocks.filter((block) => block?.kind === "signature-section");
    if (!sections.length) return "";
    const saved = Array.isArray(signatures) ? signatures : [];
    const items = sections.map((block) => {
      const name = escapeHtml(block?.name || "");
      const titleText = String(block?.title || "");
      const title = escapeHtml(titleText);
      const signature = saved.find((entry) => {
        const role = String(entry?.signer_role || "");
        return role === titleText || (role === "Principal Operating Officer" && titleText.includes("Principal Operating Officer"));
      });
      let mark = "";
      if (signature?.signature_method === "draw" && String(signature.signature_data || "").startsWith("data:image/")) {
        mark = `<img class="export-signature-image" src="${escapeHtml(signature.signature_data)}" alt="Signed by ${name}" />`;
      } else if (signature?.signature_data) {
        const font = ["caveat", "sacramento", "dancing", "segoe", "formal"].includes(String(signature.signature_font || "")) ? String(signature.signature_font) : "caveat";
        mark = `<span class="export-signature-typed export-signature-font-${font}">${escapeHtml(signature.signature_data)}</span>`;
      }
      return `
        <section class="export-signature-section">
          <div class="export-signature-line">${mark}</div>
          <p class="export-signature-name">${name}</p>
          <p class="export-signature-title">${title}</p>
        </section>
      `;
    }).join("");
    return `
      <section class="export-signature-block">
        <h2 class="export-docx-heading">Signatures</h2>
        ${items}
      </section>
    `;
  };

  const coverMarkup = coverPage ? `
    <section class="export-cover-page">
      <article class="export-cover-paper">
        <div class="export-cover-band"></div>
        <div class="export-cover-sheet">
          ${renderCoverBlocks(coverPage)}
        </div>
      </article>
    </section>
  ` : "";

  const bodyMarkup = `
    <section class="export-flow-document">
      <div class="export-flow-band" aria-hidden="true"></div>
      <article class="export-flow-sheet">
        ${renderBodyBlocks(narrativePages)}
        ${renderSignatureMarkup(signaturePage)}
      </article>
    </section>
  `;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>WISP Review PDF</title>
  <style>
    @page { size: Letter; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #ffffff; }
    body { color: #1d2e42; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; }
    .export-cover-page { page-break-after: always; break-after: page; }
    .export-cover-paper { min-height: 11in; border: 0; border-radius: 0; overflow: hidden; background: #ffffff; }
    .export-cover-band { height: 0.42in; background: #153f6d; }
    .export-cover-sheet { position: relative; height: calc(11in - 0.42in); padding: 0.6in 0.62in 0.54in; display: flex; flex-direction: column; }
    .export-docx-cover-title { margin: 0.12in 0 0; color: #10253a; font-family: Cambria, Georgia, serif; font-size: 27px; line-height: 1.14; text-align: center; }
    .export-docx-cover-bridge { margin: 0.24in 0 0; color: #5f6f7f; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; text-align: center; text-transform: uppercase; }
    .export-docx-cover-firm { margin: 0.12in 0 0.26in; color: #122b43; font-family: Cambria, Georgia, serif; font-size: 27px; line-height: 1.1; text-align: center; }
    .export-docx-cover-note, .export-docx-cover-footer { margin: 0 0 8px; color: #617488; font-size: 10px; line-height: 1.4; text-align: center; }
    .export-docx-cover-footer { margin-top: 8px; margin-bottom: 0; font-weight: 700; }

    .export-flow-document { position: relative; page-break-before: avoid; break-before: avoid-page; }
    .export-flow-band { display: none; }
    .export-flow-sheet {
      position: relative;
      color: #24364a;
      padding: 0.68in 0.18in 0.3in;
      border: 0;
      border-radius: 0;
      background: linear-gradient(90deg, #153f6d 0%, #153f6d 100%) top / 100% 0.42in no-repeat, #ffffff;
      -webkit-box-decoration-break: clone;
      box-decoration-break: clone;
      overflow: visible;
    }

    .export-docx-overline { margin: 0 0 11px; color: #6b7d8f; font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }
    .export-docx-heading { margin: 16px 0 10px; color: #004a97; font-family: Cambria, Georgia, serif; font-size: 18px; line-height: 1.12; font-weight: 700; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 8px; break-after: avoid; }
    .export-docx-subheading { margin: 14px 0 8px; color: #004a97; font-size: 13px; line-height: 1.24; font-weight: 700; break-after: avoid; }
    .export-docx-paragraph, .export-docx-centered, .export-docx-signature { margin: 0 0 7px; color: #26384b; font-size: 11.15px; line-height: 1.32; }
    .export-docx-centered { text-align: center; }
    .export-docx-signature { margin-top: 13px; font-weight: 700; }
    .export-docx-resource-link { margin: 0 0 7px; color: #1f4f86; font-size: 11.15px; line-height: 1.32; }
    .export-docx-resource-link a { color: #1f4f86; text-decoration: underline; }
    .export-docx-list { margin: 0 0 9px 18px; padding: 0; color: #26384b; }
    .export-docx-list li { margin: 0 0 5px; font-size: 11.25px; line-height: 1.32; }
    .export-docx-list.is-ordered { list-style-type: upper-alpha; margin-left: 21px; }
    .export-docx-list.is-ordered li::marker { color: #123f69; font-weight: 700; }
    .export-signature-block { margin: 16px 0 0; padding: 0; }
    .export-signature-block .export-docx-heading { margin: 0 0 12px; font-size: 18px; }
    .export-signature-section { width: 3.7in; max-width: 100%; margin: 0 0 16px; break-inside: avoid; page-break-inside: avoid; }
    .export-signature-line { display: flex; align-items: flex-end; width: 100%; height: 0.55in; border-bottom: 1px solid #5a7085; }
    .export-signature-image { display: block; width: auto; max-width: 2.25in; height: auto; max-height: 0.5in; object-fit: contain; object-position: left bottom; }
    @font-face { font-family: "EasyWisp Handwritten"; src: url("${SIGNATURE_FONT_DATA_URLS.handwritten}") format("truetype"); }
    @font-face { font-family: "EasyWisp Classic"; src: url("${SIGNATURE_FONT_DATA_URLS.classic}") format("truetype"); }
    @font-face { font-family: "EasyWisp Elegant"; src: url("${SIGNATURE_FONT_DATA_URLS.elegant}") format("truetype"); }
    @font-face { font-family: "EasyWisp Casual"; src: url("${SIGNATURE_FONT_DATA_URLS.casual}") format("truetype"); }
    .export-signature-typed { display: block; padding: 0 0 1px 8px; color: #111; font-size: 23px; line-height: 1; }
    .export-signature-font-caveat { font-family: "EasyWisp Handwritten", cursive; }
    .export-signature-font-sacramento { font-family: "EasyWisp Classic", cursive; }
    .export-signature-font-dancing { font-family: "EasyWisp Elegant", cursive; }
    .export-signature-font-segoe { font-family: "EasyWisp Casual", cursive; }
    .export-signature-font-formal { font-family: Georgia, "Times New Roman", serif; font-style: italic; }
    .export-signature-name { margin: 5px 0 2px; color: #10253a; font-size: 12.2px; font-weight: 700; }
    .export-signature-title { margin: 0; color: #4d6176; font-size: 11.2px; }
  </style>
</head>
<body>${coverMarkup}${bodyMarkup}</body>
</html>`;
}

function runMerge(payload) {
  if (!existsSync(TEMPLATE_PATH)) throw new Error(`Template not found: ${TEMPLATE_PATH}`);
  if (!existsSync(MERGE_SCRIPT)) throw new Error(`Merge script not found: ${MERGE_SCRIPT}`);

  const tempDir = mkdtempSync(path.join(tmpdir(), "wisp-merge-"));
  const mergeJsonPath = path.join(tempDir, "merge-payload.json");
  const slug = sanitizeSlug(payload?.mergeFields?.companyName);
  const outputPath = path.join(tempDir, `${slug}-merged.docx`);
  writeFileSync(mergeJsonPath, JSON.stringify(payloadToMergeData(payload), null, 2), "utf8");

  return new Promise((resolve, reject) => {
    const child = spawn(findPythonExecutable(), [MERGE_SCRIPT, TEMPLATE_PATH, outputPath, mergeJsonPath], {
      cwd: ROOT,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", (error) => {
      try { rmSync(tempDir, { recursive: true, force: true }); } catch {}
      reject(error);
    });
    child.on("close", (code) => {
      try {
        if (code !== 0) {
          throw new Error(stderr.trim() || stdout.trim() || `merge exited with code ${code}`);
        }
        const buffer = readFileSync(outputPath);
        resolve({
          buffer,
          fileName: path.basename(outputPath),
          outputPath,
          tempDir,
          slug,
        });
      } catch (error) {
        try { rmSync(tempDir, { recursive: true, force: true }); } catch {}
        reject(error);
      }
    });
  });
}

function runPreview(docxPath) {
  if (!existsSync(PREVIEW_SCRIPT)) throw new Error(`Preview script not found: ${PREVIEW_SCRIPT}`);

  return new Promise((resolve, reject) => {
    const child = spawn(findPythonExecutable(), [PREVIEW_SCRIPT, docxPath], {
      cwd: ROOT,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || stdout.trim() || `preview exited with code ${code}`));
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function runOfficialPreview(payload) {
  if (!existsSync(OFFICIAL_SOURCE_JSON)) throw new Error(`Official IRS source not found: ${OFFICIAL_SOURCE_JSON}`);
  if (!existsSync(OFFICIAL_PREVIEW_SCRIPT)) throw new Error(`Official preview script not found: ${OFFICIAL_PREVIEW_SCRIPT}`);

  const tempDir = mkdtempSync(path.join(tmpdir(), "wisp-official-preview-"));
  const payloadPath = path.join(tempDir, "official-preview-payload.json");
  writeFileSync(payloadPath, JSON.stringify(payload, null, 2), "utf8");

  return new Promise((resolve, reject) => {
    const child = spawn(findPythonExecutable(), [OFFICIAL_PREVIEW_SCRIPT, OFFICIAL_SOURCE_JSON, payloadPath], {
      cwd: ROOT,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", (error) => {
      try { rmSync(tempDir, { recursive: true, force: true }); } catch {}
      reject(error);
    });
    child.on("close", (code) => {
      try {
        if (code !== 0) {
          throw new Error(stderr.trim() || stdout.trim() || `official preview exited with code ${code}`);
        }
        resolve({
          preview: JSON.parse(stdout),
          tempDir,
        });
      } catch (error) {
        try { rmSync(tempDir, { recursive: true, force: true }); } catch {}
        reject(error);
      }
    });
  });
}

function renderPdfBuffer(preview, tempDir, slug, signatures = []) {
  const chromePath = findChromeExecutable();
  if (!chromePath) return Promise.resolve(null);

  const htmlPath = path.join(tempDir, `${slug}-preview.html`);
  const pdfPath = path.join(tempDir, `${slug}-preview.pdf`);
  writeFileSync(htmlPath, buildDownloadPreviewHtml(preview, signatures), "utf8");

  return new Promise((resolve, reject) => {
    const child = spawn(chromePath, [
      "--headless=new",
      "--disable-gpu",
      "--allow-file-access-from-files",
      "--print-to-pdf-no-header",
      `--print-to-pdf=${pdfPath}`,
      pathToFileURL(htmlPath).href,
    ], {
      cwd: ROOT,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || stdout.trim() || `pdf conversion exited with code ${code}`));
        return;
      }
      if (!existsSync(pdfPath)) {
        reject(new Error("PDF output was not created by Chrome."));
        return;
      }
      resolve(readFileSync(pdfPath));
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (!req.url) return sendJson(res, 404, { error: "Missing URL" });

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  if (req.method === "GET" && req.url === "/health") {
    return sendJson(res, 200, {
      ok: true,
      service: "wisp-merge-service",
      templatePath: TEMPLATE_PATH,
      mergeScript: MERGE_SCRIPT,
      previewScript: PREVIEW_SCRIPT,
      officialSourceJson: OFFICIAL_SOURCE_JSON,
      officialPreviewScript: OFFICIAL_PREVIEW_SCRIPT,
      officialPdfPath: OFFICIAL_PDF_PATH,
      chromePath: findChromeExecutable(),
    });
  }

  if (req.method === "POST" && req.url === "/merge") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) req.destroy(new Error("Payload too large"));
    });
    req.on("error", (error) => sendJson(res, 400, { error: error.message }));
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        const result = await runMerge(payload);
        res.writeHead(200, {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${result.fileName}"`,
          "Access-Control-Allow-Origin": "*",
        });
        res.end(result.buffer, () => {
          try { rmSync(result.tempDir, { recursive: true, force: true }); } catch {}
        });
      } catch (error) {
        sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
      }
    });
    return;
  }

  if (req.method === "POST" && req.url === "/merge-preview") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) req.destroy(new Error("Payload too large"));
    });
    req.on("error", (error) => sendJson(res, 400, { error: error.message }));
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        const result = await runMerge(payload);
        let preview = null;
        let previewTempDir = "";
        try {
          const officialPreview = await runOfficialPreview(payload);
          preview = officialPreview.preview;
          previewTempDir = officialPreview.tempDir;
        } catch (error) {
          throw new Error(`Official WISP PDF preview failed: ${error instanceof Error ? error.message : String(error)}`);
        }
        let pdfBase64 = "";
        let pdfRenderer = "";
        try {
          const renderedPdf = await renderPdfBuffer(preview, result.tempDir, result.slug, Array.isArray(payload?.signatures) ? payload.signatures : []);
          if (renderedPdf) {
            pdfBase64 = renderedPdf.toString("base64");
            pdfRenderer = "structured-preview";
          }
        } catch (error) {
          console.warn("Structured preview PDF build failed", error);
        }
        sendJson(res, 200, {
          ok: true,
          fileName: result.fileName,
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          docxBase64: result.buffer.toString("base64"),
          pdfFileName: `${result.slug}-preview.pdf`,
          pdfBase64,
          pdfRenderer,
          ...preview,
        });
        try { if (previewTempDir) rmSync(previewTempDir, { recursive: true, force: true }); } catch {}
        try { rmSync(result.tempDir, { recursive: true, force: true }); } catch {}
      } catch (error) {
        sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
      }
    });
    return;
  }

  return sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, HOST, () => {
  console.log(`wisp merge service listening on http://${HOST}:${PORT}`);
});
