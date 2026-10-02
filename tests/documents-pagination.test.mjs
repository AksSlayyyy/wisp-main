import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
test("pagination button handlers change only their own list and preserve keyboard focus", () => {
  const f = fixture();
  let click, focused = false, renders = 0;
  f.document = {
    querySelectorAll: () => [{ dataset: { documentsPageList: "uploaded", documentsPage: "1" }, addEventListener: (_, handler) => { click = handler; } }],
    querySelector: () => ({ focus: options => { focused = options.preventScroll; } }),
  };
  f.render = () => { renders++; f.documentsScreen(); };
  const handler = source.slice(source.indexOf('  document.querySelectorAll("[data-documents-page-list]")'), source.indexOf('  document.querySelectorAll("[data-remove-document]")'));
  vm.runInContext(handler, f);
  click();
  assert.equal(f.state.documentsPages.uploaded, 1);
  assert.equal(f.state.documentsPages.working, 0);
  assert.equal(renders, 1);
  assert.equal(focused, true);
});
const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const start = source.indexOf("const DOCUMENTS_PAGE_SIZE =");
const end = source.indexOf("function documentSpreadsheetColumnLabel(");
function fixture(total = 13) {
  const state = { documentsPages: { working: 0, uploaded: 0 }, documentWorkspaces: {}, terminatedEmployeeChecklists: [], specialDocumentInstances: {}, documentsFiles: [] };
  for (let i = 0; i < total; i++) {
    state.documentWorkspaces["template-" + i] = { title: "Working " + i, templateId: "template-" + i };
    state.documentsFiles.push({ name: "Upload " + i, downloadUrl: "https://example.invalid/" + i });
  }
  const context = {
    state, window: { __ENV__: { ENABLE_DOCUMENTS_REDESIGN: true } }, documentTemplates: [],
    escapeHtml: String, attr: String, dashboardHeaderControls: extra => extra,
    documentIconForItem: () => "", documentLibraryIcon: () => "",
    documentWorkspaceSummary: () => "Worksheet", documentFileSummary: file => file.name,
  };
  vm.createContext(context);
  vm.runInContext(source.slice(start, end), context);
  return context;
}
test("each document list displays five entries and its own item count", () => {
  const f = fixture();
  const markup = f.documentsScreen();
  assert.equal((markup.match(/documents-file-row-workspace/g) || []).length, 5);
  assert.equal((markup.match(/data-open-document=/g) || []).length, 5);
  assert.equal((markup.match(/1–5 of 13/g) || []).length, 2);
  assert.equal((markup.match(/Page 1 of 3/g) || []).length, 2);
});
test("uploaded pages preserve original indices for open, download and removal", () => {
  const f = fixture();
  f.state.documentsPages.uploaded = 1;
  const markup = f.documentsScreen();
  for (const action of ["open", "download", "remove"]) {
    assert.match(markup, new RegExp('data-' + action + '-document="5"'));
    assert.match(markup, new RegExp('data-' + action + '-document="9"'));
    assert.doesNotMatch(markup, new RegExp('data-' + action + '-document="0"'));
  }
  assert.match(markup, /6–10 of 13/);
  assert.match(markup, /Working 0/);
  assert.doesNotMatch(markup, /Working 5/);
  assert.equal(f.state.documentsPages.working, 0);
});
test("working pagination retains template IDs and does not move uploaded pages", () => {
  const f = fixture();
  f.state.documentsPages.working = 2;
  const markup = f.documentsScreen();
  assert.match(markup, /data-open-workspace="template-10"/);
  assert.match(markup, /data-remove-workspace="template-12"/);
  assert.doesNotMatch(markup, /data-open-workspace="template-0"/);
  assert.match(markup, /11–13 of 13/);
  assert.match(markup, /data-open-document="0"/);
});
test("deleting the final page clamps to the last remaining page", () => {
  const f = fixture(11);
  f.state.documentsPages.uploaded = 2;
  f.state.documentsFiles.pop();
  const markup = f.documentsScreen();
  assert.equal(f.state.documentsPages.uploaded, 1);
  assert.match(markup, /6–10 of 10/);
  assert.match(markup, /data-documents-page-list="uploaded" data-documents-page="2"[^>]*disabled/);
});
test("empty and short lists omit pagination without losing their empty states", () => {
  for (const count of [0, 1, 5]) {
    const markup = fixture(count).documentsScreen();
    assert.doesNotMatch(markup, /class="documents-pagination"/);
    if (!count) assert.match(markup, /Your saved worksheets/);
  }
});
test("invalid page state is clamped and pagination resets with workspace state", () => {
  const f = fixture(6);
  f.state.documentsPages.working = -100;
  f.state.documentsPages.uploaded = "invalid";
  f.documentsScreen();
  assert.equal(f.state.documentsPages.working, 0);
  assert.equal(f.state.documentsPages.uploaded, 0);
  assert.match(source, /state.documentsFiles = \[\];\s*state.documentsPages = \{ working: 0, uploaded: 0 \}/);
});
