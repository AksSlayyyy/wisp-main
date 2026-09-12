import { resolve } from "node:path";
import {
  STAGING_TARGET,
  assertStagingTarget,
  readProjectWindowEnvironment,
} from "./lib/deployment-target.mjs";

const environmentArg = process.argv.find((arg) => arg.startsWith("--environment="));
const environment = environmentArg?.split("=", 2)[1] || "staging";

if (environment !== "staging") {
  throw new Error(`Unsupported environment "${environment}". This guard currently supports staging only.`);
}

const windowEnvironment = await readProjectWindowEnvironment(
  resolve(process.cwd(), "config.js"),
);
const errors = assertStagingTarget(windowEnvironment);

if (errors.length) {
  throw new Error(`Staging target check failed:\n- ${errors.join("\n- ")}`);
}

console.log(
  `Staging target verified: ${STAGING_TARGET.projectRef} (${STAGING_TARGET.apiUrl}).`,
);
