const assessmentQuestions = [
  {
    domain: "Data Security",
    context: "CPA firms are prime ransomware targets due to the volume of sensitive client financial data they hold.",
    question: "How do staff access client tax files and financial documents?",
    options: [
      { label: "Secure document portal with MFA-protected login", score: 10 },
      { label: "Shared network drive accessible from the office", score: 4 },
      { label: "Email attachments and USB drives", score: 1 },
      { label: "Mix of methods with no standard process", score: 2 },
    ],
  },
  {
    domain: "Data Security",
    context: "Weak credentials are the #1 entry point for breaches in professional services firms.",
    question: "Does your firm enforce Multi-Factor Authentication (MFA) for email, tax software, and client portals?",
    options: [
      { label: "Yes - MFA enforced across all systems", score: 10 },
      { label: "MFA on some systems but not all", score: 5 },
      { label: "MFA available but staff choose whether to use it", score: 2 },
      { label: "No MFA - passwords only", score: 0 },
    ],
  },
  {
    domain: "Data Security",
    context: "The IRS requires all tax professionals to implement a Written Information Security Plan (WISP).",
    question: "Does your firm have a written security policy or Information Security Plan (WISP)?",
    options: [
      { label: "Yes - documented, reviewed annually", score: 10 },
      { label: "Informal policies exist but not formally documented", score: 4 },
      { label: "We are aware of WISP requirements but haven't documented one", score: 1 },
      { label: "No security policy exists", score: 0 },
    ],
  },
  {
    domain: "Backup & Recovery",
    context: "Tax season data loss without a tested backup can be catastrophic for client relationships and firm reputation.",
    question: "How frequently is client data and firm data backed up?",
    options: [
      { label: "Continuous or daily automated backups to cloud + local", score: 10 },
      { label: "Daily automated backups (cloud or local, not both)", score: 7 },
      { label: "Weekly backups - manual process", score: 3 },
      { label: "No formal backup routine", score: 0 },
    ],
  },
  {
    domain: "Backup & Recovery",
    context: "A backup that has never been tested is essentially untested insurance - it may not work when you need it most.",
    question: "Has your firm ever successfully restored data from a backup during a real or simulated incident?",
    options: [
      { label: "Yes - we test restores at least quarterly", score: 10 },
      { label: "Tested once when the backup was first set up", score: 4 },
      { label: "Never tested - we assume it works", score: 1 },
      { label: "We don't have a backup to test", score: 0 },
    ],
  },
  {
    domain: "Backup & Recovery",
    context: "Ransomware can encrypt local and network-attached backups simultaneously if not properly isolated.",
    question: "Are your backups stored separately from your primary systems (air-gapped or cloud-isolated)?",
    options: [
      { label: "Yes - offsite/cloud backup completely separate from network", score: 10 },
      { label: "External drive kept on-site (same location)", score: 3 },
      { label: "Backup on same server or NAS as primary data", score: 1 },
      { label: "Not sure how backups are stored", score: 2 },
    ],
  },
  {
    domain: "Tax Software & Cloud",
    context: "Locally installed tax software creates patch management and backup complexity compared to cloud-hosted solutions.",
    question: "How is your primary tax software (Drake, Lacerte, UltraTax, etc.) hosted?",
    options: [
      { label: "Fully cloud-hosted / SaaS version", score: 9 },
      { label: "Installed on a managed server with remote access", score: 7 },
      { label: "Installed on individual workstations", score: 2 },
      { label: "Mix of local and cloud", score: 5 },
    ],
  },
  {
    domain: "Tax Software & Cloud",
    context: "During tax season, even 2 hours of downtime can result in missed deadlines and client dissatisfaction.",
    question: "What is your firm's plan if your tax software or server became unavailable during tax season?",
    options: [
      { label: "Documented DR plan with tested failover", score: 10 },
      { label: "We'd call IT support and wait for resolution", score: 3 },
      { label: "No plan - we've never thought about it", score: 0 },
      { label: "We use cloud software - unlikely to go down", score: 8 },
    ],
  },
  {
    domain: "Tax Software & Cloud",
    context: "Unmanaged email is the most common vector for phishing attacks targeting client W-2s and financial data.",
    question: "Does your firm use a business email platform with spam/phishing filtering and email archiving?",
    options: [
      { label: "Microsoft 365 or Google Workspace with advanced security", score: 10 },
      { label: "Business email with basic spam filter only", score: 5 },
      { label: "ISP-provided email or free consumer email (Gmail/Yahoo)", score: 0 },
      { label: "Mix - some staff use personal email for work", score: 1 },
    ],
  },
  {
    domain: "Remote Access",
    context: "Remote workers accessing client data without a secure channel are a significant liability for CPA firms.",
    question: "How do staff access firm systems and client data when working remotely?",
    options: [
      { label: "VPN + managed device required for all remote work", score: 10 },
      { label: "Remote desktop or VPN available but not always enforced", score: 5 },
      { label: "Staff access data directly via internet (no VPN)", score: 1 },
      { label: "Remote work not permitted - office only", score: 9 },
    ],
  },
  {
    domain: "Remote Access",
    context: "Unmanaged personal devices used for client work are outside your firm's security perimeter.",
    question: "Do staff use personal (BYOD) devices to access firm email or client data?",
    options: [
      { label: "No - firm-issued and managed devices only", score: 10 },
      { label: "BYOD allowed but with MDM policy enforced", score: 7 },
      { label: "BYOD allowed - no device management policy", score: 1 },
      { label: "Not sure", score: 2 },
    ],
  },
  {
    domain: "Remote Access",
    context: "Outdated workstations running legacy Windows versions can no longer receive security patches.",
    question: "How old are the workstations (PCs/Macs) your staff use daily?",
    options: [
      { label: "Mostly 1-3 years old, running current OS", score: 10 },
      { label: "3-5 years old, mostly up to date", score: 6 },
      { label: "5-7 years old, some still on Windows 10 or older", score: 2 },
      { label: "7+ years old / mixed age fleet", score: 0 },
    ],
  },
  {
    domain: "Compliance",
    context: "The FTC Safeguards Rule (updated 2023) requires tax preparers and financial professionals to maintain a comprehensive security program.",
    question: "Is your firm aware of and compliant with the FTC Safeguards Rule for financial data protection?",
    options: [
      { label: "Yes - we have reviewed and implemented required controls", score: 10 },
      { label: "Aware, but not fully compliant yet", score: 3 },
      { label: "Heard of it but haven't taken action", score: 1 },
      { label: "Not familiar with this requirement", score: 0 },
    ],
  },
  {
    domain: "Compliance",
    context: "IRS Publication 4557 outlines specific cybersecurity recommendations for tax professionals.",
    question: "Has your firm completed an IRS-recommended cybersecurity review (based on Pub 4557 or equivalent)?",
    options: [
      { label: "Yes - reviewed and controls implemented", score: 10 },
      { label: "Reviewed but not fully implemented", score: 4 },
      { label: "Not completed a formal review", score: 0 },
      { label: "Not aware of this requirement", score: 0 },
    ],
  },
  {
    domain: "Compliance",
    context: "Human error - such as clicking a phishing link - accounts for over 80% of data breaches in professional services.",
    question: "Do staff receive regular cybersecurity awareness training specific to tax and accounting risks (phishing, W-2 fraud, etc.)?",
    options: [
      { label: "Yes - structured training at least annually with simulations", score: 10 },
      { label: "Occasional informal reminders via email", score: 3 },
      { label: "Training happened once during onboarding only", score: 2 },
      { label: "No cybersecurity training provided", score: 0 },
    ],
  },
  {
    domain: "IT Support",
    context: "Break-fix IT support means you only get help after a problem impacts the firm - often during the worst possible time.",
    question: "How is your firm's IT currently managed day-to-day?",
    options: [
      { label: "Proactive managed services with 24/7 monitoring", score: 10 },
      { label: "Break-fix vendor - we call when something breaks", score: 2 },
      { label: "Internal tech-savvy staff member handles IT", score: 3 },
      { label: "Staff figure it out themselves", score: 0 },
    ],
  },
  {
    domain: "IT Support",
    context: "Tax season downtime during April 15 deadlines can cost CPA firms thousands per hour in lost productivity.",
    question: "Does your firm have a documented IT disaster recovery plan specifically covering tax season continuity?",
    options: [
      { label: "Yes - documented and tested plan covering peak season", score: 10 },
      { label: "General IT plan exists but not tax-season specific", score: 5 },
      { label: "No formal plan - we'd improvise", score: 1 },
      { label: "We rely on our IT vendor to handle it", score: 3 },
    ],
  },
  {
    domain: "IT Support",
    context: "Without proper offboarding, ex-employees may retain access to client financial data indefinitely.",
    question: "Does your firm have a formal process to revoke IT access when staff leave or change roles?",
    options: [
      { label: "Yes - immediate revocation procedure, consistently followed", score: 10 },
      { label: "We revoke access but it's informal and sometimes delayed", score: 4 },
      { label: "No formal process - we try to remember", score: 1 },
      { label: "We've had former staff with lingering access", score: 0 },
    ],
  },
  {
    domain: "IT Support",
    context: "Cyber insurance for professional services firms often requires documented security controls at renewal.",
    question: "Does your firm carry cyber liability insurance, and are your IT controls documented for renewal?",
    options: [
      { label: "Yes - cyber insurance with documented controls", score: 10 },
      { label: "Cyber insurance but controls not formally documented", score: 5 },
      { label: "No cyber liability insurance", score: 0 },
      { label: "Not sure if our general liability covers cyber incidents", score: 2 },
    ],
  },
  {
    domain: "IT Support",
    context: "Unpatched systems are the second most common cause of breaches - patches must be applied within 30 days of release.",
    question: "How are software updates and security patches applied across firm computers and servers?",
    options: [
      { label: "Automated patch management via RMM tool", score: 10 },
      { label: "IT reminds staff to update - mostly manual", score: 4 },
      { label: "Updates happen when staff notice them", score: 1 },
      { label: "We rarely patch - concerned about breaking software", score: 0 },
    ],
  },
];

