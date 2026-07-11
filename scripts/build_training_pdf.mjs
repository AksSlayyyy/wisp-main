import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const NAVY = rgb(18 / 255, 52 / 255, 86 / 255);
const BLUE = rgb(29 / 255, 78 / 255, 137 / 255);
const SKY = rgb(233 / 255, 241 / 255, 249 / 255);
const SLATE = rgb(74 / 255, 85 / 255, 104 / 255);
const TEXT = rgb(27 / 255, 31 / 255, 38 / 255);
const MUTED = rgb(100 / 255, 116 / 255, 139 / 255);
const WHITE = rgb(1, 1, 1);

const PAGE = { width: 960, height: 540 };
const MARGIN_X = 56;
const TOP = 48;
const BOTTOM = 42;
const CONTENT_WIDTH = PAGE.width - MARGIN_X * 2;

function themeConfig(meta = {}) {
  const theme = String(meta.theme || "default").toLowerCase();
  if (theme === "alert") {
    return {
      name: "alert",
      navy: rgb(36 / 255, 41 / 255, 46 / 255),
      blue: rgb(156 / 255, 74 / 255, 28 / 255),
      sky: rgb(248 / 255, 240 / 255, 232 / 255),
      slate: rgb(92 / 255, 80 / 255, 70 / 255),
      text: rgb(35 / 255, 31 / 255, 28 / 255),
      muted: rgb(116 / 255, 101 / 255, 90 / 255),
      white: rgb(1, 1, 1),
      border: rgb(230 / 255, 220 / 255, 210 / 255),
      lightBorder: rgb(238 / 255, 230 / 255, 221 / 255),
      panel: rgb(253 / 255, 248 / 255, 243 / 255),
      coverBandHeight: 110,
      topBarHeight: 28,
      bottomBarHeight: 10
    };
  }
  if (theme === "signal") {
    return {
      name: "signal",
      navy: rgb(15 / 255, 48 / 255, 72 / 255),
      blue: rgb(10 / 255, 138 / 255, 122 / 255),
      sky: rgb(232 / 255, 247 / 255, 245 / 255),
      slate: rgb(66 / 255, 86 / 255, 97 / 255),
      text: rgb(24 / 255, 37 / 255, 46 / 255),
      muted: rgb(88 / 255, 111 / 255, 122 / 255),
      white: rgb(1, 1, 1),
      border: rgb(204 / 255, 231 / 255, 227 / 255),
      lightBorder: rgb(220 / 255, 239 / 255, 236 / 255),
      panel: rgb(240 / 255, 251 / 255, 249 / 255),
      coverBandHeight: 96,
      topBarHeight: 30,
      bottomBarHeight: 8
    };
  }
  if (theme === "midnight") {
    return {
      name: "midnight",
      navy: rgb(24 / 255, 33 / 255, 49 / 255),
      blue: rgb(60 / 255, 108 / 255, 166 / 255),
      sky: rgb(239 / 255, 243 / 255, 249 / 255),
      slate: rgb(83 / 255, 94 / 255, 111 / 255),
      text: rgb(32 / 255, 39 / 255, 53 / 255),
      muted: rgb(102 / 255, 112 / 255, 128 / 255),
      white: rgb(1, 1, 1),
      border: rgb(217 / 255, 224 / 255, 234 / 255),
      lightBorder: rgb(228 / 255, 234 / 255, 242 / 255),
      panel: rgb(245 / 255, 247 / 255, 251 / 255),
      coverBandHeight: 92,
      topBarHeight: 30,
      bottomBarHeight: 8
    };
  }
  return {
    name: "default",
    navy: NAVY,
    blue: BLUE,
    sky: SKY,
    slate: SLATE,
    text: TEXT,
    muted: MUTED,
    white: WHITE,
    border: rgb(214 / 255, 223 / 255, 232 / 255),
    lightBorder: rgb(220 / 255, 227 / 255, 235 / 255),
    panel: SKY,
    coverBandHeight: 86,
    topBarHeight: 36,
    bottomBarHeight: 8
  };
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\u2019/g, "'")
    .replace(/\u2018/g, "'")
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"')
    .replace(/\u2013/g, "-")
    .replace(/\u2014/g, "-")
    .replace(/\u00a0/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function wrapText(text, font, size, maxWidth) {
  const normalized = normalizeText(text);
  if (!normalized) return [""];
  const paragraphs = normalized.split("\n");
  const lines = [];
  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push("");
      continue;
    }
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
  }
  return lines;
}

