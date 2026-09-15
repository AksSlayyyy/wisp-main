import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

async function loadResponsibleOfficialBuilder() {
  const source = await readFile(new URL("../app.js", import.meta.url), "utf8");
  const start = source.indexOf("const WISP_SIGNATORY_ROLES =");
  const end = source.indexOf("function getWispResponsibleOfficials", start);
  assert.notEqual(start, -1, "signatory role definitions must exist");
  assert.notEqual(end, -1, "responsible-official builder must exist");

  return vm.runInNewContext(
    `${source.slice(start, end)}; buildWispResponsibleOfficials`,
  );
}

test("completed WISPs use saved POO and DSC staff assignments", async () => {
  const buildOfficials = await loadResponsibleOfficialBuilder();
  const officials = buildOfficials({
    staff: [
      {
        wisp_role: "data_security_coordinator",
        full_name: "Dana Security",
        email: "dana@example.test",
      },
      {
        wisp_role: "principal_operating_officer",
        full_name: "Priya Officer",
        email: "priya@example.test",
      },
    ],
  });

  assert.equal(officials.length, 2);
  assert.equal(officials[0].role, "Principal Operating Officer");
  assert.equal(officials[0].name, "Priya Officer");
  assert.equal(officials[0].email, "priya@example.test");
  assert.equal(officials[1].role, "Data Security Coordinator");
  assert.equal(officials[1].name, "Dana Security");
  assert.equal(officials[1].email, "dana@example.test");
});

test("a finalized WISP keeps its recorded officials if staff changes later", async () => {
  const buildOfficials = await loadResponsibleOfficialBuilder();
  const officials = buildOfficials({
    snapshot: [
      {
        wispRole: "principal_operating_officer",
        role: "Principal Operating Officer",
        name: "Original Officer",
        email: "original@example.test",
      },
    ],
    staff: [
      {
        wisp_role: "principal_operating_officer",
        full_name: "Replacement Officer",
        email: "replacement@example.test",
      },
      {
        wisp_role: "data_security_coordinator",
        full_name: "Dana Security",
        email: "dana@example.test",
      },
    ],
  });

  assert.equal(officials[0].name, "Original Officer");
  assert.equal(officials[0].email, "original@example.test");
  assert.equal(officials[1].name, "Dana Security");
});

test("builder assignments take precedence over saved and staff fallbacks", async () => {
  const buildOfficials = await loadResponsibleOfficialBuilder();
  const officials = buildOfficials({
    form: {
      principalOperatingOfficer: "Builder Officer",
      dataSecurityCoordinator: "Builder Coordinator",
    },
    snapshot: [
      {
        wispRole: "principal_operating_officer",
        name: "Saved Officer",
        email: "saved@example.test",
      },
    ],
    staff: [
      {
        wisp_role: "principal_operating_officer",
        full_name: "Staff Officer",
        email: "staff-officer@example.test",
      },
      {
        wisp_role: "data_security_coordinator",
        full_name: "Staff Coordinator",
        email: "staff-coordinator@example.test",
      },
    ],
  });

  assert.equal(officials[0].name, "Builder Officer");
  assert.equal(officials[0].email, "saved@example.test");
  assert.equal(officials[1].name, "Builder Coordinator");
  assert.equal(officials[1].email, "staff-coordinator@example.test");
});
