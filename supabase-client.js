import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const env = window.__ENV__ || {};
const DEFAULT_FIRM_SLUG = "default-firm";

const TRAINING_ASSET_PRESENTATIONS = [
  {
    assetKey: "annual_staff_training",
    match: (item) => item.asset_type === "mandatory" && /annual staff training/i.test(item.title || ""),
    assetPath: "design/training/easywisp-staff-security-awareness-training.pdf",
    filename: "easywisp-staff-security-awareness-training.pdf",
    previewLabel: "Mandatory staff training",
    kind: "document",
  },
  {
    assetKey: "phishing_awareness_training",
    match: (item) => item.asset_type === "video" && /phishing/i.test(item.title || ""),
    assetPath: "design/training/easywisp-phishing-awareness-training.pdf",
    filename: "easywisp-phishing-awareness-training.pdf",
    previewLabel: "Phishing awareness module",
    kind: "document",
  },
  {
    assetKey: "irs_dirty_dozen_briefing",
    match: (item) => /dirty dozen/i.test(item.title || ""),
    assetPath: "design/training/easywisp-irs-dirty-dozen-briefing.pdf",
    filename: "easywisp-irs-dirty-dozen-briefing.pdf",
    previewLabel: "IRS Dirty Dozen briefing",
    kind: "document",
  },
];

const DEFAULT_TRAINING_ASSETS = [
  {
    asset_key: "annual_staff_training",
    source_kind: "platform",
    sort_order: 10,
    title: "[PPTX] WISP Annual Staff Training Presentation - 2.4 MB",
    description: "Mandatory annual training deck for internal staff awareness reviews.",
    asset_type: "mandatory",
    action_primary: "View",
    action_secondary: "Download",
    storage_path: "platform/annual_staff_training.pdf",
  },
  {
    asset_key: "employee_training_signin_sheet",
    source_kind: "platform",
    sort_order: 20,
    title: "[DOCX] WISP Employee Training Sign-in Sheet - 120 KB",
    description: "Sign-in sheet to document attendance for required employee training.",
    asset_type: "mandatory",
    action_primary: "View",
    action_secondary: "Download",
  },
  {
    asset_key: "wisp_overview_video",
    source_kind: "platform",
    sort_order: 30,
    title: "Written Information Security Plan Overview - 14 Mins",
    description: "Overview video for WISP concepts and internal readiness expectations.",
    asset_type: "video",
    action_primary: "Watch Video",
    action_secondary: null,
  },
  {
    asset_key: "phishing_awareness_training",
    source_kind: "platform",
    sort_order: 40,
    title: "Security Awareness: Recognizing Phishing Scams - 7 Mins",
    description: "Security-awareness video focused on phishing and suspicious messages.",
    asset_type: "video",
    action_primary: "Watch Video",
    action_secondary: null,
    storage_path: "platform/phishing_awareness_training.pdf",
  },
  {
    asset_key: "irs_dirty_dozen_briefing",
    source_kind: "platform",
    sort_order: 50,
    title: 'IRS "Dirty Dozen" Financial Scams Briefing - 11 Mins',
    description: "Short-form security briefing on common financial scam patterns.",
    asset_type: "video",
    action_primary: "Watch Video",
    action_secondary: null,
    storage_path: "platform/irs_dirty_dozen_briefing.pdf",
  },
  {
    asset_key: "ftc_safeguards_quick_reference",
    source_kind: "platform",
    sort_order: 60,
    title: "[PDF] FTC Safeguards Rule Quick Reference Guide - 1.8 MB",
    description: "Reference guide covering FTC Safeguards Rule expectations.",
    asset_type: "resource",
    action_primary: "View",
    action_secondary: "Download",
  },
];

export const supabase = env.SUPABASE_URL && env.SUPABASE_ANON_KEY
  ? createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

let firmCache = null;
let currentUserCache = undefined;
let riskAssessmentCache = null;
let wispProjectCache = null;
const DASHBOARD_WISP_SECTION_TARGET = 12;
const DASHBOARD_RISK_QUESTION_COUNT = 20;

if (supabase) {
  supabase.auth.onAuthStateChange(() => {
    currentUserCache = undefined;
    firmCache = null;
    riskAssessmentCache = null;
    wispProjectCache = null;
  });
}

function hasClient() {
  return Boolean(supabase);
}

