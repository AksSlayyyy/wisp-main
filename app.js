let deleteDocument = async () => {};
let fetchBootstrapState = async () => null;
let hasSupabaseAuth = () => false;
let getCurrentAccessToken = async () => "";
let signedWispPdfRefreshPromise = null;
let saveRiskAssessmentDraft = async () => null;
let saveWispDraft = async () => null;
let finalizeWispBuild = async () => null;
let activateWispProject = async () => null;
let saveWispSignature = async () => {
  throw new Error("WISP signature saving is not available yet.");
};
let createWispAcknowledgementRequests = async () => {
  throw new Error("Acknowledgement requests are not available yet.");
};
let fetchPublicWispAcknowledgementRequest = async () => {
  throw new Error("Acknowledgement requests are not available yet.");
};
let completePublicWispAcknowledgementRequest = async () => {
  throw new Error("Acknowledgement requests are not available yet.");
};
let getWispPdfPreviewUrl = async () => null;
let fetchWispAcknowledgementRequests = async () => [];
let removeWispAcknowledgementRequest = async () => [];
let uploadWispAttachments = async () => [];
let deleteWispAttachment = async () => {};
let reorderWispAttachments = async () => {};
let deleteWispProject = async () => {};
let supabaseBackendLoaded = false;
let signInWithMagicLink = async () => {};
let signInWithPassword = async () => {};
let signUpWithPassword = async () => {};
let signOutCurrentUser = async () => {};
let subscribeToAuthChanges = () => () => {};
let uploadCompanyLogo = async () => null;
let removeCompanyLogo = async () => null;
let saveFirmProfile = async () => null;
let completeFirmOnboarding = async () => null;
let saveFirmOnboardingProgress = async () => null;
let resetFirmOnboardingForTesting = async () => null;
let onboardingLogoFile = null;
let onboardingLogoPreviewUrl = null;
const MAX_COMPANY_LOGO_BYTES = 5 * 1024 * 1024;
let updateWorkspaceAuthProfile = async () => null;
let saveFirmStaffMember = async () => null;
let deleteFirmStaffMember = async () => null;
let uploadDocuments = async () => [];
let saveDocumentWorkspaces = async () => null;
let saveWorkspaceSettings = async () => null;
let saveTerminatedEmployeeChecklist = async () => null;
let exportTerminatedEmployeeChecklistPdf = async () => null;
let saveRecordRetentionPolicy = async () => null;
let exportRecordRetentionPolicyPdf = async () => null;
let saveDisasterRecoveryPlan = async () => null;
let exportDisasterRecoveryPlanPdf = async () => null;
let saveIncidentReport = async () => null;
let exportIncidentReportPdf = async () => null;
let saveDataBreachResponseGuideline = async () => null;
let exportDataBreachResponseGuidelinePdf = async () => null;
let saveDataBreachNotificationLetter = async () => null;
let exportDataBreachNotificationLetterPdf = async () => null;
let flushDocumentWorkspacesKeepalive = () => {};
let saveSpecialDocumentInstances = async () => null;
let saveTrainingSignInSheet = async () => null;
let fetchTrainingSignInSheet = async () => null;
const assessmentQuestions = [
  {
    domain: "Data Security",
    context:
      "CPA firms are prime ransomware targets due to the volume of sensitive client financial data they hold.",
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
    context:
      "Weak credentials are the #1 entry point for breaches in professional services firms.",
    question:
      "Does your firm enforce Multi-Factor Authentication (MFA) for email, tax software, and client portals?",
    options: [
      { label: "Yes - MFA enforced across all systems", score: 10 },
      { label: "MFA on some systems but not all", score: 5 },
      { label: "MFA available but staff choose whether to use it", score: 2 },
      { label: "No MFA - passwords only", score: 0 },
    ],
  },
  {
    domain: "Data Security",
    context:
      "The IRS requires all tax professionals to implement a Written Information Security Plan (WISP).",
    question:
      "Does your firm have a written security policy or Information Security Plan (WISP)?",
    options: [
      { label: "Yes - documented, reviewed annually", score: 10 },
      {
        label: "Informal policies exist but not formally documented",
        score: 4,
      },
      {
        label: "We are aware of WISP requirements but haven't documented one",
        score: 1,
      },
      { label: "No security policy exists", score: 0 },
    ],
  },
  {
    domain: "Backup & Recovery",
    context:
      "Tax season data loss without a tested backup can be catastrophic for client relationships and firm reputation.",
    question: "How frequently is client data and firm data backed up?",
    options: [
      {
        label: "Continuous or daily automated backups to cloud + local",
        score: 10,
      },
      { label: "Daily automated backups (cloud or local, not both)", score: 7 },
      { label: "Weekly backups - manual process", score: 3 },
      { label: "No formal backup routine", score: 0 },
    ],
  },
  {
    domain: "Backup & Recovery",
    context:
      "A backup that has never been tested is essentially untested insurance - it may not work when you need it most.",
    question:
      "Has your firm ever successfully restored data from a backup during a real or simulated incident?",
    options: [
      { label: "Yes - we test restores at least quarterly", score: 10 },
      { label: "Tested once when the backup was first set up", score: 4 },
      { label: "Never tested - we assume it works", score: 1 },
      { label: "We don't have a backup to test", score: 0 },
    ],
  },
  {
    domain: "Backup & Recovery",
    context:
      "Ransomware can encrypt local and network-attached backups simultaneously if not properly isolated.",
    question:
      "Are your backups stored separately from your primary systems (air-gapped or cloud-isolated)?",
    options: [
      {
        label: "Yes - offsite/cloud backup completely separate from network",
        score: 10,
      },
      { label: "External drive kept on-site (same location)", score: 3 },
      { label: "Backup on same server or NAS as primary data", score: 1 },
      { label: "Not sure how backups are stored", score: 2 },
    ],
  },
  {
    domain: "Tax Software & Cloud",
    context:
      "Locally installed tax software creates patch management and backup complexity compared to cloud-hosted solutions.",
    question:
      "How is your primary tax software (Drake, Lacerte, UltraTax, etc.) hosted?",
    options: [
      { label: "Fully cloud-hosted / SaaS version", score: 9 },
      { label: "Installed on a managed server with remote access", score: 7 },
      { label: "Installed on individual workstations", score: 2 },
      { label: "Mix of local and cloud", score: 5 },
    ],
  },
  {
    domain: "Tax Software & Cloud",
    context:
      "During tax season, even 2 hours of downtime can result in missed deadlines and client dissatisfaction.",
    question:
      "What is your firm's plan if your tax software or server became unavailable during tax season?",
    options: [
      { label: "Documented DR plan with tested failover", score: 10 },
      { label: "We'd call IT support and wait for resolution", score: 3 },
      { label: "No plan - we've never thought about it", score: 0 },
      { label: "We use cloud software - unlikely to go down", score: 8 },
    ],
  },
  {
    domain: "Tax Software & Cloud",
    context:
      "Unmanaged email is the most common vector for phishing attacks targeting client W-2s and financial data.",
    question:
      "Does your firm use a business email platform with spam/phishing filtering and email archiving?",
    options: [
      {
        label: "Microsoft 365 or Google Workspace with advanced security",
        score: 10,
      },
      { label: "Business email with basic spam filter only", score: 5 },
      {
        label: "ISP-provided email or free consumer email (Gmail/Yahoo)",
        score: 0,
      },
      { label: "Mix - some staff use personal email for work", score: 1 },
    ],
  },
  {
    domain: "Remote Access",
    context:
      "Remote workers accessing client data without a secure channel are a significant liability for CPA firms.",
    question:
      "How do staff access firm systems and client data when working remotely?",
    options: [
      { label: "VPN + managed device required for all remote work", score: 10 },
      {
        label: "Remote desktop or VPN available but not always enforced",
        score: 5,
      },
      { label: "Staff access data directly via internet (no VPN)", score: 1 },
      { label: "Remote work not permitted - office only", score: 9 },
    ],
  },
  {
    domain: "Remote Access",
    context:
      "Unmanaged personal devices used for client work are outside your firm's security perimeter.",
    question:
      "Do staff use personal (BYOD) devices to access firm email or client data?",
    options: [
      { label: "No - firm-issued and managed devices only", score: 10 },
      { label: "BYOD allowed but with MDM policy enforced", score: 7 },
      { label: "BYOD allowed - no device management policy", score: 1 },
      { label: "Not sure", score: 2 },
    ],
  },
  {
    domain: "Remote Access",
    context:
      "Outdated workstations running legacy Windows versions can no longer receive security patches.",
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
    context:
      "The FTC Safeguards Rule (updated 2023) requires tax preparers and financial professionals to maintain a comprehensive security program.",
    question:
      "Is your firm aware of and compliant with the FTC Safeguards Rule for financial data protection?",
    options: [
      {
        label: "Yes - we have reviewed and implemented required controls",
        score: 10,
      },
      { label: "Aware, but not fully compliant yet", score: 3 },
      { label: "Heard of it but haven't taken action", score: 1 },
      { label: "Not familiar with this requirement", score: 0 },
    ],
  },
  {
    domain: "Compliance",
    context:
      "IRS Publication 4557 outlines specific cybersecurity recommendations for tax professionals.",
    question:
      "Has your firm completed an IRS-recommended cybersecurity review (based on Pub 4557 or equivalent)?",
    options: [
      { label: "Yes - reviewed and controls implemented", score: 10 },
      { label: "Reviewed but not fully implemented", score: 4 },
      { label: "Not completed a formal review", score: 0 },
      { label: "Not aware of this requirement", score: 0 },
    ],
  },
  {
    domain: "Compliance",
    context:
      "Human error - such as clicking a phishing link - accounts for over 80% of data breaches in professional services.",
    question:
      "Do staff receive regular cybersecurity awareness training specific to tax and accounting risks (phishing, W-2 fraud, etc.)?",
    options: [
      {
        label: "Yes - structured training at least annually with simulations",
        score: 10,
      },
      { label: "Occasional informal reminders via email", score: 3 },
      { label: "Training happened once during onboarding only", score: 2 },
      { label: "No cybersecurity training provided", score: 0 },
    ],
  },
  {
    domain: "IT Support",
    context:
      "Break-fix IT support means you only get help after a problem impacts the firm - often during the worst possible time.",
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
    context:
      "Tax season downtime during April 15 deadlines can cost CPA firms thousands per hour in lost productivity.",
    question:
      "Does your firm have a documented IT disaster recovery plan specifically covering tax season continuity?",
    options: [
      {
        label: "Yes - documented and tested plan covering peak season",
        score: 10,
      },
      { label: "General IT plan exists but not tax-season specific", score: 5 },
      { label: "No formal plan - we'd improvise", score: 1 },
      { label: "We rely on our IT vendor to handle it", score: 3 },
    ],
  },
  {
    domain: "IT Support",
    context:
      "Without proper offboarding, ex-employees may retain access to client financial data indefinitely.",
    question:
      "Does your firm have a formal process to revoke IT access when staff leave or change roles?",
    options: [
      {
        label: "Yes - immediate revocation procedure, consistently followed",
        score: 10,
      },
      {
        label: "We revoke access but it's informal and sometimes delayed",
        score: 4,
      },
      { label: "No formal process - we try to remember", score: 1 },
      { label: "We've had former staff with lingering access", score: 0 },
    ],
  },
  {
    domain: "IT Support",
    context:
      "Cyber insurance for professional services firms often requires documented security controls at renewal.",
    question:
      "Does your firm carry cyber liability insurance, and are your IT controls documented for renewal?",
    options: [
      { label: "Yes - cyber insurance with documented controls", score: 10 },
      {
        label: "Cyber insurance but controls not formally documented",
        score: 5,
      },
      { label: "No cyber liability insurance", score: 0 },
      {
        label: "Not sure if our general liability covers cyber incidents",
        score: 2,
      },
    ],
  },
  {
    domain: "IT Support",
    context:
      "Unpatched systems are the second most common cause of breaches - patches must be applied within 30 days of release.",
    question:
      "How are software updates and security patches applied across firm computers and servers?",
    options: [
      { label: "Automated patch management via RMM tool", score: 10 },
      { label: "IT reminds staff to update - mostly manual", score: 4 },
      { label: "Updates happen when staff notice them", score: 1 },
      {
        label: "We rarely patch - concerned about breaking software",
        score: 0,
      },
    ],
  },
];
const sections = [
  "About Your Practice",
  "File Access Methods",
  "MFA Enforcement",
  "Written Security Plan",
  "Backup Frequency",
  "Backup Restore Testing",
  "Backup Isolation",
  "Tax Software Hosting",
  "Tax Season Downtime Plan",
  "Business Email Security",
  "Remote Access Controls",
  "BYOD Device Policy",
  "Workstation Age",
  "FTC Safeguards Compliance",
  "IRS Cybersecurity Review",
  "Security Awareness Training",
  "Day-to-Day IT Management",
  "Tax Season Disaster Recovery",
  "Access Revocation Process",
  "Cyber Liability Coverage",
  "Patch Management",
];
const assessmentNavigationGroups = [
  { label: "Firm profile", sectionIndexes: [0] },
  { label: "Data access & security foundation", sectionIndexes: [1, 2, 3] },
  { label: "Backup & recovery", sectionIndexes: [4, 5, 6] },
  { label: "Tax systems & business email", sectionIndexes: [7, 8, 9] },
  { label: "Remote access & devices", sectionIndexes: [10, 11, 12] },
  { label: "Compliance & staff awareness", sectionIndexes: [13, 14, 15] },
  { label: "IT operations & continuity", sectionIndexes: [16, 17, 18, 19, 20] },
];
const documentTemplates = [
  {
    id: "pii-hardware-inventory",
    title: "PII Hardware Inventory",
    description:
      "Track the hardware, storage locations, owners, and protection status of devices that may contain client information.",
    fileLabel: "Editable worksheet",
    updated: "Updated for in-app editing",
    defaultColumns: [
      "Asset ID",
      "Device Type",
      "Assigned To",
      "Location",
      "Stores PII",
      "Encryption",
      "Notes",
    ],
    defaultRows: [
      [
        "HW-001",
        "Workstation",
        "John Miller",
        "Front office",
        "Yes",
        "Enabled",
        "Primary tax prep desktop",
      ],
      [
        "HW-002",
        "Laptop",
        "Melissa Grant",
        "Remote / hybrid",
        "Yes",
        "Enabled",
        "Used for client reviews",
      ],
      [
        "HW-003",
        "Server",
        "IT Vendor",
        "Locked server closet",
        "Yes",
        "At rest",
        "Placeholder row - replace with live inventory",
      ],
    ],
  },
  {
    id: "pii-access-list",
    title: "Firm's PII Access List",
    description:
      "Maintain the list of people, systems, and access levels approved to handle protected information.",
    fileLabel: "Editable worksheet",
    updated: "Updated for in-app editing",
    defaultColumns: [
      "Name",
      "Role",
      "Job Duties",
      "Access Level",
      "Date Access Granted",
      "Access Termination Date",
    ],
    defaultRows: [
      [
        "John Miller",
        "Principal Operating Officer",
        "Oversees tax platform operations",
        "Admin",
        "",
        "",
      ],
      [
        "Sarah Chen",
        "Data Security Coordinator",
        "Monitors document access and security controls",
        "Full",
        "",
        "",
      ],
    ],
  },
  {
    id: "terminated-employee-checklist",
    title: "Terminated Employee Checklist",
    description:
      "Use a step-by-step checklist to revoke access, recover equipment, and document offboarding actions.",
    fileLabel: "Interactive checklist",
    updated: "Fill, save, and export PDF",
    documentType: "terminated-checklist",
  },
  {
    id: "record-retention-guide",
    title: "Record Retention Policy",
    description:
      "Create a firm-specific retention policy for use as a WISP attachment.",
    fileLabel: "Interactive policy",
    updated: "Customize, save, and export PDF",
    documentType: "record-retention-policy",
  },
  {
    id: "disaster-recovery-topics",
    title: "WISP Disaster Recovery Plan",
    description:
      "Create a practical recovery plan for PII-related systems, operations, and emergencies.",
    fileLabel: "Interactive plan",
    updated: "Customize and save your plan",
    documentType: "disaster-recovery-plan",
  },
  {
    id: "incident-report",
    title: "Incident Report: Potential Data Breach Notification",
    description:
      "Document a potential PII exposure, actions taken, and internal acknowledgements for audit readiness.",
    fileLabel: "Incident report form",
    updated: "Fill, save, and export PDF",
    documentType: "incident-report",
  },
  {
    id: "sample-data-breach-letter",
    title: "Sample Data Breach Letter",
    description:
      "Prepare a customizable customer notification letter and protective-steps appendix.",
    fileLabel: "Interactive notification letter",
    updated: "Customize, save, and export PDF",
    documentType: "data-breach-notification-letter",
  },
  {
    id: "data-breach-response-guideline",
    title: "Data Breach Response Guideline",
    description:
      "Create employee and contractor directions for securing and escalating a suspected PII breach.",
    fileLabel: "Interactive guideline",
    updated: "Customize, save, and export PDF",
    documentType: "data-breach-response-guideline",
  },
  {
    id: "training-sign-in-sheet",
    title: "Training Sign-in Sheet",
    description:
      "Track staff attendance for mandatory security training sessions with sign-in records.",
    fileLabel: "Editable worksheet",
    updated: "Sign, save, and maintain records",
    defaultColumns: ["Name", "Date of Training Completion", "Signature"],
    defaultRows: Array.from({ length: 10 }, () => ["", "", ""]),
  },
];
function getDocumentTemplateById(templateId) {
  return (
    documentTemplates.find((template) => template.id === templateId) || null
  );
}
const trainingLibrary = {
  mandatory: [
    {
      kind: "document",
      title: "[PDF] EasyWISP Staff Security Awareness Training - 11 pages",
      actionPrimary: "View",
      actionSecondary: "Download",
      assetPath:
        "design/training/WispNow-staff-security-awareness-training.pdf",
      filename: "WispNow-staff-security-awareness-training.pdf",
      previewLabel: "Mandatory staff training",
    },
    {
      kind: "document",
      title: "[PDF] EasyWISP Phishing Awareness Training - 11 pages",
      actionPrimary: "View",
      actionSecondary: "Download",
      assetPath: "design/training/WispNow-phishing-awareness-training.pdf",
      filename: "WispNow-phishing-awareness-training.pdf",
      previewLabel: "Phishing awareness module",
    },
    {
      kind: "document",
      title: "[PDF] EasyWISP IRS Dirty Dozen Briefing - 11 pages",
      actionPrimary: "View",
      actionSecondary: "Download",
      assetPath: "design/training/WispNow-irs-dirty-dozen-briefing.pdf",
      filename: "WispNow-irs-dirty-dozen-briefing.pdf",
      previewLabel: "IRS Dirty Dozen briefing",
    },
    {
      kind: "document",
      title: "[DOCX] WISP Employee Training Sign-in Sheet - 120 KB",
      actionPrimary: "View",
      actionSecondary: "Download",
    },
  ],
  videos: [
    {
      kind: "video",
      title: "Written Information Security Plan Overview ? 14 Mins",
      actionPrimary: "Watch Video",
    },
    {
      kind: "video",
      title: "Security Awareness: Recognizing Phishing Scams ? 7 Mins",
      actionPrimary: "Watch Video",
    },
    {
      kind: "video",
      title: 'IRS "Dirty Dozen" Financial Scams Briefing ? 11 Mins',
      actionPrimary: "Watch Video",
    },
  ],
  resources: [
    {
      kind: "document",
      title: "[PDF] FTC Safeguards Rule Quick Reference Guide ? 1.8 MB",
      actionPrimary: "View",
      actionSecondary: "Download",
    },
  ],
};
const builderTopics = [
  {
    id: "intro",
    title: "Introduction",
    status: "Start here",
    templateLabel: "Editable section example",
    templateText:
      "This section can be updated to reflect your firmÃ¢â‚¬â„¢s roles, policies, systems, and operating practices.",
    guidance: "Introduction",
  },
  {
    id: "firm-details-roles",
    title: "Firm Details & Responsible Roles",
    status: "Required setup",
    templateLabel: "Required firm information",
    templateText: "",
    guidance: "Required firm information",
  },
  {
    id: "objective",
    title: "Objective",
    status: "Not started",
    templateLabel: "Objective",
    templateText: "",
    templateHtml: `<p>This WISP is to comply with obligations under the Gramm-Leach-Bliley Act and Federal Trade Commission Financial Privacy and Safeguards Rules to which the Firm is subject. The WISP sets forth our procedure for evaluating our electronic and physical methods of accessing, collecting, storing, using, transmitting, and protecting PII retained by the Firm. For purposes of this WISP, PII means information containing the first name and last name or first initial and last name of a Taxpayer, Spouse, Dependent, or Legal Guardianship person in combination with any of the following data elements retained by the Firm that relate to Clients, Business Entities, or Firm Employees:</p><ul><li>Social Security number, Date of Birth, or Employment data</li><li>Driver&rsquo;s license number or state-issued identification card number</li><li>Income data, Tax Filing data, Retirement Plan data, Asset Ownership data, Investment data</li><li>Financial account number, credit or debit card number, with or without security code, access code, personal identification number; or password(s) that permit access to a client&rsquo;s financial accounts</li><li>E-mail addresses, non-listed phone numbers, residential or mobile or contact information</li></ul><p>PII shall not include information that is obtained from publicly available sources such as a Mailing Address or Phone Directory listing; or from federal, state or local government records lawfully made available to the general public.</p>`,
    guidance: "Objective",
  },
  {
    id: "purpose",
    title: "Purpose",
    status: "Not started",
    templateLabel: "Purpose",
    templateText: "",
    templateHtml: `<p>The purpose of this WISP is to:</p><ol><li>Ensure the security and confidentiality of all PII retained by the Firm.</li><li>Protect PII against anticipated threats or hazards to the security or integrity of such information.</li><li>Protect against unauthorized access to or use of PII in a manner that creates a substantial risk of identity theft, fraud, or other harmful misuse.</li><li>Maintain a structured framework for administrative, technical, and physical safeguards that supports the Firm&rsquo;s ongoing information security responsibilities.</li></ol>`,
    guidance: "Purpose",
  },
  {
    id: "scope",
    title: "Scope",
    status: "Not started",
    templateLabel: "Scope",
    templateText: "",
    templateHtml: `<p>The scope of this WISP is limited to the following protocols:</p><ol><li>Identify reasonably foreseeable internal and external risks to the security, confidentiality, and integrity of any electronic, paper, or other records containing PII.</li><li>Assess the potential damage that could result from identified threats, taking into consideration the sensitivity of the information involved.</li><li>Evaluate the sufficiency of existing policies, procedures, systems, and safeguards currently in place to control identified risks.</li><li>Design, implement, and maintain safeguards intended to reduce those risks in a manner consistent with applicable federal standards and the Firm&rsquo;s operating practices.</li><li>Regularly monitor, review, and assess the effectiveness of the safeguards described in this WISP.</li></ol>`,
    guidance: "Scope",
  },
  {
    id: "officials",
    title: "Officials",
    status: "Not started",
    templateLabel: "Officials",
    templateText: "",
    guidance: "Officials",
  },
  {
    id: "inside-the-firm",
    title: "Inside the Firm",
    status: "Not started",
    templateLabel: "Inside the Firm",
    templateText: "",
    guidance: "Inside the Firm",
  },
  {
    id: "outside-the-firm",
    title: "Outside the Firm",
    status: "Not started",
    templateLabel: "Outside the Firm",
    templateText: "",
    guidance: "Outside the Firm",
  },
  {
    id: "policies",
    title: "Policies",
    status: "Not started",
    templateLabel: "Policies",
    templateText: "",
    guidance: "Policies",
  },
  {
    id: "resources",
    title: "Resources",
    status: "Not started",
    templateLabel: "Resources",
    templateText: "",
    guidance: "Resources",
  },
  {
    id: "glossary",
    title: "Glossary",
    status: "Not started",
    templateLabel: "Glossary",
    templateText: "",
    templateHtml: `<p><strong>Anti-virus software</strong> - software designed to detect and potentially eliminate viruses before damaging the system. This software can also repair or quarantine files that have already been infected by virus activity.</p><p><strong>Attachment</strong> - a file added to an email. It could be something useful to you, or something harmful to your computer.</p><p><strong>Authentication</strong> - confirms the correctness of the claimed identity of an individual user, machine, software component or any other entity.</p><p><strong>Breach</strong> - unauthorized access of a computer or network, usually through the electronic gathering of login credentials of an approved user on the system.</p><p><strong>Clear desk policy</strong> - a policy that directs all personnel to clear their desks at the end of each working day, and file everything appropriately. Desks should be cleared of all documents and papers, including the contents of the Ã¢â‚¬Å“inÃ¢â‚¬Â and Ã¢â‚¬Å“outÃ¢â‚¬Â trays - not simply for cleanliness, but also to ensure that sensitive papers and documents are not exposed to unauthorized persons outside of working hours.</p><p><strong>Clear screen policy</strong> - a policy that directs all computer users to ensure that the contents of the screen are protected from prying eyes and opportunistic breaches of confidentiality. Typically, the easiest means of compliance is to use a screensaver that engages either on request or after a specified brief period.</p><p><strong>Cybersecurity</strong> - the protection of information assets by addressing threats to information processed, stored, and transported by internetworked information systems.</p><p><strong>Data Security Coordinator (DSC)</strong> - the firm-designated employee who will act as the chief data security officer for the firm. The DSC is responsible for all aspects of your firmÃ¢â‚¬â„¢s data security posture, especially as it relates to the PII of any client or employee the firm possesses in the course of normal business operations.</p><p><strong>Data breach</strong> - an incident in which sensitive, protected, or confidential data has potentially been viewed, stolen or used by an individual unauthorized to do so. Data breaches may involve personal health information (PHI), personally identifiable information (PII), trade secrets or intellectual property.</p><p><strong>Encryption</strong> - a data security technique used to protect information from unauthorized inspection or alteration. Information is encoded so that it appears as a meaningless string of letters and symbols during delivery or transmission. Upon receipt, the information is decoded using a decryption key.</p><p><strong>Firewall</strong> - a hardware or software link in a network that inspects all data packets coming and going from a computer, permitting only those that are authorized to reach the other side. It is helpful in controlling external access to a computer or network.</p><p><strong>GLBA</strong> - Gramm-Leach-Bliley Act. Administered by the Federal Trade Commission. Establishes safeguards for all privacy-controlled information through business segment Safeguards Rule enforced business practices.</p><p><strong>Hardware firewall</strong> - a dedicated computer configured to exclusively provide firewall services between another computer or network and the internet or other external connections.</p><p><strong>Malware</strong> - malicious software, any computer program designed to infiltrate, damage or disable computers.</p><p><strong>Multi-factor authentication</strong> - a security system that requires returning users to enter more than just credentials (username and password) to access an account or device, such as two-factor or three-factor authentication. The FTC Safeguards Rule requires authentication through verification of at least two of the following types of authentication factors: knowledge factors, such as password; possession factors, such as a token; or inherence factors, such as biometric characteristics.</p><p><strong>Network</strong> - two or more computers that are grouped together to share information, software, and hardware. Can be a local office network or an internet-connection based network.</p><p><strong>Out-of-stream</strong> - usually relates to the forwarding of a password for a file via a different mode of communication separate from the protected file. Example: A password protected file was emailed, but the password was relayed to the recipient via text message, outside of the same stream of information from the protected file.</p><p><strong>Patch</strong> - a small security update released by a software manufacturer to fix bugs in existing programs.</p><p><strong>Phishing email</strong> - broad term for email scams that appear legitimate for the purpose of tricking the recipient into sharing sensitive information or installing malware.</p><p><strong>PII</strong> - Personally Identifiable Information. The name, address, Social Security number, banking, or other information used to establish official business. Also known as Privacy-Controlled Information.</p><p><strong>Public Information Officer (PIO)</strong> - the PIO is the single point of contact for any outward communications from the firm related to a data breach incident where PII has been exposed to an unauthorized party. This position allows the firm to communicate to affected clients, media, or local businesses and associates in a controlled manner while allowing the Data Security Coordinator freedom to work on remediation internally.</p><p><strong>Risk analysis</strong> - a process by which frequency and magnitude of IT risk scenarios are estimated; the initial steps of risk management; analyzing the value of assets to the business, identifying threats to those assets and evaluating how vulnerable each asset is to those threats.</p><p><strong>Security awareness</strong> - the extent to which every employee with access to confidential information understands their responsibility to protect the physical and information assets of the organization.</p><p><strong>Service providers</strong> - any business service provider contracted with for services, such as janitorial services, IT professionals, and document destruction services employed by the firm who may come in contact with sensitive client PII.</p><p><strong>Software firewall</strong> - an application installed on an existing operating system that adds firewall services to the existing programs and services on the system. A firewall restricts access according to specific sets of rules to reduce or eliminate the possibility of hacking.</p><p><strong>VPN (Virtual Private Network)</strong> - a secure remote network or Internet connection encrypting communications between a local device and a remote trusted device or service that prevents en-route interception of data.</p><p><strong>Written Information Security Plan</strong> - a documented, structured approach identifying related activities and procedures that maintain a security awareness culture and to formulate security posture guidelines. Mandated for Tax & Accounting firms through the FTC Safeguards Rule supporting the Gramm-Leach-Bliley Act privacy law.</p>`,
    guidance: "Glossary",
  },
  {
    id: "attachments",
    title: "Attachments",
    status: "Not started",
    templateLabel: "Attachments",
    templateText: "",
    guidance: "Attachments",
  },
  {
    id: "finalize",
    title: "Finalize",
    status: "Ready for review",
    templateLabel: "Finalize",
    templateText: "",
    guidance: "Finalize",
  },
];
const RESOURCE_LINK_SECTIONS = [
  {
    title: "Federal Trade Commission",
    links: [
      {
        label: "FTC Financial Institution How to Comply",
        url: "https://www.ftc.gov/business-guidance/privacy-security/gramm-leach-bliley-act",
      },
      {
        label: "FTC Safeguards Rule",
        url: "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-314",
      },
      {
        label: "FTC Data Breach Response Guide",
        url: "https://www.ftc.gov/business-guidance/resources/data-breach-response-guide-business",
      },
      {
        label: "FTC Safeguards Rule Security Event Reporting Form",
        url: "https://www.ftc.gov/forms/safeguards-rule-security-event",
      },
    ],
  },
  {
    title: "National Institute of Standards and Technology",
    links: [
      {
        label: "Cybercrime & Cyber Threats to Small Business",
        url: "https://www.nist.gov/itl/smallbusinesscyber/cybersecurity-basics/cybercrime-and-cyber-threats",
      },
      {
        label: "Cybercrime it's worse than we thought",
        url: "https://www.nist.gov/blogs/manufacturing-innovation-blog/cybercrime-its-worse-we-thought",
      },
      {
        label: "Cybercrime existential threat small business",
        url: "https://www.nist.gov/blogs/manufacturing-innovation-blog/cybersecurity-small-businesses-essential-not-optional",
      },
      {
        label: "NIST Computer Security Resource Center",
        url: "https://csrc.nist.gov/",
      },
      {
        label: "NIST Cybersecurity Framework examples",
        url: "https://www.nist.gov/cyberframework/online-learning/five-functions",
      },
    ],
  },
  {
    title: "Federal Communications Commission",
    links: [
      {
        label: "FCC Cyber Threat Resources",
        url: "https://www.fcc.gov/cyberplanner",
      },
    ],
  },
  {
    title: "Internal Revenue Service",
    links: [
      {
        label: "IRS Publication 4557",
        url: "https://www.irs.gov/pub/irs-pdf/p4557.pdf",
      },
      {
        label: "IRS Publication 5709",
        url: "https://www.irs.gov/pub/irs-pdf/p5709.pdf",
      },
      {
        label: "IRS Publication 5280",
        url: "https://www.irs.gov/pub/irs-pdf/p5280.pdf",
      },
      {
        label: "IRS Publication 1345",
        url: "https://www.irs.gov/pub/irs-pdf/p1345.pdf",
      },
      {
        label: "IRS Stakeholder Liaison",
        url: "https://www.irs.gov/e-file-providers/stakeholder-liaison-local-contact-information",
      },
      {
        label: "IRS Data Theft Reporting Process",
        url: "https://www.irs.gov/tax-professionals/reporting-client-data-theft-to-the-irs",
      },
    ],
  },
];
const initialBuilderDrafts = {
  ...Object.fromEntries(
    builderTopics.map((topic) => [
      topic.id,
      topic.templateHtml ?? topic.templateText,
    ]),
  ),
  "officials-dsc": `<p>The DSC is the responsible official for the Firm&rsquo;s data security processes and will implement, supervise, and maintain this WISP. Accordingly, the DSC will be responsible for the following:</p><ol><li>Implementing the WISP including all daily operational protocols.</li><li>Identifying all the Firm&rsquo;s repositories of data subject to the WISP protocols and designating them as secured assets with restricted access.</li><li>Verifying that employees with access to PII complete recurring security and privacy training as required by the Firm.</li><li>Monitoring and testing employee compliance with the plan&rsquo;s policies and procedures.</li><li>Evaluating the ability of third-party service providers with access to Firm-held PII to implement and maintain appropriate safeguards.</li><li>Requiring service providers to maintain security measures consistent with the Firm&rsquo;s WISP expectations and applicable obligations.</li><li>Reviewing the scope and effectiveness of the Firm&rsquo;s security measures at least annually and whenever there is a material change in business practices affecting records containing PII.</li><li>Conducting periodic training for owners, managers, employees, contractors, and temporary personnel who handle or may access PII, and maintaining documentation of participation where required.</li></ol>`,
  "officials-pio": `<p>The PIO will serve as the Firm&rsquo;s designated public communications contact for matters related to security incidents, information handling, and approved external statements. To reduce confusion, inconsistency, and unauthorized disclosures, outward-facing communications should be coordinated through this role.</p><p>The PIO is responsible for the following:</p><ul><li>Client communications by phone, email, or written notice when approved by the Firm.</li><li>Statements or responses provided to law enforcement or regulatory agencies when external communication is required.</li><li>Approved communications with news media or other public-facing outlets.</li><li>Release of information to business associates, neighboring businesses, trade groups, or other outside parties when disclosure is authorized by the Firm.</li></ul>`,
  "inside-firm-intro": `<p>To reduce internal risks to the security, confidentiality, and/or integrity of any retained electronic, paper, or other records containing PII, the Firm has implemented mandatory policies and procedures as follows:</p>`,
  "inside-firm-collection": `<p>PII Collection and Retention Policy</p><p>A. We will only collect the PII of clients, customers, or employees that is necessary to accomplish our legitimate business needs, while maintaining compliance with all federal, state, or local regulations.</p><p>B. Access to records containing PII is limited to employees whose duties, relevant to their job descriptions, constitute a legitimate need to access said records, and only for job-related purposes.</p><p>C. The DSC will identify and document the locations where PII may be stored on the Company premises:</p><ul><li>Servers, disk drives, solid-state drives, USB memory devices, removable media</li><li>Filing cabinets, securable desk drawers, contracted document retention and storage firms</li><li>PC Workstations, Laptop Computers, client portals, electronic Document Management</li><li>Online (Web-based) applications, portals, and cloud software applications such as Box</li><li>Database applications, such as Bookkeeping and Tax Software Programs</li><li>Solid-state drives, and removable or swappable drives, and USB storage media</li></ul><p>D. Designated written and electronic records containing PII shall be destroyed or deleted at the earliest opportunity consistent with business needs or legal retention requirements.</p><ul><li>Paper-based records shall be securely destroyed by shredding or incineration at the end of their service life.</li><li>Electronic records shall be securely destroyed by deleting and overwriting the file directory or by reformatting the drive on which they were housed.</li><li>Specific business record retention policies and secure data destruction policies are in an attachment to this WISP.</li></ul>`,
  "inside-firm-personnel": `<p>Personnel Accountability Policy</p><p>A. A copy of the WISP will be distributed to all current employees and to new employees on the beginning dates of their employment. It will be the employee&rsquo;s responsibility to acknowledge in writing, by signing the attached sheet, that he/she received a copy of the WISP and will abide by its provisions. Employees are actively encouraged to advise the DSC of any activity or operation that poses risk to the secure retention of PII. If the DSC is the source of these risks, employees should advise any other Principal or the Business Owner.</p><ul><li>The Firm will create and establish general Rules of Behavior and Conduct regarding policies safeguarding PII according to IRS Pub. 4557 Guidelines. [complete and attach after reviewing supporting NISTIR 7621, NIST SP-800 18, and Pub 4557 requirements]</li><li>The Firm will screen the procedures prior to granting new access to PII for existing employees.</li><li>The Firm will conduct Background Checks on new employees who will have access to retained PII.</li><li>The Firm may require non-disclosure agreements for employees who have access to the PII of any designated client determined to have highly sensitive data or security concerns related to their account.</li></ul><p>B. The DSC or designated authorized representative will immediately train all existing employees on the detailed provisions of the Plan. All employees will be subject to periodic reviews by the DSC to ensure compliance.</p><p>C. All employees are responsible for maintaining the privacy and integrity of the Firm&rsquo;s retained PII. Any paper records containing PII are to be secured appropriately when not in use. Employees may not keep files containing PII open on their desks when they are not at their desks. Any computer file stored on the company network containing PII will be password-protected and/or encrypted. Computers must be locked from access when employees are not at their desks. At the end of the workday, all files and other records containing PII will be secured by employees in a manner that is consistent with the Plan&rsquo;s rules for protecting the security of PII.</p><p>D. Any employee who willfully discloses PII or fails to comply with these policies will face immediate disciplinary action that includes a verbal or written warning plus other actions up to and including termination of employment.</p><p>E. Terminated employees&rsquo; computer access logins and passwords will be disabled at the time of termination. Physical access to any documents or resources containing PII will be immediately discontinued. Terminated employees will be required to surrender all keys, IDs or access codes or badges, and business cards that permit access to the Firm&rsquo;s premises or information. Terminated employees&rsquo; remote electronic access to personal information will be disabled; voicemail access, e-mail access, Internet access, Tax Software download/update access, accounts and passwords will be inactivated. The DSC or designee shall maintain a highly secured master list of all lock combinations, passwords, and keys, and will determine the need for changes to be made relevant to the terminated employee&rsquo;s access rights.</p>`,
  "inside-firm-disclosure": `<p>PII Disclosure Policy</p><p>A. No PII will be disclosed without authenticating the receiving party and without securing written authorization from the individual whose PII is contained in such disclosure. Access is restricted for areas in which personal information is stored, including file rooms, filing cabinets, desks, and computers with access to retained PII. An escort will accompany all visitors while within any restricted area of stored PII data.</p><p>B. The Firm will take all possible measures to ensure that employees are trained to keep all paper and electronic records containing PII securely on premises at all times. When there is a need to bring records containing PII offsite, only the minimum information necessary will be checked out. Records taken offsite will be returned to the secure storage location as soon as possible. Under no circumstances will documents, electronic devices, or digital media containing PII be left unattended in an employee&rsquo;s car, home, or in any other potentially insecure location.</p><p>C. All security measures included in this WISP shall be reviewed annually, beginning [annual calendar review date] to ensure that the policies contained in the WISP are adequate and meet all applicable federal and state regulations. Changes may be made to the WISP at any time they are warranted. When the WISP is amended, employees will be informed in writing. The DSC and principal owners of the Firm will be responsible for the review and modification of the WISP, including any security improvement recommendations from employees, security consultants, IT contractors, and regulatory sources.</p><p>D. [The Firm] shares Employee PII in the form of employment records, pension and insurance information, and other information required of any employer. The Firm may share the PII of our clients with the state and federal tax authorities, Tax Software Vendor, a bookkeeping service, a payroll service, a CPA firm, an Enrolled Agent, legal counsel, and/or business advisors in the normal course of business for any Tax Preparation firm. Law enforcement and governmental agencies may also have customer PII shared with them in order to protect our clients or in the event of a lawfully executed subpoena. An IT support company may occasionally see PII in the course of contracted services. Access to PII by these third-party organizations will be the minimum required to conduct business. Any third-party service provider that does require access to information must be compliant with the standards contained in this WISP at a minimum. The exceptions are tax software vendors and e-Filing transmitters; and the state and federal tax authorities, which are already compliant with laws that are stricter than this WISP requires. These additional requirements are outlined in IRS Publication 1345.</p>`,
  "inside-firm-reportable": `<p>Reportable Event Policy</p><p>A. If there is a Data Security Incident that requires notifications under the provisions of regulatory laws such as The Gramm-Leach-Bliley Act, there will be a mandatory post-incident review by the DSC of the events and actions taken. The DSC will determine if any changes in operations are required to improve the security of retained PII for which the Firm is responsible. Records of and changes or amendments to the Information Security Plan will be tracked and kept on file as an addendum to this WISP.</p><p>B. The DSC is responsible for maintaining any Data Theft Liability Insurance, Cyber Theft Insurance Riders, or Legal Counsel on retainer as deemed prudent and necessary by the principal ownership of the Firm.</p><p>C. The DSC will also notify the IRS Stakeholder Liaison, and state and local Law Enforcement Authorities in the event of a Data Security Incident, coordinating all actions and responses taken by the Firm. The DSC or person designated by the coordinator shall be the sole point of contact with any outside organization not related to Law Enforcement, such as news media, non-client inquiries by other local firms or businesses and other inquirers.</p>`,
  "outside-firm-intro": `<p>To reduce external risks to the security, confidentiality, and integrity of electronic, paper, and other records containing PII, and to strengthen the Firm&rsquo;s safeguards for limiting those risks, the Firm has established the following external-facing policies and procedures.</p>`,
  "outside-firm-network": `<ol><li>Firewall protection, operating-system security patches, and software security updates will be maintained on computers, servers, and other systems that access, store, or process PII on the Firm&rsquo;s network, including approved third-party devices connected to the network.</li><li>Security software, including anti-virus, anti-malware, and other endpoint protections, will be kept current on systems that store or process PII.</li><li>Secure user-authentication protocols will be maintained, including user identification controls, password protections, and multi-factor authentication where required.</li><li>Computer systems will be monitored for unauthorized access or unauthorized use of PII, and relevant logging or review procedures will be maintained as appropriate.</li><li>The Firm will maintain firewall separation between the public internet and its internal network and will keep those protections configured, reviewed, and updated in accordance with vendor recommendations and internal security needs.</li><li>Operating-system and security updates will be reviewed and installed on an ongoing basis, with periodic oversight by the DSC or designated technology support personnel.</li></ol>`,
  "outside-firm-access": `<ol><li>The Firm will use access-control measures designed to limit system access to authorized users only.</li><li>Multi-factor authentication should be used where appropriate for remote access, administrative access, or systems containing sensitive information.</li><li>Users must maintain unique credentials for Firm systems, applications, vendor portals, downloads, and network resources. Shared credentials should not be used except where specifically approved, documented, and controlled.</li><li>Passwords should follow accepted security standards and should be updated when required by Firm policy, system compromise, role change, or other security events.</li><li>If a password-management utility is used, it should store credentials securely and support multi-factor authentication or equivalent protections for access to credential data.</li></ol>`,
  "outside-firm-exchange": `<ol><li>PII should not be transmitted in an unprotected format such as plain-text email, unsecured attachment delivery, or other unencrypted electronic methods unless an appropriate protective control is in place.</li><li>Where password protection is used for transmitted documents, the password should be communicated separately from the transmitted file using a different channel.</li><li>The Firm may use a secure portal, encrypted file-sharing method, approved document-exchange workflow, or protected storage medium for transmitting documents containing PII.</li><li>Encrypted removable media or similarly protected storage tools may be used where appropriate for files containing sensitive information.</li></ol>`,
  "outside-firm-wifi": `<ol><li>Wireless access points, if used by the Firm, must use strong encryption, require password-protected access, and be configured in a manner appropriate for business use.</li><li>If guest wireless access is made available, it must be separated from the Firm&rsquo;s internal work network and must not provide access to systems containing retained PII.</li><li>Devices with wireless capability, including printers, copiers, scanners, smart displays, and other connected office equipment, must not rely on default credentials and should be secured with Firm-assigned settings or removed from wireless connectivity if they cannot be adequately protected.</li></ol>`,
  "outside-firm-remote": `<ol><li>Remote-access tools used by the Firm must be approved by the DSC and, where applicable, coordinated with the Firm&rsquo;s technology support providers.</li><li>Remote access should use encrypted traffic and secure authentication methods and should be limited to situations in which access is necessary for approved business functions.</li><li>Where risk conditions warrant additional caution, remote access may be restricted, more closely monitored, or subject to additional controls such as multi-factor authentication, time-of-day restrictions, or device-based approval requirements.</li></ol>`,
  "outside-firm-devices": `<ol><li>Any new device that connects to the Firm&rsquo;s internal network should be reviewed for security suitability before being added to the environment.</li><li>Automatic media-run features for USB devices, optical drives, or similar connection methods should be disabled where feasible to reduce the risk of unauthorized software execution.</li><li>Storage devices removed from service should be securely erased, destroyed, or otherwise rendered inaccessible in a manner appropriate to the device type and the sensitivity of the data involved.</li><li>The Firm will maintain approved and licensed endpoint-protection or anti-malware tools on applicable systems and keep those protections current through routine updates.</li></ol>`,
  "outside-firm-training": `<p>Personnel will be trained on maintaining the privacy and confidentiality of the Firm&rsquo;s PII and on following the Firm&rsquo;s security procedures for handling paper records, electronic records, systems access, and incident awareness.</p><p>Training should occur before access is granted where appropriate and should continue through periodic refresher sessions so that personnel remain aligned with the Firm&rsquo;s security expectations.</p><p>Failure to follow applicable information-security requirements may result in corrective or disciplinary action consistent with Firm policy.</p>`,
  "policies-rules": `<p>Create and distribute rules of behavior that describe responsibilities and expected behavior regarding computer information systems as well as paper records and usage of taxpayer data. Have all information system users complete, sign, and comply with the rules of behavior. NISTIR 7621, Small Business Information Security: The Fundamentals, Section 4, has information regarding general rules of behavior, such as:</p><p><strong>Be careful of email attachments and web links</strong></p><p>Do not click on a link or open an attachment that you were not expecting. If it appears important, call the sender to verify they sent the email and ask them to describe what the attachment or link is. Before you click a link in an email or on social media, hover over that link to see the actual web address it will take you to. Train employees to recognize phishing attempts and who to notify when one occurs.</p><p><strong>Use separate personal and business computers, mobile devices, and email accounts</strong></p><p>This is especially important if other people, such as children, use personal devices. Do not conduct business or any sensitive activities, such as online business banking, on a personal computer or device, and do not engage in activities such as web surfing, gaming, or downloading videos on business computers or devices. Do not send sensitive business information to personal email addresses.</p><p><strong>Do not connect personal or untrusted storage devices or hardware into computers, mobile devices, or networks</strong></p><p>Do not share USB drives or external hard drives between personal and business computers or devices. Do not connect any unknown or untrusted hardware into the system or network, and do not insert any unknown CD, DVD, or USB drive. Disable the AutoRun feature for USB ports and optical drives on business computers to help prevent malicious programs from installing on the systems.</p><p><strong>Be careful downloading software</strong></p><p>Do not download software from an unknown web page. Be very careful with freeware or shareware.</p><p><strong>Watch out when providing personal or business information</strong></p><p>Social engineering is an attempt to obtain physical or electronic access to information by manipulating people. A common attack involves a person, website, or email that pretends to be something it is not. A social engineer may research a business to learn names, titles, responsibilities, and personal information, then send a believable but made-up story designed to convince you to give certain information.</p><p>Never respond to unsolicited phone calls that ask for sensitive personal or business information. Employees should notify management whenever there is an attempt or request for sensitive business information.</p><p>Never give out usernames or passwords. No company should ask for this information for any reason. Also, beware of people asking what kind of operating system, brand of firewall, internet browser, or what applications are installed. This is information that can make it easier for a hacker to break into the system.</p><p><strong>Watch for harmful pop-ups</strong></p><p>When connected to and using the Internet, do not respond to pop-up windows requesting that users click OK. Use a pop-up blocker and only allow pop-ups on trusted websites.</p><p><strong>Use strong passwords</strong></p><p>Good passwords consist of a random sequence of letters, numbers, and special characters. The NIST recommends passwords be at least 12 characters long. For systems or applications that have important information, use multiple forms of identification, such as multi-factor or dual-factor authentication.</p><p>Many devices come with default administration passwords; these should be changed immediately when installing and regularly thereafter. Default passwords are easily found or known by hackers and can be used to access the device. The product manual or those who install the system should be able to show you how to change them.</p><p>NIST guidelines recommend password reset every 365 days, or when a compromise has occurred.</p><p>Passwords to devices and applications that deal with business information should not be reused.</p><p>You may want to consider using a password management application to store your passwords.</p><p><strong>Conduct online business more securely</strong></p><p>Online business, commerce, and banking should only be done using a secure browser connection. This will normally be indicated by a small lock visible in the browser window.</p><p>Erase the web browser cache, temporary internet files, cookies, and history regularly. Ensure this data is erased after using any public computer and after any online commerce or banking session. This helps prevent important information from being stolen if the system is compromised and also helps the system run faster. Typically, this is done in the web browser&rsquo;s privacy or security menu. Review the web browser&rsquo;s help manual for guidance.</p>`,
  "policies-breach": `<p><strong>I. Notifications</strong></p><p>If the Data Security Coordinator determines that PII has been stolen or lost, the Firm will notify the following entities, describing the theft or loss in detail, and work with authorities to investigate the issue and to protect the victim&rsquo;s identity and credit.</p><p>The IRS Stakeholder Liaison who coordinates IRS divisions and other agencies regarding a tax professional office data breach.</p><p>The state Attorney General&rsquo;s Office</p><p>State tax agencies</p><p>The FBI&rsquo;s Internet Crime Complaint Center if it is a cyber-crime involving electronic data theft</p><p>The Federal Trade Commission, in accordance with GLB Act provisions as outlined in the Safeguards Rule. Report security events affecting 500 or more people within 30 days of discovery through the FTC&rsquo;s online Safeguards Rule Security Event Reporting Form.</p><p>Local law enforcement</p><p>Tax software vendor, which can assist with next steps after a data breach incident</p><p>Liability insurance carrier, which may provide forensic IT services</p><p>Legal counsel</p><p>To the extent required by regulatory laws and good business practices, the Firm will also notify the victims of the theft so that they can protect their credit and identity. The FTC provides guidance for identity theft notifications in Information Compromise and the Risk of Identity Theft: Guidance for Your Business.</p><p><strong>II. Procedures</strong></p><p>The procedures for reporting a breach will be consistent across incidents and then tailored as needed depending on the type of potential breach reported. In all cases:</p><p>ALL incidents must be reported to the DSC and the reporting party will be directed to fill out an incident report.</p><p>The incident report will then be used by the DSC to determine the appropriate communications, notifications, and next steps.</p><p>The DSC will then follow IRS and FTC recommendations for the type of suspected problem.</p><p>See IRS guidance and review Tax Security 101 for reporting-process information.</p><p>For example:</p><p>You suspect a tax return was filed using your EFIN that you did not originate:</p><p>Go to IRS e-Services and check your EFIN activity report to see if more returns have been filed on your EFIN than you transmitted.</p><p>Check to see if you can tell whether the returns in question were submitted at odd hours that are not during normal hours of operation, such as overnight or on weekends.</p><p>Were the returns transmitted on a Monday or Tuesday morning?</p><p>Typically, a thief will remotely steal client data over the weekend when no one is in the office to notice. They then rework the returns over the weekend and transmit them on a normal business workday just after the weekend.</p>`,
  "resources-intro": `<p>Below are helpful links from within the WISP creation guide and also from outside sources such as the Federal Communications Commission (FCC) and the National Institute of Standards and Technology (NIST). These resources, along with IRS and Federal Trade Commission references, support your efforts to create a durable Written Information Security Plan for your firm.</p>`,
};
const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  mobilePhone: "",
  companyName: "",
  primaryContact: "",
  practiceType: "",
  staffSize: "",
  itManagement: "",
  principalOperatingOfficer: "",
  dataSecurityCoordinator: "",
  publicInformationOfficer: "",
  signatureTitle: "",
  officePhone: "",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
  emailProvider: "",
  emailUsers: "",
  taxSoftware: "",
  taxpayerMaterials: [],
  workModel: [],
  computerCount: "",
  hasServer: "",
  fileStorage: "",
  backups: [],
  individualReturns: "",
  corporateReturns: "",
  bookkeeping: "",
  payroll: "",
  insurance: "",
  teamMembers: [],
  contractors: [],
  vendors: [],
  securityOfficerName: "",
  securityOfficerTitle: "",
  securityOfficerEmail: "",
  securityOfficerPhone: "",
  mfaStatus: "",
  mfaMethod: "",
  passwordPolicy: "",
  dataProtection: "",
  officeType: "",
  alarm: "",
  locks: "",
  visitorPolicy: "",
  deviceDisposal: "",
  breachHistory: "",
  incidentPlan: "",
  recordYears: "",
  recordDisposal: "",
  securityTraining: "",
  itSupport: "",
  otherVendors: "",
};
assessmentQuestions.forEach((_, index) => {
  initialForm[`question_${index + 1}`] = "";
});
function defaultSettingsData() {
  return {
    profile: {
      name: "",
      email: "",
      passwordUpdatedAt: null,
      mfaEnabled: false,
      mfaMethod: "Not configured",
      mfaVerifiedOn: null,
      sessionsNote: "",
    },
    company: {
      address: "",
      phone: "",
      email: "",
    },
    billing: {
      planName: "EasyWISP Professional",
      status: "Active",
      priceMonthly: 299,
      billingCycle: "monthly",
      priceAnnual: 2990,
      paymentMethod: "Visa ending in 4242",
      renewalDate: "2026-07-18",
      billingContact: "contact@currentfiscal.com",
      billingAddress: "2750 West Loop South, Houston, TX 77027",
      cardholder: "Current Fiscal LLC",
      cardBrand: "VISA",
      cardLast4: "4242",
      autoRenew: true,
      inviteSeatsRemaining: 1,
      servicePurchases: [],
    },
    users: [],
    staff: [],
    activityLogs: [],
  };
}
function normalizeSettingsData(settings) {
  const defaults = defaultSettingsData();
  const input = settings && typeof settings === "object" ? settings : {};
  return {
    profile: { ...defaults.profile, ...(input.profile || {}) },
    company: { ...defaults.company, ...(input.company || {}) },
    billing: {
      ...defaults.billing,
      ...(input.billing || {}),
      servicePurchases: Array.isArray(input.billing?.servicePurchases)
        ? input.billing.servicePurchases
        : defaults.billing.servicePurchases,
    },
    users: Array.isArray(input.users)
      ? input.users.map((user, index) => ({
          id: user.id || `user-${index + 1}`,
          actions: Array.isArray(user.actions) ? user.actions : [],
          ...user,
        }))
      : defaults.users,
    staff: Array.isArray(input.staff)
      ? input.staff.map((staff, index) => {
          const fullName = String(staff.full_name || staff.name || "").trim();
          const nameParts = fullName.split(/\s+/).filter(Boolean);
          return {
            id: staff.id || `staff-${index + 1}`,
            firstName: staff.firstName || nameParts.shift() || "",
            lastName: staff.lastName || nameParts.join(" "),
            title: staff.title || staff.role_title || staff.role || "",
            type: staff.type || (staff.wisp_role ? "WISP role" : "Staff"),
            ...staff,
          };
        })
      : defaults.staff,
    activityLogs: Array.isArray(input.activityLogs)
      ? input.activityLogs.map((log, index) => ({
          id: log.id || `log-${index + 1}`,
          ...log,
        }))
      : defaults.activityLogs,
  };
}
function splitWorkspaceName(value = "") {
  const parts = String(value).trim().split(/\s+/).filter(Boolean);
  return { firstName: parts.shift() || "", lastName: parts.join(" ") };
}
function hydrateWorkspaceSettings(settings, bootstrap) {
  const authUser = bootstrap?.user || state.authUser;
  const firm = bootstrap?.firm || state.firmProfile || {};
  const onboardingProfile = bootstrap?.onboarding?.profile || state.onboarding?.profile || {};
  if (!authUser?.id && !firm?.id) return settings;

  const profileName = String(
    onboardingProfile.contact_name ||
      firm.primary_contact ||
      authUser.user_metadata?.full_name ||
      settings.profile.name ||
      "",
  ).trim();
  const accountEmail = String(authUser.email || settings.profile.email || "").trim();
  const companyEmail = String(
    onboardingProfile.business_email || settings.company.email || accountEmail,
  ).trim();
  const city = String(onboardingProfile.city || settings.company.city || "").trim();
  const region = String(onboardingProfile.state || settings.company.state || "").trim();
  const onboardingAddress = [city, region].filter(Boolean).join(", ");
  const name = splitWorkspaceName(profileName);
  const membershipRole = String(firm.membership_role || "owner").toLowerCase();
  const permission = membershipRole === "owner" ? "Owner" : membershipRole === "admin" ? "Administrator" : membershipRole === "manager" ? "Manager" : "Basic";

  return {
    ...settings,
    profile: {
      ...settings.profile,
      name: profileName,
      email: accountEmail,
      mfaEnabled: Boolean(settings.profile.mfaEnabled),
      mfaMethod: settings.profile.mfaMethod || "Not configured",
      mfaVerifiedOn: settings.profile.mfaVerifiedOn || null,
    },
    company: {
      ...settings.company,
      email: companyEmail,
      phone: String(onboardingProfile.business_phone || settings.company.phone || "").trim(),
      website: String(onboardingProfile.website || settings.company.website || "").trim(),
      city,
      state: region,
      address: String(settings.company.address || onboardingAddress || "").trim(),
    },
    // Memberships are the source of truth for access. Until the full team
    // directory query is in place, only show the authenticated membership.
    users: [
      {
        id: authUser.id,
        ...name,
        email: accountEmail,
        permission,
        status: "Verified",
        actions: [],
      },
    ],
    // Do not present seeded browser-only events as an audit trail.
    activityLogs: [],
  };
}
let state = {
  screen: "auth",
  sectionIndex: 0,
  section2Substep: 0,
  form: structuredClone(initialForm),
  errors: {},
  drawer: null,
  builderTab: "active",
  acknowledgingSignerIds: [],
  acknowledgementRequestSource: "active",
  acknowledgementRequestLinks: [],
  acknowledgementRequestBusy: false,
  builderResumeEditing: false,
  builderLaunchAnimation: false,
  builderSidebarOpen: false,
  builderReviewLoading: false,
  builderFinalizeBusy: false,
  builderSigningPdfBusy: false,
  builderReviewOpen: false,
  builderReviewPage: 0,
  builderMergeStatus: "idle",
  builderMergeMessage: "",
  builderMergeFileName: "",
  builderMergeDownloadUrl: "",
  builderMergeDocxBlob: null,
  builderRenderedPageCount: 0,
  builderMergePdfBlob: null,
  builderMergePdfFileName: "",
  builderMergePdfUrl: "",
  builderMergePreviewPages: [],
  builderTopicIndex: 0,
  builderDrafts: normalizeBuilderDraftMap(
    structuredClone(initialBuilderDrafts),
  ),
  builderAttachments: [],
  wispProject: null,
  wispVersions: [],
  completedWISPs: [],
  documentsFiles: [],
  documentWorkspaces: {},
  documentEditor: null,
  terminatedEmployeeChecklists: [],
  terminatedEmployeeChecklistEditor: null,
  terminatedEmployeeChecklistSaving: false,
  recordRetentionPolicy: null,
  disasterRecoveryPlan: null,
  incidentReport: null,
  dataBreachResponseGuideline: null,
  dataBreachNotificationLetter: null,
  specialDocumentInstances: {},
  specialDocumentEditor: null,
  trainingAssets: structuredClone(trainingLibrary),
  trainingQuery: "",
  trainingPreviewOpen: false,
  trainingPreviewTitle: "",
  trainingPreviewLabel: "",
  trainingPreviewUrl: "",
  trainingPreviewLoading: false,
  trainingPreviewError: "",
  settingsTab: "profile",
  settingsModal: null,
  settingsLogo: null,
  settingsData: defaultSettingsData(),
  showPlanModal: false,
  planBillingCycle: "monthly",
  selectedAdditionalService: null,
  showServicePurchaseDialog: false,
  showPaymentCardRemovalDialog: false,
  showStaffDialog: false,
  selectedStaffIds: [],
  dashboardData: null,
  firmProfile: null,
  onboarding: null,
  onboardingSaving: false,
  onboardingError: "",
  onboardingStepMotion: false,
  onboardingStepDirection: "forward",
  authAvailable: false,
  authReady: false,
  initialWorkspaceBootstrap: true,
  authBusy: false,
  authEmail: "",
  authPassword: "",
  authPasswordConfirm: "",
  authName: "",
  authMode: "login",
  authShowPassword: false,
  authError: "",
  authFeedbackTone: "error",
  authTransitioning: false,
  workspaceResolving: false,
  workspaceResolvedForUserId: null,
  authUser: null,
  riskDraftStatus: "idle",
  riskDraftSavedAt: "",
};
const app = document.getElementById("app");
let authHandoffTimer = null;
let riskDraftSyncTimer = null;
let builderDraftSyncTimer = null;
let builderDraftReviewTimer = null;
let documentWorkspaceSyncTimer = null;
let documentWorkspaceSaveQueue = Promise.resolve();
let specialDocumentSaveQueue = Promise.resolve();
let terminatedChecklistSyncTimer = null;
let recordRetentionPolicySyncTimer = null;
let disasterRecoveryPlanSyncTimer = null;
let incidentReportSyncTimer = null;
let dataBreachGuidelineSyncTimer = null;
let dataBreachLetterSyncTimer = null;
let settingsSyncTimer = null;
let settingsSaveQueue = Promise.resolve();
let settingsSyncRevision = 0;
let builderPdfJsLibPromise = null;
let builderPdfDocumentPromise = null;
let builderPdfDocumentUrl = "";
let builderPdfRenderJob = 0;
let builderPdfResizeTimer = null;
let trainingPdfDocumentPromise = null;
let trainingPdfDocumentUrl = "";
let trainingPdfRenderJob = 0;
let trainingPdfResizeTimer = null;
let trainingPreviewRequestToken = 0;
let builderDocxJsPromise = null;
let builderDocxRenderJob = 0;
let authSubscriptionCleanup = () => {};
const options = {
  states: [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ],
  emailProviders: [
    "Microsoft 365 / Outlook",
    "Google Workspace / Gmail",
    "GoDaddy Email",
    "Yahoo / AOL",
    "Proton Mail",
    "Other",
  ],
  practiceTypes: [
    "Solo CPA / Sole Practitioner",
    "Small CPA Firm (2?10 staff)",
    "Mid-size Accounting Firm (11?50)",
    "Bookkeeping / Tax Practice",
    "Multi-location Accounting Firm",
    "Financial Advisory + Accounting",
  ],
  staffSizes: ["Solo / 1 person", "2?10 staff", "11?50 staff", "51+ staff"],
  taxSoftware: [
    "Drake Tax",
    "UltraTax CS (Thomson Reuters)",
    "Lacerte (Intuit)",
    "ProConnect Tax Online",
    "CCH Axcess / ProSystem fx",
    "TaxSlayer Pro",
    "QuickBooks",
    "Multiple / Custom",
    "Cloud-based only",
  ],
  itManagement: [
    "No IT support ? we manage ourselves",
    "Break-fix vendor (call when broken)",
    "1 internal IT person",
    "Existing MSP partner",
    "Mixed ? some internal, some outsourced",
  ],
  server: ["Yes", "No", "Not sure"],
  materials: [
    "Sent to my Email",
    "Paper Files",
    "Fax",
    "Online Client Portal (from your website, email signature, or similar)",
    "Third-party cloud storage (Dropbox / Google Drive / OneDrive / Box.com, etc.)",
  ],
  workModel: [
    "It's just me Ã¢â‚¬â€ I work from an office only",
    "It's just me Ã¢â‚¬â€ I work from my home and office",
    "Hybrid Ã¢â‚¬â€ my staff and I work from home and the office",
    "No Ã¢â‚¬â€ everyone works only from the office",
    "Yes Ã¢â‚¬â€ my whole staff works from home / remote (U.S.)",
    "I have some staff outside the U.S.",
  ],
  storage: [
    "OneDrive/SharePoint",
    "Google Drive",
    "Dropbox / Box / ShareFile",
    "Local Server Share / NAS",
    "Just My Computer",
    "On an external USB drive",
    "Other",
  ],
  backups: [
    "I use file backup software (e.g. Carbonite, Backblaze, Code42/CrashPlan)",
    "I use an external USB hard drive plugged into my computer",
    "My managed IT provider backs up or protects my data (monthly plan, etc.)",
    "I don't currently back up my data with any solution",
    "Not applicable (no work data on local computers or servers)",
  ],
  roles: [
    "Owner / Partner",
    "Tax preparer",
    "Bookkeeper",
    "Payroll staff",
    "Administrative support",
    "IT support",
    "Other",
  ],
  locations: [
    "Office only",
    "Home office",
    "Hybrid",
    "Remote U.S.",
    "Outside U.S.",
  ],
  mfa: [
    "Yes, on all systems",
    "Yes, on some systems",
    "No, not currently",
    "I don't know what MFA is",
  ],
  password: [
    "Yes, passwords must be changed regularly",
    "Yes, but passwords don't expire",
    "No formal policy",
  ],
  dataProtection: [
    "Yes, both when stored and when sent",
    "Yes, only when sent (e.g., secure email)",
    "Yes, only when stored (e.g., BitLocker, FileVault)",
    "No",
    "I don't know",
  ],
  office: [
    "Dedicated commercial office space",
    "Shared office / Co-working space",
    "Home office",
    "Multiple locations",
  ],
  visitor: [
    "Yes, all visitors must sign in",
    "Yes, but informal",
    "No",
    "Not applicable (no visitors)",
  ],
  disposal: [
    "Professional IT disposal service",
    "Wipe and donate/recycle",
    "Physically destroy drives",
    "Just throw them away",
    "Store them / haven't disposed yet",
  ],
  breach: ["Yes", "No", "Not sure"],
  incident: [
    "Yes, fully documented",
    "Partially documented",
    "No, but we know what to do",
    "No plan at all",
    "EasyWISP will be my new incident response plan",
  ],
  years: [
    "3 years",
    "5 years",
    "7 years",
    "10 years",
    "Indefinitely",
    "Not sure",
  ],
  records: [
    "Professional shredding service",
    "Shred in-house",
    "Recycle/trash without shredding",
    "Store old records indefinitely",
    "Not sure",
  ],
  training: [
    "Yes, I have completed security awareness training",
    "No",
    "EasyWISP will be my new cybersecurity awareness training",
  ],
  builderRoleOptions: [
    "John Miller",
    "Sarah Chen",
    "David Patel",
    "Melissa Grant",
  ],
};
function setState(next) {
  state = { ...state, ...next };
  render();
}
const LOCAL_COMPANY_LOGO_KEY = "easywisp.settings.company-logo";
const LOCAL_RISK_DRAFT_KEY = "easywisp.risk-draft";
const LOCAL_WISP_DRAFT_KEY = "easywisp.builder-draft";
const LOCAL_ONBOARDING_COMPLETE_PREFIX = "easywisp.onboarding-complete:";
function isLocalMergeServiceAvailable() {
  return ["127.0.0.1", "localhost"].includes(window.location.hostname);
}
function getMergePreviewUrl() {
  const hostedRendererUrl = String(
    window.__ENV__?.WISP_RENDERER_URL || "",
  )
    .trim()
    .replace(/\/+$/, "");
  if (hostedRendererUrl) return `${hostedRendererUrl}/merge-preview`;
  if (isLocalMergeServiceAvailable())
    return "http://127.0.0.1:8766/merge-preview";
  return "";
}
async function getMergeRequestHeaders() {
  const accessToken = await getCurrentAccessToken();
  return {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}
function onboardingCompletionKey(userId) {
  return `${LOCAL_ONBOARDING_COMPLETE_PREFIX}${userId || ""}`;
}
function hasCachedOnboardingCompletion(userId) {
  try { return Boolean(userId && localStorage.getItem(onboardingCompletionKey(userId)) === "1"); } catch { return false; }
}
function cacheOnboardingCompletion(userId, completed) {
  try {
    if (!userId) return;
    if (completed) localStorage.setItem(onboardingCompletionKey(userId), "1");
    else localStorage.removeItem(onboardingCompletionKey(userId));
  } catch {}
}
function isStagingOnboardingResetEnabled() {
  const host = window.location.hostname;
  const projectUrl = window.__ENV__?.SUPABASE_URL || "";
  return host === "127.0.0.1" || host === "localhost" || projectUrl.includes("eugsdqwimpocfibmjfxa.supabase.co");
}
function loadLocalCompanyLogo() {
  try {
    const raw = localStorage.getItem(LOCAL_COMPANY_LOGO_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.name || !parsed?.previewUrl) return null;
    return parsed;
  } catch {
    return null;
  }
}
function saveLocalCompanyLogo(logo) {
  try {
    if (!logo) localStorage.removeItem(LOCAL_COMPANY_LOGO_KEY);
    else localStorage.setItem(LOCAL_COMPANY_LOGO_KEY, JSON.stringify(logo));
  } catch {
    // Ignore storage quota / privacy mode issues.
  }
}
function loadLocalRiskDraft() {
  try {
    const raw = localStorage.getItem(LOCAL_RISK_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.form || typeof parsed.form !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}
function saveLocalRiskDraft(form = state.form) {
  try {
    localStorage.setItem(
      LOCAL_RISK_DRAFT_KEY,
      JSON.stringify({
        form: structuredClone(form),
        updatedAt: new Date().toISOString(),
      }),
    );
  } catch {
    // Ignore storage quota / privacy mode issues.
  }
}
function applyLocalRiskDraft() {
  const localDraft = loadLocalRiskDraft();
  if (!localDraft?.form) return;
  state.form = { ...state.form, ...localDraft.form };
  if (localDraft.updatedAt) {
    state.riskDraftStatus = "saved";
    state.riskDraftSavedAt = localDraft.updatedAt;
  }
}
function loadLocalBuilderDraft() {
  try {
    const raw = localStorage.getItem(LOCAL_WISP_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.drafts || typeof parsed.drafts !== "object") return null;
    return {
      drafts: normalizeBuilderDraftMap(parsed.drafts),
      topicIndex: Number.isFinite(Number(parsed.topicIndex))
        ? Number(parsed.topicIndex)
        : null,
      updatedAt: parsed.updatedAt || "",
    };
  } catch {
    return null;
  }
}
function saveLocalBuilderDraft(drafts = state.builderDrafts, meta = {}) {
  try {
    localStorage.setItem(
      LOCAL_WISP_DRAFT_KEY,
      JSON.stringify({
        drafts: normalizeBuilderDraftMap(structuredClone(drafts || {})),
        topicIndex:
          typeof meta.topicIndex === "number"
            ? meta.topicIndex
            : state.builderTopicIndex,
        updatedAt: new Date().toISOString(),
      }),
    );
  } catch {
    // Ignore storage quota / privacy mode issues.
  }
}
function applyLocalBuilderDraft() {
  const localDraft = loadLocalBuilderDraft();
  if (!localDraft?.drafts) return;
  state.builderDrafts = { ...state.builderDrafts, ...localDraft.drafts };
  if (Number.isInteger(localDraft.topicIndex)) {
    state.builderTopicIndex = Math.max(
      0,
      Math.min(localDraft.topicIndex, builderTopics.length - 1),
    );
  }
}
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () =>
      reject(reader.error || new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}
function formatDisplayFileName(name, fallback = "Company logo") {
  if (!name) return fallback;
  const baseName = String(name).split(/[\\/]/).pop() || "";
  const withoutExtension = baseName.replace(/\.[^.]+$/, "");
  const normalized = withoutExtension
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return fallback;
  return normalized.length > 42
    ? normalized.slice(0, 39).trimEnd() + "?"
    : normalized;
}
async function applyCompanyLogoFile(file) {
  if (!file) return;
  if (file.size > MAX_COMPANY_LOGO_BYTES) {
    showToast("Choose a logo smaller than 5 MB.", "error");
    return;
  }
  const previewUrl = await readFileAsDataUrl(file);
  state.settingsLogo = {
    name: file.name,
    size: file.size,
    type: file.type,
    previewUrl,
  };
  saveLocalCompanyLogo(state.settingsLogo);
  render();
  try {
    const uploaded = await uploadCompanyLogo(file);
    if (uploaded?.logo_url) {
      state.settingsLogo = {
        ...state.settingsLogo,
        storagePath: uploaded.logo_path || state.settingsLogo.storagePath,
        previewUrl: uploaded.logo_url,
      };
      saveLocalCompanyLogo(state.settingsLogo);
      render();
    } else if (uploaded?.logo_path) {
      state.settingsLogo = {
        ...state.settingsLogo,
        storagePath: uploaded.logo_path,
      };
      saveLocalCompanyLogo(state.settingsLogo);
      render();
    }
  } catch (error) {
    console.warn("Logo upload skipped", error);
  }
}
async function clearCompanyLogo() {
  state.settingsLogo = null;
  saveLocalCompanyLogo(null);
  try {
    await removeCompanyLogo();
    appendSettingsActivityLog("Settings Change", "Company logo removed");
    scheduleSettingsSync();
  } catch (error) {
    console.warn("Company logo removal sync skipped", error);
  }
  render();
}
let builderLaunchAnimationResetTimer = null;
let lastRenderedScreen = null;
function isAssessmentField(name) {
  return (
    [
      "companyName",
      "primaryContact",
      "practiceType",
      "staffSize",
      "taxSoftware",
      "itManagement",
    ].includes(name) || String(name || "").startsWith("question_")
  );
}
function scheduleRiskDraftSync(meta = {}) {
  clearTimeout(riskDraftSyncTimer);
  state.riskDraftStatus = "pending";
  riskDraftSyncTimer = setTimeout(() => {
    state.riskDraftStatus = "saving";
    persistRiskDraft(buildRiskDraftMeta(meta)).catch((error) =>
      console.warn("Risk draft sync skipped", error),
    );
  }, 400);
}
async function flushRiskDraftSync(meta = {}) {
  clearTimeout(riskDraftSyncTimer);
  riskDraftSyncTimer = null;
  state.riskDraftStatus = "saving";
  return await persistRiskDraft(buildRiskDraftMeta(meta));
}
function buildRiskAnswerRows() {
  return assessmentQuestions
    .map((item, index) => {
      const question_key = `question_${index + 1}`;
      const answer_value = state.form[question_key];
      if (!answer_value) return null;
      const selected = item.options.find(
        (option) => option.label === answer_value,
      );
      return {
        question_key,
        question_label: item.question,
        answer_value,
        score: selected?.score ?? null,
      };
    })
    .filter(Boolean);
}
function buildRiskDraftMeta(meta = {}) {
  const answerRows = buildRiskAnswerRows();
  const hasAnyAnswers = answerRows.length > 0;
  return {
    ...meta,
    answerRows,
    scoreSummary:
      meta.scoreSummary || (hasAnyAnswers ? scoreAssessment() : undefined),
  };
}
async function persistRiskDraft(meta = {}) {
  try {
    const saved = await saveRiskAssessmentDraft(state.form, meta);
    saveLocalRiskDraft(state.form);
    state.riskDraftStatus = "saved";
    state.riskDraftSavedAt = new Date().toISOString();
    if (saved?.company_name || saved?.primary_contact) {
      state.firmProfile = {
        ...(state.firmProfile || {}),
        name: saved.company_name || state.firmProfile?.name,
        primary_contact:
          saved.primary_contact || state.firmProfile?.primary_contact,
      };
    }
    if (saved?.dashboard_facts) {
      state.dashboardData = saved.dashboard_facts;
      return saved;
    }
    if (meta.scoreSummary) {
      state.dashboardData = {
        ...(state.dashboardData || {}),
        completion_percent:
          meta.scoreSummary.overall ||
          state.dashboardData?.completion_percent ||
          68,
        focus_area:
          meta.scoreSummary.topArea ||
          state.dashboardData?.focus_area ||
          "Administrative Safeguards",
        status_label:
          (meta.scoreSummary.overall || 68) >= 80 ? "On Track" : "In Progress",
        next_audit_label: state.dashboardData?.next_audit_label || "Mar 2026",
        section_count: state.dashboardData?.section_count || 12,
        updated_at: new Date().toISOString(),
      };
    }
    return saved;
  } catch (error) {
    state.riskDraftStatus = "error";
    throw error;
  }
}
function getBuilderDraftMeta(meta = {}) {
  return {
    ...meta,
    assessmentSnapshot: {
      ...(state.wispProject?.assessment_snapshot || {}),
      ...(meta.assessmentSnapshot || {}),
      builderTopicIndex: state.builderTopicIndex,
    },
  };
}
function getSavedBuilderTopicIndex() {
  const savedIndex = Number(
    state.wispProject?.assessment_snapshot?.builderTopicIndex,
  );
  if (Number.isNaN(savedIndex)) return 0;
  return Math.max(0, Math.min(savedIndex, builderTopics.length - 1));
}
function getBuilderEditorEntryState() {
  return {
    screen: "builder",
    builderTab: "pending",
    builderResumeEditing: true,
    builderLaunchAnimation: true,
    builderSidebarOpen: false,
    builderReviewLoading: false,
    builderReviewOpen: false,
    builderReviewPage: 0,
    builderTopicIndex: hasPendingWispDraft() ? getSavedBuilderTopicIndex() : 0,
    errors: {},
  };
}
function getBuilderOverviewState() {
  return {
    screen: "builder",
    builderTab: hasPendingWispDraft() ? "pending" : "active",
    builderResumeEditing: false,
    builderLaunchAnimation: false,
    builderSidebarOpen: false,
    builderReviewLoading: false,
    builderReviewOpen: false,
    builderReviewPage: 0,
    errors: {},
  };
}
function scheduleBuilderDraftSync(meta = {}) {
  saveLocalBuilderDraft(state.builderDrafts, {
    topicIndex: state.builderTopicIndex,
  });
  clearTimeout(builderDraftSyncTimer);
  builderDraftSyncTimer = setTimeout(() => {
    saveWispDraft(state.builderDrafts, getBuilderDraftMeta(meta))
      .then((savedProject) => {
        if (savedProject) {
          state.wispProject = savedProject;
          if (savedProject.dashboard_facts)
            state.dashboardData = savedProject.dashboard_facts;
        }
      })
      .catch((error) => console.warn("Builder draft sync skipped", error));
  }, 700);
}
function loadLocalSpecialDocuments() {
  try {
    return JSON.parse(
      localStorage.getItem("easywisp-special-documents") || "{}",
    );
  } catch {
    return {};
  }
}
function persistLocalSpecialDocuments() {
  try {
    localStorage.setItem(
      "easywisp-special-documents",
      JSON.stringify({
        recordRetentionPolicy: state.recordRetentionPolicy,
        disasterRecoveryPlan: state.disasterRecoveryPlan,
        incidentReport: state.incidentReport,
        dataBreachResponseGuideline: state.dataBreachResponseGuideline,
        dataBreachNotificationLetter: state.dataBreachNotificationLetter,
        specialDocumentInstances: state.specialDocumentInstances,
      }),
    );
  } catch (error) {
    console.warn("Local special document backup skipped", error);
  }
}
function loadLocalDocumentWorkspaces() {
  try {
    return normalizeDocumentWorkspaceMap(
      JSON.parse(localStorage.getItem("easywisp-document-workspaces") || "{}"),
    );
  } catch {
    return {};
  }
}
function persistLocalDocumentWorkspaces() {
  try {
    localStorage.setItem(
      "easywisp-document-workspaces",
      JSON.stringify(state.documentWorkspaces || {}),
    );
  } catch (error) {
    console.warn("Local document workspace backup skipped", error);
  }
}
function scheduleDocumentWorkspaceSync() {
  persistLocalDocumentWorkspaces();
  let snapshot;
  try {
    snapshot = JSON.parse(JSON.stringify(state.documentWorkspaces || {}));
  } catch {
    snapshot = {};
  }
  console.log(
    "[scheduleDocumentWorkspaceSync] pushing workspace ids:",
    Object.keys(snapshot),
  );
  documentWorkspaceSaveQueue = documentWorkspaceSaveQueue
    .catch(() => undefined)
    .then(() => saveDocumentWorkspaces(snapshot))
    .then((saved) => {
      if (saved && Object.keys(saved).length) {
        console.log(
          "[scheduleDocumentWorkspaceSync] save confirmed, returned ids:",
          Object.keys(saved),
        );
        state.documentWorkspaces = {
          ...state.documentWorkspaces,
          ...normalizeDocumentWorkspaceMap(saved),
        };
        persistLocalDocumentWorkspaces();
      } else {
        console.warn("[scheduleDocumentWorkspaceSync] save returned empty");
      }
    })
    .catch((error) =>
      console.warn("[scheduleDocumentWorkspaceSync] error:", error),
    );
  return documentWorkspaceSaveQueue;
}
function loadLocalWorkspaceSettings() {
  try {
    return normalizeSettingsData(
      JSON.parse(localStorage.getItem("easywisp-workspace-settings") || "null"),
    );
  } catch {
    return null;
  }
}
function persistLocalWorkspaceSettings(settings = state.settingsData) {
  try {
    localStorage.setItem(
      "easywisp-workspace-settings",
      JSON.stringify(normalizeSettingsData(settings)),
    );
  } catch (error) {
    console.warn("Local settings backup skipped", error);
  }
}
function queueSettingsSync(snapshot, revision) {
  settingsSaveQueue = settingsSaveQueue
    .catch(() => undefined)
    .then(() => saveWorkspaceSettings(snapshot))
    .then((saved) => {
      if (saved && revision === settingsSyncRevision) {
        state.settingsData = hydrateWorkspaceSettings(
          normalizeSettingsData(saved),
          {
            user: state.authUser,
            firm: state.firmProfile,
            onboarding: state.onboarding,
          },
        );
        persistLocalWorkspaceSettings();
      }
      return saved;
    })
    .catch((error) => {
      console.warn("Settings sync failed; local recovery copy retained", error);
      if (revision === settingsSyncRevision)
        showToast(
          "Settings saved locally. Supabase will retry on your next change.",
          "info",
        );
      return null;
    });
  return settingsSaveQueue;
}
function scheduleSettingsSync({ immediate = false } = {}) {
  persistLocalWorkspaceSettings();
  const revision = ++settingsSyncRevision;
  let snapshot;
  try {
    snapshot = JSON.parse(
      JSON.stringify(normalizeSettingsData(state.settingsData)),
    );
  } catch {
    snapshot = normalizeSettingsData(state.settingsData);
  }
  clearTimeout(settingsSyncTimer);
  if (immediate) return queueSettingsSync(snapshot, revision);
  settingsSyncTimer = setTimeout(() => {
    queueSettingsSync(snapshot, revision);
  }, 450);
  return Promise.resolve(null);
}
function appendSettingsActivityLog(activity, details, user = null) {
  state.settingsData = normalizeSettingsData(state.settingsData);
  state.settingsData.activityLogs = [
    {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      activity,
      user:
        user ||
        state.settingsData.profile?.name ||
        state.authUser?.email ||
        "Workspace User",
      details,
      date: new Date().toISOString(),
      ip: "Build-stage",
    },
    ...state.settingsData.activityLogs,
  ].slice(0, 100);
}
function resetWorkspaceState() {
  state.form = structuredClone(initialForm);
  state.errors = {};
  state.drawer = null;
  state.builderDrafts = normalizeBuilderDraftMap(
    structuredClone(initialBuilderDrafts),
  );
  state.builderAttachments = [];
  state.wispProject = null;
  state.wispVersions = [];
  state.documentsFiles = [];
  state.documentWorkspaces = {};
  state.documentEditor = null;
  state.terminatedEmployeeChecklists = [];
  state.terminatedEmployeeChecklistEditor = null;
  state.terminatedEmployeeChecklistSaving = false;
  state.recordRetentionPolicy = null;
  state.disasterRecoveryPlan = null;
  state.incidentReport = null;
  state.dataBreachResponseGuideline = null;
  state.dataBreachNotificationLetter = null;
  state.trainingAssets = structuredClone(trainingLibrary);
  state.settingsLogo = null;
  state.settingsData = defaultSettingsData();
  state.dashboardData = null;
  state.firmProfile = null;
  state.riskDraftStatus = "idle";
  state.riskDraftSavedAt = "";
  state.onboarding = null;
  state.onboardingSaving = false;
  state.onboardingError = "";
  state.workspaceResolving = false;
  state.workspaceResolvedForUserId = null;
}
function applyBootstrapState(bootstrap) {
  if (!bootstrap) return;
  console.log("[applyBootstrapState] received bootstrap", {
    hasDocWorkspaces: !!bootstrap.settings?.settings?.document_workspaces,
    workspaceKeys: Object.keys(
      bootstrap.settings?.settings?.document_workspaces || {},
    ),
    hasRecordRetention: !!bootstrap.recordRetentionPolicy,
    hasDisasterRecovery: !!bootstrap.disasterRecoveryPlan,
    hasIncidentReport: !!bootstrap.incidentReport,
    hasBreachGuideline: !!bootstrap.dataBreachResponseGuideline,
    hasBreachLetter: !!bootstrap.dataBreachNotificationLetter,
    terminatedChecklistCount: (bootstrap.terminatedEmployeeChecklists || [])
      .length,
  });
  state.authUser = bootstrap.user || null;
  state.onboarding = bootstrap.onboarding || state.onboarding;
  if (bootstrap.onboarding) {
    cacheOnboardingCompletion(bootstrap.user?.id, bootstrap.onboarding.status === "completed");
    if (bootstrap.onboarding.status !== "completed") state.screen = "onboarding";
  }
  if (bootstrap.firm) {
    state.firmProfile = bootstrap.firm;
    state.form = {
      ...state.form,
      companyName: bootstrap.firm.name || state.form.companyName,
      primaryContact:
        bootstrap.firm.primary_contact || state.form.primaryContact,
      practiceType: bootstrap.firm.practice_type || state.form.practiceType,
      staffSize: bootstrap.firm.staff_size || state.form.staffSize,
      taxSoftware: bootstrap.firm.tax_software || state.form.taxSoftware,
      itManagement: bootstrap.firm.it_management || state.form.itManagement,
    };
  }
  if (bootstrap.assessment) {
    const answers = bootstrap.assessment.answers || {};
    state.form = {
      ...state.form,
      companyName: bootstrap.assessment.company_name || state.form.companyName,
      primaryContact:
        bootstrap.assessment.primary_contact || state.form.primaryContact,
      practiceType:
        bootstrap.assessment.practice_type || state.form.practiceType,
      staffSize: bootstrap.assessment.staff_size || state.form.staffSize,
      taxSoftware: bootstrap.assessment.tax_software || state.form.taxSoftware,
      itManagement:
        bootstrap.assessment.it_management || state.form.itManagement,
      ...answers,
    };
  }
  state.documentsFiles = bootstrap.documents || state.documentsFiles;
  const remoteWorkspaces = normalizeDocumentWorkspaceMap(
    bootstrap.settings?.settings?.document_workspaces || {},
  );
  const localWorkspaces = loadLocalDocumentWorkspaces();
  state.documentWorkspaces =
    Object.keys(remoteWorkspaces).length > 0
      ? remoteWorkspaces
      : localWorkspaces;
  persistLocalDocumentWorkspaces();
  state.terminatedEmployeeChecklists = (
    bootstrap.terminatedEmployeeChecklists || []
  ).map(normalizeTerminatedEmployeeChecklist);
  const localSpecialDocuments = loadLocalSpecialDocuments();
  state.recordRetentionPolicy = normalizeRecordRetentionPolicy(
    bootstrap.recordRetentionPolicy ||
      localSpecialDocuments.recordRetentionPolicy,
  );
  state.disasterRecoveryPlan = normalizeDisasterRecoveryPlan(
    bootstrap.disasterRecoveryPlan ||
      localSpecialDocuments.disasterRecoveryPlan,
  );
  state.incidentReport = normalizeIncidentReport(
    bootstrap.incidentReport || localSpecialDocuments.incidentReport,
  );
  state.dataBreachResponseGuideline = normalizeDataBreachResponseGuideline(
    bootstrap.dataBreachResponseGuideline ||
      localSpecialDocuments.dataBreachResponseGuideline,
  );
  state.dataBreachNotificationLetter = normalizeDataBreachNotificationLetter(
    bootstrap.dataBreachNotificationLetter ||
      localSpecialDocuments.dataBreachNotificationLetter,
  );
  state.specialDocumentInstances = normalizeSpecialDocumentInstances(
    bootstrap.settings?.settings?.special_document_instances ||
      localSpecialDocuments.specialDocumentInstances ||
      {},
  );
  persistLocalSpecialDocuments();
  state.trainingAssets = bootstrap.trainingAssets || state.trainingAssets;
  state.dashboardData = bootstrap.dashboard || state.dashboardData;
  state.wispProject = bootstrap.wispProject || state.wispProject;
  state.wispVersions = bootstrap.wispVersions || state.wispVersions;
  state.builderAttachments = Array.isArray(bootstrap.wispAttachments)
    ? bootstrap.wispAttachments
    : state.builderAttachments;
  if (
    bootstrap.wispProject?.section_drafts &&
    Object.keys(bootstrap.wispProject.section_drafts).length
  ) {
    state.builderDrafts = {
      ...state.builderDrafts,
      ...bootstrap.wispProject.section_drafts,
    };
  }
  if (
    bootstrap.wispProject?.assessment_snapshot?.builderTopicIndex !== undefined
  ) {
    state.builderTopicIndex = getSavedBuilderTopicIndex();
  }
  const localSettings = loadLocalWorkspaceSettings();
  const remoteSettings = bootstrap.settings?.settings || null;
  state.settingsData = hydrateWorkspaceSettings(
    normalizeSettingsData(remoteSettings || localSettings || state.settingsData),
    bootstrap,
  );
  if (Array.isArray(bootstrap.staff)) {
    state.settingsData.staff = normalizeSettingsData({ staff: bootstrap.staff }).staff;
  }
  persistLocalWorkspaceSettings();
  applyLocalRiskDraft();
  applyLocalBuilderDraft();
  const localCompanyLogo = loadLocalCompanyLogo();
  if (bootstrap.settings?.logo_path || localCompanyLogo) {
    const fileName =
      bootstrap.settings?.logo_path?.split("/").pop() ||
      localCompanyLogo?.name ||
      "Company logo";
    state.settingsLogo = {
      name: fileName,
      size: localCompanyLogo?.size || 0,
      type: localCompanyLogo?.type || "image/*",
      storagePath:
        bootstrap.settings?.logo_path || localCompanyLogo?.storagePath || null,
      previewUrl:
        localCompanyLogo?.previewUrl || bootstrap.settings?.logo_url || null,
    };
  }
}
async function syncAuthWorkspace() {
  try {
    const bootstrap = await fetchBootstrapState();
    if (bootstrap) applyBootstrapState(bootstrap);
    // A valid Supabase session is authoritative. Bootstrap data can be briefly
    // unavailable while a new firm is being provisioned, so never sign a user
    // out of the UI just because optional workspace loading failed.
    return Boolean(bootstrap);
  } catch (error) {
    console.warn("Auth workspace sync unavailable", error);
    return false;
  }
}
let acknowledgementStatusRefreshBusy = false;
async function refreshAcknowledgementRequestStatuses() {
  const projectId = state.wispProject?.id;
  if (!projectId || acknowledgementStatusRefreshBusy) return;
  acknowledgementStatusRefreshBusy = true;
  try {
    const acknowledgementRequests = await fetchWispAcknowledgementRequests(projectId);
    state.wispProject = { ...state.wispProject, acknowledgement_requests: acknowledgementRequests };
    render();
  } catch (error) {
    console.warn("Acknowledgement status refresh unavailable", error);
  } finally {
    acknowledgementStatusRefreshBusy = false;
  }
}
window.addEventListener("focus", () => {
  if (state.builderTab === "active") refreshAcknowledgementRequestStatuses();
});
async function bootstrapApp() {
  console.log("[bootstrapApp] starting");
  try {
    try {
      const supabaseModule = await import("./supabase-client.js");
      console.log("[bootstrapApp] supabase import succeeded");
      supabaseBackendLoaded = true;
      deleteDocument = supabaseModule.deleteDocument || deleteDocument;
      fetchBootstrapState =
        supabaseModule.fetchBootstrapState || fetchBootstrapState;
      finalizeWispBuild = supabaseModule.finalizeWispBuild || finalizeWispBuild;
      activateWispProject = supabaseModule.activateWispProject || activateWispProject;
      saveWispSignature = supabaseModule.saveWispSignature || saveWispSignature;
      createWispAcknowledgementRequests =
        supabaseModule.createWispAcknowledgementRequests ||
        createWispAcknowledgementRequests;
      fetchPublicWispAcknowledgementRequest =
        supabaseModule.fetchPublicWispAcknowledgementRequest ||
        fetchPublicWispAcknowledgementRequest;
      completePublicWispAcknowledgementRequest =
        supabaseModule.completePublicWispAcknowledgementRequest ||
        completePublicWispAcknowledgementRequest;
      getWispPdfPreviewUrl =
        supabaseModule.getWispPdfPreviewUrl || getWispPdfPreviewUrl;
      fetchWispAcknowledgementRequests =
        supabaseModule.fetchWispAcknowledgementRequests ||
        fetchWispAcknowledgementRequests;
      removeWispAcknowledgementRequest =
        supabaseModule.removeWispAcknowledgementRequest ||
        removeWispAcknowledgementRequest;
      hasSupabaseAuth = supabaseModule.hasSupabaseAuth || hasSupabaseAuth;
      getCurrentAccessToken =
        supabaseModule.getCurrentAccessToken || getCurrentAccessToken;
      saveRiskAssessmentDraft =
        supabaseModule.saveRiskAssessmentDraft || saveRiskAssessmentDraft;
      saveWispDraft = supabaseModule.saveWispDraft || saveWispDraft;
      uploadWispAttachments =
        supabaseModule.uploadWispAttachments || uploadWispAttachments;
      deleteWispAttachment =
        supabaseModule.deleteWispAttachment || deleteWispAttachment;
      reorderWispAttachments =
        supabaseModule.reorderWispAttachments || reorderWispAttachments;
      deleteWispProject = supabaseModule.deleteWispProject || deleteWispProject;
      saveDocumentWorkspaces =
        supabaseModule.saveDocumentWorkspaces || saveDocumentWorkspaces;
      saveWorkspaceSettings =
        supabaseModule.saveWorkspaceSettings || saveWorkspaceSettings;
      saveFirmProfile = supabaseModule.saveFirmProfile || saveFirmProfile;
      completeFirmOnboarding =
        supabaseModule.completeFirmOnboarding || completeFirmOnboarding;
      saveFirmOnboardingProgress =
        supabaseModule.saveFirmOnboardingProgress || saveFirmOnboardingProgress;
      resetFirmOnboardingForTesting =
        supabaseModule.resetFirmOnboardingForTesting || resetFirmOnboardingForTesting;
      updateWorkspaceAuthProfile =
        supabaseModule.updateWorkspaceAuthProfile || updateWorkspaceAuthProfile;
      saveFirmStaffMember =
        supabaseModule.saveFirmStaffMember || saveFirmStaffMember;
      deleteFirmStaffMember =
        supabaseModule.deleteFirmStaffMember || deleteFirmStaffMember;
      saveTerminatedEmployeeChecklist =
        supabaseModule.saveTerminatedEmployeeChecklist ||
        saveTerminatedEmployeeChecklist;
      exportTerminatedEmployeeChecklistPdf =
        supabaseModule.exportTerminatedEmployeeChecklistPdf ||
        exportTerminatedEmployeeChecklistPdf;
      saveRecordRetentionPolicy =
        supabaseModule.saveRecordRetentionPolicy || saveRecordRetentionPolicy;
      exportRecordRetentionPolicyPdf =
        supabaseModule.exportRecordRetentionPolicyPdf ||
        exportRecordRetentionPolicyPdf;
      saveDisasterRecoveryPlan =
        supabaseModule.saveDisasterRecoveryPlan || saveDisasterRecoveryPlan;
      exportDisasterRecoveryPlanPdf =
        supabaseModule.exportDisasterRecoveryPlanPdf ||
        exportDisasterRecoveryPlanPdf;
      saveIncidentReport =
        supabaseModule.saveIncidentReport || saveIncidentReport;
      exportIncidentReportPdf =
        supabaseModule.exportIncidentReportPdf || exportIncidentReportPdf;
      saveDataBreachResponseGuideline =
        supabaseModule.saveDataBreachResponseGuideline ||
        saveDataBreachResponseGuideline;
      exportDataBreachResponseGuidelinePdf =
        supabaseModule.exportDataBreachResponseGuidelinePdf ||
        exportDataBreachResponseGuidelinePdf;
      saveDataBreachNotificationLetter =
        supabaseModule.saveDataBreachNotificationLetter ||
        saveDataBreachNotificationLetter;
      exportDataBreachNotificationLetterPdf =
        supabaseModule.exportDataBreachNotificationLetterPdf ||
        exportDataBreachNotificationLetterPdf;
      flushDocumentWorkspacesKeepalive =
        supabaseModule.flushDocumentWorkspacesKeepalive ||
        flushDocumentWorkspacesKeepalive;
      saveSpecialDocumentInstances =
        supabaseModule.saveSpecialDocumentInstances ||
        saveSpecialDocumentInstances;
      saveTrainingSignInSheet =
        supabaseModule.saveTrainingSignInSheet || saveTrainingSignInSheet;
      fetchTrainingSignInSheet =
        supabaseModule.fetchTrainingSignInSheet || fetchTrainingSignInSheet;
      signInWithPassword =
        supabaseModule.signInWithPassword || signInWithPassword;
      signUpWithPassword =
        supabaseModule.signUpWithPassword || signUpWithPassword;
      signInWithMagicLink =
        supabaseModule.signInWithMagicLink || signInWithMagicLink;
      signOutCurrentUser =
        supabaseModule.signOutCurrentUser || signOutCurrentUser;
      subscribeToAuthChanges =
        supabaseModule.subscribeToAuthChanges || subscribeToAuthChanges;
      uploadCompanyLogo = supabaseModule.uploadCompanyLogo || uploadCompanyLogo;
      removeCompanyLogo = supabaseModule.removeCompanyLogo || removeCompanyLogo;
      uploadDocuments = supabaseModule.uploadDocuments || uploadDocuments;
      state.authAvailable = hasSupabaseAuth();
      authSubscriptionCleanup();
      if (state.authAvailable) {
        authSubscriptionCleanup = subscribeToAuthChanges(async (user, event) => {
          const wasAuthSubmission = state.authBusy;
          state.authReady = true;
          state.authBusy = false;
          // On a browser refresh, Supabase restores the session before the
          // first workspace bootstrap has returned. Keep that event in memory
          // and let the bootstrap render the first authenticated screen once.
          if (state.initialWorkspaceBootstrap) {
            if (user) state.authUser = user;
            return;
          }
          // Supabase can emit a late INITIAL_SESSION(null) while the sign-in
          // response is already being applied. Only an explicit sign-out may
          // clear an authenticated workspace from the UI.
          if (!user && event !== "SIGNED_OUT" && event !== "USER_DELETED") {
            // Do not redraw the form while a password submission is in flight.
            // Supabase can emit INITIAL_SESSION(null) after the user has clicked Sign in.
            if (!wasAuthSubmission && !state.authTransitioning) render();
            return;
          }
          const isSameAuthenticatedUser = state.authUser?.id === user?.id;
          state.authUser = user;
          state.authError = "";
          if (user) {
            // A persisted session (including INITIAL_SESSION on refresh) should
            // resume straight into the workspace. Reserve the handoff motion
            // for an intentional password sign-in from the auth form.
            const isFreshPasswordSignIn =
              event === "SIGNED_IN" && wasAuthSubmission && state.screen === "auth";
            if (isFreshPasswordSignIn) {
              beginAuthHandoff(user);
              return;
            }
            // Token refreshes and duplicate auth callbacks must not rebuild an
            // active onboarding form. The workspace has already been resolved.
            if (
              isSameAuthenticatedUser &&
              state.workspaceResolvedForUserId === user.id
            ) {
              return;
            }
            state.authTransitioning = false;
            void resolveAuthenticatedDestination();
            return;
          }
          resetWorkspaceState();
          render();
        });
      }
    } catch (error) {
      console.warn(
        "[bootstrapApp] Supabase import FAILED:",
        error.message || error,
      );
      state.authAvailable = false;
    }
    const bootstrap = await fetchBootstrapState();
    console.log(
      "[bootstrapApp] fetchBootstrapState returned:",
      bootstrap ? "data" : "null",
    );
    applyBootstrapState(bootstrap);
    if (bootstrap?.user?.id) {
      state.workspaceResolvedForUserId = bootstrap.user.id;
      state.screen = bootstrap.onboarding?.status === "completed" ? "home" : "onboarding";
    }
    if (!bootstrap) {
      console.log("[bootstrapApp] bootstrap null, loading from localStorage");
      state.settingsData = loadLocalWorkspaceSettings() || state.settingsData;
      state.documentWorkspaces = loadLocalDocumentWorkspaces();
      const localSpecialDocuments = loadLocalSpecialDocuments();
      state.recordRetentionPolicy = normalizeRecordRetentionPolicy(
        localSpecialDocuments.recordRetentionPolicy,
      );
      state.disasterRecoveryPlan = normalizeDisasterRecoveryPlan(
        localSpecialDocuments.disasterRecoveryPlan,
      );
      state.incidentReport = normalizeIncidentReport(
        localSpecialDocuments.incidentReport,
      );
      state.dataBreachResponseGuideline = normalizeDataBreachResponseGuideline(
        localSpecialDocuments.dataBreachResponseGuideline,
      );
      state.dataBreachNotificationLetter =
        normalizeDataBreachNotificationLetter(
          localSpecialDocuments.dataBreachNotificationLetter,
        );
      state.specialDocumentInstances = normalizeSpecialDocumentInstances(
        localSpecialDocuments.specialDocumentInstances || {},
      );
      applyLocalRiskDraft();
      applyLocalBuilderDraft();
    }
  } catch (error) {
    console.warn("[bootstrapApp] outer error:", error.message || error);
    state.settingsData = loadLocalWorkspaceSettings() || state.settingsData;
    state.documentWorkspaces = loadLocalDocumentWorkspaces();
    const localSpecialDocuments = loadLocalSpecialDocuments();
    state.recordRetentionPolicy = normalizeRecordRetentionPolicy(
      localSpecialDocuments.recordRetentionPolicy,
    );
    state.disasterRecoveryPlan = normalizeDisasterRecoveryPlan(
      localSpecialDocuments.disasterRecoveryPlan,
    );
    state.incidentReport = normalizeIncidentReport(
      localSpecialDocuments.incidentReport,
    );
    state.dataBreachResponseGuideline = normalizeDataBreachResponseGuideline(
      localSpecialDocuments.dataBreachResponseGuideline,
    );
    state.dataBreachNotificationLetter = normalizeDataBreachNotificationLetter(
      localSpecialDocuments.dataBreachNotificationLetter,
    );
    state.specialDocumentInstances = normalizeSpecialDocumentInstances(
      localSpecialDocuments.specialDocumentInstances || {},
    );
    applyLocalRiskDraft();
    applyLocalBuilderDraft();
  }
  state.initialWorkspaceBootstrap = false;
  state.authReady = true;
  // If the initial data request failed but Supabase restored a valid session,
  // continue the normal resolver after the loading shell has been released.
  if (!state.firmProfile && state.authUser) {
    void resolveAuthenticatedDestination();
  }
  render();
}
function updateField(name, value) {
  state.form[name] = value;
  if (state.errors[name]) delete state.errors[name];
  if (isAssessmentField(name)) {
    saveLocalRiskDraft();
    scheduleRiskDraftSync();
  }
  render();
}
function softUpdateField(name, value, element) {
  state.form[name] = value;
  element.classList.remove("error-field");
  clearFieldError(name, element);
  if (isAssessmentField(name)) {
    saveLocalRiskDraft();
    scheduleRiskDraftSync();
  }
}
function clearFieldError(name, element) {
  if (!state.errors[name]) return;
  delete state.errors[name];
  const fieldWrapper = element.closest(".field");
  const error = fieldWrapper?.querySelector(".error");
  if (error) {
    error.classList.remove("is-visible");
    error.textContent = "";
  }
}
function toggleArray(name, value) {
  const current = new Set(state.form[name]);
  if (current.has(value)) current.delete(value);
  else current.add(value);
  updateField(name, [...current]);
}
function softUpdateOption(name, value, element) {
  state.form[name] = value;
  clearFieldError(name, element);
  if (isAssessmentField(name)) {
    saveLocalRiskDraft();
    scheduleRiskDraftSync();
  }
}
function softToggleArray(name, value, element) {
  const current = new Set(state.form[name]);
  if (current.has(value)) current.delete(value);
  else current.add(value);
  state.form[name] = [...current];
  clearFieldError(name, element);
  if (isAssessmentField(name)) {
    saveLocalRiskDraft();
    scheduleRiskDraftSync();
  }
}
function toggleMfaMethodField(value, element) {
  softUpdateOption("mfaStatus", value, element);
  const conditional = document.querySelector(".conditional");
  if (!conditional) return;
  conditional.classList.toggle(
    "is-visible",
    ["Yes, on all systems", "Yes, on some systems"].includes(value),
  );
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
const builderEditorSelectionCache = new Map();
function builderIcon(name) {
  const icons = {
    bold: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4.5h5.15c2.1 0 3.35 1.18 3.35 2.95 0 1.22-.63 2.2-1.72 2.64 1.48.34 2.37 1.47 2.37 3.06 0 1.95-1.39 3.4-4.02 3.4H6z"></path><path d="M8.3 6.4v2.98h2.45c1.07 0 1.7-.57 1.7-1.49 0-.95-.63-1.49-1.78-1.49zm0 4.84v3.36h2.75c1.22 0 1.9-.6 1.9-1.65s-.67-1.71-1.96-1.71z"></path></svg>`,
    italic: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 4.75h7"></path><path d="M5 15.25h7"></path><path d="M11.75 4.75 8.25 15.25"></path></svg>`,
    underline: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4.75v5.15a4 4 0 0 0 8 0V4.75"></path><path d="M4.5 15.25h11"></path></svg>`,
    strike: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.2 6.8c.45-1.4 1.78-2.3 3.9-2.3 2.37 0 3.8.93 4.28 2.65"></path><path d="M4 10h12"></path><path d="M14.55 12.15c-.33 1.95-1.96 3.05-4.55 3.05-2.47 0-4.01-.99-4.54-2.87"></path></svg>`,
    link: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8.05 11.95 6.4 13.6a3.05 3.05 0 1 1-4.31-4.31l2.65-2.65a3.05 3.05 0 0 1 4.31 0"></path><path d="m11.95 8.05 1.65-1.65a3.05 3.05 0 1 1 4.31 4.31l-2.65 2.65a3.05 3.05 0 0 1-4.31 0"></path><path d="m7.75 12.25 4.5-4.5"></path></svg>`,
    ordered: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8.4 5.5h7.2"></path><path d="M8.4 10h7.2"></path><path d="M8.4 14.5h7.2"></path><path d="M4.05 5.05h1.65v3.15"></path><path d="M3.65 14.5h2.3"></path><path d="M4 9.05c1.2-.9 1.85-1.45 1.85-2.3 0-.72-.46-1.2-1.22-1.2-.55 0-1 .2-1.45.65"></path><path d="M3.95 11.75c.35-.28.8-.45 1.28-.45 1 0 1.6.56 1.6 1.42 0 .9-.67 1.53-1.78 1.53-.62 0-1.18-.18-1.62-.55"></path></svg>`,
    bullet: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8.4 5.5h7.2"></path><path d="M8.4 10h7.2"></path><path d="M8.4 14.5h7.2"></path><circle cx="4.5" cy="5.5" r="1"></circle><circle cx="4.5" cy="10" r="1"></circle><circle cx="4.5" cy="14.5" r="1"></circle></svg>`,
    alignLeft: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 5.5h11"></path><path d="M4.5 9h8.5"></path><path d="M4.5 12.5h11"></path><path d="M4.5 16h7"></path></svg>`,
    alignCenter: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 5.5h11"></path><path d="M5.75 9h8.5"></path><path d="M4.5 12.5h11"></path><path d="M6.75 16h6.5"></path></svg>`,
    alignRight: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 5.5h11"></path><path d="M7 9h8.5"></path><path d="M4.5 12.5h11"></path><path d="M8.5 16h7"></path></svg>`,
    undo: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.25 6.35 4.1 9.5l3.15 3.15"></path><path d="M4.45 9.5h6.3c2.9 0 4.8 1.55 4.8 4.15"></path></svg>`,
    redo: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.75 6.35 3.15 3.15-3.15 3.15"></path><path d="M15.55 9.5h-6.3c-2.9 0-4.8 1.55-4.8 4.15"></path></svg>`,
  };
  return icons[name] || "";
}
function builderToolbarMarkup(editorId) {
  return `    <div class="builder-toolbar-group">      <select class="builder-tool-select" data-editor-style="${attr(editorId)}" aria-label="Text style">        <option value="p">Normal</option>        <option value="h1">Heading 1</option>        <option value="h2">Heading 2</option>        <option value="h3">Heading 3</option>        <option value="h4">Heading 4</option>      </select>    </div>    <span class="builder-tool-sep" aria-hidden="true"></span>    <div class="builder-toolbar-group">      <button class="builder-tool" type="button" data-editor-command="bold" data-editor-id="${attr(editorId)}" aria-label="Bold">${builderIcon("bold")}</button>      <button class="builder-tool" type="button" data-editor-command="italic" data-editor-id="${attr(editorId)}" aria-label="Italic">${builderIcon("italic")}</button>      <button class="builder-tool" type="button" data-editor-command="underline" data-editor-id="${attr(editorId)}" aria-label="Underline">${builderIcon("underline")}</button>      <button class="builder-tool" type="button" data-editor-command="strikeThrough" data-editor-id="${attr(editorId)}" aria-label="Strikethrough">${builderIcon("strike")}</button>      <button class="builder-tool" type="button" data-editor-action="link" data-editor-id="${attr(editorId)}" aria-label="Add or edit link">${builderIcon("link")}</button>    </div>    <span class="builder-tool-sep" aria-hidden="true"></span>    <div class="builder-toolbar-group">      <button class="builder-tool" type="button" data-editor-command="insertOrderedList" data-editor-id="${attr(editorId)}" aria-label="Numbered list">${builderIcon("ordered")}</button>      <button class="builder-tool" type="button" data-editor-command="insertUnorderedList" data-editor-id="${attr(editorId)}" aria-label="Bulleted list">${builderIcon("bullet")}</button>    </div>    <span class="builder-tool-sep" aria-hidden="true"></span>    <div class="builder-toolbar-group">      <button class="builder-tool" type="button" data-editor-command="justifyLeft" data-editor-id="${attr(editorId)}" aria-label="Align left">${builderIcon("alignLeft")}</button>      <button class="builder-tool" type="button" data-editor-command="justifyCenter" data-editor-id="${attr(editorId)}" aria-label="Align center">${builderIcon("alignCenter")}</button>      <button class="builder-tool" type="button" data-editor-command="justifyRight" data-editor-id="${attr(editorId)}" aria-label="Align right">${builderIcon("alignRight")}</button>    </div>    <span class="builder-tool-sep" aria-hidden="true"></span>    <div class="builder-toolbar-group">      <button class="builder-tool" type="button" data-editor-command="undo" data-editor-id="${attr(editorId)}" aria-label="Undo">${builderIcon("undo")}</button>      <button class="builder-tool" type="button" data-editor-command="redo" data-editor-id="${attr(editorId)}" aria-label="Redo">${builderIcon("redo")}</button>    </div>    <div class="builder-link-popover" data-editor-link-popover="${attr(editorId)}" hidden>      <div class="builder-link-popover-card">        <div class="builder-link-popover-fields">          <label class="builder-link-field">            <span>Link text</span>            <input type="text" data-editor-link-text="${attr(editorId)}" placeholder="Enter link text" />          </label>          <label class="builder-link-field">            <span>URL</span>            <input type="url" data-editor-link-url="${attr(editorId)}" placeholder="https://example.com" />          </label>        </div>        <div class="builder-link-popover-actions">          <button class="btn ghost small" type="button" data-editor-link-remove="${attr(editorId)}">Remove link</button>          <div class="builder-link-popover-actions-right">            <button class="btn ghost small" type="button" data-editor-link-cancel="${attr(editorId)}">Cancel</button>            <button class="btn primary small" type="button" data-editor-link-apply="${attr(editorId)}">Apply</button>          </div>        </div>      </div>    </div>  `;
}
function upgradeBuilderEditors() {
  document.querySelectorAll(".builder-editor-surface").forEach((surface) => {
    const editor = surface.querySelector("[data-builder-editor]");
    const toolbar = surface.querySelector(".builder-editor-toolbar");
    if (!editor || !toolbar) return;
    const editorId = editor.dataset.builderEditor;
    toolbar.innerHTML = builderToolbarMarkup(editorId);
    toolbar.dataset.editorToolbar = editorId;
  });
}
function getBuilderEditor(editorId) {
  return document.querySelector(
    `[data-builder-editor="${CSS.escape(editorId)}"]`,
  );
}
function getBuilderToolbar(editorId) {
  return document.querySelector(
    `[data-editor-toolbar="${CSS.escape(editorId)}"]`,
  );
}
function saveBuilderSelection(editorId) {
  const editor = getBuilderEditor(editorId);
  const selection = window.getSelection();
  if (!editor || !selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return;
  builderEditorSelectionCache.set(editorId, range.cloneRange());
}
function restoreBuilderSelection(editorId) {
  const range = builderEditorSelectionCache.get(editorId);
  const editor = getBuilderEditor(editorId);
  const selection = window.getSelection();
  if (!range || !editor || !selection) return false;
  selection.removeAllRanges();
  selection.addRange(range);
  return true;
}
function normalizeBuilderUrl(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) return "";
  if (/^(javascript|data):/i.test(value)) return "";
  if (/^(https?:|mailto:|tel:|#)/i.test(value)) return value;
  return `https://${value}`;
}
function findClosestLink(node, editor) {
  if (!node) return null;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  if (!(node instanceof Element)) return null;
  const link = node.closest("a");
  return link && editor.contains(link) ? link : null;
}
function getBuilderSelectionContext(editor) {
  const selection = window.getSelection();
  if (!editor || !selection || selection.rangeCount === 0)
    return { selectedText: "", link: null };
  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer))
    return { selectedText: "", link: null };
  return {
    selectedText: selection.toString(),
    link: findClosestLink(selection.anchorNode, editor),
  };
}
function closeAllBuilderLinkPopovers() {
  document.querySelectorAll("[data-editor-link-popover]").forEach((popover) => {
    popover.hidden = true;
    popover.classList.remove("is-open");
  });
}
function openBuilderLinkPopover(editorId) {
  const editor = getBuilderEditor(editorId);
  const toolbar = getBuilderToolbar(editorId);
  const popover = document.querySelector(
    `[data-editor-link-popover="${CSS.escape(editorId)}"]`,
  );
  const textInput = document.querySelector(
    `[data-editor-link-text="${CSS.escape(editorId)}"]`,
  );
  const urlInput = document.querySelector(
    `[data-editor-link-url="${CSS.escape(editorId)}"]`,
  );
  if (!editor || !toolbar || !popover || !textInput || !urlInput) return;
  saveBuilderSelection(editorId);
  const { selectedText, link } = getBuilderSelectionContext(editor);
  closeAllBuilderLinkPopovers();
  textInput.value = selectedText || link?.textContent || "";
  urlInput.value = link?.getAttribute("href") || "";
  popover.hidden = false;
  popover.classList.add("is-open");
  toolbar.classList.add("has-open-popover");
  setTimeout(() => textInput.focus(), 0);
}
function closeBuilderLinkPopover(editorId) {
  const toolbar = getBuilderToolbar(editorId);
  const popover = document.querySelector(
    `[data-editor-link-popover="${CSS.escape(editorId)}"]`,
  );
  if (popover) {
    popover.hidden = true;
    popover.classList.remove("is-open");
  }
  toolbar?.classList.remove("has-open-popover");
}
function persistBuilderEditor(editorId) {
  const editor = getBuilderEditor(editorId);
  if (!editor) return;
  const instance = activeSpecialDocumentInstance();
  if (instance) {
    if (editorId === "disaster-recovery-plan") {
      instance.data.planText = editor.innerHTML;
      scheduleSpecialDocumentInstancesSync();
      return;
    }
    if (editorId === "data-breach-notification-letter") {
      instance.data.body = editor.innerHTML;
      scheduleSpecialDocumentInstancesSync();
      return;
    }
    if (editorId === "data-breach-response-guideline") {
      instance.data.guidelineText = editor.innerHTML;
      scheduleSpecialDocumentInstancesSync();
      return;
    }
    const incidentField = {
      "incident-event-summary": "eventSummary",
      "incident-pii-types": "piiTypes",
    }[editorId];
    if (incidentField) {
      instance.data[incidentField] = editor.innerHTML;
      scheduleSpecialDocumentInstancesSync();
      return;
    }
  } // Fallback to old behavior
  if (editorId === "disaster-recovery-plan") {
    state.disasterRecoveryPlan = normalizeDisasterRecoveryPlan(
      state.disasterRecoveryPlan,
    );
    state.disasterRecoveryPlan.data.planText = editor.innerHTML;
    scheduleDisasterRecoveryPlanSave();
    return;
  }
  if (editorId === "data-breach-notification-letter") {
    state.dataBreachNotificationLetter = normalizeDataBreachNotificationLetter(
      state.dataBreachNotificationLetter,
    );
    state.dataBreachNotificationLetter.data.body = editor.innerHTML;
    scheduleDataBreachNotificationLetterSave();
    return;
  }
  if (editorId === "data-breach-response-guideline") {
    state.dataBreachResponseGuideline = normalizeDataBreachResponseGuideline(
      state.dataBreachResponseGuideline,
    );
    state.dataBreachResponseGuideline.data.guidelineText = editor.innerHTML;
    scheduleDataBreachResponseGuidelineSave();
    return;
  }
  const incidentField = {
    "incident-event-summary": "eventSummary",
    "incident-pii-types": "piiTypes",
  }[editorId];
  if (incidentField) {
    state.incidentReport = normalizeIncidentReport(state.incidentReport);
    state.incidentReport.data[incidentField] = editor.innerHTML;
    scheduleIncidentReportSave();
    return;
  }
  state.builderDrafts[editorId] = editor.innerHTML;
  scheduleBuilderDraftSync({ status: "draft" });
}
function applyBuilderLink(editorId) {
  const editor = getBuilderEditor(editorId);
  const textInput = document.querySelector(
    `[data-editor-link-text="${CSS.escape(editorId)}"]`,
  );
  const urlInput = document.querySelector(
    `[data-editor-link-url="${CSS.escape(editorId)}"]`,
  );
  if (!editor || !textInput || !urlInput) return;
  const href = normalizeBuilderUrl(urlInput.value);
  const text = textInput.value.trim();
  if (!href) {
    closeBuilderLinkPopover(editorId);
    return;
  }
  editor.focus();
  restoreBuilderSelection(editorId);
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim() || "";
  if (selectedText) {
    document.execCommand("createLink", false, href);
    const link = findClosestLink(selection?.anchorNode, editor);
    if (link) {
      if (text) link.textContent = text;
      link.setAttribute("href", href);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  } else {
    const safeText = escapeHtml(text || href);
    document.execCommand(
      "insertHTML",
      false,
      `<a href="${attr(href)}" target="_blank" rel="noopener noreferrer">${safeText}</a>`,
    );
  }
  persistBuilderEditor(editorId);
  syncBuilderEditorUi(editorId);
  closeBuilderLinkPopover(editorId);
}
function removeBuilderLink(editorId) {
  const editor = getBuilderEditor(editorId);
  if (!editor) return;
  editor.focus();
  restoreBuilderSelection(editorId);
  document.execCommand("unlink", false);
  persistBuilderEditor(editorId);
  syncBuilderEditorUi(editorId);
  closeBuilderLinkPopover(editorId);
}
function queryBuilderCommandState(command) {
  try {
    return document.queryCommandState(command);
  } catch {
    return false;
  }
}
function queryBuilderCommandEnabled(command) {
  try {
    return document.queryCommandEnabled(command);
  } catch {
    return true;
  }
}
function queryBuilderCommandValue(command) {
  try {
    return document.queryCommandValue(command);
  } catch {
    return "";
  }
}
function normalizeBuilderBlockValue(value) {
  const normalized = String(value || "")
    .replace(/[<>]/g, "")
    .toLowerCase();
  if (["h1", "h2", "h3", "h4", "p"].includes(normalized)) return normalized;
  return "p";
}
function syncBuilderEditorUi(editorId) {
  const editor = getBuilderEditor(editorId);
  const toolbar = getBuilderToolbar(editorId);
  if (!editor || !toolbar) return;
  const selection = window.getSelection();
  const hasSelection =
    !!selection &&
    selection.rangeCount > 0 &&
    editor.contains(selection.anchorNode);
  const link = hasSelection
    ? findClosestLink(selection.anchorNode, editor)
    : null;
  toolbar.querySelectorAll("[data-editor-command]").forEach((button) => {
    const command = button.dataset.editorCommand;
    const active = hasSelection && queryBuilderCommandState(command);
    const enabled = hasSelection
      ? queryBuilderCommandEnabled(command)
      : !["undo", "redo"].includes(command);
    button.classList.toggle("is-active", active);
    button.disabled = !enabled;
  });
  const linkButton = toolbar.querySelector("[data-editor-action='link']");
  if (linkButton) {
    linkButton.classList.toggle("is-active", !!link);
    linkButton.disabled = false;
  }
  const styleSelect = toolbar.querySelector("[data-editor-style]");
  if (styleSelect) {
    styleSelect.value = hasSelection
      ? normalizeBuilderBlockValue(queryBuilderCommandValue("formatBlock"))
      : "p";
  }
}
function handleBuilderEditorCommand(editorId, command) {
  const editor = getBuilderEditor(editorId);
  if (!editor) return;
  editor.focus();
  restoreBuilderSelection(editorId);
  document.execCommand(command, false);
  persistBuilderEditor(editorId);
  saveBuilderSelection(editorId);
  syncBuilderEditorUi(editorId);
}
function handleBuilderEditorStyle(editorId, value) {
  const editor = getBuilderEditor(editorId);
  if (!editor) return;
  editor.focus();
  restoreBuilderSelection(editorId);
  const blockValue = value === "p" ? "p" : `<${value}>`;
  document.execCommand("formatBlock", false, blockValue);
  persistBuilderEditor(editorId);
  saveBuilderSelection(editorId);
  syncBuilderEditorUi(editorId);
}
function field(
  name,
  label,
  type = "text",
  helper = "",
  placeholder = "",
  optional = false,
) {
  const value = state.form[name] ?? "";
  const error = state.errors[name];
  return `    <label class="field">      <span class="label">${label} ${optional ? '<span class="optional">Optional</span>' : "*"}</span>      <input class="input ${error ? "error-field" : ""}" type="${type}" value="${attr(value)}" placeholder="${attr(placeholder)}" data-field="${name}" />      ${helper ? `<span class="field-help">${helper}</span>` : ""}      <span class="error ${error ? "is-visible" : ""}">${error || ""}</span>    </label>  `;
}
function textarea(name, label, helper = "", optional = true) {
  const value = state.form[name] ?? "";
  const error = state.errors[name];
  return `    <label class="field">      <span class="label">${label} ${optional ? '<span class="optional">Optional</span>' : "*"}</span>      <textarea class="textarea ${error ? "error-field" : ""}" data-field="${name}">${escapeHtml(value)}</textarea>      ${helper ? `<span class="field-help">${helper}</span>` : ""}      <span class="error ${error ? "is-visible" : ""}">${error || ""}</span>    </label>  `;
}
function select(name, label, choices, helper = "", placeholder = "Select...") {
  const value = state.form[name] ?? "";
  const error = state.errors[name];
  return `    <label class="field">      <span class="label">${label} *</span>      <select class="select ${error ? "error-field" : ""}" data-field="${name}">        <option value="">${placeholder}</option>        ${choices.map((choice) => `<option value="${attr(choice)}" ${value === choice ? "selected" : ""}>${choice}</option>`).join("")}      </select>      ${helper ? `<span class="field-help">${helper}</span>` : ""}      <span class="error ${error ? "is-visible" : ""}">${error || ""}</span>    </label>  `;
}
function radioGroup(name, label, choices, helper = "", columns = "") {
  const value = state.form[name];
  const error = state.errors[name];
  return `    <div class="field">      <span class="label">${label} *</span>      ${helper ? `<span class="field-help">${helper}</span>` : ""}      <div class="choice-grid ${columns}">        ${choices.map((choice) => `          <label class="choice">            <input type="radio" name="${name}" value="${attr(choice)}" ${value === choice ? "checked" : ""} data-radio="${name}" />            <span>${choice}</span>          </label>        `).join("")}      </div>      <span class="error ${error ? "is-visible" : ""}">${error || ""}</span>    </div>  `;
}
function checkboxGroup(name, label, choices, helper = "", columns = "") {
  const selected = state.form[name] || [];
  const error = state.errors[name];
  return `    <div class="field">      <span class="label">${label} *</span>      ${helper ? `<span class="field-help">${helper}</span>` : ""}      <div class="choice-grid ${columns}">        ${choices.map((choice) => `          <label class="choice">            <input type="checkbox" value="${attr(choice)}" ${selected.includes(choice) ? "checked" : ""} data-checkbox="${name}" />            <span>${choice}</span>          </label>        `).join("")}      </div>      <span class="error ${error ? "is-visible" : ""}">${error || ""}</span>    </div>  `;
}
function segmented(name, choices) {
  const value = state.form[name];
  return `    <div class="segmented" data-segmented="${name}">      ${choices.map((choice) => `<button class="segment ${value === choice ? "is-active" : ""}" type="button" data-value="${attr(choice)}">${choice}</button>`).join("")}    </div>    <span class="error ${state.errors[name] ? "is-visible" : ""}">${state.errors[name] || ""}</span>  `;
}
function card(title, body, helper = "", extra = "") {
  return `    <section class="card pad ${extra}">      <div class="card-head">        <div class="card-title-block">          <h3>${title}</h3>          ${helper ? `<p>${helper}</p>` : ""}        </div>      </div>      ${body}    </section>  `;
}
function welcomeScreen() {
  return `    <main class="welcome risk-assessment-page">      <section class="risk-assessment-head">        <h1>Risk Assessment</h1>        <p>Analyze your firm&rsquo;s current operational security to identify gaps and prioritize requirements before building your Written Information Security Program (WISP).</p>      </section>      <section class="assessment-overview-card">        <div class="assessment-overview-copy">          <p class="assessment-eyebrow">Assessment overview</p>          <h2>The Risk Assessment is a foundational step, covering 8 critical security sections. Completing this review helps us generate prioritized recommendations for your WISP.</h2>        </div>        <aside class="assessment-overview-side">          <div class="assessment-meta-list">            <div class="assessment-meta-row">              <span>Estimated time</span>              <strong>8&ndash;12 minutes</strong>            </div>            <div class="assessment-meta-row">              <span>Covers</span>              <strong>8 security sections</strong>            </div>            <div class="assessment-meta-row">              <span>Prerequisites</span>              <strong>Best completed by someone familiar with firm systems, access, and record practices.</strong>            </div>          </div>          <div class="assessment-actions">            <button class="btn primary assessment-primary" data-action="start">Start assessment</button>            <button class="btn secondary assessment-secondary" data-action="resume">Resume saved assessment</button>          </div>        </aside>      </section>      <section class="risk-assessment-grid">        <article class="assessment-outcomes-card">          <p class="assessment-eyebrow">What the assessment produces</p>          <div class="assessment-outcomes-layout">            <div class="assessment-outcomes-intro">              <h3>What the assessment produces</h3>              <p>The report turns submitted answers in a practical readiness view; where safeguards appear, where documentation is thin, and what should be addressed first.</p>            </div>            <div class="assessment-outcomes-list">              <div class="assessment-outcome-row">                <span class="assessment-outcome-index">01</span>                <div>                  <strong>Readiness score</strong>                  <p>An overall score based on your submitted assessment sections.</p>                </div>              </div>              <div class="assessment-outcome-row">                <span class="assessment-outcome-index">02</span>                <div>                  <strong>Section findings</strong>                  <p>Detailed analysis across critical areas like data access, access controls, physical safeguards, and personnel.</p>                </div>              </div>              <div class="assessment-outcome-row">                <span class="assessment-outcome-index">03</span>                <div>                  <strong>Prioritized improvements</strong>                  <p>A prioritized list of required controls to address, categorized by importance.</p>                </div>              </div>            </div>          </div>        </article>        <aside class="assessment-side-stack">          <section class="assessment-side-card">            <h3>What to have ready</h3>            <ul>              <li>Key software (tax, email, file storage)</li>              <li>Firm network setup and Wi-Fi security</li>              <li>Access controls and user permission practices</li>              <li>System backup methods and schedules</li>              <li>Personnel security practices</li>            </ul>          </section>          <section class="assessment-side-card">            <h3>Next steps after completion</h3>            <p>Review your report, prioritize actions, and then use the findings to inform your WISP Builder project.</p>          </section>        </aside>      </section>    </main>  `;
}
function humanizeDashboardStatus(value) {
  if (!value) return "Not started";
  return String(value)
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
function buildDashboardViewModel() {
  const dashboard = state.dashboardData || {};
  const completion = Number(dashboard.completion_percent) || 0;
  const focus = dashboard.focus_area || "Administrative Safeguards";
  const statusLabel = dashboard.status_label || "Not Started";
  const nextAudit =
    dashboard.next_audit_label || formatDashboardDate(new Date().toISOString());
  const completedSections =
    Number(dashboard.completed_sections_count ?? dashboard.section_count) || 0;
  const sectionTarget = Number(dashboard.section_count) || 12;
  const documentsCount =
    Number(dashboard.documents_count) || state.documentsFiles.length || 0;
  const trainingAssetsCount =
    Number(dashboard.training_assets_count) ||
    Object.values(state.trainingAssets || {}).reduce(
      (total, items) => total + items.length,
      0,
    );
  const riskStatus = humanizeDashboardStatus(
    dashboard.risk_assessment_status || "not_started",
  );
  const wispStatus = humanizeDashboardStatus(
    dashboard.wisp_project_status || "not_started",
  );
  const nextActionLabel =
    dashboard.next_action_label || "Start the risk assessment";
  const lastUpdated = formatDashboardDate(dashboard.updated_at);
  const ctaAction = "nav-builder";
  const ctaLabel =
    dashboard.wisp_project_status === "completed"
      ? "Review WISP workspace"
      : `Continue WISP Build (${completedSections}/${sectionTarget} sections)`;
  return {
    completion,
    focus,
    statusLabel,
    nextAudit,
    completedSections,
    sectionTarget,
    documentsCount,
    trainingAssetsCount,
    riskStatus,
    wispStatus,
    nextActionLabel,
    lastUpdated,
    ctaAction,
    ctaLabel,
  };
}
function homeScreen() {
  const view = buildDashboardViewModel();
  return `    <main class="dashboard-builder-screen">      <section class="dashboard-builder-header">        <div class="dashboard-builder-header-copy">          <h1>Dashboard</h1>          <p>Monitor and manage your firm's compliance readiness with live workspace data.</p>        </div>        <div class="dashboard-builder-header-actions">          <button class="dashboard-utility-button" type="button" aria-label="Search">            ${dashboardUtilityIcon("search")}          </button>          <button class="dashboard-utility-button dashboard-utility-button-alert" type="button" aria-label="Notifications">            ${dashboardUtilityIcon("bell")}            <span class="dashboard-utility-dot" aria-hidden="true"></span>          </button>          <button class="dashboard-profile-button" type="button" aria-label="Open profile">            <span class="dashboard-profile-avatar">KM</span>          </button>        </div>      </section>      <section class="dashboard-hero-card">        <div class="dashboard-hero-main">          <div class="dashboard-progress" style="--progress:${view.completion};">            <div class="dashboard-progress-inner">${view.completion}%</div>          </div>          <div class="dashboard-hero-copy">            <h2>${view.completion}% Complete - Focus: ${escapeHtml(view.focus)}</h2>            <p>${escapeHtml(view.statusLabel)} ? ${escapeHtml(view.nextActionLabel)}</p>          </div>        </div>        <div class="dashboard-hero-side">          <button class="btn primary dashboard-hero-cta" type="button" data-action="${view.ctaAction}">${escapeHtml(view.ctaLabel)}</button>          <div class="dashboard-hero-meta">            <div class="dashboard-hero-meta-item">              <span>Last updated</span>              <strong>${escapeHtml(view.lastUpdated)}</strong>            </div>            <div class="dashboard-hero-meta-item">              <span>Next audit target</span>              <strong>${escapeHtml(view.nextAudit)}</strong>            </div>            <div class="dashboard-hero-meta-item">              <span>Risk assessment</span>              <strong>${escapeHtml(view.riskStatus)}</strong>            </div>          </div>        </div>      </section>      <section class="dashboard-builder-section">        <h2>Next Steps</h2>        <div class="dashboard-step-grid">          <article class="dashboard-step-card">            <div class="dashboard-step-icon" aria-hidden="true">${dashboardStepIcon("complete")}</div>            <h3>WISP Builder</h3>            <p>${escapeHtml(`${view.completedSections} of ${view.sectionTarget} tracked sections currently show saved progress.`)}</p>            <button class="dashboard-step-link" type="button" data-action="nav-builder">Open Builder</button>          </article>          <article class="dashboard-step-card">            <div class="dashboard-step-icon" aria-hidden="true">${dashboardStepIcon("upload")}</div>            <h3>Documents</h3>            <p>${escapeHtml(`${view.documentsCount} documents are currently stored for this workspace.`)}</p>            <button class="dashboard-step-link" type="button" data-action="nav-documents">Manage Files</button>          </article>          <article class="dashboard-step-card">            <div class="dashboard-step-icon" aria-hidden="true">${dashboardStepIcon("training")}</div>            <h3>Training Library</h3>            <p>${escapeHtml(`${view.trainingAssetsCount} training assets are available to assign or review.`)}</p>            <button class="dashboard-step-link" type="button" data-action="nav-training">Open Training</button>          </article>        </div>      </section>      <section class="dashboard-updates">        <h2>Compliance Snapshot</h2>        <div class="dashboard-updates-grid">          <article class="dashboard-update">            <h3>Risk Assessment</h3>            <span class="dashboard-update-date">Current status</span>            <p>${escapeHtml(`Assessment is ${view.riskStatus.toLowerCase()} and contributing to the dashboard score.`)}</p>            <button class="dashboard-update-link" type="button" data-action="nav-assessment-start">Open Assessment</button>          </article>          <article class="dashboard-update">            <h3>WISP Project</h3>            <span class="dashboard-update-date">Builder progress</span>            <p>${escapeHtml(`WISP is ${view.wispStatus.toLowerCase()} with ${view.completedSections}/${view.sectionTarget} tracked sections completed.`)}</p>            <button class="dashboard-update-link" type="button" data-action="nav-builder">Open Builder</button>          </article>          <article class="dashboard-update">            <h3>Documentation Coverage</h3>            <span class="dashboard-update-date">Stored evidence</span>            <p>${escapeHtml(`${view.documentsCount} uploaded files and ${view.trainingAssetsCount} training assets are currently reflected in the workspace.`)}</p>            <button class="dashboard-update-link" type="button" data-action="nav-documents">Review Files</button>          </article>        </div>      </section>    </main>  `;
}
const terminatedChecklistItems = [
  {
    key: "computer_access_disabled",
    label: "Computer access login/password disabled",
    section: "Primary",
  },
  { label: "Physical access disabled", section: "Primary", type: "question" },
  { key: "keys", label: "Keys", section: "Primary", indent: true },
  {
    key: "entry_cards",
    label: "Entry cards",
    section: "Primary",
    indent: true,
  },
  {
    label: "Employee returned (check when received)",
    section: "Primary",
    type: "question",
  },
  { key: "returned_keys", label: "Key(s)", section: "Primary", indent: true },
  { key: "returned_id", label: "ID", section: "Primary", indent: true },
  {
    key: "returned_access_codes_badges",
    label: "Access codes & badges",
    section: "Primary",
    indent: true,
  },
  {
    key: "returned_business_cards",
    label: "Business cards (as appropriate)",
    section: "Primary",
    indent: true,
  },
  {
    key: "remote_access",
    label: "Remote electronic access (VPN etc.)",
    section: "Disable",
  },
  { key: "voicemail", label: "Voicemail access", section: "Disable" },
  { key: "email", label: "E-mail access", section: "Disable" },
  { key: "internet", label: "Internet access", section: "Disable" },
  {
    key: "tax_software",
    label: "Tax software download/update access",
    section: "Disable",
  },
];
function createTerminatedEmployeeChecklist() {
  return {
    id: null,
    employeeName: "",
    terminationDate: "",
    coordinatorName: "",
    status: "draft",
    completedAt: null,
    data: { checked: {}, notes: {} },
    updatedAt: new Date().toISOString(),
  };
}
function normalizeTerminatedEmployeeChecklist(record) {
  if (!record) return createTerminatedEmployeeChecklist();
  const sourceData = record.checklist_data || record.data || {};
  return {
    id: record.id || null,
    employeeName: record.employee_name ?? record.employeeName ?? "",
    terminationDate: record.termination_date ?? record.terminationDate ?? "",
    coordinatorName: record.coordinator_name ?? record.coordinatorName ?? "",
    status: record.status === "completed" ? "completed" : "draft",
    completedAt: record.completed_at ?? record.completedAt ?? null,
    exportedDocumentId:
      record.exported_document_id ?? record.exportedDocumentId ?? null,
    data: {
      checked: { ...(sourceData.checked || {}) },
      notes: { ...(sourceData.notes || {}) },
    },
    createdAt: record.created_at ?? record.createdAt ?? null,
    updatedAt:
      record.updated_at ?? record.updatedAt ?? new Date().toISOString(),
  };
}
function activeTerminatedEmployeeChecklist() {
  return state.terminatedEmployeeChecklistEditor
    ? normalizeTerminatedEmployeeChecklist(
        state.terminatedEmployeeChecklistEditor,
      )
    : null;
}
function checklistCompletionCount(checklist) {
  return terminatedChecklistItems.filter(
    (item) => item.key && checklist?.data?.checked?.[item.key],
  ).length;
}
function terminatedChecklistItemMarkup(item, checklist) {
  if (item.type === "question") {
    return `<div class="terminated-checklist-question">${escapeHtml(item.label)}</div>`;
  }
  const checked = Boolean(checklist.data.checked?.[item.key]);
  return `    <label class="terminated-checklist-item ${item.indent ? "is-indented" : ""}">      <input type="checkbox" data-terminated-check="${attr(item.key)}" ${checked ? "checked" : ""} />      <span>${escapeHtml(item.label)}</span>    </label>  `;
}
function terminatedEmployeeChecklistScreen() {
  const checklist = activeTerminatedEmployeeChecklist();
  if (!checklist) {
    return `<main class="documents-screen"><section class="documents-header"><div class="documents-header-copy"><h1>Checklist unavailable</h1></div><div class="documents-header-actions"><button class="btn secondary" type="button" data-action="back-to-documents">Back to documents</button></div></section></main>`;
  }
  const primaryItems = terminatedChecklistItems.filter(
    (item) => item.section === "Primary",
  );
  const disableItems = terminatedChecklistItems.filter(
    (item) => item.section === "Disable",
  );
  const completed = checklist.status === "completed";
  return `    <main class="documents-screen terminated-checklist-screen">      <section class="documents-header documents-editor-header">        <div class="documents-header-copy">          <p class="eyebrow">Employee offboarding</p>          <h1>Terminated Employee Checklist</h1>          <p>Document access removal, property return, and completion of the offboarding process.</p>        </div>        <div class="documents-header-actions document-editor-header-actions">          <button class="btn secondary" type="button" data-action="back-to-documents">Back to documents</button>          <button class="btn secondary" type="button" data-terminated-save ${state.terminatedEmployeeChecklistSaving ? "disabled" : ""}>${state.terminatedEmployeeChecklistSaving ? "Saving..." : "Save draft"}</button>          <button class="btn secondary" type="button" data-terminated-complete ${completed ? "disabled" : ""}>${completed ? "Completed" : "Mark complete"}</button>          <button class="btn primary" type="button" data-terminated-export>Export PDF</button>        </div>      </section>      <section class="terminated-checklist-sheet card pad">        <header class="terminated-checklist-title">          <div><p class="eyebrow">Firm record</p><h2>Sample Terminated Employee Checklist</h2></div>          <span class="terminated-checklist-status ${completed ? "is-complete" : ""}">${completed ? "Completed" : "Draft"}</span>        </header>        <p class="terminated-checklist-instruction">Use this document to create a firm-specific checklist to ensure that an employee's future access to PII is secured when they leave.</p>        <div class="terminated-checklist-fields">          <label class="field"><span class="label">Employee name</span><input class="input" type="text" value="${attr(checklist.employeeName)}" data-terminated-field="employeeName" placeholder="Employee name" /></label>          <label class="field"><span class="label">Date of termination</span><input class="input" type="date" value="${attr(checklist.terminationDate)}" data-terminated-field="terminationDate" /></label>          <label class="field"><span class="label">Signature of coordinator</span><input class="input" type="text" value="${attr(checklist.coordinatorName)}" data-terminated-field="coordinatorName" placeholder="Type coordinator name" /></label>        </div>        <p class="terminated-checklist-signature-note">Only sign upon completion of this checklist.</p>        <div class="terminated-checklist-progress"><strong>Checklist</strong><span data-terminated-progress-count>${checklistCompletionCount(checklist)} of ${terminatedChecklistItems.filter((item) => item.key).length} items completed</span></div>        <section class="terminated-checklist-group"><h3>Primary</h3>${primaryItems.map((item) => terminatedChecklistItemMarkup(item, checklist)).join("")}</section>        <section class="terminated-checklist-group"><h3>Disable</h3>${disableItems.map((item) => terminatedChecklistItemMarkup(item, checklist)).join("")}</section>        <aside class="terminated-checklist-reminder">If you have not already done so, create a list of all accounts and passwords and secure them in case a terminated employee is due to death or disability.</aside>      </section>    </main>  `;
}
function scheduleTerminatedEmployeeChecklistSave() {
  clearTimeout(terminatedChecklistSyncTimer);
  terminatedChecklistSyncTimer = setTimeout(
    () => saveActiveTerminatedEmployeeChecklist(),
    600,
  );
}
async function saveActiveTerminatedEmployeeChecklist(options = {}) {
  const checklist = activeTerminatedEmployeeChecklist();
  if (!checklist) return null;
  state.terminatedEmployeeChecklistSaving = true;
  if (options.render) render();
  try {
    const saved = await saveTerminatedEmployeeChecklist(checklist);
    if (saved) {
      const normalized = normalizeTerminatedEmployeeChecklist(saved);
      state.terminatedEmployeeChecklistEditor = normalized;
      const index = state.terminatedEmployeeChecklists.findIndex(
        (item) => item.id === normalized.id,
      );
      if (index >= 0) state.terminatedEmployeeChecklists[index] = normalized;
      else state.terminatedEmployeeChecklists.unshift(normalized);
    }
    return saved;
  } catch (error) {
    console.warn("Terminated employee checklist save skipped", error);
    return null;
  } finally {
    state.terminatedEmployeeChecklistSaving = false;
    if (options.render) render();
  }
}
function openTerminatedEmployeeChecklist(checklistId = null) {
  const existing = checklistId
    ? state.terminatedEmployeeChecklists.find((item) => item.id === checklistId)
    : null;
  state.terminatedEmployeeChecklistEditor =
    normalizeTerminatedEmployeeChecklist(
      existing || createTerminatedEmployeeChecklist(),
    );
  state.screen = "terminated-checklist";
  render();
}
async function completeTerminatedEmployeeChecklist() {
  const checklist = activeTerminatedEmployeeChecklist();
  if (!checklist) return;
  checklist.status = "completed";
  checklist.completedAt = new Date().toISOString();
  await saveActiveTerminatedEmployeeChecklist({ render: true });
}
async function exportActiveTerminatedEmployeeChecklistPdf() {
  const checklist = activeTerminatedEmployeeChecklist();
  if (!checklist) return;
  const saved = await saveActiveTerminatedEmployeeChecklist();
  const activeChecklist = normalizeTerminatedEmployeeChecklist(
    saved || checklist,
  );
  const blob = await buildTerminatedEmployeeChecklistPdf(activeChecklist);
  const safeName =
    (activeChecklist.employeeName || "employee")
      .trim()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase() || "employee";
  const exported = await exportTerminatedEmployeeChecklistPdf(activeChecklist, {
    blob,
    fileName: `terminated-employee-checklist-${safeName}.pdf`,
  });
  if (exported?.checklist) {
    const normalized = normalizeTerminatedEmployeeChecklist(exported.checklist);
    state.terminatedEmployeeChecklistEditor = normalized;
    const index = state.terminatedEmployeeChecklists.findIndex(
      (item) => item.id === normalized.id,
    );
    if (index >= 0) state.terminatedEmployeeChecklists[index] = normalized;
    if (exported.document) state.documentsFiles.unshift(exported.document);
  }
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `terminated-employee-checklist-${safeName}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
async function buildTerminatedEmployeeChecklistPdf(checklist) {
  const { PDFDocument, StandardFonts, rgb } = await import(
    "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"
  );
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const signatureFont = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const page = pdf.addPage([612, 792]);
  const navy = rgb(0.03, 0.22, 0.39);
  const dark = rgb(0.08, 0.12, 0.18);
  const muted = rgb(0.3, 0.36, 0.43);
  let y = 748;
  const draw = (text, x, size = 10, font = regular, color = dark) => {
    page.drawText(String(text || ""), { x, y, size, font, color });
  };
  const line = () => {
    y -= 17;
  };
  page.drawRectangle({ x: 0, y: 758, width: 612, height: 34, color: navy });
  page.drawText("TERMINATED EMPLOYEE CHECKLIST", {
    x: 48,
    y: 769,
    size: 16,
    font: bold,
    color: rgb(1, 1, 1),
  });
  y = 730;
  draw(
    "Use this record to confirm that an employee's access to firm PII has been secured.",
    48,
    9,
    regular,
    muted,
  );
  line();
  draw(
    `Employee name: ${checklist.employeeName || "____________________________"}`,
    48,
    11,
  );
  line();
  draw(
    `Date of termination: ${checklist.terminationDate || "____________________________"}`,
    48,
    11,
  );
  line();
  draw(
    `Signature of coordinator: ${checklist.coordinatorName || "____________________________"}`,
    48,
    11,
  );
  line();
  draw("Only sign upon completion of this checklist.", 48, 9, regular, muted);
  line();
  line();
  const groups = ["Primary", "Disable"];
  for (const group of groups) {
    draw(group, 48, 12, bold, navy);
    line();
    const items = terminatedChecklistItems.filter(
      (item) => item.section === group,
    );
    for (const item of items) {
      if (item.type === "question") {
        draw(item.label, 54, 10, bold, navy);
        line();
        continue;
      }
      const mark = checklist.data.checked?.[item.key] ? "X" : " ";
      draw(`[${mark}]`, item.indent ? 76 : 54, 10, bold);
      draw(item.label, item.indent ? 98 : 82, 10);
      line();
    }
    line();
  }
  draw(
    "Reminder: Secure a list of all accounts and passwords when applicable.",
    48,
    9,
    regular,
    muted,
  );
  return new Blob([await pdf.save()], { type: "application/pdf" });
}
function createRecordRetentionPolicy() {
  return {
    id: null,
    title: "Record Retention Policy",
    data: {
      retentionYears: "",
      opening:
        "Designated retained written and electronic records containing Personally Identifiable Information (PII) will be destroyed or deleted at the earliest opportunity consistent with business needs or legal retention requirements.",
      compliance:
        "It is Firm policy to retain no PII records longer than required by current regulations, practices, or standards.",
      paperRule:
        "Paper-based records shall be securely destroyed by cross-cut shredding or incineration at the end of their service life.",
      electronicRule:
        "Electronic records shall be securely destroyed by deleting and overwriting the file directory or by reformatting the drive where they were housed, or by destroying drive disks and rendering them inoperable at the end of their service life.",
      clientRule:
        "Upon termination of a client relationship, records shall only be kept to the degree they are required to be kept by Federal or State mandate.",
    },
  };
}
function normalizeRecordRetentionPolicy(record) {
  return record
    ? {
        id: record.id || null,
        title: record.title || "Record Retention Policy",
        data: {
          ...createRecordRetentionPolicy().data,
          ...(record.policy_data || record.data || {}),
        },
      }
    : createRecordRetentionPolicy();
}
function recordRetentionPolicyScreen() {
  const instance = activeSpecialDocumentInstance();
  const policy = instance
    ? { data: instance.data }
    : createRecordRetentionPolicy();
  const data = policy.data;
  const corePolicy = `${data.opening}\n\n${data.compliance}`;
  return `<main class="documents-screen retention-policy-screen"><section class="documents-header documents-editor-header"><div class="documents-header-copy"><p class="eyebrow">WISP attachment</p><h1>Record Retention Policy</h1><p>Set your firm retention period, adjust the policy language, and export it as Attachment A for your WISP.</p></div><div class="documents-header-actions document-editor-header-actions"><button class="btn secondary" type="button" data-action="back-to-documents">Back to documents</button><button class="btn secondary" type="button" data-special-save>Save</button><button class="btn primary" type="button" data-retention-export>Export PDF</button></div></section><section class="retention-policy-sheet card pad"><div class="retention-policy-brand">${state.settingsLogo?.previewUrl ? `<img src="${attr(state.settingsLogo.previewUrl)}" alt="Firm logo" />` : ""}<div><p class="eyebrow">Attachment A</p><h2>Record Retention Policy</h2><p>${escapeHtml(state.firmProfile?.name || state.form.companyName || "Your firm")}</p></div></div><aside class="retention-policy-note"><strong>Built for your WISP.</strong> Most Written Information Security Plans use this as an attachment. Your firm name and logo are added automatically; adjust only the policy language below to fit your business.</aside><section class="retention-policy-composer"><div class="retention-policy-composer-head"><h3>Policy introduction</h3><p>Use this opening language as a base for your firm.</p></div>${retentionComposerField("core", "Core retention commitment", "The general policy statement that appears before the rules.", corePolicy, 5)}<div class="retention-policy-composer-head retention-rules-head"><h3>Retention rules</h3><p>These appear as numbered points in your final policy.</p></div><section class="retention-rule-card retention-rule-maximum"><strong>1. Maximum retention period</strong><p class="retention-fill-sentence"><span>In no case shall paper or electronic retained records containing PII be kept longer than</span><span class="retention-fill-control"><input class="retention-year-blank" type="number" min="1" value="${attr(data.retentionYears)}" aria-label="Maximum retention years" placeholder="___" data-retention-field="retentionYears" /><span>years.</span></span></p></section>${retentionRuleField(2, "Paper records", "How paper files are destroyed at the end of their service life.", "paperRule", data.paperRule, 3)}${retentionRuleField(3, "Electronic records", "How electronic records and storage media are securely destroyed.", "electronicRule", data.electronicRule, 4)}${retentionRuleField(4, "After a client relationship ends", "How long client records remain available after termination.", "clientRule", data.clientRule, 3)}</section></section></main>`;
}
function retentionComposerField(key, label, help, value, rows) {
  return `<label class="retention-composer-field"><span>${escapeHtml(label)}</span><small>${escapeHtml(help)}</small><textarea class="input" rows="${rows}" data-retention-field="${attr(key)}">${escapeHtml(value)}</textarea></label>`;
}
function retentionRuleField(number, label, help, key, value, rows) {
  return `<label class="retention-rule-card retention-composer-field"><span>${number}. ${escapeHtml(label)}</span><small>${escapeHtml(help)}</small><textarea class="input" rows="${rows}" data-retention-field="${attr(key)}">${escapeHtml(value)}</textarea></label>`;
}
function openRecordRetentionPolicy() {
  openSpecialDocumentInstance("record-retention-policy");
}
function openDisasterRecoveryPlan() {
  openSpecialDocumentInstance("disaster-recovery-plan");
}
function openIncidentReport() {
  openSpecialDocumentInstance("incident-report");
}
function openDataBreachResponseGuideline() {
  openSpecialDocumentInstance("data-breach-response-guideline");
}
function openDataBreachNotificationLetter() {
  openSpecialDocumentInstance("data-breach-notification-letter");
}
const specialDocMeta = {
  "record-retention-policy": {
    create: createRecordRetentionPolicy,
    normalize: normalizeRecordRetentionPolicy,
    screen: "record-retention-policy",
    title: "Record Retention Policy",
  },
  "disaster-recovery-plan": {
    create: createDisasterRecoveryPlan,
    normalize: normalizeDisasterRecoveryPlan,
    screen: "disaster-recovery-plan",
    title: "WISP Disaster Recovery Plan",
  },
  "incident-report": {
    create: createIncidentReport,
    normalize: normalizeIncidentReport,
    screen: "incident-report",
    title: "Potential Data Breach Incident Report",
  },
  "data-breach-response-guideline": {
    create: createDataBreachResponseGuideline,
    normalize: normalizeDataBreachResponseGuideline,
    screen: "data-breach-response-guideline",
    title: "Data Breach Response Guideline",
  },
  "data-breach-notification-letter": {
    create: createDataBreachNotificationLetter,
    normalize: normalizeDataBreachNotificationLetter,
    screen: "data-breach-notification-letter",
    title: "Sample Data Breach Letter",
  },
};
function createSpecialDocumentInstance(docType) {
  const meta = specialDocMeta[docType];
  if (!meta) return null;
  const instance = meta.create();
  const instanceId = `sdi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const record = {
    instanceId,
    docType,
    title: meta.title,
    data: instance.data,
    dbId: instance.id || null,
    updatedAt: new Date().toISOString(),
  };
  state.specialDocumentInstances[instanceId] = record;
  return record;
}
function openSpecialDocumentInstance(docType, instanceId) {
  const meta = specialDocMeta[docType];
  if (!meta) return;
  let record;
  if (instanceId && state.specialDocumentInstances[instanceId]) {
    record = state.specialDocumentInstances[instanceId];
  } else {
    record = createSpecialDocumentInstance(docType);
  }
  if (!record) return;
  state.specialDocumentEditor = record.instanceId;
  meta.normalize(record);
  setState({ screen: meta.screen, documentEditor: null });
}
function openSpecialDocumentFromWorkspace(instanceId) {
  const record = state.specialDocumentInstances[instanceId];
  if (!record) return;
  openSpecialDocumentInstance(record.docType, instanceId);
}
function activeSpecialDocumentInstance() {
  const instanceId = state.specialDocumentEditor;
  return instanceId ? state.specialDocumentInstances[instanceId] || null : null;
}
function normalizeSpecialDocumentInstances(instances) {
  if (!instances || typeof instances !== "object") return {};
  const result = {};
  for (const [id, record] of Object.entries(instances)) {
    if (!id || !record || !record.docType) continue;
    const meta = specialDocMeta[record.docType];
    if (!meta) continue;
    result[id] = {
      instanceId: id,
      docType: record.docType,
      title: String(record.title || meta.title),
      data: record.data || {},
      dbId: record.dbId || null,
      updatedAt: record.updatedAt || new Date().toISOString(),
    };
  }
  return result;
}
function removeSpecialDocumentInstance(instanceId) {
  if (!instanceId) return;
  const record = state.specialDocumentInstances[instanceId];
  const title = record ? specialDocumentInstanceTitle(record) : "Document";
  delete state.specialDocumentInstances[instanceId];
  if (state.specialDocumentEditor === instanceId)
    state.specialDocumentEditor = null;
  scheduleSpecialDocumentInstancesSync();
  showToast(`${title} removed`, "info");
  render();
}
function scheduleSpecialDocumentInstancesSync() {
  persistLocalSpecialDocuments();
  const snapshot = JSON.parse(
    JSON.stringify(state.specialDocumentInstances || {}),
  );
  specialDocumentSaveQueue = specialDocumentSaveQueue
    .catch(() => undefined)
    .then(() => saveSpecialDocumentInstances(snapshot))
    .then((saved) => {
      if (saved && Object.keys(saved).length) {
        console.log("[specialDocSync] saved, ids:", Object.keys(saved));
        state.specialDocumentInstances = {
          ...state.specialDocumentInstances,
          ...normalizeSpecialDocumentInstances(saved),
        };
        persistLocalSpecialDocuments();
      }
    })
    .catch((error) => console.warn("[specialDocSync] error:", error));
  return specialDocumentSaveQueue;
}
async function saveActiveSpecialDocumentInstance() {
  const record = activeSpecialDocumentInstance();
  if (!record) return null;
  const meta = specialDocMeta[record.docType];
  if (!meta) return null;
  record.updatedAt = new Date().toISOString();
  persistLocalSpecialDocuments();
  showToast("Saving...", "info");
  try {
    await scheduleSpecialDocumentInstancesSync();
    showToast(`${specialDocumentInstanceTitle(record)} saved`, "success");
  } catch (error) {
    showToast("Save failed", "error");
  }
  return record;
}
function specialDocumentInstanceTitle(record) {
  if (!record) return "Untitled";
  const meta = specialDocMeta[record.docType];
  const data = record.data || {};
  if (record.docType === "incident-report" && data.reporterName)
    return `Incident Report: ${data.reporterName}`;
  if (record.docType === "record-retention-policy" && data.retentionYears)
    return `Record Retention Policy (${data.retentionYears} years)`;
  return meta ? meta.title : "Untitled";
}
function specialDocumentInstanceSummary(record) {
  if (!record) return "";
  const date = record.updatedAt
    ? formatDashboardDate(record.updatedAt)
    : "Draft";
  return `Saved ${date}`;
}
function scheduleRecordRetentionPolicySave() {
  persistLocalSpecialDocuments();
  specialDocumentSaveQueue = specialDocumentSaveQueue
    .catch(() => undefined)
    .then(() => saveActiveRecordRetentionPolicy())
    .catch((error) => console.warn("Special document sync skipped", error));
  return specialDocumentSaveQueue;
}
async function saveActiveRecordRetentionPolicy() {
  const policy = normalizeRecordRetentionPolicy(state.recordRetentionPolicy);
  state.recordRetentionPolicy = policy;
  try {
    const saved = await saveRecordRetentionPolicy(policy);
    if (saved)
      state.recordRetentionPolicy = normalizeRecordRetentionPolicy(saved);
    return saved;
  } catch (error) {
    console.warn("Record retention policy save skipped", error);
    return null;
  }
}
async function exportActiveRecordRetentionPolicyPdf() {
  const saved = await saveActiveRecordRetentionPolicy();
  const policy = normalizeRecordRetentionPolicy(
    saved || state.recordRetentionPolicy,
  );
  const { PDFDocument, StandardFonts, rgb } = await import(
    "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"
  );
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.03, 0.22, 0.39);
  const dark = rgb(0.08, 0.12, 0.18);
  page.drawRectangle({ x: 0, y: 758, width: 612, height: 34, color: navy });
  page.drawText("RECORD RETENTION POLICY", {
    x: 48,
    y: 769,
    size: 16,
    font: bold,
    color: rgb(1, 1, 1),
  });
  let y = 724;
  const firm = state.firmProfile?.name || state.form.companyName || "Your firm";
  page.drawText(firm, { x: 48, y, size: 12, font: bold, color: navy });
  y -= 30;
  const clauses = [
    policy.data.opening,
    policy.data.compliance,
    `In no case shall paper or electronic retained records containing PII be kept longer than ${policy.data.retentionYears || "_____"} years.`,
    policy.data.paperRule,
    policy.data.electronicRule,
    policy.data.clientRule,
  ];
  for (const [index, clause] of clauses.entries()) {
    const words = String(clause || "").split(/\s+/);
    let row = "";
    for (const word of words) {
      const next = `${row} ${word}`.trim();
      if (regular.widthOfTextAtSize(next, 10) > 500) {
        page.drawText(row, {
          x: index > 1 ? 66 : 48,
          y,
          size: 10,
          font: regular,
          color: dark,
        });
        y -= 15;
        row = word;
      } else row = next;
    }
    if (index > 1)
      page.drawText(`${index - 1}.`, {
        x: 48,
        y,
        size: 10,
        font: bold,
        color: navy,
      });
    if (row)
      page.drawText(row, {
        x: index > 1 ? 66 : 48,
        y,
        size: 10,
        font: regular,
        color: dark,
      });
    y -= 24;
  }
  const blob = new Blob([await pdf.save()], { type: "application/pdf" });
  const result = await exportRecordRetentionPolicyPdf(policy, {
    blob,
    fileName: "record-retention-policy.pdf",
  });
  if (result?.policy)
    state.recordRetentionPolicy = normalizeRecordRetentionPolicy(result.policy);
  if (result?.document) state.documentsFiles.unshift(result.document);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "record-retention-policy.pdf";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
const disasterRecoverySections = [
  [
    "threats",
    "1. Threats and disasters",
    "Identify and prioritize likely events, including flood, fire, theft, cyberattack, hack, or data breach.",
  ],
  [
    "systems",
    "2. Critical systems and operations",
    "List the business operations, systems, and physical spaces that must be restored first.",
  ],
  [
    "backups",
    "3. Backup processes",
    "Describe where backups are kept, how often they run, and who confirms they are usable.",
  ],
  [
    "recovery",
    "4. Recovery process",
    "Explain the recovery criteria and steps for each critical system or operation.",
  ],
  [
    "team",
    "5. Recovery team and ownership",
    "Name the Disaster Recovery Specialist and the accountable person for each system.",
  ],
  [
    "testing",
    "6. Testing and review",
    "Schedule regular tests and define how the plan is reviewed after changes or incidents.",
  ],
  [
    "keys",
    "7. Key contacts, systems, and access",
    "Maintain essential contacts, systems, access points/passwords, insurance details, and legal contacts.",
  ],
];
function createDisasterRecoveryPlan() {
  return {
    id: null,
    title: "WISP Disaster Recovery Plan",
    data: { planText: "" },
  };
}
function normalizeDisasterRecoveryPlan(record) {
  return record
    ? {
        id: record.id || null,
        title: record.title || "WISP Disaster Recovery Plan",
        data: {
          ...createDisasterRecoveryPlan().data,
          ...(record.plan_data || record.data || {}),
        },
      }
    : createDisasterRecoveryPlan();
}
function disasterRecoveryPlanScreen() {
  const plan = activeSpecialDocumentInstance()
    ? { data: activeSpecialDocumentInstance().data }
    : createDisasterRecoveryPlan();
  const prompts = [
    "Identify and prioritize likely disasters and threats, including flood, fire, theft, hack, or data breach.",
    "List critical business operations, systems, backup processes, and the physical workspace that must be restored.",
    "Describe recovery steps, recovery criteria, and accountable owners for each critical operation.",
    "Name your Disaster Recovery Specialist and define regular plan testing.",
    "Maintain key contacts, systems, access points/passwords, insurance details, and legal contacts.",
  ];
  return `<main class="documents-screen retention-policy-screen"><section class="documents-header documents-editor-header"><div class="documents-header-copy"><p class="eyebrow">WISP attachment</p><h1>Disaster Recovery Plan</h1><p>Write a recovery plan that fits your firm, then export it as a WISP attachment.</p></div><div class="documents-header-actions document-editor-header-actions"><button class="btn secondary" type="button" data-action="back-to-documents">Back to documents</button><button class="btn secondary" type="button" data-special-save>Save</button><button class="btn primary" type="button" data-disaster-export>Export PDF</button></div></section><section class="retention-policy-sheet card pad"><div class="retention-policy-brand"><div><p class="eyebrow">WISP Disaster Recovery Plan</p><h2>${escapeHtml(state.firmProfile?.name || state.form.companyName || "Your firm")}</h2></div></div><aside class="retention-policy-note"><strong>Make this plan your own.</strong> These prompts are optional guidance only; they are not included in your exported plan.</aside><section class="disaster-plan-prompts"><h3>Helpful planning prompts</h3><ul>${prompts.map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join("")}</ul></section><section class="retention-composer-field disaster-plan-editor"><span>Your disaster recovery plan</span><small>Write the plan in the language and structure that work for your firm. Use the prompts above if helpful.</small><div class="builder-editor-surface"><div class="builder-editor-toolbar"></div><div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich disaster-plan-rich-editor" contenteditable="true" spellcheck="true" data-builder-editor="disaster-recovery-plan" data-placeholder="Start writing your firm's disaster recovery plan here...">${plan.data.planText || ""}</div></div></section></section></main>`;
}
function scheduleDisasterRecoveryPlanSave() {
  persistLocalSpecialDocuments();
  specialDocumentSaveQueue = specialDocumentSaveQueue
    .catch(() => undefined)
    .then(() => saveActiveDisasterRecoveryPlan())
    .catch((error) => console.warn("Special document sync skipped", error));
  return specialDocumentSaveQueue;
}
async function saveActiveDisasterRecoveryPlan() {
  const plan = normalizeDisasterRecoveryPlan(state.disasterRecoveryPlan);
  state.disasterRecoveryPlan = plan;
  try {
    const saved = await saveDisasterRecoveryPlan(plan);
    if (saved)
      state.disasterRecoveryPlan = normalizeDisasterRecoveryPlan(saved);
    return saved;
  } catch (error) {
    console.warn("Disaster recovery plan save skipped", error);
    return null;
  }
}
async function exportActiveDisasterRecoveryPlanPdf() {
  const saved = await saveActiveDisasterRecoveryPlan();
  const plan = normalizeDisasterRecoveryPlan(
    saved || state.disasterRecoveryPlan,
  );
  const { PDFDocument, StandardFonts, rgb } = await import(
    "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"
  );
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  page.drawRectangle({
    x: 0,
    y: 758,
    width: 612,
    height: 34,
    color: rgb(0.03, 0.22, 0.39),
  });
  page.drawText("WISP DISASTER RECOVERY PLAN", {
    x: 48,
    y: 769,
    size: 16,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText(
    state.firmProfile?.name || state.form.companyName || "Your firm",
    { x: 48, y: 724, size: 12, font: bold, color: rgb(0.03, 0.22, 0.39) },
  );
  const planText =
    htmlToPlainText(plan.data.planText || "") ||
    "No plan content has been entered yet.";
  const lines = wrapPdfText(planText, regular, 10, 516);
  let cursorY = 690;
  lines.forEach((line) => {
    if (cursorY < 52) return;
    page.drawText(line, {
      x: 48,
      y: cursorY,
      size: 10,
      font: regular,
      color: rgb(0.05, 0.12, 0.21),
    });
    cursorY -= 14;
  });
  const blob = new Blob([await pdf.save()], { type: "application/pdf" });
  try {
    const result = await exportDisasterRecoveryPlanPdf(plan, {
      blob,
      fileName: "disaster-recovery-plan.pdf",
    });
    if (result?.plan)
      state.disasterRecoveryPlan = normalizeDisasterRecoveryPlan(result.plan);
    if (result?.document) state.documentsFiles.unshift(result.document);
  } catch (error) {
    console.warn(
      "Disaster recovery PDF storage failed; downloading the generated PDF.",
      error,
    );
  }
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "disaster-recovery-plan.pdf";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
function htmlToPlainText(html) {
  const container = document.createElement("div");
  container.innerHTML = String(html || "");
  return (container.innerText || container.textContent || "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
function wrapPdfText(text, font, size, maxWidth) {
  const lines = [];
  String(text || "")
    .split(/\r?\n/)
    .forEach((paragraph) => {
      const words = paragraph.trim().split(/\s+/).filter(Boolean);
      if (!words.length) {
        lines.push("");
        return;
      }
      let line = "";
      words.forEach((word) => {
        const candidate = line ? `${line} ${word}` : word;
        if (line && font.widthOfTextAtSize(candidate, size) > maxWidth) {
          lines.push(line);
          line = word;
        } else line = candidate;
      });
      if (line) lines.push(line);
    });
  return lines;
}
function createDataBreachNotificationLetter() {
  return {
    id: null,
    data: {
      body: "<p>Date: [date]</p><p>Subject: Notice of Data Security Incident</p><p>Dear [customer name],</p><p>We are writing to inform you about a recent data security incident experienced by [firm name and location] that may have affected your personal and protected information. Please read this letter carefully for information regarding the incident and steps you can take to help protect your information.</p><h2>What Happened?</h2><p>[Describe the incident, discovery date, unauthorized access date or range, investigation, and final determination date.]</p><h2>What Information Was Involved?</h2><p>The information potentially impacted included your [specific PII involved].</p><h2>What Are We Doing?</h2><p>[Describe containment, investigation, security improvements, and any monitoring or support being offered.]</p><h2>What You Can Do</h2><p>Review account statements and credit reports, report suspicious activity promptly, and consider fraud alerts or security freezes where appropriate.</p><h2>For More Information</h2><p>Questions may be directed to [phone number and available hours].</p><p>Sincerely,</p><p>[firm name]<br>[address]<br>[city, state, zip]</p><hr><h2>Steps You Can Take To Help Protect Your Information</h2><p>Review account statements and notify law enforcement of suspicious activity. A free annual credit report may be requested through AnnualCreditReport.com or 1-877-322-8228. Consult the FTC at consumer.ftc.gov or 1-877-438-4338 for identity-theft resources.</p><h2>State-Specific Notices</h2><p>[Add only the state Attorney General notices, consumer rights, and recipient-count disclosures applicable to this incident.]</p>",
    },
  };
}
function normalizeDataBreachNotificationLetter(record) {
  return record
    ? {
        id: record.id || null,
        data: {
          ...createDataBreachNotificationLetter().data,
          ...(record.letter_data || record.data || {}),
        },
      }
    : createDataBreachNotificationLetter();
}
function dataBreachNotificationLetterScreen() {
  const inst = activeSpecialDocumentInstance();
  const letter = inst
    ? { data: inst.data }
    : createDataBreachNotificationLetter();
  return `<main class="documents-screen retention-policy-screen"><section class="documents-header documents-editor-header"><div class="documents-header-copy"><p class="eyebrow">Customer notification template</p><h1>Sample Data Breach Letter</h1><p>Customize every bracketed item for the recipient, incident, affected PII, firm contact details, and applicable state notices before sending.</p></div><div class="documents-header-actions document-editor-header-actions"><button class="btn secondary" type="button" data-action="back-to-documents">Back to documents</button><button class="btn secondary" type="button" data-special-save>Save</button><button class="btn primary" type="button" data-breach-letter-export>Export PDF</button></div></section><section class="retention-policy-sheet card pad"><aside class="retention-policy-note"><strong>Important:</strong> This is a customizable starting template, not legal advice. Review notification requirements, state-specific language, and final recipient details with qualified counsel before distribution.</aside><section class="retention-composer-field disaster-plan-editor"><span>Notification letter</span><small>Replace each bracketed item and edit the protective-steps and state-specific sections to fit the incident.</small><div class="builder-editor-surface"><div class="builder-editor-toolbar"></div><div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich disaster-plan-rich-editor" contenteditable="true" spellcheck="true" data-builder-editor="data-breach-notification-letter">${letter.data.body || ""}</div></div></section></section></main>`;
}
function scheduleDataBreachNotificationLetterSave() {
  persistLocalSpecialDocuments();
  specialDocumentSaveQueue = specialDocumentSaveQueue
    .catch(() => undefined)
    .then(() => saveActiveDataBreachNotificationLetter())
    .catch((error) => console.warn("Special document sync skipped", error));
  return specialDocumentSaveQueue;
}
async function saveActiveDataBreachNotificationLetter() {
  const letter = normalizeDataBreachNotificationLetter(
    state.dataBreachNotificationLetter,
  );
  state.dataBreachNotificationLetter = letter;
  try {
    const saved = await saveDataBreachNotificationLetter(letter);
    if (saved)
      state.dataBreachNotificationLetter =
        normalizeDataBreachNotificationLetter(saved);
    return saved;
  } catch (error) {
    console.warn("Data breach letter save skipped", error);
    return null;
  }
}
async function exportActiveDataBreachNotificationLetterPdf() {
  const saved = await saveActiveDataBreachNotificationLetter();
  const letter = normalizeDataBreachNotificationLetter(
    saved || state.dataBreachNotificationLetter,
  );
  const { PDFDocument, StandardFonts, rgb } = await import(
    "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"
  );
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage([612, 792]);
  page.drawRectangle({
    x: 0,
    y: 758,
    width: 612,
    height: 34,
    color: rgb(0.03, 0.22, 0.39),
  });
  page.drawText("SAMPLE DATA BREACH NOTIFICATION LETTER", {
    x: 36,
    y: 769,
    size: 14,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText(
    state.firmProfile?.name || state.form.companyName || "Your firm",
    { x: 48, y: 724, size: 12, font: bold, color: rgb(0.03, 0.22, 0.39) },
  );
  let y = 690;
  const body =
    htmlToPlainText(letter.data.body) ||
    "No letter content has been entered yet.";
  wrapPdfText(body, regular, 10, 516).forEach((line) => {
    if (y < 52) return;
    page.drawText(line, {
      x: 48,
      y,
      size: 10,
      font: regular,
      color: rgb(0.05, 0.12, 0.21),
    });
    y -= 14;
  });
  const blob = new Blob([await pdf.save()], { type: "application/pdf" });
  try {
    const result = await exportDataBreachNotificationLetterPdf(letter, {
      blob,
      fileName: "data-breach-notification-letter.pdf",
    });
    if (result?.letter)
      state.dataBreachNotificationLetter =
        normalizeDataBreachNotificationLetter(result.letter);
    if (result?.document) state.documentsFiles.unshift(result.document);
  } catch (error) {
    console.warn(
      "Data breach notification letter PDF storage failed; downloading generated PDF.",
      error,
    );
  }
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data-breach-notification-letter.pdf";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
function createDataBreachResponseGuideline() {
  return {
    id: null,
    title: "Data Breach Response Guideline",
    data: { guidelineText: "" },
  };
}
function normalizeDataBreachResponseGuideline(record) {
  return record
    ? {
        id: record.id || null,
        title: record.title || "Data Breach Response Guideline",
        data: {
          ...createDataBreachResponseGuideline().data,
          ...(record.guideline_data || record.data || {}),
        },
      }
    : createDataBreachResponseGuideline();
}
function dataBreachResponseGuidelineScreen() {
  const inst2 = activeSpecialDocumentInstance();
  const guideline = inst2
    ? { data: inst2.data }
    : createDataBreachResponseGuideline();
  const prompts = [
    "Explain what employees should do immediately to secure a physical location, workstation, device, or exposed information.",
    "Tell staff when to stop work, disconnect equipment, or change passwords and access codes without destroying evidence.",
    "Name the response team roles and include reliable phone numbers or escalation paths.",
    "Require staff to complete your Incident Report after the immediate safeguards are in place.",
    "Link to the FTC Data Breach Response Guide and any firm-specific emergency contacts or vendor procedures.",
  ];
  return `<main class="documents-screen retention-policy-screen"><section class="documents-header documents-editor-header"><div class="documents-header-copy"><p class="eyebrow">Employee response guide</p><h1>Data Breach Response Guideline</h1><p>Create practical directions employees and contractors can follow when they discover a potential PII breach or hack.</p></div><div class="documents-header-actions document-editor-header-actions"><button class="btn secondary" type="button" data-action="back-to-documents">Back to documents</button><button class="btn secondary" type="button" data-special-save>Save</button><button class="btn primary" type="button" data-breach-guideline-export>Export PDF</button></div></section><section class="retention-policy-sheet card pad"><div class="retention-policy-brand"><div><p class="eyebrow">Data breach response guideline</p><h2>${escapeHtml(state.firmProfile?.name || state.form.companyName || "Your firm")}</h2></div></div><aside class="retention-policy-note"><strong>Make this your firm's "in case of breach" guide.</strong> The prompts below are optional and will not appear in the final PDF. Add your own response team contacts, escalation instructions, and approved procedures before distributing it.</aside><section class="disaster-plan-prompts"><h3>Helpful planning prompts</h3><ul>${prompts.map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join("")}</ul></section><section class="retention-composer-field disaster-plan-editor"><span>Your data breach response guideline</span><small>Use headings and lists to create clear, easy-to-follow instructions for your staff and contractors.</small><div class="builder-editor-surface"><div class="builder-editor-toolbar"></div><div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich disaster-plan-rich-editor" contenteditable="true" spellcheck="true" data-builder-editor="data-breach-response-guideline" data-placeholder="Start writing your firm's data breach response guideline here...">${guideline.data.guidelineText || ""}</div></div></section></section></main>`;
}
function scheduleDataBreachResponseGuidelineSave() {
  persistLocalSpecialDocuments();
  specialDocumentSaveQueue = specialDocumentSaveQueue
    .catch(() => undefined)
    .then(() => saveActiveDataBreachResponseGuideline())
    .catch((error) => console.warn("Special document sync skipped", error));
  return specialDocumentSaveQueue;
}
async function saveActiveDataBreachResponseGuideline() {
  const guideline = normalizeDataBreachResponseGuideline(
    state.dataBreachResponseGuideline,
  );
  state.dataBreachResponseGuideline = guideline;
  try {
    const saved = await saveDataBreachResponseGuideline(guideline);
    if (saved)
      state.dataBreachResponseGuideline =
        normalizeDataBreachResponseGuideline(saved);
    return saved;
  } catch (error) {
    console.warn("Data breach response guideline save skipped", error);
    return null;
  }
}
async function exportActiveDataBreachResponseGuidelinePdf() {
  const saved = await saveActiveDataBreachResponseGuideline();
  const guideline = normalizeDataBreachResponseGuideline(
    saved || state.dataBreachResponseGuideline,
  );
  const { PDFDocument, StandardFonts, rgb } = await import(
    "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"
  );
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage([612, 792]);
  page.drawRectangle({
    x: 0,
    y: 758,
    width: 612,
    height: 34,
    color: rgb(0.03, 0.22, 0.39),
  });
  page.drawText("DATA BREACH RESPONSE GUIDELINE", {
    x: 42,
    y: 769,
    size: 15,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText(
    state.firmProfile?.name || state.form.companyName || "Your firm",
    { x: 48, y: 724, size: 12, font: bold, color: rgb(0.03, 0.22, 0.39) },
  );
  let y = 690;
  wrapPdfText(
    htmlToPlainText(guideline.data.guidelineText) ||
      "No guideline content has been entered yet.",
    regular,
    10,
    516,
  ).forEach((line) => {
    if (y < 52) return;
    page.drawText(line, {
      x: 48,
      y,
      size: 10,
      font: regular,
      color: rgb(0.05, 0.12, 0.21),
    });
    y -= 14;
  });
  const blob = new Blob([await pdf.save()], { type: "application/pdf" });
  try {
    const result = await exportDataBreachResponseGuidelinePdf(guideline, {
      blob,
      fileName: "data-breach-response-guideline.pdf",
    });
    if (result?.guideline)
      state.dataBreachResponseGuideline = normalizeDataBreachResponseGuideline(
        result.guideline,
      );
    if (result?.document) state.documentsFiles.unshift(result.document);
  } catch (error) {
    console.warn(
      "Data breach guideline PDF storage failed; downloading generated PDF.",
      error,
    );
  }
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data-breach-response-guideline.pdf";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
function createIncidentReport() {
  return {
    id: null,
    data: {
      reporterName: "",
      reporterTitle: "",
      reporterEmail: "",
      reporterPhone: "",
      discoveryDate: "",
      notificationDate: "",
      eventBeganDate: "",
      eventSummary: "",
      piiTypes: "",
      affectedCount: "",
      dscAcknowledgement: "",
      dscDate: "",
      pioAcknowledgement: "",
      pioDate: "",
    },
  };
}
function normalizeIncidentReport(record) {
  return record
    ? {
        id: record.id || null,
        data: {
          ...createIncidentReport().data,
          ...(record.report_data || record.data || {}),
        },
      }
    : createIncidentReport();
}
function incidentReportScreen() {
  const inst = activeSpecialDocumentInstance();
  const data = inst ? inst.data : createIncidentReport().data;
  const input = (key, label, type = "text", placeholder = "") =>
    `<label class="retention-composer-field"><span>${label}</span><input class="input" type="${type}" value="${attr(data[key] || "")}" placeholder="${attr(placeholder)}" data-incident-field="${key}" /></label>`;
  const richArea = (key, editorId, label, help) =>
    `<section class="retention-composer-field incident-rich-field"><span>${label}</span><small>${help}</small><div class="builder-editor-surface"><div class="builder-editor-toolbar"></div><div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich incident-rich-editor" contenteditable="true" spellcheck="true" data-builder-editor="${editorId}">${data[key] || ""}</div></div></section>`;
  return `<main class="documents-screen retention-policy-screen"><section class="documents-header documents-editor-header"><div class="documents-header-copy"><p class="eyebrow">Incident response record</p><h1>Potential Data Breach Notification</h1><p>Document a suspected exposure of Personally Identifiable Information (PII), the people notified, and the internal review.</p></div><div class="documents-header-actions document-editor-header-actions"><button class="btn secondary" type="button" data-action="back-to-documents">Back to documents</button><button class="btn secondary" type="button" data-special-save>Save</button><button class="btn primary" type="button" data-incident-export>Export PDF</button></div></section><section class="retention-policy-sheet incident-report-sheet card pad"><div class="retention-policy-brand"><div><p class="eyebrow">Potential data breach incident report</p><h2>${escapeHtml(state.firmProfile?.name || state.form.companyName || "Your firm")}</h2></div></div><aside class="retention-policy-note"><strong>Use this when PII may have been hacked, breached, stolen, or improperly exposed.</strong> Complete it as soon as an event is suspected and retain the finished report for audit support. This form is an internal record and does not replace legal or regulatory notification requirements.</aside><section class="incident-report-section"><h3>Reporter and timing</h3><p>Identify who documented the event and when the potential exposure was discovered.</p><div class="incident-report-grid">${input("reporterName", "Your name")}${input("reporterTitle", "Title")}${input("reporterEmail", "Email", "email")}${input("reporterPhone", "Phone", "tel")}${input("discoveryDate", "Date of discovery", "date")}${input("notificationDate", "Date of notification", "date")}${input("eventBeganDate", "Date you believe the event began", "date")}</div></section><section class="incident-report-section"><h3>Potential exposure</h3><p>Describe what happened, which PII may be involved, and the estimated reach of the incident.</p>${richArea("eventSummary", "incident-event-summary", "Summary of the event", "Include how the event was discovered, affected systems or records, and immediate containment actions.")}${richArea("piiTypes", "incident-pii-types", "Types of PII information exposed", "Be as specific as practical, such as SSNs, tax returns, bank details, or contact information.")}${input("affectedCount", "Estimated number of clients/customers affected", "number", "Example: 25")}</section><section class="incident-report-section"><h3>Internal acknowledgement</h3><p>Record acknowledgement by the Data Security Coordinator (DSC) and Public Information Officer (PIO) after their review.</p><div class="incident-report-grid incident-report-grid-ack">${input("dscAcknowledgement", "DSC acknowledgement", "text", "Name or initials")}${input("dscDate", "DSC acknowledgement date", "date")}${input("pioAcknowledgement", "PIO acknowledgement", "text", "Name or initials")}${input("pioDate", "PIO acknowledgement date", "date")}</div></section></section></main>`;
}
function scheduleIncidentReportSave() {
  persistLocalSpecialDocuments();
  specialDocumentSaveQueue = specialDocumentSaveQueue
    .catch(() => undefined)
    .then(() => saveActiveIncidentReport())
    .catch((error) => console.warn("Special document sync skipped", error));
  return specialDocumentSaveQueue;
}
async function saveActiveIncidentReport() {
  const report = normalizeIncidentReport(state.incidentReport);
  state.incidentReport = report;
  try {
    const saved = await saveIncidentReport(report);
    if (saved) state.incidentReport = normalizeIncidentReport(saved);
    return saved;
  } catch (error) {
    console.warn("Incident report save skipped", error);
    return null;
  }
}
async function exportActiveIncidentReportPdf() {
  const saved = await saveActiveIncidentReport();
  const report = normalizeIncidentReport(saved || state.incidentReport);
  const { PDFDocument, StandardFonts, rgb } = await import(
    "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"
  );
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page;
  let y;
  const next = () => {
    page = pdf.addPage([612, 792]);
    page.drawRectangle({
      x: 0,
      y: 758,
      width: 612,
      height: 34,
      color: rgb(0.03, 0.22, 0.39),
    });
    page.drawText("POTENTIAL DATA BREACH INCIDENT REPORT", {
      x: 42,
      y: 769,
      size: 14,
      font: bold,
      color: rgb(1, 1, 1),
    });
    y = 724;
  };
  const line = (text, heading = false) => {
    if (y < 54) next();
    page.drawText(text, {
      x: 44,
      y,
      size: heading ? 10.5 : 9.5,
      font: heading ? bold : regular,
      color: rgb(0.05, 0.12, 0.21),
    });
    y -= heading ? 18 : 14;
  };
  const field = (label, value) => line(`${label}: ${value || "Not provided"}`);
  const paragraph = (text) => {
    wrapPdfText(text || "Not provided", regular, 9.5, 520).forEach((entry) =>
      line(entry),
    );
    y -= 6;
  };
  next();
  line(state.firmProfile?.name || state.form.companyName || "Your firm", true);
  line("Reporter and timing", true);
  field("Your name", report.data.reporterName);
  field("Title", report.data.reporterTitle);
  field("Email", report.data.reporterEmail);
  field("Phone", report.data.reporterPhone);
  field("Date of discovery", report.data.discoveryDate);
  field("Date of notification", report.data.notificationDate);
  field("Event began", report.data.eventBeganDate);
  line("Summary of the event", true);
  paragraph(htmlToPlainText(report.data.eventSummary));
  line("Types of PII information exposed", true);
  paragraph(htmlToPlainText(report.data.piiTypes));
  field("Estimated clients/customers affected", report.data.affectedCount);
  line("Internal acknowledgement", true);
  field("DSC acknowledgement", report.data.dscAcknowledgement);
  field("DSC date", report.data.dscDate);
  field("PIO acknowledgement", report.data.pioAcknowledgement);
  field("PIO date", report.data.pioDate);
  const blob = new Blob([await pdf.save()], { type: "application/pdf" });
  try {
    const result = await exportIncidentReportPdf(report, {
      blob,
      fileName: "potential-data-breach-incident-report.pdf",
    });
    if (result?.report)
      state.incidentReport = normalizeIncidentReport(result.report);
    if (result?.document) state.documentsFiles.unshift(result.document);
  } catch (error) {
    console.warn(
      "Incident report PDF storage failed; downloading generated PDF.",
      error,
    );
  }
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "potential-data-breach-incident-report.pdf";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
function buildDocumentWorkspace(template) {
  return {
    templateId: template.id,
    title: template.title,
    description: template.description,
    columns: [...template.defaultColumns],
    rows: Array.from({ length: 12 }, () =>
      template.defaultColumns.map(() => ""),
    ),
    columnWidths: template.defaultColumns.map(() => 190),
    updatedAt: new Date().toISOString(),
  };
}
function normalizeDocumentWorkspace(workspace) {
  if (!workspace) return workspace;
  if (!Array.isArray(workspace.columns)) workspace.columns = [];
  if (!Array.isArray(workspace.rows)) workspace.rows = [];
  if (!Array.isArray(workspace.columnWidths)) {
    workspace.columnWidths = workspace.columns.map(() => 190);
  }
  while (workspace.columnWidths.length < workspace.columns.length) {
    workspace.columnWidths.push(190);
  }
  if (workspace.columnWidths.length > workspace.columns.length) {
    workspace.columnWidths = workspace.columnWidths.slice(
      0,
      workspace.columns.length,
    );
  }
  workspace.updatedAt = workspace.updatedAt || new Date().toISOString();
  return workspace;
}
function normalizeDocumentWorkspaceMap(workspaces) {
  return Object.fromEntries(
    Object.entries(workspaces || {})
      .map(([templateId, workspace]) => [
        templateId,
        normalizeDocumentWorkspace({
          ...workspace,
          templateId: workspace?.templateId || templateId,
        }),
      ])
      .filter(
        ([, workspace]) =>
          workspace &&
          Array.isArray(workspace.columns) &&
          Array.isArray(workspace.rows),
      ),
  );
}
function ensureDocumentWorkspace(templateId) {
  const template = getDocumentTemplateById(templateId);
  if (!template) return null;
  if (!state.documentWorkspaces[templateId]) {
    state.documentWorkspaces[templateId] = buildDocumentWorkspace(template);
    scheduleDocumentWorkspaceSync();
  }
  return normalizeDocumentWorkspace(state.documentWorkspaces[templateId]);
}
function documentWorkspaceSummary(workspace) {
  return `${workspace.rows.length} rows - ${workspace.columns.length} columns`;
}
function documentFileSummary(file) {
  const parts = [file?.sizeLabel || "Unknown size"];
  if (file?.type) parts.push(file.type);
  if (file?.createdAt) parts.push(formatDashboardDate(file.createdAt));
  return parts.join(" - ");
}
function openStoredDocument(record) {
  if (!record?.downloadUrl) return;
  window.open(record.downloadUrl, "_blank", "noopener,noreferrer");
}
function downloadStoredDocument(record) {
  if (!record?.downloadUrl) return;
  const link = document.createElement("a");
  link.href = record.downloadUrl;
  link.download = record.name || "document";
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
function openDocumentWorkspace(templateId) {
  const template = getDocumentTemplateById(templateId);
  if (template?.documentType === "disaster-recovery-plan") {
    openSpecialDocumentInstance("disaster-recovery-plan");
    return;
  }
  if (template?.documentType === "incident-report") {
    openSpecialDocumentInstance("incident-report");
    return;
  }
  if (template?.documentType === "data-breach-notification-letter") {
    openSpecialDocumentInstance("data-breach-notification-letter");
    return;
  }
  if (template?.documentType === "data-breach-response-guideline") {
    openSpecialDocumentInstance("data-breach-response-guideline");
    return;
  }
  if (template?.documentType === "record-retention-policy") {
    openSpecialDocumentInstance("record-retention-policy");
    return;
  }
  if (template?.documentType === "terminated-checklist") {
    openTerminatedEmployeeChecklist();
    return;
  }
  const workspace = ensureDocumentWorkspace(templateId);
  if (!workspace) return;
  setState({
    screen: "document-editor",
    documentEditor: { templateId, scrollColumnIndex: null },
  });
}
window.openDocumentWorkspace = openDocumentWorkspace;
function activeDocumentWorkspace() {
  const templateId = state.documentEditor?.templateId;
  return templateId
    ? normalizeDocumentWorkspace(state.documentWorkspaces[templateId] || null)
    : null;
}
function documentsScreen() {
  const workspaces = Object.values(state.documentWorkspaces);
  const terminatedChecklists = state.terminatedEmployeeChecklists || [];
  const specialInstances = Object.values(state.specialDocumentInstances || {});
  const specialDocuments = [
    ...(terminatedChecklists || []).map((checklist) => ({
      kind: "checklist",
      id: checklist.id,
      title: checklist.employeeName
        ? `Termination checklist: ${checklist.employeeName}`
        : "Termination checklist",
      summary: `${checklist.status === "completed" ? "Completed" : "Draft"} - ${checklist.terminationDate || "No termination date"}`,
    })),
    ...specialInstances.map((record) => ({
      kind: "special-instance",
      instanceId: record.instanceId,
      title: specialDocumentInstanceTitle(record),
      summary: specialDocumentInstanceSummary(record),
    })),
  ];
  const editableDocuments = [
    ...workspaces.map((workspace) => ({ kind: "workspace", ...workspace })),
    ...specialDocuments,
  ];
  const hasAnyDocuments = Boolean(
    editableDocuments.length || state.documentsFiles.length,
  );
  return `    <main class="documents-screen">      <section class="documents-header">        <div class="documents-header-copy">          <h1>Documents</h1>          <p>Open editable firm worksheets directly in the browser so staff can maintain operational records without switching to Excel or Word.</p>        </div>        ${dashboardHeaderControls(`<button class="btn primary documents-build-btn" type="button" data-action="nav-builder">Build My WISP</button>`)}      </section>      <section class="documents-layout">        <div class="documents-column documents-column-left">          <div class="documents-section-head">            <div class="documents-section-head-row">              <h2>My Documents</h2>              <button class="text-link documents-manage" type="button" data-action="open-doc-upload">Manage</button>            </div>          </div>          <div class="documents-column-stack">            <section class="documents-list-wrap documents-workspace-panel">              <div class="documents-list-head">                <strong>Your Workspace</strong>              </div>              <div class="documents-file-list">                ${editableDocuments.length ? editableDocuments.map((item) => `                  <div class="documents-file-row documents-file-row-workspace">                    <div class="documents-file-icon">${documentIconForItem(item)}</div>                    <div class="documents-file-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.kind === "workspace" ? documentWorkspaceSummary(item) : item.summary)}</span></div>                    <div class="documents-row-actions">${item.kind === "checklist" ? `<button class="btn secondary small" type="button" data-open-terminated-checklist="${attr(item.id)}">Open</button>` : item.kind === "special-instance" ? `<button class="btn secondary small" type="button" data-open-special-instance="${attr(item.instanceId)}">Open</button><button class="btn ghost small" type="button" data-remove-special-instance="${attr(item.instanceId)}">Remove</button>` : `<button class="btn secondary small" type="button" data-open-workspace="${attr(item.templateId)}">Open</button>`}${item.kind === "workspace" ? `<button class="btn ghost small" type="button" data-remove-workspace="${attr(item.templateId)}">Remove</button>` : ""}</div>                  </div>`).join("") : `<div class="documents-inline-upload documents-inline-upload-empty"><p>Your saved worksheets, policies, checklists, plans, reports, and letters will appear here.</p></div>`}              </div>            </section>            <section class="documents-list-wrap documents-upload-panel">              <div class="documents-list-head">                <strong>Uploaded Files</strong>                <button class="btn secondary small" type="button" data-action="open-doc-upload">Upload Document</button>              </div>              <input class="documents-upload-input" type="file" multiple data-documents-upload />              <div class="documents-file-list">                ${state.documentsFiles.length ? state.documentsFiles.map((file, index) => `                            <div class="documents-file-row">                              <div class="documents-file-icon">${documentLibraryIcon("uploaded")}</div>                              <div class="documents-file-copy">                                <strong>${escapeHtml(file.name)}</strong>                                <span>${escapeHtml(documentFileSummary(file))}</span>                              </div>                              <div class="documents-row-actions">                                ${file.downloadUrl ? `<button class="btn secondary small" type="button" data-open-document="${index}">Open</button>                                <button class="btn secondary small" type="button" data-download-document="${index}">Download</button>` : ``}                                <button class="btn ghost small" type="button" data-remove-document="${index}">Remove</button>                              </div>                            </div>                          `).join("") : `                      <div class="documents-inline-upload">                        <p>Add scanned policies, vendor docs, or supporting files whenever you need them.</p>                      </div>                    `}              </div>            </section>          </div>        </div>        <div class="documents-column documents-column-right">          <div class="documents-section-head documents-section-head-stack">            <h2>Editable Firm Templates</h2>            <p>Each template opens as an in-app worksheet with default fields, editable cells, and flexible row and column management.</p>          </div>          <div class="documents-template-list">            ${documentTemplates.map((template) => `                  <article class="documents-template-row" role="button" tabindex="0" data-open-template="${attr(template.id)}" onclick="window.openDocumentWorkspace(this.dataset.openTemplate); return false;">                    <div class="documents-template-icon">${documentIconForTemplate(template)}</div>                    <div class="documents-template-copy">                      <h3>${escapeHtml(template.title)}</h3>                      <p>${escapeHtml(template.description)}</p>                      <div class="documents-template-meta">                        <span>${escapeHtml(template.fileLabel)}</span>                        <span>${escapeHtml(template.updated)}</span>                      </div>                    </div>                    <button class="documents-open-btn" type="button" aria-label="Open ${attr(template.title)}" data-open-template="${attr(template.id)}" onclick="window.openDocumentWorkspace(this.dataset.openTemplate); return false;">                      View                    </button>                  </article>                `).join("")}          </div>        </div>      </section>    </main>  `;
}
function documentSpreadsheetColumnLabel(index) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let value = index + 1;
  let label = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = alphabet[remainder] + label;
    value = Math.floor((value - 1) / 26);
  }
  return label;
}
function documentEditorScreen() {
  const workspace = activeDocumentWorkspace();
  if (!workspace) {
    return `      <main class="documents-screen documents-editor-screen">        <section class="documents-header">          <div class="documents-header-copy">            <h1>Document Editor</h1>            <p>The requested worksheet could not be found.</p>          </div>          <div class="documents-header-actions document-editor-header-actions"><button class="btn secondary" type="button" data-action="back-to-documents">Back to documents</button></div>        </section>      </main>    `;
  }
  return `    <main class="documents-screen documents-editor-screen">      <section class="documents-header documents-editor-header">        <div class="documents-header-copy">          <p class="eyebrow">Editable firm worksheet</p>          <h1>${escapeHtml(workspace.title)}</h1>          <p>${escapeHtml(workspace.description)}</p>        </div>        <div class="documents-header-actions document-editor-header-actions">          <button class="btn secondary" type="button" data-action="back-to-documents">Back to documents</button>          <button class="btn primary" type="button" data-doc-add-row>Add row</button>          <button class="btn primary" type="button" data-doc-add-column>Add column</button>        </div>      </section>      <section class="document-editor-shell card pad">        <div class="document-editor-workspace">          <div class="document-editor-topbar">            <div class="document-editor-title-block">              <label class="field">                <span class="label">Document name</span>                <input class="input document-editor-name-input" type="text" value="${attr(workspace.title)}" data-doc-title />              </label>              <div class="document-editor-meta">${escapeHtml(documentWorkspaceSummary(workspace))} &middot; Click any header or cell to edit directly.</div>            </div>          </div>          <div class="document-editor-sheet-frame">            <div class="document-editor-table-wrap">              <table class="document-editor-table">                <colgroup>                  <col style="width: 58px;" />                  ${workspace.columns.map((_column, columnIndex) => `                        <col style="width: ${Number(workspace.columnWidths?.[columnIndex] || 190)}px;" />                      `).join("")}                  <col style="width: 116px;" />                </colgroup>                <thead>                  <tr class="document-editor-index-row">                    <th class="document-editor-corner-cell"></th>                    ${workspace.columns.map((_column, columnIndex) => `                          <th class="document-editor-index-cell" data-doc-index-cell="${columnIndex}">${documentSpreadsheetColumnLabel(columnIndex)}</th>                        `).join("")}                    <th class="document-editor-actions-index">ROW</th>                  </tr>                  <tr>                    <th class="document-editor-row-label-head">Fields</th>                    ${workspace.columns.map((column, columnIndex) => `                          <th>                            <div class="document-editor-col-head">                              <input class="document-editor-col-input" type="text" value="${attr(column)}" data-doc-column="${columnIndex}" />                              <button class="document-editor-col-remove" type="button" aria-label="Remove ${attr(column)} column" data-doc-remove-column="${columnIndex}">&times;</button>                              <div class="document-editor-col-resize" role="separator" aria-orientation="vertical" aria-label="Resize ${attr(column)} column" data-doc-resize-column="${columnIndex}"></div>                            </div>                          </th>                        `).join("")}                    <th class="document-editor-actions-head">Actions</th>                  </tr>                </thead>                <tbody>                  ${workspace.rows.map((row, rowIndex) => `                        <tr>                          <th class="document-editor-row-number">${rowIndex + 1}</th>                          ${workspace.columns.map((_column, columnIndex) => `                                <td>                                  <input class="document-editor-cell" type="text" value="${attr(row[columnIndex] || "")}" data-doc-cell="${rowIndex}:${columnIndex}" />                                </td>                              `).join("")}                          <td class="document-editor-row-actions">                            <button class="document-editor-remove-row" type="button" data-doc-remove-row="${rowIndex}">Remove</button>                          </td>                        </tr>                      `).join("")}                </tbody>              </table>            </div>          </div>        </div>      </section>    </main>  `;
}
function settingsScreen() {
  const settingsTabs = [
    { id: "profile", label: "My Profile" },
    { id: "company", label: "Company Info" },
    { id: "billing", label: "Subscription & Billing" },
    { id: "users", label: "User Management" },
    { id: "staff", label: "Staff" },
    { id: "logs", label: "Activity Logs" },
  ];
  const activeSettingsTab =
    state.settingsTab === "billing-card"
      ? settingsTabs.find((tab) => tab.id === "billing")
      : settingsTabs.find((tab) => tab.id === state.settingsTab) ||
        settingsTabs[0];
  return `    <main class="settings-screen">      <section class="settings-page-head">        <div class="settings-page-head-copy">          <h1>Settings</h1>          <p>Settings &gt; ${activeSettingsTab.label}</p>        </div>        ${dashboardHeaderControls()}      </section>      <nav class="settings-tabs" aria-label="Settings sections">        ${settingsTabs.map((tab) => `              <button class="settings-tab ${state.settingsTab === tab.id || (state.settingsTab === "billing-card" && tab.id === "billing") ? "is-active" : ""}" type="button" data-settings-tab="${tab.id}">${tab.label}</button>            `).join("")}      </nav>      ${renderSettingsTabPanel()}      ${state.settingsModal ? settingsModal() : ""}      ${state.showStaffDialog ? settingsStaffDialog() : ""}    </main>  `;
}
function settingsModal() {
  const modal = state.settingsModal;
  if (!modal) return "";
  const showCurrent =
    modal.currentValue && !modal.passwordFields && !modal.passwordChallenge;
  const inputType =
    modal.passwordFields || modal.passwordChallenge
      ? "password"
      : modal.type === "email"
        ? "email"
        : "text";
  const visuals = {
    email: {
      currentLabel: "Current email",
      description:
        "Update the address you use to sign in. We will verify the new address before replacing your current sign-in.",
      notice:
        "Your current email remains active until the new address is verified.",
      placeholder: "name@company.com",
    },
    password: {
      description:
        "Choose a strong, unique password for this workspace. Your password is updated immediately after confirmation.",
      notice:
        "Use at least 8 characters and avoid reusing passwords from other services.",
      placeholder: "Create a new password",
    },
    "mfa-password": {
      description:
        "Confirm your current password before changing the multi-factor authentication method for this account.",
      notice:
        "This additional check helps protect your workspace from unauthorized security changes.",
      placeholder: "Enter your current password",
    },
    "mfa-setup": {
      currentLabel: "Current method",
      description:
        "Choose the method you want to use for future sign-ins. An authenticator app is recommended.",
      notice:
        "You can update this method later from your profile security settings.",
      placeholder: "Authenticator app",
    },
    company: {
      description:
        "Keep these details current. They are used across your WISP, generated documents, and billing communications.",
      notice: "Changes are applied immediately to your company profile.",
      placeholder: "",
    },
  };
  const visual = visuals[modal.type] || visuals.email;
  const autocomplete = modal.passwordFields
    ? "new-password"
    : modal.passwordChallenge
      ? "current-password"
      : modal.type === "email"
        ? "email"
        : "off";
  const selectedMethod =
    modal.currentValue === "SMS text message"
      ? "SMS text message"
      : "Authenticator app";
  const company = modal.companyFields || {};
  return `    <div class="settings-modal-backdrop" data-action="close-settings-modal">      <section class="settings-modal settings-profile-dialog ${modal.type === "company" ? "settings-profile-dialog-company" : ""}" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title" onclick="event.stopPropagation()">        <header class="settings-profile-dialog-head">          <div>            <h2 id="settings-modal-title">${escapeHtml(modal.title)}</h2>            <p>${visual.description}</p>          </div>          <button class="settings-profile-dialog-close" type="button" data-action="close-settings-modal" aria-label="Close dialog">&times;</button>        </header>        <div class="settings-profile-dialog-body">          ${showCurrent ? `<div class="settings-profile-current"><span>${visual.currentLabel || "Current setting"}</span><strong>${escapeHtml(modal.currentValue)}</strong></div>` : ""}          ${modal.type === "mfa-setup" ? `<fieldset class="settings-profile-methods"><legend>Authentication method</legend><div><button class="settings-profile-method ${selectedMethod === "Authenticator app" ? "is-selected" : ""}" type="button" data-settings-mfa-method="Authenticator app"><strong>Authenticator app</strong><span>Recommended</span></button><button class="settings-profile-method ${selectedMethod === "SMS text message" ? "is-selected" : ""}" type="button" data-settings-mfa-method="SMS text message"><strong>Text message</strong><span>Use a mobile number</span></button></div></fieldset>` : ""}          ${modal.type === "company" ? `<div class="settings-profile-company-fields"><label class="field settings-profile-field settings-profile-field-full"><span class="label">Firm name</span><input class="input settings-profile-input" type="text" value="${attr(company.name || "")}" data-company-profile-field="name" autocomplete="organization" /></label><label class="field settings-profile-field settings-profile-field-full"><span class="label">Address</span><input class="input settings-profile-input" type="text" value="${attr(company.address || "")}" data-company-profile-field="address" autocomplete="street-address" /></label><label class="field settings-profile-field"><span class="label">City</span><input class="input settings-profile-input" type="text" value="${attr(company.city || "")}" data-company-profile-field="city" autocomplete="address-level2" /></label><label class="field settings-profile-field settings-profile-state"><span class="label">State</span><input class="input settings-profile-input" type="text" value="${attr(company.state || "")}" data-company-profile-field="state" autocomplete="address-level1" maxlength="2" /></label><label class="field settings-profile-field settings-profile-zip"><span class="label">ZIP code</span><input class="input settings-profile-input" type="text" value="${attr(company.zip || "")}" data-company-profile-field="zip" autocomplete="postal-code" /></label><label class="field settings-profile-field"><span class="label">Phone number</span><input class="input settings-profile-input" type="tel" value="${attr(company.phone || "")}" data-company-profile-field="phone" autocomplete="tel" /></label><label class="field settings-profile-field"><span class="label">Company email</span><input class="input settings-profile-input" type="email" value="${attr(company.email || "")}" data-company-profile-field="email" autocomplete="email" /></label></div>` : `<label class="field settings-profile-field"><span class="label">${escapeHtml(modal.label)}</span><input class="input settings-profile-input" type="${inputType}" value="" data-settings-modal-field placeholder="${visual.placeholder}" autocomplete="${autocomplete}" /></label>`}          <p class="settings-profile-help">${visual.notice}</p>        </div>        <footer class="settings-profile-dialog-footer">          <button class="btn secondary" type="button" data-action="close-settings-modal">Cancel</button>          <button class="btn primary" type="button" data-settings-save-modal>${escapeHtml(modal.saveLabel)}</button>        </footer>      </section>    </div>  `;
}
function formatPaymentCardNumber(value) {
  const digits = String(value || "")
    .replace(/\D/g, "")
    .slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}
function paymentCardBrand(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (/^4/.test(digits)) return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "MASTERCARD";
  if (/^3[47]/.test(digits)) return "AMEX";
  if (/^6/.test(digits)) return "DISCOVER";
  return "CARD";
}
function settingsPaymentMethodEditor() {
  const billing = getSettingsData().billing;
  const hasSavedCard = Boolean(billing.cardLast4);
  const savedCard = hasSavedCard
    ? `    <article class="settings-payment-saved-card">      <div class="settings-payment-saved-card-copy"><span>Current payment method</span><strong>${escapeHtml(billing.paymentMethod)}</strong><p>Used for subscription renewals and approved additional services.</p></div>      <button class="btn danger-outline" type="button" data-settings-action="remove-payment-card">Remove card</button>    </article>`
    : `    <article class="settings-payment-saved-card settings-payment-saved-card-empty">      <div class="settings-payment-saved-card-copy"><span>No payment method</span><strong>Add a card to continue renewals</strong><p>A saved card is required before a subscription or service purchase can be processed.</p></div>    </article>`;
  return `    <section class="settings-payment-editor-page">      <div class="settings-editor-page-head">        <div><p class="settings-modal-eyebrow">PAYMENT METHOD</p><h2>Manage payment method</h2><p>Add a replacement card or remove the current payment method from your workspace.</p></div>        <button class="btn secondary" type="button" data-settings-action="back-to-billing">Back to billing</button>      </div>      ${savedCard}      <section class="settings-payment-editor-card">        <div class="settings-payment-editor-intro"><h3>Add or replace card</h3><p>Your live preview updates as you enter card details. We only retain the card brand and last four digits.</p></div>        <div class="settings-payment-editor-grid">          <div class="settings-payment-editor-preview" aria-label="Card preview">            <div class="settings-digital-card settings-digital-card-editable" style="--card-a: #dff5ff; --card-b: #fff2bc; --card-c: #f6a3c8; --card-d: #7d6df2;"><div class="settings-digital-card-inner"><div class="settings-digital-card-top"><span>Virtual</span><strong>EasyWISP</strong></div><div class="settings-digital-card-number" data-payment-preview-number>Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½</div><div class="settings-digital-card-bottom"><div><span>Cardholder</span><strong data-payment-preview-holder>${escapeHtml(billing.cardholder || "YOUR NAME")}</strong></div><div class="settings-card-network" data-payment-preview-brand>${escapeHtml(billing.cardBrand || "CARD")}</div></div><span class="settings-payment-preview-expiry" data-payment-preview-expiry>MM / YY</span></div></div>          </div>          <form class="settings-payment-form" data-payment-card-form novalidate>            <label class="field"><span class="label">Card number</span><input class="input" type="text" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" data-payment-card-field="number" maxlength="19" /></label>            <label class="field"><span class="label">Cardholder name</span><input class="input" type="text" autocomplete="cc-name" placeholder="Name on card" data-payment-card-field="holder" value="${attr(billing.cardholder || "")}" /></label>            <div class="settings-payment-form-row"><label class="field"><span class="label">Expiry month</span><select class="input" data-payment-card-field="month" autocomplete="cc-exp-month"><option value="">MM</option>${Array.from(
    { length: 12 },
    (_, index) => String(index + 1).padStart(2, "0"),
  )
    .map((month) => `<option value="${month}">${month}</option>`)
    .join(
      "",
    )}</select></label><label class="field"><span class="label">Expiry year</span><select class="input" data-payment-card-field="year" autocomplete="cc-exp-year"><option value="">YYYY</option>${Array.from(
    { length: 12 },
    (_, index) => String(new Date().getFullYear() + index),
  )
    .map((year) => `<option value="${year}">${year}</option>`)
    .join(
      "",
    )}</select></label><label class="field"><span class="label">CVV</span><input class="input" type="password" inputmode="numeric" autocomplete="cc-csc" placeholder="Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½" data-payment-card-field="cvv" maxlength="4" /></label></div>            <label class="field"><span class="label">Billing contact email</span><input class="input" type="email" autocomplete="email" value="${attr(billing.billingContact || "")}" data-payment-card-field="contact" /></label>            <label class="field"><span class="label">Billing address</span><input class="input" type="text" autocomplete="street-address" value="${attr(billing.billingAddress || "")}" data-payment-card-field="address" /></label>            <p class="settings-payment-security-note"><span>i</span> Card number and CVV are used only to validate this form. They are not saved in this workspace.</p>            <div class="settings-payment-form-actions"><button class="btn secondary" type="button" data-settings-action="back-to-billing">Cancel</button><button class="btn primary" type="submit">Save payment method</button></div>          </form>        </div>      </section>      ${state.showPaymentCardRemovalDialog ? `<div class="settings-modal-backdrop" data-settings-action="cancel-remove-payment-card"><section class="settings-modal settings-profile-dialog settings-payment-remove-dialog" role="dialog" aria-modal="true" aria-labelledby="remove-payment-card-title" onclick="event.stopPropagation()"><header class="settings-profile-dialog-head"><div><p class="settings-modal-eyebrow">PAYMENT METHOD</p><h2 id="remove-payment-card-title">Remove saved card?</h2><p>This removes ${escapeHtml(billing.paymentMethod)} from your workspace.</p></div><button class="settings-profile-dialog-close" type="button" data-settings-action="cancel-remove-payment-card" aria-label="Close confirmation">&times;</button></header><div class="settings-profile-dialog-body"><div class="settings-modal-assurance"><span>i</span><p>Your plan will remain active until its next renewal. Add a new payment method before then to avoid an interruption.</p></div></div><footer class="settings-profile-dialog-footer"><button class="btn secondary" type="button" data-settings-action="cancel-remove-payment-card">Keep card</button><button class="btn danger-outline" type="button" data-settings-action="confirm-remove-payment-card">Remove card</button></footer></section></div>` : ""}    </section>  `;
}
function renderSettingsTabPanel() {
  const settings = getSettingsData();
  if (state.settingsTab === "company") return settingsCompanyInfoTab();
  if (state.settingsTab === "billing") return settingsSubscriptionBillingTab();
  if (state.settingsTab === "billing-card")
    return settingsPaymentMethodEditor();
  if (state.settingsTab === "users") return settingsUserManagementTab();
  if (state.settingsTab === "staff") return settingsStaffTab();
  if (state.settingsTab === "logs") return settingsActivityLogsTab();
  if (state.settingsTab !== "profile") return settingsPlaceholderTab();
  return `      <section class="settings-card">        <div class="settings-card-head">          <div class="settings-card-title">            <span class="settings-card-icon" aria-hidden="true">              <svg viewBox="0 0 20 20">                <path d="M10 2.75 4.65 4.9v4.2c0 3.15 1.95 5.95 5.35 8.15 3.4-2.2 5.35-5 5.35-8.15V4.9Z"></path>                <path d="m7.65 10.15 1.55 1.6 3.15-3.35"></path>              </svg>            </span>            <h2>Sign-In &amp; Security</h2>          </div>        </div>          <div class="settings-rows">          <div class="settings-row">            <div class="settings-row-label">Email Address</div>            <div class="settings-row-value">              <strong>${escapeHtml(settings.profile.email)}</strong>              <span class="settings-verified"><span class="settings-verified-dot"></span>Verified</span>            </div>            <div class="settings-row-action">              <button class="settings-text-action" type="button" data-settings-action="change-email">Change Email</button>            </div>          </div>          <div class="settings-row">            <div class="settings-row-label">Password</div>            <div class="settings-row-value">              <strong>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</strong>              <span>Last updated ${escapeHtml(settingsDisplayDate(settings.profile.passwordUpdatedAt))}</span>            </div>            <div class="settings-row-action">              <button class="settings-text-action" type="button" data-settings-action="update-password">Update Password</button>            </div>          </div>          <div class="settings-row">            <div class="settings-row-label">Multi-Factor Authentication</div>            <div class="settings-row-value">              <strong>${settings.profile.mfaEnabled ? "Enhanced account security enabled." : "MFA is currently disabled."}</strong>              <span>Method: ${escapeHtml(settings.profile.mfaMethod)} | Verified on ${escapeHtml(settingsDisplayDate(settings.profile.mfaVerifiedOn))}.</span>            </div>            <div class="settings-row-action">              <button class="settings-text-action" type="button" data-settings-action="change-mfa">Change Method</button>            </div>          </div>        </div>      </section>      <section class="settings-card settings-card-info">        <div class="settings-card-head settings-card-head-split">          <div class="settings-card-title"><h2>My Info</h2></div>          <button class="btn primary settings-main-action" type="button" data-settings-action="edit-profile">Change my info</button>        </div>        <div class="settings-rows">          <div class="settings-row">            <div class="settings-row-label">Name</div>            <div class="settings-row-value"><strong>${escapeHtml(settings.profile.name)}</strong></div>            <div class="settings-row-action"></div>          </div>        </div>      </section>  `;
}
function settingsUserManagementTab() {
  const settings = getSettingsData();
  const users = settings.users;
  const permissionLevels = [
    {
      title: "Basic",
      items: [
        "View assigned content",
        "Access firm training resources",
        "Participate in approved workflows",
      ],
    },
    {
      title: "Manager",
      items: [
        "Manage day-to-day drafting activity",
        "Review team progress and inputs",
        "Coordinate operational updates",
      ],
    },
    {
      title: "Administrator",
      items: [
        "Manage users and permissions",
        "Maintain billing and account controls",
        "Oversee final platform configuration",
      ],
    },
  ];
  return `    <section class="settings-card settings-card-info">      <div class="settings-card-head settings-card-head-split">        <div class="settings-card-title"><h2>Users</h2></div>        <button class="btn primary settings-main-action" type="button" data-settings-action="invite-user">Invite User</button>      </div>      <div class="settings-users-table">        <div class="settings-users-head settings-users-grid">          <div>First Name</div><div>Last Name</div><div>Email</div><div>Permission Level</div><div>Status</div><div>Actions</div>        </div>        ${users.map((user) => `          <div class="settings-users-row settings-users-grid">            <div class="settings-users-cell"><strong>${escapeHtml(user.firstName)}</strong></div>            <div class="settings-users-cell">${escapeHtml(user.lastName)}</div>            <div class="settings-users-cell settings-users-email">${escapeHtml(user.email)}</div>            <div class="settings-users-cell"><span class="settings-permission-pill">${escapeHtml(user.permission)}</span></div>            <div class="settings-users-cell"><span class="settings-status-pill settings-status-pill-${String(user.status || "").toLowerCase()}">${escapeHtml(user.status)}</span></div>            <div class="settings-users-cell settings-users-actions">              ${user.actions?.length ? `<div class="settings-users-action-links">${user.actions.map((action) => `<button class="settings-text-action" type="button" data-user-id="${attr(user.id)}" data-user-action="${attr(action)}">${escapeHtml(action)}</button>`).join("")}</div>` : `<span class="settings-users-action-muted">Current user</span>`}            </div>          </div>`).join("")}      </div>      <div class="settings-invite-note">        <div class="settings-invite-copy">          <strong>${escapeHtml(String(settings.billing.inviteSeatsRemaining))} user invite remaining on your current subscription.</strong>          <p>Need more access seats for firm leadership or support staff? Expand your subscription to add more users.</p>        </div>        <button class="btn secondary settings-upgrade-action" type="button" data-action="open-plan-modal">Upgrade to add more users</button>      </div>    </section>    <section class="settings-card settings-card-info">      <div class="settings-card-head"><div class="settings-card-title"><h2>Permission Levels</h2></div></div>      <div class="settings-permission-grid">        ${permissionLevels.map((level) => `<article class="settings-permission-card"><h3>${level.title}</h3><ul>${level.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>`).join("")}      </div>    </section>  `;
}
function getAdditionalServiceDetails(serviceId) {
  const services = {
    assist: {
      id: "assist",
      name: "WISP Assist Service",
      price: "$149 / request",
      description:
        "Guided support on builder completion, drafting questions, and implementation follow-up.",
      note: "Available to active subscription accounts.",
    },
    review: {
      id: "review",
      name: "WISP Review Service",
      price: "$249 / review",
      description:
        "A structured review of your draft before finalizing and distributing it internally.",
      note: "Requires a completed draft and assigned responsible roles.",
    },
  };
  return services[serviceId] || null;
}
function settingsSubscriptionBillingTab() {
  const billing = getSettingsData().billing;
  const hasSavedPaymentMethod = Boolean(billing.cardLast4);
  const paymentMethodMarkup = hasSavedPaymentMethod
    ? `<div class="settings-payment-layout"><div class="settings-payment-visual"><div class="settings-digital-card settings-digital-card-frozen" style="--card-a: #dff5ff; --card-b: #fff2bc; --card-c: #f6a3c8; --card-d: #7d6df2;"><span class="settings-card-freeze-label">Saved</span><div class="settings-digital-card-inner"><div class="settings-digital-card-top"><span>Virtual</span><strong>EasyWISP</strong></div><div class="settings-digital-card-number">**** ${escapeHtml(billing.cardLast4)}</div><div class="settings-digital-card-bottom"><div><span>Cardholder</span><strong>${escapeHtml(billing.cardholder)}</strong></div><div class="settings-card-network">${escapeHtml(billing.cardBrand)}</div></div></div></div></div><div class="settings-payment-details"><div class="settings-payment-row"><span>Billing contact</span><strong>${escapeHtml(billing.billingContact)}</strong></div><div class="settings-payment-row"><span>Billing address</span><strong>${escapeHtml(billing.billingAddress)}</strong></div><div class="settings-payment-row"><span>Status</span><strong>Ready for renewal on ${escapeHtml(settingsDisplayDate(billing.renewalDate))}</strong></div></div></div>`
    : `<div class="settings-payment-empty-state"><strong>No payment method on file</strong><p>Add a card before the next renewal to keep your subscription active.</p><button class="btn primary" type="button" data-settings-action="edit-billing">Add payment method</button></div>`;
  const monthlyPrice = Number(billing.priceMonthly) || 0;
  const billingCycle = billing.billingCycle === "yearly" ? "yearly" : "monthly";
  const displayedSubscriptionPrice =
    billingCycle === "yearly"
      ? `${Number(billing.priceAnnual) || monthlyPrice * 10} / year`
      : `${monthlyPrice} / month`;
  const annualBilling = state.planBillingCycle === "yearly";
  const planPrices = annualBilling
    ? {
        core: "$1,490",
        professional: "$2,990",
        enterprise: "$4,990",
        period: "/ year",
        savings: "Save 17%",
      }
    : {
        core: "$149",
        professional: "$299",
        enterprise: "$499",
        period: "/ month",
        savings: "",
      };
  return `    <section class="settings-card settings-card-info settings-billing-card">      <div class="settings-card-head settings-card-head-split settings-billing-head">        <div class="settings-card-title settings-billing-title">          <h2>Subscription</h2>          <p>Manage your plan, payment method, and renewal details from one place.</p>        </div>        <span class="settings-status-pill settings-status-pill-verified">${escapeHtml(billing.status)}</span>      </div>      <div class="settings-billing-summary">        <div class="settings-billing-plan">          <div class="settings-billing-plan-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>          <span class="settings-billing-eyebrow">Current plan</span>          <div class="settings-billing-plan-row">            <strong>${escapeHtml(billing.planName)}</strong>            <button class="btn primary settings-billing-upgrade-btn" type="button" data-action="open-plan-modal">Upgrade</button>          </div>          <p>Built for firms that want guided compliance workflows, secure collaboration, and clean WISP administration.</p>          <div class="settings-billing-plan-tags">            <span>${escapeHtml(String(billing.inviteSeatsRemaining))} user invite remaining</span>            <span>${billing.autoRenew ? "Auto-renew enabled" : "Auto-renew disabled"}</span>          </div>        </div>        <div class="settings-billing-meta">          <div class="settings-billing-meta-item"><span>Price</span><strong>${displayedSubscriptionPrice}</strong></div>          <div class="settings-billing-meta-item"><span>Payment Method</span><strong>${escapeHtml(billing.paymentMethod)}</strong></div>          <div class="settings-billing-meta-item"><span>Renewal Date</span><strong>${escapeHtml(settingsDisplayDate(billing.renewalDate))}</strong></div>        </div>      </div>    </section>    ${state.showPlanModal ? `    <div class="plan-modal-overlay" role="dialog" aria-modal="true" aria-label="Choose your EasyWISP plan">      <div class="plan-modal-backdrop" data-action="close-plan-modal"></div>      <div class="plan-modal-dialog settings-pricing-dialog">        <div class="plan-modal-head settings-pricing-head">          <div class="plan-modal-title">            <span class="settings-pricing-kicker">EASYWISP PLANS</span>            <h2>We've got a plan that's perfect for your firm</h2>            <span class="plan-modal-subtitle">Choose the right level of guidance, automation, and support for your compliance program.</span>          </div>          <button class="plan-modal-close" type="button" data-action="close-plan-modal" aria-label="Close plan options">&times;</button>        </div>        <div class="settings-pricing-cycle" role="group" aria-label="Billing period">          <button class="settings-pricing-cycle-option ${!annualBilling ? "is-active" : ""}" type="button" data-action="set-plan-billing-monthly">Monthly billing</button>          <button class="settings-pricing-cycle-option ${annualBilling ? "is-active" : ""}" type="button" data-action="set-plan-billing-yearly">Annual billing <span>${planPrices.savings || "Best value"}</span></button>        </div>        <div class="plan-modal-body settings-pricing-body">          <div class="settings-plan-options settings-pricing-options">            <article class="settings-plan-option settings-pricing-option ${billing.planName === "EasyWISP Core" ? "settings-plan-option-selected" : ""}">              <div class="settings-plan-option-topline"><span class="settings-plan-option-badge">Core</span></div>              <h3>EasyWISP Core</h3>              <p class="settings-plan-option-desc">For smaller firms beginning a structured compliance program.</p>              <p class="settings-plan-option-price" data-plan-price="core">${planPrices.core}<small>${planPrices.period}</small></p>              <button class="settings-plan-option-btn settings-pricing-select" type="button" data-settings-plan="EasyWISP Core" ${billing.planName === "EasyWISP Core" ? "disabled" : ""}>${billing.planName === "EasyWISP Core" ? "Current plan" : "Choose Core"}</button>              <div class="settings-pricing-feature-block"><strong>Features</strong><span>Includes</span><ul class="settings-plan-option-features"><li>Guided WISP builder</li><li>Risk assessment workspace</li><li>Core document templates</li><li>Up to 3 team members</li></ul></div>            </article>            <article class="settings-plan-option settings-pricing-option settings-plan-option-current ${billing.planName === "EasyWISP Professional" ? "settings-plan-option-selected" : ""}">              <div class="settings-plan-option-topline"><span class="settings-plan-option-badge">Professional</span><span class="settings-pricing-value">Popular</span></div>              <h3>EasyWISP Professional</h3>              <p class="settings-plan-option-desc">The complete workspace for firms managing ongoing safeguards.</p>              <p class="settings-plan-option-price" data-plan-price="professional">${planPrices.professional}<small>${planPrices.period}</small></p>              <button class="settings-plan-option-btn settings-pricing-select" type="button" data-settings-plan="EasyWISP Professional" ${billing.planName === "EasyWISP Professional" ? "disabled" : ""}>${billing.planName === "EasyWISP Professional" ? "Current plan" : "Choose Professional"}</button>              <div class="settings-pricing-feature-block"><strong>Features</strong><span>Everything in Core, plus</span><ul class="settings-plan-option-features"><li>Training tracking and assets</li><li>Editable firm document suite</li><li>WISP review and PDF delivery</li><li>Up to 10 team members</li></ul></div>            </article>            <article class="settings-plan-option settings-pricing-option ${billing.planName === "EasyWISP Enterprise" ? "settings-plan-option-selected" : ""}">              <div class="settings-plan-option-topline"><span class="settings-plan-option-badge">Enterprise</span></div>              <h3>EasyWISP Enterprise</h3>              <p class="settings-plan-option-desc">For growing firms that need governance, scale, and priority support.</p>              <p class="settings-plan-option-price" data-plan-price="enterprise">${planPrices.enterprise}<small>${planPrices.period}</small></p>              <button class="settings-plan-option-btn settings-pricing-select" type="button" data-settings-plan="EasyWISP Enterprise" ${billing.planName === "EasyWISP Enterprise" ? "disabled" : ""}>${billing.planName === "EasyWISP Enterprise" ? "Current plan" : "Choose Enterprise"}</button>              <div class="settings-pricing-feature-block"><strong>Features</strong><span>Everything in Professional, plus</span><ul class="settings-plan-option-features"><li>Multi-location administration</li><li>Expanded staff controls</li><li>Priority implementation support</li><li>Annual compliance review</li></ul></div>            </article>          </div>        </div>        <p class="settings-pricing-note">Annual billing is charged once per year. Taxes may apply based on your billing address.</p>      </div>    </div>` : ""}    <section class="settings-card settings-billing-services">      <div class="settings-card-head"><div class="settings-card-title"><h2>Additional Services</h2><p>Select a service below, then confirm the request using your saved payment method.</p></div></div>      <div class="settings-services-list settings-services-select-list">        ${[
    "assist",
    "review",
  ]
    .map((serviceId) => {
      const service = getAdditionalServiceDetails(serviceId);
      const selected = state.selectedAdditionalService === serviceId;
      return `<button class="settings-service-item settings-service-select ${selected ? "is-selected" : ""}" type="button" data-service-select="${service.id}" aria-pressed="${selected}"><span class="settings-service-copy"><span class="settings-service-head"><strong>${service.name}</strong><span class="settings-service-price">${service.price}</span></span><span class="settings-service-description">${service.description}</span><span class="settings-service-note ${serviceId === "review" ? "settings-service-note-muted" : ""}">${service.note}</span></span><span class="settings-service-choice">${selected ? "Selected" : "Select"}</span></button>`;
    })
    .join(
      "",
    )}        <div class="settings-service-purchase-bar"><div><strong>${state.selectedAdditionalService ? getAdditionalServiceDetails(state.selectedAdditionalService).name : "Choose a service"}</strong><span>${state.selectedAdditionalService ? "Ready to review your purchase." : "Select one service to continue."}</span></div><button class="btn primary settings-main-action" type="button" data-settings-action="purchase-service" ${state.selectedAdditionalService ? "" : "disabled"}>Purchase Service</button></div>      </div>    </section>    ${
    state.showServicePurchaseDialog
      ? (() => {
          const service = getAdditionalServiceDetails(
            state.selectedAdditionalService,
          );
          return service
            ? `<div class="settings-modal-backdrop settings-service-purchase-backdrop" data-settings-action="cancel-service-purchase"><section class="settings-modal settings-profile-dialog settings-service-purchase-dialog" role="dialog" aria-modal="true" aria-labelledby="service-purchase-title" onclick="event.stopPropagation()"><header class="settings-profile-dialog-head"><div><p class="settings-modal-eyebrow">ADDITIONAL SERVICE</p><h2 id="service-purchase-title">Confirm service purchase</h2><p>You are about to request ${escapeHtml(service.name)}.</p></div><button class="settings-profile-dialog-close" type="button" data-settings-action="cancel-service-purchase" aria-label="Close confirmation">&times;</button></header><div class="settings-profile-dialog-body"><div class="settings-service-confirm-summary"><span>Selected service</span><strong>${escapeHtml(service.name)}</strong><b>${escapeHtml(service.price)}</b></div><div class="settings-modal-assurance"><span>i</span><p>Your connected ${escapeHtml(billing.paymentMethod || `payment card ending in ${billing.cardLast4 || "----"}`)} will be used to process this request. Charges are not processed in this build-stage workspace.</p></div></div><footer class="settings-profile-dialog-footer"><button class="btn secondary" type="button" data-settings-action="cancel-service-purchase">Cancel</button><button class="btn primary" type="button" data-settings-action="confirm-service-purchase">Confirm purchase</button></footer></section></div>`
            : "";
        })()
      : ""
  }    <section class="settings-card settings-card-info settings-payment-card">      <div class="settings-card-head settings-card-head-split"><div class="settings-card-title settings-billing-title"><h2>Payment Method</h2><p>Your billing card on file is used for subscription renewals and service purchases.</p></div><button class="settings-text-action" type="button" data-settings-action="edit-billing">Update card</button></div>      <div class="settings-payment-layout"><div class="settings-payment-visual"><div class="settings-digital-card settings-digital-card-frozen" style="--card-a: #dff5ff; --card-b: #fff2bc; --card-c: #f6a3c8; --card-d: #7d6df2;"><span class="settings-card-freeze-label">Saved</span><div class="settings-digital-card-inner"><div class="settings-digital-card-top"><span>Virtual</span><strong>EasyWISP</strong></div><div class="settings-digital-card-number">**** ${escapeHtml(billing.cardLast4)}</div><div class="settings-digital-card-bottom"><div><span>Cardholder</span><strong>${escapeHtml(billing.cardholder)}</strong></div><div class="settings-card-network">${escapeHtml(billing.cardBrand)}</div></div></div></div></div><div class="settings-payment-details"><div class="settings-payment-row"><span>Billing contact</span><strong>${escapeHtml(billing.billingContact)}</strong></div><div class="settings-payment-row"><span>Billing address</span><strong>${escapeHtml(billing.billingAddress)}</strong></div><div class="settings-payment-row"><span>Status</span><strong>Ready for renewal on ${escapeHtml(settingsDisplayDate(billing.renewalDate))}</strong></div></div></div>    </section>  `;
}
function settingsCompanyInfoTab() {
  const settings = getSettingsData();
  const logoName = state.settingsLogo?.name
    ? formatDisplayFileName(state.settingsLogo.name)
    : "No logo uploaded";
  const logoMeta = state.settingsLogo
    ? `${escapeHtml(state.settingsLogo.type || "Image file")} - ${escapeHtml(formatAttachmentSize(state.settingsLogo.size || 0))}`
    : "Upload your company logo to appear across your WISP documents and related account materials.";
  return `    <section class="settings-card settings-card-info">      <div class="settings-card-head settings-card-head-split"><div class="settings-card-title"><h2>Company Profile</h2></div><button class="btn primary settings-main-action" type="button" data-settings-action="edit-company">Update Profile</button></div>      <div class="settings-rows settings-rows-company">        <div class="settings-row"><div class="settings-row-label">Firm Name</div><div class="settings-row-value"><strong>${escapeHtml(state.firmProfile?.name || state.form.companyName || "Not provided")}</strong></div><div class="settings-row-action"></div></div>        <div class="settings-row"><div class="settings-row-label">Address</div><div class="settings-row-value"><strong>${escapeHtml(settings.company.address || "Not provided")}</strong></div><div class="settings-row-action"></div></div>        <div class="settings-row"><div class="settings-row-label">Phone Number</div><div class="settings-row-value"><strong>${escapeHtml(settings.company.phone || "Not provided")}</strong></div><div class="settings-row-action"></div></div>        <div class="settings-row"><div class="settings-row-label">Email</div><div class="settings-row-value"><strong>${escapeHtml(settings.company.email || "Not provided")}</strong></div><div class="settings-row-action"></div></div>      </div>    </section>    <section class="settings-card settings-logo-card">      <div class="settings-card-head"><div class="settings-card-title"><h2>Logo</h2></div></div>      <div class="settings-logo-body"><div class="settings-logo-copy"><strong>${escapeHtml(logoName)}</strong><p>${escapeHtml(logoMeta)}</p><div class="settings-logo-actions"><label class="btn secondary small settings-logo-browse" aria-label="Upload company logo"><input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" data-settings-logo hidden /><span>${state.settingsLogo ? "Replace logo" : "Browse files"}</span></label>${state.settingsLogo ? `<button class="btn ghost small settings-logo-clear" type="button" data-settings-logo-remove>Remove</button>` : ""}</div></div><div class="settings-logo-preview-wrap"><div class="settings-logo-preview-frame">${state.settingsLogo?.previewUrl ? `<img class="settings-logo-preview" src="${escapeHtml(state.settingsLogo.previewUrl)}" alt="Company logo preview" />` : `<div class="settings-logo-preview-empty">No preview yet</div>`}</div><label class="settings-logo-dropzone" data-settings-logo-dropzone aria-label="Upload company logo"><input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" data-settings-logo hidden /><span class="settings-logo-dropzone-title">Drop logo here or browse</span><span class="settings-logo-dropzone-meta">PNG, JPG, SVG, or WEBP - Max 5MB</span></label></div></div>    </section>  `;
}
function settingsStaffDialog() {
  const editing = (state.editingStaffId && getSettingsData().staff.find((member) => member.id === state.editingStaffId)) || null;
  return `    <div class="settings-modal-backdrop" data-settings-action="cancel-add-staff">      <section class="settings-modal settings-profile-dialog settings-staff-dialog" role="dialog" aria-modal="true" aria-labelledby="settings-staff-dialog-title" onclick="event.stopPropagation()">        <header class="settings-profile-dialog-head">          <div>            <p class="settings-modal-eyebrow">STAFF DIRECTORY</p>            <h2 id="settings-staff-dialog-title">${editing ? "Edit staff member" : "Add staff member"}</h2>            <p>${editing ? "Update this staff record for your workspace." : "Add a person or third party who supports the firm and may need to be tracked in your compliance workspace."}</p>          </div>          <button class="settings-profile-dialog-close" type="button" data-settings-action="cancel-add-staff" aria-label="Close dialog">&times;</button>        </header>        <form class="settings-profile-dialog-body settings-staff-dialog-form" id="settings-staff-form" data-staff-form novalidate>          <label class="field settings-profile-field settings-profile-field-full">            <span class="label">Email address</span>            <input class="input settings-profile-input" type="email" autocomplete="email" placeholder="name@company.com" data-staff-field="email" value="${attr(editing?.email || "")}" required />          </label>          <div class="settings-staff-dialog-name-grid">            <label class="field settings-profile-field">              <span class="label">First name</span>              <input class="input settings-profile-input" type="text" autocomplete="given-name" placeholder="First name" data-staff-field="firstName" value="${attr(editing?.firstName || "")}" required />            </label>            <label class="field settings-profile-field">              <span class="label">Last name</span>              <input class="input settings-profile-input" type="text" autocomplete="family-name" placeholder="Last name" data-staff-field="lastName" value="${attr(editing?.lastName || "")}" />            </label>          </div>          <label class="field settings-profile-field settings-profile-field-full">            <span class="label">Title</span>            <input class="input settings-profile-input" type="text" autocomplete="organization-title" placeholder="e.g. Tax preparer or IT consultant" data-staff-field="title" value="${attr(editing?.title || "")}" required />          </label>          <label class="field settings-profile-field settings-profile-field-full">            <span class="label">Type</span>            <select class="input settings-profile-input settings-staff-dialog-select" data-staff-field="type" ${editing?.wisp_role ? "disabled" : ""} required>              ${["Employee", "Contractor", "Vendor", "Other", "WISP role"].map((type) => `<option value="${type}" ${String(editing?.type || "Employee") === type ? "selected" : ""}>${type}</option>`).join("")}            </select>          </label>          <p class="settings-profile-help">${editing?.wisp_role ? "This is a required WISP role. Its type is fixed, but you can update its contact details." : "The staff record is saved to this workspace and can be removed later from the Staff tab."}</p>        </form>        <footer class="settings-profile-dialog-footer">          <button class="btn secondary" type="button" data-settings-action="cancel-add-staff">Cancel</button>          <button class="btn primary" type="submit" form="settings-staff-form">${editing ? "Save changes" : "Add staff member"}</button>        </footer>      </section>    </div>  `;
}
function settingsStaffTab() {
  const staff = getSettingsData().staff;
  const selectedIds = new Set(state.selectedStaffIds || []);
  const selectedCount = staff.filter((member) =>
    selectedIds.has(member.id),
  ).length;
  const allSelected = staff.length > 0 && selectedCount === staff.length;
  return `    <section class="settings-card settings-card-info">      <div class="settings-card-head"><div class="settings-card-title"><h2>Staff</h2></div></div>      <div class="settings-staff-intro"><p>Invite people to review your active WISP and electronically sign that they understand and acknowledge it.</p></div>      <div class="settings-staff-toolbar"><div class="settings-staff-toolbar-left"><label class="settings-staff-page-size"><span>Show</span><select aria-label="Entries per page"><option selected>10</option></select><span>entries</span></label></div><div class="settings-staff-toolbar-right"><button class="btn secondary settings-staff-secondary" type="button" data-settings-action="import-staff">Import List</button><button class="btn primary settings-staff-primary" type="button" data-settings-action="add-staff">Add New</button></div></div>      <div class="settings-staff-table"><div class="settings-staff-head settings-staff-grid"><div class="settings-staff-check"><input type="checkbox" aria-label="Select all staff" data-staff-select-all ${allSelected ? "checked" : ""} ${staff.length ? "" : "disabled"} /></div><div>Email</div><div>First Name</div><div>Last Name</div><div>Title</div><div>Type</div><div>Action</div></div>      ${staff.length ? staff.map((member) => `<div class="settings-staff-empty-grid settings-staff-grid"><div class="settings-staff-check"><input type="checkbox" aria-label="Select ${attr(`${member.firstName || ""} ${member.lastName || ""}`.trim() || member.email || "staff member")}" data-staff-select="${attr(member.id)}" ${selectedIds.has(member.id) ? "checked" : ""} /></div><div>${escapeHtml(member.email || "—")}</div><div>${escapeHtml(member.firstName || "")}</div><div>${escapeHtml(member.lastName || "")}</div><div>${escapeHtml(member.title || "")}</div><div>${escapeHtml(member.type || "")}</div><div class="settings-staff-row-actions"><button class="settings-text-action" type="button" data-staff-edit="${attr(member.id)}">Edit</button><button class="settings-text-action" type="button" data-staff-remove="${attr(member.id)}">Remove</button></div></div>`).join("") : `<div class="settings-staff-empty-row"><div class="settings-staff-empty-grid settings-staff-grid"><div class="settings-staff-check"><input type="checkbox" aria-label="Select row" disabled /></div><div class="settings-staff-empty-copy"><strong>No staff records added</strong><p>Your invited reviewers and acknowledgement signers will appear here once they are added.</p></div></div></div>`}      </div>      <div class="settings-staff-footer"><div class="settings-staff-count">${selectedCount ? `${selectedCount} selected Â· ` : ""}Showing ${staff.length ? 1 : 0} to ${staff.length} of ${staff.length} entries</div><div class="settings-staff-footer-actions"><button class="btn secondary settings-staff-delete" type="button" data-staff-delete-selected ${selectedCount ? "" : "disabled"}>Delete Selected</button></div></div>    </section>  `;
}
function settingsActivityLogsTab() {
  const activityRows = getSettingsData().activityLogs;
  return `    <section class="settings-card settings-card-info">      <div class="settings-card-head"><div class="settings-card-title"><h2>Activity Logs</h2></div></div>      <div class="settings-activity-intro"><p>This section shows company activity such as logins, logouts, user changes, and other important events recorded across the WISP Builder workspace.</p></div>      <div class="settings-activity-toolbar"><div class="settings-activity-toolbar-left"><label class="settings-staff-page-size"><span>Show</span><select aria-label="Entries per page"><option selected>10</option></select><span>entries</span></label></div><div class="settings-activity-toolbar-right"><button class="btn secondary settings-activity-export" type="button" data-settings-action="export-logs">Export CSV</button></div></div>      <div class="settings-activity-table"><div class="settings-activity-head settings-activity-grid"><div>Activity</div><div>User</div><div>Details</div><div>Date</div><div>IP Address</div></div>${activityRows.map((row) => `<div class="settings-activity-row settings-activity-grid"><div class="settings-activity-cell"><span class="settings-activity-pill">${escapeHtml(row.activity)}</span></div><div class="settings-activity-cell">${escapeHtml(row.user)}</div><div class="settings-activity-cell settings-activity-detail">${escapeHtml(row.details)}</div><div class="settings-activity-cell settings-activity-date">${escapeHtml(settingsDisplayDate(row.date))}</div><div class="settings-activity-cell settings-activity-ip">${escapeHtml(row.ip)}</div></div>`).join("")}</div>    </section>  `;
}
function formatCompanyAddress() {
  const settings = getSettingsData();
  const parts = [
    state.form.streetAddress,
    state.form.city,
    state.form.state,
    state.form.postalCode,
  ].filter(Boolean);
  return (
    settings.company.address ||
    (parts.length
      ? parts.join(", ")
      : "2750 West Loop South, Houston, TX 77027")
  );
}
function trainingSearchIcon() {
  return `    <svg viewBox="0 0 20 20" aria-hidden="true">      <circle cx="8.55" cy="8.55" r="4.95"></circle>      <path d="m12.2 12.2 4.2 4.2"></path>    </svg>  `;
}
function workspaceUtilityIcon(name) {
  const icons = {
    home: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m3.25 9.15 6.75-5.4 6.75 5.4v7.1H11.9v-4.45H8.1v4.45H3.25z"></path></svg>',
    shield:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.7 15.7 5v4.25c0 3.45-2.22 6.12-5.7 8.05-3.48-1.93-5.7-4.6-5.7-8.05V5z"></path><path d="m7.35 9.95 1.75 1.75 3.55-3.7"></path></svg>',
    document:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.05 2.65h6.2l3.7 3.7v10.9H5.05z"></path><path d="M11.25 2.65v3.7h3.7M7.7 10h4.6M7.7 13h4.6"></path></svg>',
    training:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2.75 7.25 10 3.8l7.25 3.45L10 10.7z"></path><path d="M5.2 8.8v3.05c1.12.92 2.7 1.55 4.8 1.55s3.68-.63 4.8-1.55V8.8"></path></svg>',
    folder:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2.7 5.85h5.08l1.48 1.6h8.04v7.85a1.5 1.5 0 0 1-1.5 1.5H4.2a1.5 1.5 0 0 1-1.5-1.5z"></path></svg>',
    user: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="6.55" r="3.1"></circle><path d="M4.1 16.5c.6-2.7 2.48-4.2 5.9-4.2s5.3 1.5 5.9 4.2"></path></svg>',
    building:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.2 16.7V3.3h8.25v13.4M2.7 16.7h14.6M7 6.1h2.65M7 9.25h2.65M7 12.4h2.65M12.45 7.1h3.35v9.6"></path></svg>',
    card: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.55" y="4.35" width="14.9" height="11.3" rx="1.85"></rect><path d="M2.75 8.1h14.5M5.25 12.4h3.1"></path></svg>',
    users:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="7.1" cy="7.1" r="2.5"></circle><path d="M2.8 16.2c.42-2.35 1.92-3.78 4.3-3.78s3.88 1.43 4.3 3.78M13.25 5.1a2.35 2.35 0 0 1 0 4.68M13.4 12.45c1.95.12 3.15 1.35 3.48 3.18"></path></svg>',
    activity:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h3l1.55-4.15L10.5 14l1.75-4H17"></path></svg>',
  };
  return icons[name] || icons.document;
}
function workspaceNotificationIcon(activity) {
  const value = String(activity || "").toLowerCase();
  if (value.includes("service")) return workspaceUtilityIcon("card");
  if (value.includes("staff") || value.includes("user"))
    return workspaceUtilityIcon("users");
  if (value.includes("login") || value.includes("security"))
    return workspaceUtilityIcon("shield");
  return workspaceUtilityIcon("activity");
}
function workspaceUtilityUser() {
  const settings = getSettingsData();
  const name =
    state.authUser?.user_metadata?.full_name ||
    settings.profile?.name ||
    "Workspace user";
  const email = state.authUser?.email || settings.profile?.email || "";
  const initials =
    String(name)
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "EW";
  return { name, email, initials };
}
function workspaceUtilityItems() {
  return [
    {
      title: "Home",
      detail: "Compliance dashboard",
      action: "nav-home",
      icon: "home",
    },
    {
      title: "Risk Assessment",
      detail: "Review your safeguards",
      action: "nav-risk",
      icon: "shield",
    },
    {
      title: "WISP Builder",
      detail: "Create and manage your WISP",
      action: "nav-builder-home",
      icon: "document",
    },
    {
      title: "Training",
      detail: "Training assets and progress",
      action: "nav-training",
      icon: "training",
    },
    {
      title: "Documents",
      detail: "Firm templates and files",
      action: "nav-documents",
      icon: "folder",
    },
    {
      title: "My Profile",
      detail: "Account and security settings",
      action: "utility-settings-profile",
      icon: "user",
    },
    {
      title: "Company Info",
      detail: "Firm details and logo",
      action: "utility-settings-company",
      icon: "building",
    },
    {
      title: "Subscription & Billing",
      detail: "Plan, services, and payment method",
      action: "utility-settings-billing",
      icon: "card",
    },
    {
      title: "Staff",
      detail: "Manage staff records",
      action: "utility-settings-staff",
      icon: "users",
    },
    {
      title: "Activity Logs",
      detail: "Workspace activity history",
      action: "utility-settings-activity",
      icon: "activity",
    },
  ];
}
function workspaceSearchResults(query = "") {
  const normalized = String(query).trim().toLowerCase();
  const results = workspaceUtilityItems().filter(
    (item) =>
      !normalized ||
      `${item.title} ${item.detail}`.toLowerCase().includes(normalized),
  );
  return results.length
    ? results
        .map(
          (item) =>
            `    <button class="workspace-search-result" type="button" data-action="${item.action}">      <span class="workspace-search-result-mark">${workspaceUtilityIcon(item.icon)}</span>      <span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.detail)}</small></span>      <span class="workspace-search-result-arrow">&#8594;</span>    </button>  `,
        )
        .join("")
    : `<div class="workspace-search-empty">No workspace destinations found.</div>`;
}
function workspaceNotifications() {
  return getSettingsData().activityLogs.slice(0, 5);
}
function renderWorkspaceUtilities() {
  const utility = state.workspaceUtility;
  if (!utility) return "";
  const user = workspaceUtilityUser();
  if (utility === "search")
    return `    <div class="workspace-utility-overlay" data-workspace-utility-close>      <section class="workspace-search-dialog" role="dialog" aria-modal="true" aria-label="Search workspace" data-workspace-utility-dialog>        <div class="workspace-utility-dialog-head"><div><span class="workspace-utility-eyebrow">WORKSPACE SEARCH</span><h2>Find what you need</h2></div><button class="workspace-utility-close" type="button" data-action="close-workspace-utility" aria-label="Close search">&times;</button></div>        <label class="workspace-search-field"><span>${dashboardUtilityIcon("search")}</span><input type="search" autocomplete="off" placeholder="Search pages and settings" data-workspace-search-input /></label>        <div class="workspace-search-results" data-workspace-search-results>${workspaceSearchResults()}</div>        <div class="workspace-search-hint"><span>Navigate directly to any workspace area.</span><span><kbd>Esc</kbd> to close</span></div>      </section>    </div>  `;
  if (utility === "notifications")
    return `    <div class="workspace-utility-overlay workspace-utility-overlay-panel" data-workspace-utility-close>      <section class="workspace-utility-panel" role="dialog" aria-modal="true" aria-label="Notifications" data-workspace-utility-dialog>        <div class="workspace-utility-panel-head"><div><span class="workspace-utility-eyebrow">WORKSPACE ACTIVITY</span><h2>Notifications</h2></div><button class="workspace-utility-close" type="button" data-action="close-workspace-utility" aria-label="Close notifications">&times;</button></div>        <div class="workspace-notification-toolbar"><span>Recent workspace events</span><strong>${workspaceNotifications().length} updates</strong></div><div class="workspace-notification-list">${workspaceNotifications()
      .map(
        (entry) =>
          `<article class="workspace-notification"><span class="workspace-notification-icon">${workspaceNotificationIcon(entry.activity)}</span><div><strong>${escapeHtml(entry.activity)}</strong><p>${escapeHtml(entry.details)}</p><small>${escapeHtml(settingsDisplayDate(entry.date))}</small></div></article>`,
      )
      .join(
        "",
      )}</div>        <button class="workspace-utility-link" type="button" data-action="utility-settings-activity">Open activity logs <span>&#8594;</span></button>      </section>    </div>  `;
  const testingTools = isStagingOnboardingResetEnabled() ? `<div class="workspace-profile-testing"><span>TESTING TOOLS</span><button type="button" data-action="restart-onboarding"><span aria-hidden="true">↻</span>Restart onboarding</button></div>` : "";
  return `    <div class="workspace-utility-overlay workspace-utility-overlay-panel" data-workspace-utility-close>      <section class="workspace-utility-panel workspace-profile-menu" role="dialog" aria-modal="true" aria-label="Profile menu" data-workspace-utility-dialog>        <div class="workspace-profile-menu-user"><span class="workspace-profile-menu-avatar">${escapeHtml(user.initials)}</span><div><strong>${escapeHtml(user.name)}</strong><small>${escapeHtml(user.email || "EasyWISP workspace")}</small></div><button class="workspace-utility-close" type="button" data-action="close-workspace-utility" aria-label="Close profile menu">&times;</button></div>        <div class="workspace-profile-menu-label">WORKSPACE SETTINGS</div><div class="workspace-profile-menu-links"><button type="button" data-action="utility-settings-profile"><span class="workspace-profile-link-icon">${workspaceUtilityIcon("user")}</span><span class="workspace-profile-link-copy"><strong>My profile</strong><small>Account and security</small></span><span class="workspace-profile-link-arrow">&#8594;</span></button><button type="button" data-action="utility-settings-company"><span class="workspace-profile-link-icon">${workspaceUtilityIcon("building")}</span><span class="workspace-profile-link-copy"><strong>Company information</strong><small>Firm details and branding</small></span><span class="workspace-profile-link-arrow">&#8594;</span></button><button type="button" data-action="utility-settings-billing"><span class="workspace-profile-link-icon">${workspaceUtilityIcon("card")}</span><span class="workspace-profile-link-copy"><strong>Subscription &amp; billing</strong><small>Plan and payment method</small></span><span class="workspace-profile-link-arrow">&#8594;</span></button></div>${testingTools}        <button class="workspace-profile-signout" type="button" data-action="sign-out">Sign out</button>      </section>    </div>  `;
}
function dashboardHeaderControls(extra = "") {
  return `    <div class="dashboard-builder-header-actions">      ${extra}      <button class="dashboard-utility-button" type="button" data-action="open-workspace-search" aria-label="Search">        ${dashboardUtilityIcon("search")}      </button>      <button class="dashboard-utility-button dashboard-utility-button-alert" type="button" data-action="toggle-workspace-notifications" aria-label="Notifications">        ${dashboardUtilityIcon("bell")}        <span class="dashboard-utility-dot" aria-hidden="true"></span>      </button>      <button class="dashboard-profile-button" type="button" data-action="toggle-workspace-profile" aria-label="Open profile">        <span class="dashboard-profile-avatar">${escapeHtml(workspaceUtilityUser().initials)}</span>      </button>    </div>  `;
}
function dashboardUtilityIcon(name) {
  if (name === "bell") {
    return `      <svg viewBox="0 0 20 20" aria-hidden="true">        <path d="M10 3.1a3.4 3.4 0 0 1 3.4 3.4v1.1c0 .8.2 1.5.62 2.18l.88 1.45c.2.33.3.7.3 1.09v.38H4.8v-.38c0-.39.1-.76.3-1.09l.88-1.45c.42-.68.62-1.38.62-2.18V6.5A3.4 3.4 0 0 1 10 3.1Z"></path>        <path d="M8.05 15.2a2.2 2.2 0 0 0 3.9 0"></path>      </svg>    `;
  }
  return `    <svg viewBox="0 0 20 20" aria-hidden="true">      <circle cx="8.55" cy="8.55" r="4.95"></circle>      <path d="m12.2 12.2 4.2 4.2"></path>    </svg>  `;
}
function dashboardStepIcon(kind) {
  if (kind === "upload") {
    return `      <svg viewBox="0 0 20 20" aria-hidden="true">        <path d="M10 12.9V5.7"></path>        <path d="m7.15 8.55 2.85-2.85 2.85 2.85"></path>        <path d="M4.3 13.85v.95a1.2 1.2 0 0 0 1.2 1.2h8.95a1.2 1.2 0 0 0 1.2-1.2v-.95"></path>      </svg>    `;
  }
  if (kind === "training") {
    return `      <svg viewBox="0 0 20 20" aria-hidden="true">        <path d="M3.1 7.25 10 3.95l6.9 3.3L10 10.55 3.1 7.25Z"></path>        <path d="M5.4 8.65v3.3c0 .45.23.87.62 1.11C6.97 13.7 8.4 14.4 10 14.4s3.03-.7 3.98-1.34c.39-.24.62-.66.62-1.11v-3.3"></path>      </svg>    `;
  }
  return `    <svg viewBox="0 0 20 20" aria-hidden="true">      <rect x="3.1" y="4.15" width="11.5" height="12.3" rx="2.2"></rect>      <path d="M6.35 9.8 8.3 11.7l5.2-5.2"></path>      <path d="M14.6 6.7h2.3"></path>    </svg>  `;
}
function trainingRowIcon(kind) {
  if (kind === "video") {
    return `      <svg viewBox="0 0 20 20" aria-hidden="true">        <rect x="2.75" y="4.3" width="14.5" height="11.4" rx="2.35"></rect>        <path d="m8.25 7.55 4.35 2.45-4.35 2.45z"></path>      </svg>    `;
  }
  return `    <svg viewBox="0 0 20 20" aria-hidden="true">      <path d="M5.1 2.85h6.05l3.25 3.2V16.7H5.1z"></path>      <path d="M11.15 2.85v3.2h3.25"></path>    </svg>  `;
}
function getAppAssetBaseUrl() {
  const appScript = document.querySelector('script[src$="app.js"]');
  if (appScript?.src) {
    try {
      return new URL(".", appScript.src).toString();
    } catch {}
  }
  try {
    return new URL("./", window.location.href).toString();
  } catch {
    return `${window.location.origin}/`;
  }
}
function resolveAppAssetUrl(rawPath) {
  const raw = String(rawPath || "").trim();
  if (!raw) return "";
  if (/^(https?:|file:|blob:|data:)/i.test(raw)) return raw;
  const normalized = raw
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .replace(/^\/+/, "");
  try {
    return new URL(normalized, getAppAssetBaseUrl()).toString();
  } catch {
    return normalized;
  }
}
function getSupabasePublicTrainingAssetUrl(
  storagePath,
  bucketName = "training-assets",
) {
  const supabaseUrl = window.__ENV__?.SUPABASE_URL;
  if (!supabaseUrl || !storagePath) return "";
  try {
    const normalizedPath = String(storagePath)
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    return new URL(
      "/storage/v1/object/public/" + bucketName + "/" + normalizedPath,
      supabaseUrl,
    ).toString();
  } catch {
    return "";
  }
}
function resolveTrainingAssetUrl(item) {
  if (!item) return "";
  // Bundled platform modules are the reliable preview source during staging.
  // A storage URL remains the fallback for later externally managed assets.
  if (item.assetPath) return resolveAppAssetUrl(item.assetPath);
  if (item.downloadUrl) return item.downloadUrl;
  if (item.storagePath) {
    const publicUrl = getSupabasePublicTrainingAssetUrl(
      item.storagePath,
      item.bucketName || "training-assets",
    );
    if (publicUrl) return publicUrl;
  }
  return resolveAppAssetUrl(item.assetPath || "");
}
const trainingAssetBlobUrlCache = new Map();
async function getTrainingAssetBlobUrl(item) {
  const sourceUrl = resolveTrainingAssetUrl(item);
  if (!sourceUrl) throw new Error("Missing training asset path.");
  if (/^blob:/i.test(sourceUrl)) return sourceUrl;
  const cacheKey = String(item?.assetPath || item?.filename || sourceUrl);
  if (trainingAssetBlobUrlCache.has(cacheKey))
    return trainingAssetBlobUrlCache.get(cacheKey);
  const response = await fetch(sourceUrl);
  if (!response.ok)
    throw new Error(`Unable to load PDF asset (${response.status}).`);
  const contentType = String(
    response.headers.get("content-type") || "",
  ).toLowerCase();
  if (contentType && !contentType.includes("pdf")) {
    throw new Error(`Unexpected asset response (${contentType}).`);
  }
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  trainingAssetBlobUrlCache.set(cacheKey, blobUrl);
  return blobUrl;
}
async function openTrainingAssetPreview(groupKey, index) {
  const item = state.trainingAssets?.[groupKey]?.[index];
  const sourceUrl = resolveTrainingAssetUrl(item);
  const previewTarget = String(item?.filename || sourceUrl || "").toLowerCase();
  if (!item || !previewTarget.endsWith(".pdf")) return;
  const requestToken = ++trainingPreviewRequestToken;
  state.trainingPreviewOpen = true;
  state.trainingPreviewTitle = item.title || "Training PDF";
  state.trainingPreviewLabel = item.previewLabel || "Training document";
  state.trainingPreviewUrl = sourceUrl;
  state.trainingPreviewLoading = !!sourceUrl;
  state.trainingPreviewError = sourceUrl
    ? ""
    : "Could not load this PDF preview.";
  render();
  if (!sourceUrl) return;
  if (
    !state.trainingPreviewOpen ||
    requestToken !== trainingPreviewRequestToken
  )
    return;
  state.trainingPreviewLoading = false;
  render();
}
function closeTrainingAssetPreview() {
  trainingPreviewRequestToken += 1;
  resetTrainingPdfPreviewCache();
  state.trainingPreviewOpen = false;
  state.trainingPreviewTitle = "";
  state.trainingPreviewLabel = "";
  state.trainingPreviewUrl = "";
  state.trainingPreviewLoading = false;
  state.trainingPreviewError = "";
  render();
}
function downloadTrainingAsset(groupKey, index) {
  const item = state.trainingAssets?.[groupKey]?.[index];
  if (!item) return;
  const url = resolveTrainingAssetUrl(item);
  if (!url) return;
  const link = document.createElement("a");
  link.href = url;
  if (item.filename) link.download = item.filename;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
function trainingPreviewModal() {
  if (!state.trainingPreviewOpen) return "";
  const previewBody = state.trainingPreviewError
    ? `<div class="training-preview-loading is-error">${escapeHtml(state.trainingPreviewError)}</div>`
    : state.trainingPreviewUrl
      ? `        <div class="training-preview-frame-shell">          <div class="training-preview-loading" data-training-preview-loading>Rendering PDF...</div>          <iframe            class="training-preview-frame"            src="${attr(`${state.trainingPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`)}"            title="${attr(state.trainingPreviewTitle || "Training PDF preview")}"             loading="eager"            referrerpolicy="no-referrer"            onload="const shell=this.closest('.training-preview-frame-shell'); const loading=shell?.querySelector('[data-training-preview-loading]'); if (loading) loading.remove();"          ></iframe>        </div>`
      : `<div class="training-preview-loading">Rendering PDF...</div>`;
  return `    <div class="training-preview-modal" role="dialog" aria-modal="true" aria-label="Training PDF preview">      <button class="training-preview-backdrop" type="button" data-action="close-training-preview" aria-label="Close PDF preview"></button>      <section class="training-preview-dialog">        <div class="training-preview-head">          <div class="training-preview-title-block">            <p class="eyebrow">${state.trainingPreviewLabel || "Training document"}</p>            <h2>${state.trainingPreviewTitle}</h2>          </div>          <div class="training-preview-actions">            <button class="btn secondary" type="button" data-action="close-training-preview">Close</button>          </div>        </div>        ${previewBody}      </section>    </div>  `;
}
function resetTrainingPdfPreviewCache() {
  trainingPdfRenderJob += 1;
  const pdfPromise = trainingPdfDocumentPromise;
  trainingPdfDocumentPromise = null;
  trainingPdfDocumentUrl = "";
  if (pdfPromise) {
    pdfPromise.then((pdfDocument) => pdfDocument?.destroy?.()).catch(() => {});
  }
}
async function renderTrainingPdfPreview() {
  return;
}
function queueTrainingPdfPreviewRender() {
  return;
}
function trainingSection(title, items, tone = "default", groupKey = "") {
  const query = state.trainingQuery.trim().toLowerCase();
  const filtered = !query
    ? items.map((item, index) => ({ item, index }))
    : items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item.title.toLowerCase().includes(query));
  return `    <section class="training-group">      <div class="training-group-head">${title}</div>      <div class="training-group-list">        ${
    filtered.length
      ? filtered
          .map(
            ({ item, index }) =>
              `                    <div class="training-row training-row-${tone}">                      <div class="training-row-icon" aria-hidden="true">${trainingRowIcon(item.kind)}</div>                      <div class="training-row-copy">                        <div class="training-row-title">${item.title}</div>                      </div>                      <div class="training-row-actions">                        ${(() => {
                const assetUrl = resolveTrainingAssetUrl(item);
                const previewTarget = String(
                  item?.filename || assetUrl || "",
                ).toLowerCase();
                const canPreviewPdf = Boolean(
                  assetUrl && previewTarget.endsWith(".pdf"),
                );
                if (canPreviewPdf && item.actionSecondary) {
                  return `<button class="training-action training-action-secondary" type="button" data-training-asset-action="view" data-training-group="${groupKey}" data-training-index="${index}">${item.actionPrimary}</button>                               <button class="training-action training-action-primary" type="button" data-training-asset-action="download" data-training-group="${groupKey}" data-training-index="${index}">${item.actionSecondary}</button>`;
                }
                if (assetUrl && item.actionPrimary) {
                  return `<button class="training-action training-action-primary" type="button" data-training-asset-action="primary" data-training-group="${groupKey}" data-training-index="${index}">${item.actionPrimary}</button>`;
                }
                return `<span class="training-action training-action-muted">Coming soon</span>`;
              })()}                      </div>                    </div>                  `,
          )
          .join("")
      : `<div class="training-row training-row-empty"><div class="training-row-copy"><div class="training-row-empty-text">No matching training resources</div></div></div>`
  }      </div>    </section>  `;
}
function trainingScreen() {
  // Keep the sign-in-sheet template and data model available for a later release,
  // but do not surface it in the current Training experience.
  const visibleMandatoryAssets = state.trainingAssets.mandatory.filter(
    (asset) =>
      asset.assetKey !== "employee_training_signin_sheet" &&
      asset.asset_key !== "employee_training_signin_sheet" &&
      !String(asset.title || "").includes("Training Sign-in Sheet"),
  );
  return `
    <main class="training-screen">
      <section class="training-header">
        <div class="training-header-copy">
          <h1>Training &amp; Staff Awareness</h1>
          <p>Download mandatory compliance modules and track internal security video courses.</p>
        </div>
        ${dashboardHeaderControls()}
      </section>
      <div class="training-groups">
        ${trainingSection("MANDATORY STAFF TRAINING", visibleMandatoryAssets, "default", "mandatory")}
        ${trainingSection("SECURITY AWARENESS VIDEOS", state.trainingAssets.videos, "video", "videos")}
        ${trainingSection("ADDITIONAL COMPLIANCE RESOURCES", state.trainingAssets.resources, "default", "resources")}
      </div>
      ${trainingPreviewModal()}
    </main>
  `;
}function hasPendingWispDraft() {
  if (state.wispProject?.status === "draft") return true;
  if (state.builderAttachments.length) return true;
  return Object.keys(initialBuilderDrafts).some((key) => {
    const current = String(state.builderDrafts[key] ?? "").trim();
    const baseline = String(initialBuilderDrafts[key] ?? "").trim();
    return current !== baseline;
  });
}
function hasActiveWispProject() {
  return (
    ["active", "completed"].includes(state.wispProject?.status) ||
    Boolean(state.wispProject?.latest_generated_file)
  );
}
function finalizedWispStatusLabel() {
  return state.wispProject?.status === "active" ? "active" : "completed";
}
function builderStatusTabs() {
  const tabs = [
    { id: "active", label: "Active" },
    { id: "pending", label: "Pending" },
    { id: "completed", label: "Completed" },
    { id: "past", label: "Past Versions" },
  ];
  return `      <nav class="builder-status-tabs" aria-label="Builder status">        ${tabs.map((tab) => `              <button class="builder-status-tab ${state.builderTab === tab.id ? "is-active" : ""}" type="button" data-builder-status-tab="${tab.id}">                ${tab.label}              </button>            `).join("")}      </nav>  `;
}
function builderStatusPanel({ eyebrow, title, body, actions = "" }) {
  return `    <section class="builder-status-panel">      <div class="builder-status-panel-copy">        <p class="builder-status-panel-kicker">${eyebrow}</p>        <h2>${title}</h2>        <p>${body}</p>      </div>      ${actions ? `<div class="builder-status-panel-actions">${actions}</div>` : ""}    </section>  `;
}
function builderHeaderActions() {
  const hasFinalizedWisp = hasActiveWispProject();
  const finalizedStatus = finalizedWispStatusLabel();
  return `    <div class="builder-topbar-actions">      <button class="btn primary builder-create-btn" type="button" data-action="create-wisp" ${hasFinalizedWisp ? 'aria-describedby="finalized-wisp-lock"' : ""}>Create WISP</button>      ${hasFinalizedWisp ? `<span id="finalized-wisp-lock" class="sr-only">Delete the ${finalizedStatus} WISP before creating a new draft.</span>` : ""}    </div>  `;
}
function decodeSimpleEntities(value) {
  return String(value || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
function builderPlainText(value) {
  return decodeSimpleEntities(
    String(value || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " "),
  ).trim();
}
function builderExcerpt(value, limit = 220) {
  const plain = builderPlainText(value);
  if (!plain) return "Not yet customized.";
  if (plain.length <= limit) return plain;
  return `${plain.slice(0, limit).trimEnd()}...`;
}
function repairCommonMojibake(value) {
  return String(value || "")
    .replaceAll(
      "\u00c3\u0192\u00c2\u00a2\u00c3\u00a2\u00e2\u20ac\u0161\u00c2\u00ac\u00c3\u2026\u00e2\u20ac\u0153",
      "?",
    )
    .replaceAll(
      "\u00c3\u0192\u00c2\u00a2\u00c3\u00a2\u00e2\u20ac\u0161\u00c2\u00ac\u00c3\u201a\u00c2\u009d",
      "?",
    )
    .replaceAll(
      "\u00c3\u0192\u00c2\u00a2\u00c3\u00a2\u00e2\u20ac\u0161\u00c2\u00ac\u00c3\u00a2\u00e2\u20ac\u017e\u00c2\u00a2",
      "?",
    );
}
function normalizeGlossaryHtml(value) {
  const repaired = repairCommonMojibake(value);
  return repaired.replace(
    /<p>\s*(?!<strong>)([^<\-]+?)\s+-\s+/g,
    "<p><strong>$1</strong> - ",
  );
}
function normalizeBuilderDraft(key, value) {
  const repaired =
    key === "glossary"
      ? normalizeGlossaryHtml(value)
      : repairCommonMojibake(value);
  return repaired;
}
function normalizeBuilderDraftMap(drafts) {
  return Object.fromEntries(
    Object.entries(drafts || {}).map(([key, value]) => [
      key,
      normalizeBuilderDraft(key, value),
    ]),
  );
}
function renderBuilderResourceSections() {
  return RESOURCE_LINK_SECTIONS.map(
    (section) =>
      `              <section class="builder-doc-block">                <div class="builder-doc-head">                  <div>                    <h3>${escapeHtml(section.title)}</h3>                  </div>                </div>                <div class="builder-doc-body">                  <ul class="builder-reference-list">                    ${section.links.map((link) => `<li><a class="builder-reference-link" href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a></li>`).join("")}                  </ul>                </div>              </section>`,
  ).join("");
}
function getBuilderDraftValue(key, fallback = "") {
  if (Object.prototype.hasOwnProperty.call(state.builderDrafts, key))
    return normalizeBuilderDraft(key, state.builderDrafts[key]);
  if (Object.prototype.hasOwnProperty.call(initialBuilderDrafts, key))
    return normalizeBuilderDraft(key, initialBuilderDrafts[key]);
  return normalizeBuilderDraft(key, fallback);
}
function getBuilderTemplateMergePayload() {
  const firmName = (
    state.form.companyName ||
    state.firmProfile?.name ||
    state.wispProject?.company_name ||
    "Current Fiscal LLC"
  ).trim();
  return {
    templateSource: "design/templates/wisp-template-cleaned.docx",
    generatedAt: new Date().toISOString(),
    firm: {
      companyName: firmName,
      principalOperatingOfficer: (
        state.form.principalOperatingOfficer || ""
      ).trim(),
      dataSecurityCoordinator: (
        state.form.dataSecurityCoordinator || ""
      ).trim(),
      publicInformationOfficer: (
        state.form.publicInformationOfficer || ""
      ).trim(),
      signatureTitle: (state.form.signatureTitle || "").trim(),
    },
    mergeFields: {
      companyName: firmName,
      principalOperatingOfficer: (
        state.form.principalOperatingOfficer || ""
      ).trim(),
      dataSecurityCoordinator: (
        state.form.dataSecurityCoordinator || ""
      ).trim(),
      publicInformationOfficer: (
        state.form.publicInformationOfficer || ""
      ).trim(),
      signatureTitle: (state.form.signatureTitle || "").trim(),
    },
    blocks: {
      objective: getBuilderDraftValue("objective"),
      purpose: getBuilderDraftValue("purpose"),
      scope: getBuilderDraftValue("scope"),
      "officials-dsc": getBuilderDraftValue("officials-dsc"),
      "officials-pio": getBuilderDraftValue("officials-pio"),
      "inside-firm-intro": getBuilderDraftValue("inside-firm-intro"),
      "inside-firm-collection": getBuilderDraftValue("inside-firm-collection"),
      "inside-firm-personnel": getBuilderDraftValue("inside-firm-personnel"),
      "inside-firm-disclosure": getBuilderDraftValue("inside-firm-disclosure"),
      "inside-firm-reportable": getBuilderDraftValue("inside-firm-reportable"),
      "outside-firm-intro": getBuilderDraftValue("outside-firm-intro"),
      "outside-firm-network": getBuilderDraftValue("outside-firm-network"),
      "outside-firm-access": getBuilderDraftValue("outside-firm-access"),
      "outside-firm-exchange": getBuilderDraftValue("outside-firm-exchange"),
      "outside-firm-wifi": getBuilderDraftValue("outside-firm-wifi"),
      "outside-firm-remote": getBuilderDraftValue("outside-firm-remote"),
      "outside-firm-devices": getBuilderDraftValue("outside-firm-devices"),
      "outside-firm-training": getBuilderDraftValue("outside-firm-training"),
      "policies-rules": getBuilderDraftValue("policies-rules"),
      "policies-breach": getBuilderDraftValue("policies-breach"),
      "resources-intro": getBuilderDraftValue("resources-intro"),
      "resource-links": structuredClone(RESOURCE_LINK_SECTIONS),
      glossary: getBuilderDraftValue("glossary"),
    },
    attachments: state.builderAttachments.map((file, index) => ({
      order: index + 1,
      name: file.name,
      sizeLabel: file.sizeLabel,
      type: file.type,
      size: file.size || 0,
    })),
    prototypeSupport: {
      supportedToday: [
        "companyName",
        "dataSecurityCoordinator",
        "publicInformationOfficer",
        "signatureTitle",
        "objective",
        "purpose",
        "scope",
        "officials-dsc",
        "officials-pio",
        "inside-firm-intro",
        "inside-firm-collection",
        "inside-firm-personnel",
        "inside-firm-disclosure",
        "inside-firm-reportable",
        "outside-firm-intro",
        "outside-firm-network",
        "outside-firm-access",
        "outside-firm-exchange",
        "outside-firm-wifi",
        "outside-firm-remote",
        "outside-firm-devices",
        "outside-firm-training",
      ],
      pendingTemplateAlignment: [
        "policies-rules",
        "policies-breach",
        "resources-intro",
        "glossary",
        "attachments",
      ],
    },
  };
}
function downloadBuilderMergePayload() {
  const payload = getBuilderTemplateMergePayload();
  const slug =
    (payload.mergeFields.companyName || "wisp")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "wisp";
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug}-merge-payload.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 250);
}
function resetBuilderPdfPreviewCache() {
  builderPdfRenderJob += 1;
  const pdfPromise = builderPdfDocumentPromise;
  builderPdfDocumentPromise = null;
  builderPdfDocumentUrl = "";
  if (pdfPromise) {
    pdfPromise.then((pdfDocument) => pdfDocument?.destroy?.()).catch(() => {});
  }
}
async function loadBuilderDocxJs() {
  if (!builderDocxJsPromise) {
    builderDocxJsPromise = import(
      "./node_modules/docx-preview/dist/docx-preview.mjs"
    ).catch((error) => {
      builderDocxJsPromise = null;
      throw error;
    });
  }
  return builderDocxJsPromise;
}
async function renderBuilderDocxPreviewTarget(target, renderJob) {
  if (
    !target?.isConnected ||
    renderJob !== builderDocxRenderJob ||
    !state.builderMergeDocxBlob
  )
    return;
  const pageNumber = Number(target.dataset.builderDocxPage || "0");
  if (!pageNumber) return;
  const loading = target.querySelector("[data-builder-docx-loading]");
  const stage = target.querySelector("[data-builder-docx-stage]");
  if (!(stage instanceof HTMLElement)) return;
  try {
    stage.innerHTML = "";
    const docxPreview = await loadBuilderDocxJs();
    if (!target.isConnected || renderJob !== builderDocxRenderJob) return;
    await docxPreview.renderAsync(state.builderMergeDocxBlob, stage, stage, {
      inWrapper: true,
      breakPages: true,
      ignoreLastRenderedPageBreak: false,
      renderHeaders: true,
      renderFooters: true,
      useBase64URL: true,
    });
    if (!target.isConnected || renderJob !== builderDocxRenderJob) return;
    const pages = [...stage.querySelectorAll(".docx-wrapper > section.docx")];
    pages.forEach((page, index) => {
      page.hidden = index !== pageNumber - 1;
      page.classList.toggle("is-active-preview-page", index === pageNumber - 1);
    });
    const nextPageCount = pages.length || 1;
    if (state.builderRenderedPageCount !== nextPageCount) {
      state.builderRenderedPageCount = nextPageCount;
      window.requestAnimationFrame(() => {
        updateBuilderReviewDisplay();
      });
    }
    target.classList.add("is-ready");
    target.classList.remove("is-error");
    if (loading) {
      loading.hidden = true;
      loading.textContent = "";
    }
  } catch (error) {
    console.warn(`DOCX page ${pageNumber} render failed`, error);
    target.classList.remove("is-ready");
    target.classList.add("is-error");
    if (loading) {
      loading.hidden = false;
      loading.textContent = `Couldn't render template page ${pageNumber}.`;
    }
  }
}
async function renderBuilderDocxPreviews() {
  const targets = [...document.querySelectorAll("[data-builder-docx-page]")];
  if (!targets.length || !state.builderMergeDocxBlob) return;
  const renderJob = ++builderDocxRenderJob;
  await Promise.all(
    targets.map((target) => renderBuilderDocxPreviewTarget(target, renderJob)),
  );
}
async function loadBuilderPdfJs() {
  if (!builderPdfJsLibPromise) {
    builderPdfJsLibPromise = (async () => {
      const moduleCandidates = [
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/legacy/build/pdf.min.mjs",
        resolveAppAssetUrl("node_modules/pdfjs-dist/legacy/build/pdf.mjs"),
        new URL(
          "./node_modules/pdfjs-dist/legacy/build/pdf.mjs",
          window.location.href,
        ).toString(),
      ];
      const workerCandidates = [
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/legacy/build/pdf.worker.min.mjs",
        resolveAppAssetUrl(
          "node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs",
        ),
        new URL(
          "./node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs",
          window.location.href,
        ).toString(),
      ];
      let lastError = null;
      for (const candidate of [...new Set(moduleCandidates)]) {
        try {
          const pdfjsLib = await import(candidate);
          if (window.location.protocol === "file:") {
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerCandidates[0];
          } else {
            let workerSet = false;
            for (const wc of workerCandidates) {
              try {
                pdfjsLib.GlobalWorkerOptions.workerSrc = wc;
                workerSet = true;
                break;
              } catch {
                /* try next */
              }
            }
            if (!workerSet)
              pdfjsLib.GlobalWorkerOptions.workerSrc = workerCandidates[0];
          }
          return pdfjsLib;
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError || new Error("Unable to load the PDF preview renderer.");
    })().catch((error) => {
      builderPdfJsLibPromise = null;
      throw error;
    });
  }
  return builderPdfJsLibPromise;
}
async function getBuilderPdfDocument() {
  if (!state.builderMergePdfUrl || !state.builderMergePdfBlob) return null;
  if (
    builderPdfDocumentPromise &&
    builderPdfDocumentUrl === state.builderMergePdfUrl
  )
    return builderPdfDocumentPromise;
  resetBuilderPdfPreviewCache();
  builderPdfDocumentUrl = state.builderMergePdfUrl;
  builderPdfDocumentPromise = (async () => {
    const pdfjsLib = await loadBuilderPdfJs();
    const pdfBytes = new Uint8Array(
      await state.builderMergePdfBlob.arrayBuffer(),
    );
    const loadingTask = pdfjsLib.getDocument({
      data: pdfBytes,
      disableWorker: true,
      useSystemFonts: false,
      isEvalSupported: false,
      cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/cmaps/",
      cMapPacked: true,
    });
    return loadingTask.promise;
  })().catch((error) => {
    builderPdfDocumentPromise = null;
    throw error;
  });
  return builderPdfDocumentPromise;
}
async function renderBuilderPdfPageTarget(target, pdfDocument, renderJob) {
  if (!target?.isConnected || renderJob !== builderPdfRenderJob) return;
  const pageNumber = Number(target.dataset.builderPdfPage || "0");
  if (!pageNumber) return;
  const canvas = target.querySelector("canvas");
  const loading = target.querySelector("[data-builder-pdf-loading]");
  if (!(canvas instanceof HTMLCanvasElement)) return;
  try {
    const pdfPage = await pdfDocument.getPage(pageNumber);
    if (!target.isConnected || renderJob !== builderPdfRenderJob) return;
    const baseViewport = pdfPage.getViewport({ scale: 1 });
    const targetWidth = Math.max(
      1,
      Math.floor(target.clientWidth || baseViewport.width),
    );
    const scale = targetWidth / baseViewport.width;
    const viewport = pdfPage.getViewport({ scale });
    const outputScale = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Canvas context unavailable");
    context.setTransform(outputScale, 0, 0, outputScale, 0, 0);
    context.imageSmoothingEnabled = true;
    await pdfPage.render({ canvasContext: context, viewport }).promise;
    if (!target.isConnected || renderJob !== builderPdfRenderJob) return;
    target.classList.add("is-ready");
    target.classList.remove("is-error");
    if (loading) {
      loading.hidden = true;
      loading.textContent = "";
    }
  } catch (error) {
    console.warn(`PDF page ${pageNumber} render failed`, error);
    target.classList.remove("is-ready");
    target.classList.add("is-error");
    if (loading) {
      loading.hidden = false;
      loading.textContent = `Couldn't render PDF page ${pageNumber}.`;
    }
  }
}
async function renderBuilderPdfPreviews() {
  const targets = [...document.querySelectorAll("[data-builder-pdf-page]")];
  if (!targets.length || !state.builderMergePdfUrl) return;
  const renderJob = ++builderPdfRenderJob;
  try {
    const pdfDocument = await getBuilderPdfDocument();
    if (!pdfDocument || renderJob !== builderPdfRenderJob) return;
    await Promise.all(
      targets.map((target) =>
        renderBuilderPdfPageTarget(target, pdfDocument, renderJob),
      ),
    );
  } catch (error) {
    console.warn("PDF preview render failed", error);
    targets.forEach((target) => {
      target.classList.remove("is-ready");
      target.classList.add("is-error");
      const loading = target.querySelector("[data-builder-pdf-loading]");
      if (loading) {
        loading.hidden = false;
        loading.textContent = "Couldn't render this PDF preview.";
      }
    });
  }
}
function queueBuilderPdfPreviewRender() {
  if (state.builderMergePdfUrl) return; // native <object> embed handles it
  if (
    !state.builderMergeDocxBlob ||
    !document.querySelector("[data-builder-docx-page]")
  )
    return;
  window.requestAnimationFrame(() => {
    renderBuilderDocxPreviews().catch((error) =>
      console.warn("DOCX preview render failed", error?.message || ""),
    );
  });
}
function cleanupBuilderMergeDownloadUrl() {
  resetBuilderPdfPreviewCache();
  builderDocxRenderJob += 1;
  state.builderMergeDocxBlob = null;
  state.builderMergePdfBlob = null;
  state.builderRenderedPageCount = 0;
  if (state.builderMergeDownloadUrl) {
    URL.revokeObjectURL(state.builderMergeDownloadUrl);
    state.builderMergeDownloadUrl = "";
  }
  if (state.builderMergePdfUrl) {
    URL.revokeObjectURL(state.builderMergePdfUrl);
    state.builderMergePdfUrl = "";
  }
}
function base64ToBlob(base64, mimeType) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1)
    bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type: mimeType });
}
async function appendBuilderAttachmentsToPdf(wispPdfBlob) {
  const attachments = state.builderAttachments || [];
  if (!attachments.length) return { blob: wispPdfBlob, attachmentPageCount: 0 };
  await Promise.all(
    attachments.map(async (attachment) => {
      if (
        !attachment.base64Promise &&
        !attachment.base64 &&
        attachment.downloadUrl
      ) {
        attachment.base64Promise = fetch(attachment.downloadUrl)
          .then((response) => {
            if (!response.ok)
              throw new Error(
                'Unable to download "' + attachment.name + '" from storage.',
              );
            return response.blob();
          })
          .then(readFileAsBase64);
      }
      if (attachment.base64Promise)
        attachment.base64 = await attachment.base64Promise;
      if (!attachment.base64)
        throw new Error(
          'Attachment "' +
            attachment.name +
            '" is unavailable. Refresh the attachments tab and try again.',
        );
    }),
  );
  const { PDFDocument } = await import(
    "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"
  );
  const combinedPdf = await PDFDocument.load(await wispPdfBlob.arrayBuffer());
  let attachmentPageCount = 0;
  for (const attachment of attachments) {
    const source = String(attachment.base64);
    const encoded = source.includes(",")
      ? source.slice(source.indexOf(",") + 1)
      : source;
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (character) =>
      character.charCodeAt(0),
    );
    let attachmentPdf;
    try {
      attachmentPdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
    } catch {
      throw new Error(
        `Could not append "${attachment.name}". Use a readable, non-password-protected PDF.`,
      );
    }
    const pages = await combinedPdf.copyPages(
      attachmentPdf,
      attachmentPdf.getPageIndices(),
    );
    pages.forEach((page) => combinedPdf.addPage(page));
    attachmentPageCount += pages.length;
  }
  return {
    blob: new Blob([await combinedPdf.save()], { type: "application/pdf" }),
    attachmentPageCount,
    totalPageCount: combinedPdf.getPageCount(),
  };
}
function invalidateBuilderMergedPdfForAttachments() {
  cleanupBuilderMergeDownloadUrl();
  state.builderMergeStatus = "idle";
  state.builderMergeMessage =
    "Attachments changed. Generate a new PDF review copy to include them.";
  state.builderMergeFileName = "";
  state.builderMergePreviewPages = [];
}
async function buildHostedWispPdf(signatures = []) {
  const { PDFDocument, StandardFonts, rgb } = await import(
    "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"
  );
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.04, 0.16, 0.23);
  const green = rgb(0.02, 0.48, 0.31);
  const muted = rgb(0.33, 0.41, 0.47);
  const paper = { width: 612, height: 792, margin: 54, bottom: 58 };
  const firmName = (state.firmProfile?.name || state.form?.companyName || "Your firm").trim();
  const title = state.wispProject?.title || "Written Information Security Plan";
  const sectionRows = getBuilderReviewSections();
  const paragraphLines = (text, font = regular, size = 10.5) =>
    wrapPdfText(htmlToPlainText(text), font, size, paper.width - paper.margin * 2);
  const addHeader = (page, pageNumber) => {
    page.drawRectangle({ x: 0, y: paper.height - 26, width: paper.width, height: 26, color: green });
    page.drawText(firmName, { x: paper.margin, y: paper.height - 17, size: 8.5, font: bold, color: rgb(1, 1, 1) });
    page.drawText(`WISP  |  ${pageNumber}`, { x: paper.width - paper.margin - 62, y: paper.height - 17, size: 8.5, font: bold, color: rgb(1, 1, 1) });
  };
  const addFooter = (page) => page.drawText("Confidential compliance record", { x: paper.margin, y: 28, size: 8, font: regular, color: muted });
  let page;
  let cursor;
  let pageNumber = 0;
  const newPage = () => {
    page = pdf.addPage([paper.width, paper.height]);
    pageNumber += 1;
    addHeader(page, pageNumber);
    addFooter(page);
    cursor = paper.height - 58;
  };
  newPage();
  page.drawText(title, { x: paper.margin, y: cursor - 60, size: 27, font: bold, color: navy, maxWidth: paper.width - paper.margin * 2 });
  page.drawText(firmName, { x: paper.margin, y: cursor - 100, size: 16, font: regular, color: green });
  page.drawText(`Prepared ${formatDashboardDate(new Date().toISOString())}`, { x: paper.margin, y: cursor - 124, size: 10, font: regular, color: muted });
  cursor -= 164;
  for (const section of sectionRows) {
    const body = [section.summary, ...(section.details || []).map((detail) => `${detail.label}: ${detail.value}`)].filter(Boolean).join("\n\n");
    const lines = paragraphLines(body);
    const required = 34 + lines.length * 14;
    if (cursor - required < paper.bottom) newPage();
    page.drawText(section.title, { x: paper.margin, y: cursor, size: 14, font: bold, color: navy });
    cursor -= 20;
    for (const line of lines) {
      if (cursor < paper.bottom) newPage();
      page.drawText(line || " ", { x: paper.margin, y: cursor, size: 10.5, font: regular, color: navy });
      cursor -= 14;
    }
    cursor -= 12;
  }
  if (signatures.length) {
    if (cursor < paper.bottom + 110) newPage();
    page.drawText("Signatures", { x: paper.margin, y: cursor, size: 16, font: bold, color: navy });
    cursor -= 30;
    for (const signature of signatures) {
      if (cursor < paper.bottom + 76) newPage();
      page.drawLine({ start: { x: paper.margin, y: cursor }, end: { x: paper.margin + 270, y: cursor }, thickness: 0.75, color: muted });
      const signer = String(signature.signer_name || signature.signerName || "Authorized signer");
      const role = String(signature.signer_role || signature.signerRole || "");
      const date = signature.signed_at ? formatDashboardDate(signature.signed_at) : formatDashboardDate(new Date().toISOString());
      const signatureData = String(signature.signature_data || signature.signatureData || "");
      try {
        if (signatureData.startsWith("data:image/")) {
          const image = await pdf.embedPng(signatureData);
          const dimensions = image.scaleToFit(155, 34);
          page.drawImage(image, { x: paper.margin + 8, y: cursor + 4, width: dimensions.width, height: dimensions.height });
        } else if (signatureData) {
          page.drawText(signatureData.slice(0, 72), { x: paper.margin + 8, y: cursor + 9, size: 19, font: signatureFont, color: navy, maxWidth: 250 });
        }
      } catch (error) {
        console.warn("Unable to render a stored WISP signature in the hosted PDF", error);
      }
      page.drawText(signer, { x: paper.margin, y: cursor - 16, size: 10, font: bold, color: navy });
      page.drawText(`${role}${role ? "  ·  " : ""}${date}`, { x: paper.margin, y: cursor - 30, size: 9, font: regular, color: muted });
      cursor -= 64;
    }
  }
  const fileStem = firmName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "wisp";
  return { blob: new Blob([await pdf.save()], { type: "application/pdf" }), fileName: `${fileStem}-wisp${signatures.length ? "-signed" : ""}.pdf` };
}
async function requestBuilderMergedDocx() {
  const mergePreviewUrl = getMergePreviewUrl();
  if (!mergePreviewUrl) {
    state.builderMergeStatus = "unavailable";
    state.builderMergeMessage =
      "The branded WISP PDF renderer is not configured yet.";
    render();
    return;
  }
  const payload = getBuilderTemplateMergePayload();
  cleanupBuilderMergeDownloadUrl();
  state.builderMergeStatus = "generating";
  state.builderMergeMessage = "Generating your WISP PDF preview...";
  state.builderMergeFileName = "";
  state.builderMergePreviewPages = [];
  state.builderRenderedPageCount = 0;
  render();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    const response = await fetch(mergePreviewUrl, {
      method: "POST",
      headers: await getMergeRequestHeaders(),
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) {
      let message = `Merge service returned ${response.status}`;
      try {
        const errorPayload = await response.json();
        if (errorPayload?.error) message = errorPayload.error;
      } catch {}
      throw new Error(message);
    }
    const result = await response.json();
    state.builderMergeFileName = result?.fileName || "wisp-merged.docx";
    if (result?.docxBase64) {
      const blob = base64ToBlob(
        result.docxBase64,
        result?.mimeType ||
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
      state.builderMergeDocxBlob = blob;
      state.builderMergeDownloadUrl = URL.createObjectURL(blob);
    }
    if (result?.pdfBase64) {
      const wispPdfBlob = base64ToBlob(result.pdfBase64, "application/pdf");
      const mergedPdf = await appendBuilderAttachmentsToPdf(wispPdfBlob);
      state.builderMergePdfBlob = mergedPdf.blob;
      state.builderMergePdfUrl = URL.createObjectURL(mergedPdf.blob);
      state.builderMergePdfFileName = result?.pdfFileName || "wisp-preview.pdf";
      state.builderRenderedPageCount = mergedPdf.totalPageCount;
      if (mergedPdf.attachmentPageCount)
        state.builderMergeMessage = `WISP PDF preview is ready with ${mergedPdf.attachmentPageCount} appended attachment page${mergedPdf.attachmentPageCount === 1 ? "" : "s"}.`;
    } else {
      throw new Error(
        "The branded WISP PDF preview was not returned by the merge service.",
      );
    }
    state.builderMergePreviewPages = Array.isArray(result?.pages)
      ? result.pages
      : [];
    state.builderMergeStatus = "ready";
    if (!state.builderMergeMessage.includes("appended attachment")) {
      state.builderMergeMessage = "WISP PDF preview is ready.";
    }
  } catch (error) {
    console.warn(
      "[requestBuilderMergedDocx] merge unavailable",
      error?.message || error,
    );
    state.builderMergeStatus = "unavailable";
    state.builderMergeMessage =
      error?.message || "The branded WISP PDF renderer is unavailable.";
    state.builderMergeFileName = "";
    state.builderMergePreviewPages = [];
    state.builderRenderedPageCount = 0;
    state.builderMergePdfUrl = null;
    state.builderMergePdfBlob = null;
    state.builderMergeDocxBlob = null;
    state.builderMergeDownloadUrl = null;
  }
  render();
}
function downloadBuilderMergedDocx() {
  const href = state.builderMergePdfUrl || state.builderMergeDownloadUrl;
  if (!href) return;
  const link = document.createElement("a");
  link.href = href;
  link.download = state.builderMergePdfUrl
    ? state.builderMergePdfFileName || "wisp-preview.pdf"
    : state.builderMergeFileName || "wisp-merged.docx";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
function downloadBlobFile(href, fileName) {
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
function downloadStoredWispFile(record) {
  if (!record?.downloadUrl) return;
  const link = document.createElement("a");
  link.href = record.downloadUrl;
  link.download = record.fileName || "wisp-file";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
async function finalizeBuilderWisp() {
  if (!state.builderMergePdfBlob) {
    await requestBuilderMergedDocx();
  }
  const blob = state.builderMergePdfBlob;
  const fileName = state.builderMergePdfFileName || "wisp-preview.pdf";
  const contentType = "application/pdf";
  if (!blob) {
    throw new Error("Generate the WISP PDF review copy before finalizing.");
  }
  if (!supabaseBackendLoaded) {
    throw new Error(
      "Supabase backend did not load. Open the app through http://127.0.0.1:4173/, not as a file:/// URL.",
    );
  }
  const result = await finalizeWispBuild(
    { blob, fileName, contentType },
    {
      ...getBuilderDraftMeta({
        status: "completed",
        title: state.wispProject?.title || "Written Information Security Plan",
      }),
      builderDrafts: state.builderDrafts,
    },
  );
  if (!result?.project)
    throw new Error("Supabase did not confirm the finalized WISP.");
  state.wispProject = result.project;
  state.wispVersions = result.versions || [];
  if (result.project.dashboard_facts)
    state.dashboardData = result.project.dashboard_facts;
  const completedEntry = {
    id: `completed-${Date.now()}`,
    title: state.wispProject?.title || "Written Information Security Plan",
    firmName: state.firmProfile?.name || state.form.companyName || "Your firm",
    fileName,
    downloadUrl: URL.createObjectURL(blob),
    updatedAt: new Date().toISOString(),
    isLatest: true,
    local: true,
  };
  if (state.wispVersions && state.wispVersions.length) {
    state.wispVersions.forEach((version) => {
      const exists = state.completedWISPs.find(
        (w) => w.fileName === (version.fileName || version.title),
      );
      if (!exists) {
        state.completedWISPs.push({
          id: `completed-archived-${version.fileName || Math.random().toString(36).slice(2, 8)}`,
          title: version.title || version.fileName || "Archived version",
          firmName:
            state.firmProfile?.name || state.form.companyName || "Your firm",
          fileName: version.fileName || "wisp-version.pdf",
          downloadUrl: version.downloadUrl,
          updatedAt: version.updated_at,
          isLatest: false,
          local: false,
        });
      }
    });
  }
  const latestIndex = state.completedWISPs.findIndex((w) => w.isLatest);
  if (latestIndex >= 0) state.completedWISPs[latestIndex].isLatest = false;
  state.completedWISPs.unshift(completedEntry);
  setState({
    builderTab: "completed",
    builderResumeEditing: false,
    builderLaunchAnimation: false,
    builderReviewLoading: false,
    builderFinalizeBusy: false,
    builderReviewOpen: false,
    builderReviewExpanded: false,
    builderReviewPage: 0,
    builderSidebarOpen: false,
  });
  showToast("WISP finalized", "success");
}
function completedWispSignatureRevisionKey() {
  const signatures = Array.isArray(state.wispProject?.signatures)
    ? state.wispProject.signatures
    : [];
  const revision = signatures
    .map(
      (signature) =>
        String(signature.id || signature.signer_role || "") +
        ":" +
        String(signature.signed_at || signature.updated_at || ""),
    )
    .join("|");
  return (
    "easywisp-signed-layout-v2:" +
    String(state.wispProject?.id || "unknown") +
    ":" +
    revision
  );
}
async function openCompletedWispPreview() {
  if (state.builderSigningPdfBusy) {
    showToast("The signed PDF is still being updated. Please wait a moment.", "info");
    return;
  }
  const file = state.wispProject?.latest_generated_file;
  if (!file?.downloadUrl) {
    showToast("The finalized PDF is not available yet.", "error");
    return;
  }
  const signatures = Array.isArray(state.wispProject?.signatures)
    ? state.wispProject.signatures
    : [];
  const revisionKey = completedWispSignatureRevisionKey();
  if (signatures.length && localStorage.getItem(revisionKey) !== "ready") {
    state.builderSigningPdfBusy = true;
    render();
    try {
      const signedResult = await rebuildCompletedWispSignaturePdf(signatures);
      if (signedResult?.project)
        state.wispProject = { ...signedResult.project, signatures };
      state.wispVersions = signedResult?.versions || state.wispVersions;
      localStorage.setItem(revisionKey, "ready");
    } catch (error) {
      console.warn("Signed PDF layout refresh failed", error);
      showToast(
        error?.message || "The signed PDF could not be refreshed right now.",
        "error",
      );
      return;
    } finally {
      state.builderSigningPdfBusy = false;
      render();
    }
  }
  cleanupBuilderMergeDownloadUrl();
  state.builderMergePdfUrl =
    state.wispProject?.latest_generated_file?.downloadUrl || file.downloadUrl;
  state.builderMergePdfFileName =
    state.wispProject?.latest_generated_file?.fileName ||
    file.fileName ||
    "completed-wisp.pdf";
  state.builderMergeStatus = "ready";
  state.builderMergeMessage = "Completed WISP preview";
  state.builderRenderedPageCount = 1;
  setState({
    builderReviewLoading: false,
    builderReviewOpen: false,
    builderReviewExpanded: true,
    builderReviewPage: 0,
    builderSidebarOpen: false,
  });
}
async function activateCompletedWisp() {
  const projectId = state.wispProject?.id;
  if (!projectId) return;
  try {
    const project = await activateWispProject(projectId);
    state.wispProject = project;
    setState({ builderTab: "active", builderResumeEditing: false });
    showToast("WISP moved to Active.", "success");
  } catch (error) {
    showToast(error?.message || "This WISP cannot be moved to Active yet.", "error");
  }
}
async function deleteCompletedWisp() {
  const project = state.wispProject;
  if (!project?.id) return;
  const statusLabel = state.builderTab === "active" ? "active" : "completed";
  if (
    !window.confirm(
      `Delete this ${statusLabel} WISP and all of its stored attachments? This cannot be undone.`,
    )
  )
    return;
  await deleteWispProject(project);
  try {
    localStorage.removeItem(LOCAL_WISP_DRAFT_KEY);
  } catch {}
  cleanupBuilderMergeDownloadUrl();
  state.wispProject = null;
  state.wispVersions = [];
  state.completedWISPs = [];
  state.builderAttachments = [];
  state.builderDrafts = normalizeBuilderDraftMap(
    structuredClone(initialBuilderDrafts),
  );
  setState({
    builderTab: "pending",
    builderResumeEditing: false,
    builderLaunchAnimation: false,
    builderReviewLoading: false,
    builderReviewOpen: false,
    builderReviewPage: 0,
  });
  showToast(
    `${statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)} WISP deleted. You can create a new draft.`,
    "success",
  );
}
function getBuilderTemplateMergeStats() {
  const payload = getBuilderTemplateMergePayload();
  const supportedToday = payload.prototypeSupport?.supportedToday || [];
  const pendingTemplateAlignment =
    payload.prototypeSupport?.pendingTemplateAlignment || [];
  const supportedFilled = supportedToday.filter((key) => {
    if (Object.prototype.hasOwnProperty.call(payload.mergeFields, key))
      return Boolean(payload.mergeFields[key]);
    if (Object.prototype.hasOwnProperty.call(payload.blocks, key))
      return Boolean(builderPlainText(payload.blocks[key]));
    return false;
  }).length;
  const pendingFilled = pendingTemplateAlignment.filter((key) => {
    if (key === "attachments") return payload.attachments.length > 0;
    if (Object.prototype.hasOwnProperty.call(payload.blocks, key))
      return Boolean(builderPlainText(payload.blocks[key]));
    return false;
  }).length;
  return {
    supportedFilled,
    supportedTotal: supportedToday.length,
    pendingFilled,
    pendingTotal: pendingTemplateAlignment.length,
    attachmentCount: payload.attachments.length,
    templateSource: payload.templateSource,
  };
}
function renderBuilderMergeStatusCard() {
  const stats = getBuilderTemplateMergeStats();
  const statusLabel =
    state.builderMergeStatus === "ready"
      ? `Merged artifact ready: ${escapeHtml(state.builderMergeFileName || "wisp-merged.docx")}`
      : state.builderMergeStatus === "generating"
        ? "Local merge service is generating the DOCX..."
        : state.builderMergeStatus === "unavailable"
          ? escapeHtml(
              state.builderMergeMessage || "Local merge service unavailable.",
            )
          : "Live builder data is mapped and ready for DOCX generation.";
  const actionButton =
    state.builderMergeStatus === "ready"
      ? `<button class="btn secondary" type="button" data-action="download-builder-merged-docx">Download merged DOCX</button>`
      : `<button class="btn secondary" type="button" data-action="generate-builder-merged-docx">Generate merged DOCX</button>`;
  return `    <section class="builder-review-merge-card">      <div>        <p class="eyebrow">Template merge status</p>        <h3>IRS-template pipeline</h3>        <p>${statusLabel}</p>      </div>      <div class="builder-review-merge-stats">        <span>${stats.supportedFilled}/${stats.supportedTotal} supported blocks populated</span>        <span>${stats.pendingFilled}/${stats.pendingTotal} pending blocks populated</span>        <span>${stats.attachmentCount} attachments queued</span>      </div>      <div class="builder-review-merge-actions">        ${actionButton}        <button class="btn ghost small" type="button" data-action="download-builder-merge-payload">Export merge payload</button>      </div>      <p class="builder-review-merge-source">Template source: ${escapeHtml(stats.templateSource)} ? Local service: http://127.0.0.1:8766</p>    </section>  `;
}
function getBuilderReviewSections() {
  const firmName = (state.form.companyName || "Current Fiscal LLC").trim();
  const principalOfficer = (
    state.form.principalOperatingOfficer || "John Miller"
  ).trim();
  const dataCoordinator = (
    state.form.dataSecurityCoordinator || "Sarah Chen"
  ).trim();
  const publicOfficer = (
    state.form.publicInformationOfficer || "Melissa Grant"
  ).trim();
  const read = (key, fallback = "") =>
    state.builderDrafts[key] || initialBuilderDrafts[key] || fallback;
  return [
    {
      title: "Firm Details & Responsible Roles",
      kicker: "Required setup",
      summary: `Draft anchored to ${firmName} with ${principalOfficer}, ${dataCoordinator}, and ${publicOfficer} mapped into the key WISP roles.`,
      details: [
        { label: "Firm name", value: firmName },
        { label: "Principal operating officer", value: principalOfficer },
        { label: "Data security coordinator", value: dataCoordinator },
        { label: "Public information officer", value: publicOfficer },
      ],
    },
    {
      title: "Objective",
      kicker: "Core statement",
      summary: builderExcerpt(read("objective")),
      details: [
        {
          label: "Draft language",
          value: builderExcerpt(read("objective"), 320),
        },
      ],
    },
    {
      title: "Purpose & Scope",
      kicker: "Policy frame",
      summary: builderExcerpt(read("purpose")),
      details: [
        { label: "Purpose", value: builderExcerpt(read("purpose"), 220) },
        { label: "Scope", value: builderExcerpt(read("scope"), 220) },
      ],
    },
    {
      title: "Officials",
      kicker: "Named accountability",
      summary:
        "Leadership responsibilities are assigned across security coordination and public information handling.",
      details: [
        {
          label: dataCoordinator,
          value: builderExcerpt(read("officials-dsc"), 180),
        },
        {
          label: publicOfficer,
          value: builderExcerpt(read("officials-pio"), 180),
        },
      ],
    },
    {
      title: "Inside the Firm",
      kicker: "Internal safeguards",
      summary: builderExcerpt(read("inside-firm-intro")),
      details: [
        {
          label: "Collection & handling",
          value: builderExcerpt(read("inside-firm-collection"), 160),
        },
        {
          label: "Personnel controls",
          value: builderExcerpt(read("inside-firm-personnel"), 160),
        },
        {
          label: "Internal disclosure",
          value: builderExcerpt(read("inside-firm-disclosure"), 160),
        },
      ],
    },
    {
      title: "Outside the Firm",
      kicker: "External exposure",
      summary: builderExcerpt(read("outside-firm-intro")),
      details: [
        {
          label: "Network security",
          value: builderExcerpt(read("outside-firm-network"), 160),
        },
        {
          label: "Remote access",
          value: builderExcerpt(read("outside-firm-access"), 160),
        },
        {
          label: "Devices & training",
          value: builderExcerpt(read("outside-firm-devices"), 160),
        },
      ],
    },
    {
      title: "Policies & Resources",
      kicker: "Operational controls",
      summary: builderExcerpt(read("policies-rules")),
      details: [
        {
          label: "Rules & standards",
          value: builderExcerpt(read("policies-rules"), 160),
        },
        {
          label: "Breach response",
          value: builderExcerpt(read("policies-breach"), 160),
        },
        {
          label: "Resources",
          value: builderExcerpt(read("resources-intro"), 160),
        },
      ],
    },
    {
      title: "Glossary",
      kicker: "Reference language",
      summary: builderExcerpt(read("glossary")),
      details: [
        {
          label: "Glossary excerpt",
          value: builderExcerpt(read("glossary"), 260),
        },
      ],
    },
  ];
}
function getBuilderMergedTemplatePages() {
  const mergedPages = Array.isArray(state.builderMergePreviewPages)
    ? state.builderMergePreviewPages
    : [];
  if (
    !state.builderMergeDocxBlob &&
    !state.builderMergePdfUrl &&
    !mergedPages.length
  )
    return [];
  const totalPages = Math.max(
    state.builderRenderedPageCount || 0,
    mergedPages.length || 0,
    state.builderMergeDocxBlob ? 1 : 0,
  );
  return Array.from({ length: totalPages }, (_, index) => {
    const previewPage = mergedPages[index] || {};
    return {
      type: "docx-preview",
      title:
        previewPage.title || (index === 0 ? "Cover page" : `Page ${index + 1}`),
      isCover: previewPage.isCover ?? index === 0,
      layout: previewPage.layout || "",
      blocks: Array.isArray(previewPage.blocks) ? previewPage.blocks : [],
    };
  });
}
function getBuilderDraftReviewPages() {
  const mergedPages = getBuilderMergedTemplatePages(); // The PDF already contains attachment pages, so do not render a second attachment card for each file.
  if (mergedPages.length) return mergedPages;
  const sections = getBuilderReviewSections();
  const firmName = (state.form.companyName || "Current Fiscal LLC").trim();
  const pages = [
    {
      type: "cover",
      title: "Written Information Security Plan",
      firmName,
      updatedLabel: formatDashboardDate(
        state.wispProject?.updated_at || new Date().toISOString(),
      ),
      attachmentCount: state.builderAttachments.length,
    },
  ];
  for (let index = 0; index < sections.length; index += 3) {
    pages.push({
      type: "sections",
      sections: sections.slice(index, index + 3),
    });
  }
  state.builderAttachments.forEach((file) => {
    const blobUrl = attachmentBase64ToUrl(file);
    pages.push({
      type: "attachment-file",
      name: file.name,
      sizeLabel: file.sizeLabel,
      blobUrl,
    });
  });
  return pages;
}
function attachmentBase64ToUrl(file) {
  if (!file?.base64) return null;
  try {
    const match = file.base64.match(/^data:([^;]+);base64,(.*)$/);
    if (!match) return null;
    const binary = atob(match[2]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: file.type || "application/pdf" });
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}
async function downloadBuilderReviewCopy() {
  if (!state.builderMergePdfUrl) {
    await requestBuilderMergedDocx();
  }
  if (state.builderMergePdfUrl) {
    downloadBlobFile(
      state.builderMergePdfUrl,
      state.builderMergePdfFileName || "wisp-preview.pdf",
    );
    return;
  }
  throw new Error("Unable to generate the WISP review PDF right now.");
}
function renderBuilderReviewPage(
  page,
  pageNumber,
  totalPages,
  modifierClass = "",
) {
  if (page.type === "docx-preview") {
    if (state.builderMergePdfUrl) {
      return `        <article class="builder-review-paper builder-review-paper-pdf ${modifierClass}">          <iframe class="builder-review-pdf-object" src="${attr(state.builderMergePdfUrl)}#view=FitH&toolbar=0&navpanes=0" type="application/pdf" aria-label="WISP PDF preview"></iframe>        </article>      `;
    }
    const layoutClass = page.layout
      ? `builder-review-paper-${String(page.layout)
          .replace(/[^a-z0-9-]/gi, "-")
          .toLowerCase()}`
      : "";
    let html = "";
    let listItems = [];
    let activeListType = "ul";
    const flushList = () => {
      if (!listItems.length) return;
      const tag = activeListType === "ol" ? "ol" : "ul";
      const listClass =
        activeListType === "ol"
          ? "builder-review-docx-list is-ordered"
          : "builder-review-docx-list";
      html += `<${tag} class="${listClass}">${listItems.join("")}</${tag}>`;
      listItems = [];
      activeListType = "ul";
    };
    for (const block of page.blocks || []) {
      const text = escapeHtml(block.text || "");
      if (block.kind === "list") {
        const blockListType = block.listType === "ol" ? "ol" : "ul";
        if (listItems.length && activeListType !== blockListType) flushList();
        activeListType = blockListType;
        listItems.push(`<li>${text}</li>`);
        continue;
      }
      flushList();
      if (block.kind === "cover-title")
        html += `<h1 class="builder-review-docx-cover-title">${text}</h1>`;
      else if (block.kind === "cover-bridge")
        html += `<p class="builder-review-docx-cover-bridge">${text}</p>`;
      else if (block.kind === "cover-firm")
        html += `<p class="builder-review-docx-cover-firm">${text}</p>`;
      else if (block.kind === "cover-note")
        html += `<p class="builder-review-docx-cover-note">${text}</p>`;
      else if (block.kind === "cover-footer")
        html += `<p class="builder-review-docx-cover-footer">${text}</p>`;
      else if (block.kind === "section-heading")
        html += `<h2 class="builder-review-docx-heading">${text}</h2>`;
      else if (block.kind === "subheading")
        html += `<h3 class="builder-review-docx-subheading">${text}</h3>`;
      else if (block.kind === "signature")
        html += `<p class="builder-review-docx-signature">${text}</p>`;
      else if (block.kind === "centered")
        html += `<p class="builder-review-docx-centered">${text}</p>`;
      else html += `<p class="builder-review-docx-paragraph">${text}</p>`;
    }
    flushList();
    const footer =
      layoutClass.includes("irs-template-body") ||
      layoutClass.includes("irs-attachment-body") ||
      layoutClass.includes("irs-reference-body")
        ? `<div class="builder-review-docx-page-number">${pageNumber - 1}</div>`
        : "";
    return `      <article class="builder-review-paper builder-review-paper-docx ${layoutClass} ${modifierClass}">        <div class="builder-review-docx-sheet ${page.isCover ? "is-cover" : ""} ${layoutClass}">          ${html}          ${footer}        </div>      </article>    `;
  }
  if (page.type === "cover") {
    return `      <article class="builder-review-paper builder-review-paper-cover ${modifierClass}">        <div class="builder-review-paper-band"></div>        <div class="builder-review-paper-body">          <p class="builder-review-paper-kicker">Draft review copy</p>          <h2>${escapeHtml(page.title)}</h2>          <p class="builder-review-cover-firm">Prepared for ${escapeHtml(page.firmName)}</p>          <div class="builder-review-cover-meta">            <span>Updated ${escapeHtml(page.updatedLabel)}</span>            <span>${String(page.attachmentCount || 0).padStart(2, "0")} attachments</span>            <span>Page ${pageNumber} of ${totalPages}</span>          </div>        </div>      </article>    `;
  }
  if (page.type === "attachment-file") {
    return `      <article class="builder-review-paper ${modifierClass}">        <div class="builder-review-page-header" style="padding: 14px 24px 0">          <div><p class="builder-review-paper-kicker">Supporting document</p><h2>${escapeHtml(page.name)}</h2></div>          <span class="builder-review-page-counter" style="padding: 14px 24px 0 0">${escapeHtml(page.sizeLabel)}</span>        </div>        ${page.blobUrl ? `<iframe class="builder-review-attachment-iframe" src="${attr(page.blobUrl)}#view=FitH&toolbar=0&navpanes=0" style="width:100%;height:calc(100% - 60px);border:0;display:block"></iframe>` : `<div style="padding:24px;color:#6b7c8e">Attachment not available for preview.</div>`}      </article>    `;
  }
  if (page.type === "attachments") {
    return `      <article class="builder-review-paper ${modifierClass}">        <div class="builder-review-paper-body">          <div class="builder-review-page-header">            <div>              <p class="builder-review-paper-kicker">Supporting documents</p>              <h2>Attachments included with this draft</h2>            </div>            <span class="builder-review-page-counter">Page ${pageNumber} of ${totalPages}</span>          </div>          <div class="builder-review-attachment-stack">            ${page.attachments.length ? page.attachments.map((file, index) => `                  <div class="builder-review-attachment-row">                    <strong>${String(index + 1).padStart(2, "0")}</strong>                    <span>${escapeHtml(file.name)}</span>                    <em>${escapeHtml(file.sizeLabel)}</em>                  </div>                `).join("") : `<div class="builder-review-attachment-empty">No supporting attachments have been added to this draft.</div>`}          </div>        </div>      </article>    `;
  }
  return `    <article class="builder-review-paper ${modifierClass}">      <div class="builder-review-paper-body">        <div class="builder-review-page-header">          <div>            <p class="builder-review-paper-kicker">Draft review</p>            <h2>Section summary</h2>          </div>          <span class="builder-review-page-counter">Page ${pageNumber} of ${totalPages}</span>        </div>        <div class="builder-review-simple-sections">          ${page.sections.map((section) => `            <section class="builder-review-simple-section">              <div class="builder-review-simple-head">                <div>                  <p>${escapeHtml(section.kicker)}</p>                  <h3>${escapeHtml(section.title)}</h3>                </div>              </div>              <p class="builder-review-section-summary">${escapeHtml(section.summary)}</p>              <dl class="builder-review-simple-list">                ${section.details.map((detail) => `                  <div>                    <dt>${escapeHtml(detail.label)}</dt>                    <dd>${escapeHtml(detail.value)}</dd>                  </div>                `).join("")}              </dl>            </section>          `).join("")}        </div>      </div>    </article>  `;
}
function builderDraftReviewLoadingScreen() {
  return `    <main class="builder-shell builder-review-loading-screen">      <section class="builder-review-loading-card">        <p class="eyebrow">Preparing draft review</p>        <h1>Opening your WISP draft</h1>        <p>We are assembling the current draft into a cleaner review copy.</p>        <div class="builder-review-loading-bar"><span></span></div>      </section>    </main>  `;
}
function getBuilderReviewTotalPages() {
  return Math.max(1, getBuilderDraftReviewPages().length);
}
function getBuilderReviewExpandedTitle(page) {
  return page.type === "docx-preview"
    ? page.title || "WISP preview"
    : page.type === "cover"
      ? "Cover page"
      : page.type === "attachments"
        ? "Attachments"
        : page.type === "attachment-file"
          ? page.name || "Attachment"
          : "Expanded page view";
}
function renderBuilderReviewMeta(pageIndex, totalPages) {
  if (getBuilderMergedTemplatePages().length) {
    return `      <span>Page ${pageIndex + 1} of ${totalPages}</span>      <span>${state.builderMergePreviewPages.length ? "WISP draft preview" : state.builderMergePdfUrl ? "WISP PDF preview" : state.builderMergeDocxBlob ? "WISP preview" : "WISP preview"}</span>      <span>${state.builderAttachments.length} attachments</span>    `;
  }
  return `    <span>Page ${pageIndex + 1} of ${totalPages}</span>    <span>${getBuilderReviewSections().length} sections assembled</span>    <span>${state.builderAttachments.length} attachments</span>  `;
}
function renderBuilderReviewInlineCanvas(page, pageIndex, totalPages) {
  return `    <button class="builder-review-side-nav is-left" type="button" data-action="builder-review-prev" ${pageIndex === 0 ? "disabled" : ""} aria-label="Previous page">&#8249;</button>    ${renderBuilderReviewPage(page, pageIndex + 1, totalPages)}    <button class="builder-review-side-nav is-right" type="button" data-action="builder-review-next" ${pageIndex === totalPages - 1 ? "disabled" : ""} aria-label="Next page">&#8250;</button>  `;
}
function renderBuilderReviewModalActions(pageIndex, totalPages) {
  return `    <button class="btn secondary" type="button" data-action="builder-review-prev" ${pageIndex === 0 ? "disabled" : ""}>Previous</button>    <button class="btn secondary" type="button" data-action="builder-review-next" ${pageIndex === totalPages - 1 ? "disabled" : ""}>Next</button>    <button class="btn secondary" type="button" data-action="close-builder-review-expanded">Close</button>  `;
}
function renderBuilderReviewExpandedModal() {
  if (!state.builderReviewExpanded) return "";
  const pages = getBuilderDraftReviewPages();
  const totalPages = getBuilderReviewTotalPages();
  const pageIndex = Math.max(
    0,
    Math.min(state.builderReviewPage || 0, totalPages - 1),
  );
  const page = pages[pageIndex];
  return `    <div class="builder-review-modal" role="dialog" aria-modal="true" aria-label="Expanded WISP preview">      <button class="builder-review-modal-backdrop" type="button" data-action="close-builder-review-expanded" aria-label="Close expanded page"></button>      <section class="builder-review-modal-dialog">        <div class="builder-review-modal-head">          <div class="builder-review-modal-title">            <h2 data-builder-review-modal-title>${getBuilderReviewExpandedTitle(page)}</h2>            <span class="builder-review-modal-page-count" data-builder-review-modal-page-count>Page ${pageIndex + 1} of ${totalPages}</span>          </div>          <div class="builder-review-modal-actions" data-builder-review-modal-actions>${renderBuilderReviewModalActions(pageIndex, totalPages)}</div>        </div>        <div class="builder-review-modal-canvas" data-builder-review-modal-canvas>${renderBuilderReviewPage(page, pageIndex + 1, totalPages, "builder-review-paper-expanded")}</div>      </section>    </div>`;
}
function builderDraftReviewScreen() {
  const pages = getBuilderDraftReviewPages();
  const totalPages = getBuilderReviewTotalPages();
  const pageIndex = Math.max(
    0,
    Math.min(state.builderReviewPage || 0, totalPages - 1),
  );
  const page = pages[pageIndex];
  const expandedTitle = getBuilderReviewExpandedTitle(page);
  return `    <main class="builder-shell builder-review-screen">      <section class="builder-review-topbar">        <div class="builder-review-topbar-copy">          <p class="eyebrow">Draft review</p>          <h1>Review your WISP draft</h1>          <p class="lead">Inspect the structured draft, confirm the language reads cleanly, and then return to finalize the package.</p>        </div>        <div class="builder-review-topbar-actions">          <button class="btn secondary" type="button" data-action="close-builder-review">Back to editor</button>          <button class="btn secondary" type="button" data-action="open-builder-review-expanded">Expand page</button>          <button class="btn secondary" type="button" data-action="download-builder-review">Download review PDF</button>          <button class="btn primary" type="button" data-action="finalize-builder-wisp" ${state.builderFinalizeBusy ? "disabled" : ""}>${state.builderFinalizeBusy ? "Finalizing..." : "Finalize WISP"}</button>        </div>      </section>      <section class="builder-review-meta-strip">        <div class="builder-review-meta-items" data-builder-review-meta>          ${renderBuilderReviewMeta(pageIndex, totalPages)}        </div>      </section>      <section class="builder-review-viewer-shell">        <div class="builder-review-canvas" data-builder-review-inline-canvas>          ${renderBuilderReviewInlineCanvas(page, pageIndex, totalPages)}        </div>      </section>      ${renderBuilderReviewExpandedModal()}    </main>  `;
}
function bindActionButtons(scope = document) {
  scope.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () =>
      handleAction(button.dataset.action, button),
    );
  });
}
function updateBuilderReviewDisplay() {
  if (!(state.screen === "builder" && state.builderReviewOpen)) return false;
  const pages = getBuilderDraftReviewPages();
  const totalPages = getBuilderReviewTotalPages();
  const pageIndex = Math.max(
    0,
    Math.min(state.builderReviewPage || 0, totalPages - 1),
  );
  state.builderReviewPage = pageIndex;
  const page = pages[pageIndex];
  const inlineCanvas = document.querySelector(
    "[data-builder-review-inline-canvas]",
  );
  const meta = document.querySelector("[data-builder-review-meta]");
  if (!inlineCanvas || !meta) return false;
  meta.innerHTML = renderBuilderReviewMeta(pageIndex, totalPages);
  inlineCanvas.innerHTML = renderBuilderReviewInlineCanvas(
    page,
    pageIndex,
    totalPages,
  );
  bindActionButtons(inlineCanvas);
  const modalCanvas = document.querySelector(
    "[data-builder-review-modal-canvas]",
  );
  if (modalCanvas) {
    modalCanvas.innerHTML = renderBuilderReviewPage(
      page,
      pageIndex + 1,
      totalPages,
      "builder-review-paper-expanded",
    );
    modalCanvas.scrollTop = 0;
    const modalTitle = document.querySelector(
      "[data-builder-review-modal-title]",
    );
    const modalPageCount = document.querySelector(
      "[data-builder-review-modal-page-count]",
    );
    const modalActions = document.querySelector(
      "[data-builder-review-modal-actions]",
    );
    if (modalTitle)
      modalTitle.textContent = getBuilderReviewExpandedTitle(page);
    if (modalPageCount)
      modalPageCount.textContent = `Page ${pageIndex + 1} of ${totalPages}`;
    if (modalActions) {
      modalActions.innerHTML = renderBuilderReviewModalActions(
        pageIndex,
        totalPages,
      );
      bindActionButtons(modalActions);
    }
  }
  queueBuilderPdfPreviewRender();
  return true;
}
function changeBuilderReviewPage(delta) {
  const nextPage = Math.max(
    0,
    Math.min(
      getBuilderReviewTotalPages() - 1,
      (state.builderReviewPage || 0) + delta,
    ),
  );
  if (nextPage === state.builderReviewPage) return;
  state.builderReviewPage = nextPage;
  if (!updateBuilderReviewDisplay()) render();
}
function getCompletedWispSignature(person) {
  const signatures = state.wispProject?.signatures || [];
  return (
    signatures.find((signature) => signature.signer_role === person.role) ||
    null
  );
}
function renderWispSignatureMark(signature) {
  if (!signature) return "";
  if (signature.signature_method === "draw")
    return (
      '<img class=\"wisp-signature-mark\" src=\"' +
      attr(signature.signature_data) +
      '\" alt=\"Signature by ' +
      attr(signature.signer_name) +
      '\" />'
    );
  return (
    '<span class=\"wisp-signature-typed wisp-signature-font-' +
    attr(signature.signature_font || "caveat") +
    '\">' +
    escapeHtml(signature.signature_data) +
    "</span>"
  );
}
function renderWispSignatureDialog() {
  const dialog = state.wispSignatureDialog;
  if (!dialog) return "";
  const isDraw = dialog.mode !== "type";
  const typedValue = dialog.typedValue || "";
  const font = dialog.font || "caveat";
  return `    <div class="wisp-signature-backdrop" role="presentation">      <section class="wisp-signature-dialog" role="dialog" aria-modal="true" aria-labelledby="wisp-signature-title">        <div class="wisp-signature-dialog-head">          <div><p class="eyebrow">Document signature</p><h2 id="wisp-signature-title">Sign WISP</h2></div>          <button class="wisp-signature-close" type="button" data-action="close-wisp-signature" aria-label="Close signature dialog">&times;</button>        </div>        <p class="wisp-signature-role">You are signing this completed WISP as <strong>${escapeHtml(dialog.role)}</strong>.</p>        <p class="wisp-signature-help">Choose how to provide your signature. Saving records your selected signature and signing time for this role.</p>        <div class="wisp-signature-tabs" role="tablist">          <button class="${isDraw ? "is-active" : ""}" type="button" data-action="wisp-signature-draw">Draw</button>          <button class="${!isDraw ? "is-active" : ""}" type="button" data-action="wisp-signature-type">Type</button>          <button class="wisp-signature-clear" type="button" data-action="clear-wisp-signature">Clear</button>        </div>        <div class="wisp-signature-pad-wrap">          ${isDraw ? '<canvas class="wisp-signature-pad" data-wisp-signature-pad width="900" height="310" aria-label="Draw your signature"></canvas><p class="wisp-signature-placeholder">Draw your signature here</p>' : '<div class="wisp-signature-type-wrap"><input class="wisp-signature-type-input" type="text" value="' + attr(typedValue) + '" data-wisp-signature-type placeholder="Type your full name" autocomplete="name" /><div class="wisp-signature-type-preview wisp-signature-font-' + attr(font) + '" data-wisp-signature-type-preview>' + escapeHtml(typedValue || "Your signature") + '</div><div class="wisp-signature-fonts"><button class="' + (font === "caveat" ? "is-active" : "") + '" type="button" data-action="wisp-signature-font" data-signature-font="caveat">Handwritten</button><button class="' + (font === "sacramento" ? "is-active" : "") + '" type="button" data-action="wisp-signature-font" data-signature-font="sacramento">Classic</button><button class="' + (font === "dancing" ? "is-active" : "") + '" type="button" data-action="wisp-signature-font" data-signature-font="dancing">Elegant</button><button class="' + (font === "segoe" ? "is-active" : "") + '" type="button" data-action="wisp-signature-font" data-signature-font="segoe">Casual</button><button class="' + (font === "formal" ? "is-active" : "") + '" type="button" data-action="wisp-signature-font" data-signature-font="formal">Formal</button></div></div>'}        </div>        <div class="wisp-signature-dialog-actions"><button class="btn secondary" type="button" data-action="close-wisp-signature">Cancel</button><button class="btn primary" type="button" data-action="save-wisp-signature">Save signature</button></div>      </section>    </div>`;
}
function openWispSignatureDialog(trigger) {
  state.wispSignatureDialog = {
    name: trigger?.dataset.signatoryName || "Responsible official",
    role: trigger?.dataset.signatoryRole || "Responsible official",
    email: trigger?.dataset.signatoryEmail || "",
    mode: "draw",
    typedValue: "",
    font: "caveat",
  };
  render();
}
function bindWispSignatureDialog() {
  const dialog = state.wispSignatureDialog;
  if (!dialog) return;
  const typedInput = document.querySelector("[data-wisp-signature-type]");
  if (typedInput)
    typedInput.addEventListener("input", (event) => {
      dialog.typedValue = event.target.value;
      const preview = document.querySelector(
        "[data-wisp-signature-type-preview]",
      );
      if (preview) preview.textContent = event.target.value || "Your signature";
    });
  const canvas = document.querySelector("[data-wisp-signature-pad]");
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const context = canvas.getContext("2d");
  if (!context) return;
  let drawing = false;
  const point = (event) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  };
  const drawStart = (event) => {
    drawing = true;
    dialog.hasDrawn = true;
    canvas.setPointerCapture?.(event.pointerId);
    const next = point(event);
    context.beginPath();
    context.moveTo(next.x, next.y);
    event.preventDefault();
  };
  const drawMove = (event) => {
    if (!drawing) return;
    const next = point(event);
    context.lineTo(next.x, next.y);
    context.strokeStyle = "#16324b";
    context.lineWidth = 5;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
    event.preventDefault();
  };
  const drawEnd = (event) => {
    drawing = false;
    canvas.releasePointerCapture?.(event.pointerId);
  };
  canvas.addEventListener("pointerdown", drawStart);
  canvas.addEventListener("pointermove", drawMove);
  canvas.addEventListener("pointerup", drawEnd);
  canvas.addEventListener("pointercancel", drawEnd);
}
async function rebuildCompletedWispSignaturePdf(signatures) {
  if (signedWispPdfRefreshPromise) return signedWispPdfRefreshPromise;
  signedWispPdfRefreshPromise = rebuildCompletedWispSignaturePdfImpl(signatures);
  try {
    return await signedWispPdfRefreshPromise;
  } finally {
    signedWispPdfRefreshPromise = null;
  }
}
async function rebuildCompletedWispSignaturePdfImpl(signatures) {
  const mergePreviewUrl = getMergePreviewUrl();
  if (!mergePreviewUrl)
    throw new Error("The branded WISP PDF renderer is not configured yet.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(mergePreviewUrl, {
      method: "POST",
      headers: await getMergeRequestHeaders(),
      body: JSON.stringify({ ...getBuilderTemplateMergePayload(), signatures }),
      signal: controller.signal,
    });
    if (!response.ok) {
      let message = "The branded WISP PDF could not be rebuilt for signing.";
      try {
        const errorPayload = await response.json();
        if (errorPayload?.error) message = errorPayload.error;
      } catch {}
      throw new Error(message);
    }
    const result = await response.json();
    if (!result?.pdfBase64)
      throw new Error("The branded WISP PDF was not returned for signing.");
    const mergedPdf = await appendBuilderAttachmentsToPdf(
      base64ToBlob(result.pdfBase64, "application/pdf"),
    );
    const fileName =
      (state.wispProject?.title || "wisp")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + "-signed.pdf";
    return finalizeWispBuild(
      { blob: mergedPdf.blob, fileName, contentType: "application/pdf" },
      {
        ...getBuilderDraftMeta({
          status: state.wispProject?.status || "completed",
          title:
            state.wispProject?.title || "Written Information Security Plan",
        }),
        builderDrafts: state.builderDrafts,
      },
    );
  } finally {
    clearTimeout(timeout);
  }
}
async function saveCompletedWispSignature() {
  const dialog = state.wispSignatureDialog;
  if (!dialog) return;
  let signatureData = "";
  if (dialog.mode === "type")
    signatureData = String(dialog.typedValue || "").trim();
  else {
    const canvas = document.querySelector("[data-wisp-signature-pad]");
    if (canvas instanceof HTMLCanvasElement)
      signatureData = canvas.toDataURL("image/png");
  }
  if (!signatureData || (dialog.mode === "draw" && !dialog.hasDrawn)) {
    showToast("Add a signature before saving.", "error");
    return;
  }
  const result = await saveWispSignature({
    projectId: state.wispProject?.id,
    signerName: dialog.name,
    signerRole: dialog.role,
    signerEmail: dialog.email,
    signatureMethod: dialog.mode,
    signatureData,
    signatureFont: dialog.font,
  });
  const signatures = result.signatures || [];
  state.wispProject = { ...state.wispProject, signatures };
  state.wispSignatureDialog = null;
  state.builderSigningPdfBusy = true;
  render();
  showToast("Signature saved. Updating the final WISP PDF...", "success");
  rebuildCompletedWispSignaturePdf(signatures)
    .then((signedResult) => {
      if (signedResult?.project)
        state.wispProject = { ...signedResult.project, signatures };
      state.wispVersions = signedResult?.versions || state.wispVersions;
      state.builderSigningPdfBusy = false;
      render();
      showToast("Signed WISP PDF updated.", "success");
    })
    .catch((error) => {
      console.warn("Signed PDF refresh failed", error);
      state.builderSigningPdfBusy = false;
      render();
      showToast(
        "Signature saved, but the final PDF update needs to be retried.",
        "info",
      );
    });
}
function acknowledgingSignerRequestScreen() {
  const sourceTab =
    state.acknowledgementRequestSource === "completed" ? "completed" : "active";
  const signedAcknowledgementStaffIds = new Set(
    (state.wispProject?.acknowledgement_requests || [])
      .filter((request) => request.status === "signed")
      .map((request) => request.recipient_staff_id),
  );
  const staff = getSettingsData().staff.filter((member) =>
    String(member?.firstName || member?.lastName || member?.email || "").trim(),
  ).filter((member) => !signedAcknowledgementStaffIds.has(member.id));
  const selectedIds = new Set(state.acknowledgingSignerIds || []);
  const selectedCount = staff.filter((member) =>
    selectedIds.has(member.id),
  ).length;
  const links = Array.isArray(state.acknowledgementRequestLinks)
    ? state.acknowledgementRequestLinks
    : [];
  const staffRows = staff.length
    ? staff
        .map((member) => {
          const name =
            `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
            member.email ||
            "Staff member";
          const description =
            [member.title, member.type].filter(Boolean).join(" - ") ||
            "Staff member";
          return `<label class="acknowledgement-request-row"><input type="checkbox" data-acknowledgement-staff-select="${attr(member.id)}" ${selectedIds.has(member.id) ? "checked" : ""} /><span class="acknowledgement-request-person"><strong>${escapeHtml(name)}</strong><small>${escapeHtml(member.email || "No email provided")}</small></span><span class="acknowledgement-request-role">${escapeHtml(description)}</span><span class="acknowledgement-request-select">${selectedIds.has(member.id) ? "Selected" : "Select"}</span></label>`;
        })
        .join("")
    : `<div class="acknowledgement-request-empty"><h3>No staff available yet</h3><p>Add staff in Settings before sending acknowledgement requests.</p><button class="btn secondary" type="button" data-action="utility-settings-staff">Open Staff Settings</button></div>`;
  const linksMarkup = links.length
    ? `<section class="acknowledgement-request-links"><div><p class="builder-status-panel-kicker">Secure links created</p><h3>Copy each link to share it with the selected staff member</h3><p>Each link expires after 30 days and becomes unusable as soon as that recipient signs.</p></div>${links.map((request) => `<div class="acknowledgement-request-link"><div><strong>${escapeHtml(request.recipient_name || "Staff member")}</strong><small>${escapeHtml(request.recipient_email || "No email provided")}</small><code>${escapeHtml(request.url)}</code></div><button class="btn secondary" type="button" data-action="copy-acknowledgement-link" data-acknowledgement-url="${attr(request.url)}">Copy link</button></div>`).join("")}</section>`
    : "";
  return `<main class="builder-shell builder-shell-status"><section class="builder-topbar"><div class="builder-topbar-copy"><p class="eyebrow">WISP Builder</p><h1>Send acknowledgement requests</h1><p class="lead">Choose staff who should acknowledge this ${sourceTab} WISP, then share their individual secure signing links.</p></div>${builderHeaderActions()}</section>${builderStatusTabs()}<div class="builder-shell-divider builder-shell-divider-static"></div><section class="builder-stage builder-stage-status"><section class="acknowledgement-request-panel"><div class="acknowledgement-request-heading"><div><p class="builder-status-panel-kicker">Acknowledging Signers</p><h2>Select staff to request acknowledgement</h2><p>Every recipient receives a separate secure link. Their signing status is tracked on the WISP page.</p></div><span>${selectedCount} selected</span></div><div class="acknowledgement-request-list">${staffRows}</div><div class="acknowledgement-request-footer"><button class="btn secondary" type="button" data-action="back-to-acknowledging-signers">Back to WISP</button><div><span>${selectedCount ? `${selectedCount} staff member${selectedCount === 1 ? "" : "s"} selected` : "Select staff to continue"}</span><button class="btn primary" type="button" data-action="create-acknowledgement-requests" ${selectedCount && !state.acknowledgementRequestBusy ? "" : "disabled"}>${state.acknowledgementRequestBusy ? "Creating secure links..." : "Make signature requests"}</button></div></div>${linksMarkup}</section></section></main>`;
}
function builderScreen() {
  const hasPendingDraft = hasPendingWispDraft();
  const hasActiveWisp = hasActiveWispProject();
  const hasPastVersions =
    Array.isArray(state.wispVersions) && state.wispVersions.length > 0;
  const topic = builderTopics[state.builderTopicIndex];
  const topicDraft = state.builderDrafts[topic.id] ?? topic.templateText;
  const isIntroTopic = topic.id === "intro";
  const isFirmDetailsTopic = topic.id === "firm-details-roles";
  const isObjectiveTopic = topic.id === "objective";
  const isPurposeTopic = topic.id === "purpose";
  const isOfficialsTopic = topic.id === "officials";
  const isInsideFirmTopic = topic.id === "inside-the-firm";
  const isOutsideFirmTopic = topic.id === "outside-the-firm";
  const isPoliciesTopic = topic.id === "policies";
  const isResourcesTopic = topic.id === "resources";
  const isGlossaryTopic = topic.id === "glossary";
  const isAttachmentsTopic = topic.id === "attachments";
  const isFinalizeTopic = topic.id === "finalize";
  const isRichDraftTopic = Boolean(topic.templateHtml) || isGlossaryTopic;
  const firmName = (state.form.companyName || "").trim() || "the Firm";
  const objectiveStandardizedText = `Our objective, in the development and implementation of this comprehensive Written Information Security Plan (WISP), is to create effective administrative, technical, and physical safeguards for the protection of the Personally Identifiable Information (PII) retained by ${firmName}, (hereinafter known as the Firm).`;
  const dscName =
    (state.form.dataSecurityCoordinator || "").trim() ||
    "the Data Security Coordinator";
  const pioName =
    (state.form.publicInformationOfficer || "").trim() ||
    "the Public Information Officer";
  const dscDraft =
    state.builderDrafts["officials-dsc"] ??
    initialBuilderDrafts["officials-dsc"];
  const pioDraft =
    state.builderDrafts["officials-pio"] ??
    initialBuilderDrafts["officials-pio"];
  const insideFirmIntroDraft =
    state.builderDrafts["inside-firm-intro"] ??
    initialBuilderDrafts["inside-firm-intro"];
  const insideFirmCollectionDraft =
    state.builderDrafts["inside-firm-collection"] ??
    initialBuilderDrafts["inside-firm-collection"];
  const insideFirmPersonnelDraft =
    state.builderDrafts["inside-firm-personnel"] ??
    initialBuilderDrafts["inside-firm-personnel"];
  const insideFirmDisclosureDraft =
    state.builderDrafts["inside-firm-disclosure"] ??
    initialBuilderDrafts["inside-firm-disclosure"];
  const insideFirmReportableDraft =
    state.builderDrafts["inside-firm-reportable"] ??
    initialBuilderDrafts["inside-firm-reportable"];
  const outsideFirmIntroDraft =
    state.builderDrafts["outside-firm-intro"] ??
    initialBuilderDrafts["outside-firm-intro"];
  const outsideFirmNetworkDraft =
    state.builderDrafts["outside-firm-network"] ??
    initialBuilderDrafts["outside-firm-network"];
  const outsideFirmAccessDraft =
    state.builderDrafts["outside-firm-access"] ??
    initialBuilderDrafts["outside-firm-access"];
  const outsideFirmExchangeDraft =
    state.builderDrafts["outside-firm-exchange"] ??
    initialBuilderDrafts["outside-firm-exchange"];
  const outsideFirmWifiDraft =
    state.builderDrafts["outside-firm-wifi"] ??
    initialBuilderDrafts["outside-firm-wifi"];
  const outsideFirmRemoteDraft =
    state.builderDrafts["outside-firm-remote"] ??
    initialBuilderDrafts["outside-firm-remote"];
  const outsideFirmDevicesDraft =
    state.builderDrafts["outside-firm-devices"] ??
    initialBuilderDrafts["outside-firm-devices"];
  const outsideFirmTrainingDraft =
    state.builderDrafts["outside-firm-training"] ??
    initialBuilderDrafts["outside-firm-training"];
  const policiesRulesDraft =
    state.builderDrafts["policies-rules"] ??
    initialBuilderDrafts["policies-rules"];
  const policiesBreachDraft =
    state.builderDrafts["policies-breach"] ??
    initialBuilderDrafts["policies-breach"];
  const resourcesIntroDraft =
    state.builderDrafts["resources-intro"] ??
    initialBuilderDrafts["resources-intro"];
  if (state.builderReviewLoading) {
    return builderDraftReviewLoadingScreen();
  }
  if (state.builderReviewOpen) {
    return builderDraftReviewScreen();
  }
  if (state.builderTab === "acknowledgement-requests") {
    return acknowledgingSignerRequestScreen();
  }
  if (["active", "completed"].includes(state.builderTab)) {
    const isActiveView = state.builderTab === "active";
    const viewLabel = isActiveView ? "Active" : "Completed";
    const viewDescription = isActiveView
      ? "Review your active WISP, download the final PDF, or manage its document signatories."
      : "Collect the required document signatures. Once both are recorded, move this WISP to Active.";
    const isProjectInThisView = isActiveView
      ? state.wispProject?.status === "active"
      : state.wispProject?.status === "completed";
    const wisp = isProjectInThisView ? state.wispProject : null;
    const file = wisp?.latest_generated_file;
const implementationDate = wisp?.activated_at || wisp?.updated_at;
    const finalizedDate = formatDashboardDate(implementationDate);
    const expirationDateValue = implementationDate ? new Date(implementationDate) : null;
    if (expirationDateValue && !Number.isNaN(expirationDateValue.getTime())) {
      expirationDateValue.setFullYear(expirationDateValue.getFullYear() + 1);
    }
    const expirationDate = expirationDateValue && !Number.isNaN(expirationDateValue.getTime())
      ? formatDashboardDate(expirationDateValue)
      : "--";
    const firmName =
      state.firmProfile?.name || state.form.companyName || "Your firm";
    const signatoryEmail =
      state.form.email || state.firmProfile?.email || "Not provided";
    const signatories = [
      {
        name: state.form.principalOperatingOfficer,
        role: "Principal Operating Officer",
      },
      {
        name: state.form.dataSecurityCoordinator,
        role: "Data Security Coordinator",
      },
      {
        name: state.form.publicInformationOfficer,
        role: "Public Information Officer",
      },
    ].filter((person) => String(person.name || "").trim());
    const signatoryRows = signatories.length
      ? signatories
          .map((person) => {
            const signature = getCompletedWispSignature(person);
            const signedDate = signature?.signed_at
              ? formatDashboardDate(signature.signed_at)
              : "--";
            const signed = signature
              ? '<span class="wisp-signatory-status">Yes</span>'
              : '<span class="wisp-signatory-pending">No</span>';
            const requiresSignature = [
              "Principal Operating Officer",
              "Data Security Coordinator",
            ].includes(person.role);
            const mark = signature
              ? renderWispSignatureMark(signature)
              : requiresSignature
                ? "Not signed"
                : "Not required";
            const action = signature
              ? '<span class="wisp-signature-saved">Signed</span>'
              : requiresSignature
                ? '<button class="wisp-sign-wisp-button" type="button" data-action="sign-completed-wisp" data-signatory-name="' +
                  attr(person.name) +
                  '" data-signatory-role="' +
                  attr(person.role) +
                  '" data-signatory-email="' +
                  attr(signatoryEmail) +
                  '">Sign WISP</button>'
                : '<span class="wisp-signature-saved">Not required</span>';
            return (
              "<tr><td>" +
              escapeHtml(person.name) +
              "</td><td>" +
              escapeHtml(person.role) +
              "</td><td>" +
              escapeHtml(signatoryEmail) +
              '</td><td><span class="wisp-signatory-status">' +
              viewLabel +
              "</span></td><td>" +
              signed +
              "</td><td>" +
              mark +
              "</td><td>" +
              signedDate +
              "</td><td>" +
              action +
              "</td></tr>"
            );
          })
          .join("")
      : '<tr><td colspan="8" class="wisp-signatory-empty">No responsible officials have been assigned to this WISP yet.</td></tr>';
    const activationRequiredRoles = [
      "Principal Operating Officer",
      "Data Security Coordinator",
    ];
    const isReadyForActivation = Boolean(wisp) && activationRequiredRoles.every((role) =>
      (state.wispProject?.signatures || []).some((signature) => signature.signer_role === role),
    );
    const activationCard = !isActiveView && isReadyForActivation
      ? `<section class="wisp-activation-ready-card"><div><p class="builder-status-panel-kicker">Ready to activate</p><h3>This WISP has both required signatures.</h3><p>The Principal Operating Officer and Data Security Coordinator have signed. Activate it to make this WISP the firm's active plan.</p></div><button class="btn primary" type="button" data-action="activate-completed-wisp">Move to Active</button></section>`
      : "";
    const acknowledgementRequests = (Array.isArray(
      state.wispProject?.acknowledgement_requests,
    )
      ? state.wispProject.acknowledgement_requests
      : []).filter((request) => request.status !== "revoked");
    const signedAcknowledgements = acknowledgementRequests.filter(
      (request) => request.status === "signed",
    ).length;
    const acknowledgingAvailability = acknowledgementRequests.length
      ? `${signedAcknowledgements} of ${acknowledgementRequests.length} signed`
      : "No requests sent";
    const acknowledgingRows = acknowledgementRequests.length
      ? acknowledgementRequests
          .map((request) => {
            const isSigned = request.status === "signed";
            const requestDate = request.created_at
              ? formatDashboardDate(request.created_at)
              : "--";
            const signedDate = request.signed_at
              ? formatDashboardDate(request.signed_at)
              : "--";
            const signaturePreview = isSigned
              ? renderWispSignatureMark(request)
              : "--";
            const action = isSigned
              ? '<span class="wisp-signature-saved">Signed</span>'
              : request.status === "expired"
                ? '<span class="wisp-signatory-muted">Expired</span>'
                : '<button class="wisp-remove-acknowledgement-button" type="button" data-action="remove-acknowledgement-request" data-acknowledgement-request-id="' + attr(request.id) + '">Remove</button>';
            return (
              "<tr><td><strong>" +
              escapeHtml(request.recipient_name || "Staff member") +
              "</strong></td><td>" +
              escapeHtml(request.recipient_email || "Not provided") +
              '</td><td><span class="' +
              (isSigned ? "wisp-signature-yes" : "wisp-signature-no") +
              '">' +
              (isSigned ? "Yes" : "No") +
              "</span></td><td>" +
              signaturePreview +
              "</td><td>" +
              escapeHtml(requestDate) +
              "</td><td>" +
              escapeHtml(signedDate) +
              "</td><td>" +
              action +
              "</td></tr>"
            );
          })
          .join("")
      : '<tr><td colspan="7" class="wisp-signatory-empty"><strong>No acknowledgement requests yet</strong><span>Add staff from Settings, then send them individual acknowledgement links.</span></td></tr>';
    const content = wisp
      ? `      <section class="wisp-info-panel">        <h2>${viewLabel} WISP Info</h2>        <div class="wisp-info-layout">          <dl class="wisp-info-table">            <div><dt>Firm name</dt><dd>${escapeHtml(firmName)}</dd></div>            <div><dt>${isActiveView ? "Implementation date" : "Finalized date"}</dt><dd>${escapeHtml(finalizedDate)}</dd></div>            ${isActiveView ? `<div><dt>Expiration date</dt><dd>${escapeHtml(expirationDate)}</dd></div>` : ""}            <div><dt>Status</dt><dd>${viewLabel}</dd></div>            <div><dt>Attachments</dt><dd>${state.builderAttachments.length}</dd></div>          </dl>          <div class="wisp-info-actions">            <div class="wisp-info-document" aria-hidden="true"><div></div><span>WISP</span><i></i><i></i><i></i></div>            <button class="btn secondary" type="button" data-action="view-completed-wisp" ${state.builderSigningPdfBusy ? "disabled" : ""}>${state.builderSigningPdfBusy ? "Updating signed PDF..." : "View WISP"}</button>            ${file?.downloadUrl ? `<button class="wisp-info-download" type="button" data-action="download-current-wisp">Download PDF</button>` : ""}            <button class="wisp-info-delete" type="button" data-action="delete-completed-wisp">Delete ${isActiveView ? "active" : "completed"} WISP</button>          </div>        </div>        <section class="wisp-signatories">          <div class="wisp-signatories-head"><div><h2>Document Signatories</h2><p>Responsible officials assigned to this ${isActiveView ? "active" : "completed"} WISP.</p></div><span>Signature workflow: not requested</span></div>          <div class="wisp-signatories-table-wrap"><table class="wisp-signatories-table"><thead><tr><th>Name</th><th>Role</th><th>Email</th><th>WISP status</th><th>Signed</th><th>Signature requested</th><th>Signed date</th><th>Action</th></tr></thead><tbody>${signatoryRows}</tbody></table></div>        </section>        ${activationCard}        ${isActiveView ? `<section class="wisp-signatories wisp-acknowledging-signers">          <div class="wisp-signatories-head"><div><h2>Acknowledging Signers</h2><p>Staff members from Settings who can be asked to acknowledge this ${isActiveView ? "active" : "completed"} WISP.</p></div><div class="wisp-acknowledging-head-actions"><span>${acknowledgingAvailability}</span><button class="wisp-send-request-button" type="button" data-action="open-acknowledging-requests">Send new signature request</button></div></div>          <div class="wisp-signatories-table-wrap"><table class="wisp-signatories-table wisp-acknowledging-signers-table"><thead><tr><th>Name</th><th>Email</th><th>Signed</th><th>Signature</th><th>Request date</th><th>Signed date</th><th>Action</th></tr></thead><tbody>${acknowledgingRows}</tbody></table></div>        </section>` : ""}        <p class="wisp-info-note">This WISP is ${isActiveView ? "active" : "complete"}. Delete it only when you are ready to remove it and start a new draft.</p>      </section>`
      : builderStatusPanel({
          eyebrow: `No ${viewLabel.toLowerCase()} WISP`,
          title: `No ${viewLabel.toLowerCase()} WISP yet`,
          body: `Finalize a WISP draft and its ${viewLabel.toLowerCase()} plan will appear here.`,
          actions: `<button class="btn primary" type="button" data-action="create-wisp">Create WISP</button>`,
        });
    return `<main class="builder-shell builder-shell-status"><section class="builder-topbar"><div class="builder-topbar-copy"><p class="eyebrow">WISP Builder</p><h1>Written Information Security Plan</h1><p class="lead">${viewDescription}</p></div>${builderHeaderActions()}</section>${builderStatusTabs()}<div class="builder-shell-divider builder-shell-divider-static"></div><section class="builder-stage builder-stage-status">${content}</section>${renderBuilderReviewExpandedModal()}${renderWispSignatureDialog()}</main>`;
  }
  if (state.builderTab === "past") {
    const pastPanel = hasPastVersions
      ? `          <section class="builder-version-list">            ${state.wispVersions.map((version, index) => `                  <article class="builder-version-card">                    <div>                      <p class="builder-status-panel-kicker">Version ${index + 1}</p>                      <h3>${escapeHtml(version.fileName || version.title || "Archived WISP version")}</h3>                      <p>Saved ${escapeHtml(formatDashboardDate(version.updated_at))}</p>                    </div>                    ${version.downloadUrl ? `<button class="btn secondary small" type="button" data-download-wisp-version="${index}">Download</button>` : ""}                  </article>                `).join("")}          </section>        `
      : builderStatusPanel({
          eyebrow: "No Archived Versions",
          title: "No past versions yet",
          body: "Archived WISP versions will appear here once completed documents are superseded by a newer active version.",
        });
    return `      <main class="builder-shell builder-shell-status">        <section class="builder-topbar">          <div class="builder-topbar-copy">            <p class="eyebrow">WISP Builder</p>            <h1>Written Information Security Plan</h1>            <p class="lead">Edit template sections, review mapped language, and move through the working draft one topic at a time.</p>          </div>          ${builderHeaderActions()}        </section>        ${builderStatusTabs()}        <div class="builder-shell-divider builder-shell-divider-static"></div>        <section class="builder-stage builder-stage-status">          ${pastPanel}        </section>      </main>    `;
  }
  if (!hasPendingDraft && !state.builderResumeEditing) {
    return `      <main class="builder-shell builder-shell-status">        <section class="builder-topbar">          <div class="builder-topbar-copy">            <p class="eyebrow">WISP Builder</p>            <h1>Written Information Security Plan</h1>            <p class="lead">Edit template sections, review mapped language, and move through the working draft one topic at a time.</p>          </div>          ${builderHeaderActions()}        </section>        ${builderStatusTabs()}        <div class="builder-shell-divider builder-shell-divider-static"></div>        <section class="builder-stage builder-stage-status">          ${hasActiveWisp ? builderStatusPanel({ eyebrow: finalizedWispStatusLabel() + " WISP Exists", title: "You have an " + finalizedWispStatusLabel() + " WISP", body: "You cannot create a new WISP draft while an " + finalizedWispStatusLabel() + " WISP is in your workspace. Review or delete the " + finalizedWispStatusLabel() + " WISP before creating another draft.", actions: '<button class="btn primary" type="button" data-action="go-completed-wisp">Go to ' + finalizedWispStatusLabel() + ' WISP</button>' }) : builderStatusPanel({ eyebrow: "No Pending Draft", title: "No pending WISP draft yet", body: "Start a WISP draft from this builder and it will appear here as a pending item until it is finalized." })}        </section>      </main>    `;
  }
  if (!state.builderResumeEditing) {
    return `      <main class="builder-shell builder-shell-status">        <section class="builder-topbar">          <div class="builder-topbar-copy">            <p class="eyebrow">WISP Builder</p>            <h1>Written Information Security Plan</h1>            <p class="lead">Edit template sections, review mapped language, and move through the working draft one topic at a time.</p>          </div>        </section>        ${builderStatusTabs()}        <div class="builder-shell-divider builder-shell-divider-static"></div>        <section class="builder-stage builder-stage-status">          ${builderStatusPanel({ eyebrow: "Pending Draft", title: state.wispProject?.title || "Draft WISP in progress", body: `A saved draft is waiting for edits. Last updated ${formatDashboardDate(state.wispProject?.updated_at)}. Continue editing to resume where you left off.`, actions: `<button class="btn primary" type="button" data-action="continue-pending-wisp">Continue Editing</button>` })}        </section>      </main>    `;
  }
  return `    <main class="builder-shell ${state.builderSidebarOpen ? "is-sidebar-open" : ""} ${state.builderLaunchAnimation ? "is-editor-entering" : ""}">      <button class="builder-dim ${state.builderSidebarOpen ? "is-visible" : ""}" type="button" data-action="close-builder-sidebar" aria-label="Close topics"></button>      <aside class="builder-topic-sheet ${state.builderSidebarOpen ? "is-open" : ""}">        <button class="builder-topic-peek" type="button" data-action="open-builder-sidebar" aria-label="Open topics">          <span>Sections</span>        </button>        <div class="builder-topic-sheet-head">          <div>            <p class="rail-kicker">Editable sections</p>            <h3>Draft outline</h3>            <p class="builder-topic-sheet-subtext">Choose a section to edit its mapped language and continue through the draft.</p>          </div>          <button class="btn ghost small" type="button" data-action="close-builder-sidebar">Close</button>        </div>        <div class="builder-topic-list">          ${builderTopics.map((item, index) => `                <button class="builder-topic-item ${index === state.builderTopicIndex ? "is-active" : ""}" type="button" data-builder-topic="${index}">                  <span class="builder-topic-index">${index + 1}</span>                  <span class="builder-topic-body">                    <span class="builder-topic-name">${escapeHtml(item.title)}</span>                    <span class="builder-topic-status">${escapeHtml(item.status)}</span>                  </span>                </button>              `).join("")}        </div>      </aside>      <section class="builder-topbar">        <div class="builder-topbar-copy">          <p class="eyebrow">WISP Builder</p>          <h1>Written Information Security Plan</h1>          <p class="lead">Edit template sections, review mapped language, and move through the working draft one topic at a time.</p>        </div>        ${builderHeaderActions()}      </section>      ${builderStatusTabs()}      <div class="builder-shell-divider"></div>        <section class="builder-stage">          <section class="builder-editor-panel">            ${isIntroTopic ? `` : `<div class="builder-editor-head">                    <div>                      <h2>${isFirmDetailsTopic ? "Firm details and responsible roles" : isOfficialsTopic ? "Responsible officials" : isInsideFirmTopic ? "Inside the Firm Risk Mitigation" : isOutsideFirmTopic ? "Outside the Firm Risk Mitigation" : isResourcesTopic ? "Resource Links" : escapeHtml(topic.title)}</h2>                      ${isFirmDetailsTopic ? `<p>Add the core firm details that will be carried through the draft and confirm the individuals assigned to the primary WISP responsibilities. These entries help personalize the document and clarify who is responsible for oversight, coordination, and public-facing information handling.</p>` : ``}                    </div>                  </div>`}            <div class="builder-editor-stack">              ${isIntroTopic ? `              <section class="builder-intro-page">                <div class="builder-intro-head">                  <h2>Start your Written Information Security Plan</h2>                  <p>This workspace helps your firm prepare a structured WISP draft using the information gathered in your assessment and builder workflow. Review each section carefully and update the language so it matches how your firm actually handles data, access, storage, and security responsibilities.</p>                </div>                <div class="builder-intro-grid">                  <section class="builder-doc-block builder-intro-block">                    <div class="builder-doc-head">                      <div>                        <h3>How to use this builder</h3>                      </div>                    </div>                    <div class="builder-doc-body">                      <p>Work through the draft one section at a time. Some sections collect firm-specific details, while others provide base language that should be reviewed and adjusted to fit your operations.</p>                    </div>                  </section>                  <section class="builder-doc-block builder-intro-block">                    <div class="builder-doc-head">                      <div>                        <h3>Your review matters</h3>                      </div>                    </div>                    <div class="builder-doc-body">                      <p>This builder is designed to help organize and accelerate WISP preparation, but it should not be treated as legal advice or as a substitute for firm-specific judgment. Before finalizing the document, confirm that the language reflects your real practices, vendors, personnel roles, and record-handling procedures.</p>                    </div>                  </section>                  <section class="builder-doc-block builder-intro-block">                    <div class="builder-doc-head">                      <div>                        <h3>About editable content</h3>                      </div>                    </div>                    <div class="builder-doc-body">                      <p>Most drafting areas can be edited directly. Use those sections to add firm-specific information, revise placeholder language, and remove anything that does not apply.</p>                    </div>                  </section>                  <section class="builder-doc-block builder-intro-block">                    <div class="builder-doc-head">                      <div>                        <h3>About standardized content</h3>                      </div>                    </div>                    <div class="builder-doc-body">                      <p>Some areas may be fixed, reference-based, or controlled for consistency within the document workflow. Where editing is limited, review the surrounding sections carefully to ensure the final document still reflects your firmÃ¢â‚¬â„¢s actual safeguards.</p>                    </div>                  </section>                </div>                <section class="builder-doc-block builder-intro-example">                  <div class="builder-doc-head builder-doc-head-split">                    <div>                      <h3>Editable section example</h3>                    </div>                    <span class="builder-intro-chip">Editable drafting surface</span>                  </div>                  <div class="builder-doc-body">                    <div class="builder-editor-surface">                      <div class="builder-editor-toolbar">                        <button class="builder-tool" type="button">B</button>                        <button class="builder-tool builder-tool-italic" type="button">I</button>                        <button class="builder-tool builder-tool-underline" type="button">U</button>                        <span class="builder-tool-sep"></span>                        <button class="builder-tool" type="button">1.</button>                        <button class="builder-tool" type="button">-</button>                        <button class="builder-tool" type="button">L</button>                        <button class="builder-tool" type="button">C</button>                      </div>                      <div class="builder-editor-canvas builder-editor-canvas-direct" contenteditable="true" spellcheck="false" data-builder-editor="${attr(topic.id)}">${escapeHtml(topicDraft)}</div>                    </div>                  </div>                </section>                <section class="builder-doc-block builder-intro-example builder-intro-example-fixed">                  <div class="builder-doc-head builder-doc-head-split">                    <div>                      <h3>Standardized section example</h3>                    </div>                    <span class="builder-intro-chip builder-intro-chip-fixed">Controlled section</span>                  </div>                  <div class="builder-doc-body">                    <div class="builder-intro-fixed-surface">                      <p>This section is provided in a controlled format and may be limited to preserve document structure or required language.</p>                    </div>                  </div>                </section>              </section>` : isFirmDetailsTopic ? `             <section class="builder-doc-block builder-doc-block-firm">                <div class="builder-doc-head">                  <div>                    <h3>Required firm information</h3>                    <p>Use these fields to confirm the legal or operating name of the firm, assign the primary named roles, and enter the title that should appear on the signature page if applicable.</p>                  </div>                </div>                <div class="builder-doc-body">                  <div class="field-grid two">                    ${field("companyName", "Firm name", "text", "", "Enter firm name", true)}                    ${select("principalOperatingOfficer", "Principal Operating Officer", options.builderRoleOptions, "", "Select name...")}                    ${select("dataSecurityCoordinator", "Data Security Coordinator", options.builderRoleOptions, "", "Select name...")}                    ${select("publicInformationOfficer", "Public Information Officer", options.builderRoleOptions, "", "Select name...")}                    ${field("signatureTitle", "Signature title", "text", "", "Enter signature title", true)}                  </div>                </div>              </section>              <section class="builder-doc-block builder-doc-block-note">                <div class="builder-doc-head">                  <div>                    <h3>Before you continue</h3>                  </div>                </div>                <div class="builder-doc-body">                  <p>Make sure the assigned roles reflect how responsibilities are actually handled within the firm. If one person currently fills multiple functions, confirm that this matches your operating reality before finalizing the document.</p>                </div>              </section>` : isObjectiveTopic ? `              <section class="builder-doc-block builder-intro-example builder-intro-example-fixed builder-objective-standardized">                <div class="builder-doc-body">                  <div class="builder-intro-fixed-surface">                    <p>${escapeHtml(objectiveStandardizedText)}</p>                  </div>                </div>              </section>` : isOfficialsTopic ? `              <section class="builder-doc-block builder-intro-example builder-intro-example-fixed builder-objective-standardized">                <div class="builder-doc-body">                  <div class="builder-intro-fixed-surface">                    <p>${escapeHtml(`${firmName} has designated ${dscName} to be the Data Security Coordinator (hereinafter the DSC).`)}</p>                  </div>                </div>              </section>              <section class="builder-editor-direct">                <div class="builder-editor-field builder-editor-field-direct">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="officials-dsc">${dscDraft}</div>                  </div>                </div>              </section>              <section class="builder-doc-block builder-intro-example builder-intro-example-fixed builder-objective-standardized">                <div class="builder-doc-body">                  <div class="builder-intro-fixed-surface">                    <p>${escapeHtml(`${firmName} has designated ${pioName} to be the Public Information Officer (hereinafter PIO).`)}</p>                  </div>                </div>              </section>              <section class="builder-editor-direct">                <div class="builder-editor-field builder-editor-field-direct">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="officials-pio">${pioDraft}</div>                  </div>                </div>              </section>` : isInsideFirmTopic ? `              <section class="builder-editor-direct">                <div class="builder-editor-field builder-editor-field-direct">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="inside-firm-intro">${insideFirmIntroDraft}</div>                  </div>                </div>              </section>              <section class="builder-doc-block">                <div class="builder-doc-head">                  <div>                    <h3>PII Collection and Retention Policy</h3>                  </div>                </div>                <div class="builder-doc-body">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="inside-firm-collection">${insideFirmCollectionDraft}</div>                  </div>                </div>              </section>              <section class="builder-doc-block">                <div class="builder-doc-head">                  <div>                    <h3>Personnel Accountability Policy</h3>                  </div>                </div>                <div class="builder-doc-body">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="inside-firm-personnel">${insideFirmPersonnelDraft}</div>                  </div>                </div>              </section>              <section class="builder-doc-block">                <div class="builder-doc-head">                  <div>                    <h3>PII Disclosure Policy</h3>                  </div>                </div>                <div class="builder-doc-body">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="inside-firm-disclosure">${insideFirmDisclosureDraft}</div>                  </div>                </div>              </section>              <section class="builder-doc-block">                <div class="builder-doc-head">                  <div>                    <h3>Reportable Event Policy</h3>                  </div>                </div>                <div class="builder-doc-body">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="inside-firm-reportable">${insideFirmReportableDraft}</div>                  </div>                </div>              </section>` : isOutsideFirmTopic ? `              <section class="builder-editor-direct">                <div class="builder-editor-field builder-editor-field-direct">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-intro">${outsideFirmIntroDraft}</div>                  </div>                </div>              </section>              <section class="builder-doc-block">                <div class="builder-doc-head">                  <div>                    <h3>Network Protection Policy</h3>                  </div>                </div>                <div class="builder-doc-body">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-network">${outsideFirmNetworkDraft}</div>                  </div>                </div>              </section>              <section class="builder-doc-block">                <div class="builder-doc-head">                  <div>                    <h3>Firm User Access Control Policy</h3>                  </div>                </div>                <div class="builder-doc-body">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-access">${outsideFirmAccessDraft}</div>                  </div>                </div>              </section>              <section class="builder-doc-block">                <div class="builder-doc-head">                  <div>                    <h3>Electronic Exchange of PII Policy</h3>                  </div>                </div>                <div class="builder-doc-body">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-exchange">${outsideFirmExchangeDraft}</div>                  </div>                </div>              </section>              <section class="builder-doc-block">                <div class="builder-doc-head">                  <div>                    <h3>Wi-Fi Access Policy</h3>                  </div>                </div>                <div class="builder-doc-body">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-wifi">${outsideFirmWifiDraft}</div>                  </div>                </div>              </section>              <section class="builder-doc-block">                <div class="builder-doc-head">                  <div>                    <h3>Remote Access Policy</h3>                  </div>                </div>                <div class="builder-doc-body">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-remote">${outsideFirmRemoteDraft}</div>                  </div>                </div>              </section>              <section class="builder-doc-block">                <div class="builder-doc-head">                  <div>                    <h3>Connected Devices Policy</h3>                  </div>                </div>                <div class="builder-doc-body">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-devices">${outsideFirmDevicesDraft}</div>                  </div>                </div>              </section>              <section class="builder-doc-block">                <div class="builder-doc-head">                  <div>                    <h3>Information Security Training Policy</h3>                  </div>                </div>                <div class="builder-doc-body">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-training">${outsideFirmTrainingDraft}</div>                  </div>                </div>              </section>` : isPoliciesTopic ? `              <section class="builder-doc-block">                <div class="builder-doc-head">                  <div>                    <h3>Rules of Behavior and Conduct Safeguarding Client PII</h3>                  </div>                </div>                <div class="builder-doc-body">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="policies-rules">${policiesRulesDraft}</div>                  </div>                </div>              </section>              <section class="builder-doc-block">                <div class="builder-doc-head">                  <div>                    <h3>Security Breach Notifications and Procedures</h3>                  </div>                </div>                <div class="builder-doc-body">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="policies-breach">${policiesBreachDraft}</div>                  </div>                </div>              </section>` : isResourcesTopic ? `              <section class="builder-editor-direct">                <div class="builder-editor-field builder-editor-field-direct">                  <div class="builder-editor-surface">                    <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                    </div>                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="resources-intro">${resourcesIntroDraft}</div>                  </div>                </div>              </section>${renderBuilderResourceSections()}` : isAttachmentsTopic ? `              <section class="builder-doc-block builder-topic-minimal builder-attachment-minimal">                <div class="builder-doc-body builder-topic-minimal-body builder-attachment-body-minimal">                  <div class="builder-topic-intro">                    <p>Add supporting PDFs to include with the final WISP package. Files appear below in delivery order and can be dragged to reorder before delivery.</p>                    <p><strong>Please note:</strong> anyone who receives the final WISP package will be able to view these attachments, so only upload files that are appropriate to share.</p>                  </div>                  <label class="builder-upload-zone builder-upload-zone-minimal" data-builder-upload-zone>                    <input class="builder-upload-input" type="file" accept="application/pdf,.pdf" data-builder-upload />                    <span class="builder-upload-title">Drop file here or browse</span>                    <span class="builder-upload-subtitle">PDF only</span>                    <span class="builder-upload-meta-inline">Maximum size: 10MB</span>                  </label>                  <div class="builder-attachment-flat-list">                    <div class="builder-attachment-flat-head">                      <h4>Attached</h4>                    </div>                    ${state.builderAttachments.length ? `<div class="builder-attachment-list builder-attachment-list-flat">                            ${state.builderAttachments.map((file, index) => `                                  <div class="builder-attachment-item builder-attachment-item-flat" draggable="true" data-attachment-index="${index}">                                    <div class="builder-attachment-file">                                      <div class="builder-attachment-copy">                                        <strong>${escapeHtml(file.name)}</strong>                                        <div class="builder-attachment-meta-row">                                          <span>${escapeHtml(file.sizeLabel)}</span>                                          <span>Order ${index + 1}</span>                                        </div>                                      </div>                                    </div>                                    <button class="builder-attachment-remove" type="button" data-remove-attachment="${index}" aria-label="Remove attachment">&times;</button>                                  </div>                                `).join("")}                          </div>` : `<div class="builder-attachment-empty builder-attachment-empty-flat"><p>No attachments added yet.</p></div>`}                  </div>                </div>              </section>` : isFinalizeTopic ? `              <section class="builder-doc-block builder-topic-minimal builder-finalize-minimal">                <div class="builder-doc-body builder-topic-minimal-body">                  <div class="builder-finalize-hero">                    <div class="builder-finalize-visual" aria-hidden="true">                      <span class="builder-finalize-sheet"></span>                    </div>                    <div class="builder-finalize-copy-minimal">                      <p class="rail-kicker">Final review</p>                      <h3>Your WISP is ready for review</h3>                      <p class="builder-finalize-intro">Review the draft to confirm the language reflects your firm accurately before finalizing the package.</p>                                      <div class="builder-finalize-actions-minimal">                        <button class="btn primary" type="button" data-action="review-builder-draft">Review draft</button>                        <button class="builder-finalize-link" type="button" data-action="download-builder-review">Download review PDF</button>                      </div>                      <p class="builder-finalize-footnote">Use the watermarked copy for offline markup or partner review, then return here to finalize.</p>                    </div>                  </div>                </div>              </section>` : ""}              ${isIntroTopic || isFirmDetailsTopic || isOfficialsTopic || isInsideFirmTopic || isOutsideFirmTopic || isPoliciesTopic || isResourcesTopic || isAttachmentsTopic || isFinalizeTopic ? `` : isRichDraftTopic ? `<section class="builder-editor-direct">                  <div class="builder-editor-field builder-editor-field-direct">                    <div class="builder-editor-surface">                      <div class="builder-editor-toolbar">                        <button class="builder-tool" type="button">B</button>                        <button class="builder-tool builder-tool-italic" type="button">I</button>                        <button class="builder-tool builder-tool-underline" type="button">U</button>                        <span class="builder-tool-sep"></span>                        <button class="builder-tool" type="button">1.</button>                        <button class="builder-tool" type="button">-</button>                        <button class="builder-tool" type="button">L</button>                        <button class="builder-tool" type="button">C</button>                      </div>                      <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="${attr(topic.id)}">${topicDraft}</div>                    </div>                  </div>              </section>` : `<section class="builder-editor-direct">                  <div class="builder-editor-field builder-editor-field-direct">                    <div class="builder-editor-surface">                      <div class="builder-editor-toolbar">                      <button class="builder-tool" type="button">B</button>                      <button class="builder-tool builder-tool-italic" type="button">I</button>                      <button class="builder-tool builder-tool-underline" type="button">U</button>                      <span class="builder-tool-sep"></span>                      <button class="builder-tool" type="button">1.</button>                      <button class="builder-tool" type="button">-</button>                      <button class="builder-tool" type="button">L</button>                      <button class="builder-tool" type="button">C</button>                      </div>                      <div class="builder-editor-canvas builder-editor-canvas-direct" contenteditable="true" spellcheck="false" data-builder-editor="${attr(topic.id)}">${escapeHtml(topicDraft)}</div>                    </div>                  </div>              </section>`}            </div>            <div class="builder-section-nav">              <button class="btn secondary builder-nav-prev" type="button" data-builder-nav="prev" ${state.builderTopicIndex === 0 ? "disabled" : ""}>Back</button>              <span class="builder-section-progress">Section ${state.builderTopicIndex + 1} of ${builderTopics.length}</span>              <button class="btn primary builder-nav-next" type="button" data-builder-nav="next" ${state.builderTopicIndex === builderTopics.length - 1 ? "disabled" : ""}>${state.builderTopicIndex === builderTopics.length - 2 ? "Go to Finalize" : "Next"}</button>            </div>          </section>      </section>    </main>  `;
}
function navIcon(name) {
  const icons = {
    home: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 9.5V19.5a.5.5 0 0 0 .5.5h4V14h5v6h4a.5.5 0 0 0 .5-.5V9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    risk: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3.5 19 6v5.5c0 4.5-2.8 7.7-7 8.9-4.2-1.2-7-4.4-7-8.9V6L12 3.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M12 8v5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="12" cy="16" r=".7" fill="currentColor"/></svg>`,
    builder: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 4h7l3.5 3.5V19.5a.5.5 0 0 1-.5.5H6.5a.5.5 0 0 1-.5-.5V4.5a.5.5 0 0 1 .5-.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M13.5 4v3.5H17" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M8.5 11h6M8.5 13.5h6M8.5 16h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    documents: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="7" y="5" width="11" height="15" rx="1" stroke="currentColor" stroke-width="1.3"/><path d="M10 5V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v13" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M10 9h5M10 12h5M10 15h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    training: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 8 12 4l9 4-9 4-9-4Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M6.5 10.5v3.5c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 8.5v5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="m8.5 10.5 3.5 3.5 3.5-3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5 19h13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="1.3"/><path d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.8 6.2l-1.4 1.4M7.6 16.4l-1.4 1.4M17.8 17.8l-1.4-1.4M7.6 7.6 6.2 6.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  };
  return icons[name] || "";
}
function documentLibraryIcon(type) {
  const icons = {
    sheet: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M3.5 9.5h17M8.5 4.5v15M14 4.5v15" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>`,
    checklist: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3.5" width="14" height="17" rx="2.5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 7h8M8 10.5l1.5 1.5 3-3M8 15.5l1.5 1.5 3-3" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    "record-retention-policy": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h8l4 4V19.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 6 3.5z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/><path d="M14 3.5V7.5h4" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="12" cy="14.5" r="3.5" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M12 12.5v2l1.5 1" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>`,
    "disaster-recovery-plan": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l6.5 2.5v5c0 4-2.5 6.8-6.5 8C8 17.8 5.5 15 5.5 11V6z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/><path d="M9 12.5a3 3 0 0 0 4.5 2.5M15 11a3 3 0 0 0-4.5-2.5" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M14.8 8.8l.2-2.3 2.3.2" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.2 15.2l-.2 2.3-2.3-.2" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    "incident-report": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l9 16H3z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/><path d="M12 10v4.5" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>`,
    "data-breach-response-guideline": `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M12 7.5v9M7.5 12h9" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M8.5 8.5l-1.5-1.5M15.5 15.5l1.5 1.5M15.5 8.5l1.5-1.5M8.5 15.5l-1.5 1.5" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
    "data-breach-notification-letter": `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M3.5 7.5l8.5 5.5 8.5-5.5" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="6" r="2.5" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M18 5v1.3l.8.8" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round"/></svg>`,
    uploaded: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3.5l4.5 4.5v11a1.5 1.5 0 0 1-1.5 1.5H7a1.5 1.5 0 0 1-1.5-1.5V5a1.5 1.5 0 0 1 1.5-1.5z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/><path d="M8.5 3.5v3.5h3.5" stroke="currentColor" stroke-width="1.3" fill="none"/><path d="M8 14l2.5 2.5L16 11" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    default: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3.5h7.5l4 4V19.5a1.5 1.5 0 0 1-1.5 1.5H6.5a1.5 1.5 0 0 1-1.5-1.5V5a1.5 1.5 0 0 1 1.5-1.5z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/><path d="M14 3.5V7.5h4" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M9 11.5h6M9 14.5h6M9 17.5h4" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>`,
  };
  return icons[type] || icons.default;
}
function documentIconForItem(item) {
  if (item.kind === "workspace" || item.kind === "sheet")
    return documentLibraryIcon("sheet");
  if (item.kind === "checklist") return documentLibraryIcon("checklist");
  if (item.kind === "special-instance") {
    const record = state.specialDocumentInstances?.[item.instanceId];
    if (record) return documentLibraryIcon(record.docType);
  }
  return documentLibraryIcon("default");
}
function documentIconForTemplate(template) {
  const icons = {
    "pii-hardware-inventory": `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2.5"/><path d="M8 9h8M8 13h3M15 13h1M8 17h8"/><path d="M10 3v2M14 3v2"/></svg>`,
    "pii-access-list": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 11.2V8.8a4.5 4.5 0 0 1 9 0v2.4"/><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M12 14.5v2"/><circle cx="12" cy="15.5" r=".75" fill="currentColor" stroke="none"/></svg>`,
    "terminated-employee-checklist": `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="12" height="16" rx="2"/><path d="M9 4.5h6v2H9zM9 10l1.3 1.3 2.6-2.6M9 15l1.3 1.3 2.6-2.6M14 10h1.5M14 15h1.5"/></svg>`,
    "record-retention-guide": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h8l4 4v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M14 4v4h4M8.5 12h7M8.5 15h5"/><path d="M17.5 16.5a3.5 3.5 0 1 1-2.5-6"/></svg>`,
    "disaster-recovery-topics": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 19 6v5.2c0 4.25-2.65 7.1-7 8.8-4.35-1.7-7-4.55-7-8.8V6l7-2.5Z"/><path d="M8.5 12a3.75 3.75 0 0 0 6.1 2.9M15.5 12a3.75 3.75 0 0 0-6.1-2.9"/><path d="m15 7.3.2 2.2 2.2-.2M9 16.7l-.2-2.2-2.2.2"/></svg>`,
    "incident-report": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 20 19H4L12 4Z"/><path d="M12 9.5v4.5M12 16.7v.1"/><circle cx="12" cy="17" r=".55" fill="currentColor" stroke="none"/></svg>`,
    "sample-data-breach-letter": `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="m4 7.5 8 5.2 8-5.2M8 15.5h3"/><path d="M17.5 4v3M16 5.5h3"/></svg>`,
    "data-breach-response-guideline": `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h8l4 4v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M14 4v4h4M8.5 12h7M8.5 15h5"/><path d="m8.5 9.5 1 1 2-2"/></svg>`,
  };
  return icons[template.id] || (template.documentType ? documentLibraryIcon(template.documentType) : documentLibraryIcon("sheet"));
}
let toastTimer = null;
function showToast(message, type = "success") {
  let toast = document.getElementById("wisp-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "wisp-toast";
    toast.className = "wisp-toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<div class="wisp-toast-inner wisp-toast-${type}"><span class="wisp-toast-icon">${type === "success" ? '<svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' : type === "error" ? '<svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 8v5M12 16v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' : '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 3.5l9 16H3z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M12 10v4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>'}</span><span class="wisp-toast-message">${escapeHtml(message)}</span></div>`;
  toast.classList.add("wisp-toast-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("wisp-toast-visible");
  }, 2600);
}
function templateDownloadIcon() {
  return `    <svg viewBox="0 0 24 24" aria-hidden="true">      <path d="M12 5.1v8.8"></path>      <path d="m8.7 10.95 3.3 3.3 3.3-3.3"></path>      <path d="M6.2 18.7h11.6"></path>    </svg>  `;
}
function brandMark(variant = "default") {
  const source = variant === "sidebar"
    ? "/assets/brand/wispnow-logo-sidebar-cropped.png"
    : "/assets/brand/wispnow-logo-cropped.png";
  return `<img class="brand-logo-image" src="${source}" alt="WispNow" />`;
}

function applyWispNowBranding(root = document.body) {
  if (!root) return;
  if (root.nodeType === Node.TEXT_NODE) {
    const parent = root.parentElement;
    if (parent && !["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)) {
      root.nodeValue = (root.nodeValue || "").replace(/EasyWISP/gi, "WispNow");
    }
    return;
  }
  const scope = root.nodeType === Node.ELEMENT_NODE ? root : root.parentElement || document.body;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return /EasyWISP/i.test(node.nodeValue || "")
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });
  const matches = [];
  while (walker.nextNode()) matches.push(walker.currentNode);
  matches.forEach((node) => {
    node.nodeValue = node.nodeValue.replace(/EasyWISP/gi, "WispNow");
  });

  if (!scope.querySelectorAll) return;
  scope
    .querySelectorAll(".public-ack-brand > span:first-child, .public-ack-state-header > span:first-child")
    .forEach((element) => {
      if (element.querySelector(".brand-logo-image")) return;
      element.innerHTML = `<img class="brand-logo-image" src="/assets/brand/wispnow-logo-cropped.png" alt="WispNow" />`;
    });
}

function installWispNowBranding() {
  applyWispNowBranding();
  const observer = new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach((node) => applyWispNowBranding(node));
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
function appNav() {
  const riskActive = ["welcome", "assessment", "review", "results"].includes(
    state.screen,
  );
  return `        <aside class="app-sidebar">          <div class="app-sidebar-brand">            <div class="app-sidebar-brand-mark">              <span class="brand-mark">${brandMark("sidebar")}</span>              <div class="app-sidebar-brand-copy">                <strong>EasyWISP</strong>                <span>Compliance workspace</span>              </div>            </div>          </div>        <nav class="app-nav">          <button class="app-nav-item ${state.screen === "home" ? "is-active" : ""}" type="button" data-action="nav-home">            <span class="app-nav-icon">${navIcon("home")}</span>            <span>Home</span>          </button>          <button class="app-nav-item ${riskActive ? "is-active" : ""}" type="button" data-action="nav-risk">            <span class="app-nav-icon">${navIcon("risk")}</span>            <span>Risk Assessment</span>          </button>          <button class="app-nav-item ${state.screen === "builder" ? "is-active" : ""}" type="button" data-action="nav-builder-home">            <span class="app-nav-icon">${navIcon("builder")}</span>            <span>WISP Builder</span>          </button>          <button class="app-nav-item ${state.screen === "training" ? "is-active" : ""}" type="button" data-action="nav-training">            <span class="app-nav-icon">${navIcon("training")}</span>            <span>Training</span>          </button>          <button class="app-nav-item ${["documents", "document-editor", "terminated-checklist", "record-retention-policy"].includes(state.screen) ? "is-active" : ""}" type="button" data-action="nav-documents">            <span class="app-nav-icon">${navIcon("documents")}</span>            <span>Documents</span>          </button>          <button class="app-nav-item ${state.screen === "settings" ? "is-active" : ""}" type="button" data-action="nav-settings">            <span class="app-nav-icon">${navIcon("settings")}</span>            <span>Settings</span>          </button>          </nav>          <div class="app-sidebar-footer">            <button class="app-sidebar-help" type="button">              <span>Help center</span>            </button>            <span class="app-sidebar-meta">Workspace ready</span>          </div>        </aside>  `;
}
function isAssessmentSectionComplete(index) {
  if (index === 0) {
    return [
      "companyName",
      "primaryContact",
      "practiceType",
      "staffSize",
      "taxSoftware",
      "itManagement",
    ].every((field) => Boolean(state.form[field]));
  }
  return Boolean(state.form[`question_${index}`]);
}
function countCompletedAssessmentSections() {
  return sections.reduce(
    (total, _section, index) =>
      total + (isAssessmentSectionComplete(index) ? 1 : 0),
    0,
  );
}
function assessmentGroupForSection(index) {
  return assessmentNavigationGroups.find((group) =>
    group.sectionIndexes.includes(index),
  );
}
function progressRail() {
  const totalSections = sections.length;
  const completedCount = countCompletedAssessmentSections();
  const isAssessmentFlow = state.screen === "assessment";
  const isCompleteView = state.screen === "results" || state.screen === "review";
  const percent = isCompleteView
    ? 100
    : Math.round((completedCount / totalSections) * 100);
  const activeGroup = isAssessmentFlow
    ? assessmentGroupForSection(state.sectionIndex)
    : null;
  const activeGroupLabel = activeGroup?.label || "Assessment complete";
  const activeGroupCompleted = activeGroup
    ? activeGroup.sectionIndexes.filter((index) => isAssessmentSectionComplete(index)).length
    : totalSections;
  const activeGroupPosition = activeGroup
    ? activeGroup.sectionIndexes.indexOf(state.sectionIndex) + 1
    : 0;
  const activeGroupTotal = activeGroup?.sectionIndexes.length || totalSections;
  const groupMarkup = assessmentNavigationGroups
    .map((group) => {
      const groupCompleted = group.sectionIndexes.filter(
        (index) => isAssessmentSectionComplete(index) || isCompleteView,
      ).length;
      const groupComplete = groupCompleted === group.sectionIndexes.length;
      const groupActive = activeGroup === group;
      const targetIndex =
        group.sectionIndexes.find((index) => !isAssessmentSectionComplete(index)) ??
        group.sectionIndexes[0];
      const showItems = isAssessmentFlow && groupActive;
      return `
        <section class="assessment-rail-group ${groupActive ? "is-active" : ""} ${groupComplete ? "is-complete" : ""}">
          <button class="assessment-rail-group-head" type="button" data-jump-section="${targetIndex}">
            <span class="assessment-rail-group-copy"><strong>${group.label}</strong><small>${groupCompleted}/${group.sectionIndexes.length} complete</small></span>
            <span class="assessment-rail-group-status" aria-hidden="true"></span>
          </button>
          ${showItems ? `<div class="assessment-rail-items">${group.sectionIndexes.map((index) => {
            const active = state.sectionIndex === index;
            const complete = isAssessmentSectionComplete(index);
            return `<button class="assessment-rail-item ${active ? "is-active" : ""} ${complete ? "is-complete" : ""}" type="button" data-jump-section="${index}"><span>${String(index + 1).padStart(2, "0")}</span><span>${sections[index]}</span><i aria-hidden="true"></i></button>`;
          }).join("")}</div>` : ""}
        </section>
      `;
    })
    .join("");
  return `
    <aside class="progress-rail assessment-progress-rail">
      <div>
        <p class="rail-kicker">Assessment</p>
        <div class="assessment-rail-groups">${groupMarkup}</div>
      </div>
      <div class="rail-card">
        <div class="rail-meta">
          <strong>${isCompleteView ? "Assessment complete" : activeGroupLabel}</strong>
          <div class="rail-meter"><span style="width:${percent}%"></span></div>
          <span>${isCompleteView ? `${totalSections} of ${totalSections} sections complete` : `${activeGroupCompleted} of ${activeGroupTotal} complete in this group`}</span>
          <span>${isCompleteView ? "Review or generate your results" : `Question ${activeGroupPosition} of ${activeGroupTotal} | ${completedCount} of ${totalSections} overall`}</span>
        </div>
      </div>
    </aside>
  `;
}async function resolveAuthenticatedDestination() {
  if (!state.authUser || state.workspaceResolving) return;
  const resolvingUserId = state.authUser.id;

  // Returning users never need to see a blocking workspace loader. We already
  // know this browser completed setup, so open the dashboard immediately and
  // refresh its data quietly in the background.
  if (hasCachedOnboardingCompletion(resolvingUserId)) {
    state.workspaceResolvedForUserId = resolvingUserId;
    state.screen = "home";
    render();
    void syncAuthWorkspace().then(() => {
      if (state.authUser?.id !== resolvingUserId) return;
      state.screen = state.onboarding?.status !== "completed" ? "onboarding" : "home";
      render();
    });
    return;
  }

  state.workspaceResolving = true;
  render();
  let timeoutId = null;
  try {
    const workspaceLoaded = await Promise.race([
      syncAuthWorkspace(),
      new Promise((resolve) => {
        timeoutId = window.setTimeout(() => resolve(false), 4000);
      }),
    ]);
    if (!workspaceLoaded && !state.onboarding) {
      state.onboarding = { status: "not_started", current_step: 1, profile: {} };
    }
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId);
    if (state.authUser?.id !== resolvingUserId) return;
    state.workspaceResolving = false;
    state.workspaceResolvedForUserId = resolvingUserId;
    state.screen = state.onboarding?.status !== "completed" ? "onboarding" : "home";
    render();
  }
}

function beginAuthHandoff(user) {
  if (!user) return;
  state.authUser = user;
  state.authReady = true;
  state.authBusy = false;
  if (state.screen !== "auth") {
    void resolveAuthenticatedDestination();
    return;
  }
  if (state.authTransitioning) return;

  state.authTransitioning = true;
  const authSplit = app.querySelector(".auth-split");
  const submit = app.querySelector("[data-auth-submit]");
  if (authSplit) {
    authSplit.classList.add("is-completing");
    authSplit.setAttribute("aria-busy", "true");
  } else {
    render();
  }
  if (submit) {
    submit.classList.add("is-complete");
    submit.disabled = true;
    submit.textContent = "Signed in";
  }

  clearTimeout(authHandoffTimer);
  authHandoffTimer = setTimeout(() => {
    state.authTransitioning = false;
    void resolveAuthenticatedDestination();
  }, 420);
}function previewOnboardingLogo(file, input) {
  const allowedTypes = new Set(["image/png", "image/jpeg", "image/svg+xml"]);
  if (!allowedTypes.has(file.type)) {
    input.value = "";
    showToast("Choose a PNG, JPG, or SVG logo.", "error");
    return;
  }
  if (file.size > MAX_COMPANY_LOGO_BYTES) {
    input.value = "";
    showToast("Choose a logo smaller than 5 MB.", "error");
    return;
  }
  if (onboardingLogoPreviewUrl) URL.revokeObjectURL(onboardingLogoPreviewUrl);
  onboardingLogoFile = file;
  onboardingLogoPreviewUrl = URL.createObjectURL(file);
  const card = document.querySelector("[data-onboarding-logo-card]");
  const preview = document.querySelector("[data-onboarding-logo-preview]");
  const name = document.querySelector("[data-onboarding-logo-name]");
  const meta = document.querySelector("[data-onboarding-logo-meta]");
  const action = document.querySelector("[data-onboarding-logo-action]");
  if (preview) preview.innerHTML = `<img src="${attr(onboardingLogoPreviewUrl)}" alt="Firm logo preview" />`;
  if (name) name.textContent = file.name;
  if (meta) meta.textContent = "Preview ready — saved when you continue.";
  if (action) action.textContent = "Replace logo";
  if (card) {
    card.classList.remove("is-previewing");
    void card.offsetWidth;
    card.classList.add("has-preview", "is-previewing");
  }
}
function onboardingProfile() {
  const saved = state.onboarding?.profile || {};
  return {
    firmName: saved.firm_name || state.firmProfile?.name || state.form.companyName || "",
    contactName: saved.contact_name || state.firmProfile?.primary_contact || state.form.primaryContact || "",
    businessEmail: saved.business_email || state.authUser?.email || "",
    businessPhone: saved.business_phone || "",
    website: saved.website || "",
    city: saved.city || "",
    state: saved.state || "",
    dscName: saved.dsc_name || "",
    dscEmail: saved.dsc_email || "",
    pooName: saved.poo_name || "",
    pooEmail: saved.poo_email || "",
  };
}

function onboardingScreen() {
  const profile = onboardingProfile();
  const step = Math.max(1, Math.min(6, Number(state.onboarding?.current_step) || 1));
  const labels = ["Welcome", "Your firm", "Why it matters", "Firm identity", "WISP roles", "Ready"];
  const stepHeader = `<header class="onboarding-brief-nav"><div class="onboarding-brief-brand" aria-label="EasyWISP"><span class="brand-mark">${brandMark()}</span><strong>EasyWISP</strong></div><span class="onboarding-brief-status">Private workspace setup</span></header><div class="onboarding-brief-progress"><div><span>Step ${step}</span><strong>${labels[step - 1]}</strong></div><ol aria-label="Step ${step} of 6">${labels.map((label, index) => `<li class="${index + 1 < step ? "is-done" : index + 1 === step ? "is-active" : ""}" aria-label="${attr(label)}"></li>`).join("")}</ol><span class="onboarding-brief-count">${String(step).padStart(2, "0")} / 06</span></div>`;
  const actions = (primary, secondary = "") => `<footer class="onboarding-centered-actions">${secondary}<button class="btn primary" type="submit" ${state.onboardingSaving ? "disabled" : ""}>${state.onboardingSaving ? "Saving..." : primary}</button></footer>`;
  let body = "";
  if (step === 1) body = `<section class="onboarding-centered-copy onboarding-welcome"><p class="eyebrow">YOUR COMPLIANCE WORKSPACE</p><h1>Set up your firm’s security foundation.</h1><p>EasyWISP gives your firm one structured place to build a Written Information Security Plan, document the work behind it, and keep accountability clear.</p><div class="onboarding-outcomes"><span><b>01</b> Build your WISP</span><span><b>02</b> Organize your evidence</span><span><b>03</b> Track accountability</span></div></section>${actions("Set up my workspace")}`;
  if (step === 2) body = `<section class="onboarding-centered-copy"><p class="eyebrow">FIRM PROFILE</p><h1>Tell us about your firm.</h1><p>Start with the essentials. You can refine these details anytime in Settings.</p></section><div class="onboarding-field-grid"><label><span>Firm name</span><input class="input" type="text" required data-onboarding-field="firmName" value="${attr(profile.firmName)}" placeholder="Smith Tax & Accounting" /></label><label><span>Your name</span><input class="input" type="text" required data-onboarding-field="contactName" value="${attr(profile.contactName)}" placeholder="Jane Smith" /></label><label class="onboarding-field-wide"><span>Business email</span><input class="input" required type="email" data-onboarding-field="businessEmail" value="${attr(profile.businessEmail)}" placeholder="jane@firm.com" /></label><label><span>City <em>Optional</em></span><input class="input" type="text" data-onboarding-field="city" value="${attr(profile.city)}" placeholder="Austin" /></label><label><span>State <em>Optional</em></span><input class="input" type="text" maxlength="2" data-onboarding-field="state" value="${attr(profile.state)}" placeholder="TX" /></label></div><aside class="onboarding-reassurance"><span>✓</span><p>Built for tax and accounting firms that handle sensitive customer information.</p></aside>${actions("Continue", `<button class="btn secondary" type="button" data-onboarding-back>Back</button>`)}`;
  if (step === 3) body = `<section class="onboarding-centered-copy onboarding-education"><p class="eyebrow">WHY THIS MATTERS</p><h1>You made the right call.</h1><p>Tax preparation firms are explicitly included in the FTC’s examples of businesses covered by its Safeguards Rule. Covered firms need a written information-security program that fits the customer information they handle.</p><a href="https://www.ftc.gov/business-guidance/resources/ftc-safeguards-rule-what-your-business-needs-know" target="_blank" rel="noopener">Read FTC guidance <span>↗</span></a></section><aside class="onboarding-education-note"><strong>EasyWISP turns that requirement into a clear, manageable workflow—one step at a time.</strong></aside>${actions("I understand — continue", `<button class="btn secondary" type="button" data-onboarding-back>Back</button>`)}`;
  if (step === 4) { const pendingLogo = onboardingLogoFile; const logoPreviewUrl = pendingLogo ? onboardingLogoPreviewUrl : state.settingsLogo?.previewUrl; const logoName = pendingLogo?.name || state.settingsLogo?.name || "Add your firm logo"; const logoMeta = pendingLogo ? "Ready to use in your workspace" : state.settingsLogo?.previewUrl ? "Your current firm logo" : "PNG, JPG, or SVG. Up to 5 MB."; body = `<section class="onboarding-centered-copy"><p class="eyebrow">FIRM IDENTITY</p><h1>Make the workspace yours.</h1><p>Your firm identity carries through to the documents you create. Everything here can be changed later.</p></section><section class="onboarding-branding"><div class="onboarding-logo-drop ${logoPreviewUrl ? "has-preview" : ""}" data-onboarding-logo-card><span class="onboarding-logo-preview" data-onboarding-logo-preview>${logoPreviewUrl ? `<img src="${attr(logoPreviewUrl)}" alt="Firm logo preview" />` : brandMark()}</span><div class="onboarding-logo-copy"><strong data-onboarding-logo-name>${escapeHtml(logoName)}</strong><p data-onboarding-logo-meta>${escapeHtml(logoMeta)}</p></div><label class="btn secondary onboarding-logo-choose"><span data-onboarding-logo-action>${logoPreviewUrl ? "Replace logo" : "Choose logo"}</span><input type="file" accept="image/png,image/jpeg,image/svg+xml" data-onboarding-logo hidden /></label></div></section><div class="onboarding-field-grid onboarding-field-grid--two"><label><span>Business phone <em>Optional</em></span><input class="input" type="tel" data-onboarding-field="businessPhone" value="${attr(profile.businessPhone)}" placeholder="(555) 000-0000" /></label><label><span>Website <em>Optional</em></span><input class="input" type="url" data-onboarding-field="website" value="${attr(profile.website)}" placeholder="https://yourfirm.com" /></label></div>${actions("Continue", `<button class="btn secondary" type="button" data-onboarding-back>Back</button>`)}`; }
  if (step === 5) body = `<section class="onboarding-centered-copy"><p class="eyebrow">ACCOUNTABILITY</p><h1>Who owns your security program?</h1><p>A completed WISP needs clear responsibility. Add the people who will hold these roles for your firm.</p></section><section class="onboarding-roles"><label><span>Data Security Coordinator</span><small>Coordinates your firm’s information-security work.</small><div class="onboarding-role-fields"><input class="input" type="text" required data-onboarding-field="dscName" value="${attr(profile.dscName)}" placeholder="Name of the responsible person" /><input class="input" type="email" required data-onboarding-field="dscEmail" value="${attr(profile.dscEmail)}" placeholder="name@firm.com" /></div></label><label><span>Principal Operating Officer</span><small>Accountable firm leader who reviews and signs the plan.</small><div class="onboarding-role-fields"><input class="input" type="text" required data-onboarding-field="pooName" value="${attr(profile.pooName)}" placeholder="Name of the accountable leader" /><input class="input" type="email" required data-onboarding-field="pooEmail" value="${attr(profile.pooEmail)}" placeholder="name@firm.com" /></div></label></section><aside class="onboarding-reassurance"><span>✓</span><p>These names and emails are saved to your workspace and ready to assign when you create your WISP.</p></aside>${actions("Continue", `<button class="btn secondary" type="button" data-onboarding-back>Back</button>`)}`;
  if (step === 6) body = `<section class="onboarding-centered-copy onboarding-finish"><span class="onboarding-finish-mark">${brandMark()}</span><p class="eyebrow">WORKSPACE READY</p><h1>You’re ready to begin.</h1><p>Your foundation is in place. Next, we’ll understand your current safeguards and use them to guide your WISP.</p><ol><li><b>1</b> Assess your current safeguards</li><li><b>2</b> Build your written plan</li><li><b>3</b> Document training and acknowledgement</li></ol></section>${actions("Start risk assessment", `<button class="btn secondary" type="button" data-onboarding-dashboard>Go to dashboard</button>`)}`;
  const stageMotion = state.onboardingStepMotion ? ` is-entering is-${state.onboardingStepDirection || "forward"}` : "";
  if (state.onboardingStepMotion) window.setTimeout(() => { state.onboardingStepMotion = false; }, 360);
  return `<main class="onboarding-brief-shell"><div class="onboarding-brief-frame">${stepHeader}<form class="onboarding-form onboarding-brief-stage${stageMotion}" data-onboarding-form novalidate>${body}${state.onboardingError ? `<p class="onboarding-error">${escapeHtml(state.onboardingError)}</p>` : ""}</form></div></main>`;
}

function onboardingFormProfile() {
  const values = Object.fromEntries([...document.querySelectorAll("[data-onboarding-field]")].map((field) => [field.dataset.onboardingField, field.value.trim()]));
  const existing = state.onboarding?.profile || {};
  return { ...existing, firm_name: values.firmName ?? existing.firm_name, contact_name: values.contactName ?? existing.contact_name, business_email: values.businessEmail ?? existing.business_email, business_phone: values.businessPhone ?? existing.business_phone, website: values.website ?? existing.website, city: values.city ?? existing.city, state: values.state?.toUpperCase() ?? existing.state, dsc_name: values.dscName ?? existing.dsc_name, dsc_email: values.dscEmail ?? existing.dsc_email, poo_name: values.pooName ?? existing.poo_name, poo_email: values.pooEmail ?? existing.poo_email };
}

async function finishOnboarding(destination) {
  const profile = onboardingFormProfile();
  state.onboardingSaving = true; state.onboardingError = ""; render();
  try {
    const saved = await completeFirmOnboarding({ ...profile, firmName: profile.firm_name, contactName: profile.contact_name, businessEmail: profile.business_email, businessPhone: profile.business_phone });
    state.onboarding = saved?.onboarding || { status: "completed" };
    cacheOnboardingCompletion(state.authUser?.id, true);
    if (saved?.firm) state.firmProfile = saved.firm;
    if (saved?.settings) {
      state.settingsData = hydrateWorkspaceSettings(
        normalizeSettingsData(saved.settings),
        {
          user: state.authUser,
          firm: saved.firm || state.firmProfile,
          onboarding: state.onboarding,
        },
      );
    }
    state.form.companyName = profile.firm_name; state.form.primaryContact = profile.contact_name;
    state.screen = destination === "assessment" ? "welcome" : "home";
    showToast("Workspace setup complete.", "success");
  } catch (error) { state.onboardingError = error?.message || "We couldn't save your workspace setup. Please try again."; }
  finally { state.onboardingSaving = false; render(); }
}

async function submitOnboarding() {
  const step = Math.max(1, Math.min(6, Number(state.onboarding?.current_step) || 1));
  const profile = onboardingFormProfile();
  const selectedLogo = onboardingLogoFile || document.querySelector("[data-onboarding-logo]")?.files?.[0] || null;
  if (step === 2 && (!profile.firm_name || !profile.contact_name || !profile.business_email)) { state.onboardingError = "Complete the firm name, your name, and business email."; render(); return; }
  if (step === 2 && !/^\S+@\S+\.\S+$/.test(profile.business_email)) { state.onboardingError = "Enter a valid business email address."; render(); return; }
  if (step === 5 && (!profile.dsc_name || !profile.dsc_email || !profile.poo_name || !profile.poo_email)) { state.onboardingError = "Add names and email addresses for both required WISP roles."; render(); return; }
  if (step === 5 && (!/^\S+@\S+\.\S+$/.test(profile.dsc_email) || !/^\S+@\S+\.\S+$/.test(profile.poo_email))) { state.onboardingError = "Enter valid email addresses for both WISP roles."; render(); return; }
  if (step === 6) { await finishOnboarding("assessment"); return; }
  state.onboardingSaving = true; state.onboardingError = ""; render();
  try {
    if (step === 4 && selectedLogo) { if (selectedLogo.size > MAX_COMPANY_LOGO_BYTES) throw new Error("Choose a logo smaller than 5 MB."); const savedLogo = await uploadCompanyLogo(selectedLogo); if (savedLogo) { state.settingsLogo = { name: selectedLogo.name, storagePath: savedLogo.logo_path, previewUrl: savedLogo.logo_url }; profile.logo_path = savedLogo.logo_path; if (onboardingLogoPreviewUrl) URL.revokeObjectURL(onboardingLogoPreviewUrl); onboardingLogoFile = null; onboardingLogoPreviewUrl = null; } }
    state.onboarding = await saveFirmOnboardingProgress({ currentStep: step + 1, profile });
    state.onboardingStepDirection = "forward";
    state.onboardingStepMotion = true;
  } catch (error) { state.onboardingError = error?.message || "We couldn't save your workspace setup. Please try again."; }
  finally { state.onboardingSaving = false; render(); }
}
function authScreen() {
  const mode = state.authMode || "login";
  const isLogin = mode === "login";
  const heroImg = "design/auth-hero-bg.png";
  return `    <div class="auth-split ${state.authTransitioning ? "is-completing" : ""}">      <section class="auth-split-form">        <div class="auth-split-inner">          <div class="auth-split-brand">            <span class="brand-mark">${brandMark()}</span>            <strong>EasyWISP</strong>          </div>          <h1 class="auth-split-heading"><span class="auth-split-heading-light">Welcome</span></h1>          <p class="auth-split-desc">${isLogin ? "Access your firm's WISP workspace" : "Set up your firm's WISP workspace"}</p>          <div class="auth-tabs">            <button class="auth-tab ${isLogin ? "is-active" : ""}" type="button" data-auth-tab="login">Sign in</button>            <button class="auth-tab ${!isLogin ? "is-active" : ""}" type="button" data-auth-tab="signup">Create account</button>          </div>          <div class="auth-form-wrap" id="auth-form-wrap">            ${authFormContent()}          </div>          <button class="auth-split-skip" type="button" data-action="auth-provider-unavailable" disabled>Skip to app</button>        </div>      </section>      <section class="auth-split-hero">        <div class="auth-split-hero-image" style="background-image: radial-gradient(ellipse 70% 50% at 85% 90%, rgba(13,138,99,0.25) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 5% 10%, rgba(13,138,99,0.12) 0%, transparent 55%), url(${heroImg})"></div>        <div class="auth-hero-copy">          <span class="auth-hero-pill">For tax and accounting firms</span>          <h2 class="auth-hero-headline">Your firm's WISP.<br /><span class="auth-hero-em">Done.</span></h2>          <p class="auth-hero-sub">Complete your Written Information Security Plan in a single session. Guided step by step, FTC ready.</p>        </div>      </section>    </div>  `;
}
function authFormContent() {
  const mode = state.authMode || "login";
  const isLogin = mode === "login";
  return `    <form class="auth-form" data-auth-form>      ${!isLogin ? `            <div class="auth-field">              <label class="auth-field-label">Full name</label>              <div class="auth-glass-input">                <input class="auth-glass-field" type="text" value="${attr(state.authName || "")}" data-auth-name placeholder="Jane Miller" autocomplete="name" />              </div>            </div><div class="auth-field">              <label class="auth-field-label">Firm name</label>              <div class="auth-glass-input">                <input class="auth-glass-field" type="text" value="${attr(state.authFirmName || "")}" data-auth-firm-name placeholder="Acme Tax & Accounting" autocomplete="organization" />              </div>            </div>` : ""}            <div class="auth-field">              <label class="auth-field-label">Email address</label>              <div class="auth-glass-input">                <input class="auth-glass-field" type="email" value="${attr(state.authEmail || "")}" data-auth-email placeholder="name@firm.com" autocomplete="email" required />              </div>            </div>            <div class="auth-field">              <label class="auth-field-label">Password</label>              <div class="auth-glass-input">                <div class="auth-password-wrap">                  <input class="auth-glass-field" type="${state.authShowPassword ? "text" : "password"}" value="${attr(state.authPassword || "")}" data-auth-password placeholder="At least 8 characters" autocomplete="${isLogin ? "current-password" : "new-password"}" required />                  <button class="auth-password-toggle" type="button" data-auth-toggle-password aria-label="Toggle password visibility">                    ${state.authShowPassword ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>` : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`}                  </button>                </div>              </div>            </div>            ${!isLogin ? `            <div class="auth-field">              <label class="auth-field-label">Confirm password</label>              <div class="auth-glass-input">                <input class="auth-glass-field" type="password" value="${attr(state.authPasswordConfirm || "")}" data-auth-password-confirm placeholder="Re-enter password" autocomplete="new-password" />              </div>            </div>` : ""}            ${isLogin ? `            <label class="auth-remember">              <input type="checkbox" checked class="auth-checkbox" />              <span>Keep me signed in</span>            </label>` : ""}            ${state.authError ? `<p class="auth-feedback ${state.authFeedbackTone === "success" ? "is-success" : "is-error"}" data-auth-feedback>${escapeHtml(state.authError)}</p>` : ""}            <button class="btn primary auth-submit${state.authTransitioning ? " is-complete" : ""}" type="submit" data-auth-submit ${(state.authBusy || state.authTransitioning) ? "disabled" : ""}>              ${state.authTransitioning ? "Signed in" : state.authBusy ? "Please wait..." : isLogin ? "Sign in" : "Create account"}            </button>          </form>          <div class="auth-or"><span>Or continue with</span></div>          <button class="auth-google-btn" type="button" data-action="auth-provider-unavailable" disabled>            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"/></svg>            Continue with Google          </button>          <p class="auth-switch-text">${isLogin ? "New to EasyWISP?" : "Already have an account?"} <button class="auth-switch-btn" type="button" data-auth-tab="${isLogin ? "signup" : "login"}">${isLogin ? "Create account" : "Sign in"}</button></p>  `;
}
function topbar() {
  return "";
}
function shell(content, wide = false, options = {}) {
  const hideRail = options.hideRail || state.screen === "results";
  const shellClass = hideRail ? "workspace report-only" : "workspace";
  const contentClass = [
    wide ? "wide" : "",
    state.screen === "assessment" ? "assessment-flow" : "",
    hideRail ? "report-only" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `    <div class="${shellClass}">      ${hideRail ? "" : progressRail()}      <main class="content">        <div class="content-inner ${contentClass}">          ${content}        </div>      </main>    </div>  `;
}
function screenHeader(title, intro, stepText = "") {
  const assessmentStep =
    state.screen === "assessment"
      ? ""
      : '<span class="section-step-pill">Assessment</span>';
  return `    <div class="screen-head">      <div>        <p class="${state.screen === "assessment" && state.sectionIndex > 0 ? "eyebrow is-accent" : "eyebrow"}">${stepText || sectionEyebrow()}</p>        <h1>${title}</h1>        <p class="lead">${intro}</p>      </div>      ${assessmentStep}    </div>    <div class="notice is-hidden" id="sectionNotice">Please complete the required fields before continuing.</div>  `;
}
function sectionEyebrow() {
  if (state.screen === "assessment" && state.sectionIndex === 0)
    return "Assessment";
  if (state.screen === "assessment" && state.sectionIndex > 0)
    return `${assessmentGroupForSection(state.sectionIndex)?.label || "Assessment"} - ${sections[state.sectionIndex]}`;
  return "Assessment";
}
function practiceOverview() {
  return `    ${screenHeader("About Your Practice", "Help us tailor the assessment to your firm's specific environment")}    <div class="card-grid">      ${card("Practice Details", `        <div class="field-grid two">          ${field("companyName", "Firm Name", "text", "", "Smith & Associates CPA")}          ${field("primaryContact", "Primary Contact", "text", "", "John Smith, CPA")}          ${select("practiceType", "Practice Type", options.practiceTypes, "", "Select type")}          ${select("staffSize", "Number of Staff", options.staffSizes, "", "Select size")}          ${select("taxSoftware", "Tax Software Used", options.taxSoftware, "", "Select primary software")}          ${select("itManagement", "Current IT Management", options.itManagement, "", "How is IT currently handled?")}        </div>      `, "", "assessment-form-card assessment-form-card-expanded")}    </div>    ${footer("Continue")}  `;
}
function questionScreen(questionIndex) {
  const item = assessmentQuestions[questionIndex];
  const fieldName = `question_${questionIndex + 1}`;
  const currentValue = state.form[fieldName];
  const error = state.errors[fieldName];
  const optionRows = item.options
    .map(
      (option) =>
        `        <label class="choice">          <input type="radio" name="${fieldName}" value="${attr(option.label)}" ${currentValue === option.label ? "checked" : ""} data-radio="${fieldName}" />          <span>${option.label}</span>        </label>      `,
    )
    .join("");
  return `    ${screenHeader(item.question, item.context)}    <div class="card-grid">      ${card(sections[questionIndex + 1], `          <div class="assessment-question-body">            <div class="field assessment-question-field">              <span class="assessment-question-kicker">Response</span>            <span class="label">Choose the answer that best matches your current environment. *</span>            <div class="choice-grid">              ${optionRows}            </div>            <span class="error ${error ? "is-visible" : ""}">${error || ""}</span>          </div>          </div>        `, "", "assessment-form-card assessment-question-card")}    </div>    ${footer(questionIndex === assessmentQuestions.length - 1 ? "Review Answers" : "Continue")}  `;
}
function systemsScreen() {
  return `    ${screenHeader("How you receive and store data", "Identify the core platforms your firm uses to communicate with clients and prepare returns.")}    ${card("Core Systems", `      <div class="field-grid">        ${select("emailProvider", "Email Provider", options.emailProviders, "", "Select email provider...")}        ${field("emailUsers", "Number of Email Users", "number", "Include active users with access to firm email accounts.")}      </div>    `)}    ${footer("Continue")}  `;
}
function intakeScreen() {
  return `    ${screenHeader("How you receive and store data", "These answers help identify how taxpayer information moves into and through your firm.")}    <div class="card-grid two-col">      ${card("Taxpayer Materials", checkboxGroup("taxpayerMaterials", "How do you receive taxpayer materials? Choose all that apply.", options.materials, "Select every method clients currently use, even if occasional."))}      ${card("Work Model", checkboxGroup("workModel", "How does your team work? Choose all that apply.", options.workModel, "Select all operating models that apply to your firm."))}    </div>    ${footer("Continue")}  `;
}
function devicesScreen() {
  return `    ${screenHeader("How you receive and store data", "These questions assess where firm data lives and how it is protected from loss.")}    <div class="card-grid">      ${card("Devices", `        <div class="field-grid two">          ${field("computerCount", "How many computers total in your company?", "number")}          ${select("hasServer", "Do you have a server?", options.server, "A server includes a local file server, NAS, or hosted server used by the firm.")}        </div>      `)}      ${card("File Storage", radioGroup("fileStorage", "Where do you store company files?", options.storage, "", "two"))}      ${card("Backup", checkboxGroup("backups", "How do you currently back up your data? Choose all that apply.", options.backups, "Select every backup method currently used by the firm."))}    </div>    ${footer("Continue to Types of Data & Services")}  `;
}
function typesScreen() {
  return `    ${screenHeader("Types of data & services", "This helps estimate the volume and sensitivity of data handled by your firm.")}    <div class="card-grid two-col">      ${card("Return Volume", `        <div class="field-grid">          ${field("individualReturns", "Individual Returns (per year)", "number", "Approximate annual volume is acceptable. Enter 0 if none.")}          ${field("corporateReturns", "Corporate Returns (per year)", "number", "Approximate annual volume is acceptable. Enter 0 if none.")}        </div>      `)}      ${card("Services Offered", `        <div class="field-grid">          <div class="field"><span class="label">Do you offer bookkeeping services? *</span>${segmented("bookkeeping", ["Yes", "No"])}</div>          <div class="field"><span class="label">Do you offer payroll services? *</span>${segmented("payroll", ["Yes", "No"])}</div>          <div class="field"><span class="label">Do you sell insurance policies? *</span>${segmented("insurance", ["Yes", "No"])}</div>        </div>      `)}    </div>    ${footer("Continue")}  `;
}
function peopleScreen() {
  return `    ${screenHeader("Team members", "Include employees, partners, contractors, and vendors who view or handle client data. Add email and phone when possible for WISP signature requests.")}    <div class="card-grid">      ${peopleGroup("Team Members", "teamMembers", "Add team member", "No team members added yet.")}      ${peopleGroup("Contractors", "contractors", "Add contractor", "No contractors added yet.")}      ${vendorGroup()}    </div>    ${footer("Continue")}  `;
}
function peopleGroup(title, key, button, empty) {
  const list = state.form[key];
  return card(
    title,
    `    <div class="entry-list">      ${list.length ? list.map((person, index) => personCard(person, key, index)).join("") : `<div class="empty-state"><p>${empty}</p><button class="btn secondary small" data-add-entry="${key}" type="button">+ ${button}</button></div>`}      ${list.length ? `<button class="btn secondary small" data-add-entry="${key}" type="button">+ ${button}</button>` : ""}    </div>  `,
  );
}
function personCard(person, key, index) {
  const name = `${person.first || "Unnamed"} ${person.last || ""}`.trim();
  return `    <div class="summary-card">      <div class="summary-card-main">        <div class="summary-card-title">${escapeHtml(name)}</div>        <div class="summary-card-meta">${escapeHtml(person.role || "Access role not set")} ? ${escapeHtml(person.location || "Location not set")} ? Remote access: ${escapeHtml(person.remote || "Not set")}</div>        <div class="summary-card-meta">${escapeHtml(person.email || "No email")} ? ${escapeHtml(person.phone || "No phone")}</div>      </div>      <div class="action-cluster">        <button class="btn secondary small" data-edit-entry="${key}:${index}" type="button">Edit</button>        <button class="btn danger small" data-remove-entry="${key}:${index}" type="button">Remove</button>      </div>    </div>  `;
}
function vendorGroup() {
  const list = state.form.vendors;
  return card(
    "Vendors",
    `    <div class="entry-list">      ${list.length ? list.map((vendor, index) => `                  <div class="summary-card">                    <div>                      <div class="summary-card-title">${escapeHtml(vendor.name || "Unnamed vendor")}</div>                      <div class="summary-card-meta">Business vendor with possible client-data access</div>                    </div>                    <div class="action-cluster">                      <button class="btn secondary small" data-edit-entry="vendors:${index}" type="button">Edit</button>                      <button class="btn danger small" data-remove-entry="vendors:${index}" type="button">Remove</button>                    </div>                  </div>                `).join("") : `<div class="empty-state"><p>No vendors added yet.</p><button class="btn secondary small" data-add-entry="vendors" type="button">+ Add vendor</button></div>`}      ${list.length ? `<button class="btn secondary small" data-add-entry="vendors" type="button">+ Add vendor</button>` : ""}    </div>  `,
  );
}
function securityOfficerScreen() {
  return `    ${screenHeader("Security Officer", "Designate the qualified individual responsible for coordinating your information security program.")}    <div class="callout" style="margin-bottom:16px">      <span class="check">i</span>      <div>        <strong>IRS Requirement</strong>        The Gramm-Leach-Bliley Act requires you to designate a qualified individual to coordinate your information security program. This is typically the firm owner or a senior manager.      </div>    </div>    ${card("Designated Individual", `      <div class="field-grid two">        ${field("securityOfficerName", "Security Officer Name", "text", "", "Full name")}        ${field("securityOfficerTitle", "Title / Role", "text", "", "e.g., Owner, Managing Partner")}        ${field("securityOfficerEmail", "Security Officer Email", "email")}        ${field("securityOfficerPhone", "Security Officer Phone", "tel")}      </div>    `)}    ${footer("Continue")}  `;
}
function accessScreen() {
  const showMfa = ["Yes, on all systems", "Yes, on some systems"].includes(
    state.form.mfaStatus,
  );
  return `    ${screenHeader("Access & Protection", "These questions assess whether client data is protected from unauthorized access.")}    <div class="card-grid">      ${accessRosterCard()}      ${card("Multi-Factor Authentication", `        ${radioGroup("mfaStatus", "When you log into email, tax software, or cloud storage, do you use a second verification step in addition to your password?", options.mfa, "MFA means a second step after your password, such as a text code, authenticator app, or security key. The IRS requires this extra step for all tax preparers.", "two")}        <div class="conditional ${showMfa ? "is-visible" : ""}">          ${field("mfaMethod", "What MFA method?", "text", "Examples: text message, authenticator app, security key.", "e.g., authenticator app", true)}        </div>      `)}      ${card("Passwords", radioGroup("passwordPolicy", "Do you have a password policy?", options.password, "", "three"))}      ${card("Client Data Protection", radioGroup("dataProtection", "Is your client data protected so that only authorized people can read it?", options.dataProtection, "Choose Ã¢â‚¬Å“I don't knowÃ¢â‚¬Â if you are unsure. The results will identify this as an item to confirm.", "two"))}    </div>    ${footer("Continue")}  `;
}
function accessRosterCard() {
  const people = [
    ...state.form.teamMembers.map((person, index) => ({
      ...person,
      type: "Team member",
      key: `team-${index}`,
    })),
    ...state.form.contractors.map((person, index) => ({
      ...person,
      type: "Contractor",
      key: `contractor-${index}`,
    })),
  ];
  const body = people.length
    ? `      <div class="access-table">        <div class="access-table-head">          <span>Name</span>          <span>Remote Access</span>          <span>Access Role to Data</span>        </div>        ${people
        .map((person) => {
          const name =
            `${person.first || "Unnamed"} ${person.last || ""}`.trim();
          return `              <div class="access-table-row">                <label class="access-name">                  <input type="checkbox" checked disabled />                  <span>                    <strong>${escapeHtml(name)}</strong>                    <small>${escapeHtml(person.type)}</small>                  </span>                </label>                <span class="access-pill">${escapeHtml(person.remote || "Not set")}</span>                <span class="access-pill wide">${escapeHtml(person.role || "Access role not set")}</span>              </div>            `;
        })
        .join("")}      </div>    `
    : `      <div class="access-empty">        <p>No team members or contractors have been added yet.</p>      </div>    `;
  return card(
    "Who has access to client tax data?",
    `      ${body}      <button class="access-add-link" type="button" data-action="add-access-person">+ Add person with access</button>    `,
    "Select who has access to tax data and assign their role. Use + to add anyone missed in the previous step.",
  );
}
function physicalScreen() {
  return `    ${screenHeader("Physical Environment", "These questions assess basic physical safeguards around offices, visitors, and devices.")}    <div class="card-grid">      ${card("Office Setup", radioGroup("officeType", "What type of office do you have?", options.office, "", "two"))}      ${card("Facility Safeguards", `        <div class="field-grid">          <div class="field"><span class="label">Do you have a security alarm system? *</span>${segmented("alarm", ["Yes", "No"])}</div>          <div class="field"><span class="label">Do you have secure locks on doors? *</span>${segmented("locks", ["Yes", "No"])}</div>          ${radioGroup("visitorPolicy", "Do you have a visitor sign-in policy?", options.visitor, "", "two")}        </div>      `)}      ${card("Device Disposal", radioGroup("deviceDisposal", "How do you dispose of old computers and devices?", options.disposal, "Choose the method your firm currently uses most often.", "two"))}    </div>    ${footer("Continue")}  `;
}
function policiesScreen() {
  return `    ${screenHeader("Policies & Readiness", "These questions assess whether your firm is prepared to handle incidents, records, training, and outside support.")}    <div class="card-grid two-col">      ${card("Incident Readiness", `        <div class="field-grid">          ${radioGroup("breachHistory", "Have you ever experienced a data breach or suspicious activity?", options.breach, "", "three")}          ${radioGroup("incidentPlan", "Do you have a documented incident response plan?", options.incident, "A documented plan describes who responds, what steps are taken, and who must be contacted.")}        </div>      `)}      ${card("Records", `        <div class="field-grid">          ${select("recordYears", "How many years do you keep client records?", options.years)}          ${select("recordDisposal", "How do you dispose of old client records?", options.records)}        </div>      `)}      ${card("Training & Support", `        <div class="field-grid">          ${radioGroup("securityTraining", "Have you completed security awareness training?", options.training)}          <div class="field"><span class="label">Do you have IT support? *</span>${segmented("itSupport", ["Yes", "No"])}</div>        </div>      `)}      ${card("Other Vendors", textarea("otherVendors", "List any other third-party vendors with access to client data", "Include IT providers, cloud services, payroll platforms, outsourced bookkeeping, or other firms with client-data access."))}    </div>    ${footer("Review Answers")}  `;
}
function riskSaveStateLabel() {
  if (state.riskDraftStatus === "saving" || state.riskDraftStatus === "pending")
    return "Saving changes...";
  if (state.riskDraftStatus === "error")
    return "Saved locally, cloud sync failed";
  if (state.riskDraftSavedAt) return "All changes saved";
  return "Changes save automatically";
}
function footer(primary) {
  return `    <div class="footer-actions">      <button class="btn secondary" data-action="back" type="button">Back</button>      <div class="action-cluster">        <span class="save-state"><span class="save-dot"></span> ${riskSaveStateLabel()}</span>        <button class="btn primary" data-action="next" type="button">${primary}</button>      </div>    </div>  `;
}
function reviewScreen() {
  const attention = getFlags();

  return shell(
    `
      ${screenHeader("Review your answers", "Review or edit your submitted responses before generating your readiness results.", "Review")}
      <section class="review-simple-card">
        <div>
          <p class="review-overview-kicker">Final check</p>
          <h3>Review your submitted answers</h3>
          <p>Open the answer list to make any changes you need. When everything looks right, generate your results.</p>
        </div>
        <span>${sections.length} sections</span>
      </section>

      <details class="review-detail-drawer">
        <summary>
          <span>View and edit submitted answers</span>
          <small>${sections.length} sections</small>
        </summary>
        <div class="review-detail-content">
          <div class="review-grid">${sections.map((section, index) => reviewCard(section, index, attention)).join("")}</div>
        </div>
      </details>

      <div class="footer-actions review-footer-actions">
        <button class="btn secondary" data-action="back-to-last" type="button">Back</button>
        <div class="action-cluster">
          <span class="save-state"><span class="save-dot"></span> ${riskSaveStateLabel()}</span>
          <button class="btn primary" data-action="results" type="button">Generate results</button>
        </div>
      </div>
    `,
    true,
  );
}function reviewOverviewMetric(value, label) {
  return `    <div class="review-overview-metric">      <strong>${value}</strong>      <span>${label}</span>    </div>  `;
}
function reviewCard(title, index, attention = getFlags()) {
  const sectionFlags = attention.filter((flag) => flag.sectionIndex === index);
  const rows = reviewRows(index);
  const isPractice = index === 0;
  const item = isPractice ? null : assessmentQuestions[index - 1];
  return `    <section class="review-card ${sectionFlags.length ? "is-attention" : ""} ${isPractice ? "is-practice" : ""}">      <div class="review-card-head">        <div class="review-card-head-main">          <p class="review-card-kicker">${isPractice ? "Practice Details" : `${item.domain} &middot; Section ${String(index).padStart(2, "0")}`}</p>          <h3>${title}</h3>          <p class="review-card-subtext">${isPractice ? "Confirm the core firm profile that anchors the assessment and generated recommendations." : escapeHtml(item.question)}</p>        </div>        <div class="review-card-head-actions">          ${sectionFlags.length ? `<span class="badge attention">Needs attention</span>` : `<span class="badge complete">Complete</span>`}          <button class="btn secondary small" data-edit-section="${index}" type="button">Edit</button>        </div>      </div>      <div class="review-items ${isPractice ? "is-practice" : ""}">        ${rows.map(([label, value]) => reviewRowMarkup(label, value)).join("")}      </div>    </section>  `;
}
function reviewRowMarkup(label, value) {
  const formatted = formatValue(value);
  const isEmpty = formatted === "Not provided";
  const rowClass =
    label === "Selected Answer"
      ? "review-row is-answer"
      : label === "Domain"
        ? "review-row is-domain"
        : "review-row";
  return `    <div class="${rowClass}">      <span class="review-label">${label}</span>      <span class="review-value ${isEmpty ? "is-empty" : ""}">${escapeHtml(formatted)}</span>    </div>  `;
}
function reviewRows(index) {
  const form = state.form;
  if (index === 0) {
    return [
      ["Firm Name", form.companyName],
      ["Primary Contact", form.primaryContact],
      ["Practice Type", form.practiceType],
      ["Number of Staff", form.staffSize],
      ["Tax Software", form.taxSoftware],
      ["IT Management", form.itManagement],
    ];
  }
  return [["Selected Answer", form[`question_${index}`]]];
}
function formatValue(value) {
  if (Array.isArray(value))
    return value.length ? value.join(", ") : "Not provided";
  return value || "Not provided";
}
function resultsScreen() {
  const result = scoreAssessment();
  const domainSummary = summarizeDomainReadiness(result.sectionScores);
  const exposurePoints = topExposurePoints(result.flags);
  const topFindings = result.flags.slice(0, 3);

  const immediateCount = result.flags.filter(
    (flag) => flag.priority === "Immediate",
  ).length;

  return shell(
    `
      <div class="screen-head results-screen-head">
        <div>
          <p class="eyebrow">Assessment complete</p>
          <h1>Your WISP readiness summary</h1>
          <p class="lead">A quick view of where the firm stands and what to address before building the plan.</p>
        </div>
        <span class="section-step-pill">Completed</span>
      </div>
      <div class="results results--compact">
        <section class="results-hero ${severityClass(result.label)}">
          <div class="results-hero-score">
            <div class="results-hero-score-value">${result.overall}</div>
            <div class="results-hero-score-meta">Readiness score / 100</div>
            <span class="severity ${severityClass(result.label)}">${result.label}</span>
          </div>
          <div class="results-hero-copy">
            <p class="results-hero-kicker">Your assessment at a glance</p>
            <h2>${resultsAlertHeading(result)}</h2>
            <p>${result.summary}</p>
          </div>
        </section>

        <section class="results-quick-grid" aria-label="Assessment highlights">
          <article class="results-quick-stat">
            <span>Primary exposure</span>
            <strong>${escapeHtml(result.topArea)}</strong>
          </article>
          <article class="results-quick-stat">
            <span>Items to review</span>
            <strong>${result.flags.length}</strong>
          </article>
          <article class="results-quick-stat">
            <span>Immediate priority</span>
            <strong>${immediateCount ? `${immediateCount} item${immediateCount === 1 ? "" : "s"}` : "None"}</strong>
          </article>
        </section>

        <section class="card pad results-priority-card">
          <div class="card-head">
            <div class="card-title-block">
              <h3>Start here</h3>
              <p>The most important items surfaced by your answers.</p>
            </div>
          </div>
          <div class="results-priority-list">
            ${topFindings.map((flag, index) => compactRiskFinding(flag, index)).join("")}
          </div>
        </section>

        <section class="results-next-card">
          <div>
            <p class="results-hero-kicker">Next step</p>
            <h3>Turn these findings into your WISP</h3>
            <p>Your assessment is saved. The WISP Builder will use it as the foundation for the plan.</p>
          </div>
          <button class="btn primary" type="button" data-action="nav-builder-home">Continue to WISP Builder</button>
        </section>

        <details class="results-detail-drawer">
          <summary>
            <span>View detailed findings and recommendations</span>
            <small>All ${result.sectionScores.length - 1} scored sections</small>
          </summary>
          <div class="results-detail-content">
            <section class="results-alert-band ${severityClass(result.label)}">
              <div class="results-alert-band-head">
                <h3>What this means operationally</h3>
                <span class="results-alert-pill">${result.label}</span>
              </div>
              <div class="results-alert-list">
                ${exposurePoints.map((item) => `<div class="results-alert-item">${item}</div>`).join("")}
              </div>
            </section>
            <section class="card pad results-domain-section">
              <div class="card-head"><div class="card-title-block"><h3>Risk by control area</h3><p>Where gaps are clustering across the assessment.</p></div></div>
              <div class="results-domain-grid">${domainSummary.map((domain) => resultsDomainCard(domain)).join("")}</div>
            </section>
            <section class="card pad results-readiness-card">
              <div class="card-head"><div class="card-title-block"><h3>Section readiness</h3><p>Scores across all assessment sections.</p></div></div>
              <div class="score-table">${result.sectionScores.map((row) => `<div class="score-row"><strong>${row.name}</strong><div class="bar ${row.score < 55 ? "risk" : row.score < 75 ? "warn" : ""}"><span style="width:${row.score}%"></span></div><span class="severity ${row.score < 55 ? "high" : row.score < 75 ? "medium" : "good"}">${row.score} � ${scoreLabel(row.score)}</span></div>`).join("")}</div>
            </section>
            <section class="card pad">
              <div class="card-head"><div class="card-title-block"><h3>Full recommendation plan</h3><p>Use this sequence to reduce exposure over time.</p></div></div>
              ${recommendationBlock("Immediate", result.recommendations.immediate, "Address these first.")}
              ${recommendationBlock("Within 30 Days", result.recommendations.thirty, "Strengthen process and documentation gaps.")}
              ${recommendationBlock("Within 90 Days", result.recommendations.ninety, "Formalize the remaining safeguards.")}
            </section>
            <section class="card pad results-detail-narrative"><h3>Assessment summary</h3><p>${result.narrative}</p></section>
          </div>
        </details>

        <div class="footer-actions">
          <button class="btn secondary" data-action="review" type="button">Update answers</button>
          <button class="btn secondary" data-action="view-summary" type="button">View submitted answers</button>
        </div>
      </div>
    `,
    true,
  );
}
function compactRiskFinding(flag, index) {
  return `
    <article class="results-priority-item">
      <span class="results-priority-index">${String(index + 1).padStart(2, "0")}</span>
      <div>
        <strong>${escapeHtml(flag.title)}</strong>
        <p>${escapeHtml(flag.fix)}</p>
      </div>
      <span class="severity ${flag.priority === "Immediate" ? "high" : "medium"}">${escapeHtml(flag.priority)}</span>
    </article>
  `;
}function resultsAlertHeading(result) {
  if (result.overall < 40)
    return "Your current safeguards leave meaningful operational exposure across client data, access, and recovery controls.";
  if (result.overall < 60)
    return "Several core controls need immediate follow-through before this environment can be treated as reliably protected.";
  if (result.overall < 75)
    return "The environment shows progress, but too many safeguards still depend on partial coverage or undocumented practice.";
  return "The environment is trending in the right direction, but a few remaining gaps should still be documented and tightened.";
}
function resultsUrgencyCopy(result) {
  if (result.overall < 40)
    return "If one weak control fails during tax season, the surrounding gaps can compound quickly across firm operations, client trust, and recovery time. This is the stage where leadership should treat missing safeguards as business risk, not just IT cleanup.";
  if (result.overall < 60)
    return "The firm already has some safeguards in place, but the answers still point to control areas where inconsistent enforcement or missing documentation could create avoidable disruption under pressure.";
  if (result.overall < 75)
    return "This is a workable foundation, but the current state still relies on too much operational memory. The next step is making your stronger answers repeatable, documented, and consistent across the firm.";
  return "Most signals are moving in a healthy direction. The focus now is formalizing the remaining edge cases so the firm is not relying on informal habits to stay protected.";
}
function summarizeDomainReadiness(sectionScores) {
  const grouped = new Map();
  assessmentQuestions.forEach((item, index) => {
    const score = sectionScores[index + 1]?.score ?? 0;
    if (!grouped.has(item.domain)) grouped.set(item.domain, []);
    grouped.get(item.domain).push(score);
  });
  return [...grouped.entries()]
    .map(([domain, scores]) => {
      const score = Math.round(
        scores.reduce((sum, value) => sum + value, 0) / scores.length,
      );
      return { domain, score, label: scoreLabel(score) };
    })
    .sort((a, b) => a.score - b.score);
}
function resultsDomainCard(domain) {
  const tone =
    domain.score < 55 ? "is-critical" : domain.score < 75 ? "is-warning" : "";
  const barTone = domain.score < 55 ? "risk" : domain.score < 75 ? "warn" : "";
  return `    <article class="results-domain-card ${tone}">      <div class="results-domain-head">        <div>          <div class="results-domain-kicker">Control area</div>          <strong>${domain.score}<span>/100</span></strong>        </div>        <span class="severity ${domain.score < 55 ? "high" : domain.score < 75 ? "medium" : "good"}">${domain.label}</span>      </div>      <h4>${domain.domain}</h4>      <p class="results-domain-copy">${domain.score < 55 ? "This area is currently increasing risk and should be reviewed first." : domain.score < 75 ? "Coverage exists here, but it still depends on inconsistent or incomplete controls." : "This area is showing stronger answers and can serve as a baseline for the rest of the program."}</p>      <div class="results-domain-bar ${barTone}"><span style="width:${domain.score}%"></span></div>    </article>  `;
}
function topExposurePoints(flags) {
  const byArea = {
    "Data Security":
      "Sensitive client records may still be too exposed if file access, security policy, or device safeguards are inconsistent.",
    "Backup & Recovery":
      "A disruption during tax season could become a business continuity issue if backup routines and restore discipline are not reliable.",
    "Tax Software & Cloud":
      "Weaknesses around hosting and software availability can quickly turn into client-service delays when deadlines tighten.",
    "Email & Access":
      "Incomplete MFA, remote access, or email controls increase the chance that a single compromised account affects the wider firm.",
    "Device Management":
      "Unmanaged or aging workstations can create a larger attack surface and make response slower when something goes wrong.",
    Compliance:
      "If safeguards are not documented and enforced, the firm can look less prepared than leadership expects during a client or regulatory review.",
  };
  const mapped = [];
  flags.forEach((flag) => {
    const item =
      byArea[flag.area] ||
      `${flag.area} still shows answer patterns that could leave the firm relying on informal controls under pressure.`;
    if (!mapped.includes(item)) mapped.push(item);
  });
  if (!mapped.length) {
    mapped.push(
      "The submitted answers do not show any concentrated critical gaps, but the strongest controls should still be documented and reviewed on a regular cadence.",
    );
  }
  return mapped.slice(0, 4);
}
function recommendationBlock(title, items, helper = "") {
  const labelClass =
    title === "Immediate" ? "high" : title.includes("30") ? "medium" : "good";
  return `    <div class="recommendation" style="margin-bottom:12px">      <div class="recommendation-head">        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">          <h3>${title}</h3>          <span class="severity ${labelClass} recommendation-label">${title}</span>        </div>        ${helper ? `<p>${helper}</p>` : ""}      </div>      <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>    </div>  `;
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
function assessmentStepContent() {
  if (state.sectionIndex === 0) return practiceOverview();
  return questionScreen(state.sectionIndex - 1);
}
function assessmentScreen() {
  return shell(assessmentStepContent());
}
function drawer() {
  if (!state.drawer) return "";
  const { key, index } = state.drawer;
  const editing = index !== null && index !== undefined;
  const item = editing ? state.form[key][index] : {};
  const isVendor = key === "vendors";
  const title = `${editing ? "Edit" : "Add"} ${isVendor ? "Vendor" : key === "contractors" ? "Contractor" : "Team Member"}`;
  return `    <div class="drawer-backdrop is-open">      <aside class="drawer">        <div class="card-head">          <div class="card-title-block">            <h2>${title}</h2>            <p>${isVendor ? "Add the business name for vendors with client-data access." : "Add access details for people who handle client data."}</p>          </div>          <button class="btn ghost small" data-action="close-drawer" type="button">Close</button>        </div>        <div class="drawer-body">          ${isVendor ? `<label class="field"><span class="label">Business Name *</span><input class="input" data-drawer-field="name" value="${attr(item.name || "")}" /></label>` : `                <div class="field-grid two">                  <label class="field"><span class="label">First *</span><input class="input" data-drawer-field="first" value="${attr(item.first || "")}" /></label>                  <label class="field"><span class="label">Last *</span><input class="input" data-drawer-field="last" value="${attr(item.last || "")}" /></label>                </div>                <label class="field"><span class="label">Email <span class="optional">Optional</span></span><input class="input" type="email" data-drawer-field="email" value="${attr(item.email || "")}" /></label>                <label class="field"><span class="label">Phone <span class="optional">Optional</span></span><input class="input" type="tel" data-drawer-field="phone" value="${attr(item.phone || "")}" /></label>                <label class="field"><span class="label">Access Role to Data *</span><select class="select" data-drawer-field="role"><option value="">Access Role to Data...</option>${options.roles.map((choice) => `<option value="${attr(choice)}" ${item.role === choice ? "selected" : ""}>${choice}</option>`).join("")}</select></label>                <label class="field"><span class="label">Work location *</span><select class="select" data-drawer-field="location"><option value="">Work location...</option>${options.locations.map((choice) => `<option value="${attr(choice)}" ${item.location === choice ? "selected" : ""}>${choice}</option>`).join("")}</select></label>                <div class="field"><span class="label">Remote Access *</span><div class="segmented" data-drawer-segmented="remote"><button class="segment ${item.remote === "Yes" ? "is-active" : ""}" data-value="Yes" type="button">Yes</button><button class="segment ${item.remote === "No" ? "is-active" : ""}" data-value="No" type="button">No</button></div></div>              `}        </div>        <div class="drawer-footer">          <button class="btn secondary" data-action="close-drawer" type="button">Cancel</button>          <button class="btn primary" data-action="save-drawer" type="button">${isVendor ? "Save Vendor" : "Save Person"}</button>        </div>      </aside>    </div>  `;
}
function renderAssessmentInPlace() {
  const workspace = document.querySelector(".workspace");
  const railHost = workspace?.querySelector(".progress-rail");
  const contentInner = workspace?.querySelector(
    ".content-inner.assessment-flow",
  );
  if (!workspace || !railHost || !contentInner) return false;
  railHost.outerHTML = progressRail();
  const nextContentInner = document.querySelector(
    ".workspace .content-inner.assessment-flow",
  );
  if (!nextContentInner) return false;
  nextContentInner.innerHTML = assessmentStepContent();
  const contentShell = document.querySelector(".workspace .content");
  if (contentShell?.scrollTo)
    contentShell.scrollTo({ top: 0, left: 0, behavior: "auto" });
  bindEvents();
  lastRenderedScreen = state.screen;
  return true;
}
function syncAuthFormState() {
  const form = document.querySelector("[data-auth-form]");
  if (!form) return;
  const submit = form.querySelector("[data-auth-submit]");
  const feedback = form.querySelector("[data-auth-feedback]");
  const feedbackClass = state.authFeedbackTone === "success" ? "is-success" : "is-error";
  if (state.authError) {
    if (feedback) {
      feedback.textContent = state.authError;
      feedback.className = `auth-feedback ${feedbackClass}`;
    } else {
      const markup = `<p class="auth-feedback ${feedbackClass}" data-auth-feedback>${escapeHtml(state.authError)}</p>`;
      if (submit) submit.insertAdjacentHTML("beforebegin", markup);
      else form.insertAdjacentHTML("beforeend", markup);
    }
  } else {
    feedback?.remove();
  }
  if (submit) {
    submit.disabled = state.authBusy || state.authTransitioning;
    submit.classList.toggle("is-complete", state.authTransitioning);
    submit.textContent = state.authTransitioning
      ? "Signed in"
      : state.authBusy
        ? "Please wait..."
        : state.authMode === "login"
          ? "Sign in"
          : "Create account";
  }
}

function setAuthError(message = "", tone = "error") {
  state.authError = message;
  state.authFeedbackTone = tone;
  syncAuthFormState();
}

async function handleAuthSubmit() {
  const email = String(state.authEmail || "").trim();
  const isLogin = state.authMode === "login";
  if (!email) { setAuthError("Enter your email address."); return; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { setAuthError("Enter a valid email address."); return; }
  if (!isLogin && !state.authName?.trim()) { setAuthError("Enter your full name."); return; }
  if (!isLogin && !state.authFirmName?.trim()) { setAuthError("Enter your firm name."); return; }
  if (!state.authPassword || state.authPassword.length < 8) { setAuthError("Password must be at least 8 characters."); return; }
  if (!isLogin && state.authPassword !== state.authPasswordConfirm) { setAuthError("Passwords do not match."); return; }
  state.authBusy = true;
  setAuthError("");
  try {
    if (isLogin) {
      const result = await signInWithPassword(email, state.authPassword);
      if (result?.user) {
        beginAuthHandoff(result.user);
      }
      showToast("Signed in successfully.", "success");
    } else {
      const result = await signUpWithPassword({ email, password: state.authPassword, fullName: state.authName, firmName: state.authFirmName });
      if (!result?.session) { setAuthError("Account created. Check your email to confirm your address, then sign in.", "success"); return; }
      showToast("Your firm workspace is ready.", "success");
    }
  } catch (error) {
    const message = error?.message || "Unable to authenticate right now.";
    setAuthError(/email address .* is invalid/i.test(message) ? "This email needs to be a real, reachable inbox. Use an address you can access, then try again." : message);
  } finally {
    state.authBusy = false;
    syncAuthFormState();
  }
}function render() {
  if (state.authAvailable && !state.authReady) {
    app.innerHTML = `<div class="app"><main class="auth-shell"><section class="auth-card auth-card-loading"><p>Checking your workspace session...</p></section></main></div>`;
    lastRenderedScreen = null;
    return;
  }
  if (state.authAvailable && state.authTransitioning) {
    app.innerHTML = `<div class="app auth-app">${authScreen()}</div>`;
    bindEvents();
    lastRenderedScreen = null;
    return;
  }
  if (state.authAvailable && !state.authUser) {
    app.innerHTML = `<div class="app auth-app">${authScreen()}</div>`;
    bindEvents();
    lastRenderedScreen = null;
    return;
  }
  if (state.authAvailable && state.authUser && state.workspaceResolving) {
    app.innerHTML = `<div class="app"><main class="auth-shell"><section class="auth-card auth-card-loading"><p>Preparing your workspace...</p></section></main></div>`;
    lastRenderedScreen = null;
    return;
  }  if (state.authAvailable && state.authUser && state.onboarding && state.onboarding.status !== "completed") {
    app.innerHTML = `<div class="app onboarding-app">${onboardingScreen()}</div>`;
    bindEvents();
    lastRenderedScreen = "onboarding";
    return;
  }
  if (
    state.screen === "assessment" &&
    lastRenderedScreen === "assessment" &&
    !state.drawer &&
    renderAssessmentInPlace()
  ) {
    return;
  }
  const body =
    state.screen === "auth"
      ? authScreen()
      : state.screen === "home"
        ? homeScreen()
        : state.screen === "welcome"
          ? welcomeScreen()
          : state.screen === "builder"
            ? builderScreen()
            : state.screen === "documents"
              ? documentsScreen()
              : state.screen === "data-breach-notification-letter"
                ? dataBreachNotificationLetterScreen()
                : state.screen === "data-breach-response-guideline"
                  ? dataBreachResponseGuidelineScreen()
                  : state.screen === "incident-report"
                    ? incidentReportScreen()
                    : state.screen === "disaster-recovery-plan"
                      ? disasterRecoveryPlanScreen()
                      : state.screen === "record-retention-policy"
                        ? recordRetentionPolicyScreen()
                        : state.screen === "terminated-checklist"
                          ? terminatedEmployeeChecklistScreen()
                          : state.screen === "document-editor"
                            ? documentEditorScreen()
                            : state.screen === "training"
                              ? trainingScreen()
                              : state.screen === "settings"
                                ? settingsScreen()
                                : state.screen === "review"
                                  ? reviewScreen()
                                  : state.screen === "results"
                                    ? resultsScreen()
                                    : assessmentScreen();
  if (state.screen === "auth") {
    app.innerHTML = `<div class="app">${authScreen()}</div>`;
    bindEvents();
    lastRenderedScreen = state.screen;
    return;
  }
  app.innerHTML = `    <div class="app">      <div class="shell app-shell">        ${appNav()}        <div class="main-shell">          ${topbar()}          ${body}        </div>      </div>    </div>    ${drawer()}    ${renderWorkspaceUtilities()}  `;
  applyMotionStagger();
  wireDocumentOpenButtons();
  bindEvents();
  lastRenderedScreen = state.screen;
  queueBuilderPdfPreviewRender();
  queueTrainingPdfPreviewRender();
  if (state.builderLaunchAnimation) {
    clearTimeout(builderLaunchAnimationResetTimer);
    builderLaunchAnimationResetTimer = setTimeout(() => {
      if (!state.builderLaunchAnimation) return;
      state.builderLaunchAnimation = false;
      render();
    }, 900);
  }
}
function wireDocumentOpenButtons() {
  document.querySelectorAll("[data-open-template]").forEach((element) => {
    element.onclick = (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      openDocumentWorkspace(element.dataset.openTemplate);
    };
  });
  document.querySelectorAll("[data-open-workspace]").forEach((button) => {
    button.onclick = (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      openDocumentWorkspace(button.dataset.openWorkspace);
    };
  });
  document
    .querySelectorAll("[data-open-special-instance]")
    .forEach((button) => {
      button.onclick = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        openSpecialDocumentFromWorkspace(button.dataset.openSpecialInstance);
      };
    });
  document
    .querySelectorAll("[data-remove-special-instance]")
    .forEach((button) => {
      button.onclick = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        removeSpecialDocumentInstance(button.dataset.removeSpecialInstance);
      };
    });
  document
    .querySelectorAll("[data-new-terminated-checklist]")
    .forEach((button) => {
      button.onclick = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        openTerminatedEmployeeChecklist();
      };
    });
  document
    .querySelectorAll("[data-open-terminated-checklist]")
    .forEach((button) => {
      button.onclick = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        openTerminatedEmployeeChecklist(button.dataset.openTerminatedChecklist);
      };
    });
}
function applyMotionStagger() {
  if (["assessment", "review", "results"].includes(state.screen)) return;
  [
    ".progress-item",
    ".card",
    ".review-card",
    ".weakness",
    ".recommendation",
    ".score-row",
  ].forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.style.setProperty("--stagger", String(Math.min(index, 10)));
    });
  });
}
function bindEvents() {
  const onboardingForm = document.querySelector("[data-onboarding-form]");
  if (onboardingForm) onboardingForm.addEventListener("submit", (event) => { event.preventDefault(); submitOnboarding(); });
  document.querySelectorAll("[data-onboarding-back]").forEach((button) => button.addEventListener("click", async () => {
    const profile = onboardingFormProfile();
    state.onboardingSaving = true;
    render();
    try {
      state.onboarding = await saveFirmOnboardingProgress({ currentStep: Math.max(1, (Number(state.onboarding?.current_step) || 1) - 1), profile });
      state.onboardingStepDirection = "backward";
      state.onboardingStepMotion = true;
    } catch (error) {
      state.onboardingError = error?.message || "We couldn't save your progress.";
    } finally {
      state.onboardingSaving = false;
      render();
    }
  }));
  document.querySelectorAll("[data-onboarding-dashboard]").forEach((button) => button.addEventListener("click", () => finishOnboarding("dashboard")));
  document.querySelectorAll("[data-onboarding-logo]").forEach((input) => input.addEventListener("change", (event) => {
    const [file] = event.target.files || [];
    if (file) previewOnboardingLogo(file, input);
  }));
  const authForm = document.querySelector("[data-auth-form]");
  if (authForm) {
    authForm.addEventListener("submit", (event) => {
      event.preventDefault();
      handleAuthSubmit();
    });
  }
  document.querySelectorAll("[data-auth-email]").forEach((input) => {
    input.addEventListener("input", (event) => {
      state.authEmail = event.target.value;
      if (state.authError) {
        setAuthError("");
      }
    });
  });
  document.querySelectorAll("[data-auth-password]").forEach((input) => {
    input.addEventListener("input", (event) => {
      state.authPassword = event.target.value;
      if (state.authError) {
        setAuthError("");
      }
    });
  });
  document.querySelectorAll("[data-auth-password-confirm]").forEach((input) => {
    input.addEventListener("input", (event) => {
      state.authPasswordConfirm = event.target.value;
      if (state.authError) {
        setAuthError("");
      }
    });
  });
  document.querySelectorAll("[data-auth-name]").forEach((input) => {
    input.addEventListener("input", (event) => {
      state.authName = event.target.value;
      if (state.authError) {
        setAuthError("");
      }
    });
  });  document.querySelectorAll("[data-auth-firm-name]").forEach((input) => {
    input.addEventListener("input", (event) => {
      state.authFirmName = event.target.value;
      if (state.authError) setAuthError("");
    });
  });
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      switchAuthTab(button.dataset.authTab);
    });
  }); // Event delegation for dynamically added [data-auth-tab] inside the form wrap
  const authContainer = document.querySelector(".auth-split-form");
  if (authContainer && !authContainer.dataset.authDelegated) {
    authContainer.dataset.authDelegated = "1";
    authContainer.addEventListener("click", (e) => {
      const tabBtn = e.target.closest("[data-auth-tab]");
      if (tabBtn) switchAuthTab(tabBtn.dataset.authTab);
    });
  }
  function switchAuthTab(mode) {
    if (mode === state.authMode) return;
    state.authMode = mode;
    state.authError = "";
    const wrap = document.getElementById("auth-form-wrap");
    if (wrap) {
      wrap.style.opacity = "0";
      wrap.style.transform = "translateY(12px)";
      document
        .querySelectorAll(".auth-tab")
        .forEach((t) =>
          t.classList.toggle("is-active", t.dataset.authTab === mode),
        );
      setTimeout(() => {
        wrap.innerHTML = authFormContent();
        bindAuthFormEvents(wrap);
        wrap.style.opacity = "1";
        wrap.style.transform = "translateY(0)";
      }, 200);
    }
  }
  function bindAuthFormEvents(scope) {
    scope.querySelectorAll("[data-auth-form]").forEach((el) =>
      el.addEventListener("submit", (e) => {
        e.preventDefault();
        handleAuthSubmit();
      }),
    );
    scope.querySelectorAll("[data-auth-email]").forEach((el) =>
      el.addEventListener("input", (e) => {
        state.authEmail = e.target.value;
        if (state.authError) {
          state.authError = "";
        }
      }),
    );
    scope.querySelectorAll("[data-auth-password]").forEach((el) =>
      el.addEventListener("input", (e) => {
        state.authPassword = e.target.value;
      }),
    );
    scope.querySelectorAll("[data-auth-password-confirm]").forEach((el) =>
      el.addEventListener("input", (e) => {
        state.authPasswordConfirm = e.target.value;
      }),
    );
    scope.querySelectorAll("[data-auth-name]").forEach((el) =>
      el.addEventListener("input", (e) => {
        state.authName = e.target.value;
      }),
    );    scope.querySelectorAll("[data-auth-firm-name]").forEach((el) =>
      el.addEventListener("input", (e) => {
        state.authFirmName = e.target.value;
      }),
    );
    scope.querySelectorAll("[data-auth-toggle-password]").forEach((el) =>
      el.addEventListener("click", () => {
        state.authShowPassword = !state.authShowPassword;
        const pw = scope.querySelector("[data-auth-password]");
        if (pw) pw.type = state.authShowPassword ? "text" : "password";
      }),
    );
    scope
      .querySelectorAll("[data-action]")
      .forEach((el) =>
        el.addEventListener("click", () => handleAction(el.dataset.action)),
      );
  }
  document.querySelectorAll("[data-auth-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      state.authShowPassword = !state.authShowPassword;
      const passwordInput = document.querySelector("[data-auth-password]");
      if (passwordInput) passwordInput.type = state.authShowPassword ? "text" : "password";
    });
  });
  upgradeBuilderEditors();
  document.querySelectorAll("[data-field]").forEach((element) => {
    const handler = (event) => {
      softUpdateField(
        event.target.dataset.field,
        event.target.value,
        event.target,
      );
    };
    element.addEventListener("input", handler);
    element.addEventListener("change", handler);
  });
  document.querySelectorAll("[data-radio]").forEach((element) => {
    element.addEventListener("change", (event) => {
      const fieldName = event.target.dataset.radio;
      if (fieldName === "mfaStatus")
        toggleMfaMethodField(event.target.value, event.target);
      else softUpdateOption(fieldName, event.target.value, event.target);
    });
  });
  document.querySelectorAll("[data-checkbox]").forEach((element) => {
    element.addEventListener("change", (event) =>
      softToggleArray(
        event.target.dataset.checkbox,
        event.target.value,
        event.target,
      ),
    );
  });
  document.querySelectorAll("[data-segmented]").forEach((group) => {
    group.querySelectorAll(".segment").forEach((button) => {
      button.addEventListener("click", () => {
        group
          .querySelectorAll(".segment")
          .forEach((segment) => segment.classList.remove("is-active"));
        button.classList.add("is-active");
        softUpdateOption(group.dataset.segmented, button.dataset.value, group);
      });
    });
  }); // Keep header utilities reliable even when a page renders a legacy header without data-action attributes.
  const headerSearchButton = document.querySelector('[aria-label="Search"]');
  const headerNotificationsButton = document.querySelector(
    '[aria-label="Notifications"]',
  );
  const headerProfileButton = document.querySelector(
    '[aria-label="Open profile"]',
  );
  if (headerSearchButton)
    headerSearchButton.addEventListener("click", (event) => {
      event.stopImmediatePropagation();
      setState({ workspaceUtility: "search" });
    });
  if (headerNotificationsButton)
    headerNotificationsButton.addEventListener("click", (event) => {
      event.stopImmediatePropagation();
      setState({
        workspaceUtility:
          state.workspaceUtility === "notifications" ? null : "notifications",
      });
    });
  if (headerProfileButton)
    headerProfileButton.addEventListener("click", (event) => {
      event.stopImmediatePropagation();
      setState({
        workspaceUtility:
          state.workspaceUtility === "profile" ? null : "profile",
      });
    });
  bindActionButtons();
  document
    .querySelectorAll("[data-workspace-utility-close]")
    .forEach((overlay) => {
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) setState({ workspaceUtility: null });
      });
    });
  const workspaceSearchInput = document.querySelector(
    "[data-workspace-search-input]",
  );
  if (workspaceSearchInput) {
    workspaceSearchInput.focus();
    workspaceSearchInput.addEventListener("input", () => {
      const results = document.querySelector("[data-workspace-search-results]");
      if (results) {
        results.innerHTML = workspaceSearchResults(workspaceSearchInput.value);
        bindActionButtons(results);
      }
    });
  }
  bindWispSignatureDialog();
  document.querySelectorAll("[data-retention-title]").forEach((input) =>
    input.addEventListener("input", (event) => {
      state.recordRetentionPolicy.title =
        event.target.value || "Record Retention Policy";
      scheduleRecordRetentionPolicySave();
    }),
  );
  document.querySelectorAll("[data-retention-field]").forEach((input) =>
    input.addEventListener("input", (event) => {
      const key = event.target.dataset.retentionField;
      const instance = activeSpecialDocumentInstance();
      if (instance) {
        if (key === "core") {
          const [opening, ...rest] = event.target.value.split(/\n\s*\n/);
          instance.data.opening = opening || "";
          instance.data.compliance = rest.join("\n\n");
        } else instance.data[key] = event.target.value;
      }
      document
        .querySelectorAll(`[data-retention-field="${key}"]`)
        .forEach((peer) => {
          if (peer !== event.target) peer.value = event.target.value;
        });
      scheduleSpecialDocumentInstancesSync();
    }),
  );
  document
    .querySelectorAll("[data-special-save]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        saveActiveSpecialDocumentInstance(),
      ),
    );
  document.querySelectorAll("[data-retention-export]").forEach((button) =>
    button.addEventListener("click", () =>
      exportActiveRecordRetentionPolicyPdf().catch((error) => {
        console.warn("Retention policy export failed", error);
        alert("Unable to export the record retention policy right now.");
      }),
    ),
  );
  document.querySelectorAll("[data-disaster-export]").forEach((button) =>
    button.addEventListener("click", () =>
      exportActiveDisasterRecoveryPlanPdf().catch((error) => {
        console.warn("Disaster recovery PDF export failed", error);
        alert("Unable to export the disaster recovery plan right now.");
      }),
    ),
  );
  document
    .querySelectorAll("[data-new-terminated-checklist]")
    .forEach((button) =>
      button.addEventListener("click", () => openTerminatedEmployeeChecklist()),
    );
  document
    .querySelectorAll("[data-open-terminated-checklist]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        openTerminatedEmployeeChecklist(button.dataset.openTerminatedChecklist),
      ),
    );
  document.querySelectorAll("[data-terminated-field]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const checklist = activeTerminatedEmployeeChecklist();
      if (!checklist) return;
      checklist[event.target.dataset.terminatedField] = event.target.value;
      checklist.updatedAt = new Date().toISOString();
      state.terminatedEmployeeChecklistEditor = checklist;
      scheduleTerminatedEmployeeChecklistSave();
    });
  });
  document.querySelectorAll("[data-terminated-check]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const checklist = activeTerminatedEmployeeChecklist();
      if (!checklist) return;
      checklist.data.checked[event.target.dataset.terminatedCheck] =
        event.target.checked;
      checklist.updatedAt = new Date().toISOString();
      state.terminatedEmployeeChecklistEditor = checklist;
      scheduleTerminatedEmployeeChecklistSave();
      const progress = document.querySelector(
        "[data-terminated-progress-count]",
      );
      if (progress)
        progress.textContent = `${checklistCompletionCount(checklist)} of ${terminatedChecklistItems.filter((item) => item.key).length} items completed`;
    });
  });
  document
    .querySelectorAll("[data-terminated-save]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        saveActiveTerminatedEmployeeChecklist(),
      ),
    );
  document
    .querySelectorAll("[data-terminated-complete]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        completeTerminatedEmployeeChecklist(),
      ),
    );
  document.querySelectorAll("[data-terminated-export]").forEach((button) =>
    button.addEventListener("click", () =>
      exportActiveTerminatedEmployeeChecklistPdf().catch((error) => {
        console.warn("Checklist PDF export failed", error);
        alert("Unable to export this checklist as a PDF right now.");
      }),
    ),
  );
  document
    .querySelectorAll("[data-breach-letter-export]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        exportActiveDataBreachNotificationLetterPdf(),
      ),
    );
  document
    .querySelectorAll("[data-breach-guideline-export]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        exportActiveDataBreachResponseGuidelinePdf().catch((error) => {
          console.warn("Data breach guideline export failed", error);
          alert(
            "Unable to export the data breach response guideline right now.",
          );
        }),
      ),
    );
  document.querySelectorAll("[data-incident-field]").forEach((input) =>
    input.addEventListener("input", (event) => {
      const instance = activeSpecialDocumentInstance();
      if (instance) {
        instance.data[event.target.dataset.incidentField] = event.target.value;
        scheduleSpecialDocumentInstancesSync();
      } else {
        state.incidentReport = normalizeIncidentReport(state.incidentReport);
        state.incidentReport.data[event.target.dataset.incidentField] =
          event.target.value;
        scheduleIncidentReportSave();
      }
    }),
  );
  document.querySelectorAll("[data-incident-export]").forEach((button) =>
    button.addEventListener("click", () =>
      exportActiveIncidentReportPdf().catch((error) => {
        console.warn("Incident report export failed", error);
        alert("Unable to export the incident report right now.");
      }),
    ),
  );
  document.querySelectorAll("[data-training-search]").forEach((input) => {
    input.addEventListener("input", (event) => {
      state.trainingQuery = event.target.value;
      render();
    });
  });
  document
    .querySelectorAll("[data-training-asset-action]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const groupKey = button.dataset.trainingGroup;
        const index = Number(button.dataset.trainingIndex);
        const action = button.dataset.trainingAssetAction;
        if (action === "view") openTrainingAssetPreview(groupKey, index);
        else if (action === "download") downloadTrainingAsset(groupKey, index);
        else if (action === "primary") {
          const item = state.trainingAssets?.[groupKey]?.[index];
          const previewTarget = String(
            item?.filename || resolveTrainingAssetUrl(item) || "",
          ).toLowerCase();
          if (previewTarget.endsWith(".pdf"))
            openTrainingAssetPreview(groupKey, index);
          else downloadTrainingAsset(groupKey, index);
        }
      });
    });
  document.querySelectorAll("[data-settings-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.settingsTab = button.dataset.settingsTab;
      render();
    });
  });
  const paymentForm = document.querySelector("[data-payment-card-form]");
  if (paymentForm) {
    const field = (name) =>
      paymentForm.querySelector(`[data-payment-card-field="${name}"]`);
    const preview = (name) =>
      document.querySelector(`[data-payment-preview-${name}]`);
    const refreshPreview = () => {
      const number = field("number")?.value || "";
      const digits = number.replace(/\D/g, "");
      const holder = (field("holder")?.value || "YOUR NAME")
        .trim()
        .toUpperCase();
      const month = field("month")?.value || "MM";
      const year = field("year")?.value
        ? String(field("year").value).slice(-2)
        : "YY";
      const numberNode = preview("number");
      if (numberNode)
        numberNode.textContent = digits
          ? `${digits.slice(0, 4).padEnd(4, "Ã¯Â¿Â½")} Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ ${digits.slice(-4).padStart(4, "Ã¯Â¿Â½")}`
          : "Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½";
      const holderNode = preview("holder");
      if (holderNode) holderNode.textContent = holder;
      const brandNode = preview("brand");
      if (brandNode) brandNode.textContent = paymentCardBrand(digits);
      const expiryNode = preview("expiry");
      if (expiryNode) expiryNode.textContent = `${month} / ${year}`;
    };
    paymentForm
      .querySelectorAll("[data-payment-card-field]")
      .forEach((input) => {
        input.addEventListener("input", () => {
          if (input.dataset.paymentCardField === "number")
            input.value = formatPaymentCardNumber(input.value);
          if (input.dataset.paymentCardField === "cvv")
            input.value = input.value.replace(/\D/g, "");
          refreshPreview();
        });
        input.addEventListener("change", refreshPreview);
      });
    refreshPreview();
    paymentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const digits = (field("number")?.value || "").replace(/\D/g, "");
      const holder = (field("holder")?.value || "").trim();
      const month = field("month")?.value || "";
      const year = field("year")?.value || "";
      const cvv = (field("cvv")?.value || "").replace(/\D/g, "");
      const contact = (field("contact")?.value || "").trim();
      const address = (field("address")?.value || "").trim();
      if (
        digits.length < 12 ||
        !holder ||
        !month ||
        !year ||
        cvv.length < 3 ||
        !contact.includes("@") ||
        !address
      ) {
        showToast("Complete valid card and billing details", "error");
        return;
      }
      const brand = paymentCardBrand(digits);
      state.settingsTab = "billing";
      updateSettingsState(
        (draft) => {
          draft.billing.paymentMethod = `${brand === "CARD" ? "Card" : brand[0] + brand.slice(1).toLowerCase()} ending in ${digits.slice(-4)}`;
          draft.billing.cardLast4 = digits.slice(-4);
          draft.billing.cardholder = holder;
          draft.billing.cardBrand = brand;
          draft.billing.billingContact = contact;
          draft.billing.billingAddress = address;
        },
        "Payment Method Updated",
        `Updated saved card ending in ${digits.slice(-4)}`,
        { immediate: true },
      );
      showToast("Payment method updated", "success");
    });
  }
  document.querySelectorAll("[data-service-select]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedAdditionalService = button.dataset.serviceSelect || null;
      render();
    });
  });
  const staffForm = document.querySelector("[data-staff-form]");
  if (staffForm) {
    staffForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const fields = Object.fromEntries(
        [...staffForm.querySelectorAll("[data-staff-field]")].map((field) => [
          field.dataset.staffField,
          field.value.trim(),
        ]),
      );
      if (
        !fields.email ||
        !fields.email.includes("@") ||
        !fields.firstName ||
        !fields.title ||
        !fields.type
      ) {
        showToast(
          "Complete all staff details with a valid email address",
          "error",
        );
        return;
      }
      const editingId = state.editingStaffId;
      const existing = editingId
        ? getSettingsData().staff.find((member) => member.id === editingId)
        : null;
      try {
        const saved = await saveFirmStaffMember({
          id: editingId || undefined,
          full_name: `${fields.firstName} ${fields.lastName}`.trim(),
          email: fields.email,
          role_title: fields.title,
          wisp_role: existing?.wisp_role || null,
          source: existing?.source || "settings",
        });
        const normalized = normalizeSettingsData({ staff: [saved] }).staff[0];
        state.showStaffDialog = false;
        state.editingStaffId = null;
        updateSettingsState(
          (draft) => {
            const index = draft.staff.findIndex((member) => member.id === normalized.id);
            if (index >= 0) draft.staff[index] = normalized;
            else draft.staff.unshift(normalized);
          },
          "Staff Updated",
          `${editingId ? "Updated" : "Added"} staff record for ${fields.firstName} ${fields.lastName}`,
          { immediate: true },
        );
        showToast(editingId ? "Staff member updated" : "Staff member added", "success");
      } catch (error) {
        console.warn("Staff save failed", error);
        showToast(error?.message || "Unable to save staff member", "error");
      }
    });
  }
  document.querySelectorAll("[data-settings-action]").forEach((button) => {
    button.addEventListener("click", () => {
      handleSettingsAction(button.dataset.settingsAction);
    });
  });
  document.querySelectorAll("[data-settings-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      handleSettingsPlanSelection(button.dataset.settingsPlan);
    });
  });
  document.querySelectorAll("[data-settings-mfa-method]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.querySelector("[data-settings-modal-field]");
      if (!input) return;
      input.value = button.dataset.settingsMfaMethod || "";
      document
        .querySelectorAll("[data-settings-mfa-method]")
        .forEach((method) =>
          method.classList.toggle("is-selected", method === button),
        );
      input.focus();
    });
  });
  document.querySelectorAll("[data-settings-save-modal]").forEach((button) => {
    button.addEventListener("click", async () => {
      const modal = state.settingsModal;
      if (!modal) return;
      const input = document.querySelector("[data-settings-modal-field]");
      const nextValue = (input?.value || "").trim();
      const settings = getSettingsData();
      if (modal.type === "company") {
        const fields = Object.fromEntries(
          [...document.querySelectorAll("[data-company-profile-field]")].map(
            (field) => [field.dataset.companyProfileField, field.value.trim()],
          ),
        );
        if (
          !fields.name ||
          !fields.address ||
          !fields.city ||
          !fields.state ||
          !fields.zip ||
          !fields.phone ||
          !fields.email
        ) {
          showToast("Complete all company profile fields", "error");
          return;
        }
        if (!fields.email.includes("@")) {
          showToast("Enter a valid company email address", "error");
          return;
        }
        const cityStateZip = [
          fields.city,
          [fields.state.toUpperCase(), fields.zip].filter(Boolean).join(" "),
        ]
          .filter(Boolean)
          .join(", ");
        const fullAddress = [fields.address, cityStateZip]
          .filter(Boolean)
          .join(", ");
        try {
          const savedFirm = await saveFirmProfile({
            name: fields.name,
            primaryContact: state.form.primaryContact,
          });
          if (savedFirm) state.firmProfile = savedFirm;
        } catch (error) {
          console.warn("Company record sync failed", error);
          showToast(
            "Company record could not be confirmed by Supabase.",
            "error",
          );
          return;
        }
        state.form.companyName = fields.name;
        state.form.streetAddress = fields.address;
        state.form.city = fields.city;
        state.form.state = fields.state.toUpperCase();
        state.form.postalCode = fields.zip;
        state.form.officePhone = fields.phone;
        state.form.email = fields.email;
        state.firmProfile = {
          ...(state.firmProfile || {}),
          name: fields.name,
          email: fields.email,
        };
        await updateSettingsState(
          (draft) => {
            draft.company.address = fullAddress;
            draft.company.phone = fields.phone;
            draft.company.email = fields.email;
          },
          modal.activity,
          "Company profile details updated",
          { immediate: true },
        );
        state.settingsModal = null;
        render();
      } else if (modal.type === "email") {
        if (!nextValue || !nextValue.includes("@")) {
          showToast("Enter a valid email address", "error");
          return;
        }
        try {
          const updatedUser = await updateWorkspaceAuthProfile({
            email: nextValue,
          });
          if (updatedUser) state.authUser = updatedUser;
        } catch (error) {
          console.warn("Sign-in email update failed", error);
          showToast("Supabase could not update the sign-in email.", "error");
          return;
        }
        await updateSettingsState(
          (draft) => {
            draft.profile.email = nextValue;
          },
          modal.activity,
          `Profile email changed to ${nextValue}`,
          { immediate: true },
        );
        state.settingsModal = null;
        render();
      } else if (modal.type === "password") {
        if (nextValue.length < 8) {
          showToast("Password must be at least 8 characters", "error");
          return;
        }
        try {
          const updatedUser = await updateWorkspaceAuthProfile({
            password: nextValue,
          });
          if (updatedUser) state.authUser = updatedUser;
        } catch (error) {
          console.warn("Password update failed", error);
          showToast("Supabase could not update the password.", "error");
          return;
        }
        await updateSettingsState(
          (draft) => {
            draft.profile.passwordUpdatedAt = new Date().toISOString();
          },
          modal.activity,
          "Password updated",
          { immediate: true },
        );
        state.settingsModal = null;
        render();
      } else if (modal.type === "mfa-password") {
        if (!nextValue) {
          showToast("Enter your password", "error");
          return;
        }
        state.settingsModal = {
          type: "mfa-setup",
          title: "Set up MFA",
          label: "MFA method",
          currentValue: settings.profile.mfaMethod,
          saveLabel: "Enable MFA",
          activity: "Security Updated",
          detail: "MFA method changed",
        };
        render();
      } else if (modal.type === "mfa-setup") {
        if (!nextValue) {
          showToast("Enter an MFA method", "error");
          return;
        }
        updateSettingsState(
          (draft) => {
            draft.profile.mfaEnabled = true;
            draft.profile.mfaMethod = nextValue;
            draft.profile.mfaVerifiedOn = new Date().toISOString();
          },
          modal.activity,
          `MFA method changed to ${nextValue}`,
        );
        state.settingsModal = null;
        render();
      }
    });
  });
  document
    .querySelectorAll("[data-action][data-action='close-settings-modal']")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        state.settingsModal = null;
        render();
      });
    });
  document.querySelectorAll("[data-user-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      handleSettingsUserAction(
        button.dataset.userId,
        button.dataset.userAction,
      );
    });
  });
  document.querySelectorAll("[data-staff-select]").forEach((input) => {
    input.addEventListener("change", () => {
      const selected = new Set(state.selectedStaffIds || []);
      if (input.checked) selected.add(input.dataset.staffSelect);
      else selected.delete(input.dataset.staffSelect);
      state.selectedStaffIds = [...selected];
      render();
    });
  });
  document
    .querySelectorAll("[data-acknowledgement-staff-select]")
    .forEach((input) => {
      input.addEventListener("change", () => {
        const selected = new Set(state.acknowledgingSignerIds || []);
        if (input.checked)
          selected.add(input.dataset.acknowledgementStaffSelect);
        else selected.delete(input.dataset.acknowledgementStaffSelect);
        state.acknowledgingSignerIds = [...selected];
        render();
      });
    });
  const selectAllStaff = document.querySelector("[data-staff-select-all]");
  if (selectAllStaff) {
    selectAllStaff.addEventListener("change", () => {
      state.selectedStaffIds = selectAllStaff.checked
        ? getSettingsData().staff.map((member) => member.id)
        : [];
      render();
    });
  }
  const deleteSelectedStaff = document.querySelector(
    "[data-staff-delete-selected]",
  );
  if (deleteSelectedStaff) {
    deleteSelectedStaff.addEventListener("click", async () => {
      const selectedIds = new Set(state.selectedStaffIds || []);
      if (!selectedIds.size) return;
      try {
        await Promise.all([...selectedIds].map((id) => deleteFirmStaffMember(id)));
      } catch (error) {
        console.warn("Selected staff removal failed", error);
        showToast(error?.message || "Unable to remove selected staff", "error");
        return;
      }
      updateSettingsState(
        (draft) => {
          draft.staff = draft.staff.filter(
            (member) => !selectedIds.has(member.id),
          );
        },
        "Staff Updated",
        `Removed ${selectedIds.size} selected staff ${selectedIds.size === 1 ? "record" : "records"}`,
      );
      state.selectedStaffIds = [];
      showToast("Selected staff removed", "success");
    });
  }
  document.querySelectorAll("[data-staff-remove]").forEach((button) => {
    button.addEventListener("click", async () => {
      handleStaffRemove(button.dataset.staffRemove);
    });
  });
  document.querySelectorAll("[data-staff-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      state.editingStaffId = button.dataset.staffEdit;
      state.showStaffDialog = true;
      render();
    });
  });
  document.querySelectorAll("[data-builder-status-tab]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.builderTab = button.dataset.builderStatusTab;
      state.builderResumeEditing = false;
      render();
    });
  });
  document
    .querySelectorAll("[data-download-wisp-version]")
    .forEach((button) => {
      button.addEventListener("click", () =>
        downloadStoredWispFile(
          state.wispVersions[Number(button.dataset.downloadWispVersion)],
        ),
      );
    });
  document
    .querySelectorAll("[data-download-completed-wisp]")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        downloadStoredWispFile({
          downloadUrl: button.dataset.downloadUrl,
          fileName: button.dataset.downloadName,
        });
      });
    });
  document.querySelectorAll("[data-settings-logo]").forEach((input) => {
    input.addEventListener("change", async (event) => {
      const [file] = event.target.files || [];
      event.target.value = "";
      if (!file) return;
      await applyCompanyLogoFile(file);
    });
  });
  document.querySelectorAll("[data-settings-logo-dropzone]").forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("is-dragover");
    });
    zone.addEventListener("dragleave", () => {
      zone.classList.remove("is-dragover");
    });
    zone.addEventListener("drop", async (event) => {
      event.preventDefault();
      zone.classList.remove("is-dragover");
      const [file] = event.dataTransfer?.files || [];
      if (!file) return;
      await applyCompanyLogoFile(file);
    });
  });
  document.querySelectorAll("[data-settings-logo-remove]").forEach((button) => {
    button.addEventListener("click", async () => {
      clearCompanyLogo();
    });
  });
  document.querySelectorAll("[data-builder-topic]").forEach((button) => {
    button.addEventListener("click", async () => {
      state.builderTopicIndex = Number(button.dataset.builderTopic);
      scheduleBuilderDraftSync({ status: "draft" });
      render();
    });
  });
  document.querySelectorAll("[data-builder-nav]").forEach((button) => {
    button.addEventListener("click", async () => {
      const dir = button.dataset.builderNav;
      if (dir === "prev" && state.builderTopicIndex > 0)
        state.builderTopicIndex--;
      if (dir === "next" && state.builderTopicIndex < builderTopics.length - 1)
        state.builderTopicIndex++;
      scheduleBuilderDraftSync({ status: "draft" });
      render();
    });
  });
  document.querySelectorAll("[data-builder-editor]").forEach((element) => {
    const editorId = element.dataset.builderEditor;
    const sync = () => {
      persistBuilderEditor(editorId);
      saveBuilderSelection(editorId);
      syncBuilderEditorUi(editorId);
    };
    element.addEventListener("input", (event) => {
      persistBuilderEditor(event.target.dataset.builderEditor);
      syncBuilderEditorUi(editorId);
    });
    element.addEventListener("focus", () => {
      syncBuilderEditorUi(editorId);
    });
    element.addEventListener("mouseup", () => {
      saveBuilderSelection(editorId);
      syncBuilderEditorUi(editorId);
    });
    element.addEventListener("keyup", () => {
      saveBuilderSelection(editorId);
      syncBuilderEditorUi(editorId);
    });
    element.addEventListener("paste", () => {
      setTimeout(sync, 0);
    });
  });
  document.querySelectorAll("[data-editor-command]").forEach((button) => {
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", () =>
      handleBuilderEditorCommand(
        button.dataset.editorId,
        button.dataset.editorCommand,
      ),
    );
  });
  document.querySelectorAll("[data-editor-style]").forEach((selectElement) => {
    selectElement.addEventListener("mousedown", (event) =>
      event.stopPropagation(),
    );
    selectElement.addEventListener("change", () =>
      handleBuilderEditorStyle(
        selectElement.dataset.editorStyle,
        selectElement.value,
      ),
    );
  });
  document.querySelectorAll("[data-editor-action='link']").forEach((button) => {
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", () =>
      openBuilderLinkPopover(button.dataset.editorId),
    );
  });
  document.querySelectorAll("[data-editor-link-apply]").forEach((button) => {
    button.addEventListener("click", () =>
      applyBuilderLink(button.dataset.editorLinkApply),
    );
  });
  document.querySelectorAll("[data-editor-link-remove]").forEach((button) => {
    button.addEventListener("click", () =>
      removeBuilderLink(button.dataset.editorLinkRemove),
    );
  });
  document.querySelectorAll("[data-editor-link-cancel]").forEach((button) => {
    button.addEventListener("click", () =>
      closeBuilderLinkPopover(button.dataset.editorLinkCancel),
    );
  });
  document
    .querySelectorAll("[data-editor-link-url], [data-editor-link-text]")
    .forEach((input) => {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          const editorId =
            input.dataset.editorLinkUrl || input.dataset.editorLinkText;
          applyBuilderLink(editorId);
        }
        if (event.key === "Escape") {
          event.preventDefault();
          const editorId =
            input.dataset.editorLinkUrl || input.dataset.editorLinkText;
          closeBuilderLinkPopover(editorId);
        }
      });
    });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (
      target.closest(".builder-link-popover") ||
      target.closest("[data-editor-action='link']")
    )
      return;
    closeAllBuilderLinkPopovers();
  });
  document.querySelectorAll("[data-builder-editor]").forEach((element) => {
    syncBuilderEditorUi(element.dataset.builderEditor);
  });
  document.querySelectorAll("[data-builder-upload]").forEach((input) => {
    input.addEventListener("change", (event) => {
      addBuilderAttachments(event.target.files);
      event.target.value = "";
    });
  });
  document.querySelectorAll("[data-builder-upload-zone]").forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("is-dragover");
    });
    zone.addEventListener("dragleave", () => {
      zone.classList.remove("is-dragover");
    });
    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      zone.classList.remove("is-dragover");
      addBuilderAttachments(event.dataTransfer?.files);
    });
  });
  document.querySelectorAll("[data-remove-attachment]").forEach((button) => {
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.removeAttachment);
      const attachment = state.builderAttachments[index];
      if (!attachment) return;
      try {
        await deleteWispAttachment(attachment);
        state.builderAttachments.splice(index, 1);
        invalidateBuilderMergedPdfForAttachments();
        showToast("Attachment removed", "success");
        render();
      } catch (error) {
        console.error("WISP attachment removal failed", error);
        showToast("Unable to remove the stored attachment", "error");
      }
    });
  });
  document.querySelectorAll("[data-attachment-index]").forEach((item) => {
    item.addEventListener("dragstart", (event) => {
      event.dataTransfer?.setData("text/plain", item.dataset.attachmentIndex);
    });
    item.addEventListener("dragover", (event) => {
      event.preventDefault();
      item.classList.add("is-drop-target");
    });
    item.addEventListener("dragleave", () => {
      item.classList.remove("is-drop-target");
    });
    item.addEventListener("drop", (event) => {
      event.preventDefault();
      item.classList.remove("is-drop-target");
      const fromIndex = Number(event.dataTransfer?.getData("text/plain"));
      const toIndex = Number(item.dataset.attachmentIndex);
      reorderBuilderAttachments(fromIndex, toIndex);
    });
  });
  document.querySelectorAll("[data-jump-section]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (state.screen === "assessment")
        setState({
          sectionIndex: Number(button.dataset.jumpSection),
          section2Substep: 0,
          errors: {},
        });
    });
  });
  document.querySelectorAll("[data-jump-substep]").forEach((button) => {
    button.addEventListener("click", () =>
      setState({
        section2Substep: Number(button.dataset.jumpSubstep),
        errors: {},
      }),
    );
  });
  document.querySelectorAll("[data-add-entry]").forEach((button) => {
    button.addEventListener("click", () =>
      setState({
        drawer: { key: button.dataset.addEntry, index: null, draft: {} },
      }),
    );
  });
  document.querySelectorAll("[data-edit-entry]").forEach((button) => {
    button.addEventListener("click", async () => {
      const [key, index] = button.dataset.editEntry.split(":");
      setState({
        drawer: {
          key,
          index: Number(index),
          draft: { ...state.form[key][Number(index)] },
        },
      });
    });
  });
  document.querySelectorAll("[data-remove-entry]").forEach((button) => {
    button.addEventListener("click", async () => {
      const [key, index] = button.dataset.removeEntry.split(":");
      if (
        !confirm("Remove this entry? This will remove it from the assessment.")
      )
        return;
      state.form[key].splice(Number(index), 1);
      render();
    });
  });
  document.querySelectorAll("[data-edit-section]").forEach((button) => {
    button.addEventListener("click", () =>
      setState({
        screen: "assessment",
        sectionIndex: Number(button.dataset.editSection),
        section2Substep: 0,
        errors: {},
      }),
    );
  });
  document.querySelectorAll("[data-documents-upload]").forEach((input) => {
    input.addEventListener("change", async (event) => {
      const files = Array.from(event.target.files || []);
      event.target.value = "";
      await addDocumentsFiles(files);
    });
  });
  document.querySelectorAll("[data-open-document]").forEach((button) => {
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.openDocument);
      openStoredDocument(state.documentsFiles[index]);
    });
  });
  document.querySelectorAll("[data-download-document]").forEach((button) => {
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.downloadDocument);
      downloadStoredDocument(state.documentsFiles[index]);
    });
  });
  document.querySelectorAll("[data-remove-document]").forEach((button) => {
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.removeDocument);
      const record = state.documentsFiles[index];
      try {
        await deleteDocument(record);
      } catch (error) {
        console.warn("Stored document removal failed", error);
        showToast("Unable to remove the stored file", "error");
        return;
      }
      state.documentsFiles.splice(index, 1);
      if (state.dashboardData) {
        state.dashboardData = {
          ...state.dashboardData,
          documents_count: Math.max(
            0,
            (state.dashboardData.documents_count ||
              state.documentsFiles.length + 1) - 1,
          ),
          updated_at: new Date().toISOString(),
        };
      }
      render();
      if (!record?.storagePath) return;
      try {
        await deleteDocument(record);
      } catch (error) {
        console.warn("Document delete skipped", error);
      }
    });
  });
  document.querySelectorAll("[data-open-template]").forEach((element) => {
    element.addEventListener("click", () =>
      openDocumentWorkspace(element.dataset.openTemplate),
    );
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDocumentWorkspace(element.dataset.openTemplate);
      }
    });
  });
  document.querySelectorAll("[data-open-workspace]").forEach((button) => {
    button.addEventListener("click", () =>
      openDocumentWorkspace(button.dataset.openWorkspace),
    );
  });
  document.querySelectorAll("[data-remove-workspace]").forEach((button) => {
    button.addEventListener("click", () =>
      removeDocumentWorkspace(button.dataset.removeWorkspace),
    );
  });
  document.querySelectorAll("[data-doc-title]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const nextTitle = event.target.value || "Untitled document";
      updateDocumentWorkspace(
        (workspace) => {
          workspace.title = nextTitle;
        },
        { render: false },
      );
      const heading = document.querySelector(
        ".documents-editor-header .documents-header-copy h1",
      );
      if (heading) heading.textContent = nextTitle;
    });
  });
  document.querySelectorAll("[data-doc-column]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const columnIndex = Number(event.target.dataset.docColumn);
      updateDocumentWorkspace(
        (workspace) => {
          workspace.columns[columnIndex] =
            event.target.value || "Column " + (columnIndex + 1);
        },
        { render: false },
      );
    });
  });
  document.querySelectorAll("[data-doc-cell]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const [rowIndex, columnIndex] = String(event.target.dataset.docCell)
        .split(":")
        .map(Number);
      updateDocumentWorkspace(
        (workspace) => {
          if (!workspace.rows[rowIndex]) return;
          workspace.rows[rowIndex][columnIndex] = event.target.value;
        },
        { render: false },
      );
    });
  });
  document.querySelectorAll("[data-doc-remove-row]").forEach((button) => {
    button.addEventListener("click", async () => {
      const rowIndex = Number(button.dataset.docRemoveRow);
      updateDocumentWorkspace((workspace) => {
        workspace.rows.splice(rowIndex, 1);
        if (!workspace.rows.length) {
          workspace.rows.push(workspace.columns.map(() => ""));
        }
      });
    });
  });
  document.querySelectorAll("[data-doc-remove-column]").forEach((button) => {
    button.addEventListener("click", async () => {
      const columnIndex = Number(button.dataset.docRemoveColumn);
      updateDocumentWorkspace((workspace) => {
        if (workspace.columns.length === 1) return;
        workspace.columns.splice(columnIndex, 1);
        workspace.columnWidths.splice(columnIndex, 1);
        workspace.rows = workspace.rows.map((row) => {
          const nextRow = [...row];
          nextRow.splice(columnIndex, 1);
          return nextRow;
        });
      });
    });
  });
  document.querySelectorAll("[data-doc-add-row]").forEach((button) => {
    button.addEventListener("click", async () => {
      updateDocumentWorkspace((workspace) => {
        workspace.rows.push(workspace.columns.map(() => ""));
      });
    });
  });
  document.querySelectorAll("[data-doc-add-column]").forEach((button) => {
    button.addEventListener("click", async () => {
      updateDocumentWorkspace((workspace) => {
        const nextColumnIndex = workspace.columns.length;
        workspace.columns.push("New Column " + (nextColumnIndex + 1));
        workspace.rows = workspace.rows.map((row) => [...row, ""]);
        if (state.documentEditor)
          state.documentEditor.scrollColumnIndex = nextColumnIndex;
      });
    });
  });
  scrollDocumentEditorToPendingColumn();
  bindDrawerEvents();
}
async function addBuilderAttachments(fileList) {
  const files = [...(fileList || [])].filter((file) => {
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) showToast(file.name + " is not a PDF", "error");
    else if (file.size > 2 * 1024 * 1024)
      showToast(file.name + " is over the 2MB attachment limit", "error");
    return isPdf && file.size <= 2 * 1024 * 1024;
  });
  if (!files.length) return;
  try {
    showToast(
      "Saving attachment" + (files.length === 1 ? "" : "s") + "...",
      "info",
    );
    const uploaded = await uploadWispAttachments(files);
    if (!uploaded.length)
      throw new Error("Supabase did not return an attachment record.");
    state.builderAttachments = [...state.builderAttachments, ...uploaded];
    invalidateBuilderMergedPdfForAttachments();
    showToast(
      String(uploaded.length) +
        " attachment" +
        (uploaded.length === 1 ? "" : "s") +
        " saved",
      "success",
    );
    render();
  } catch (error) {
    console.error("WISP attachment upload failed", error);
    showToast(
      "Unable to save attachment" +
        (error?.message ? ": " + error.message : ""),
      "error",
    );
  }
}
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
async function reorderBuilderAttachments(fromIndex, toIndex) {
  if (Number.isNaN(fromIndex) || Number.isNaN(toIndex) || fromIndex === toIndex)
    return;
  const previousOrder = [...state.builderAttachments];
  const [moved] = state.builderAttachments.splice(fromIndex, 1);
  if (!moved) return;
  state.builderAttachments.splice(toIndex, 0, moved);
  invalidateBuilderMergedPdfForAttachments();
  render();
  try {
    await reorderWispAttachments(state.builderAttachments);
  } catch (error) {
    console.error("WISP attachment reorder failed", error);
    state.builderAttachments = previousOrder;
    invalidateBuilderMergedPdfForAttachments();
    showToast("Unable to save attachment order", "error");
    render();
  }
}
function formatDashboardDate(value) {
  if (!value) return "Nov 11, 2025";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function formatAttachmentSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
async function addDocumentsFiles(fileList) {
  // FileList is live, so capture selected files before any asynchronous UI work.
  const files = Array.from(fileList || []);
  if (!files.length) return;
  showToast("Uploading files...", "info");
  try {
    const uploaded = await uploadDocuments(files);
    if (!uploaded.length)
      throw new Error("Supabase did not return an uploaded file.");
    state.documentsFiles = [...uploaded, ...state.documentsFiles];
    showToast(
      `${uploaded.length} file${uploaded.length > 1 ? "s" : ""} uploaded`,
      "success",
    );
    if (state.dashboardData)
      state.dashboardData = {
        ...state.dashboardData,
        documents_count: state.documentsFiles.length,
      };
    render();
  } catch (error) {
    console.error("Document upload failed", error);
    const detail = error?.message
      ? `: ${error.message}`
      : ". Please check the Supabase documents bucket.";
    showToast(`Upload failed${detail}`, "error");
  }
}
function removeDocumentWorkspace(templateId) {
  const ws = state.documentWorkspaces[templateId];
  if (!ws) return;
  const title = ws.title || "Document";
  delete state.documentWorkspaces[templateId];
  if (state.documentEditor?.templateId === templateId) {
    state.documentEditor = null;
    state.screen = "documents";
  }
  scheduleDocumentWorkspaceSync();
  showToast(`${title} removed`, "info");
  render();
}
function updateDocumentWorkspace(mutator, options = {}) {
  const workspace = activeDocumentWorkspace();
  if (!workspace) return;
  mutator(workspace);
  workspace.updatedAt = new Date().toISOString();
  scheduleDocumentWorkspaceSync();
  if (options.render === false) return;
  render();
}
function scrollDocumentEditorToPendingColumn() {
  const pendingColumnIndex = state.documentEditor?.scrollColumnIndex;
  if (pendingColumnIndex == null) return;
  const targetCell =
    document.querySelector(`[data-doc-index-cell="${pendingColumnIndex}"]`) ||
    document.querySelector(`[data-doc-column="${pendingColumnIndex}"]`);
  if (!targetCell) return;
  targetCell.scrollIntoView({
    block: "nearest",
    inline: "end",
    behavior: "smooth",
  });
  state.documentEditor.scrollColumnIndex = null;
}
function updateSettingsState(
  mutator,
  activity = "Settings Change",
  details = "Updated workspace settings",
  options = {},
) {
  state.settingsData = normalizeSettingsData(state.settingsData);
  mutator(state.settingsData);
  appendSettingsActivityLog(activity, details);
  const savePromise = scheduleSettingsSync({
    immediate: Boolean(options.immediate),
  });
  render();
  return savePromise;
}
function promptForValue(label, currentValue = "") {
  const nextValue = window.prompt(label, currentValue ?? "");
  if (nextValue == null) return null;
  return nextValue.trim();
}
function getSettingsData() {
  return state.settingsData || defaultSettingsData();
}
function settingsDisplayDate(value) {
  if (!value) return "Not available";
  return formatDashboardDate(value);
}
function settingsPlaceholderTab() {
  return `<section class="settings-card"><div class="settings-card-body"><p class="settings-placeholder">This section is coming soon.</p></div></section>`;
}
function handleSettingsAction(action) {
  const settings = getSettingsData();
  if (action === "change-email") {
    state.settingsModal = {
      type: "email",
      title: "Change your email",
      label: "New email address",
      currentValue: settings.profile.email,
      saveLabel: "Update email address",
      activity: "Profile Updated",
      detail: "Profile email changed",
    };
    render();
    return;
  }
  if (action === "update-password") {
    state.settingsModal = {
      type: "password",
      title: "Update your password",
      label: "New password",
      currentValue: "",
      saveLabel: "Update password",
      activity: "Security Updated",
      detail: "Password updated",
      passwordFields: true,
    };
    render();
    return;
  }
  if (action === "change-mfa") {
    state.settingsModal = {
      type: "mfa-password",
      title: "Verify your identity",
      label: "Enter your current password",
      currentValue: "",
      saveLabel: "Continue",
      activity: "",
      detail: "",
      passwordChallenge: true,
    };
    render();
    return;
  }
  if (action === "edit-profile") {
    const nextName = promptForValue(
      "Enter your profile name",
      settings.profile.name,
    );
    if (!nextName) return;
    updateWorkspaceAuthProfile({ fullName: nextName }).catch((error) => {
      console.warn("Profile metadata update skipped", error);
    });
    updateSettingsState(
      (draft) => {
        draft.profile.name = nextName;
      },
      "Profile Updated",
      `Profile name changed to ${nextName}`,
      { immediate: true },
    );
    return;
  }
  if (action === "edit-company") {
    const existingAddress = settings.company.address || formatCompanyAddress();
    const match = existingAddress.match(
      /^(.*?),\s*([^,]+),\s*([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/,
    );
    const companyFields = {
      name:
        state.form.companyName ||
        state.firmProfile?.name ||
        "Current Fiscal LLC",
      address: state.form.streetAddress || match?.[1] || existingAddress,
      city: state.form.city || match?.[2] || "",
      state: state.form.state || match?.[3] || "",
      zip: state.form.postalCode || match?.[4] || "",
      phone:
        settings.company.phone ||
        state.form.officePhone ||
        state.form.mobilePhone ||
        "",
      email:
        settings.company.email ||
        state.form.email ||
        state.firmProfile?.email ||
        "",
    };
    state.settingsModal = {
      type: "company",
      title: "Update company profile",
      label: "",
      currentValue: "",
      saveLabel: "Save changes",
      activity: "Settings Change",
      detail: "Company profile details updated",
      companyFields,
    };
    render();
    return;
  }
  if (action === "edit-billing") {
    state.settingsTab = "billing-card";
    state.showPaymentCardRemovalDialog = false;
    render();
    return;
  }
  if (action === "back-to-billing") {
    state.settingsTab = "billing";
    state.showPaymentCardRemovalDialog = false;
    render();
    return;
  }
  if (action === "remove-payment-card") {
    state.showPaymentCardRemovalDialog = true;
    render();
    return;
  }
  if (action === "cancel-remove-payment-card") {
    state.showPaymentCardRemovalDialog = false;
    render();
    return;
  }
  if (action === "confirm-remove-payment-card") {
    state.showPaymentCardRemovalDialog = false;
    updateSettingsState(
      (draft) => {
        draft.billing.paymentMethod = "No payment method";
        draft.billing.cardLast4 = "";
        draft.billing.cardholder = "";
        draft.billing.cardBrand = "";
      },
      "Payment Method Removed",
      "Removed the saved payment method",
    );
    return;
  }
  if (action === "purchase-service") {
    if (!state.selectedAdditionalService) {
      showToast("Select a service first", "error");
      return;
    }
    state.showServicePurchaseDialog = true;
    render();
    return;
  }
  if (action === "cancel-service-purchase") {
    state.showServicePurchaseDialog = false;
    render();
    return;
  }
  if (action === "confirm-service-purchase") {
    const service = getAdditionalServiceDetails(
      state.selectedAdditionalService,
    );
    if (!service) {
      state.showServicePurchaseDialog = false;
      render();
      return;
    }
    state.showServicePurchaseDialog = false;
    state.selectedAdditionalService = null;
    updateSettingsState(
      (draft) => {
        draft.billing.servicePurchases = Array.isArray(
          draft.billing.servicePurchases,
        )
          ? draft.billing.servicePurchases
          : [];
        draft.billing.servicePurchases.unshift({
          id: `service-${Date.now()}`,
          serviceId: service.id,
          name: service.name,
          price: service.price,
          status: "requested",
          requestedAt: new Date().toISOString(),
          paymentMethod: draft.billing.paymentMethod || "No payment method",
        });
      },
      "Service Purchase Requested",
      `Requested ${service.name} (${service.price})`,
      { immediate: true },
    );
    showToast(`${service.name} request saved`, "success");
    return;
  }
  if (action === "learn-assist" || action === "learn-review") {
    const serviceName =
      action === "learn-assist" ? "WISP Assist Service" : "WISP Review Service";
    appendSettingsActivityLog(
      "Service Viewed",
      `Viewed details for ${serviceName}`,
    );
    scheduleSettingsSync();
    render();
  }
  if (action === "invite-user") {
    const firstName = promptForValue("Enter the user's first name", "");
    if (!firstName) return;
    const lastName = promptForValue("Enter the user's last name", "");
    if (lastName == null) return;
    const email = promptForValue("Enter the user's email", "");
    if (!email) return;
    const permission = promptForValue(
      "Enter permission level (Basic, Manager, Administrator)",
      "Basic",
    );
    if (!permission) return;
    updateSettingsState(
      (draft) => {
        draft.users.unshift({
          id: `user-${Date.now()}`,
          firstName,
          lastName,
          email,
          permission,
          status: "Invited",
          actions: ["Resend Invitation", "Revoke Invitation"],
        });
        draft.billing.inviteSeatsRemaining = Math.max(
          0,
          Number(draft.billing.inviteSeatsRemaining || 0) - 1,
        );
      },
      "User Updated",
      `Invited ${firstName} ${lastName} (${email})`,
    );
  }
  if (action === "add-staff") {
    state.editingStaffId = null;
    state.showStaffDialog = true;
    render();
    return;
  }
  if (action === "cancel-add-staff") {
    state.showStaffDialog = false;
    state.editingStaffId = null;
    render();
    return;
  }
  if (action === "import-staff") {
    appendSettingsActivityLog(
      "Staff Updated",
      "Staff import requested from the Settings tab",
    );
    scheduleSettingsSync();
    render();
  }
  if (action === "export-logs") {
    downloadSettingsActivityLogs();
  }
}
function updatePlanBillingCyclePreview(cycle) {
  const annual = cycle === "yearly";
  const prices = annual
    ? {
        core: "$1,490",
        professional: "$2,990",
        enterprise: "$4,990",
        period: "/ year",
      }
    : {
        core: "$149",
        professional: "$299",
        enterprise: "$499",
        period: "/ month",
      };
  document.querySelectorAll("[data-plan-price]").forEach((element) => {
    const price = prices[element.dataset.planPrice];
    if (price) element.innerHTML = `${price}<small>${prices.period}</small>`;
  });
  document
    .querySelectorAll(".settings-pricing-cycle-option")
    .forEach((button) => {
      const isAnnualButton =
        button.dataset.action === "set-plan-billing-yearly";
      button.classList.toggle(
        "is-active",
        annual ? isAnnualButton : !isAnnualButton,
      );
    });
}
function handleSettingsPlanSelection(planName) {
  const planMap = {
    "EasyWISP Core": { monthly: 149, yearly: 1490 },
    "EasyWISP Professional": { monthly: 299, yearly: 2990 },
    "EasyWISP Enterprise": { monthly: 499, yearly: 4990 },
  };
  const selectedPlan = planMap[planName];
  const billingCycle =
    state.planBillingCycle === "yearly" ? "yearly" : "monthly";
  updateSettingsState(
    (draft) => {
      draft.billing.planName = planName;
      draft.billing.priceMonthly =
        selectedPlan?.monthly || draft.billing.priceMonthly;
      draft.billing.priceAnnual =
        selectedPlan?.yearly || draft.billing.priceAnnual;
      draft.billing.billingCycle = billingCycle;
      draft.billing.status = "Active";
    },
    "Billing Updated",
    `Subscription changed to ${planName} (${billingCycle} billing)`,
    { immediate: true },
  );
  state.showPlanModal = false;
  render();
}
function handleSettingsUserAction(userId, action) {
  if (!userId || !action) return;
  if (action === "Resend Invitation") {
    updateSettingsState(
      (draft) => {
        const user = draft.users.find((entry) => entry.id === userId);
        if (user) user.lastInvitationSentAt = new Date().toISOString();
      },
      "User Updated",
      `Resent invitation to user ${userId}`,
      { immediate: true },
    );
    return;
  }
  if (action === "Revoke Invitation") {
    updateSettingsState(
      (draft) => {
        draft.users = draft.users.filter((user) => user.id !== userId);
        draft.billing.inviteSeatsRemaining =
          Number(draft.billing.inviteSeatsRemaining || 0) + 1;
      },
      "User Updated",
      `Revoked invitation for user ${userId}`,
    );
  }
}
async function handleStaffRemove(staffId) {
  if (!staffId) return;
  try {
    await deleteFirmStaffMember(staffId);
  } catch (error) {
    console.warn("Staff removal failed", error);
    showToast(error?.message || "Unable to remove staff member", "error");
    return;
  }
  state.selectedStaffIds = (state.selectedStaffIds || []).filter(
    (id) => id !== staffId,
  );
  updateSettingsState(
    (draft) => {
      draft.staff = draft.staff.filter((member) => member.id !== staffId);
    },
    "Staff Updated",
    `Removed staff record ${staffId}`,
  );
}
function downloadSettingsActivityLogs() {
  const settings = getSettingsData();
  const header = ["Activity", "User", "Details", "Date", "IP Address"];
  const rows = settings.activityLogs.map((row) => [
    row.activity,
    row.user,
    row.details,
    settingsDisplayDate(row.date),
    row.ip,
  ]);
  const csv = [header, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value || "").replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "settings-activity-logs.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 250);
}
function bindDrawerEvents() {
  if (!state.drawer) return;
  document.querySelectorAll("[data-drawer-field]").forEach((element) => {
    element.addEventListener("input", (event) => {
      state.drawer.draft = {
        ...(state.drawer.draft || {}),
        [event.target.dataset.drawerField]: event.target.value,
      };
    });
    element.addEventListener("change", (event) => {
      state.drawer.draft = {
        ...(state.drawer.draft || {}),
        [event.target.dataset.drawerField]: event.target.value,
      };
    });
  });
  document.querySelectorAll("[data-drawer-segmented]").forEach((group) => {
    group.querySelectorAll(".segment").forEach((button) => {
      button.addEventListener("click", async () => {
        state.drawer.draft = {
          ...(state.drawer.draft || {}),
          remote: button.dataset.value,
        };
        group
          .querySelectorAll(".segment")
          .forEach((segment) => segment.classList.remove("is-active"));
        button.classList.add("is-active");
      });
    });
  });
}
async function restartOnboardingForTesting() {
  if (!isStagingOnboardingResetEnabled()) return;
  const confirmed = window.confirm(
    "Restart onboarding for this test workspace? Your account and firm stay intact; only onboarding progress is reset.",
  );
  if (!confirmed) return;
  try {
    const onboarding = await resetFirmOnboardingForTesting();
    cacheOnboardingCompletion(state.authUser?.id, false);
    state.workspaceUtility = null;
    state.onboarding = onboarding || { status: "not_started", current_step: 1, profile: {} };
    state.onboardingError = "";
    state.screen = "onboarding";
    showToast("Onboarding restarted for testing.", "success");
    render();
  } catch (error) {
    showToast(error?.message || "Unable to restart onboarding.", "error");
  }
}
function handleAction(action, trigger = null) {
  if (action === "open-workspace-search") {
    setState({ workspaceUtility: "search" });
    return;
  }
  if (action === "toggle-workspace-notifications") {
    setState({
      workspaceUtility:
        state.workspaceUtility === "notifications" ? null : "notifications",
    });
    return;
  }
  if (action === "toggle-workspace-profile") {
    setState({
      workspaceUtility: state.workspaceUtility === "profile" ? null : "profile",
    });
    return;
  }
  if (action === "close-workspace-utility") {
    setState({ workspaceUtility: null });
    return;
  }
  if (action.startsWith("utility-settings-")) {
    const requestedSettingsTab = action.replace("utility-settings-", "");
    const settingsTab =
      requestedSettingsTab === "activity" ? "logs" : requestedSettingsTab;
    setState({
      screen: "settings",
      settingsTab,
      workspaceUtility: null,
      builderSidebarOpen: false,
      errors: {},
    });
    return;
  }
  if (action === "restart-onboarding") {
    restartOnboardingForTesting();
    return;
  }
  if (action === "activate-completed-wisp") {
    activateCompletedWisp();
    return;
  }  if (action === "open-acknowledging-requests") {
    setState({
      builderTab: "acknowledgement-requests",
      acknowledgementRequestSource:
        state.builderTab === "completed" ? "completed" : "active",
      acknowledgingSignerIds: [],
      acknowledgementRequestLinks: [],
      acknowledgementRequestBusy: false,
    });
    return;
  }
  if (action === "back-to-acknowledging-signers") {
    setState({
      screen: "builder",
      builderTab:
        state.acknowledgementRequestSource === "completed"
          ? "completed"
          : "active",
      acknowledgingSignerIds: [],
      acknowledgementRequestLinks: [],
    });
    return;
  }
  if (action === "create-acknowledgement-requests") {
    createAcknowledgementRequestsForSelectedStaff();
    return;
  }
  if (action === "remove-acknowledgement-request") {
    removeAcknowledgementRequest(trigger?.dataset?.acknowledgementRequestId || "");
    return;
  }  if (action === "copy-acknowledgement-link") {
    copyAcknowledgementLink(trigger?.dataset?.acknowledgementUrl || "");
    return;
  } // Navigation always dismisses a global utility panel before the next view renders.
  if (
    action.startsWith("nav-") ||
    [
      "start",
      "resume",
      "open-builder",
      "go-home",
      "back-to-documents",
      "create-wisp",
      "go-completed-wisp",
    ].includes(action)
  ) {
    state.workspaceUtility = null;
  }
  if (action === "skip-auth")
    setState({
      screen: "home",
      authAvailable: false,
      authReady: true,
      authError: "",
    });
  if (action === "close-settings-modal") {
    state.settingsModal = null;
    render();
    return;
  }
  if (action === "start" || action === "resume")
    setState({ screen: "assessment", sectionIndex: 0, section2Substep: 0 });
  if (action === "open-builder") setState(getBuilderEditorEntryState());
  if (action === "go-home")
    setState({ screen: "home", builderSidebarOpen: false, errors: {} });
  if (action === "nav-home")
    setState({ screen: "home", builderSidebarOpen: false, errors: {} });
  if (action === "nav-risk")
    setState({ screen: "welcome", builderSidebarOpen: false, errors: {} });
  if (action === "nav-assessment-start")
    setState({
      screen: "assessment-start",
      builderSidebarOpen: false,
      errors: {},
    });
  if (action === "nav-builder-home") setState(getBuilderOverviewState());
  if (action === "nav-builder") {
    if (hasActiveWispProject())
      setState({
        screen: "builder",
        builderTab: "completed",
        builderResumeEditing: false,
      });
    else setState(getBuilderEditorEntryState());
  }
  if (action === "nav-training")
    setState({ screen: "training", builderSidebarOpen: false, errors: {} });
  if (action === "close-training-preview") closeTrainingAssetPreview();
  if (action === "nav-documents" || action === "back-to-documents")
    setState({ screen: "documents", builderSidebarOpen: false, errors: {} });
  if (action === "nav-settings")
    setState({ screen: "settings", builderSidebarOpen: false, errors: {} });
  if (action === "create-wisp") {
    if (hasActiveWispProject()) {
      showToast(
        "Delete the " + finalizedWispStatusLabel() + " WISP before creating a new draft.",
        "info",
      );
      setState({
        screen: "builder",
        builderTab: "completed",
        builderResumeEditing: false,
      });
    } else {
      setState(getBuilderEditorEntryState());
    }
  }
  if (action === "go-completed-wisp")
    setState({
      screen: "builder",
      builderTab: state.wispProject?.status === "active" ? "active" : "completed",
      builderResumeEditing: false,
    });
  if (action === "view-completed-wisp") {
    if (state.builderSigningPdfBusy) {
      showToast("Your signed PDF is still being updated.", "info");
      return;
    }
    openCompletedWispPreview().catch((error) => {
      console.error("Completed WISP preview failed", error);
      showToast("Unable to open the completed WISP preview.", "error");
    });
  }
  if (action === "sign-completed-wisp") openWispSignatureDialog(trigger);
  if (action === "close-wisp-signature") {
    state.wispSignatureDialog = null;
    render();
  }
  if (action === "wisp-signature-draw" && state.wispSignatureDialog) {
    state.wispSignatureDialog.mode = "draw";
    render();
  }
  if (action === "wisp-signature-type" && state.wispSignatureDialog) {
    state.wispSignatureDialog.mode = "type";
    render();
  }
  if (action === "wisp-signature-font" && state.wispSignatureDialog) {
    state.wispSignatureDialog.font = trigger?.dataset.signatureFont || "caveat";
    render();
  }
  if (action === "clear-wisp-signature" && state.wispSignatureDialog) {
    if (state.wispSignatureDialog.mode === "type") {
      state.wispSignatureDialog.typedValue = "";
      render();
    } else {
      const canvas = document.querySelector("[data-wisp-signature-pad]");
      const context = canvas?.getContext?.("2d");
      if (context && canvas)
        context.clearRect(0, 0, canvas.width, canvas.height);
      state.wispSignatureDialog.hasDrawn = false;
    }
  }
  if (action === "save-wisp-signature")
    saveCompletedWispSignature().catch((error) => {
      console.error("WISP signature save failed", error);
      showToast(
        error?.message || "Unable to save the WISP signature.",
        "error",
      );
    });
  if (action === "delete-completed-wisp")
    deleteCompletedWisp().catch((error) => {
      console.error("Completed WISP deletion failed", error);
      showToast(error?.message || "Unable to delete the WISP.", "error");
    });
  if (action === "continue-pending-wisp")
    setState({
      builderTab: "pending",
      builderResumeEditing: true,
      builderLaunchAnimation: true,
      builderSidebarOpen: false,
      builderReviewLoading: false,
      builderReviewOpen: false,
      builderReviewPage: 0,
      builderTopicIndex: getSavedBuilderTopicIndex(),
      errors: {},
    });
  if (action === "review-builder-draft") {
    clearTimeout(builderDraftReviewTimer);
    console.log("[review-builder-draft] starting");
    setState({
      builderReviewLoading: true,
      builderReviewOpen: false,
      builderReviewExpanded: false,
      builderReviewPage: 0,
      builderSidebarOpen: false,
      builderLaunchAnimation: false,
    });
    requestBuilderMergedDocx()
      .then(() => {
        console.log(
          "[review-builder-draft] merge done. mergeStatus:",
          state.builderMergeStatus,
        );
        if (
          state.builderMergeStatus !== "ready" ||
          !state.builderMergePdfBlob
        ) {
          setState({
            builderReviewLoading: false,
            builderReviewOpen: false,
            builderReviewExpanded: false,
          });
          showToast(
            "The branded WISP PDF could not be generated. Confirm the local renderer is running, then try again.",
            "error",
          );
          return;
        }
        setState({
          builderReviewLoading: false,
          builderReviewOpen: true,
          builderReviewExpanded: false,
          builderReviewPage: 0,
        });
      })
      .catch((error) => {
        console.warn("[review-builder-draft] merge failed", error);
        setState({
          builderReviewLoading: false,
          builderReviewOpen: false,
          builderReviewExpanded: false,
        });
        showToast(
          "The branded WISP PDF could not be generated. Try again after the renderer starts.",
          "error",
        );
      });
  }
  if (action === "close-builder-review") {
    clearTimeout(builderDraftReviewTimer);
    setState({
      builderReviewLoading: false,
      builderReviewOpen: false,
      builderReviewExpanded: false,
      builderReviewPage: 0,
      builderSidebarOpen: false,
      builderTopicIndex: Math.max(
        0,
        builderTopics.findIndex((topic) => topic.id === "finalize"),
      ),
    });
  }
  if (action === "download-builder-review") {
    downloadBuilderReviewCopy().catch((error) => {
      console.warn("Builder review download failed", error);
      alert(
        error?.message || "Unable to download the WISP review file right now.",
      );
    });
  }
  if (action === "download-current-wisp")
    downloadStoredWispFile(state.wispProject?.latest_generated_file);
  if (action === "finalize-builder-wisp") {
    if (state.builderFinalizeBusy) return;
    setState({ builderFinalizeBusy: true });
    finalizeBuilderWisp().catch((error) => {
      console.warn("Builder finalize failed", error);
      setState({ builderFinalizeBusy: false });
      alert(error?.message || "Unable to finalize the WISP right now.");
    });
  }
  if (action === "download-builder-merge-payload")
    downloadBuilderMergePayload();
  if (action === "generate-builder-merged-docx")
    requestBuilderMergedDocx().catch((error) =>
      console.warn("Builder merge request failed", error),
    );
  if (action === "download-builder-merged-docx") downloadBuilderMergedDocx();
  if (action === "open-builder-review-expanded")
    setState({ builderReviewExpanded: true });
  if (action === "close-builder-review-expanded")
    setState({ builderReviewExpanded: false });
  if (action === "builder-review-prev") changeBuilderReviewPage(-1);
  if (action === "builder-review-next") changeBuilderReviewPage(1);
  if (action === "open-doc-upload")
    document.querySelector("[data-documents-upload]")?.click();
  if (action === "open-builder-sidebar") setState({ builderSidebarOpen: true });
  if (action === "close-builder-sidebar")
    setState({ builderSidebarOpen: false });
  if (action === "back") goBack();
  if (action === "next")
    goNext().catch((error) => {
      console.warn("Risk assessment navigation failed", error);
      alert(error?.message || "Unable to save your assessment right now.");
    });
  if (action === "back-to-last")
    setState({
      screen: "assessment",
      sectionIndex: sections.length - 1,
      errors: {},
    });
  if (action === "results") setState({ screen: "results", errors: {} });
  if (action === "review") setState({ screen: "review", errors: {} });
  if (action === "view-summary") setState({ screen: "review", errors: {} });
  if (action === "add-access-person")
    setState({
      screen: "assessment",
      sectionIndex: 3,
      section2Substep: 0,
      errors: {},
    });
  if (action === "close-drawer") setState({ drawer: null });
  if (action === "save-drawer") saveDrawer();
  if (action === "open-plan-modal")
    setState({
      showPlanModal: true,
      planBillingCycle:
        getSettingsData().billing.billingCycle === "yearly"
          ? "yearly"
          : "monthly",
    });
  if (action === "close-plan-modal") setState({ showPlanModal: false });
  if (action === "set-plan-billing-monthly") {
    state.planBillingCycle = "monthly";
    updatePlanBillingCyclePreview("monthly");
    return;
  }
  if (action === "set-plan-billing-yearly") {
    state.planBillingCycle = "yearly";
    updatePlanBillingCyclePreview("yearly");
    return;
  }
  if (action === "sign-out") {
    state.authBusy = true;
    render();
    signOutCurrentUser().catch((error) => {
      state.authError = error?.message || "Unable to sign out right now.";
      state.authBusy = false;
      render();
    });
  }
}
function saveDrawer() {
  const { key, index, draft = {} } = state.drawer;
  const item = {
    ...(index !== null && index !== undefined ? state.form[key][index] : {}),
    ...draft,
  };
  const required =
    key === "vendors"
      ? ["name"]
      : ["first", "last", "role", "location", "remote"];
  const missing = required.some((fieldName) => !item[fieldName]);
  if (missing)
    return alert("Complete the required fields before saving this entry.");
  if (index !== null && index !== undefined) state.form[key][index] = item;
  else state.form[key].push(item);
  setState({ drawer: null });
}
function goBack() {
  if (state.sectionIndex > 0)
    return setState({
      sectionIndex: state.sectionIndex - 1,
      section2Substep: 0,
      errors: {},
    });
  return setState({ screen: "welcome", errors: {} });
}
async function goNext() {
  if (!validateCurrent()) {
    const notice = document.getElementById("sectionNotice");
    if (notice) notice.classList.remove("is-hidden");
    return;
  }
  if (state.sectionIndex < sections.length - 1) {
    await flushRiskDraftSync();
    return setState({
      sectionIndex: state.sectionIndex + 1,
      section2Substep: 0,
      errors: {},
    });
  }
  await flushRiskDraftSync({
    status: "completed",
    scoreSummary: scoreAssessment(),
  });
  setState({ screen: "review", errors: {} });
}
function validateCurrent() {
  const errors = {};
  if (state.sectionIndex === 0) {
    [
      "companyName",
      "primaryContact",
      "practiceType",
      "staffSize",
      "taxSoftware",
      "itManagement",
    ].forEach((fieldName) => {
      if (!state.form[fieldName]) errors[fieldName] = "This field is required.";
    });
  } else {
    const fieldName = `question_${state.sectionIndex}`;
    if (!state.form[fieldName])
      errors[fieldName] = "Please select an answer before continuing.";
  }
  state.errors = errors;
  render();
  return Object.keys(errors).length === 0;
}
function getFlags() {
  const flags = [];
  const recommendationByDomain = {
    "Data Security":
      "Standardize secure document access, enforce MFA everywhere, and formalize the firm's written security program.",
    "Backup & Recovery":
      "Move to automated, isolated backups and test restore procedures on a recurring schedule.",
    "Tax Software & Cloud":
      "Harden the firm's tax software stack with resilient hosting, documented continuity steps, and managed business email.",
    "Remote Access":
      "Restrict remote access to managed devices and secure channels, then retire high-risk BYOD and aging endpoints.",
    Compliance:
      "Document required controls, complete the relevant IRS and FTC reviews, and make training part of routine operations.",
    "IT Support":
      "Shift from reactive support to documented, proactive IT operations with patching, offboarding, continuity, and renewal evidence.",
  };
  assessmentQuestions.forEach((item, index) => {
    const selected = item.options.find(
      (option) => option.label === state.form[`question_${index + 1}`],
    );
    if (!selected) return;
    const maxScore =
      Math.max(...item.options.map((option) => option.score)) || 10;
    const normalized = Math.round((selected.score / maxScore) * 100);
    let priority = "";
    if (normalized <= 25) priority = "Immediate";
    else if (normalized <= 55) priority = "30 days";
    else if (normalized <= 75) priority = "90 days";
    if (!priority) return;
    flags.push({
      sectionIndex: index + 1,
      title: item.question,
      area: item.domain,
      priority,
      fix:
        recommendationByDomain[item.domain] ||
        "Review and document the safeguards behind this answer.",
    });
  });
  return flags;
}
function scoreAssessment() {
  const flags = getFlags();
  const sectionScores = [{ name: sections[0], score: 100 }];
  assessmentQuestions.forEach((item, index) => {
    const selected = item.options.find(
      (option) => option.label === state.form[`question_${index + 1}`],
    );
    const maxScore =
      Math.max(...item.options.map((option) => option.score)) || 10;
    const rawScore = selected ? selected.score : 0;
    const normalized = Math.round((rawScore / maxScore) * 100);
    sectionScores.push({ name: sections[index + 1], score: normalized });
  });
  const questionScores = sectionScores.slice(1).map((row) => row.score);
  const overall = questionScores.length
    ? Math.round(
        questionScores.reduce((sum, score) => sum + score, 0) /
          questionScores.length,
      )
    : 0;
  const label =
    overall < 40
      ? "High Risk"
      : overall < 60
        ? "Needs Immediate Improvement"
        : overall < 75
          ? "Developing"
          : overall < 90
            ? "Mostly Prepared"
            : "Strong";
  const topArea = flags[0]?.area || "No high-priority area identified";
  const displayFlags = flags.length
    ? flags
    : [
        {
          title: "No critical weaknesses detected",
          area: "Assessment-wide",
          priority: "90 days",
          fix: "Continue maintaining documented safeguards and review answers periodically.",
        },
      ];
  const weakest = [...sectionScores.slice(1)]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((row) => row.name);
  const immediateCount = flags.filter(
    (flag) => flag.priority === "Immediate",
  ).length;
  return {
    overall,
    label,
    sectionScores,
    flags: displayFlags,
    topArea,
    recommendations: {
      immediate: recommendationItems(flags, "Immediate", [
        "Address the lowest-scoring questions first, especially around MFA, backup recovery, compliance, and patching.",
      ]),
      thirty: recommendationItems(flags, "30 days", [
        "Document repeatable operational controls for the answers that landed in the middle of the range.",
      ]),
      ninety: recommendationItems(flags, "90 days", [
        "Use the stronger answers as a baseline and formalize remaining process gaps across the environment.",
      ]),
    },
    summary: immediateCount
      ? `${immediateCount} immediate-priority item${immediateCount === 1 ? "" : "s"} surfaced from the imported CPA IT questions, led by ${weakest.slice(0, 2).join(" and ")}.`
      : overall < 75
        ? "Several safeguards are present, but the submitted answers show gaps that should be reviewed and documented."
        : "The submitted answers show a stronger readiness posture, with a smaller number of items to confirm or formalize.",
    narrative:
      "This report is based on the imported CPA IT assessment questions plus your practice details. Items marked as weaknesses should be reviewed, corrected where needed, and documented before treating the firm's safeguards as mature. This assessment is a readiness tool and does not constitute legal, tax, cybersecurity, or compliance certification.",
  };
}
function exposureModifier() {
  const form = state.form;
  let score = 88;
  if (Number(form.individualReturns) > 500) score -= 8;
  if (Number(form.corporateReturns) > 100) score -= 6;
  if (form.bookkeeping === "Yes") score -= 4;
  if (form.payroll === "Yes") score -= 5;
  if (form.insurance === "Yes") score -= 3;
  return Math.max(58, score);
}
function recommendationItems(flags, priority, fallback) {
  const items = flags
    .filter((flag) => flag.priority === priority)
    .map((flag) => flag.fix);
  return [...new Set(items)].slice(0, 4).concat(items.length ? [] : fallback);
}
window.addEventListener("pagehide", () => {
  persistLocalDocumentWorkspaces();
  persistLocalSpecialDocuments();
  flushDocumentWorkspacesKeepalive(
    state.documentWorkspaces,
    state.specialDocumentInstances,
  );
  if (
    buildRiskAnswerRows().length ||
    state.form.companyName ||
    state.form.primaryContact
  ) {
    saveLocalRiskDraft();
  }
  if (hasPendingWispDraft()) {
    saveLocalBuilderDraft(state.builderDrafts, {
      topicIndex: state.builderTopicIndex,
    });
  }
});
window.addEventListener("resize", () => {
  clearTimeout(builderPdfResizeTimer);
  builderPdfResizeTimer = setTimeout(() => {
    queueBuilderPdfPreviewRender();
  }, 120);
  clearTimeout(trainingPdfResizeTimer);
  trainingPdfResizeTimer = setTimeout(() => {
    queueTrainingPdfPreviewRender();
  }, 120);
});
const PUBLIC_ACK_SIGNATURE_FONTS = {
  handwritten: "'Segoe Print', 'Bradley Hand', cursive",
  classic: "'Brush Script MT', 'Segoe Script', cursive",
  elegant: "'Snell Roundhand', 'URW Chancery L', cursive",
  modern: "'Comic Sans MS', 'Segoe Print', cursive",
  formal: "'Palace Script MT', 'Times New Roman', serif",
};
let publicAcknowledgementState = {
  route: null,
  request: null,
  mode: "draw",
  typedSignature: "",
  font: "classic",
  drawData: "",
  saving: false,
  completed: false,
  error: "",
  previewPdfUrl: "",
  previewPdfError: "",
};
function getPublicAcknowledgementRoute() {
  const match = window.location.pathname.match(
    /^\/sign\/acknowledgement\/([0-9a-f-]{36})\/?$/i,
  );
  const token = new URLSearchParams(window.location.search).get("token");
  return match && token ? { requestId: match[1], token } : null;
}
function buildAcknowledgementRequestUrl(request) {
  const origin =
    window.location.origin && window.location.origin !== "null"
      ? window.location.origin
      : "http://127.0.0.1:4173";
  return `${origin}/sign/acknowledgement/${encodeURIComponent(request.id)}?token=${encodeURIComponent(request.token)}`;
}
function acknowledgementText(value) {
  const element = document.createElement("div");
  element.innerHTML = String(value || "");
  return (element.textContent || element.innerText || "")
    .replace(/\s+/g, " ")
    .trim();
}
function buildAcknowledgementWispSnapshot(wisp) {
  const drafts = wisp?.section_drafts || state.builderDrafts || {};
  const sections = Object.entries(drafts)
    .map(([id, value]) => {
      const topic = builderTopics.find((item) => item.id === id);
      return {
        title: topic?.title || id.replace(/-/g, " "),
        text: acknowledgementText(value),
      };
    })
    .filter((section) => section.text)
    .slice(0, 16);
  const finalFile =
    wisp?.latest_generated_file ||
    wisp?.latestGeneratedFile ||
    state.wispProject?.latest_generated_file ||
    state.wispProject?.latestGeneratedFile ||
    null;
  return {
    title: wisp?.title || "Written Information Security Plan",
    firmName: state.firmProfile?.name || state.form?.companyName || "Your firm",
    sections,
    finalPdfStoragePath:
      finalFile?.storage_path || finalFile?.storagePath || "",
    finalPdfFileName: finalFile?.file_name || finalFile?.fileName || "",
  };
}
function acknowledgementDefaultText() {
  return `I, [staff name], do hereby acknowledge that I have been informed of and have reviewed the Written Information Security Plan used by [Firm Name].I have undergone training conducted by the Data Security Coordinator. I have also been able to have all questions regarding procedures answered to my satisfaction so that I fully understand the importance of maintaining strict compliance with the purpose and intent of this WISP.I also understand that there will be periodic updates and training if these policies and procedures change for any reason.It has been explained to me that non-compliance with the WISP policies may result in disciplinary actions up to and including termination of employment.I understand the importance of protecting the Personally Identifiable Information of our clients, employees, and contacts, and will diligently monitor my actions, as well as the actions of others, so that [Firm Name] is a safe repository for all personally sensitive data necessary for business needs.I will immediately report any questionable activity to designated representatives in the Firm should I suspect unusual or suspicious activity.Signed,[Staff Name]Title: [Staff Title]Date: [Day when link was made]`;
}
function acknowledgementTextForRequest(request, snapshot) {
  const staffName = request?.recipient_name || "Staff member";
  const staffTitle = request?.recipient_role || "Staff member";
  const firmName = snapshot?.firmName || "Your firm";
  const requestedDate = request?.created_at
    ? formatDashboardDate(request.created_at)
    : "the date this link was created";
  return acknowledgementDefaultText()
    .replaceAll("[staff name]", staffName)
    .replaceAll("[Staff Name]", staffName)
    .replaceAll("[Firm Name]", firmName)
    .replaceAll("[Staff Title]", staffTitle)
    .replaceAll("[Day when link was made]", requestedDate);
}
async function createAcknowledgementRequestsForSelectedStaff() {
  const project = state.wispProject;
  const selectedIds = new Set(state.acknowledgingSignerIds || []);
  const recipients = getSettingsData()
    .staff.filter((member) => selectedIds.has(member.id))
    .map((member) => ({
      staff_id: member.id,
      name:
        `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
        member.email ||
        "Staff member",
      email: member.email || null,
      role: member.title || member.type || null,
    }));
  if (!project?.id) {
    showToast(
      "A WISP is required before sending acknowledgement requests.",
      "error",
    );
    return;
  }
  if (!recipients.length) {
    showToast("Select at least one staff member.", "error");
    return;
  }
  state.acknowledgementRequestBusy = true;
  render();
  try {
    const result = await createWispAcknowledgementRequests({
      projectId: project.id,
      recipients,
      wispSnapshot: buildAcknowledgementWispSnapshot(project),
      acknowledgementText: acknowledgementDefaultText(),
      expiresInDays: 30,
    });
    state.wispProject = {
      ...project,
      acknowledgement_requests: result.acknowledgementRequests || [],
    };
    state.acknowledgementRequestLinks = (result.requests || []).map(
      (request) => ({
        ...request,
        url: buildAcknowledgementRequestUrl(request),
      }),
    );
    state.acknowledgingSignerIds = [];
    showToast(
      `${result.requests?.length || 0} secure request${result.requests?.length === 1 ? "" : "s"} created.`,
      "success",
    );
  } catch (error) {
    showToast(
      error?.message || "Unable to create acknowledgement requests.",
      "error",
    );
  } finally {
    state.acknowledgementRequestBusy = false;
    render();
  }
}
async function removeAcknowledgementRequest(requestId) {
  const projectId = state.wispProject?.id;
  if (!projectId || !requestId) return;
  if (!window.confirm("Remove this acknowledgement request? The signing link will stop working.")) return;
  try {
    const acknowledgementRequests = await removeWispAcknowledgementRequest({ projectId, requestId });
    state.wispProject = { ...state.wispProject, acknowledgement_requests: acknowledgementRequests };
    showToast("Acknowledgement request removed.", "success");
    render();
  } catch (error) {
    showToast(error?.message || "Unable to remove the acknowledgement request.", "error");
  }
}
async function copyAcknowledgementLink(url) {
  if (!url) return;
  try {
    await navigator.clipboard.writeText(url);
    showToast("Secure signing link copied.", "success");
  } catch {
    window.prompt("Copy this secure signing link:", url);
  }
}
async function createPublicAcknowledgementPreviewPdf(snapshot) {
  const { PDFDocument, StandardFonts, rgb } = await import(
    "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm"
  );
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.04, 0.2, 0.34);
  const blue = rgb(0, 0.36, 0.65);
  const muted = rgb(0.35, 0.46, 0.57);
  const ink = rgb(0.07, 0.12, 0.18);
  const width = 612;
  const height = 792;
  const margin = 56;
  const bodyWidth = width - margin * 2;
  const sections =
    Array.isArray(snapshot?.sections) && snapshot.sections.length
      ? snapshot.sections
      : [
          {
            title: "Written Information Security Plan",
            text: "Review the policy provided by your firm before acknowledging your understanding.",
          },
        ];
  const totalPages = sections.length + 1;
  const addHeader = (page, pageNumber) => {
    page.drawRectangle({
      x: 0,
      y: height - 34,
      width,
      height: 34,
      color: navy,
    });
    page.drawText("WRITTEN INFORMATION SECURITY PLAN", {
      x: margin,
      y: height - 22,
      size: 8,
      font: bold,
      color: rgb(1, 1, 1),
    });
    page.drawText(`${pageNumber} / ${totalPages}`, {
      x: width - margin - 28,
      y: 24,
      size: 8,
      font: regular,
      color: muted,
    });
  };
  const cover = pdf.addPage([width, height]);
  addHeader(cover, 1);
  cover.drawText(snapshot?.title || "Written Information Security Plan", {
    x: margin,
    y: 600,
    size: 24,
    font: bold,
    color: navy,
  });
  cover.drawText("Prepared for", {
    x: margin,
    y: 538,
    size: 11,
    font: bold,
    color: muted,
  });
  cover.drawText(snapshot?.firmName || "Your firm", {
    x: margin,
    y: 510,
    size: 17,
    font: regular,
    color: navy,
  });
  cover.drawText("Secure acknowledgement copy", {
    x: margin,
    y: 72,
    size: 9,
    font: regular,
    color: muted,
  });
  sections.forEach((section, index) => {
    const page = pdf.addPage([width, height]);
    addHeader(page, index + 2);
    let y = height - 74;
    page.drawText(String(section.title || "WISP section"), {
      x: margin,
      y,
      size: 17,
      font: bold,
      color: blue,
    });
    y -= 14;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: blue,
    });
    y -= 20;
    wrapPdfText(String(section.text || ""), regular, 10.5, bodyWidth)
      .slice(0, 42)
      .forEach((line) => {
        page.drawText(line, {
          x: margin,
          y,
          size: 10.5,
          font: regular,
          color: ink,
        });
        y -= 15;
      });
  });
  return URL.createObjectURL(
    new Blob([await pdf.save()], { type: "application/pdf" }),
  );
}
async function bootstrapPublicAcknowledgement(route) {
  publicAcknowledgementState.route = route;
  try {
    const module = await import("./supabase-client.js");
    fetchPublicWispAcknowledgementRequest =
      module.fetchPublicWispAcknowledgementRequest ||
      fetchPublicWispAcknowledgementRequest;
    completePublicWispAcknowledgementRequest =
      module.completePublicWispAcknowledgementRequest ||
      completePublicWispAcknowledgementRequest;
    getWispPdfPreviewUrl = module.getWispPdfPreviewUrl || getWispPdfPreviewUrl;
    publicAcknowledgementState.request =
      await fetchPublicWispAcknowledgementRequest(route.requestId, route.token);
  } catch (error) {
    publicAcknowledgementState.error =
      error?.message || "This acknowledgement link is unavailable.";
  }
  if (publicAcknowledgementState.request) {
    try {
      const request = publicAcknowledgementState.request;
      const snapshot = request.wisp_snapshot || {};
      const storagePath =
        request.wisp_pdf_storage_path ||
        request.wispPdfStoragePath ||
        snapshot.finalPdfStoragePath ||
        snapshot.final_pdf_storage_path ||
        "";
      publicAcknowledgementState.previewPdfUrl =
        await getWispPdfPreviewUrl(storagePath);
      if (!publicAcknowledgementState.previewPdfUrl)
        throw new Error("Finalized WISP PDF unavailable");
    } catch {
      publicAcknowledgementState.previewPdfError =
        "The finalized WISP PDF could not be loaded. Please refresh this secure link.";
    }
  }
  renderPublicAcknowledgement();
}
function publicAcknowledgementMessage(request, snapshot) {
  const staffName = escapeHtml(request?.recipient_name || "Staff member");
  const staffTitle = escapeHtml(request?.recipient_role || "Staff member");
  const firmName = escapeHtml(snapshot?.firmName || "Your firm");
  const requestedDate = escapeHtml(
    request?.created_at
      ? formatDashboardDate(request.created_at)
      : "the date this link was created",
  );
  return `<p>I, <strong>${staffName}</strong>, do hereby acknowledge that I have been informed of and have reviewed the Written Information Security Plan used by <strong>${firmName}</strong>.</p>    <p>I have undergone training conducted by the <strong>Data Security Coordinator</strong>. I have also been able to have all questions regarding procedures answered to my satisfaction so that I fully understand the importance of maintaining strict compliance with the purpose and intent of this WISP.</p>    <p>I also understand that there will be periodic updates and training if these policies and procedures change for any reason.</p>    <p>It has been explained to me that non-compliance with the WISP policies may result in disciplinary actions up to and including termination of employment.</p>    <p>I understand the importance of protecting the Personally Identifiable Information of our clients, employees, and contacts, and will diligently monitor my actions, as well as the actions of others, so that <strong>${firmName}</strong> is a safe repository for all personally sensitive data necessary for business needs.</p>    <p>I will immediately report any questionable activity to directed representatives in the Firm should I suspect unusual or suspicious activity.</p>    <p><strong>Signed,</strong><br><strong>${staffName}</strong><br>Title: <strong>${staffTitle}</strong><br>Date: <strong>${requestedDate}</strong></p>`;
}
function renderPublicAcknowledgement() {
  const model = publicAcknowledgementState;
  const request = model.request;
  if (model.error && !request) {
    document.body.innerHTML = `<main class="public-ack-page public-ack-state-page"><header class="public-ack-state-header"><span>EasyWISP</span><small>Secure acknowledgement</small></header><section class="public-ack-state public-ack-state--unavailable"><p class="public-ack-kicker">Acknowledgement link</p><h1>This link can no longer be used.</h1><p class="public-ack-state-lead">${escapeHtml(model.error)}</p><div class="public-ack-state-note"><strong>Need a new link?</strong><span>Please contact the person who sent this acknowledgement to you.</span></div></section></main>`;
    return;
  }
  if (!request) {
    document.body.innerHTML = `<main class="public-ack-page"><section class="public-ack-state"><p class="public-ack-kicker">EasyWISP secure acknowledgement</p><h1>Loading secure signing request</h1><p>Please wait while we verify your link.</p></section></main>`;
    return;
  }
  if (model.completed) {
    document.body.innerHTML = `<main class="public-ack-page public-ack-state-page"><header class="public-ack-state-header"><span>EasyWISP</span><small>Secure acknowledgement</small></header><section class="public-ack-state public-ack-state--success"><p class="public-ack-kicker">Acknowledgement complete</p><h1>You are all set, ${escapeHtml(request.recipient_name || "there")}.</h1><p class="public-ack-state-lead">Your acknowledgement has been recorded for this Written Information Security Plan.</p><div class="public-ack-state-note"><strong>You can close this tab.</strong><span>Your firm now has a record of your acknowledgement.</span></div></section></main>`;
    return;
  }
  const snapshot = request.wisp_snapshot || {};
  const signatureEditor =
    model.mode === "draw"
      ? `<canvas class="public-ack-canvas" data-public-ack-canvas aria-label="Draw your signature"></canvas><p class="public-ack-editor-hint">Draw your signature using a mouse, trackpad, or touch input.</p>`
      : `<input class="public-ack-typed-input" data-public-ack-typed value="${attr(model.typedSignature)}" placeholder="Type your full name" /><div class="public-ack-signature-preview" style="font-family:${attr(PUBLIC_ACK_SIGNATURE_FONTS[model.font])}">${escapeHtml(model.typedSignature || "Your signature")}</div><div class="public-ack-fonts">${Object.keys(
          PUBLIC_ACK_SIGNATURE_FONTS,
        )
          .map(
            (font) =>
              `<button type="button" data-public-ack-font="${font}" class="${model.font === font ? "is-active" : ""}" style="font-family:${attr(PUBLIC_ACK_SIGNATURE_FONTS[font])}">${escapeHtml(font)}</button>`,
          )
          .join("")}</div>`;
  const acknowledgementCopy = acknowledgementTextForRequest(request, snapshot);
  const pdfPreview = model.previewPdfUrl
    ? `<div class="public-ack-pdf-frame"><iframe class="builder-review-pdf-object public-ack-pdf-object" src="${attr(model.previewPdfUrl)}#view=FitH&toolbar=0&navpanes=0" type="application/pdf" aria-label="WISP PDF preview"></iframe></div>`
    : `<div class="public-ack-preview-loading">${escapeHtml(model.previewPdfError || "Preparing the WISP PDF preview...")}</div>`;
  document.body.innerHTML = `<main class="public-ack-page"><header class="public-ack-topbar"><div class="public-ack-brand"><span>EasyWISP</span><small>Secure acknowledgement</small></div><span>Private signing link</span></header><div class="public-ack-shell"><div class="public-ack-heading"><p class="public-ack-kicker">Employee acknowledgement of understanding</p><h1>Review and acknowledge your WISP</h1><p>This secure link is assigned to ${escapeHtml(request.recipient_name || "you")} and remains valid until ${escapeHtml(formatDashboardDate(request.expires_at))}.</p></div><div class="public-ack-grid"><section class="public-ack-card"><p class="public-ack-kicker">Your acknowledgement</p><h2>${escapeHtml(request.recipient_name || "Staff acknowledgement")}</h2><p class="public-ack-role">${escapeHtml(request.recipient_role || "Staff member")}</p><div class="public-ack-copy">${publicAcknowledgementMessage(request, snapshot)}</div><div class="public-ack-signature"><div class="public-ack-signature-head"><span>Signature</span><button type="button" data-public-ack-clear>Clear</button></div><div class="public-ack-tabs"><button type="button" data-public-ack-mode="draw" class="${model.mode === "draw" ? "is-active" : ""}">Draw</button><button type="button" data-public-ack-mode="type" class="${model.mode === "type" ? "is-active" : ""}">Type</button></div><div class="public-ack-editor">${signatureEditor}</div></div>${model.error ? `<p class="public-ack-error">${escapeHtml(model.error)}</p>` : ""}<button class="public-ack-submit" type="button" data-public-ack-submit ${model.saving ? "disabled" : ""}>${model.saving ? "Saving acknowledgement..." : "I understand and acknowledge"}</button></section><aside class="public-ack-preview"><div class="public-ack-preview-head"><span>WISP PDF preview</span><strong>${escapeHtml(snapshot.firmName || "Your firm")}</strong></div>${pdfPreview}</aside></div></div></main>`;
  document.querySelectorAll("[data-public-ack-mode]").forEach((button) =>
    button.addEventListener("click", () => {
      model.mode = button.dataset.publicAckMode;
      model.error = "";
      renderPublicAcknowledgement();
    }),
  );
  document
    .querySelector("[data-public-ack-clear]")
    ?.addEventListener("click", () => {
      model.drawData = "";
      model.typedSignature = "";
      model.error = "";
      renderPublicAcknowledgement();
    });
  document
    .querySelector("[data-public-ack-typed]")
    ?.addEventListener("input", (event) => {
      model.typedSignature = event.target.value;
      const preview = document.querySelector(".public-ack-signature-preview");
      if (preview)
        preview.textContent = model.typedSignature || "Your signature";
    });
  document.querySelectorAll("[data-public-ack-font]").forEach((button) =>
    button.addEventListener("click", () => {
      model.font = button.dataset.publicAckFont;
      renderPublicAcknowledgement();
    }),
  );
  document
    .querySelector("[data-public-ack-submit]")
    ?.addEventListener("click", submitPublicAcknowledgement);
  if (model.mode === "draw") setupPublicAcknowledgementCanvas();
}
function setupPublicAcknowledgementCanvas() {
  const canvas = document.querySelector("[data-public-ack-canvas]");
  if (!canvas) return;
  const bounds = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(bounds.width * ratio));
  canvas.height = Math.max(1, Math.floor(bounds.height * ratio));
  const context = canvas.getContext("2d");
  context.scale(ratio, ratio);
  context.lineWidth = 2.5;
  context.strokeStyle = "#153955";
  context.lineCap = "round";
  context.lineJoin = "round";
  if (publicAcknowledgementState.drawData) {
    const image = new Image();
    image.onload = () =>
      context.drawImage(image, 0, 0, bounds.width, bounds.height);
    image.src = publicAcknowledgementState.drawData;
  }
  let drawing = false;
  let lastPoint = null;
  const getPoint = (event) => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  canvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    lastPoint = getPoint(event);
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!drawing) return;
    const nextPoint = getPoint(event);
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(nextPoint.x, nextPoint.y);
    context.stroke();
    lastPoint = nextPoint;
  });
  const finish = () => {
    if (drawing)
      publicAcknowledgementState.drawData = canvas.toDataURL("image/png");
    drawing = false;
    lastPoint = null;
  };
  canvas.addEventListener("pointerup", finish);
  canvas.addEventListener("pointercancel", finish);
}
async function submitPublicAcknowledgement() {
  const model = publicAcknowledgementState;
  const signatureData =
    model.mode === "draw" ? model.drawData : model.typedSignature.trim();
  if (!signatureData) {
    model.error =
      "Provide your signature before submitting this acknowledgement.";
    renderPublicAcknowledgement();
    return;
  }
  model.saving = true;
  model.error = "";
  renderPublicAcknowledgement();
  try {
    await completePublicWispAcknowledgementRequest({
      requestId: model.route.requestId,
      token: model.route.token,
      signatureMethod: model.mode,
      signatureData,
      signatureFont: model.mode === "type" ? model.font : null,
    });
    model.completed = true;
  } catch (error) {
    model.error = error?.message || "Unable to save your acknowledgement.";
  } finally {
    model.saving = false;
    renderPublicAcknowledgement();
  }
}
const publicAcknowledgementRoute = getPublicAcknowledgementRoute();
installWispNowBranding();
if (publicAcknowledgementRoute)
  bootstrapPublicAcknowledgement(publicAcknowledgementRoute);
else bootstrapApp();
