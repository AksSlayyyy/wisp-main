import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://thowcapchyevizbkcofs.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
  || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRob3djYXBjaHlldml6Ymtjb2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNjM1ODEsImV4cCI6MjA5NzgzOTU4MX0.X01hCIb83GEnoVigpyrCrUcOnP4VTbbYcYGqfKPp_rk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

const warnings = [];

function warn(message) {
  warnings.push(message);
}

async function head(url) {
  const response = await fetch(url, { method: "HEAD" });
  return {
    url,
    status: response.status,
    contentType: response.headers.get("content-type"),
  };
}

function printSection(title, body) {
  console.log(`\n[${title}]`);
  console.log(body);
}

const documents = await supabase
  .from("documents")
  .select("id,file_name,storage_path,created_at")
  .order("created_at", { ascending: false })
  .limit(20);
if (documents.error) throw documents.error;

const trainingAssets = await supabase
  .from("training_assets")
  .select("id,title,asset_type,storage_path")
  .order("created_at", { ascending: true });
if (trainingAssets.error) throw trainingAssets.error;

const wispGeneratedFiles = await supabase
  .from("wisp_generated_files")
  .select("id,file_name,storage_path,created_at")
  .order("created_at", { ascending: false })
  .limit(20);
if (wispGeneratedFiles.error) throw wispGeneratedFiles.error;

const appSettings = await supabase
  .from("app_settings")
  .select("id,logo_path,settings,updated_at")
  .order("updated_at", { ascending: false })
  .limit(5);
if (appSettings.error) throw appSettings.error;

const documentsRoot = await supabase.storage.from("documents").list("", { limit: 100 });
const documentsDefaultFirm = await supabase.storage.from("documents").list("default-firm", { limit: 100 });
const trainingBucket = await supabase.storage.from("training-assets").list("platform", { limit: 100 });
const wispBucket = await supabase.storage.from("wisp-pdfs").list("", { limit: 100 });

if (documentsRoot.error) throw documentsRoot.error;
if (documentsDefaultFirm.error) throw documentsDefaultFirm.error;
if (trainingBucket.error) throw trainingBucket.error;
if (wispBucket.error) throw wispBucket.error;

const trainingPublicChecks = await Promise.all(
  (trainingAssets.data || [])
    .filter((row) => row.storage_path)
    .map((row) => head(`${SUPABASE_URL}/storage/v1/object/public/training-assets/${row.storage_path}`)),
);

const healthyTrainingPublic = trainingPublicChecks.every((check) => check.status === 200 && String(check.contentType || "").includes("pdf"));
if (!healthyTrainingPublic) warn("One or more public training files are not serving clean PDF responses.");

if ((documents.data || []).length === 0 && (documentsDefaultFirm.data || []).length > 0) {
  warn("Documents bucket contains files, but the documents table is empty. There may be orphaned uploaded objects.");
}

if ((wispGeneratedFiles.data || []).length === 0 && (wispBucket.data || []).length === 0) {
  warn("No finalized WISP files are stored yet. The code path exists, but live persistence has not been exercised.");
}

if ((appSettings.data || []).length > 0) {
  const latestSettings = appSettings.data[0];
  const keys = Object.keys(latestSettings.settings || {});
  if (!keys.length) warn("app_settings.settings is still empty in live data. Settings persistence code is ready, but not yet exercised against Supabase.");
}

const missingTrainingStorage = (trainingAssets.data || []).filter((row) => !row.storage_path);
if (missingTrainingStorage.length) {
  warn(`${missingTrainingStorage.length} training assets still have no storage_path and currently rely on local fallback or pending uploads.`);
}

printSection(
  "Database",
  JSON.stringify({
    documents_count: documents.data?.length || 0,
    training_assets_count: trainingAssets.data?.length || 0,
    wisp_generated_files_count: wispGeneratedFiles.data?.length || 0,
    app_settings_count: appSettings.data?.length || 0,
  }, null, 2),
);

printSection(
  "Storage",
  JSON.stringify({
    documents_root: documentsRoot.data?.map((item) => item.name) || [],
    documents_default_firm: documentsDefaultFirm.data?.map((item) => item.name) || [],
    training_platform_files: trainingBucket.data?.map((item) => item.name) || [],
    wisp_root: wispBucket.data?.map((item) => item.name) || [],
  }, null, 2),
);

printSection(
  "Training URLs",
  JSON.stringify(trainingPublicChecks, null, 2),
);

printSection(
  "Warnings",
  warnings.length ? warnings.map((item, index) => `${index + 1}. ${item}`).join("\n") : "No health warnings detected.",
);

console.log(`\nBackend health status: ${warnings.length ? "ATTENTION NEEDED" : "HEALTHY"}`);