function drawPageChrome(page, pageNumber, totalPages, theme) {
  page.drawRectangle({ x: 0, y: PAGE.height - theme.topBarHeight, width: PAGE.width, height: theme.topBarHeight, color: theme.navy });
  page.drawRectangle({ x: 0, y: 0, width: PAGE.width, height: theme.bottomBarHeight, color: theme.navy });
  if (theme.name === "alert") {
    page.drawRectangle({ x: 0, y: PAGE.height - theme.topBarHeight, width: 18, height: PAGE.height - theme.topBarHeight, color: theme.blue });
  }
  if (theme.name === "signal") {
    page.drawRectangle({ x: PAGE.width - 14, y: PAGE.height - theme.topBarHeight, width: 14, height: PAGE.height - theme.topBarHeight, color: theme.blue });
  }
  if (theme.name === "midnight") {
    page.drawRectangle({ x: PAGE.width - 10, y: PAGE.height - theme.topBarHeight, width: 10, height: PAGE.height - theme.topBarHeight, color: theme.blue });
  }
  page.drawText(`${pageNumber} / ${totalPages}`, {
    x: PAGE.width - 76,
    y: 18,
    size: 9,
    color: theme.muted
  });
}

function drawEyebrow(page, fonts, text, y, theme) {
  if (!text) return y;
  page.drawText(normalizeText(text).toUpperCase(), {
    x: MARGIN_X,
    y,
    size: 10,
    font: fonts.bold,
    color: theme.blue
  });
  return y - 22;
}

function drawTitle(page, fonts, text, y, theme, maxWidth = CONTENT_WIDTH) {
  const lines = wrapText(text, fonts.bold, 24, maxWidth);
  let cursor = y;
  for (const line of lines) {
    page.drawText(line, { x: MARGIN_X, y: cursor, size: 24, font: fonts.bold, color: theme.navy });
    cursor -= 28;
  }
  return cursor - 4;
}

function drawParagraph(page, fonts, text, x, y, width, size = 13, color = TEXT, lineHeight = null) {
  const actualLineHeight = lineHeight || size * 1.45;
  const lines = wrapText(text, fonts.regular, size, width);
  let cursor = y;
  for (const line of lines) {
    page.drawText(line, { x, y: cursor, size, font: fonts.regular, color });
    cursor -= actualLineHeight;
  }
  return cursor;
}

function drawBulletList(page, fonts, bullets, x, y, width, theme, options = {}) {
  const size = options.size || 13;
  const bulletGap = options.bulletGap || 18;
  const lineHeight = options.lineHeight || size * 1.42;
  const itemGap = options.itemGap || 8;
  let cursor = y;
  for (const bullet of bullets || []) {
    const lines = wrapText(bullet, fonts.regular, size, width - bulletGap);
    if (!lines.length) continue;
    page.drawCircle({ x: x + 5, y: cursor + size * 0.38, size: 2.2, color: theme.blue });
    page.drawText(lines[0], { x: x + bulletGap, y: cursor, size, font: fonts.regular, color: theme.text });
    cursor -= lineHeight;
    for (let i = 1; i < lines.length; i += 1) {
      page.drawText(lines[i], { x: x + bulletGap, y: cursor, size, font: fonts.regular, color: theme.text });
      cursor -= lineHeight;
    }
    cursor -= itemGap;
  }
  return cursor;
}

function drawChecklist(page, fonts, items, x, y, width, theme) {
  let cursor = y;
  for (const item of items || []) {
    page.drawRectangle({
      x,
      y: cursor - 34,
      width,
      height: 42,
      color: theme.panel,
      borderColor: theme.border,
      borderWidth: 1
    });
    page.drawRectangle({ x: x + 12, y: cursor - 21, width: 10, height: 10, borderColor: theme.blue, borderWidth: 1.6, color: theme.white });
    const lines = wrapText(item, fonts.regular, 12.5, width - 40);
    let textY = cursor - 11;
    for (const line of lines.slice(0, 2)) {
      page.drawText(line, { x: x + 32, y: textY, size: 12.5, font: fonts.regular, color: theme.text });
      textY -= 15;
    }
    cursor -= 54;
  }
  return cursor;
}