const sections = ["Practice Overview", ...assessmentQuestions.map((_, index) => `Question ${index + 1}`)];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  mobilePhone: "",
  companyName: "",
  officePhone: "",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
};

assessmentQuestions.forEach((_, index) => {
  initialForm[`question_${index + 1}`] = "";
});

let state = {
  screen: "welcome",
  sectionIndex: 0,
  form: structuredClone(initialForm),
  errors: {},
};

const options = {
  states: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"],
};

const domainRecommendations = {
  "Data Security": "Standardize secure document access, enforce MFA everywhere, and formalize the firm's written security program.",
  "Backup & Recovery": "Move to automated, isolated backups and test restore procedures on a recurring schedule.",
  "Tax Software & Cloud": "Harden the firm's tax software stack with resilient hosting, documented continuity steps, and managed business email.",
  "Remote Access": "Restrict remote access to managed devices and secure channels, then retire high-risk BYOD and aging endpoints.",
  Compliance: "Document required controls, complete the relevant IRS and FTC reviews, and make training part of routine operations.",
  "IT Support": "Shift from reactive support to documented, proactive IT operations with patching, offboarding, continuity, and renewal evidence.",
};

const app = document.getElementById("app");

function setState(next) {
  state = { ...state, ...next };
  render();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function attr(value) {
  return escapeHtml(value).replaceAll("'", "&#039;");
}

function field(name, label, type = "text", helper = "", placeholder = "", optional = false) {
  const value = state.form[name] ?? "";
  const error = state.errors[name];
  return `
    <label class="field">
      <span class="label">${label} ${optional ? '<span class="optional">Optional</span>' : "*"}</span>
      <input class="input ${error ? "error-field" : ""}" type="${type}" value="${attr(value)}" placeholder="${attr(placeholder)}" data-field="${name}" />
      ${helper ? `<span class="field-help">${helper}</span>` : ""}
      <span class="error ${error ? "is-visible" : ""}">${error || ""}</span>
    </label>
  `;
}

function select(name, label, choices, helper = "", placeholder = "Select...") {
  const value = state.form[name] ?? "";
  const error = state.errors[name];
  return `
    <label class="field">
      <span class="label">${label} *</span>
      <select class="select ${error ? "error-field" : ""}" data-field="${name}">
        <option value="">${placeholder}</option>
        ${choices.map((choice) => `<option value="${attr(choice)}" ${value === choice ? "selected" : ""}>${choice}</option>`).join("")}
      </select>
      ${helper ? `<span class="field-help">${helper}</span>` : ""}
      <span class="error ${error ? "is-visible" : ""}">${error || ""}</span>
    </label>
  `;
}

function card(title, body, helper = "", extra = "") {
  return `
    <section class="card pad ${extra}">
      <div class="card-head">
        <div class="card-title-block">
          <h3>${title}</h3>
          ${helper ? `<p>${helper}</p>` : ""}
        </div>
      </div>
      ${body}
    </section>
  `;
}

function screenHeader(title, intro, stepText = "") {
  return `
    <div class="screen-head">
      <div>
        <p class="eyebrow">${stepText || `Section ${state.sectionIndex + 1}`}</p>
        <h1>${title}</h1>
        <p class="lead">${intro}</p>
      </div>
      <span class="section-step-pill">${state.screen === "assessment" ? `Section ${state.sectionIndex + 1} of ${sections.length}` : "Assessment"}</span>
    </div>
    <div class="notice is-hidden" id="sectionNotice">Please complete the required fields before continuing.</div>
  `;
}

function footer(primary) {
  return `
    <div class="footer-actions">
      <button class="btn secondary" data-action="back" type="button">Back</button>
      <div class="action-cluster">
        <span class="save-state"><span class="save-dot"></span> Saved just now</span>
        <button class="btn primary" data-action="next" type="button">${primary}</button>
      </div>
    </div>
  `;
}

function topbar() {
  return `
    <header class="topbar">
      <div class="brand"><span class="brand-mark">EW</span><span>EasyWISP</span></div>
      <div class="topbar-actions">
        <span class="save-state"><span class="save-dot"></span> Saved just now</span>
        <button class="btn secondary small" type="button">Save & exit</button>
      </div>
    </header>
  `;
}

function shell(content, wide = false) {
  return `
    <div class="workspace">
      ${progressRail()}
      <main class="content">
        <div class="content-inner ${wide ? "wide" : ""}">
          ${content}
        </div>
      </main>
    </div>
  `;
}

function welcomeScreen() {
  return `
    <main class="welcome">
      <section class="welcome-hero-band">
        <div class="welcome-hero-copy">
          <p class="dark-eyebrow">WISP readiness review</p>
          <h1><span>Review your firm's</span><span>WISP readiness</span></h1>
          <p>Keep the firm overview you already had, then move through 20 focused IT and security questions pulled into their own sections.</p>
          <div class="action-cluster">
            <button class="btn primary dark-cta" data-action="start">Start assessment</button>
            <button class="btn secondary dark-secondary" data-action="resume">Resume saved assessment</button>
          </div>
        </div>
        <aside class="hero-utility-card">
          <div class="utility-row"><span>Estimated time</span><strong>10-15 min</strong></div>
          <div class="utility-row"><span>Review before scoring</span><strong>Included</strong></div>
          <div class="utility-row"><span>Total sections</span><strong>${sections.length}</strong></div>
          <div class="utility-row"><span>Imported questions</span><strong>${assessmentQuestions.length}</strong></div>
        </aside>
      </section>

      <section class="welcome-lower">
        <article class="briefing-panel">
          <p class="eyebrow">Assessment output</p>
          <div class="briefing-main">
            <div>
              <h3>What the assessment produces</h3>
              <p>The report converts your answers into a readiness score, domain-level signals, and prioritized follow-up actions for your WISP work.</p>
            </div>
            <div class="briefing-rows">
              <div class="briefing-row">
                <span class="briefing-index">01</span>
                <div>
                  <strong>Readiness score</strong>
                  <p>An overall score based on the 20 imported assessment questions.</p>
                </div>
              </div>
              <div class="briefing-row">
                <span class="briefing-index">02</span>
                <div>
                  <strong>Question findings</strong>
                  <p>Weak answers surface the exact areas that need attention first.</p>
                </div>
              </div>
              <div class="briefing-row">
                <span class="briefing-index">03</span>
                <div>
                  <strong>Prioritized improvements</strong>
                  <p>Recommendations are grouped by urgency so the next steps are obvious.</p>
                </div>
              </div>
            </div>
          </div>
        </article>
        <aside class="briefing-side">
          <section class="briefing-note">
            <h3>Before you begin</h3>
            <p>Best completed by someone familiar with firm systems, backups, remote access, and day-to-day IT operations.</p>
          </section>
          <section class="briefing-note">
            <h3>What changed</h3>
            <p>Section 1 stays intact. Every remaining section is now one imported question from the CPA IT assessment.</p>
          </section>
          <section class="briefing-note briefing-action">
            <h3>Continue when ready</h3>
            <p>Complete all ${sections.length} sections, review answers, then generate the report.</p>
            <button class="btn secondary small" data-action="start">Begin assessment</button>
          </section>
        </aside>
      </section>
    </main>
  `;
}

function progressRail() {
  const totalSections = sections.length;
  const completedCount = state.screen === "review" || state.screen === "results" ? totalSections : state.sectionIndex;
  const percent = state.screen === "results" || state.screen === "review" ? 100 : Math.round(((state.sectionIndex + 1) / totalSections) * 100);
  return `
    <aside class="progress-rail">
      <div>
        <p class="rail-kicker">Assessment</p>
        <div class="progress-list">
          ${sections
            .map((section, index) => {
              const active = state.screen === "assessment" && state.sectionIndex === index;
              const complete = index < completedCount || state.screen === "review" || state.screen === "results";
              return `
                <button class="progress-item ${active ? "is-active" : ""} ${complete ? "is-complete" : ""}" data-jump-section="${index}">
                  <span class="step-num">${String(index + 1).padStart(2, "0")}</span>
                  <span>${section}</span>
                  <span class="step-status">${complete ? "✓" : active ? "●" : ""}</span>
                </button>
              `;
            })
            .join("")}
        </div>
      </div>
      <div class="rail-card">
        <div class="rail-meta">
          <strong>${state.screen === "results" ? "Completed" : state.screen === "review" ? "Ready for results" : `Step ${state.sectionIndex + 1} of ${totalSections}`}</strong>
          <div class="rail-meter"><span style="width:${percent}%"></span></div>
          <span>${percent}% complete</span>
          <span>${state.screen === "results" ? "Assessment completed" : state.screen === "review" ? "Review before scoring" : `About ${Math.max(1, totalSections - state.sectionIndex)} min left`}</span>
        </div>
      </div>
    </aside>
  `;
}

function practiceOverview() {
  return `
    ${screenHeader("Practice Overview", "Tell us who is completing the assessment and which firm this readiness review applies to.")}
    <div class="card-grid">
      ${card("Primary Contact", `
        <div class="field-grid two">
          ${field("firstName", "First Name")}
          ${field("lastName", "Last Name")}
          ${field("email", "Email", "email", "Used for assessment delivery and follow-up.")}
          ${field("mobilePhone", "Mobile Phone", "tel")}
        </div>
      `)}
      ${card("Company", `
        <div class="field-grid two">
          ${field("companyName", "Company Name")}
          ${field("officePhone", "Office Phone", "tel", "", "", true)}
        </div>
      `)}
      ${card("Business Address", `
        <div class="field-grid">
          ${field("streetAddress", "Street Address")}
          <div class="field-grid three">
            ${field("city", "City")}
            ${select("state", "State", options.states, "", "State")}
            ${field("postalCode", "Postal Code")}
          </div>
        </div>
      `)}
    </div>
    ${footer("Continue")}
  `;
}

function questionScreen(questionIndex) {
  const item = assessmentQuestions[questionIndex];
  const fieldName = `question_${questionIndex + 1}`;
  const currentValue = state.form[fieldName];
  const error = state.errors[fieldName];
  const optionRows = item.options
    .map(
      (option) => `
        <label class="choice">
          <input type="radio" name="${fieldName}" value="${attr(option.label)}" ${currentValue === option.label ? "checked" : ""} data-radio="${fieldName}" />
          <span>${option.label}</span>
        </label>
      `,
    )
    .join("");

  return `
    ${screenHeader(item.question, item.context, `Section ${questionIndex + 2} · ${item.domain}`)}
    <div class="card-grid">
      ${card(
        item.domain,
        `
          <div class="field">
            <span class="label">Choose the answer that best matches your current environment. *</span>
            <div class="choice-grid">
              ${optionRows}
            </div>
            <span class="error ${error ? "is-visible" : ""}">${error || ""}</span>
          </div>
        `,
        "Each imported question now lives in its own section.",
      )}
    </div>
    ${footer(questionIndex === assessmentQuestions.length - 1 ? "Review Answers" : "Continue")}
  `;
}

function assessmentScreen() {
  if (state.sectionIndex === 0) return shell(practiceOverview());
  return shell(questionScreen(state.sectionIndex - 1));
}

function reviewScreen() {
  const result = scoreAssessment();
  return shell(
    `
      ${screenHeader("Review your answers", "Confirm your information before generating your readiness results.", "Review")}
      <section class="card pad">
        <div class="card-head">
          <div class="card-title-block">
            <h3>Assessment Status</h3>
            <p>Review status: ${sections.length} sections complete. ${result.flags.length} items may need attention in your results.</p>
          </div>
          <span class="badge complete">No required fields missing</span>
        </div>
      </section>
      <div class="review-grid">
        ${sections.map((section, index) => reviewCard(section, index)).join("")}
      </div>
      <div class="footer-actions">
        <button class="btn secondary" data-action="back-to-last" type="button">Back</button>
        <div class="action-cluster">
          <span class="save-state"><span class="save-dot"></span> Saved just now</span>
          <button class="btn primary" data-action="results" type="button">Generate Results</button>
        </div>
      </div>
    `,
    true,
  );
}

function reviewCard(title, index) {
  const result = scoreAssessment();
  const sectionFlags = result.flags.filter((flag) => flag.sectionIndex === index);
  const rows = reviewRows(index);
  return `
    <section class="review-card ${sectionFlags.length ? "is-attention" : ""}">
      <div class="review-card-head">
        <div>
          <h3>${title}</h3>
          ${sectionFlags.length ? '<span class="badge attention">Needs attention</span>' : '<span class="badge complete">Complete</span>'}
        </div>
        <button class="btn secondary small" data-edit-section="${index}" type="button">Edit</button>
      </div>
      <div class="review-items">
        ${rows.map(([label, value]) => `<div class="review-row"><span class="review-label">${label}</span><span class="review-value">${escapeHtml(formatValue(value))}</span></div>`).join("")}
      </div>
    </section>
  `;
}

function reviewRows(index) {
  if (index === 0) {
    return [
      ["Contact", `${state.form.firstName} ${state.form.lastName}`.trim()],
      ["Company", state.form.companyName],
      ["Email", state.form.email],
      ["Address", `${state.form.streetAddress}, ${state.form.city}, ${state.form.state} ${state.form.postalCode}`],
    ];
  }

  const item = assessmentQuestions[index - 1];
  return [
    ["Domain", item.domain],
    ["Question", item.question],
    ["Answer", state.form[`question_${index}`]],
  ];
}

function formatValue(value) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not provided";
  return value || "Not provided";
}

