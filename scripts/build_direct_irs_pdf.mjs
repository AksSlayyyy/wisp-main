import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { readFileSync } from "node:fs";

const LETTER = { width: 612, height: 792 };
const BLUE = rgb(0/255, 79/255, 159/255);
const BLACK = rgb(0, 0, 0);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\uFEFF/g, "")
    .replace(/\uFFFD/g, "")
    .replace(/[\u2018\u2019\u2032]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2022\u25AA\u25CF\u25E6]/g, "-")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function blockText(block, listIndex) {
  const text = normalizeText(block?.text || "");
  if (!text) return "";
  if (block?.kind !== "list") return text;
  if (block?.listType === "ol") return `${String.fromCharCode(65 + (listIndex % 26))}. ${text}`;
  return `� ${text}`;
}

function wrapLine(text, font, size, maxWidth) {
  const words = normalizeText(text).split(" ").filter(Boolean);
  if (!words.length) return [""];
  const lines = [];
  let current = words[0];
  for (let i = 1; i < words.length; i += 1) {
    const next = `${current} ${words[i]}`;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
}

function renderBlocks(page, blocks, box, styles, fonts) {
  const pageHeight = page.getHeight();
  page.drawRectangle({
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    color: rgb(1, 1, 1),
  });

  let cursorY = pageHeight - box.top;
  let orderedIndex = 0;
  for (const block of blocks || []) {
    const style = styles[block.kind] || styles.paragraph;
    const font = style.font === "bold" ? fonts.bold : fonts.regular;
    const maxWidth = box.width - (style.indentLeft || 0) - (style.indentRight || 0);
    const lines = wrapLine(blockText(block, orderedIndex), font, style.size, maxWidth);
    const x = box.x + (style.indentLeft || 0);
    const lineHeight = style.lineHeight;
    if (block.kind === "list" && block.listType === "ol") orderedIndex += 1;
    if (block.kind !== "list") orderedIndex = 0;
    for (const line of lines) {
      if (cursorY - lineHeight < box.y + 8) return false;
      page.drawText(line, {
        x,
        y: cursorY - style.size,
        size: style.size,
        font,
        color: style.color || BLACK,
      });
      cursorY -= lineHeight;
    }
    cursorY -= style.marginAfter || 0;
  }
  return true;
}

function drawCentered(page, text, topY, size, font, color = BLACK) {
  const value = normalizeText(text);
  if (!value) return;
  const width = font.widthOfTextAtSize(value, size);
  page.drawText(value, {
    x: (page.getWidth() - width) / 2,
    y: topY - size,
    size,
    font,
    color,
  });
}

function renderCoverPage(page, previewPage, fonts) {
  page.drawRectangle({ x: 150, y: 480, width: 312, height: 70, color: rgb(1, 1, 1) });
  page.drawRectangle({ x: 110, y: 35, width: 390, height: 28, color: rgb(1, 1, 1) });
  const blocks = previewPage.blocks || [];
  const firm = blocks.find((b) => b.kind === "cover-firm")?.text || "";
  const footer = blocks.find((b) => b.kind === "cover-footer")?.text || "";
  drawCentered(page, firm, 530, 18, fonts.regular, BLACK);
  drawCentered(page, footer, 53, 7.5, fonts.regular, BLACK);
}

function bodyStyles() {
  return {
    paragraph: { size: 11.35, lineHeight: 14.1, marginAfter: 2.8, indentLeft: 0 },
    list: { size: 10.95, lineHeight: 13.75, marginAfter: 2.1, indentLeft: 20, indentRight: 4 },
    'section-heading': { size: 18.1, lineHeight: 21.2, marginAfter: 5.8, indentLeft: 0, font: 'bold', color: BLUE },
    subheading: { size: 13.1, lineHeight: 15.8, marginAfter: 3.6, indentLeft: 0, font: 'bold', color: BLUE },
    centered: { size: 11, lineHeight: 13.2, marginAfter: 2.2, indentLeft: 0 },
    signature: { size: 11.2, lineHeight: 13.6, marginAfter: 2.2, indentLeft: 0, font: 'bold' },
  };
}

function guideStyles() {
  return {
    paragraph: { size: 12.35, lineHeight: 15.6, marginAfter: 2.4, indentLeft: 0 },
    list: { size: 12.15, lineHeight: 15.0, marginAfter: 1.9, indentLeft: 15, indentRight: 4 },
    'section-heading': { size: 16.1, lineHeight: 19.3, marginAfter: 5.4, indentLeft: 0, font: 'bold', color: BLUE },
    subheading: { size: 13.25, lineHeight: 15.8, marginAfter: 2.4, indentLeft: 0, font: 'bold', color: BLUE },
  };
}

function templateBodyBox() {
  return { x: 88, y: 60, width: 430, height: 618, top: 133 };
}

function guideBodyBox() {
  return { x: 72, y: 58, width: 454, height: 628, top: 118 };
}

function resolveBox(config, previewPage) {
  if (config.box) return config.box;
  const layout = String(previewPage?.layout || "");
  if (layout.includes("irs-template") || layout.includes("irs-attachment") || layout.includes("irs-reference")) {
    return templateBodyBox();
  }
  return guideBodyBox();
}

const DYNAMIC_PAGES = new Map([
  [5, { kind: 'cover' }],
  [6, { kind: 'body' }],
  [7, { kind: 'body' }],
  [8, { kind: 'body' }],
  [9, { kind: 'body' }],
  [10, { kind: 'body' }],
  [11, { kind: 'body' }],
  [12, { kind: 'body' }],
  [22, { kind: 'body' }],
  [26, { kind: 'body' }],
  [28, { kind: 'body' }],
]);

export async function buildDirectIrsPdfBuffer(sourcePdfPath, preview) {
  const bytes = readFileSync(sourcePdfPath);
  const pdfDoc = await PDFDocument.load(bytes);
  const fonts = {
    regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
    bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
  };
  const pages = pdfDoc.getPages();
  for (const [index, config] of DYNAMIC_PAGES.entries()) {
    const page = pages[index];
    const previewPage = preview?.pages?.[index];
    if (!page || !previewPage) continue;
    if (config.kind === 'cover') {
      renderCoverPage(page, previewPage, fonts);
      continue;
    }
    const styles = previewPage.layout?.includes('guide') ? guideStyles() : bodyStyles();
    renderBlocks(page, previewPage.blocks || [], resolveBox(config, previewPage), styles, fonts);
  }
  return Buffer.from(await pdfDoc.save());
}
