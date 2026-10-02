import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const functions = source.slice(source.indexOf("const trainingAssetBlobUrlCache ="), source.indexOf("function downloadTrainingAsset("));
function fixture(overrides = {}) {
  let serial = 0;
  const revoked = [], requests = [];
  const item = { filename: "module.pdf", assetPath: "design/training/module.pdf" };
  const state = { screen: "training", trainingAssets: { mandatory: [item] }, trainingPreviewOpen: false };
  const context = {
    state, Blob, Response, render() {}, syncBrowserRoute() {}, resetTrainingPdfPreviewCache() {},
    resolveTrainingAssetUrl: item => `https://example.test/${item.assetPath}`,
    getPrivateFilePreviewUrl: async () => `https://example.test/private-${++serial}`,
    URL: { createObjectURL: () => `blob:test-${++serial}`, revokeObjectURL: url => revoked.push(url) },
    fetch: async (url, options) => { requests.push({ url, options }); return new Response("%PDF-1.7\nfixture", { headers: { "content-type": "application/pdf" } }); },
    ...overrides,
  };
  vm.createContext(context);
  vm.runInContext("let trainingPreviewRequestToken = 0;\n" + functions, context);
  return { context, state, item, revoked, requests };
}
test("training iframe receives a blob, not the anti-framing protected static URL", async () => {
  const f = fixture();
  await f.context.openTrainingAssetPreview("mandatory", 0);
  assert.match(f.state.trainingPreviewUrl, /^blob:/);
  assert.equal(f.state.trainingPreviewLoading, false);
  assert.equal(f.state.trainingPreviewError, "");
  await f.context.openTrainingAssetPreview("mandatory", 0);
  assert.equal(f.requests.length, 1);
});
test("fetch failure appears in the viewer instead of an empty iframe", async () => {
  const f = fixture({ fetch: async () => new Response("Denied", { status: 403 }) });
  await f.context.openTrainingAssetPreview("mandatory", 0);
  assert.match(f.state.trainingPreviewError, /403/);
  assert.equal(f.state.trainingPreviewUrl, "");
  assert.equal(f.state.trainingPreviewLoading, false);
});
test("HTML fallback masquerading as a PDF is rejected", async () => {
  const f = fixture({ fetch: async () => new Response("<html>fallback</html>", { headers: { "content-type": "application/pdf" } }) });
  await f.context.openTrainingAssetPreview("mandatory", 0);
  assert.match(f.state.trainingPreviewError, /valid PDF/);
});