async function buildStoragePreviewUrl(storagePath, bucketName = "documents") {
  if (!hasClient() || !storagePath) return null;
  try {
    const { data, error } = await supabase.storage.from(bucketName).createSignedUrl(storagePath, 60 * 60 * 24 * 7);
    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}

export async function fetchBootstrapState() {
  if (!hasClient()) return null;
  try {
    const user = await getAuthenticatedUser();
    const firm = await getActiveFirm();
    if (!firm) return null;

    const [trainingAssetsResult, assessmentResult, documentsResult, settingsResult, dashboardResult, wispProjectResult] = await Promise.allSettled([
      ensureTrainingAssets(firm.id),
      supabase
        .from("risk_assessments")
        .select("*")
        .eq("firm_id", firm.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("documents")
        .select("id,file_name,size_bytes,mime_type,storage_path,created_at")
        .eq("firm_id", firm.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("app_settings")
        .select("*")
        .eq("firm_id", firm.id)
        .maybeSingle(),
      supabase
        .from("dashboard_facts")
        .select("*")
        .eq("firm_id", firm.id)
        .maybeSingle(),
      ensureWispProject(firm.id),
    ]);

    if (trainingAssetsResult.status === "rejected") console.warn("Training asset bootstrap warning", trainingAssetsResult.reason);
    if (assessmentResult.status === "rejected") console.warn("Risk assessment bootstrap warning", assessmentResult.reason);
    if (documentsResult.status === "rejected") console.warn("Documents bootstrap warning", documentsResult.reason);
    if (settingsResult.status === "rejected") console.warn("Settings bootstrap warning", settingsResult.reason);
    if (dashboardResult.status === "rejected") console.warn("Dashboard bootstrap warning", dashboardResult.reason);
    if (wispProjectResult.status === "rejected") console.warn("WISP bootstrap warning", wispProjectResult.reason);

    const trainingAssets = trainingAssetsResult.status === "fulfilled" ? (trainingAssetsResult.value || []) : [];
    const assessment = assessmentResult.status === "fulfilled" ? (assessmentResult.value?.data || null) : null;
    const documents = documentsResult.status === "fulfilled" ? (documentsResult.value?.data || []) : [];
    const settings = settingsResult.status === "fulfilled" ? (settingsResult.value?.data || null) : null;
    const dashboard = dashboardResult.status === "fulfilled" ? (dashboardResult.value?.data || null) : null;
    const wispProject = wispProjectResult.status === "fulfilled" ? (wispProjectResult.value || null) : null;

    riskAssessmentCache = assessment || null;
    const hydratedWispProject = hydrateWispProjectDrafts(wispProject || null, await fetchWispAnswerRows(wispProject?.id));
    const generatedFiles = await fetchWispGeneratedFiles(hydratedWispProject?.id);
    const latestGeneratedFile = generatedFiles[0] || null;
    const archivedVersions = generatedFiles.slice(1);
    const bootstrappedWispProject = hydratedWispProject
      ? { ...hydratedWispProject, latest_generated_file: latestGeneratedFile }
      : hydratedWispProject;
    wispProjectCache = bootstrappedWispProject;
    const dashboardSnapshot = buildDashboardSnapshot({
      assessment: assessment || null,
      documents: documents || [],
      existingDashboard: dashboard || null,
      trainingAssets: trainingAssets || [],
      wispProject: bootstrappedWispProject,
    });
    const dashboardRecord = await upsertDashboardFacts(firm.id, dashboardSnapshot, dashboard || null);

    const settingsWithPreview = settings
      ? {
          ...settings,
          logo_url: settings.logo_path ? await buildStoragePreviewUrl(settings.logo_path) : null,
          settings: normalizeAppSettingsPayload(settings.settings),
        }
      : null;

    return {
      user: user ? { id: user.id, email: user.email || null } : null,
      firm,
      assessment: assessment || null,
      documents: await Promise.all((documents || []).map(hydrateDocumentRow)),
      settings: settingsWithPreview,
      dashboard: dashboardRecord || dashboardSnapshot,
      trainingAssets: groupTrainingAssets(trainingAssets || []),
      wispProject: bootstrappedWispProject,
      wispVersions: archivedVersions,
    };
  } catch (error) {
    console.warn("Supabase bootstrap skipped", error);
    return null;
  }
}

export async function saveRiskAssessmentDraft(form, meta = {}) {
  if (!hasClient()) return null;
  const firm = await getActiveFirm();
  if (!firm) return null;

  await upsertFirmFromForm(firm.id, form);

  const payload = {
    firm_id: firm.id,
    status: meta.status || "draft",
    company_name: form.companyName || null,
    primary_contact: form.primaryContact || null,
    practice_type: form.practiceType || null,
    staff_size: form.staffSize || null,
    tax_software: form.taxSoftware || null,
    it_management: form.itManagement || null,
    answers: buildRiskAnswerMap(form),
    score_summary: meta.scoreSummary || {},
    updated_at: new Date().toISOString(),
  };

  if (riskAssessmentCache?.id) payload.id = riskAssessmentCache.id;

  const { data, error } = await supabase
    .from("risk_assessments")
    .upsert(payload)
    .select("*")
    .single();

  if (error) throw error;
  riskAssessmentCache = data;

  const answerRows = (meta.answerRows || Object.entries(buildRiskAnswerMap(form)).map(([question_key, answer_value]) => ({
    question_key,
    answer_value,
  }))).map((row) => ({
    assessment_id: data.id,
    question_key: row.question_key,
    question_label: row.question_label || null,
    answer_value: row.answer_value,
    score: Number.isFinite(Number(row.score)) ? Number(row.score) : null,
    updated_at: new Date().toISOString(),
  }));

  if (answerRows.length) {
    const { error: answersError } = await supabase
      .from("risk_assessment_answers")
      .upsert(answerRows, { onConflict: "assessment_id,question_key" });
    if (answersError) console.warn("Risk answer sync warning", answersError);
  }

  const { data: existingAnswerRows, error: existingAnswersError } = await supabase
    .from("risk_assessment_answers")
    .select("id,question_key")
    .eq("assessment_id", data.id);
  if (existingAnswersError) {
    console.warn("Risk answer cleanup warning", existingAnswersError);
  } else {
    const activeQuestionKeys = new Set(answerRows.map((row) => row.question_key));
    const staleAnswerIds = (existingAnswerRows || [])
      .filter((row) => !activeQuestionKeys.has(row.question_key))
      .map((row) => row.id);
    if (staleAnswerIds.length) {
      const { error: deleteAnswersError } = await supabase
        .from("risk_assessment_answers")
        .delete()
        .in("id", staleAnswerIds);
      if (deleteAnswersError) console.warn("Risk answer cleanup warning", deleteAnswersError);
    }
  }

  const dashboardRecord = await syncDashboardFacts(firm.id, { assessment: data });
  if (dashboardRecord) data.dashboard_facts = dashboardRecord;
  return data;
}

export async function uploadDocuments(fileList) {
  if (!hasClient() || !fileList?.length) return [];
  const firm = await getActiveFirm();
  if (!firm) return [];
  const results = [];

  for (const file of fileList) {
    const storagePath = `${firm.slug}/${Date.now()}-${sanitizeFileName(file.name)}`;
    const { error: storageError } = await supabase.storage
      .from("documents")
      .upload(storagePath, file, { upsert: false, contentType: file.type || "application/octet-stream" });
    if (storageError) throw storageError;

    const { data: row, error: insertError } = await supabase
      .from("documents")
      .insert({
        firm_id: firm.id,
        bucket_name: "documents",
        storage_path: storagePath,
        file_name: file.name,
        mime_type: file.type || "application/octet-stream",
        size_bytes: file.size || 0,
      })
      .select("*")
      .single();
    if (insertError) throw insertError;

    results.push(await hydrateDocumentRow(row));
  }

  await syncDashboardFacts(firm.id, {
    documents: await fetchDashboardDocuments(firm.id),
  });
  return results;
}

export async function deleteDocument(documentRecord) {
  if (!hasClient() || !documentRecord?.id) return;
  const firm = await getActiveFirm();
  await supabase.from("documents").delete().eq("id", documentRecord.id);
  if (documentRecord.storagePath) {
    await supabase.storage.from("documents").remove([documentRecord.storagePath]);
  }
  if (firm?.id) {
    await syncDashboardFacts(firm.id, {
      documents: await fetchDashboardDocuments(firm.id),
    });
  }
}

export async function uploadCompanyLogo(file) {
  if (!hasClient() || !file) return null;
  const firm = await getActiveFirm();
  if (!firm) return null;
  const settingsRecord = await ensureAppSettingsRecord(firm.id);
  const storagePath = `${firm.slug}/logos/${Date.now()}-${sanitizeFileName(file.name)}`;
  const { error: storageError } = await supabase.storage
    .from("documents")
    .upload(storagePath, file, { upsert: true, contentType: file.type || "application/octet-stream" });
  if (storageError) throw storageError;

  const { data, error } = await supabase
    .from("app_settings")
    .upsert({
      id: settingsRecord.id,
      firm_id: firm.id,
      logo_path: storagePath,
      settings: normalizeAppSettingsPayload(settingsRecord.settings),
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();
  if (error) throw error;
  return { ...data, settings: normalizeAppSettingsPayload(data.settings), logo_url: await buildStoragePreviewUrl(storagePath) };
}

export async function removeCompanyLogo() {
  if (!hasClient()) return null;
  const firm = await getActiveFirm();
  if (!firm) return null;
  const settingsRecord = await ensureAppSettingsRecord(firm.id);
  const { data, error } = await supabase
    .from("app_settings")
    .upsert({
      id: settingsRecord.id,
      firm_id: firm.id,
      logo_path: null,
      settings: normalizeAppSettingsPayload(settingsRecord.settings),
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();
  if (error) throw error;
  return { ...data, settings: normalizeAppSettingsPayload(data.settings), logo_url: null };
}

export async function saveDocumentWorkspaces(workspaces) {
  if (!hasClient()) return null;
  const firm = await getActiveFirm();
  if (!firm) return null;
  const settingsRecord = await ensureAppSettingsRecord(firm.id);
  const nextSettings = normalizeAppSettingsPayload(settingsRecord.settings);
  nextSettings.document_workspaces = sanitizeDocumentWorkspacesPayload(workspaces);
  const { data, error } = await supabase
    .from("app_settings")
    .upsert({
      id: settingsRecord.id,
      firm_id: firm.id,
      logo_path: settingsRecord.logo_path || null,
      settings: nextSettings,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();
  if (error) throw error;
  return normalizeAppSettingsPayload(data.settings).document_workspaces || {};
}

export async function saveWorkspaceSettings(partialSettings = {}) {
  if (!hasClient()) return null;
  const firm = await getActiveFirm();
  if (!firm) return null;
  const settingsRecord = await ensureAppSettingsRecord(firm.id);
  const nextSettings = {
    ...normalizeAppSettingsPayload(settingsRecord.settings),
    ...(partialSettings || {}),
  };
  const { data, error } = await supabase
    .from("app_settings")
    .upsert({
      id: settingsRecord.id,
      firm_id: firm.id,
      logo_path: settingsRecord.logo_path || null,
      settings: normalizeAppSettingsPayload(nextSettings),
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();
  if (error) throw error;
  return normalizeAppSettingsPayload(data.settings);
}

export async function saveWispDraft(builderDrafts, meta = {}) {
  if (!hasClient()) return null;
  const firm = await getActiveFirm();
  if (!firm) return null;
  const project = await ensureWispProject(firm.id);
  const assessmentSnapshot = {
    ...(project.assessment_snapshot || {}),
    ...(meta.assessmentSnapshot || {}),
  };
  const payload = {
    id: project.id,
    firm_id: firm.id,
    title: meta.title || project.title || "Written Information Security Plan",
    status: meta.status || project.status || "draft",
    section_drafts: builderDrafts,
    assessment_snapshot: assessmentSnapshot,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("wisp_projects").upsert(payload).select("*").single();
  if (error) throw error;
  await syncWispAnswerRows(data.id, builderDrafts);
  const hydratedProject = {
    ...hydrateWispProjectDrafts(data, buildWispAnswerRows(builderDrafts)),
    latest_generated_file: project?.latest_generated_file || null,
  };
  wispProjectCache = hydratedProject;
  const dashboardRecord = await syncDashboardFacts(firm.id, { wispProject: hydratedProject });
  if (dashboardRecord) hydratedProject.dashboard_facts = dashboardRecord;
  return hydratedProject;
}

export async function finalizeWispBuild(filePayload, meta = {}) {
  if (!hasClient()) return null;
  const firm = await getActiveFirm();
  if (!firm) return null;

  const builderDrafts = meta.builderDrafts || wispProjectCache?.section_drafts || {};
  const savedProject = await saveWispDraft(builderDrafts, {
    ...meta,
    status: "active",
  });

  if (!filePayload?.blob || !filePayload?.fileName) {
    const generatedFiles = await fetchWispGeneratedFiles(savedProject.id);
    const latestGeneratedFile = generatedFiles[0] || savedProject.latest_generated_file || null;
    const finalizedProject = { ...savedProject, status: "active", latest_generated_file: latestGeneratedFile };
    wispProjectCache = finalizedProject;
    return {
      project: finalizedProject,
      generatedFile: latestGeneratedFile,
      versions: generatedFiles.slice(1),
    };
  }

  const storagePath = [
    firm.slug,
    "wisp",
    savedProject.id,
    Date.now() + "-" + sanitizeFileName(filePayload.fileName),
  ].join("/");
  const { error: storageError } = await supabase.storage
    .from("wisp-pdfs")
    .upload(storagePath, filePayload.blob, {
      upsert: false,
      contentType: filePayload.contentType || "application/octet-stream",
    });
  if (storageError) throw storageError;

  const { error: insertError } = await supabase
    .from("wisp_generated_files")
    .insert({
      project_id: savedProject.id,
      storage_path: storagePath,
      file_name: filePayload.fileName,
    });
  if (insertError) throw insertError;

  const generatedFiles = await fetchWispGeneratedFiles(savedProject.id);
  const latestGeneratedFile = generatedFiles[0] || null;
  const finalizedProject = {
    ...savedProject,
    status: "active",
    latest_generated_file: latestGeneratedFile,
  };
  wispProjectCache = finalizedProject;
  return {
    project: finalizedProject,
    generatedFile: latestGeneratedFile,
    versions: generatedFiles.slice(1),
  };
}

async function fetchWispGeneratedFiles(projectId) {
  if (!projectId) return [];
  const { data, error } = await supabase
    .from("wisp_generated_files")
    .select("id,project_id,storage_path,file_name,created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  return await Promise.all((data || []).map(async (row) => ({
    id: row.id,
    projectId: row.project_id,
    storagePath: row.storage_path,
    fileName: row.file_name,
    updated_at: row.created_at,
    downloadUrl: await buildStoragePreviewUrl(row.storage_path, "wisp-pdfs"),
  })));
}

async function getAuthenticatedUser() {
  if (currentUserCache !== undefined) return currentUserCache;
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.warn("Unable to resolve Supabase user", error);
    currentUserCache = null;
    return currentUserCache;
  }
  currentUserCache = data?.user || null;
  return currentUserCache;
}

async function getActiveFirm() {
  if (firmCache) return firmCache;
  const user = await getAuthenticatedUser();

  if (user?.id) {
    const { data, error } = await supabase
      .from("firm_memberships")
      .select("role,status,firm:firms(*)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    firmCache = data?.firm || null;
    if (firmCache) return firmCache;
    return null;
  }

  const { data, error } = await supabase.from("firms").select("*").eq("slug", DEFAULT_FIRM_SLUG).maybeSingle();
  if (error) {
    console.warn("Anonymous firm fallback is unavailable", error);
    return null;
  }
  firmCache = data || null;
  return firmCache;
}

async function ensureWispProject(firmId) {
  if (wispProjectCache) return wispProjectCache;
  const { data: existing, error } = await supabase
    .from("wisp_projects")
    .select("*")
    .eq("firm_id", firmId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (existing) {
    const hydratedProject = hydrateWispProjectDrafts(existing, await fetchWispAnswerRows(existing.id));
    wispProjectCache = hydratedProject;
    return hydratedProject;
  }
  const { data, error: insertError } = await supabase
    .from("wisp_projects")
    .insert({ firm_id: firmId, title: "Written Information Security Plan", status: "draft", section_drafts: {} })
    .select("*")
    .single();
  if (insertError) throw insertError;
  wispProjectCache = data;
  return data;
}

async function fetchWispAnswerRows(projectId) {
  if (!projectId) return [];
  const { data, error } = await supabase
    .from("wisp_answers")
    .select("section_key,answer_value,updated_at")
    .eq("project_id", projectId);
  if (error) throw error;
  return data || [];
}

function buildWispAnswerRows(builderDrafts = {}) {
  return Object.entries(builderDrafts || {})
    .filter(([, value]) => String(value || "").trim().length > 0)
    .map(([section_key, value]) => ({
      section_key,
      answer_value: {
        html: value,
        plain_text: String(value)
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim(),
      },
    }));
}

async function syncWispAnswerRows(projectId, builderDrafts = {}) {
  const answerRows = buildWispAnswerRows(builderDrafts).map((row) => ({
    project_id: projectId,
    section_key: row.section_key,
    answer_value: row.answer_value,
    updated_at: new Date().toISOString(),
  }));

  if (answerRows.length) {
    const { error } = await supabase
      .from("wisp_answers")
      .upsert(answerRows, { onConflict: "project_id,section_key" });
    if (error) throw error;
  }

  const { data: existingRows, error: existingError } = await supabase
    .from("wisp_answers")
    .select("id,section_key")
    .eq("project_id", projectId);
  if (existingError) throw existingError;

  const activeKeys = new Set(answerRows.map((row) => row.section_key));
  const staleIds = (existingRows || []).filter((row) => !activeKeys.has(row.section_key)).map((row) => row.id);
  if (staleIds.length) {
    const { error } = await supabase.from("wisp_answers").delete().in("id", staleIds);
    if (error) throw error;
  }
}

function hydrateWispProjectDrafts(project, answerRows = []) {
  if (!project) return project;
  const mergedDrafts = { ...(project.section_drafts || {}) };
  (answerRows || []).forEach((row) => {
    const normalized = normalizeWispAnswerValue(row.answer_value);
    if (normalized) mergedDrafts[row.section_key] = normalized;
  });
  return {
    ...project,
    section_drafts: mergedDrafts,
  };
}

function normalizeWispAnswerValue(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (typeof value.html === "string") return value.html;
    if (typeof value.plain_text === "string") return value.plain_text;
  }
  return String(value || "");
}

async function ensureAppSettingsRecord(firmId) {
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .eq("firm_id", firmId)
    .maybeSingle();
  if (error) throw error;
  if (data) return { ...data, settings: normalizeAppSettingsPayload(data.settings) };

  const { data: inserted, error: insertError } = await supabase
    .from("app_settings")
    .insert({
      firm_id: firmId,
      settings: {},
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();
  if (insertError) throw insertError;
  return { ...inserted, settings: normalizeAppSettingsPayload(inserted.settings) };
}

function normalizeAppSettingsPayload(settings) {
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) return { document_workspaces: {} };
  const normalized = { ...settings };
  normalized.document_workspaces = sanitizeDocumentWorkspacesPayload(normalized.document_workspaces);
  return normalized;
}

function sanitizeDocumentWorkspacesPayload(workspaces) {
  const entries = Object.entries(workspaces || {});
  return Object.fromEntries(entries
    .filter(([templateId, workspace]) => templateId && workspace && typeof workspace === "object")
    .map(([templateId, workspace]) => [templateId, {
      templateId,
      title: String(workspace.title || "Untitled document"),
      description: String(workspace.description || ""),
      columns: Array.isArray(workspace.columns) ? workspace.columns.map((value) => String(value || "")) : [],
      rows: Array.isArray(workspace.rows)
        ? workspace.rows.map((row) => Array.isArray(row) ? row.map((value) => String(value || "")) : [])
        : [],
      columnWidths: Array.isArray(workspace.columnWidths) ? workspace.columnWidths.map((value) => Number(value) || 190) : [],
      updatedAt: workspace.updatedAt || new Date().toISOString(),
    }])));
}

async function ensureTrainingAssets(firmId) {
  const { data, error } = await supabase
    .from("training_assets")
    .select("*")
    .or(`firm_id.is.null,firm_id.eq.${firmId}`)
    .order("created_at", { ascending: true });
  if (error) throw error;
  if (data?.length) return hydrateTrainingAssetRows(data);

  const seedRows = buildTrainingSeedRows(firmId);
  const { data: inserted, error: insertError } = await supabase.from("training_assets").insert(seedRows).select("*");
  if (insertError) {
    const fallbackRows = buildTrainingSeedRows(firmId, { legacy: true });
    const { data: legacyInserted, error: legacyInsertError } = await supabase.from("training_assets").insert(fallbackRows).select("*");
    if (legacyInsertError) throw insertError;
    return hydrateTrainingAssetRows(legacyInserted || []);
  }
  return hydrateTrainingAssetRows(inserted || []);
}

async function upsertFirmFromForm(firmId, form) {
  const payload = {
    name: form.companyName || "Current Fiscal LLC",
    primary_contact: form.primaryContact || null,
    practice_type: form.practiceType || null,
    staff_size: form.staffSize || null,
    tax_software: form.taxSoftware || null,
    it_management: form.itManagement || null,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("firms")
    .update(payload)
    .eq("id", firmId)
    .select("*")
    .single();
  if (error) throw error;
  firmCache = data;
  return data;
}

async function syncDashboardFacts(firmId, overrides = {}) {
  try {
    const [existingDashboard, assessment, documents, trainingAssets, wispProject] = await Promise.all([
      overrides.dashboard !== undefined ? Promise.resolve(overrides.dashboard) : fetchDashboardFactsRow(firmId),
      overrides.assessment !== undefined ? Promise.resolve(overrides.assessment) : fetchDashboardAssessment(firmId),
      overrides.documents !== undefined ? Promise.resolve(overrides.documents) : fetchDashboardDocuments(firmId),
      overrides.trainingAssets !== undefined ? Promise.resolve(overrides.trainingAssets) : fetchDashboardTrainingAssets(firmId),
      overrides.wispProject !== undefined ? Promise.resolve(overrides.wispProject) : fetchDashboardWispProject(firmId),
    ]);
    const snapshot = buildDashboardSnapshot({
      assessment,
      documents,
      existingDashboard,
      trainingAssets,
      wispProject,
    });
    return await upsertDashboardFacts(firmId, snapshot, existingDashboard);
  } catch (error) {
    console.warn("Dashboard sync warning", error);
    return null;
  }
}

async function fetchDashboardFactsRow(firmId) {
  const { data, error } = await supabase.from("dashboard_facts").select("*").eq("firm_id", firmId).maybeSingle();
  if (error) throw error;
  return data || null;
}

async function fetchDashboardAssessment(firmId) {
  const { data, error } = await supabase
    .from("risk_assessments")
    .select("*")
    .eq("firm_id", firmId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

async function fetchDashboardDocuments(firmId) {
  const { data, error } = await supabase
    .from("documents")
    .select("id,file_name,size_bytes,mime_type,storage_path,created_at")
    .eq("firm_id", firmId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

async function fetchDashboardTrainingAssets(firmId) {
  const { data, error } = await supabase
    .from("training_assets")
    .select("*")
    .or(`firm_id.is.null,firm_id.eq.${firmId}`);
  if (error) throw error;
  return hydrateTrainingAssetRows(data || []);
}

async function fetchDashboardWispProject(firmId) {
  const { data, error } = await supabase
    .from("wisp_projects")
    .select("*")
    .eq("firm_id", firmId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return hydrateWispProjectDrafts(data || null, await fetchWispAnswerRows(data?.id));
}

function buildDashboardSnapshot({ assessment, documents, existingDashboard, trainingAssets, wispProject }) {
  const answeredRiskQuestions = Object.keys(assessment?.answers || {}).length;
  const completedSectionsCount = countCompletedBuilderSections(wispProject);
  const riskAssessmentStatus = deriveAssessmentStatus(assessment, answeredRiskQuestions);
  const wispProjectStatus = deriveWispStatus(wispProject, completedSectionsCount);
  const riskScore = normalizeDashboardScore(
    assessment?.score_summary?.overall,
    answeredRiskQuestions ? Math.round((answeredRiskQuestions / DASHBOARD_RISK_QUESTION_COUNT) * 100) : null,
  );
  const wispCompletion = clampPercentage(Math.round((completedSectionsCount / DASHBOARD_WISP_SECTION_TARGET) * 100));
  const completionPercent = clampPercentage(
    Math.round(((riskScore ?? 0) * 0.55) + (wispCompletion * 0.45)),
  );
  const focusArea = assessment?.score_summary?.topArea
    || existingDashboard?.focus_area
    || "Administrative Safeguards";
  const documentsCount = documents.length;
  const trainingAssetsCount = trainingAssets.length;
  const nextAction = deriveNextAction({
    documentsCount,
    riskAssessmentStatus,
    trainingAssetsCount,
    wispProjectStatus,
  });
  const updatedAt = new Date().toISOString();
  const latestActivityAt = [
    assessment?.updated_at,
    wispProject?.updated_at,
    existingDashboard?.updated_at,
  ].filter(Boolean).sort().at(-1) || updatedAt;

  return {
    firm_id: assessment?.firm_id || wispProject?.firm_id || existingDashboard?.firm_id || null,
    completion_percent: completionPercent,
    focus_area: focusArea,
    status_label: deriveDashboardStatusLabel({ completionPercent, riskAssessmentStatus, wispProjectStatus }),
    next_audit_label: deriveNextAuditLabel(latestActivityAt),
    section_count: DASHBOARD_WISP_SECTION_TARGET,
    risk_assessment_status: riskAssessmentStatus,
    wisp_project_status: wispProjectStatus,
    documents_count: documentsCount,
    training_assets_count: trainingAssetsCount,
    completed_sections_count: completedSectionsCount,
    risk_score: riskScore,
    next_action_key: nextAction.key,
    next_action_label: nextAction.label,
    last_assessment_at: assessment?.updated_at || null,
    last_wisp_updated_at: wispProject?.updated_at || null,
    summary: {
      answered_risk_questions: answeredRiskQuestions,
      completed_wisp_sections: completedSectionsCount,
      document_count: documentsCount,
      training_asset_count: trainingAssetsCount,
    },
    updated_at: updatedAt,
  };
}

async function upsertDashboardFacts(firmId, snapshot, existingDashboard = null) {
  const payload = {
    ...snapshot,
    firm_id: firmId,
  };
  if (existingDashboard && dashboardMatches(existingDashboard, payload)) {
    return { ...existingDashboard, ...payload };
  }
  const { data, error } = await supabase
    .from("dashboard_facts")
    .upsert(payload, { onConflict: "firm_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

function dashboardMatches(current, next) {
  return JSON.stringify({
    completion_percent: current?.completion_percent ?? null,
    focus_area: current?.focus_area ?? null,
    status_label: current?.status_label ?? null,
    next_audit_label: current?.next_audit_label ?? null,
    section_count: current?.section_count ?? null,
    risk_assessment_status: current?.risk_assessment_status ?? null,
    wisp_project_status: current?.wisp_project_status ?? null,
    documents_count: current?.documents_count ?? null,
    training_assets_count: current?.training_assets_count ?? null,
    completed_sections_count: current?.completed_sections_count ?? null,
    risk_score: current?.risk_score ?? null,
    next_action_key: current?.next_action_key ?? null,
    next_action_label: current?.next_action_label ?? null,
    last_assessment_at: current?.last_assessment_at ?? null,
    last_wisp_updated_at: current?.last_wisp_updated_at ?? null,
    summary: current?.summary ?? {},
  }) === JSON.stringify({
    completion_percent: next.completion_percent ?? null,
    focus_area: next.focus_area ?? null,
    status_label: next.status_label ?? null,
    next_audit_label: next.next_audit_label ?? null,
    section_count: next.section_count ?? null,
    risk_assessment_status: next.risk_assessment_status ?? null,
    wisp_project_status: next.wisp_project_status ?? null,
    documents_count: next.documents_count ?? null,
    training_assets_count: next.training_assets_count ?? null,
    completed_sections_count: next.completed_sections_count ?? null,
    risk_score: next.risk_score ?? null,
    next_action_key: next.next_action_key ?? null,
    next_action_label: next.next_action_label ?? null,
    last_assessment_at: next.last_assessment_at ?? null,
    last_wisp_updated_at: next.last_wisp_updated_at ?? null,
    summary: next.summary ?? {},
  });
}

function deriveAssessmentStatus(assessment, answeredRiskQuestions) {
  if (!assessment && !answeredRiskQuestions) return "not_started";
  if (assessment?.status === "completed") return "completed";
  if (answeredRiskQuestions >= DASHBOARD_RISK_QUESTION_COUNT) return "completed";
  return answeredRiskQuestions > 0 || assessment ? "in_progress" : "not_started";
}

function deriveWispStatus(wispProject, completedSectionsCount) {
  if (!wispProject && !completedSectionsCount) return "not_started";
  if (wispProject?.status === "completed") return "completed";
  if (completedSectionsCount >= DASHBOARD_WISP_SECTION_TARGET) return "completed";
  return completedSectionsCount > 0 || wispProject ? "in_progress" : "not_started";
}

function countCompletedBuilderSections(wispProject) {
  const sectionDrafts = wispProject?.section_drafts;
  if (!sectionDrafts || typeof sectionDrafts !== "object") return 0;
  const completed = Object.values(sectionDrafts).filter((value) => String(value || "").trim().length > 0).length;
  return Math.max(0, Math.min(DASHBOARD_WISP_SECTION_TARGET, completed));
}

function normalizeDashboardScore(primaryValue, fallbackValue = null) {
  const numeric = Number(primaryValue);
  if (Number.isFinite(numeric)) return clampPercentage(Math.round(numeric));
  const fallback = Number(fallbackValue);
  if (Number.isFinite(fallback)) return clampPercentage(Math.round(fallback));
  return null;
}

function clampPercentage(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(100, numeric));
}

function deriveNextAction({ documentsCount, riskAssessmentStatus, trainingAssetsCount, wispProjectStatus }) {
  if (riskAssessmentStatus === "not_started") {
    return { key: "start_assessment", label: "Start the risk assessment" };
  }
  if (riskAssessmentStatus === "in_progress") {
    return { key: "resume_assessment", label: "Finish the risk assessment" };
  }
  if (wispProjectStatus !== "completed") {
    return { key: "continue_wisp", label: "Continue building your WISP" };
  }
  if (!documentsCount) {
    return { key: "upload_documents", label: "Upload core compliance documents" };
  }
  if (!trainingAssetsCount) {
    return { key: "assign_training", label: "Assign staff training materials" };
  }
  return { key: "review_dashboard", label: "Review your readiness dashboard" };
}

function deriveDashboardStatusLabel({ completionPercent, riskAssessmentStatus, wispProjectStatus }) {
  if (riskAssessmentStatus === "not_started" && wispProjectStatus === "not_started") return "Not Started";
  if (completionPercent >= 85) return "On Track";
  if (completionPercent >= 60) return "In Progress";
  return "Needs Review";
}

function deriveNextAuditLabel(activityDate) {
  const baseDate = activityDate ? new Date(activityDate) : new Date();
  if (Number.isNaN(baseDate.getTime())) {
    return new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  const nextAudit = new Date(baseDate);
  nextAudit.setMonth(nextAudit.getMonth() + 3);
  return nextAudit.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function buildRiskAnswerMap(form) {
  const entries = Object.entries(form || {}).filter(([key]) => key.startsWith("question_"));
  return Object.fromEntries(entries.filter(([, value]) => value !== undefined && value !== null && value !== ""));
}

function sanitizeFileName(name) {
  return String(name || "file")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatBytes(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function mapDocumentRow(item) {
  return {
    id: item.id,
    name: item.file_name,
    sizeLabel: formatBytes(item.size_bytes || 0),
    type: item.mime_type || "application/octet-stream",
    bucketName: item.bucket_name || "documents",
    storagePath: item.storage_path,
    createdAt: item.created_at || null,
  };
}

async function hydrateDocumentRow(item) {
  const mapped = mapDocumentRow(item);
  return {
    ...mapped,
    downloadUrl: await buildStoragePreviewUrl(mapped.storagePath, mapped.bucketName || "documents"),
  };
}

function groupTrainingAssets(items) {
  const sorted = [...hydrateTrainingAssetRows(items)].sort((left, right) => {
    const leftOrder = Number.isFinite(Number(left?.sort_order)) ? Number(left.sort_order) : Number.MAX_SAFE_INTEGER;
    const rightOrder = Number.isFinite(Number(right?.sort_order)) ? Number(right.sort_order) : Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return String(left?.created_at || "").localeCompare(String(right?.created_at || ""));
  });
  return {
    mandatory: sorted.filter((item) => item.asset_type === "mandatory").map(mapTrainingRow("document")),
    videos: sorted.filter((item) => item.asset_type === "video").map(mapTrainingRow("video")),
    resources: sorted.filter((item) => item.asset_type === "resource").map(mapTrainingRow("document")),
  };
}

function mapTrainingRow(defaultKind) {
  return (item) => {
    const presentation = getTrainingAssetPresentation(item);
    return {
      id: item.id,
      kind: presentation?.kind || defaultKind,
      title: item.title,
      description: item.description,
      actionPrimary: item.action_primary,
      actionSecondary: item.action_secondary,
      bucketName: item.bucket_name || "training-assets",
      storagePath: item.storage_path,
      downloadUrl: buildPublicStorageUrl(item.storage_path, item.bucket_name || "training-assets"),
      assetPath: presentation?.assetPath || "",
      filename: presentation?.filename || deriveTrainingFilename(item, presentation),
      previewLabel: presentation?.previewLabel || item.title || "Training asset",
    };
  };
}

function getTrainingAssetPresentation(item) {
  return TRAINING_ASSET_PRESENTATIONS.find((entry) => entry.assetKey && entry.assetKey === item?.asset_key)
    || TRAINING_ASSET_PRESENTATIONS.find((entry) => entry.match(item))
    || null;
}

function deriveTrainingFilename(item, presentation) {
  if (presentation?.filename) return presentation.filename;
  if (item?.storage_path) return String(item.storage_path).split("/").pop() || null;
  return null;
}

function buildTrainingSeedRows(firmId, options = {}) {
  return DEFAULT_TRAINING_ASSETS.map((item) => {
    const baseRow = { firm_id: firmId, bucket_name: "training-assets" };
    if (options.legacy) {
      for (const key of LEGACY_TRAINING_ASSET_COLUMNS) {
        if (item[key] !== undefined) baseRow[key] = item[key];
      }
      return baseRow;
    }
    return { ...item, ...baseRow };
  });
}

function hydrateTrainingAssetRows(items) {
  return (items || []).map((item) => {
    const catalogMatch = findTrainingCatalogMatch(item);
    if (!catalogMatch) return item;
    return {
      ...item,
      asset_key: item?.asset_key || catalogMatch.asset_key || null,
      source_kind: item?.source_kind || catalogMatch.source_kind || "platform",
      sort_order: item?.sort_order ?? catalogMatch.sort_order ?? null,
      storage_path: item?.storage_path || catalogMatch.storage_path || null,
      description: item?.description || catalogMatch.description || null,
      action_primary: item?.action_primary || catalogMatch.action_primary || null,
      action_secondary: item?.action_secondary ?? catalogMatch.action_secondary ?? null,
    };
  });
}

function findTrainingCatalogMatch(item) {
  if (!item) return null;
  const normalizedTitle = normalizeTrainingTitle(item.title);
  return DEFAULT_TRAINING_ASSETS.find((entry) => entry.asset_key && entry.asset_key === item.asset_key)
    || DEFAULT_TRAINING_ASSETS.find((entry) => normalizeTrainingTitle(entry.title) === normalizedTitle)
    || null;
}

function normalizeTrainingTitle(value) {
  return String(value || "")
    .replace(/[��]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function buildPublicStorageUrl(storagePath, bucketName) {
  if (!env.SUPABASE_URL || !storagePath || !bucketName) return null;
  try {
    const normalizedPath = String(storagePath)
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    return new URL('/storage/v1/object/public/' + bucketName + '/' + normalizedPath, env.SUPABASE_URL).toString();
  } catch {
    return null;
  }
}


export function hasSupabaseAuth() {
  return false;
}

export async function signInWithMagicLink(email) {
  if (!hasClient()) throw new Error("Supabase auth is unavailable.");
  const redirectTo = window.location.href.split("#")[0];
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) throw error;
  return true;
}

export async function signOutCurrentUser() {
  if (!hasClient()) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function subscribeToAuthChanges(callback) {
  if (!hasClient() || !hasSupabaseAuth()) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? { id: session.user.id, email: session.user.email || null } : null);
  });
  return () => data.subscription.unsubscribe();
}





