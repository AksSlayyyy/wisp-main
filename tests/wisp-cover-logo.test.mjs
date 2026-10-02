import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";

const source = await readFile(new URL("../scripts/wisp_merge_service.mjs", import.meta.url), "utf8");
const htmlSource = source.slice(source.indexOf("function buildDownloadPreviewHtml("), source.indexOf("function runMerge("));
const buildDownloadPreviewHtml = runInNewContext(`${htmlSource}\nbuildDownloadPreviewHtml`, {
  escapeHtml: (value) => String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;"),
  SIGNATURE_FONT_DATA_URLS: { handwritten: "", classic: "", elegant: "", casual: "" },
});

test("logo is centered below the WISP cover text and absent when none is saved", () => {
  const preview = { pages: [
    { isCover: true, blocks: [
      { kind: "cover-title", text: "Written Information Security Plan (WISP)" },
      { kind: "cover-firm", text: "Example Firm" },
      { kind: "cover-note", text: "This Document is for general distribution." },
    ] },
    { title: "Scope", blocks: [{ kind: "paragraph", text: "Sample body" }] },
  ] };
  const html = buildDownloadPreviewHtml(preview, [], "data:image/png;base64,YWJj");
  assert.match(html, /This Document is for general distribution\.<\/p>\s*<img class="export-cover-logo" src="data:image\/png;base64,YWJj"/);
  assert.match(html, /\.export-cover-logo \{[^}]*max-width: 2\.8in;[^}]*max-height: 1\.5in;[^}]*margin: 0\.8in auto 0;/);
  assert.equal((html.match(/class="export-cover-logo"/g) || []).length, 1);
  assert.doesNotMatch(buildDownloadPreviewHtml(preview), /class="export-cover-logo"/);
});

test("draft preview uses caller access while queued signed PDFs use the trusted job firm", () => {
  assert.match(source, /prepareReviewedRender\(payload, payload\.firmId, signatures, principal\.authorization\)/);
  assert.match(source, /prepareReviewedRender\(payload, job\.firm_id, signatures\)/);
  assert.match(source, /fetchFirmCoverLogo\(firmId, authorization\)/);
  assert.match(source, /useCaller\s*\? `\$\{SUPABASE_URL\}\/rest\/v1\/rpc\/get_my_firm_app_settings`/);
  assert.match(source, /storagePath\.startsWith\(`\$\{firmId\}\/logos\/`\)/);
});

test("a draft preview cannot fetch another firm's logo with renderer credentials", async () => {
  const calls = [];
  const functionSource = source.slice(source.indexOf("async function fetchFirmCoverLogo("), source.indexOf("async function fetchVersionSignatures("));
  const fetchFirmCoverLogo = runInNewContext(`${functionSource}\nfetchFirmCoverLogo`, {
    SUPABASE_URL: "https://staging.example.test",
    SUPABASE_ANON_KEY: "public-key",
    SUPABASE_SERVICE_ROLE_KEY: "private-key",
    URLSearchParams,
    AbortSignal,
    serviceRoleHeaders: () => ({ apikey: "private-key", Authorization: "Bearer private-key" }),
    fetch: async (url, options) => {
      calls.push({ url, options });
      return { ok: true, json: async () => ({ logo_path: "other-firm/logos/logo.png" }) };
    },
  });
  assert.equal(await fetchFirmCoverLogo("my-firm", "Bearer member-token"), "");
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /\/rpc\/get_my_firm_app_settings$/);
  assert.equal(calls[0].options.headers.Authorization, "Bearer member-token");
  assert.equal(calls[0].options.headers.apikey, "public-key");
});

test("a queued signed render reads the saved logo from the trusted firm namespace", async () => {
  const calls = [];
  const functionSource = source.slice(source.indexOf("async function fetchFirmCoverLogo("), source.indexOf("async function fetchVersionSignatures("));
  const fetchFirmCoverLogo = runInNewContext(`${functionSource}\nfetchFirmCoverLogo`, {
    SUPABASE_URL: "https://staging.example.test",
    SUPABASE_ANON_KEY: "public-key",
    SUPABASE_SERVICE_ROLE_KEY: "private-key",
    URLSearchParams,
    AbortSignal,
    Buffer,
    serviceRoleHeaders: () => ({ apikey: "private-key", Authorization: "Bearer private-key" }),
    fetch: async (url, options) => {
      calls.push({ url, options });
      return calls.length === 1
        ? { ok: true, json: async () => [{ logo_path: "my-firm/logos/logo.png" }] }
        : { ok: true, headers: { get: () => "image/png" }, arrayBuffer: async () => Buffer.from("image") };
    },
  });
  assert.equal(await fetchFirmCoverLogo("my-firm"), `data:image/png;base64,${Buffer.from("image").toString("base64")}`);
  assert.equal(calls.length, 2);
  assert.match(calls[1].url, /\/storage\/v1\/object\/documents\/my-firm\/logos\/logo\.png$/);
  assert.equal(calls[1].options.headers.Authorization, "Bearer private-key");
});