function drawSectionLabel(page, fonts, label, x, y, theme) {
  if (!label) return;
  page.drawText(normalizeText(label), { x, y, size: 15, font: fonts.bold, color: theme.navy });
}

function renderCover(page, fonts, slide, theme) {
  page.drawRectangle({ x: 0, y: 0, width: PAGE.width, height: PAGE.height, color: theme.white });
  page.drawRectangle({ x: 0, y: PAGE.height - theme.topBarHeight, width: PAGE.width, height: theme.topBarHeight, color: theme.navy });
  page.drawRectangle({ x: 0, y: PAGE.height - (theme.topBarHeight + theme.coverBandHeight), width: PAGE.width, height: theme.coverBandHeight, color: theme.sky });
  if (theme.name === "alert") {
    page.drawRectangle({ x: 0, y: 0, width: 20, height: PAGE.height, color: theme.blue });
    page.drawRectangle({ x: PAGE.width - 20, y: 0, width: 20, height: PAGE.height, color: theme.navy });
  }
  if (theme.name === "signal") {
    page.drawRectangle({ x: 0, y: 0, width: 14, height: PAGE.height, color: theme.navy });
    page.drawRectangle({ x: PAGE.width - 14, y: 0, width: 14, height: PAGE.height, color: theme.blue });
  }
  if (theme.name === "midnight") {
    page.drawRectangle({ x: 0, y: 0, width: 10, height: PAGE.height, color: theme.navy });
  }

  page.drawText(normalizeText(slide.eyebrow || "Annual Staff Training").toUpperCase(), {
    x: MARGIN_X,
    y: PAGE.height - 86,
    size: 11,
    font: fonts.bold,
    color: theme.blue
  });

  page.drawLine({
    start: { x: MARGIN_X, y: PAGE.height - 98 },
    end: { x: MARGIN_X + 170, y: PAGE.height - 98 },
    color: theme.blue,
    thickness: 1.5
  });

  const titleLines = wrapText(slide.title, fonts.bold, 30, 620);
  let titleY = PAGE.height - 228;
  for (const line of titleLines) {
    const width = fonts.bold.widthOfTextAtSize(line, 30);
    page.drawText(line, {
      x: (PAGE.width - width) / 2,
      y: titleY,
      size: 30,
      font: fonts.bold,
      color: theme.navy
    });
    titleY -= 36;
  }

  page.drawLine({
    start: { x: 300, y: titleY + 6 },
    end: { x: PAGE.width - 300, y: titleY + 6 },
    color: theme.border,
    thickness: 1
  });

  const subtitleLines = wrapText(slide.subtitle, fonts.regular, 15.5, 560);
  let subtitleY = titleY - 22;
  for (const line of subtitleLines) {
    const width = fonts.regular.widthOfTextAtSize(line, 15.5);
    page.drawText(line, {
      x: (PAGE.width - width) / 2,
      y: subtitleY,
      size: 15.5,
      font: fonts.regular,
      color: theme.slate
    });
    subtitleY -= 22;
  }

  page.drawLine({
    start: { x: MARGIN_X, y: 74 },
    end: { x: PAGE.width - MARGIN_X, y: 74 },
    color: theme.lightBorder,
    thickness: 1
  });
  page.drawText(normalizeText(slide.footerLeft || ""), {
    x: MARGIN_X,
    y: 52,
    size: 11,
    font: fonts.regular,
    color: theme.muted
  });
  const footerRight = normalizeText(slide.footerRight || "");
  const rightWidth = fonts.regular.widthOfTextAtSize(footerRight, 11);
  page.drawText(footerRight, {
    x: PAGE.width - MARGIN_X - rightWidth,
    y: 52,
    size: 11,
    font: fonts.regular,
    color: theme.muted
  });
}