function severityClass(label) {
  if (label.includes("High") || label.includes("Immediate")) return "high";
  if (label.includes("Developing") || label.includes("Needs")) return "medium";
  return "good";
}

function scoreLabel(score) {
  if (score < 55) return "High priority";
  if (score < 75) return "Needs attention";
  if (score < 90) return "Developing";
  return "Complete";
}

function recommendationBlock(title, items) {
  return `
    <div class="recommendation" style="margin-bottom:12px">
      <h3>${title}</h3>
      <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>
  `;
}

function resultsScreen() {
  const result = scoreAssessment();
  return shell(
    `
      <div class="screen-head">
        <div>
          <p class="eyebrow">Assessment Report</p>
          <h1>WISP readiness report</h1>
          <p class="lead">Prepared from the questionnaire answers submitted for this firm. Scores indicate readiness signals and items to review, not certification.</p>
        </div>
        <span class="section-step-pill">Completed</span>
      </div>
      <div class="results">
        <div class="kpi-grid">
          <section class="card pad">
            <div class="card-title-block">
              <h3>Overall readiness score</h3>
              <p>Calculated from the 20 imported assessment questions.</p>
            </div>
            <div class="score-number">${result.overall}<span>out of 100</span></div>
            <span class="severity ${severityClass(result.label)}">${result.label}</span>
            <p class="muted" style="margin-top:14px;margin-bottom:0">${result.summary}</p>
          </section>
          <section class="card pad">
            <div class="card-title-block">
              <h3>Assessment findings</h3>
              <p>Key review points surfaced by current answers.</p>
            </div>
            <div class="risk-list">
              <div class="risk-row"><span>Rating</span><strong>${result.label}</strong></div>
              <div class="risk-row"><span>Key risks found</span><strong>${result.riskCount}</strong></div>
              <div class="risk-row"><span>Highest priority area</span><strong>${result.topArea}</strong></div>
            </div>
          </section>
        </div>

        <section class="card pad">
          <div class="card-head">
            <div class="card-title-block">
              <h3>Section readiness</h3>
              <p>Scores map to the 21 current assessment sections.</p>
            </div>
          </div>
          <div class="score-table">
            ${result.sectionScores
              .map(
                (row) => `
                  <div class="score-row">
                    <strong>${row.name}</strong>
                    <div class="bar ${row.score < 55 ? "risk" : row.score < 75 ? "warn" : ""}"><span style="width:${row.score}%"></span></div>
                    <span class="severity ${row.score < 55 ? "high" : row.score < 75 ? "medium" : "good"}">${row.score} · ${scoreLabel(row.score)}</span>
                  </div>
                `,
              )
              .join("")}
          </div>
        </section>

        <div class="split-results">
          <section class="card pad">
            <div class="card-head">
              <div class="card-title-block">
                <h3>Top weaknesses</h3>
                <p>Readiness gaps that should be reviewed first.</p>
              </div>
            </div>
            <div class="weakness-list">
              ${result.displayFlags
                .slice(0, 5)
                .map(
                  (flag, index) => `
                    <div class="weakness">
                      <div class="weakness-top">
                        <div>
                          <div class="weakness-title">${index + 1}. ${flag.title}</div>
                          <p>${flag.area}</p>
                        </div>
                        <span class="severity ${flag.priority === "Immediate" ? "high" : "medium"}">${flag.priority}</span>
                      </div>
                      <p>${flag.fix}</p>
                    </div>
                  `,
                )
                .join("")}
            </div>
          </section>
          <section class="card pad">
            <div class="card-head">
              <div class="card-title-block">
                <h3>Prioritized Recommendations</h3>
                <p>Recommended actions grouped by timing.</p>
              </div>
            </div>
            ${recommendationBlock("Immediate", result.recommendations.immediate)}
            ${recommendationBlock("Within 30 Days", result.recommendations.thirty)}
            ${recommendationBlock("Within 90 Days", result.recommendations.ninety)}
          </section>
        </div>

        <section class="card pad">
          <div class="card-title-block">
            <h3>Assessment summary</h3>
            <p>${result.narrative}</p>
          </div>
        </section>

        <div class="footer-actions">
          <button class="btn secondary" data-action="review" type="button">Update Answers</button>
          <button class="btn primary" data-action="view-summary" type="button">View Submitted Answers</button>
        </div>
      </div>
    `,
    true,
  );
}

