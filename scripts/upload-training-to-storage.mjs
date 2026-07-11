import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const SUPABASE_URL = process.env.SUPABASE_URL || "https://thowcapchyevizbkcofs.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
  || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRob3djYXBjaHlldml6Ymtjb2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNjM1ODEsImV4cCI6MjA5NzgzOTU4MX0.X01hCIb83GEnoVigpyrCrUcOnP4VTbbYcYGqfKPp_rk";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

const TRAINING_FILES = [
  {
    asset_key: "annual_staff_training",
    localPath: "design/training/easywisp-staff-security-awareness-training.pdf",
    storagePath: "platform/annual_staff_training.pdf",
    contentType: "application/pdf",
  },
  {
    asset_key: "phishing_awareness_training",
    localPath: "design/training/easywisp-phishing-awareness-training.pdf",
    storagePath: "platform/phishing_awareness_training.pdf",
    contentType: "application/pdf",
  },
  {
    asset_key: "irs_dirty_dozen_briefing",
    localPath: "design/training/easywisp-irs-dirty-dozen-briefing.pdf",
    storagePath: "platform/irs_dirty_dozen_briefing.pdf",
    contentType: "application/pdf",
  },
];

async function uploadTrainingAssets() {
  console.log("Uploading training assets to Supabase Storage...\n");

  const results = [];

  for (const entry of TRAINING_FILES) {
    const filePath = path.join(root, entry.localPath);
    console.log(`  Uploading ${entry.asset_key} -> ${entry.storagePath}`);

    let fileBuffer;
    try {
      fileBuffer = await fs.readFile(filePath);
    } catch (err) {
      console.error(`  SKIPPED: Could not read ${filePath}: ${err.message}`);
      continue;
    }

    const blob = new Blob([fileBuffer], { type: entry.contentType });

    const { error: uploadError } = await supabase.storage
      .from("training-assets")
      .upload(entry.storagePath, blob, {
        upsert: true,
        contentType: entry.contentType,
      });

    if (uploadError) {
      console.error(`  FAILED: ${uploadError.message}`);
      continue;
    }

    console.log(`  Uploaded successfully.`);

    const { error: updateError } = await supabase
      .from("training_assets")
      .update({ storage_path: entry.storagePath })
      .eq("asset_key", entry.asset_key);

    if (updateError) {
      console.error(`  Row update warning: ${updateError.message}`);
    } else {
      console.log(`  Row storage_path updated.`);
    }

    results.push({ asset_key: entry.asset_key, storage_path: entry.storagePath });
  }

  console.log(`\nDone. ${results.length}/${TRAINING_FILES.length} files uploaded.`);
  return results;
}

uploadTrainingAssets()
  .then((results) => {
    if (results.length > 0) {
      console.log("\nUploaded:");
      results.forEach((r) => console.log(`  ${r.asset_key} -> ${SUPABASE_URL}/storage/v1/object/public/training-assets/${r.storage_path}`));
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("Upload failed:", err.message);
    process.exit(1);
  });