function renderBullets(page, fonts, slide, pageNumber, totalPages, theme) {
  drawPageChrome(page, pageNumber, totalPages, theme);
  let y = PAGE.height - TOP - 20;
  y = drawEyebrow(page, fonts, slide.eyebrow, y, theme);
  y = drawTitle(page, fonts, slide.title, y, theme);
  if (slide.intro) {
    y = drawParagraph(page, fonts, slide.intro, MARGIN_X, y - 6, CONTENT_WIDTH, 13.2, theme.text, 18.5) - 14;
  }
  if (slide.bullets?.length) {
    drawBulletList(page, fonts, slide.bullets, MARGIN_X + 2, y, CONTENT_WIDTH - 8, theme, { size: 13, itemGap: 8 });
  }
}

function renderTwoColumn(page, fonts, slide, pageNumber, totalPages, theme) {
  drawPageChrome(page, pageNumber, totalPages, theme);
  let y = PAGE.height - TOP - 20;
  y = drawEyebrow(page, fonts, slide.eyebrow, y, theme);
  y = drawTitle(page, fonts, slide.title, y, theme);
  const colGap = 24;
  const colWidth = (CONTENT_WIDTH - colGap) / 2;
  const boxY = y - 6;
  const boxHeight = 260;
  for (let i = 0; i < 2; i += 1) {
    const x = MARGIN_X + i * (colWidth + colGap);
    page.drawRectangle({
      x,
      y: boxY - boxHeight,
      width: colWidth,
      height: boxHeight,
      color: theme.white,
      borderColor: theme.border,
      borderWidth: 1
    });
  }
  drawSectionLabel(page, fonts, slide.leftHeading, MARGIN_X + 18, boxY - 28, theme);
  drawSectionLabel(page, fonts, slide.rightHeading, MARGIN_X + colWidth + colGap + 18, boxY - 28, theme);
  drawBulletList(page, fonts, slide.leftBullets, MARGIN_X + 18, boxY - 56, colWidth - 32, theme, { size: 12.5, itemGap: 7 });
  drawBulletList(page, fonts, slide.rightBullets, MARGIN_X + colWidth + colGap + 18, boxY - 56, colWidth - 32, theme, { size: 12.5, itemGap: 7 });
}

function renderChecklist(page, fonts, slide, pageNumber, totalPages, theme) {
  drawPageChrome(page, pageNumber, totalPages, theme);
  let y = PAGE.height - TOP - 20;
  y = drawEyebrow(page, fonts, slide.eyebrow, y, theme);
  y = drawTitle(page, fonts, slide.title, y, theme);
  y = drawParagraph(page, fonts, slide.intro, MARGIN_X, y - 6, CONTENT_WIDTH, 13, theme.text, 18) - 8;
  drawChecklist(page, fonts, slide.checks, MARGIN_X, y, CONTENT_WIDTH, theme);
}

export async function buildTrainingPdf(contentPath) {
  const content = JSON.parse(readFileSync(contentPath, "utf8"));
  const outputPath = resolve(content.meta.output);
  const theme = themeConfig(content.meta || {});
  mkdirSync(dirname(outputPath), { recursive: true });

  const pdf = await PDFDocument.create();
  const fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold)
  };

  const slides = content.slides || [];
  slides.forEach((slide, index) => {
    const page = pdf.addPage([PAGE.width, PAGE.height]);
    if (slide.layout === "cover") {
      renderCover(page, fonts, slide, theme);
      return;
    }
    const pageNumber = index + 1;
    const totalPages = slides.length;
    if (slide.layout === "two-column") {
      renderTwoColumn(page, fonts, slide, pageNumber, totalPages, theme);
    } else if (slide.layout === "checklist") {
      renderChecklist(page, fonts, slide, pageNumber, totalPages, theme);
    } else {
      renderBullets(page, fonts, slide, pageNumber, totalPages, theme);
    }
  });

  writeFileSync(outputPath, await pdf.save());
  return outputPath;
}

const entryPath = process.argv[2] || resolve("design/training/easywisp-staff-training-content.json");
buildTrainingPdf(resolve(entryPath))
  .then((outputPath) => {
    console.log(`Created training PDF: ${outputPath}`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