function evaluateAssessment() {
  const sectionScores = [{ name: sections[0], score: 100 }];
  const flags = [];

  assessmentQuestions.forEach((item, index) => {
    const fieldName = `question_${index + 1}`;
    const selected = item.options.find((option) => option.label === state.form[fieldName]);
    const maxScore = Math.max(...item.options.map((option) => option.score)) || 10;
    const rawScore = selected ? selected.score : 0;
    const normalized = Math.round((rawScore / maxScore) * 100);
    sectionScores.push({ name: sections[index + 1], score: normalized });

    if (!selected) return;

    let priority = "";
    if (normalized <= 25) priority = "Immediate";
    else if (normalized <= 55) priority = "30 days";
    else if (normalized <= 75) priority = "90 days";

    if (priority) {
      flags.push({
        sectionIndex: index + 1,
        title: item.question,
        area: item.domain,
        priority,
        fix: domainRecommendations[item.domain] || "Review and document the safeguards behind this answer.",
      });
    }
  });

  const questionScores = sectionScores.slice(1).map((row) => row.score);
  const overall = questionScores.length ? Math.round(questionScores.reduce((sum, score) => sum + score, 0) / questionScores.length) : 0;
  const label = overall < 40 ? "High Risk" : overall < 60 ? "Needs Immediate Improvement" : overall < 75 ? "Developing" : overall < 90 ? "Mostly Prepared" : "Strong";
  const sortedFlags = [...flags].sort((a, b) => {
    const order = { Immediate: 0, "30 days": 1, "90 days": 2 };
    return (order[a.priority] ?? 9) - (order[b.priority] ?? 9);
  });
  const weakest = [...sectionScores.slice(1)].sort((a, b) => a.score - b.score).slice(0, 3).map((row) => row.name);
  const topArea = sortedFlags[0]?.area || "No high-priority area identified";
  const immediateCount = sortedFlags.filter((flag) => flag.priority === "Immediate").length;
  const displayFlags = sortedFlags.length
    ? sortedFlags
    : [{ title: "No critical weaknesses detected", area: "Assessment-wide", priority: "90 days", fix: "Continue maintaining documented safeguards and review answers periodically." }];

  let summary = "The submitted answers indicate a stronger readiness posture with only a small number of items to confirm or formalize.";
  if (immediateCount) {
    summary = `${immediateCount} immediate-priority item${immediateCount === 1 ? "" : "s"} surfaced from the current answers, led by ${weakest.slice(0, 2).join(" and ")}.`;
  } else if (weakest.length && overall < 90) {
    summary = `The weakest areas in the current answers are ${weakest.slice(0, 2).join(" and ")}, even though several safeguards are already in place.`;
  }

  const narrative = immediateCount
    ? "This readiness report is based on the firm's submitted answers across the imported CPA IT questions. The highest-pressure items point to areas where controls should be corrected and documented before being treated as mature safeguards."
    : "This readiness report is based on the firm's submitted answers across security, backup, cloud, remote access, compliance, and IT support. The answers indicate a more developed posture overall, but lower-scoring items should still be reviewed and documented before being treated as mature safeguards.";

  return {
    overall,
    label,
    sectionScores,
    flags: sortedFlags,
    displayFlags,
    riskCount: sortedFlags.length,
    topArea,
    recommendations: {
      immediate: recommendationItems(sortedFlags, "Immediate", ["Address the lowest-scoring questions first, especially around MFA, backup recovery, compliance, and patching."]),
      thirty: recommendationItems(sortedFlags, "30 days", ["Document repeatable operational controls for the answers that landed in the middle of the range."]),
      ninety: recommendationItems(sortedFlags, "90 days", ["Use the stronger answers as a baseline and formalize remaining process gaps across the environment."]),
    },
    summary,
    narrative,
  };
}

