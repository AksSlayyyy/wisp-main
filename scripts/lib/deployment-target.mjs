import { readFile } from "node:fs/promises";

export const STAGING_TARGET = Object.freeze({
  environment: "staging",
  projectRef: "eugsdqwimpocfibmjfxa",
  apiUrl: "https://eugsdqwimpocfibmjfxa.supabase.co",
  rendererOrigin: "https://wisp-renderer-staging.onrender.com",
});

function readConfigString(source, key) {
  const match = source.match(
    new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`),
  );
  return match?.[1] || "";
}

export function readWindowEnvironment(source) {
  return {
    supabaseUrl: readConfigString(source, "SUPABASE_URL"),
    publishableKey: readConfigString(source, "SUPABASE_ANON_KEY"),
    rendererUrl: readConfigString(source, "WISP_RENDERER_URL"),
  };
}

export function assertStagingTarget(environment) {
  const errors = [];
  if (environment.supabaseUrl !== STAGING_TARGET.apiUrl) {
    errors.push(
      `SUPABASE_URL must be ${STAGING_TARGET.apiUrl}; received ${environment.supabaseUrl || "<missing>"}.`,
    );
  }
  if (environment.rendererUrl !== STAGING_TARGET.rendererOrigin) {
    errors.push(
      `WISP_RENDERER_URL must be ${STAGING_TARGET.rendererOrigin}; received ${environment.rendererUrl || "<missing>"}.`,
    );
  }
  if (!environment.publishableKey.startsWith("sb_publishable_")) {
    errors.push("SUPABASE_ANON_KEY must contain a publishable key.");
  }
  return errors;
}

export async function readProjectWindowEnvironment(configPath) {
  const source = await readFile(configPath, "utf8");
  return readWindowEnvironment(source);
}