function recommendationItems(flags, priority, fallback) {
  const items = flags.filter((flag) => flag.priority === priority).map((flag) => flag.fix);
  return [...new Set(items)].slice(0, 4).concat(items.length ? [] : fallback);
}

function scoreAssessment() {
  return evaluateAssessment();
}

function goBack() {
  if (state.sectionIndex > 0) return setState({ sectionIndex: state.sectionIndex - 1, errors: {} });
  return setState({ screen: "welcome", errors: {} });
}

function goNext() {
  if (!validateCurrent()) {
    const notice = document.getElementById("sectionNotice");
    if (notice) notice.classList.remove("is-hidden");
    return;
  }

  if (state.sectionIndex < sections.length - 1) return setState({ sectionIndex: state.sectionIndex + 1, errors: {} });
  setState({ screen: "review", errors: {} });
}

function validateCurrent() {
  const errors = {};

  if (state.sectionIndex === 0) {
    ["firstName", "lastName", "email", "mobilePhone", "companyName", "streetAddress", "city", "state", "postalCode"].forEach((fieldName) => {
      if (!state.form[fieldName]) errors[fieldName] = "This field is required.";
    });
    if (state.form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.form.email)) errors.email = "Enter a valid email address.";
  } else {
    const fieldName = `question_${state.sectionIndex}`;
    if (!state.form[fieldName]) errors[fieldName] = "Please select an answer before continuing.";
  }

  state.errors = errors;
  render();
  return Object.keys(errors).length === 0;
}

function bindEvents() {
  document.querySelectorAll("[data-field]").forEach((element) => {
    const handler = (event) => {
      state.form[event.target.dataset.field] = event.target.value;
      delete state.errors[event.target.dataset.field];
    };
    element.addEventListener("input", handler);
    element.addEventListener("change", handler);
  });

  document.querySelectorAll("[data-radio]").forEach((element) => {
    element.addEventListener("change", (event) => {
      state.form[event.target.dataset.radio] = event.target.value;
      delete state.errors[event.target.dataset.radio];
      render();
    });
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button.dataset.action));
  });

  document.querySelectorAll("[data-jump-section]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.screen === "assessment") setState({ sectionIndex: Number(button.dataset.jumpSection), errors: {} });
    });
  });

  document.querySelectorAll("[data-edit-section]").forEach((button) => {
    button.addEventListener("click", () => setState({ screen: "assessment", sectionIndex: Number(button.dataset.editSection), errors: {} }));
  });
}

function handleAction(action) {
  if (action === "start" || action === "resume") setState({ screen: "assessment", sectionIndex: 0, errors: {} });
  if (action === "back") goBack();
  if (action === "next") goNext();
  if (action === "back-to-last") setState({ screen: "assessment", sectionIndex: sections.length - 1, errors: {} });
  if (action === "results") setState({ screen: "results", errors: {} });
  if (action === "review") setState({ screen: "review", errors: {} });
  if (action === "view-summary") setState({ screen: "review", errors: {} });
}

function applyMotionStagger() {
  [".progress-item", ".card", ".review-card", ".weakness", ".recommendation", ".score-row"].forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.style.setProperty("--stagger", String(Math.min(index, 10)));
    });
  });
}

function render() {
  const body =
    state.screen === "welcome"
      ? welcomeScreen()
      : state.screen === "review"
        ? reviewScreen()
        : state.screen === "results"
          ? resultsScreen()
          : assessmentScreen();

  app.innerHTML = `
    <div class="app">
      <div class="shell">
        ${state.screen === "welcome" ? "" : topbar()}
        ${body}
      </div>
    </div>
  `;

  applyMotionStagger();
  bindEvents();
}

render();
