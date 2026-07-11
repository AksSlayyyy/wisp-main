let deleteDocument = async () => {};
let fetchBootstrapState = async () => null;
let hasSupabaseAuth = () => false;
let saveRiskAssessmentDraft = async () => null;
let saveWispDraft = async () => null;
let finalizeWispBuild = async () => null;
let signInWithMagicLink = async () => {};
let signOutCurrentUser = async () => {};
let subscribeToAuthChanges = () => () => {};
let uploadCompanyLogo = async () => null;
let removeCompanyLogo = async () => null;
let uploadDocuments = async () => [];
let saveDocumentWorkspaces = async () => null;
let saveWorkspaceSettings = async () => null;

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
  "Patch Management"
];

const documentTemplates = [
  {
    id: "pii-hardware-inventory",
    title: "PII Hardware Inventory",
    description: "Track the hardware, storage locations, owners, and protection status of devices that may contain client information.",
    fileLabel: "Editable worksheet",
    updated: "Updated for in-app editing",
    defaultColumns: ["Asset ID", "Device Type", "Assigned To", "Location", "Stores PII", "Encryption", "Notes"],
    defaultRows: [
      ["HW-001", "Workstation", "John Miller", "Front office", "Yes", "Enabled", "Primary tax prep desktop"],
      ["HW-002", "Laptop", "Melissa Grant", "Remote / hybrid", "Yes", "Enabled", "Used for client reviews"],
      ["HW-003", "Server", "IT Vendor", "Locked server closet", "Yes", "At rest", "Placeholder row - replace with live inventory"],
    ],
  },
  {
    id: "pii-access-list",
    title: "Firm's PII Access List",
    description: "Maintain the list of people, systems, and access levels approved to handle protected information.",
    fileLabel: "Editable worksheet",
    updated: "Updated for in-app editing",
    defaultColumns: ["Person", "Role", "System / Location", "Access Level", "Approved By", "Notes"],
    defaultRows: [
      ["John Miller", "Principal Operating Officer", "Tax platform", "Admin", "Managing partner", "Placeholder approval record"],
      ["Sarah Chen", "Data Security Coordinator", "Document portal", "Full", "Managing partner", "Security oversight"],
    ],
  },
  {
    id: "terminated-employee-checklist",
    title: "Terminated Employee Checklist",
    description: "Use a step-by-step checklist to revoke access, recover equipment, and document offboarding actions.",
    fileLabel: "Editable worksheet",
    updated: "Updated for in-app editing",
    defaultColumns: ["Task", "Owner", "Status", "Completed On", "Evidence", "Notes"],
    defaultRows: [
      ["Disable email login", "IT team", "Pending", "", "", "Placeholder offboarding task"],
      ["Recover laptop and badge", "Office manager", "Pending", "", "", "Add physical access notes here"],
    ],
  },
  {
    id: "record-retention-guide",
    title: "Record Retention Guide",
    description: "Document what records are kept, where they live, and when they should be securely destroyed.",
    fileLabel: "Editable worksheet",
    updated: "Updated for in-app editing",
    defaultColumns: ["Record Category", "Storage Location", "Retention Period", "Destruction Method", "Owner", "Notes"],
    defaultRows: [
      ["Client tax returns", "Encrypted drive / DMS", "3 years", "Secure deletion", "Tax operations", "Placeholder retention rule"],
      ["Employee onboarding forms", "HR folder", "7 years", "Cross-cut shred", "HR", "Adjust to firm policy"],
    ],
  },
  {
    id: "disaster-recovery-topics",
    title: "Disaster Recovery Topics",
    description: "Capture the recovery owners, recovery order, and fallback process for core firm systems.",
    fileLabel: "Editable worksheet",
    updated: "Updated for in-app editing",
    defaultColumns: ["Critical Function", "System / Vendor", "Recovery Owner", "Target Restore Time", "Fallback Process", "Notes"],
    defaultRows: [
      ["Tax filing operations", "Primary tax platform", "John Miller", "4 hours", "Switch to vendor-hosted backup", "Placeholder continuity scenario"],
      ["Client communication", "Microsoft 365", "Melissa Grant", "2 hours", "Use alternate email + phone tree", "Add escalation path"],
    ],
  },
  {
    id: "incident-report",
    title: "Incident Report: Potential Data Breach Notification",
    description: "Log potential exposure events, affected systems, actions taken, and follow-up owners in one place.",
    fileLabel: "Editable worksheet",
    updated: "Updated for in-app editing",
    defaultColumns: ["Incident Date", "Reporter", "Affected System", "Severity", "Immediate Actions", "Follow-up Owner", "Notes"],
    defaultRows: [
      ["", "", "", "Medium", "", "", "Use this placeholder row for the first incident record"],
    ],
  },
];
const trainingLibrary = {
  mandatory: [
    {
      kind: "document",
      title: "[PDF] EasyWISP Staff Security Awareness Training - 11 pages",
      actionPrimary: "View",
      actionSecondary: "Download",
      assetPath: "design/training/easywisp-staff-security-awareness-training.pdf",
      filename: "easywisp-staff-security-awareness-training.pdf",
      previewLabel: "Mandatory staff training",
    },
    {
      kind: "document",
      title: "[PDF] EasyWISP Phishing Awareness Training - 11 pages",
      actionPrimary: "View",
      actionSecondary: "Download",
      assetPath: "design/training/easywisp-phishing-awareness-training.pdf",
      filename: "easywisp-phishing-awareness-training.pdf",
      previewLabel: "Phishing awareness module",
    },
    {
      kind: "document",
      title: "[PDF] EasyWISP IRS Dirty Dozen Briefing - 11 pages",
      actionPrimary: "View",
      actionSecondary: "Download",
      assetPath: "design/training/easywisp-irs-dirty-dozen-briefing.pdf",
      filename: "easywisp-irs-dirty-dozen-briefing.pdf",
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
      title: "Written Information Security Plan Overview • 14 Mins",
      actionPrimary: "Watch Video",
    },
    {
      kind: "video",
      title: "Security Awareness: Recognizing Phishing Scams • 7 Mins",
      actionPrimary: "Watch Video",
    },
    {
      kind: "video",
      title: "IRS \"Dirty Dozen\" Financial Scams Briefing • 11 Mins",
      actionPrimary: "Watch Video",
    },
  ],
  resources: [
    {
      kind: "document",
      title: "[PDF] FTC Safeguards Rule Quick Reference Guide • 1.8 MB",
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
    templateText: "This section can be updated to reflect your firmÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢s roles, policies, systems, and operating practices.",
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
    templateHtml: `<p><strong>Anti-virus software</strong> - software designed to detect and potentially eliminate viruses before damaging the system. This software can also repair or quarantine files that have already been infected by virus activity.</p><p><strong>Attachment</strong> - a file added to an email. It could be something useful to you, or something harmful to your computer.</p><p><strong>Authentication</strong> - confirms the correctness of the claimed identity of an individual user, machine, software component or any other entity.</p><p><strong>Breach</strong> - unauthorized access of a computer or network, usually through the electronic gathering of login credentials of an approved user on the system.</p><p><strong>Clear desk policy</strong> - a policy that directs all personnel to clear their desks at the end of each working day, and file everything appropriately. Desks should be cleared of all documents and papers, including the contents of the ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œinÃƒÂ¢Ã¢â€šÂ¬Ã‚Â and ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œoutÃƒÂ¢Ã¢â€šÂ¬Ã‚Â trays - not simply for cleanliness, but also to ensure that sensitive papers and documents are not exposed to unauthorized persons outside of working hours.</p><p><strong>Clear screen policy</strong> - a policy that directs all computer users to ensure that the contents of the screen are protected from prying eyes and opportunistic breaches of confidentiality. Typically, the easiest means of compliance is to use a screensaver that engages either on request or after a specified brief period.</p><p><strong>Cybersecurity</strong> - the protection of information assets by addressing threats to information processed, stored, and transported by internetworked information systems.</p><p><strong>Data Security Coordinator (DSC)</strong> - the firm-designated employee who will act as the chief data security officer for the firm. The DSC is responsible for all aspects of your firmÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢s data security posture, especially as it relates to the PII of any client or employee the firm possesses in the course of normal business operations.</p><p><strong>Data breach</strong> - an incident in which sensitive, protected, or confidential data has potentially been viewed, stolen or used by an individual unauthorized to do so. Data breaches may involve personal health information (PHI), personally identifiable information (PII), trade secrets or intellectual property.</p><p><strong>Encryption</strong> - a data security technique used to protect information from unauthorized inspection or alteration. Information is encoded so that it appears as a meaningless string of letters and symbols during delivery or transmission. Upon receipt, the information is decoded using a decryption key.</p><p><strong>Firewall</strong> - a hardware or software link in a network that inspects all data packets coming and going from a computer, permitting only those that are authorized to reach the other side. It is helpful in controlling external access to a computer or network.</p><p><strong>GLBA</strong> - Gramm-Leach-Bliley Act. Administered by the Federal Trade Commission. Establishes safeguards for all privacy-controlled information through business segment Safeguards Rule enforced business practices.</p><p><strong>Hardware firewall</strong> - a dedicated computer configured to exclusively provide firewall services between another computer or network and the internet or other external connections.</p><p><strong>Malware</strong> - malicious software, any computer program designed to infiltrate, damage or disable computers.</p><p><strong>Multi-factor authentication</strong> - a security system that requires returning users to enter more than just credentials (username and password) to access an account or device, such as two-factor or three-factor authentication. The FTC Safeguards Rule requires authentication through verification of at least two of the following types of authentication factors: knowledge factors, such as password; possession factors, such as a token; or inherence factors, such as biometric characteristics.</p><p><strong>Network</strong> - two or more computers that are grouped together to share information, software, and hardware. Can be a local office network or an internet-connection based network.</p><p><strong>Out-of-stream</strong> - usually relates to the forwarding of a password for a file via a different mode of communication separate from the protected file. Example: A password protected file was emailed, but the password was relayed to the recipient via text message, outside of the same stream of information from the protected file.</p><p><strong>Patch</strong> - a small security update released by a software manufacturer to fix bugs in existing programs.</p><p><strong>Phishing email</strong> - broad term for email scams that appear legitimate for the purpose of tricking the recipient into sharing sensitive information or installing malware.</p><p><strong>PII</strong> - Personally Identifiable Information. The name, address, Social Security number, banking, or other information used to establish official business. Also known as Privacy-Controlled Information.</p><p><strong>Public Information Officer (PIO)</strong> - the PIO is the single point of contact for any outward communications from the firm related to a data breach incident where PII has been exposed to an unauthorized party. This position allows the firm to communicate to affected clients, media, or local businesses and associates in a controlled manner while allowing the Data Security Coordinator freedom to work on remediation internally.</p><p><strong>Risk analysis</strong> - a process by which frequency and magnitude of IT risk scenarios are estimated; the initial steps of risk management; analyzing the value of assets to the business, identifying threats to those assets and evaluating how vulnerable each asset is to those threats.</p><p><strong>Security awareness</strong> - the extent to which every employee with access to confidential information understands their responsibility to protect the physical and information assets of the organization.</p><p><strong>Service providers</strong> - any business service provider contracted with for services, such as janitorial services, IT professionals, and document destruction services employed by the firm who may come in contact with sensitive client PII.</p><p><strong>Software firewall</strong> - an application installed on an existing operating system that adds firewall services to the existing programs and services on the system. A firewall restricts access according to specific sets of rules to reduce or eliminate the possibility of hacking.</p><p><strong>VPN (Virtual Private Network)</strong> - a secure remote network or Internet connection encrypting communications between a local device and a remote trusted device or service that prevents en-route interception of data.</p><p><strong>Written Information Security Plan</strong> - a documented, structured approach identifying related activities and procedures that maintain a security awareness culture and to formulate security posture guidelines. Mandated for Tax & Accounting firms through the FTC Safeguards Rule supporting the Gramm-Leach-Bliley Act privacy law.</p>`,
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
      { label: "FTC Financial Institution How to Comply", url: "https://www.ftc.gov/business-guidance/privacy-security/gramm-leach-bliley-act" },
      { label: "FTC Safeguards Rule", url: "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-314" },
      { label: "FTC Data Breach Response Guide", url: "https://www.ftc.gov/business-guidance/resources/data-breach-response-guide-business" },
      { label: "FTC Safeguards Rule Security Event Reporting Form", url: "https://www.ftc.gov/forms/safeguards-rule-security-event" },
    ],
  },
  {
    title: "National Institute of Standards and Technology",
    links: [
      { label: "Cybercrime & Cyber Threats to Small Business", url: "https://www.nist.gov/itl/smallbusinesscyber/cybersecurity-basics/cybercrime-and-cyber-threats" },
      { label: "Cybercrime it's worse than we thought", url: "https://www.nist.gov/blogs/manufacturing-innovation-blog/cybercrime-its-worse-we-thought" },
      { label: "Cybercrime existential threat small business", url: "https://www.nist.gov/blogs/manufacturing-innovation-blog/cybersecurity-small-businesses-essential-not-optional" },
      { label: "NIST Computer Security Resource Center", url: "https://csrc.nist.gov/" },
      { label: "NIST Cybersecurity Framework examples", url: "https://www.nist.gov/cyberframework/online-learning/five-functions" },
    ],
  },
  {
    title: "Federal Communications Commission",
    links: [
      { label: "FCC Cyber Threat Resources", url: "https://www.fcc.gov/cyberplanner" },
    ],
  },
  {
    title: "Internal Revenue Service",
    links: [
      { label: "IRS Publication 4557", url: "https://www.irs.gov/pub/irs-pdf/p4557.pdf" },
      { label: "IRS Publication 5709", url: "https://www.irs.gov/pub/irs-pdf/p5709.pdf" },
      { label: "IRS Publication 5280", url: "https://www.irs.gov/pub/irs-pdf/p5280.pdf" },
      { label: "IRS Publication 1345", url: "https://www.irs.gov/pub/irs-pdf/p1345.pdf" },
      { label: "IRS Stakeholder Liaison", url: "https://www.irs.gov/e-file-providers/stakeholder-liaison-local-contact-information" },
      { label: "IRS Data Theft Reporting Process", url: "https://www.irs.gov/tax-professionals/reporting-client-data-theft-to-the-irs" },
    ],
  },
];

const initialBuilderDrafts = {
  ...Object.fromEntries(builderTopics.map((topic) => [topic.id, topic.templateHtml ?? topic.templateText])),
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
      name: "John Miller",
      email: "currentfiscal@outlook.com",
      passwordUpdatedAt: "2026-03-18T00:00:00.000Z",
      mfaEnabled: true,
      mfaMethod: "Authenticator App (TOTP)",
      mfaVerifiedOn: "2026-06-15T00:00:00.000Z",
      sessionsNote: "Active sessions are shown in your active sessions.",
    },
    company: {
      address: "2750 West Loop South, Houston, TX 77027",
      phone: "(555) 012-4831",
      email: "contact@currentfiscal.com",
    },
    billing: {
      planName: "EasyWISP Professional",
      status: "Active",
      priceMonthly: 299,
      paymentMethod: "Visa ending in 4242",
      renewalDate: "2026-07-18",
      billingContact: "contact@currentfiscal.com",
      billingAddress: "2750 West Loop South, Houston, TX 77027",
      cardholder: "Current Fiscal LLC",
      cardBrand: "VISA",
      cardLast4: "4242",
      autoRenew: true,
      inviteSeatsRemaining: 1,
    },
    users: [
      { id: "user-john", firstName: "John (You)", lastName: "Miller", email: "john.miller@currentfiscal.com", permission: "Administrator", status: "Verified", actions: [] },
      { id: "user-sarah", firstName: "Sarah", lastName: "Chen", email: "sarah.chen@currentfiscal.com", permission: "Manager", status: "Verified", actions: [] },
      { id: "user-melissa", firstName: "Melissa", lastName: "Grant", email: "melissa.grant@currentfiscal.com", permission: "Basic", status: "Invited", actions: ["Resend Invitation", "Revoke Invitation"] },
    ],
    staff: [],
    activityLogs: [
      { id: "log-1", activity: "Login", user: "John Miller", details: "Successful sign-in from primary workstation", date: "2026-06-18T10:42:00.000Z", ip: "198.51.100.24" },
      { id: "log-2", activity: "Logout", user: "John Miller", details: "User manually signed out of the WISP Builder", date: "2026-06-18T11:13:00.000Z", ip: "198.51.100.24" },
      { id: "log-3", activity: "User Updated", user: "Sarah Chen", details: "Permission level changed from Basic to Manager", date: "2026-06-17T16:18:00.000Z", ip: "203.0.113.18" },
      { id: "log-4", activity: "Login", user: "Melissa Grant", details: "Invitation accepted and first verified login completed", date: "2026-06-16T09:04:00.000Z", ip: "192.0.2.61" },
      { id: "log-5", activity: "Settings Change", user: "John Miller", details: "Updated company profile and billing contact details", date: "2026-06-15T14:27:00.000Z", ip: "198.51.100.24" },
    ],
  };
}

function normalizeSettingsData(settings) {
  const defaults = defaultSettingsData();
  const input = settings && typeof settings === "object" ? settings : {};
  return {
    profile: { ...defaults.profile, ...(input.profile || {}) },
    company: { ...defaults.company, ...(input.company || {}) },
    billing: { ...defaults.billing, ...(input.billing || {}) },
    users: Array.isArray(input.users) ? input.users.map((user, index) => ({ id: user.id || `user-${index + 1}`, actions: Array.isArray(user.actions) ? user.actions : [], ...user })) : defaults.users,
    staff: Array.isArray(input.staff) ? input.staff.map((staff, index) => ({ id: staff.id || `staff-${index + 1}`, ...staff })) : defaults.staff,
    activityLogs: Array.isArray(input.activityLogs) ? input.activityLogs.map((log, index) => ({ id: log.id || `log-${index + 1}`, ...log })) : defaults.activityLogs,
  };
}

let state = {
  screen: "home",
  sectionIndex: 0,
  section2Substep: 0,
  form: structuredClone(initialForm),
  errors: {},
  drawer: null,
  builderTab: "active",
  builderResumeEditing: false,
  builderLaunchAnimation: false,
  builderSidebarOpen: false,
  builderReviewLoading: false,
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
  builderDrafts: normalizeBuilderDraftMap(structuredClone(initialBuilderDrafts)),
  builderAttachments: [],
  wispProject: null,
  wispVersions: [],
  documentsFiles: [],
  documentWorkspaces: {},
  documentEditor: null,
  trainingAssets: structuredClone(trainingLibrary),
  trainingQuery: "",
  trainingPreviewOpen: false,
  trainingPreviewTitle: "",
  trainingPreviewLabel: "",
  trainingPreviewUrl: "",
  trainingPreviewLoading: false,
  trainingPreviewError: "",
  settingsTab: "profile",
  settingsLogo: null,
  settingsData: defaultSettingsData(),
  showPlanModal: false,
  dashboardData: null,
  firmProfile: null,
  authAvailable: false,
  authReady: false,
  authBusy: false,
  authEmail: "",
  authError: "",
  authNotice: "",
  authUser: null,
  riskDraftStatus: "idle",
  riskDraftSavedAt: "",
};

const app = document.getElementById("app");
let riskDraftSyncTimer = null;
let builderDraftSyncTimer = null;
let builderDraftReviewTimer = null;
let documentWorkspaceSyncTimer = null;
let settingsSyncTimer = null;
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
  states: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"],
  emailProviders: ["Microsoft 365 / Outlook", "Google Workspace / Gmail", "GoDaddy Email", "Yahoo / AOL", "Proton Mail", "Other"],
  practiceTypes: [
    "Solo CPA / Sole Practitioner",
    "Small CPA Firm (2–10 staff)",
    "Mid-size Accounting Firm (11–50)",
    "Bookkeeping / Tax Practice",
    "Multi-location Accounting Firm",
    "Financial Advisory + Accounting",
  ],
  staffSizes: ["Solo / 1 person", "2–10 staff", "11–50 staff", "51+ staff"],
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
    "No IT support — we manage ourselves",
    "Break-fix vendor (call when broken)",
    "1 internal IT person",
    "Existing MSP partner",
    "Mixed — some internal, some outsourced",
  ],
  server: ["Yes", "No", "Not sure"],
  materials: ["Sent to my Email", "Paper Files", "Fax", "Online Client Portal (from your website, email signature, or similar)", "Third-party cloud storage (Dropbox / Google Drive / OneDrive / Box.com, etc.)"],
  workModel: ["It's just me ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â I work from an office only", "It's just me ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â I work from my home and office", "Hybrid ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â my staff and I work from home and the office", "No ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â everyone works only from the office", "Yes ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â my whole staff works from home / remote (U.S.)", "I have some staff outside the U.S."],
  storage: ["OneDrive/SharePoint", "Google Drive", "Dropbox / Box / ShareFile", "Local Server Share / NAS", "Just My Computer", "On an external USB drive", "Other"],
  backups: ["I use file backup software (e.g. Carbonite, Backblaze, Code42/CrashPlan)", "I use an external USB hard drive plugged into my computer", "My managed IT provider backs up or protects my data (monthly plan, etc.)", "I don't currently back up my data with any solution", "Not applicable (no work data on local computers or servers)"],
  roles: ["Owner / Partner", "Tax preparer", "Bookkeeper", "Payroll staff", "Administrative support", "IT support", "Other"],
  locations: ["Office only", "Home office", "Hybrid", "Remote U.S.", "Outside U.S."],
  mfa: ["Yes, on all systems", "Yes, on some systems", "No, not currently", "I don't know what MFA is"],
  password: ["Yes, passwords must be changed regularly", "Yes, but passwords don't expire", "No formal policy"],
  dataProtection: ["Yes, both when stored and when sent", "Yes, only when sent (e.g., secure email)", "Yes, only when stored (e.g., BitLocker, FileVault)", "No", "I don't know"],
  office: ["Dedicated commercial office space", "Shared office / Co-working space", "Home office", "Multiple locations"],
  visitor: ["Yes, all visitors must sign in", "Yes, but informal", "No", "Not applicable (no visitors)"],
  disposal: ["Professional IT disposal service", "Wipe and donate/recycle", "Physically destroy drives", "Just throw them away", "Store them / haven't disposed yet"],
  breach: ["Yes", "No", "Not sure"],
  incident: ["Yes, fully documented", "Partially documented", "No, but we know what to do", "No plan at all", "EasyWISP will be my new incident response plan"],
  years: ["3 years", "5 years", "7 years", "10 years", "Indefinitely", "Not sure"],
  records: ["Professional shredding service", "Shred in-house", "Recycle/trash without shredding", "Store old records indefinitely", "Not sure"],
  training: ["Yes, I have completed security awareness training", "No", "EasyWISP will be my new cybersecurity awareness training"],
  builderRoleOptions: ["John Miller", "Sarah Chen", "David Patel", "Melissa Grant"],
};

function setState(next) {
  state = { ...state, ...next };
  render();
}

const LOCAL_COMPANY_LOGO_KEY = "easywisp.settings.company-logo";
const LOCAL_RISK_DRAFT_KEY = "easywisp.risk-draft";

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
    localStorage.setItem(LOCAL_RISK_DRAFT_KEY, JSON.stringify({
      form: structuredClone(form),
      updatedAt: new Date().toISOString(),
    }));
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

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Unable to read file"));
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
  return normalized.length > 42 ? normalized.slice(0, 39).trimEnd() + "�" : normalized;
}

async function applyCompanyLogoFile(file) {
  if (!file) return;
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
  return ["companyName", "primaryContact", "practiceType", "staffSize", "taxSoftware", "itManagement"].includes(name) || String(name || "").startsWith("question_");
}

function scheduleRiskDraftSync(meta = {}) {
  clearTimeout(riskDraftSyncTimer);
  state.riskDraftStatus = "pending";
  riskDraftSyncTimer = setTimeout(() => {
    state.riskDraftStatus = "saving";
    persistRiskDraft(buildRiskDraftMeta(meta)).catch((error) => console.warn("Risk draft sync skipped", error));
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
      const selected = item.options.find((option) => option.label === answer_value);
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
    scoreSummary: meta.scoreSummary || (hasAnyAnswers ? scoreAssessment() : undefined),
  };
}

async function persistRiskDraft(meta = {}) {
  try {
    const saved = await saveRiskAssessmentDraft(state.form, meta);
    saveLocalRiskDraft(state.form);
    state.riskDraftStatus = "saved";
    state.riskDraftSavedAt = new Date().toISOString();
    if (saved?.company_name || saved?.primary_contact) {
      state.firmProfile = { ...(state.firmProfile || {}), name: saved.company_name || state.firmProfile?.name, primary_contact: saved.primary_contact || state.firmProfile?.primary_contact };
    }
    if (saved?.dashboard_facts) {
      state.dashboardData = saved.dashboard_facts;
      return saved;
    }
    if (meta.scoreSummary) {
      state.dashboardData = {
        ...(state.dashboardData || {}),
        completion_percent: meta.scoreSummary.overall || state.dashboardData?.completion_percent || 68,
        focus_area: meta.scoreSummary.topArea || state.dashboardData?.focus_area || "Administrative Safeguards",
        status_label: (meta.scoreSummary.overall || 68) >= 80 ? "On Track" : "In Progress",
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
  const savedIndex = Number(state.wispProject?.assessment_snapshot?.builderTopicIndex);
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
  clearTimeout(builderDraftSyncTimer);
  builderDraftSyncTimer = setTimeout(() => {
    saveWispDraft(state.builderDrafts, getBuilderDraftMeta(meta))
      .then((savedProject) => {
        if (savedProject) {
          state.wispProject = savedProject;
          if (savedProject.dashboard_facts) state.dashboardData = savedProject.dashboard_facts;
        }
      })
      .catch((error) => console.warn("Builder draft sync skipped", error));
  }, 700);
}

function scheduleDocumentWorkspaceSync() {
  clearTimeout(documentWorkspaceSyncTimer);
  documentWorkspaceSyncTimer = setTimeout(() => {
    saveDocumentWorkspaces(state.documentWorkspaces)
      .catch((error) => console.warn("Document workspace sync skipped", error));
  }, 500);
}

function scheduleSettingsSync() {
  clearTimeout(settingsSyncTimer);
  settingsSyncTimer = setTimeout(() => {
    saveWorkspaceSettings(state.settingsData)
      .catch((error) => console.warn("Settings sync skipped", error));
  }, 500);
}

function appendSettingsActivityLog(activity, details, user = null) {
  state.settingsData = normalizeSettingsData(state.settingsData);
  state.settingsData.activityLogs = [
    {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      activity,
      user: user || state.settingsData.profile?.name || state.authUser?.email || "Workspace User",
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
  state.builderDrafts = normalizeBuilderDraftMap(structuredClone(initialBuilderDrafts));
  state.builderAttachments = [];
  state.wispProject = null;
  state.wispVersions = [];
  state.documentsFiles = [];
  state.documentWorkspaces = {};
  state.documentEditor = null;
  state.trainingAssets = structuredClone(trainingLibrary);
  state.settingsLogo = null;
  state.settingsData = defaultSettingsData();
  state.dashboardData = null;
  state.firmProfile = null;
  state.riskDraftStatus = "idle";
  state.riskDraftSavedAt = "";
}

function applyBootstrapState(bootstrap) {
  if (!bootstrap) return;
  state.authUser = bootstrap.user || null;

  if (bootstrap.firm) {
    state.firmProfile = bootstrap.firm;
    state.form = {
      ...state.form,
      companyName: bootstrap.firm.name || state.form.companyName,
      primaryContact: bootstrap.firm.primary_contact || state.form.primaryContact,
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
      primaryContact: bootstrap.assessment.primary_contact || state.form.primaryContact,
      practiceType: bootstrap.assessment.practice_type || state.form.practiceType,
      staffSize: bootstrap.assessment.staff_size || state.form.staffSize,
      taxSoftware: bootstrap.assessment.tax_software || state.form.taxSoftware,
      itManagement: bootstrap.assessment.it_management || state.form.itManagement,
      ...answers,
    };
  }

  state.documentsFiles = bootstrap.documents || state.documentsFiles;
  state.documentWorkspaces = normalizeDocumentWorkspaceMap(bootstrap.settings?.settings?.document_workspaces || state.documentWorkspaces);
  state.trainingAssets = bootstrap.trainingAssets || state.trainingAssets;
  state.dashboardData = bootstrap.dashboard || state.dashboardData;
  state.wispProject = bootstrap.wispProject || state.wispProject;
  state.wispVersions = bootstrap.wispVersions || state.wispVersions;

  if (bootstrap.wispProject?.section_drafts && Object.keys(bootstrap.wispProject.section_drafts).length) {
    state.builderDrafts = { ...state.builderDrafts, ...bootstrap.wispProject.section_drafts };
  }

  if (bootstrap.wispProject?.assessment_snapshot?.builderTopicIndex !== undefined) {
    state.builderTopicIndex = getSavedBuilderTopicIndex();
  }

  state.settingsData = normalizeSettingsData(bootstrap.settings?.settings || state.settingsData);

  applyLocalRiskDraft();

  const localCompanyLogo = loadLocalCompanyLogo();
  if (bootstrap.settings?.logo_path || localCompanyLogo) {
    const fileName = bootstrap.settings?.logo_path?.split("/").pop() || localCompanyLogo?.name || "Company logo";
    state.settingsLogo = {
      name: fileName,
      size: localCompanyLogo?.size || 0,
      type: localCompanyLogo?.type || "image/*",
      storagePath: bootstrap.settings?.logo_path || localCompanyLogo?.storagePath || null,
      previewUrl: localCompanyLogo?.previewUrl || bootstrap.settings?.logo_url || null,
    };
  }
}

async function syncAuthWorkspace() {
  try {
    const bootstrap = await fetchBootstrapState();
    if (bootstrap) applyBootstrapState(bootstrap);
    else if (state.authAvailable) {
      state.authUser = null;
      resetWorkspaceState();
    }
  } catch (error) {
    console.warn("Auth workspace sync unavailable", error);
  }
}

async function bootstrapApp() {
  try {
    try {
      const supabaseModule = await import("./supabase-client.js");
      deleteDocument = supabaseModule.deleteDocument || deleteDocument;
      fetchBootstrapState = supabaseModule.fetchBootstrapState || fetchBootstrapState;
      finalizeWispBuild = supabaseModule.finalizeWispBuild || finalizeWispBuild;
      hasSupabaseAuth = supabaseModule.hasSupabaseAuth || hasSupabaseAuth;
      saveRiskAssessmentDraft = supabaseModule.saveRiskAssessmentDraft || saveRiskAssessmentDraft;
      saveWispDraft = supabaseModule.saveWispDraft || saveWispDraft;
      saveDocumentWorkspaces = supabaseModule.saveDocumentWorkspaces || saveDocumentWorkspaces;
      saveWorkspaceSettings = supabaseModule.saveWorkspaceSettings || saveWorkspaceSettings;
      signInWithMagicLink = supabaseModule.signInWithMagicLink || signInWithMagicLink;
      signOutCurrentUser = supabaseModule.signOutCurrentUser || signOutCurrentUser;
      subscribeToAuthChanges = supabaseModule.subscribeToAuthChanges || subscribeToAuthChanges;
      uploadCompanyLogo = supabaseModule.uploadCompanyLogo || uploadCompanyLogo;
      removeCompanyLogo = supabaseModule.removeCompanyLogo || removeCompanyLogo;
      uploadDocuments = supabaseModule.uploadDocuments || uploadDocuments;
      state.authAvailable = hasSupabaseAuth();
      authSubscriptionCleanup();
      if (state.authAvailable) {
        authSubscriptionCleanup = subscribeToAuthChanges(async (user) => {
          state.authUser = user;
          state.authError = "";
          state.authReady = true;
          if (user) await syncAuthWorkspace();
          else resetWorkspaceState();
          render();
        });
      }
    } catch (error) {
      console.warn("Supabase client unavailable, continuing in frontend-only mode", error);
      state.authAvailable = false;
    }

    const bootstrap = await fetchBootstrapState();
    applyBootstrapState(bootstrap);
    if (!bootstrap) applyLocalRiskDraft();
  } catch (error) {
    console.warn("Bootstrap state unavailable", error);
  }
  state.authReady = true;
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
  conditional.classList.toggle("is-visible", ["Yes, on all systems", "Yes, on some systems"].includes(value));
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
  return `
    <div class="builder-toolbar-group">
      <select class="builder-tool-select" data-editor-style="${attr(editorId)}" aria-label="Text style">
        <option value="p">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
      </select>
    </div>
    <span class="builder-tool-sep" aria-hidden="true"></span>
    <div class="builder-toolbar-group">
      <button class="builder-tool" type="button" data-editor-command="bold" data-editor-id="${attr(editorId)}" aria-label="Bold">${builderIcon("bold")}</button>
      <button class="builder-tool" type="button" data-editor-command="italic" data-editor-id="${attr(editorId)}" aria-label="Italic">${builderIcon("italic")}</button>
      <button class="builder-tool" type="button" data-editor-command="underline" data-editor-id="${attr(editorId)}" aria-label="Underline">${builderIcon("underline")}</button>
      <button class="builder-tool" type="button" data-editor-command="strikeThrough" data-editor-id="${attr(editorId)}" aria-label="Strikethrough">${builderIcon("strike")}</button>
      <button class="builder-tool" type="button" data-editor-action="link" data-editor-id="${attr(editorId)}" aria-label="Add or edit link">${builderIcon("link")}</button>
    </div>
    <span class="builder-tool-sep" aria-hidden="true"></span>
    <div class="builder-toolbar-group">
      <button class="builder-tool" type="button" data-editor-command="insertOrderedList" data-editor-id="${attr(editorId)}" aria-label="Numbered list">${builderIcon("ordered")}</button>
      <button class="builder-tool" type="button" data-editor-command="insertUnorderedList" data-editor-id="${attr(editorId)}" aria-label="Bulleted list">${builderIcon("bullet")}</button>
    </div>
    <span class="builder-tool-sep" aria-hidden="true"></span>
    <div class="builder-toolbar-group">
      <button class="builder-tool" type="button" data-editor-command="justifyLeft" data-editor-id="${attr(editorId)}" aria-label="Align left">${builderIcon("alignLeft")}</button>
      <button class="builder-tool" type="button" data-editor-command="justifyCenter" data-editor-id="${attr(editorId)}" aria-label="Align center">${builderIcon("alignCenter")}</button>
      <button class="builder-tool" type="button" data-editor-command="justifyRight" data-editor-id="${attr(editorId)}" aria-label="Align right">${builderIcon("alignRight")}</button>
    </div>
    <span class="builder-tool-sep" aria-hidden="true"></span>
    <div class="builder-toolbar-group">
      <button class="builder-tool" type="button" data-editor-command="undo" data-editor-id="${attr(editorId)}" aria-label="Undo">${builderIcon("undo")}</button>
      <button class="builder-tool" type="button" data-editor-command="redo" data-editor-id="${attr(editorId)}" aria-label="Redo">${builderIcon("redo")}</button>
    </div>
    <div class="builder-link-popover" data-editor-link-popover="${attr(editorId)}" hidden>
      <div class="builder-link-popover-card">
        <div class="builder-link-popover-fields">
          <label class="builder-link-field">
            <span>Link text</span>
            <input type="text" data-editor-link-text="${attr(editorId)}" placeholder="Enter link text" />
          </label>
          <label class="builder-link-field">
            <span>URL</span>
            <input type="url" data-editor-link-url="${attr(editorId)}" placeholder="https://example.com" />
          </label>
        </div>
        <div class="builder-link-popover-actions">
          <button class="btn ghost small" type="button" data-editor-link-remove="${attr(editorId)}">Remove link</button>
          <div class="builder-link-popover-actions-right">
            <button class="btn ghost small" type="button" data-editor-link-cancel="${attr(editorId)}">Cancel</button>
            <button class="btn primary small" type="button" data-editor-link-apply="${attr(editorId)}">Apply</button>
          </div>
        </div>
      </div>
    </div>
  `;
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
  return document.querySelector(`[data-builder-editor="${CSS.escape(editorId)}"]`);
}

function getBuilderToolbar(editorId) {
  return document.querySelector(`[data-editor-toolbar="${CSS.escape(editorId)}"]`);
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
  if (!editor || !selection || selection.rangeCount === 0) return { selectedText: "", link: null };
  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return { selectedText: "", link: null };
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
  const popover = document.querySelector(`[data-editor-link-popover="${CSS.escape(editorId)}"]`);
  const textInput = document.querySelector(`[data-editor-link-text="${CSS.escape(editorId)}"]`);
  const urlInput = document.querySelector(`[data-editor-link-url="${CSS.escape(editorId)}"]`);
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
  const popover = document.querySelector(`[data-editor-link-popover="${CSS.escape(editorId)}"]`);
  if (popover) {
    popover.hidden = true;
    popover.classList.remove("is-open");
  }
  toolbar?.classList.remove("has-open-popover");
}

function persistBuilderEditor(editorId) {
  const editor = getBuilderEditor(editorId);
  if (!editor) return;
  state.builderDrafts[editorId] = editor.innerHTML;
  scheduleBuilderDraftSync({ status: "draft" });
}

function applyBuilderLink(editorId) {
  const editor = getBuilderEditor(editorId);
  const textInput = document.querySelector(`[data-editor-link-text="${CSS.escape(editorId)}"]`);
  const urlInput = document.querySelector(`[data-editor-link-url="${CSS.escape(editorId)}"]`);
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
    document.execCommand("insertHTML", false, `<a href="${attr(href)}" target="_blank" rel="noopener noreferrer">${safeText}</a>`);
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
  const normalized = String(value || "").replace(/[<>]/g, "").toLowerCase();
  if (["h1", "h2", "h3", "h4", "p"].includes(normalized)) return normalized;
  return "p";
}

function syncBuilderEditorUi(editorId) {
  const editor = getBuilderEditor(editorId);
  const toolbar = getBuilderToolbar(editorId);
  if (!editor || !toolbar) return;
  const selection = window.getSelection();
  const hasSelection = !!selection && selection.rangeCount > 0 && editor.contains(selection.anchorNode);
  const link = hasSelection ? findClosestLink(selection.anchorNode, editor) : null;
  toolbar.querySelectorAll("[data-editor-command]").forEach((button) => {
    const command = button.dataset.editorCommand;
    const active = hasSelection && queryBuilderCommandState(command);
    const enabled = hasSelection ? queryBuilderCommandEnabled(command) : !["undo", "redo"].includes(command);
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
    styleSelect.value = hasSelection ? normalizeBuilderBlockValue(queryBuilderCommandValue("formatBlock")) : "p";
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

function textarea(name, label, helper = "", optional = true) {
  const value = state.form[name] ?? "";
  const error = state.errors[name];
  return `
    <label class="field">
      <span class="label">${label} ${optional ? '<span class="optional">Optional</span>' : "*"}</span>
      <textarea class="textarea ${error ? "error-field" : ""}" data-field="${name}">${escapeHtml(value)}</textarea>
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

function radioGroup(name, label, choices, helper = "", columns = "") {
  const value = state.form[name];
  const error = state.errors[name];
  return `
    <div class="field">
      <span class="label">${label} *</span>
      ${helper ? `<span class="field-help">${helper}</span>` : ""}
      <div class="choice-grid ${columns}">
        ${choices
          .map(
            (choice) => `
          <label class="choice">
            <input type="radio" name="${name}" value="${attr(choice)}" ${value === choice ? "checked" : ""} data-radio="${name}" />
            <span>${choice}</span>
          </label>
        `,
          )
          .join("")}
      </div>
      <span class="error ${error ? "is-visible" : ""}">${error || ""}</span>
    </div>
  `;
}

function checkboxGroup(name, label, choices, helper = "", columns = "") {
  const selected = state.form[name] || [];
  const error = state.errors[name];
  return `
    <div class="field">
      <span class="label">${label} *</span>
      ${helper ? `<span class="field-help">${helper}</span>` : ""}
      <div class="choice-grid ${columns}">
        ${choices
          .map(
            (choice) => `
          <label class="choice">
            <input type="checkbox" value="${attr(choice)}" ${selected.includes(choice) ? "checked" : ""} data-checkbox="${name}" />
            <span>${choice}</span>
          </label>
        `,
          )
          .join("")}
      </div>
      <span class="error ${error ? "is-visible" : ""}">${error || ""}</span>
    </div>
  `;
}

function segmented(name, choices) {
  const value = state.form[name];
  return `
    <div class="segmented" data-segmented="${name}">
      ${choices.map((choice) => `<button class="segment ${value === choice ? "is-active" : ""}" type="button" data-value="${attr(choice)}">${choice}</button>`).join("")}
    </div>
    <span class="error ${state.errors[name] ? "is-visible" : ""}">${state.errors[name] || ""}</span>
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

function welcomeScreen() {
  return `
    <main class="welcome risk-assessment-page">
      <section class="risk-assessment-head">
        <h1>Risk Assessment</h1>
        <p>Analyze your firm&rsquo;s current operational security to identify gaps and prioritize requirements before building your Written Information Security Program (WISP).</p>
      </section>

      <section class="assessment-overview-card">
        <div class="assessment-overview-copy">
          <p class="assessment-eyebrow">Assessment overview</p>
          <h2>The Risk Assessment is a foundational step, covering 8 critical security sections. Completing this review helps us generate prioritized recommendations for your WISP.</h2>
        </div>

        <aside class="assessment-overview-side">
          <div class="assessment-meta-list">
            <div class="assessment-meta-row">
              <span>Estimated time</span>
              <strong>8&ndash;12 minutes</strong>
            </div>
            <div class="assessment-meta-row">
              <span>Covers</span>
              <strong>8 security sections</strong>
            </div>
            <div class="assessment-meta-row">
              <span>Prerequisites</span>
              <strong>Best completed by someone familiar with firm systems, access, and record practices.</strong>
            </div>
          </div>

          <div class="assessment-actions">
            <button class="btn primary assessment-primary" data-action="start">Start assessment</button>
            <button class="btn secondary assessment-secondary" data-action="resume">Resume saved assessment</button>
          </div>
        </aside>
      </section>

      <section class="risk-assessment-grid">
        <article class="assessment-outcomes-card">
          <p class="assessment-eyebrow">What the assessment produces</p>
          <div class="assessment-outcomes-layout">
            <div class="assessment-outcomes-intro">
              <h3>What the assessment produces</h3>
              <p>The report turns submitted answers in a practical readiness view; where safeguards appear, where documentation is thin, and what should be addressed first.</p>
            </div>

            <div class="assessment-outcomes-list">
              <div class="assessment-outcome-row">
                <span class="assessment-outcome-index">01</span>
                <div>
                  <strong>Readiness score</strong>
                  <p>An overall score based on your submitted assessment sections.</p>
                </div>
              </div>
              <div class="assessment-outcome-row">
                <span class="assessment-outcome-index">02</span>
                <div>
                  <strong>Section findings</strong>
                  <p>Detailed analysis across critical areas like data access, access controls, physical safeguards, and personnel.</p>
                </div>
              </div>
              <div class="assessment-outcome-row">
                <span class="assessment-outcome-index">03</span>
                <div>
                  <strong>Prioritized improvements</strong>
                  <p>A prioritized list of required controls to address, categorized by importance.</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <aside class="assessment-side-stack">
          <section class="assessment-side-card">
            <h3>What to have ready</h3>
            <ul>
              <li>Key software (tax, email, file storage)</li>
              <li>Firm network setup and Wi-Fi security</li>
              <li>Access controls and user permission practices</li>
              <li>System backup methods and schedules</li>
              <li>Personnel security practices</li>
            </ul>
          </section>

          <section class="assessment-side-card">
            <h3>Next steps after completion</h3>
            <p>Review your report, prioritize actions, and then use the findings to inform your WISP Builder project.</p>
          </section>
        </aside>
      </section>
    </main>
  `;
}
function humanizeDashboardStatus(value) {
  if (!value) return "Not started";
  return String(value).split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function buildDashboardViewModel() {
  const dashboard = state.dashboardData || {};
  const completion = Number(dashboard.completion_percent) || 0;
  const focus = dashboard.focus_area || "Administrative Safeguards";
  const statusLabel = dashboard.status_label || "Not Started";
  const nextAudit = dashboard.next_audit_label || formatDashboardDate(new Date().toISOString());
  const completedSections = Number(dashboard.completed_sections_count ?? dashboard.section_count) || 0;
  const sectionTarget = Number(dashboard.section_count) || 12;
  const documentsCount = Number(dashboard.documents_count) || state.documentsFiles.length || 0;
  const trainingAssetsCount = Number(dashboard.training_assets_count) || Object.values(state.trainingAssets || {}).reduce((total, items) => total + items.length, 0);
  const riskStatus = humanizeDashboardStatus(dashboard.risk_assessment_status || "not_started");
  const wispStatus = humanizeDashboardStatus(dashboard.wisp_project_status || "not_started");
  const nextActionLabel = dashboard.next_action_label || "Start the risk assessment";
  const lastUpdated = formatDashboardDate(dashboard.updated_at);
  const ctaAction = "nav-builder";
  const ctaLabel = dashboard.wisp_project_status === "completed"
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
  return `
    <main class="dashboard-builder-screen">
      <section class="dashboard-builder-header">
        <div class="dashboard-builder-header-copy">
          <h1>Dashboard</h1>
          <p>Monitor and manage your firm's compliance readiness with live workspace data.</p>
        </div>

        <div class="dashboard-builder-header-actions">
          <button class="dashboard-utility-button" type="button" aria-label="Search">
            ${dashboardUtilityIcon("search")}
          </button>
          <button class="dashboard-utility-button dashboard-utility-button-alert" type="button" aria-label="Notifications">
            ${dashboardUtilityIcon("bell")}
            <span class="dashboard-utility-dot" aria-hidden="true"></span>
          </button>
          <button class="dashboard-profile-button" type="button" aria-label="Open profile">
            <span class="dashboard-profile-avatar">KM</span>
          </button>
        </div>
      </section>

      <section class="dashboard-hero-card">
        <div class="dashboard-hero-main">
          <div class="dashboard-progress" style="--progress:${view.completion};">
            <div class="dashboard-progress-inner">${view.completion}%</div>
          </div>

          <div class="dashboard-hero-copy">
            <h2>${view.completion}% Complete - Focus: ${escapeHtml(view.focus)}</h2>
            <p>${escapeHtml(view.statusLabel)} � ${escapeHtml(view.nextActionLabel)}</p>
          </div>
        </div>

        <div class="dashboard-hero-side">
          <button class="btn primary dashboard-hero-cta" type="button" data-action="${view.ctaAction}">${escapeHtml(view.ctaLabel)}</button>

          <div class="dashboard-hero-meta">
            <div class="dashboard-hero-meta-item">
              <span>Last updated</span>
              <strong>${escapeHtml(view.lastUpdated)}</strong>
            </div>
            <div class="dashboard-hero-meta-item">
              <span>Next audit target</span>
              <strong>${escapeHtml(view.nextAudit)}</strong>
            </div>
            <div class="dashboard-hero-meta-item">
              <span>Risk assessment</span>
              <strong>${escapeHtml(view.riskStatus)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="dashboard-builder-section">
        <h2>Next Steps</h2>
        <div class="dashboard-step-grid">
          <article class="dashboard-step-card">
            <div class="dashboard-step-icon" aria-hidden="true">${dashboardStepIcon("complete")}</div>
            <h3>WISP Builder</h3>
            <p>${escapeHtml(`${view.completedSections} of ${view.sectionTarget} tracked sections currently show saved progress.`)}</p>
            <button class="dashboard-step-link" type="button" data-action="nav-builder">Open Builder</button>
          </article>

          <article class="dashboard-step-card">
            <div class="dashboard-step-icon" aria-hidden="true">${dashboardStepIcon("upload")}</div>
            <h3>Documents</h3>
            <p>${escapeHtml(`${view.documentsCount} documents are currently stored for this workspace.`)}</p>
            <button class="dashboard-step-link" type="button" data-action="nav-documents">Manage Files</button>
          </article>

          <article class="dashboard-step-card">
            <div class="dashboard-step-icon" aria-hidden="true">${dashboardStepIcon("training")}</div>
            <h3>Training Library</h3>
            <p>${escapeHtml(`${view.trainingAssetsCount} training assets are available to assign or review.`)}</p>
            <button class="dashboard-step-link" type="button" data-action="nav-training">Open Training</button>
          </article>
        </div>
      </section>

      <section class="dashboard-updates">
        <h2>Compliance Snapshot</h2>
        <div class="dashboard-updates-grid">
          <article class="dashboard-update">
            <h3>Risk Assessment</h3>
            <span class="dashboard-update-date">Current status</span>
            <p>${escapeHtml(`Assessment is ${view.riskStatus.toLowerCase()} and contributing to the dashboard score.`)}</p>
            <button class="dashboard-update-link" type="button" data-action="nav-assessment-start">Open Assessment</button>
          </article>

          <article class="dashboard-update">
            <h3>WISP Project</h3>
            <span class="dashboard-update-date">Builder progress</span>
            <p>${escapeHtml(`WISP is ${view.wispStatus.toLowerCase()} with ${view.completedSections}/${view.sectionTarget} tracked sections completed.`)}</p>
            <button class="dashboard-update-link" type="button" data-action="nav-builder">Open Builder</button>
          </article>

          <article class="dashboard-update">
            <h3>Documentation Coverage</h3>
            <span class="dashboard-update-date">Stored evidence</span>
            <p>${escapeHtml(`${view.documentsCount} uploaded files and ${view.trainingAssetsCount} training assets are currently reflected in the workspace.`)}</p>
            <button class="dashboard-update-link" type="button" data-action="nav-documents">Review Files</button>
          </article>
        </div>
      </section>
    </main>
  `;
}

function getDocumentTemplateById(templateId) {
  return documentTemplates.find((template) => template.id === templateId) || null;
}

function buildDocumentWorkspace(template) {
  return {
    templateId: template.id,
    title: template.title,
    description: template.description,
    columns: [...template.defaultColumns],
    rows: Array.from({ length: 12 }, () => template.defaultColumns.map(() => "")),
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
    workspace.columnWidths = workspace.columnWidths.slice(0, workspace.columns.length);
  }
  workspace.updatedAt = workspace.updatedAt || new Date().toISOString();
  return workspace;
}

function normalizeDocumentWorkspaceMap(workspaces) {
  return Object.fromEntries(
    Object.entries(workspaces || {})
      .map(([templateId, workspace]) => [templateId, normalizeDocumentWorkspace({ ...workspace, templateId: workspace?.templateId || templateId })])
      .filter(([, workspace]) => workspace && Array.isArray(workspace.columns) && Array.isArray(workspace.rows))
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
  const workspace = ensureDocumentWorkspace(templateId);
  if (!workspace) return;
  setState({ screen: "document-editor", documentEditor: { templateId, scrollColumnIndex: null } });
}

function activeDocumentWorkspace() {
  const templateId = state.documentEditor?.templateId;
  return templateId ? normalizeDocumentWorkspace(state.documentWorkspaces[templateId] || null) : null;
}

function documentsScreen() {
  const workspaces = Object.values(state.documentWorkspaces);
  const hasAnyDocuments = Boolean(workspaces.length || state.documentsFiles.length);

  return `
    <main class="documents-screen">
      <section class="documents-header">
        <div class="documents-header-copy">
          <h1>Documents</h1>
          <p>Open editable firm worksheets directly in the browser so staff can maintain operational records without switching to Excel or Word.</p>
        </div>
        ${dashboardHeaderControls(`<button class="btn primary documents-build-btn" type="button" data-action="nav-builder">Build My WISP</button>`)}
      </section>

      <section class="documents-layout">
        <div class="documents-column documents-column-left">
          <div class="documents-section-head">
            <div class="documents-section-head-row">
              <h2>My Documents</h2>
              <button class="text-link documents-manage" type="button" data-action="open-doc-upload">Manage</button>
            </div>
          </div>

          <div class="documents-column-stack">
            <section class="documents-list-wrap documents-workspace-panel">
              <div class="documents-list-head">
                <strong>Editable Worksheets</strong>
                <span class="documents-list-caption">Open and maintain structured firm records in-app.</span>
              </div>
              <div class="documents-file-list">
                ${
                  workspaces.length
                    ? workspaces
                        .map(
                          (workspace) => `
                            <div class="documents-file-row documents-file-row-workspace">
                              <div class="documents-file-icon">${documentLibraryIcon()}</div>
                              <div class="documents-file-copy">
                                <strong>${escapeHtml(workspace.title)}</strong>
                                <span>${escapeHtml(documentWorkspaceSummary(workspace))}</span>
                              </div>
                              <div class="documents-row-actions">
                                <button class="btn secondary small" type="button" data-open-workspace="${attr(workspace.templateId)}">Open</button>
                                <button class="btn ghost small" type="button" data-remove-workspace="${attr(workspace.templateId)}">Remove</button>
                              </div>
                            </div>
                          `,
                        )
                        .join("")
                    : `
                      <div class="documents-inline-upload documents-inline-upload-empty">
                        <p>Open a template to create a live worksheet here.</p>
                      </div>
                    `
                }
              </div>
            </section>

            <section class="documents-list-wrap documents-upload-panel">
              <div class="documents-list-head">
                <strong>Uploaded Files</strong>
                <button class="btn secondary small" type="button" data-action="open-doc-upload">Upload Document</button>
              </div>
              <input class="documents-upload-input" type="file" multiple data-documents-upload />
              <div class="documents-file-list">
                ${
                  state.documentsFiles.length
                    ? state.documentsFiles
                        .map(
                          (file, index) => `
                            <div class="documents-file-row">
                              <div class="documents-file-icon">${documentLibraryIcon()}</div>
                              <div class="documents-file-copy">
                                <strong>${escapeHtml(file.name)}</strong>
                                <span>${escapeHtml(documentFileSummary(file))}</span>
                              </div>
                              <div class="documents-row-actions">
                                ${file.downloadUrl ? `<button class="btn secondary small" type="button" data-open-document="${index}">Open</button>
                                <button class="btn secondary small" type="button" data-download-document="${index}">Download</button>` : ``}
                                <button class="btn ghost small" type="button" data-remove-document="${index}">Remove</button>
                              </div>
                            </div>
                          `,
                        )
                        .join("")
                    : `
                      <div class="documents-inline-upload">
                        <p>Add scanned policies, vendor docs, or supporting files whenever you need them.</p>
                      </div>
                    `
                }
              </div>
            </section>
          </div>
        </div>

        <div class="documents-column documents-column-right">
          <div class="documents-section-head documents-section-head-stack">
            <h2>Editable Firm Templates</h2>
            <p>Each template opens as an in-app worksheet with default fields, editable cells, and flexible row and column management.</p>
          </div>

          <div class="documents-template-list">
            ${documentTemplates
              .map(
                (template) => `
                  <article class="documents-template-row" role="button" tabindex="0" data-open-template="${attr(template.id)}">
                    <div class="documents-template-icon">${documentLibraryIcon()}</div>
                    <div class="documents-template-copy">
                      <h3>${escapeHtml(template.title)}</h3>
                      <p>${escapeHtml(template.description)}</p>
                      <div class="documents-template-meta">
                        <span>${escapeHtml(template.fileLabel)}</span>
                        <span>${escapeHtml(template.updated)}</span>
                      </div>
                    </div>
                    <button class="documents-open-btn" type="button" aria-label="Open ${attr(template.title)}" data-open-template="${attr(template.id)}">
                      View
                    </button>
                  </article>
                `,
              )
              .join("")}
          </div>
        </div>
      </section>
    </main>
  `;
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
    return `
      <main class="documents-screen documents-editor-screen">
        <section class="documents-header">
          <div class="documents-header-copy">
            <h1>Document Editor</h1>
            <p>The requested worksheet could not be found.</p>
          </div>
          <div class="documents-header-actions document-editor-header-actions"><button class="btn secondary" type="button" data-action="back-to-documents">Back to documents</button></div>
        </section>
      </main>
    `;
  }

  return `
    <main class="documents-screen documents-editor-screen">
      <section class="documents-header documents-editor-header">
        <div class="documents-header-copy">
          <p class="eyebrow">Editable firm worksheet</p>
          <h1>${escapeHtml(workspace.title)}</h1>
          <p>${escapeHtml(workspace.description)}</p>
        </div>
        <div class="documents-header-actions document-editor-header-actions">
          <button class="btn secondary" type="button" data-action="back-to-documents">Back to documents</button>
          <button class="btn primary" type="button" data-doc-add-row>Add row</button>
          <button class="btn primary" type="button" data-doc-add-column>Add column</button>
        </div>
      </section>

      <section class="document-editor-shell card pad">
        <div class="document-editor-workspace">
          <div class="document-editor-topbar">
            <div class="document-editor-title-block">
              <label class="field">
                <span class="label">Document name</span>
                <input class="input document-editor-name-input" type="text" value="${attr(workspace.title)}" data-doc-title />
              </label>
              <div class="document-editor-meta">${escapeHtml(documentWorkspaceSummary(workspace))} &middot; Click any header or cell to edit directly.</div>
            </div>
          </div>

          <div class="document-editor-sheet-frame">
            <div class="document-editor-table-wrap">
              <table class="document-editor-table">
                <colgroup>
                  <col style="width: 58px;" />
                  ${workspace.columns
                    .map(
                      (_column, columnIndex) => `
                        <col style="width: ${Number(workspace.columnWidths?.[columnIndex] || 190)}px;" />
                      `,
                    )
                    .join("")}
                  <col style="width: 116px;" />
                </colgroup>
                <thead>
                  <tr class="document-editor-index-row">
                    <th class="document-editor-corner-cell"></th>
                    ${workspace.columns
                      .map(
                        (_column, columnIndex) => `
                          <th class="document-editor-index-cell" data-doc-index-cell="${columnIndex}">${documentSpreadsheetColumnLabel(columnIndex)}</th>
                        `,
                      )
                      .join("")}
                    <th class="document-editor-actions-index">ROW</th>
                  </tr>
                  <tr>
                    <th class="document-editor-row-label-head">Fields</th>
                    ${workspace.columns
                      .map(
                        (column, columnIndex) => `
                          <th>
                            <div class="document-editor-col-head">
                              <input class="document-editor-col-input" type="text" value="${attr(column)}" data-doc-column="${columnIndex}" />
                              <button class="document-editor-col-remove" type="button" aria-label="Remove ${attr(column)} column" data-doc-remove-column="${columnIndex}">&times;</button>
                              <div class="document-editor-col-resize" role="separator" aria-orientation="vertical" aria-label="Resize ${attr(column)} column" data-doc-resize-column="${columnIndex}"></div>
                            </div>
                          </th>
                        `,
                      )
                      .join("")}
                    <th class="document-editor-actions-head">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${workspace.rows
                    .map(
                      (row, rowIndex) => `
                        <tr>
                          <th class="document-editor-row-number">${rowIndex + 1}</th>
                          ${workspace.columns
                            .map(
                              (_column, columnIndex) => `
                                <td>
                                  <input class="document-editor-cell" type="text" value="${attr(row[columnIndex] || "")}" data-doc-cell="${rowIndex}:${columnIndex}" />
                                </td>
                              `,
                            )
                            .join("")}
                          <td class="document-editor-row-actions">
                            <button class="document-editor-remove-row" type="button" data-doc-remove-row="${rowIndex}">Remove</button>
                          </td>
                        </tr>
                      `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
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

  const activeSettingsTab = settingsTabs.find((tab) => tab.id === state.settingsTab) || settingsTabs[0];

  return `
    <main class="settings-screen">
      <section class="settings-page-head">
        <div class="settings-page-head-copy">
          <h1>Settings</h1>
          <p>Settings &gt; ${activeSettingsTab.label}</p>
        </div>
        ${dashboardHeaderControls()}
      </section>

      <nav class="settings-tabs" aria-label="Settings sections">
        ${settingsTabs
          .map(
            (tab) => `
              <button class="settings-tab ${state.settingsTab === tab.id ? "is-active" : ""}" type="button" data-settings-tab="${tab.id}">${tab.label}</button>
            `,
          )
          .join("")}
      </nav>

      ${renderSettingsTabPanel()}
    </main>
  `;
}

function renderSettingsTabPanel() {
  if (state.settingsTab === "company") return settingsCompanyInfoTab();
  if (state.settingsTab === "billing") return settingsSubscriptionBillingTab();
  if (state.settingsTab === "users") return settingsUserManagementTab();
  if (state.settingsTab === "staff") return settingsStaffTab();
  if (state.settingsTab === "logs") return settingsActivityLogsTab();
  if (state.settingsTab !== "profile") return settingsPlaceholderTab();

  return `
      <section class="settings-card">
        <div class="settings-card-head">
          <div class="settings-card-title">
            <span class="settings-card-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20">
                <path d="M10 2.75 4.65 4.9v4.2c0 3.15 1.95 5.95 5.35 8.15 3.4-2.2 5.35-5 5.35-8.15V4.9Z"></path>
                <path d="m7.65 10.15 1.55 1.6 3.15-3.35"></path>
              </svg>
            </span>
            <h2>Sign-In &amp; Security</h2>
          </div>
        </div>

        <div class="settings-rows">
          <div class="settings-row">
            <div class="settings-row-label">Email Address</div>
            <div class="settings-row-value">
              <strong>currentfiscal@outlook.com</strong>
              <span class="settings-verified"><span class="settings-verified-dot"></span>Verified</span>
            </div>
            <div class="settings-row-action">
              <button class="settings-text-action" type="button">Change Email</button>
            </div>
          </div>

          <div class="settings-row">
            <div class="settings-row-label">Password</div>
            <div class="settings-row-value">
              <strong>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</strong>
              <span>Last updated 3 months ago</span>
            </div>
            <div class="settings-row-action">
              <button class="settings-text-action" type="button">Update Password</button>
            </div>
          </div>

          <div class="settings-row">
            <div class="settings-row-label">Multi-Factor Authentication</div>
            <div class="settings-row-value">
              <strong>Enhanced account security enabled.</strong>
              <span>Method: Authenticator App (TOTP) | Verified on Jun 15, 2023.</span>
            </div>
            <div class="settings-row-action">
              <button class="settings-text-action" type="button">Change Method</button>
            </div>
          </div>

          <div class="settings-row">
            <div class="settings-row-label">Login Sessions</div>
            <div class="settings-row-value">
              <span>Active sessions are shown in your active sessions.</span>
            </div>
            <div class="settings-row-action">
              <button class="settings-text-action" type="button">Manage Sessions</button>
            </div>
          </div>
        </div>
      </section>

      <section class="settings-card settings-card-info">
        <div class="settings-card-head settings-card-head-split">
          <div class="settings-card-title">
            <h2>My Info</h2>
          </div>
          <button class="btn primary settings-main-action" type="button">Change my info</button>
        </div>

        <div class="settings-rows">
          <div class="settings-row">
            <div class="settings-row-label">Name</div>
            <div class="settings-row-value">
              <strong>John Miller</strong>
            </div>
            <div class="settings-row-action"></div>
          </div>
        </div>
      </section>
  `;
}

function settingsUserManagementTab() {
  const users = [
    {
      firstName: "John (You)",
      lastName: "Miller",
      email: "john.miller@currentfiscal.com",
      permission: "Administrator",
      status: "Verified",
      actions: [],
    },
    {
      firstName: "Sarah",
      lastName: "Chen",
      email: "sarah.chen@currentfiscal.com",
      permission: "Manager",
      status: "Verified",
      actions: [],
    },
    {
      firstName: "Melissa",
      lastName: "Grant",
      email: "melissa.grant@currentfiscal.com",
      permission: "Basic",
      status: "Invited",
      actions: ["Resend Invitation", "Revoke Invitation"],
    },
  ];

  const permissionLevels = [
    {
      title: "Basic",
      items: ["View assigned content", "Access firm training resources", "Participate in approved workflows"],
    },
    {
      title: "Manager",
      items: ["Manage day-to-day drafting activity", "Review team progress and inputs", "Coordinate operational updates"],
    },
    {
      title: "Administrator",
      items: ["Manage users and permissions", "Maintain billing and account controls", "Oversee final platform configuration"],
    },
  ];

  return `
    <section class="settings-card settings-card-info">
      <div class="settings-card-head">
        <div class="settings-card-title">
          <h2>Users</h2>
        </div>
      </div>

      <div class="settings-users-table">
        <div class="settings-users-head settings-users-grid">
          <div>First Name</div>
          <div>Last Name</div>
          <div>Email</div>
          <div>Permission Level</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        ${users
          .map(
            (user) => `
              <div class="settings-users-row settings-users-grid">
                <div class="settings-users-cell"><strong>${user.firstName}</strong></div>
                <div class="settings-users-cell">${user.lastName}</div>
                <div class="settings-users-cell settings-users-email">${user.email}</div>
                <div class="settings-users-cell"><span class="settings-permission-pill">${user.permission}</span></div>
                <div class="settings-users-cell">
                  <span class="settings-status-pill settings-status-pill-${user.status.toLowerCase()}">${user.status}</span>
                </div>
                <div class="settings-users-cell settings-users-actions">
                  ${
                    user.actions.length
                      ? `<div class="settings-users-action-links">${user.actions
                          .map((action) => `<button class="settings-text-action" type="button">${action}</button>`)
                          .join("")}</div>`
                      : `<span class="settings-users-action-muted">Current user</span>`
                  }
                </div>
              </div>
            `,
          )
          .join("")}
      </div>

      <div class="settings-invite-note">
        <div class="settings-invite-copy">
          <strong>1 user invite remaining on your current subscription.</strong>
          <p>Need more access seats for firm leadership or support staff? Expand your subscription to add more users.</p>
        </div>
        <button class="btn secondary settings-upgrade-action" type="button">Upgrade to add more users</button>
      </div>
    </section>

    <section class="settings-card settings-card-info">
      <div class="settings-card-head">
        <div class="settings-card-title">
          <h2>Permission Levels</h2>
        </div>
      </div>

      <div class="settings-permission-grid">
        ${permissionLevels
          .map(
            (level) => `
              <article class="settings-permission-card">
                <h3>${level.title}</h3>
                <ul>
                  ${level.items.map((item) => `<li>${item}</li>`).join("")}
                </ul>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function settingsSubscriptionBillingTab() {
  return `
    <section class="settings-card settings-card-info settings-billing-card">
      <div class="settings-card-head settings-card-head-split settings-billing-head">
        <div class="settings-card-title settings-billing-title">
          <h2>Subscription</h2>
          <p>Manage your plan, payment method, and renewal details from one place.</p>
        </div>
        <span class="settings-status-pill settings-status-pill-verified">Active</span>
      </div>

<div class="settings-billing-summary">
        <div class="settings-billing-plan">
          <div class="settings-billing-plan-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span class="settings-billing-eyebrow">Current plan</span>
          <div class="settings-billing-plan-row">
            <strong>EasyWISP Professional</strong>
            <button class="btn primary settings-billing-upgrade-btn" type="button" data-action="open-plan-modal">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 3 21 3 21 9"/>
                <line x1="9" y1="15" x2="21" y2="3"/>
                <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>
              </svg>
              Upgrade
            </button>
          </div>
          <p>Built for firms that want guided compliance workflows, secure collaboration, and clean WISP administration.</p>
          <div class="settings-billing-plan-tags">
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              1 user invite remaining
            </span>
            <span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Auto-renew enabled
            </span>
          </div>
        </div>

        <div class="settings-billing-meta">
          <div class="settings-billing-meta-item">
            <span>Price</span>
            <strong>$299 / month</strong>
          </div>
          <div class="settings-billing-meta-item">
            <span>Payment Method</span>
            <strong>Visa ending in 4242</strong>
          </div>
          <div class="settings-billing-meta-item">
            <span>Renewal Date</span>
            <strong>July 18, 2026</strong>
          </div>
        </div>
      </div>
    </section>

${state.showPlanModal ? `
    <div class="plan-modal-overlay">
      <div class="plan-modal-backdrop" data-action="close-plan-modal"></div>
      <div class="plan-modal-dialog">
        <div class="plan-modal-head">
          <div class="plan-modal-title">
            <h2>Choose your plan</h2>
            <span class="plan-modal-subtitle">Pick the coverage level that fits your firm. Switch anytime.</span>
          </div>
          <button class="plan-modal-close" type="button" data-action="close-plan-modal" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="plan-modal-body">
          <div class="settings-plan-options">
            <article class="settings-plan-option">
              <div class="settings-plan-option-badge">Starter</div>
              <h3>EasyWISP Core</h3>
              <p class="settings-plan-option-price">$149<small>/month</small></p>
              <p class="settings-plan-option-desc">For smaller firms that need guided WISP creation and basic document maintenance.</p>
              <ul class="settings-plan-option-features">
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  WISP builder
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Document storage
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Up to 3 users
                </li>
              </ul>
              <div class="settings-plan-option-foot">
                <button class="btn secondary settings-plan-option-btn" type="button">Downgrade</button>
              </div>
            </article>

            <article class="settings-plan-option settings-plan-option-current">
              <div class="settings-plan-option-popular">Recommended</div>
              <div class="settings-plan-option-badge">Current plan</div>
              <h3>EasyWISP Professional</h3>
              <p class="settings-plan-option-price">$299<small>/month</small></p>
              <p class="settings-plan-option-desc">Builder workflows, staff training PDFs, editable firm records, and review-ready exports.</p>
              <ul class="settings-plan-option-features">
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  All Core features
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Staff training PDFs
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Up to 10 users
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Review-ready exports
                </li>
              </ul>
              <div class="settings-plan-option-foot">
                <span class="settings-status-pill settings-status-pill-verified">Active</span>
              </div>
            </article>

            <article class="settings-plan-option">
              <div class="settings-plan-option-badge">Upgrade</div>
              <h3>EasyWISP Enterprise</h3>
              <p class="settings-plan-option-price">$499<small>/month</small></p>
              <p class="settings-plan-option-desc">Multi-location oversight, expanded staff controls, priority support, and annual compliance review.</p>
              <ul class="settings-plan-option-features">
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  All Professional features
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Multi-location oversight
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Unlimited users
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Priority support
                </li>
              </ul>
              <div class="settings-plan-option-foot">
                <button class="btn primary settings-plan-option-btn" type="button">Upgrade</button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
    ` : ""}

    <section class="settings-card settings-billing-services">
      <div class="settings-card-head settings-card-head-split">
        <div class="settings-card-title">
          <h2>Additional Services</h2>
        </div>
        <button class="btn primary settings-main-action" type="button">Purchase Service</button>
      </div>

      <div class="settings-services-list">
        <article class="settings-service-item">
          <div class="settings-service-copy">
            <div class="settings-service-head">
              <strong>WISP Assist Service</strong>
              <span class="settings-service-price">$149 / request</span>
            </div>
            <p>Get guided support on builder completion, drafting questions, and implementation follow-up.</p>
            <span class="settings-service-note">Available to active subscription accounts.</span>
          </div>
          <div class="settings-service-action">
            <button class="settings-text-action" type="button">Learn More</button>
          </div>
        </article>

        <article class="settings-service-item">
          <div class="settings-service-copy">
            <div class="settings-service-head">
              <strong>WISP Review Service</strong>
              <span class="settings-service-price">$249 / review</span>
            </div>
            <p>Request a structured review of your draft before finalizing and distributing the document internally.</p>
            <span class="settings-service-note settings-service-note-muted">Requires a completed draft and assigned responsible roles.</span>
          </div>
          <div class="settings-service-action">
            <button class="settings-text-action" type="button">Learn More</button>
          </div>
        </article>
      </div>
    </section>

    <section class="settings-card settings-card-info settings-payment-card">
      <div class="settings-card-head settings-card-head-split">
        <div class="settings-card-title settings-billing-title">
          <h2>Payment Method</h2>
          <p>Your billing card on file is used for subscription renewals and service purchases.</p>
        </div>
        <button class="settings-text-action" type="button">Update card</button>
      </div>

      <div class="settings-payment-layout">
        <div class="settings-payment-visual">
          <div class="settings-digital-card settings-digital-card-frozen" style="--card-a: #dff5ff; --card-b: #fff2bc; --card-c: #f6a3c8; --card-d: #7d6df2;">
            <span class="settings-card-freeze-label">Saved</span>
            <div class="settings-digital-card-inner">
              <div class="settings-digital-card-top">
                <span>Virtual</span>
                <strong>EasyWISP</strong>
              </div>
              <div class="settings-digital-card-number">**** 4242</div>
              <div class="settings-digital-card-bottom">
                <div>
                  <span>Cardholder</span>
                  <strong>Current Fiscal LLC</strong>
                </div>
                <div class="settings-card-network">VISA</div>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-payment-details">
          <div class="settings-payment-row">
            <span>Billing contact</span>
            <strong>contact@currentfiscal.com</strong>
          </div>
          <div class="settings-payment-row">
            <span>Billing address</span>
            <strong>2750 West Loop South, Houston, TX 77027</strong>
          </div>
          <div class="settings-payment-row">
            <span>Status</span>
            <strong>Ready for renewal on July 18, 2026</strong>
          </div>
        </div>
      </div>
    </section>
  `;
}

function settingsCompanyInfoTab() {
  const logoName = state.settingsLogo?.name ? formatDisplayFileName(state.settingsLogo.name) : "No logo uploaded";
  const logoMeta = state.settingsLogo
    ? `${escapeHtml(state.settingsLogo.type || "Image file")} � ${escapeHtml(formatAttachmentSize(state.settingsLogo.size || 0))}`
    : "Upload your company logo to appear across your WISP documents and related account materials.";

  return `
    <section class="settings-card settings-card-info">
      <div class="settings-card-head settings-card-head-split">
        <div class="settings-card-title">
          <h2>Company Profile</h2>
        </div>
        <button class="btn primary settings-main-action" type="button">Update Profile</button>
      </div>

      <div class="settings-rows settings-rows-company">
        <div class="settings-row">
          <div class="settings-row-label">Firm Name</div>
          <div class="settings-row-value">
            <strong>${escapeHtml(state.form.companyName || state.firmProfile?.name || "Current Fiscal LLC")}</strong>
          </div>
          <div class="settings-row-action"></div>
        </div>

        <div class="settings-row">
          <div class="settings-row-label">Address</div>
          <div class="settings-row-value">
            <strong>${escapeHtml(formatCompanyAddress())}</strong>
          </div>
          <div class="settings-row-action"></div>
        </div>

        <div class="settings-row">
          <div class="settings-row-label">Phone Number</div>
          <div class="settings-row-value">
            <strong>${escapeHtml(state.form.officePhone || state.form.mobilePhone || "(555) 012-4831")}</strong>
          </div>
          <div class="settings-row-action"></div>
        </div>

        <div class="settings-row">
          <div class="settings-row-label">Email</div>
          <div class="settings-row-value">
            <strong>${escapeHtml(state.form.email || state.firmProfile?.email || "contact@currentfiscal.com")}</strong>
          </div>
          <div class="settings-row-action"></div>
        </div>
      </div>
    </section>

    <section class="settings-card settings-logo-card">
      <div class="settings-card-head">
        <div class="settings-card-title">
          <h2>Logo</h2>
        </div>
      </div>

      <div class="settings-logo-body">
        <div class="settings-logo-copy">
          <strong>${escapeHtml(logoName)}</strong>
          <p>${escapeHtml(logoMeta)}</p>
          <div class="settings-logo-actions">
            <label class="btn secondary small settings-logo-browse" aria-label="Upload company logo">
              <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" data-settings-logo hidden />
              <span>${state.settingsLogo ? "Replace logo" : "Browse files"}</span>
            </label>
            ${state.settingsLogo ? `<button class="btn ghost small settings-logo-clear" type="button" data-settings-logo-remove>Remove</button>` : ""}
          </div>
        </div>

        <div class="settings-logo-preview-wrap">
          <div class="settings-logo-preview-frame">
            ${state.settingsLogo?.previewUrl ? `<img class="settings-logo-preview" src="${escapeHtml(state.settingsLogo.previewUrl)}" alt="Company logo preview" />` : `<div class="settings-logo-preview-empty">No preview yet</div>`}
          </div>
          <label class="settings-logo-dropzone" data-settings-logo-dropzone aria-label="Upload company logo">
            <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" data-settings-logo hidden />
            <span class="settings-logo-dropzone-title">Drop logo here or browse</span>
            <span class="settings-logo-dropzone-meta">PNG, JPG, SVG, or WEBP � Max 2MB</span>
          </label>
        </div>
      </div>
    </section>
  `;
}

function settingsStaffTab() {
  return `
    <section class="settings-card settings-card-info">
      <div class="settings-card-head">
        <div class="settings-card-title">
          <h2>Staff</h2>
        </div>
      </div>

      <div class="settings-staff-intro">
        <p>Invite people to review your active WISP and electronically sign that they understand and acknowledge it.</p>
      </div>

      <div class="settings-staff-toolbar">
        <div class="settings-staff-toolbar-left">
          <label class="settings-staff-page-size">
            <span>Show</span>
            <select aria-label="Entries per page">
              <option selected>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>entries</span>
          </label>
        </div>

        <div class="settings-staff-toolbar-right">
          <label class="settings-search-wrap settings-staff-search-wrap" aria-label="Search staff">
            <span class="settings-search-icon" aria-hidden="true">${trainingSearchIcon()}</span>
            <input class="settings-search" type="search" placeholder="Search staff" />
          </label>
          <button class="btn secondary settings-staff-secondary" type="button">Import List</button>
          <button class="btn primary settings-staff-primary" type="button">Add New</button>
        </div>
      </div>

      <div class="settings-staff-table">
        <div class="settings-staff-head settings-staff-grid">
          <div class="settings-staff-check">
            <input type="checkbox" aria-label="Select all staff" disabled />
          </div>
          <div>Email</div>
          <div>First Name</div>
          <div>Last Name</div>
          <div>Title</div>
          <div>Type</div>
          <div>Action</div>
        </div>

        <div class="settings-staff-empty-row">
          <div class="settings-staff-empty-grid settings-staff-grid">
            <div class="settings-staff-check">
              <input type="checkbox" aria-label="Select row" disabled />
            </div>
            <div class="settings-staff-empty-copy">
              <strong>No staff records added</strong>
              <p>Your invited reviewers and acknowledgement signers will appear here once they are added.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="settings-staff-footer">
        <div class="settings-staff-count">Showing 0 to 0 of 0 entries</div>

        <div class="settings-staff-footer-actions">
          <button class="btn secondary settings-staff-delete" type="button" disabled>Delete Selected</button>
          <div class="settings-staff-pagination" aria-label="Pagination">
            <button class="settings-staff-page is-disabled" type="button" disabled>Previous</button>
            <button class="settings-staff-page is-active" type="button" aria-current="page">1</button>
            <button class="settings-staff-page is-disabled" type="button" disabled>Next</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function settingsActivityLogsTab() {
  const activityRows = [
    {
      activity: "Login",
      user: "John Miller",
      details: "Successful sign-in from primary workstation",
      date: "Jun 18, 2026 • 10:42 AM",
      ip: "198.51.100.24",
    },
    {
      activity: "Logout",
      user: "John Miller",
      details: "User manually signed out of the WISP Builder",
      date: "Jun 18, 2026 • 11:13 AM",
      ip: "198.51.100.24",
    },
    {
      activity: "User Updated",
      user: "Sarah Chen",
      details: "Permission level changed from Basic to Manager",
      date: "Jun 17, 2026 • 4:18 PM",
      ip: "203.0.113.18",
    },
    {
      activity: "Login",
      user: "Melissa Grant",
      details: "Invitation accepted and first verified login completed",
      date: "Jun 16, 2026 • 9:04 AM",
      ip: "192.0.2.61",
    },
    {
      activity: "Settings Change",
      user: "John Miller",
      details: "Updated company profile and billing contact details",
      date: "Jun 15, 2026 • 2:27 PM",
      ip: "198.51.100.24",
    },
  ];

  return `
    <section class="settings-card settings-card-info">
      <div class="settings-card-head">
        <div class="settings-card-title">
          <h2>Activity Logs</h2>
        </div>
      </div>

      <div class="settings-activity-intro">
        <p>This section shows company activity such as logins, logouts, user changes, and other important events recorded across the WISP Builder workspace.</p>
      </div>

      <div class="settings-activity-filters">
        <label class="settings-activity-field">
          <span>From date</span>
          <input type="date" value="2026-06-12" />
        </label>

        <label class="settings-activity-field">
          <span>To date</span>
          <input type="date" value="2026-06-18" />
        </label>

        <label class="settings-activity-field settings-activity-field-type">
          <span>Type</span>
          <select>
            <option selected>All activity</option>
            <option>Login</option>
            <option>Logout</option>
            <option>User Updated</option>
            <option>Settings Change</option>
          </select>
        </label>

        <div class="settings-activity-filter-actions">
          <button class="btn primary settings-activity-apply" type="button">Apply</button>
          <button class="btn secondary settings-activity-clear" type="button">Clear</button>
        </div>
      </div>

      <div class="settings-activity-toolbar">
        <div class="settings-activity-toolbar-left">
          <label class="settings-staff-page-size">
            <span>Show</span>
            <select aria-label="Entries per page">
              <option selected>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>entries</span>
          </label>
        </div>

        <div class="settings-activity-toolbar-right">
          <label class="settings-search-wrap settings-activity-search-wrap" aria-label="Search activity logs">
            <span class="settings-search-icon" aria-hidden="true">${trainingSearchIcon()}</span>
            <input class="settings-search" type="search" placeholder="Search activity" />
          </label>
          <button class="btn secondary settings-activity-export" type="button">Export CSV</button>
        </div>
      </div>

      <div class="settings-activity-table">
        <div class="settings-activity-head settings-activity-grid">
          <div>Activity</div>
          <div>User</div>
          <div>Details</div>
          <div>Date</div>
          <div>IP Address</div>
        </div>

        ${activityRows
          .map(
            (row) => `
              <div class="settings-activity-row settings-activity-grid">
                <div class="settings-activity-cell">
                  <span class="settings-activity-pill">${row.activity}</span>
                </div>
                <div class="settings-activity-cell">
                  <strong>${row.user}</strong>
                </div>
                <div class="settings-activity-cell settings-activity-detail">${row.details}</div>
                <div class="settings-activity-cell settings-activity-date">${row.date}</div>
                <div class="settings-activity-cell settings-activity-ip">${row.ip}</div>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function settingsPlaceholderTab() {
  return `
    <section class="settings-card settings-card-info">
      <div class="settings-card-head">
        <div class="settings-card-title">
          <h2>Coming soon</h2>
        </div>
      </div>
      <div class="settings-placeholder-body">
        This settings section will be added next using the same upgraded layout system.
      </div>
    </section>
  `;
}

function getSettingsData() {
  state.settingsData = normalizeSettingsData(state.settingsData);
  return state.settingsData;
}

function settingsDisplayDate(value, fallback = "Not set") {
  if (!value) return fallback;
  return formatDashboardDate(value);
}

function settingsProfileTab() {
  const settings = getSettingsData();
  return `
      <section class="settings-card">
        <div class="settings-card-head">
          <div class="settings-card-title">
            <span class="settings-card-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20">
                <path d="M10 2.75 4.65 4.9v4.2c0 3.15 1.95 5.95 5.35 8.15 3.4-2.2 5.35-5 5.35-8.15V4.9Z"></path>
                <path d="m7.65 10.15 1.55 1.6 3.15-3.35"></path>
              </svg>
            </span>
            <h2>Sign-In &amp; Security</h2>
          </div>
        </div>

        <div class="settings-rows">
          <div class="settings-row">
            <div class="settings-row-label">Email Address</div>
            <div class="settings-row-value">
              <strong>${escapeHtml(settings.profile.email)}</strong>
              <span class="settings-verified"><span class="settings-verified-dot"></span>Verified</span>
            </div>
            <div class="settings-row-action"><button class="settings-text-action" type="button" data-settings-action="change-email">Change Email</button></div>
          </div>
          <div class="settings-row">
            <div class="settings-row-label">Password</div>
            <div class="settings-row-value">
              <strong>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</strong>
              <span>Last updated ${escapeHtml(settingsDisplayDate(settings.profile.passwordUpdatedAt))}</span>
            </div>
            <div class="settings-row-action"><button class="settings-text-action" type="button" data-settings-action="update-password">Update Password</button></div>
          </div>
          <div class="settings-row">
            <div class="settings-row-label">Multi-Factor Authentication</div>
            <div class="settings-row-value">
              <strong>${settings.profile.mfaEnabled ? "Enhanced account security enabled." : "MFA is currently disabled."}</strong>
              <span>Method: ${escapeHtml(settings.profile.mfaMethod)} | Verified on ${escapeHtml(settingsDisplayDate(settings.profile.mfaVerifiedOn))}.</span>
            </div>
            <div class="settings-row-action"><button class="settings-text-action" type="button" data-settings-action="change-mfa">Change Method</button></div>
          </div>
          <div class="settings-row">
            <div class="settings-row-label">Login Sessions</div>
            <div class="settings-row-value"><span>${escapeHtml(settings.profile.sessionsNote)}</span></div>
            <div class="settings-row-action"><button class="settings-text-action" type="button" data-settings-action="manage-sessions">Manage Sessions</button></div>
          </div>
        </div>
      </section>
      <section class="settings-card settings-card-info">
        <div class="settings-card-head settings-card-head-split">
          <div class="settings-card-title"><h2>My Info</h2></div>
          <button class="btn primary settings-main-action" type="button" data-settings-action="edit-profile">Change my info</button>
        </div>
        <div class="settings-rows">
          <div class="settings-row">
            <div class="settings-row-label">Name</div>
            <div class="settings-row-value"><strong>${escapeHtml(settings.profile.name)}</strong></div>
            <div class="settings-row-action"></div>
          </div>
        </div>
      </section>
  `;
}

function settingsUserManagementTab() {
  const settings = getSettingsData();
  const users = settings.users;
  const permissionLevels = [
    { title: "Basic", items: ["View assigned content", "Access firm training resources", "Participate in approved workflows"] },
    { title: "Manager", items: ["Manage day-to-day drafting activity", "Review team progress and inputs", "Coordinate operational updates"] },
    { title: "Administrator", items: ["Manage users and permissions", "Maintain billing and account controls", "Oversee final platform configuration"] },
  ];
  return `
    <section class="settings-card settings-card-info">
      <div class="settings-card-head settings-card-head-split">
        <div class="settings-card-title"><h2>Users</h2></div>
        <button class="btn primary settings-main-action" type="button" data-settings-action="invite-user">Invite User</button>
      </div>
      <div class="settings-users-table">
        <div class="settings-users-head settings-users-grid">
          <div>First Name</div><div>Last Name</div><div>Email</div><div>Permission Level</div><div>Status</div><div>Actions</div>
        </div>
        ${users.map((user) => `
          <div class="settings-users-row settings-users-grid">
            <div class="settings-users-cell"><strong>${escapeHtml(user.firstName)}</strong></div>
            <div class="settings-users-cell">${escapeHtml(user.lastName)}</div>
            <div class="settings-users-cell settings-users-email">${escapeHtml(user.email)}</div>
            <div class="settings-users-cell"><span class="settings-permission-pill">${escapeHtml(user.permission)}</span></div>
            <div class="settings-users-cell"><span class="settings-status-pill settings-status-pill-${String(user.status || '').toLowerCase()}">${escapeHtml(user.status)}</span></div>
            <div class="settings-users-cell settings-users-actions">
              ${user.actions?.length ? `<div class="settings-users-action-links">${user.actions.map((action) => `<button class="settings-text-action" type="button" data-user-id="${attr(user.id)}" data-user-action="${attr(action)}">${escapeHtml(action)}</button>`).join('')}</div>` : `<span class="settings-users-action-muted">Current user</span>`}
            </div>
          </div>`).join('')}
      </div>
      <div class="settings-invite-note">
        <div class="settings-invite-copy">
          <strong>${escapeHtml(String(settings.billing.inviteSeatsRemaining))} user invite remaining on your current subscription.</strong>
          <p>Need more access seats for firm leadership or support staff? Expand your subscription to add more users.</p>
        </div>
        <button class="btn secondary settings-upgrade-action" type="button" data-action="open-plan-modal">Upgrade to add more users</button>
      </div>
    </section>
    <section class="settings-card settings-card-info">
      <div class="settings-card-head"><div class="settings-card-title"><h2>Permission Levels</h2></div></div>
      <div class="settings-permission-grid">
        ${permissionLevels.map((level) => `<article class="settings-permission-card"><h3>${level.title}</h3><ul>${level.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>`).join('')}
      </div>
    </section>
  `;
}

function settingsSubscriptionBillingTab() {
  const billing = getSettingsData().billing;
  const monthlyPrice = Number(billing.priceMonthly) || 0;
  return `
    <section class="settings-card settings-card-info settings-billing-card">
      <div class="settings-card-head settings-card-head-split settings-billing-head">
        <div class="settings-card-title settings-billing-title">
          <h2>Subscription</h2>
          <p>Manage your plan, payment method, and renewal details from one place.</p>
        </div>
        <span class="settings-status-pill settings-status-pill-verified">${escapeHtml(billing.status)}</span>
      </div>
      <div class="settings-billing-summary">
        <div class="settings-billing-plan">
          <div class="settings-billing-plan-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
          <span class="settings-billing-eyebrow">Current plan</span>
          <div class="settings-billing-plan-row">
            <strong>${escapeHtml(billing.planName)}</strong>
            <button class="btn primary settings-billing-upgrade-btn" type="button" data-action="open-plan-modal">Upgrade</button>
          </div>
          <p>Built for firms that want guided compliance workflows, secure collaboration, and clean WISP administration.</p>
          <div class="settings-billing-plan-tags">
            <span>${escapeHtml(String(billing.inviteSeatsRemaining))} user invite remaining</span>
            <span>${billing.autoRenew ? 'Auto-renew enabled' : 'Auto-renew disabled'}</span>
          </div>
        </div>
        <div class="settings-billing-meta">
          <div class="settings-billing-meta-item"><span>Price</span><strong>$${monthlyPrice} / month</strong></div>
          <div class="settings-billing-meta-item"><span>Payment Method</span><strong>${escapeHtml(billing.paymentMethod)}</strong></div>
          <div class="settings-billing-meta-item"><span>Renewal Date</span><strong>${escapeHtml(settingsDisplayDate(billing.renewalDate))}</strong></div>
        </div>
      </div>
    </section>
    ${state.showPlanModal ? `
    <div class="plan-modal-overlay">
      <div class="plan-modal-backdrop" data-action="close-plan-modal"></div>
      <div class="plan-modal-dialog">
        <div class="plan-modal-head">
          <div class="plan-modal-title"><h2>Choose your plan</h2><span class="plan-modal-subtitle">Pick the coverage level that fits your firm. Switch anytime.</span></div>
          <button class="plan-modal-close" type="button" data-action="close-plan-modal" aria-label="Close">&times;</button>
        </div>
        <div class="plan-modal-body">
          <div class="settings-plan-options">
            <article class="settings-plan-option"><div class="settings-plan-option-badge">Starter</div><h3>EasyWISP Core</h3><p class="settings-plan-option-price">$149<small>/month</small></p><p class="settings-plan-option-desc">For smaller firms that need guided WISP creation and basic document maintenance.</p><div class="settings-plan-option-foot"><button class="btn secondary settings-plan-option-btn" type="button" data-settings-plan="EasyWISP Core">Select</button></div></article>
            <article class="settings-plan-option settings-plan-option-current"><div class="settings-plan-option-popular">Recommended</div><div class="settings-plan-option-badge">Current plan</div><h3>EasyWISP Professional</h3><p class="settings-plan-option-price">$299<small>/month</small></p><p class="settings-plan-option-desc">Builder workflows, staff training PDFs, editable firm records, and review-ready exports.</p><div class="settings-plan-option-foot"><button class="btn secondary settings-plan-option-btn" type="button" data-settings-plan="EasyWISP Professional">Select</button></div></article>
            <article class="settings-plan-option"><div class="settings-plan-option-badge">Upgrade</div><h3>EasyWISP Enterprise</h3><p class="settings-plan-option-price">$499<small>/month</small></p><p class="settings-plan-option-desc">Multi-location oversight, expanded staff controls, priority support, and annual compliance review.</p><div class="settings-plan-option-foot"><button class="btn primary settings-plan-option-btn" type="button" data-settings-plan="EasyWISP Enterprise">Select</button></div></article>
          </div>
        </div>
      </div>
    </div>` : ""}
    <section class="settings-card settings-billing-services">
      <div class="settings-card-head settings-card-head-split"><div class="settings-card-title"><h2>Additional Services</h2></div><button class="btn primary settings-main-action" type="button" data-settings-action="purchase-service">Purchase Service</button></div>
      <div class="settings-services-list">
        <article class="settings-service-item"><div class="settings-service-copy"><div class="settings-service-head"><strong>WISP Assist Service</strong><span class="settings-service-price">$149 / request</span></div><p>Get guided support on builder completion, drafting questions, and implementation follow-up.</p><span class="settings-service-note">Available to active subscription accounts.</span></div><div class="settings-service-action"><button class="settings-text-action" type="button" data-settings-action="learn-assist">Learn More</button></div></article>
        <article class="settings-service-item"><div class="settings-service-copy"><div class="settings-service-head"><strong>WISP Review Service</strong><span class="settings-service-price">$249 / review</span></div><p>Request a structured review of your draft before finalizing and distributing the document internally.</p><span class="settings-service-note settings-service-note-muted">Requires a completed draft and assigned responsible roles.</span></div><div class="settings-service-action"><button class="settings-text-action" type="button" data-settings-action="learn-review">Learn More</button></div></article>
      </div>
    </section>
    <section class="settings-card settings-card-info settings-payment-card">
      <div class="settings-card-head settings-card-head-split"><div class="settings-card-title settings-billing-title"><h2>Payment Method</h2><p>Your billing card on file is used for subscription renewals and service purchases.</p></div><button class="settings-text-action" type="button" data-settings-action="edit-billing">Update card</button></div>
      <div class="settings-payment-layout"><div class="settings-payment-visual"><div class="settings-digital-card settings-digital-card-frozen" style="--card-a: #dff5ff; --card-b: #fff2bc; --card-c: #f6a3c8; --card-d: #7d6df2;"><span class="settings-card-freeze-label">Saved</span><div class="settings-digital-card-inner"><div class="settings-digital-card-top"><span>Virtual</span><strong>EasyWISP</strong></div><div class="settings-digital-card-number">**** ${escapeHtml(billing.cardLast4)}</div><div class="settings-digital-card-bottom"><div><span>Cardholder</span><strong>${escapeHtml(billing.cardholder)}</strong></div><div class="settings-card-network">${escapeHtml(billing.cardBrand)}</div></div></div></div></div><div class="settings-payment-details"><div class="settings-payment-row"><span>Billing contact</span><strong>${escapeHtml(billing.billingContact)}</strong></div><div class="settings-payment-row"><span>Billing address</span><strong>${escapeHtml(billing.billingAddress)}</strong></div><div class="settings-payment-row"><span>Status</span><strong>Ready for renewal on ${escapeHtml(settingsDisplayDate(billing.renewalDate))}</strong></div></div></div>
    </section>
  `;
}

function settingsCompanyInfoTab() {
  const settings = getSettingsData();
  const logoName = state.settingsLogo?.name ? formatDisplayFileName(state.settingsLogo.name) : "No logo uploaded";
  const logoMeta = state.settingsLogo ? `${escapeHtml(state.settingsLogo.type || "Image file")} - ${escapeHtml(formatAttachmentSize(state.settingsLogo.size || 0))}` : "Upload your company logo to appear across your WISP documents and related account materials.";
  return `
    <section class="settings-card settings-card-info">
      <div class="settings-card-head settings-card-head-split"><div class="settings-card-title"><h2>Company Profile</h2></div><button class="btn primary settings-main-action" type="button" data-settings-action="edit-company">Update Profile</button></div>
      <div class="settings-rows settings-rows-company">
        <div class="settings-row"><div class="settings-row-label">Firm Name</div><div class="settings-row-value"><strong>${escapeHtml(state.form.companyName || state.firmProfile?.name || "Current Fiscal LLC")}</strong></div><div class="settings-row-action"></div></div>
        <div class="settings-row"><div class="settings-row-label">Address</div><div class="settings-row-value"><strong>${escapeHtml(settings.company.address || formatCompanyAddress())}</strong></div><div class="settings-row-action"></div></div>
        <div class="settings-row"><div class="settings-row-label">Phone Number</div><div class="settings-row-value"><strong>${escapeHtml(settings.company.phone || state.form.officePhone || state.form.mobilePhone || "(555) 012-4831")}</strong></div><div class="settings-row-action"></div></div>
        <div class="settings-row"><div class="settings-row-label">Email</div><div class="settings-row-value"><strong>${escapeHtml(settings.company.email || state.form.email || state.firmProfile?.email || "contact@currentfiscal.com")}</strong></div><div class="settings-row-action"></div></div>
      </div>
    </section>
    <section class="settings-card settings-logo-card">
      <div class="settings-card-head"><div class="settings-card-title"><h2>Logo</h2></div></div>
      <div class="settings-logo-body"><div class="settings-logo-copy"><strong>${escapeHtml(logoName)}</strong><p>${escapeHtml(logoMeta)}</p><div class="settings-logo-actions"><label class="btn secondary small settings-logo-browse" aria-label="Upload company logo"><input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" data-settings-logo hidden /><span>${state.settingsLogo ? "Replace logo" : "Browse files"}</span></label>${state.settingsLogo ? `<button class="btn ghost small settings-logo-clear" type="button" data-settings-logo-remove>Remove</button>` : ""}</div></div><div class="settings-logo-preview-wrap"><div class="settings-logo-preview-frame">${state.settingsLogo?.previewUrl ? `<img class="settings-logo-preview" src="${escapeHtml(state.settingsLogo.previewUrl)}" alt="Company logo preview" />` : `<div class="settings-logo-preview-empty">No preview yet</div>`}</div><label class="settings-logo-dropzone" data-settings-logo-dropzone aria-label="Upload company logo"><input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" data-settings-logo hidden /><span class="settings-logo-dropzone-title">Drop logo here or browse</span><span class="settings-logo-dropzone-meta">PNG, JPG, SVG, or WEBP - Max 2MB</span></label></div></div>
    </section>
  `;
}

function settingsStaffTab() {
  const staff = getSettingsData().staff;
  return `
    <section class="settings-card settings-card-info">
      <div class="settings-card-head"><div class="settings-card-title"><h2>Staff</h2></div></div>
      <div class="settings-staff-intro"><p>Invite people to review your active WISP and electronically sign that they understand and acknowledge it.</p></div>
      <div class="settings-staff-toolbar"><div class="settings-staff-toolbar-left"><label class="settings-staff-page-size"><span>Show</span><select aria-label="Entries per page"><option selected>10</option></select><span>entries</span></label></div><div class="settings-staff-toolbar-right"><button class="btn secondary settings-staff-secondary" type="button" data-settings-action="import-staff">Import List</button><button class="btn primary settings-staff-primary" type="button" data-settings-action="add-staff">Add New</button></div></div>
      <div class="settings-staff-table"><div class="settings-staff-head settings-staff-grid"><div class="settings-staff-check"><input type="checkbox" aria-label="Select all staff" disabled /></div><div>Email</div><div>First Name</div><div>Last Name</div><div>Title</div><div>Type</div><div>Action</div></div>
      ${staff.length ? staff.map((member) => `<div class="settings-staff-empty-grid settings-staff-grid"><div class="settings-staff-check"><input type="checkbox" aria-label="Select row" disabled /></div><div>${escapeHtml(member.email || '')}</div><div>${escapeHtml(member.firstName || '')}</div><div>${escapeHtml(member.lastName || '')}</div><div>${escapeHtml(member.title || '')}</div><div>${escapeHtml(member.type || '')}</div><div><button class="settings-text-action" type="button" data-staff-remove="${attr(member.id)}">Remove</button></div></div>`).join('') : `<div class="settings-staff-empty-row"><div class="settings-staff-empty-grid settings-staff-grid"><div class="settings-staff-check"><input type="checkbox" aria-label="Select row" disabled /></div><div class="settings-staff-empty-copy"><strong>No staff records added</strong><p>Your invited reviewers and acknowledgement signers will appear here once they are added.</p></div></div></div>`}
      </div>
      <div class="settings-staff-footer"><div class="settings-staff-count">Showing ${staff.length ? 1 : 0} to ${staff.length} of ${staff.length} entries</div><div class="settings-staff-footer-actions"><button class="btn secondary settings-staff-delete" type="button" disabled>Delete Selected</button></div></div>
    </section>
  `;
}

function settingsActivityLogsTab() {
  const activityRows = getSettingsData().activityLogs;
  return `
    <section class="settings-card settings-card-info">
      <div class="settings-card-head"><div class="settings-card-title"><h2>Activity Logs</h2></div></div>
      <div class="settings-activity-intro"><p>This section shows company activity such as logins, logouts, user changes, and other important events recorded across the WISP Builder workspace.</p></div>
      <div class="settings-activity-toolbar"><div class="settings-activity-toolbar-left"><label class="settings-staff-page-size"><span>Show</span><select aria-label="Entries per page"><option selected>10</option></select><span>entries</span></label></div><div class="settings-activity-toolbar-right"><button class="btn secondary settings-activity-export" type="button" data-settings-action="export-logs">Export CSV</button></div></div>
      <div class="settings-activity-table"><div class="settings-activity-head settings-activity-grid"><div>Activity</div><div>User</div><div>Details</div><div>Date</div><div>IP Address</div></div>${activityRows.map((row) => `<div class="settings-activity-row settings-activity-grid"><div class="settings-activity-cell"><span class="settings-activity-pill">${escapeHtml(row.activity)}</span></div><div class="settings-activity-cell">${escapeHtml(row.user)}</div><div class="settings-activity-cell settings-activity-detail">${escapeHtml(row.details)}</div><div class="settings-activity-cell settings-activity-date">${escapeHtml(settingsDisplayDate(row.date))}</div><div class="settings-activity-cell settings-activity-ip">${escapeHtml(row.ip)}</div></div>`).join('')}</div>
    </section>
  `;
}

function renderSettingsTabPanel() {
  if (state.settingsTab === "company") return settingsCompanyInfoTab();
  if (state.settingsTab === "billing") return settingsSubscriptionBillingTab();
  if (state.settingsTab === "users") return settingsUserManagementTab();
  if (state.settingsTab === "staff") return settingsStaffTab();
  if (state.settingsTab === "logs") return settingsActivityLogsTab();
  return settingsProfileTab();
}

function formatCompanyAddress() {
  const settings = getSettingsData();
  const parts = [state.form.streetAddress, state.form.city, state.form.state, state.form.postalCode].filter(Boolean);
  return settings.company.address || (parts.length ? parts.join(", ") : "2750 West Loop South, Houston, TX 77027");
}

function trainingSearchIcon() {
  return `
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="8.55" cy="8.55" r="4.95"></circle>
      <path d="m12.2 12.2 4.2 4.2"></path>
    </svg>
  `;
}

function dashboardHeaderControls(extra = "") {
  return `
    <div class="dashboard-builder-header-actions">
      ${extra}
      <button class="dashboard-utility-button" type="button" aria-label="Search">
        ${dashboardUtilityIcon("search")}
      </button>
      <button class="dashboard-utility-button dashboard-utility-button-alert" type="button" aria-label="Notifications">
        ${dashboardUtilityIcon("bell")}
        <span class="dashboard-utility-dot" aria-hidden="true"></span>
      </button>
      <button class="dashboard-profile-button" type="button" aria-label="Open profile">
        <span class="dashboard-profile-avatar">KM</span>
      </button>
    </div>
  `;
}

function dashboardUtilityIcon(name) {
  if (name === "bell") {
    return `
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M10 3.1a3.4 3.4 0 0 1 3.4 3.4v1.1c0 .8.2 1.5.62 2.18l.88 1.45c.2.33.3.7.3 1.09v.38H4.8v-.38c0-.39.1-.76.3-1.09l.88-1.45c.42-.68.62-1.38.62-2.18V6.5A3.4 3.4 0 0 1 10 3.1Z"></path>
        <path d="M8.05 15.2a2.2 2.2 0 0 0 3.9 0"></path>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="8.55" cy="8.55" r="4.95"></circle>
      <path d="m12.2 12.2 4.2 4.2"></path>
    </svg>
  `;
}

function dashboardStepIcon(kind) {
  if (kind === "upload") {
    return `
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M10 12.9V5.7"></path>
        <path d="m7.15 8.55 2.85-2.85 2.85 2.85"></path>
        <path d="M4.3 13.85v.95a1.2 1.2 0 0 0 1.2 1.2h8.95a1.2 1.2 0 0 0 1.2-1.2v-.95"></path>
      </svg>
    `;
  }

  if (kind === "training") {
    return `
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M3.1 7.25 10 3.95l6.9 3.3L10 10.55 3.1 7.25Z"></path>
        <path d="M5.4 8.65v3.3c0 .45.23.87.62 1.11C6.97 13.7 8.4 14.4 10 14.4s3.03-.7 3.98-1.34c.39-.24.62-.66.62-1.11v-3.3"></path>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect x="3.1" y="4.15" width="11.5" height="12.3" rx="2.2"></rect>
      <path d="M6.35 9.8 8.3 11.7l5.2-5.2"></path>
      <path d="M14.6 6.7h2.3"></path>
    </svg>
  `;
}

function trainingRowIcon(kind) {
  if (kind === "video") {
    return `
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <rect x="2.75" y="4.3" width="14.5" height="11.4" rx="2.35"></rect>
        <path d="m8.25 7.55 4.35 2.45-4.35 2.45z"></path>
      </svg>
    `;
  }
  return `
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5.1 2.85h6.05l3.25 3.2V16.7H5.1z"></path>
      <path d="M11.15 2.85v3.2h3.25"></path>
    </svg>
  `;
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
  const normalized = raw.replace(/\\/g, "/").replace(/^\.\//, "").replace(/^\/+/, "");
  try {
    return new URL(normalized, getAppAssetBaseUrl()).toString();
  } catch {
    return normalized;
  }
}

function getSupabasePublicTrainingAssetUrl(storagePath, bucketName = "training-assets") {
  const supabaseUrl = window.__ENV__?.SUPABASE_URL;
  if (!supabaseUrl || !storagePath) return "";
  try {
    const normalizedPath = String(storagePath)
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    return new URL('/storage/v1/object/public/' + bucketName + '/' + normalizedPath, supabaseUrl).toString();
  } catch {
    return "";
  }
}

function resolveTrainingAssetUrl(item) {
  if (!item) return "";
  if (item.downloadUrl) return item.downloadUrl;
  if (item.storagePath) {
    const publicUrl = getSupabasePublicTrainingAssetUrl(item.storagePath, item.bucketName || "training-assets");
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
  if (trainingAssetBlobUrlCache.has(cacheKey)) return trainingAssetBlobUrlCache.get(cacheKey);
  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error(`Unable to load PDF asset (${response.status}).`);
  const contentType = String(response.headers.get("content-type") || "").toLowerCase();
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
  state.trainingPreviewError = sourceUrl ? "" : "Could not load this PDF preview.";
  render();
  if (!sourceUrl) return;
  if (!state.trainingPreviewOpen || requestToken !== trainingPreviewRequestToken) return;
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
      ? `
        <div class="training-preview-frame-shell">
          <div class="training-preview-loading" data-training-preview-loading>Rendering PDF...</div>
          <iframe
            class="training-preview-frame"
            src="${attr(`${state.trainingPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`)}"
            title="${attr(state.trainingPreviewTitle || "Training PDF preview")}" 
            loading="eager"
            referrerpolicy="no-referrer"
            onload="const shell=this.closest('.training-preview-frame-shell'); const loading=shell?.querySelector('[data-training-preview-loading]'); if (loading) loading.remove();"
          ></iframe>
        </div>`
      : `<div class="training-preview-loading">Rendering PDF...</div>`;
  return `
    <div class="training-preview-modal" role="dialog" aria-modal="true" aria-label="Training PDF preview">
      <button class="training-preview-backdrop" type="button" data-action="close-training-preview" aria-label="Close PDF preview"></button>
      <section class="training-preview-dialog">
        <div class="training-preview-head">
          <div class="training-preview-title-block">
            <p class="eyebrow">${state.trainingPreviewLabel || "Training document"}</p>
            <h2>${state.trainingPreviewTitle}</h2>
          </div>
          <div class="training-preview-actions">
            <button class="btn secondary" type="button" data-action="close-training-preview">Close</button>
          </div>
        </div>
        ${previewBody}
      </section>
    </div>
  `;
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

  return `
    <section class="training-group">
      <div class="training-group-head">${title}</div>
      <div class="training-group-list">
        ${
          filtered.length
            ? filtered
                .map(
                  ({ item, index }) => `
                    <div class="training-row training-row-${tone}">
                      <div class="training-row-icon" aria-hidden="true">${trainingRowIcon(item.kind)}</div>
                      <div class="training-row-copy">
                        <div class="training-row-title">${item.title}</div>
                      </div>
                      <div class="training-row-actions">
                        ${(() => {
                          const assetUrl = resolveTrainingAssetUrl(item);
                          const previewTarget = String(item?.filename || assetUrl || "").toLowerCase();
                          const canPreviewPdf = Boolean(assetUrl && previewTarget.endsWith('.pdf'));
                          if (canPreviewPdf && item.actionSecondary) {
                            return `<button class="training-action training-action-secondary" type="button" data-training-asset-action="view" data-training-group="${groupKey}" data-training-index="${index}">${item.actionPrimary}</button>
                               <button class="training-action training-action-primary" type="button" data-training-asset-action="download" data-training-group="${groupKey}" data-training-index="${index}">${item.actionSecondary}</button>`;
                          }
                          if (assetUrl && item.actionPrimary) {
                            return `<button class="training-action training-action-primary" type="button" data-training-asset-action="primary" data-training-group="${groupKey}" data-training-index="${index}">${item.actionPrimary}</button>`;
                          }
                          return `<span class="training-action training-action-muted">Coming soon</span>`;
                        })()}
                      </div>
                    </div>
                  `
                )
                .join("")
            : `<div class="training-row training-row-empty"><div class="training-row-copy"><div class="training-row-empty-text">No matching training resources</div></div></div>`
        }
      </div>
    </section>
  `;
}

function trainingScreen() {
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
        ${trainingSection("MANDATORY STAFF TRAINING", state.trainingAssets.mandatory, "default", "mandatory")}
        ${trainingSection("SECURITY AWARENESS VIDEOS", state.trainingAssets.videos, "video", "videos")}
        ${trainingSection("ADDITIONAL COMPLIANCE RESOURCES", state.trainingAssets.resources, "default", "resources")}
      </div>
      ${trainingPreviewModal()}
    </main>
  `;
}

function hasPendingWispDraft() {
  if (state.wispProject?.status === "draft") return true;
  if (state.builderAttachments.length) return true;

  return Object.keys(initialBuilderDrafts).some((key) => {
    const current = String(state.builderDrafts[key] ?? "").trim();
    const baseline = String(initialBuilderDrafts[key] ?? "").trim();
    return current !== baseline;
  });
}

function hasActiveWispProject() {
  return ["active", "completed"].includes(state.wispProject?.status) || Boolean(state.wispProject?.latest_generated_file);
}

function builderStatusTabs() {
  const tabs = [
    { id: "active", label: "Active" },
    { id: "pending", label: "Pending" },
    { id: "past", label: "Past Versions" },
  ];

  return `
      <nav class="builder-status-tabs" aria-label="Builder status">
        ${tabs
          .map(
            (tab) => `
              <button class="builder-status-tab ${state.builderTab === tab.id ? "is-active" : ""}" type="button" data-builder-status-tab="${tab.id}">
                ${tab.label}
              </button>
            `,
          )
          .join("")}
      </nav>
  `;
}

function builderStatusPanel({ eyebrow, title, body, actions = "" }) {
  return `
    <section class="builder-status-panel">
      <div class="builder-status-panel-copy">
        <p class="builder-status-panel-kicker">${eyebrow}</p>
        <h2>${title}</h2>
        <p>${body}</p>
      </div>
      ${actions ? `<div class="builder-status-panel-actions">${actions}</div>` : ""}
    </section>
  `;
}

function builderHeaderActions() {
  return `
    <div class="builder-topbar-actions">
      <button class="btn primary builder-create-btn" type="button" data-action="create-wisp">Create WISP</button>
    </div>
  `;
}

function decodeSimpleEntities(value) {
  return String(value || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function builderPlainText(value) {
  return decodeSimpleEntities(String(value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")).trim();
}

function builderExcerpt(value, limit = 220) {
  const plain = builderPlainText(value);
  if (!plain) return "Not yet customized.";
  if (plain.length <= limit) return plain;
  return `${plain.slice(0, limit).trimEnd()}...`;
}

function repairCommonMojibake(value) {
  return String(value || "")
    .replaceAll("\u00c3\u0192\u00c2\u00a2\u00c3\u00a2\u00e2\u20ac\u0161\u00c2\u00ac\u00c3\u2026\u00e2\u20ac\u0153", "“")
    .replaceAll("\u00c3\u0192\u00c2\u00a2\u00c3\u00a2\u00e2\u20ac\u0161\u00c2\u00ac\u00c3\u201a\u00c2\u009d", "”")
    .replaceAll("\u00c3\u0192\u00c2\u00a2\u00c3\u00a2\u00e2\u20ac\u0161\u00c2\u00ac\u00c3\u00a2\u00e2\u20ac\u017e\u00c2\u00a2", "’");
}

function normalizeGlossaryHtml(value) {
  const repaired = repairCommonMojibake(value);
  return repaired.replace(/<p>\s*(?!<strong>)([^<\-]+?)\s+-\s+/g, '<p><strong>$1</strong> - ');
}

function normalizeBuilderDraft(key, value) {
  const repaired = key === "glossary" ? normalizeGlossaryHtml(value) : repairCommonMojibake(value);
  return repaired;
}

function normalizeBuilderDraftMap(drafts) {
  return Object.fromEntries(Object.entries(drafts || {}).map(([key, value]) => [key, normalizeBuilderDraft(key, value)]));
}

function renderBuilderResourceSections() {
  return RESOURCE_LINK_SECTIONS.map(
    (section) => `
              <section class="builder-doc-block">
                <div class="builder-doc-head">
                  <div>
                    <h3>${escapeHtml(section.title)}</h3>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <ul class="builder-reference-list">
                    ${section.links
                      .map(
                        (link) => `<li><a class="builder-reference-link" href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a></li>`,
                      )
                      .join("")}
                  </ul>
                </div>
              </section>`,
  ).join("");
}

function getBuilderDraftValue(key, fallback = "") {
  if (Object.prototype.hasOwnProperty.call(state.builderDrafts, key)) return normalizeBuilderDraft(key, state.builderDrafts[key]);
  if (Object.prototype.hasOwnProperty.call(initialBuilderDrafts, key)) return normalizeBuilderDraft(key, initialBuilderDrafts[key]);
  return normalizeBuilderDraft(key, fallback);
}

function getBuilderTemplateMergePayload() {
  const firmName = (state.form.companyName || state.firmProfile?.name || state.wispProject?.company_name || "Current Fiscal LLC").trim();
  return {
    templateSource: "design/templates/wisp-template-cleaned.docx",
    generatedAt: new Date().toISOString(),
    firm: {
      companyName: firmName,
      principalOperatingOfficer: (state.form.principalOperatingOfficer || "").trim(),
      dataSecurityCoordinator: (state.form.dataSecurityCoordinator || "").trim(),
      publicInformationOfficer: (state.form.publicInformationOfficer || "").trim(),
      signatureTitle: (state.form.signatureTitle || "").trim(),
    },
    mergeFields: {
      companyName: firmName,
      principalOperatingOfficer: (state.form.principalOperatingOfficer || "").trim(),
      dataSecurityCoordinator: (state.form.dataSecurityCoordinator || "").trim(),
      publicInformationOfficer: (state.form.publicInformationOfficer || "").trim(),
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
  const slug = ((payload.mergeFields.companyName || "wisp")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "wisp");
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
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
    builderDocxJsPromise = import("./node_modules/docx-preview/dist/docx-preview.mjs")
      .catch((error) => {
        builderDocxJsPromise = null;
        throw error;
      });
  }
  return builderDocxJsPromise;
}

async function renderBuilderDocxPreviewTarget(target, renderJob) {
  if (!target?.isConnected || renderJob !== builderDocxRenderJob || !state.builderMergeDocxBlob) return;
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
    const pages = [...stage.querySelectorAll('.docx-wrapper > section.docx')];
    pages.forEach((page, index) => {
      page.hidden = index !== pageNumber - 1;
      page.classList.toggle('is-active-preview-page', index === pageNumber - 1);
    });
    const nextPageCount = pages.length || 1;
    if (state.builderRenderedPageCount !== nextPageCount) {
      state.builderRenderedPageCount = nextPageCount;
      window.requestAnimationFrame(() => {
        updateBuilderReviewDisplay();
      });
    }
    target.classList.add('is-ready');
    target.classList.remove('is-error');
    if (loading) {
      loading.hidden = true;
      loading.textContent = "";
    }
  } catch (error) {
    console.warn(`DOCX page ${pageNumber} render failed`, error);
    target.classList.remove('is-ready');
    target.classList.add('is-error');
    if (loading) {
      loading.hidden = false;
      loading.textContent = `Couldn't render template page ${pageNumber}.`;
    }
  }
}

async function renderBuilderDocxPreviews() {
  const targets = [...document.querySelectorAll('[data-builder-docx-page]')];
  if (!targets.length || !state.builderMergeDocxBlob) return;
  const renderJob = ++builderDocxRenderJob;
  await Promise.all(targets.map((target) => renderBuilderDocxPreviewTarget(target, renderJob)));
}

async function loadBuilderPdfJs() {
  if (!builderPdfJsLibPromise) {
    builderPdfJsLibPromise = (async () => {
      const moduleCandidates = [
        resolveAppAssetUrl("node_modules/pdfjs-dist/legacy/build/pdf.mjs"),
        new URL("./node_modules/pdfjs-dist/legacy/build/pdf.mjs", window.location.href).toString(),
      ];
      let lastError = null;
      for (const candidate of [...new Set(moduleCandidates)]) {
        try {
          const pdfjsLib = await import(candidate);
          pdfjsLib.GlobalWorkerOptions.workerSrc = resolveAppAssetUrl(
            "node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs",
          );
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
  if (builderPdfDocumentPromise && builderPdfDocumentUrl === state.builderMergePdfUrl) return builderPdfDocumentPromise;
  resetBuilderPdfPreviewCache();
  builderPdfDocumentUrl = state.builderMergePdfUrl;
  builderPdfDocumentPromise = (async () => {
    const pdfjsLib = await loadBuilderPdfJs();
    const pdfBytes = new Uint8Array(await state.builderMergePdfBlob.arrayBuffer());
    const loadingTask = pdfjsLib.getDocument({
      data: pdfBytes,
      disableWorker: true,
      useSystemFonts: true,
      isEvalSupported: false,
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
    const targetWidth = Math.max(1, Math.floor(target.clientWidth || baseViewport.width));
    const scale = targetWidth / baseViewport.width;
    const viewport = pdfPage.getViewport({ scale });
    const outputScale = window.devicePixelRatio || 1;
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
    await Promise.all(targets.map((target) => renderBuilderPdfPageTarget(target, pdfDocument, renderJob)));
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
  if (state.builderMergePdfUrl) {
    window.requestAnimationFrame(() => {
      renderBuilderPdfPreviews().catch((error) => console.warn("PDF preview render failed", error));
    });
    return;
  }
  if (!state.builderMergeDocxBlob) return;
  window.requestAnimationFrame(() => {
    renderBuilderDocxPreviews().catch((error) => console.warn("DOCX preview render failed", error));
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
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type: mimeType });
}

async function requestBuilderMergedDocx() {
  const payload = getBuilderTemplateMergePayload();
  cleanupBuilderMergeDownloadUrl();
  state.builderMergeStatus = "generating";
  state.builderMergeMessage = "Generating your WISP PDF preview...";
  state.builderMergeFileName = "";
  state.builderMergePreviewPages = [];
  state.builderRenderedPageCount = 0;
  render();
  try {
    const response = await fetch("http://127.0.0.1:8766/merge-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
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
        result?.mimeType || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
      state.builderMergeDocxBlob = blob;
      state.builderMergeDownloadUrl = URL.createObjectURL(blob);
    }
    if (result?.pdfBase64) {
      const pdfBlob = base64ToBlob(result.pdfBase64, "application/pdf");
      state.builderMergePdfBlob = pdfBlob;
      state.builderMergePdfUrl = URL.createObjectURL(pdfBlob);
      state.builderMergePdfFileName = result?.pdfFileName || "wisp-preview.pdf";
    } else {
      throw new Error("The branded WISP PDF preview was not returned by the merge service.");
    }
    state.builderMergePreviewPages = Array.isArray(result?.pages) ? result.pages : [];
    state.builderMergeStatus = "ready";
    state.builderMergeMessage = "WISP PDF preview is ready.";
  } catch (error) {
    state.builderMergeStatus = "unavailable";
    state.builderMergeMessage = error?.message || "The local merge service is unavailable.";
    state.builderMergeFileName = "";
    state.builderMergePreviewPages = [];
    state.builderRenderedPageCount = 0;
    cleanupBuilderMergeDownloadUrl();
  }
  render();
}
function downloadBuilderMergedDocx() {
  const href = state.builderMergePdfUrl || state.builderMergeDownloadUrl;
  if (!href) return;
  const link = document.createElement("a");
  link.href = href;
  link.download = state.builderMergePdfUrl
    ? (state.builderMergePdfFileName || "wisp-preview.pdf")
    : (state.builderMergeFileName || "wisp-merged.docx");
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

  const result = await finalizeWispBuild(
    { blob, fileName, contentType },
    {
      ...getBuilderDraftMeta({ status: "active", title: state.wispProject?.title || "Written Information Security Plan" }),
      builderDrafts: state.builderDrafts,
    },
  );

  if (result?.project) {
    state.wispProject = result.project;
    state.wispVersions = result.versions || [];
    if (result.project.dashboard_facts) state.dashboardData = result.project.dashboard_facts;
  }

  setState({
    builderTab: "active",
    builderResumeEditing: false,
    builderLaunchAnimation: false,
    builderReviewLoading: false,
    builderReviewOpen: false,
    builderReviewExpanded: false,
    builderReviewPage: 0,
    builderSidebarOpen: false,
  });
}
function getBuilderTemplateMergeStats() {
  const payload = getBuilderTemplateMergePayload();
  const supportedToday = payload.prototypeSupport?.supportedToday || [];
  const pendingTemplateAlignment = payload.prototypeSupport?.pendingTemplateAlignment || [];
  const supportedFilled = supportedToday.filter((key) => {
    if (Object.prototype.hasOwnProperty.call(payload.mergeFields, key)) return Boolean(payload.mergeFields[key]);
    if (Object.prototype.hasOwnProperty.call(payload.blocks, key)) return Boolean(builderPlainText(payload.blocks[key]));
    return false;
  }).length;
  const pendingFilled = pendingTemplateAlignment.filter((key) => {
    if (key === "attachments") return payload.attachments.length > 0;
    if (Object.prototype.hasOwnProperty.call(payload.blocks, key)) return Boolean(builderPlainText(payload.blocks[key]));
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
  const statusLabel = state.builderMergeStatus === "ready"
    ? `Merged artifact ready: ${escapeHtml(state.builderMergeFileName || "wisp-merged.docx")}`
    : state.builderMergeStatus === "generating"
      ? "Local merge service is generating the DOCX..."
      : state.builderMergeStatus === "unavailable"
        ? escapeHtml(state.builderMergeMessage || "Local merge service unavailable.")
        : "Live builder data is mapped and ready for DOCX generation.";
  const actionButton = state.builderMergeStatus === "ready"
    ? `<button class="btn secondary" type="button" data-action="download-builder-merged-docx">Download merged DOCX</button>`
    : `<button class="btn secondary" type="button" data-action="generate-builder-merged-docx">Generate merged DOCX</button>`;
  return `
    <section class="builder-review-merge-card">
      <div>
        <p class="eyebrow">Template merge status</p>
        <h3>IRS-template pipeline</h3>
        <p>${statusLabel}</p>
      </div>
      <div class="builder-review-merge-stats">
        <span>${stats.supportedFilled}/${stats.supportedTotal} supported blocks populated</span>
        <span>${stats.pendingFilled}/${stats.pendingTotal} pending blocks populated</span>
        <span>${stats.attachmentCount} attachments queued</span>
      </div>
      <div class="builder-review-merge-actions">
        ${actionButton}
        <button class="btn ghost small" type="button" data-action="download-builder-merge-payload">Export merge payload</button>
      </div>
      <p class="builder-review-merge-source">Template source: ${escapeHtml(stats.templateSource)} ? Local service: http://127.0.0.1:8766</p>
    </section>
  `;
}

function getBuilderReviewSections() {
  const firmName = (state.form.companyName || "Current Fiscal LLC").trim();
  const principalOfficer = (state.form.principalOperatingOfficer || "John Miller").trim();
  const dataCoordinator = (state.form.dataSecurityCoordinator || "Sarah Chen").trim();
  const publicOfficer = (state.form.publicInformationOfficer || "Melissa Grant").trim();
  const read = (key, fallback = "") => state.builderDrafts[key] || initialBuilderDrafts[key] || fallback;
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
        { label: "Draft language", value: builderExcerpt(read("objective"), 320) },
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
      summary: "Leadership responsibilities are assigned across security coordination and public information handling.",
      details: [
        { label: dataCoordinator, value: builderExcerpt(read("officials-dsc"), 180) },
        { label: publicOfficer, value: builderExcerpt(read("officials-pio"), 180) },
      ],
    },
    {
      title: "Inside the Firm",
      kicker: "Internal safeguards",
      summary: builderExcerpt(read("inside-firm-intro")),
      details: [
        { label: "Collection & handling", value: builderExcerpt(read("inside-firm-collection"), 160) },
        { label: "Personnel controls", value: builderExcerpt(read("inside-firm-personnel"), 160) },
        { label: "Internal disclosure", value: builderExcerpt(read("inside-firm-disclosure"), 160) },
      ],
    },
    {
      title: "Outside the Firm",
      kicker: "External exposure",
      summary: builderExcerpt(read("outside-firm-intro")),
      details: [
        { label: "Network security", value: builderExcerpt(read("outside-firm-network"), 160) },
        { label: "Remote access", value: builderExcerpt(read("outside-firm-access"), 160) },
        { label: "Devices & training", value: builderExcerpt(read("outside-firm-devices"), 160) },
      ],
    },
    {
      title: "Policies & Resources",
      kicker: "Operational controls",
      summary: builderExcerpt(read("policies-rules")),
      details: [
        { label: "Rules & standards", value: builderExcerpt(read("policies-rules"), 160) },
        { label: "Breach response", value: builderExcerpt(read("policies-breach"), 160) },
        { label: "Resources", value: builderExcerpt(read("resources-intro"), 160) },
      ],
    },
    {
      title: "Glossary",
      kicker: "Reference language",
      summary: builderExcerpt(read("glossary")),
      details: [
        { label: "Glossary excerpt", value: builderExcerpt(read("glossary"), 260) },
      ],
    },
  ];
}

function getBuilderMergedTemplatePages() {
  const mergedPages = Array.isArray(state.builderMergePreviewPages) ? state.builderMergePreviewPages : [];
  if (!state.builderMergeDocxBlob && !state.builderMergePdfUrl && !mergedPages.length) return [];
  const totalPages = Math.max(
    state.builderRenderedPageCount || 0,
    mergedPages.length || 0,
    state.builderMergeDocxBlob ? 1 : 0,
  );
  return Array.from({ length: totalPages }, (_, index) => {
    const previewPage = mergedPages[index] || {};
    return {
      type: "docx-preview",
      title: previewPage.title || (index === 0 ? "Cover page" : `Page ${index + 1}`),
      isCover: previewPage.isCover ?? index === 0,
      layout: previewPage.layout || "",
      blocks: Array.isArray(previewPage.blocks) ? previewPage.blocks : [],
    };
  });
}

function getBuilderDraftReviewPages() {
  const mergedPages = getBuilderMergedTemplatePages();
  if (mergedPages.length) return mergedPages;
  const sections = getBuilderReviewSections();
  const firmName = (state.form.companyName || "Current Fiscal LLC").trim();
  const pages = [
    {
      type: "cover",
      title: "Written Information Security Plan",
      firmName,
      updatedLabel: formatDashboardDate(state.wispProject?.updated_at || new Date().toISOString()),
      attachmentCount: state.builderAttachments.length,
    },
  ];
  for (let index = 0; index < sections.length; index += 3) {
    pages.push({ type: "sections", sections: sections.slice(index, index + 3) });
  }
  pages.push({
    type: "attachments",
    attachments: state.builderAttachments,
  });
  return pages;
}
async function downloadBuilderReviewCopy() {
  if (!state.builderMergePdfUrl) {
    await requestBuilderMergedDocx();
  }
  if (state.builderMergePdfUrl) {
    downloadBlobFile(state.builderMergePdfUrl, state.builderMergePdfFileName || "wisp-preview.pdf");
    return;
  }
  throw new Error("Unable to generate the WISP review PDF right now.");
}
function renderBuilderReviewPage(page, pageNumber, totalPages, modifierClass = "") {
  if (page.type === "docx-preview") {
    if (state.builderMergePdfUrl) {
      return `
        <article class="builder-review-paper builder-review-paper-pdf ${modifierClass}" data-builder-pdf-page="${pageNumber}">
          <div class="builder-review-pdf-stage">
            <div class="builder-review-pdf-loading" data-builder-pdf-loading>Rendering PDF page ${pageNumber}...</div>
            <canvas
              class="builder-review-pdf-canvas"
              aria-label="${attr(`WISP PDF page ${pageNumber}`)}"
            ></canvas>
          </div>
        </article>
      `;
    }
    const layoutClass = page.layout ? `builder-review-paper-${String(page.layout).replace(/[^a-z0-9-]/gi, "-").toLowerCase()}` : "";
    let html = "";
    let listItems = [];
    let activeListType = "ul";
    const flushList = () => {
      if (!listItems.length) return;
      const tag = activeListType === "ol" ? "ol" : "ul";
      const listClass = activeListType === "ol" ? "builder-review-docx-list is-ordered" : "builder-review-docx-list";
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
      if (block.kind === "cover-title") html += `<h1 class="builder-review-docx-cover-title">${text}</h1>`;
      else if (block.kind === "cover-bridge") html += `<p class="builder-review-docx-cover-bridge">${text}</p>`;
      else if (block.kind === "cover-firm") html += `<p class="builder-review-docx-cover-firm">${text}</p>`;
      else if (block.kind === "cover-note") html += `<p class="builder-review-docx-cover-note">${text}</p>`;
      else if (block.kind === "cover-footer") html += `<p class="builder-review-docx-cover-footer">${text}</p>`;
      else if (block.kind === "section-heading") html += `<h2 class="builder-review-docx-heading">${text}</h2>`;
      else if (block.kind === "subheading") html += `<h3 class="builder-review-docx-subheading">${text}</h3>`;
      else if (block.kind === "signature") html += `<p class="builder-review-docx-signature">${text}</p>`;
      else if (block.kind === "centered") html += `<p class="builder-review-docx-centered">${text}</p>`;
      else html += `<p class="builder-review-docx-paragraph">${text}</p>`;
    }
    flushList();
    const footer = layoutClass.includes("irs-template-body") || layoutClass.includes("irs-attachment-body") || layoutClass.includes("irs-reference-body")
      ? `<div class="builder-review-docx-page-number">${pageNumber - 1}</div>`
      : "";
    return `
      <article class="builder-review-paper builder-review-paper-docx ${layoutClass} ${modifierClass}">
        <div class="builder-review-docx-sheet ${page.isCover ? "is-cover" : ""} ${layoutClass}">
          ${html}
          ${footer}
        </div>
      </article>
    `;
  }
  if (page.type === "cover") {
    return `
      <article class="builder-review-paper builder-review-paper-cover ${modifierClass}">
        <div class="builder-review-paper-band"></div>
        <div class="builder-review-paper-body">
          <p class="builder-review-paper-kicker">Draft review copy</p>
          <h2>${escapeHtml(page.title)}</h2>
          <p class="builder-review-cover-firm">Prepared for ${escapeHtml(page.firmName)}</p>
          <div class="builder-review-cover-meta">
            <span>Updated ${escapeHtml(page.updatedLabel)}</span>
            <span>${String(page.attachmentCount).padStart(2, "0")} attachments</span>
            <span>Page ${pageNumber} of ${totalPages}</span>
          </div>
        </div>
      </article>
    `;
  }
  if (page.type === "attachments") {
    return `
      <article class="builder-review-paper ${modifierClass}">
        <div class="builder-review-paper-body">
          <div class="builder-review-page-header">
            <div>
              <p class="builder-review-paper-kicker">Supporting documents</p>
              <h2>Attachments included with this draft</h2>
            </div>
            <span class="builder-review-page-counter">Page ${pageNumber} of ${totalPages}</span>
          </div>
          <div class="builder-review-attachment-stack">
            ${page.attachments.length
              ? page.attachments.map((file, index) => `
                  <div class="builder-review-attachment-row">
                    <strong>${String(index + 1).padStart(2, "0")}</strong>
                    <span>${escapeHtml(file.name)}</span>
                    <em>${escapeHtml(file.sizeLabel)}</em>
                  </div>
                `).join("")
              : `<div class="builder-review-attachment-empty">No supporting attachments have been added to this draft.</div>`}
          </div>
        </div>
      </article>
    `;
  }
  return `
    <article class="builder-review-paper ${modifierClass}">
      <div class="builder-review-paper-body">
        <div class="builder-review-page-header">
          <div>
            <p class="builder-review-paper-kicker">Draft review</p>
            <h2>Section summary</h2>
          </div>
          <span class="builder-review-page-counter">Page ${pageNumber} of ${totalPages}</span>
        </div>
        <div class="builder-review-simple-sections">
          ${page.sections.map((section) => `
            <section class="builder-review-simple-section">
              <div class="builder-review-simple-head">
                <div>
                  <p>${escapeHtml(section.kicker)}</p>
                  <h3>${escapeHtml(section.title)}</h3>
                </div>
              </div>
              <p class="builder-review-section-summary">${escapeHtml(section.summary)}</p>
              <dl class="builder-review-simple-list">
                ${section.details.map((detail) => `
                  <div>
                    <dt>${escapeHtml(detail.label)}</dt>
                    <dd>${escapeHtml(detail.value)}</dd>
                  </div>
                `).join("")}
              </dl>
            </section>
          `).join("")}
        </div>
      </div>
    </article>
  `;
}
function builderDraftReviewLoadingScreen() {
  return `
    <main class="builder-shell builder-review-loading-screen">
      <section class="builder-review-loading-card">
        <p class="eyebrow">Preparing draft review</p>
        <h1>Opening your WISP draft</h1>
        <p>We are assembling the current draft into a cleaner review copy.</p>
        <div class="builder-review-loading-bar"><span></span></div>
      </section>
    </main>
  `;
}

function getBuilderReviewTotalPages() {
  return Math.max(1, getBuilderDraftReviewPages().length);
}

function getBuilderReviewExpandedTitle(page) {
  return page.type === "docx-preview"
    ? (page.title || "WISP preview")
    : page.type === "cover"
      ? "Cover page"
      : page.type === "attachments"
        ? "Attachments"
        : "Expanded page view";
}

function renderBuilderReviewMeta(pageIndex, totalPages) {
  if (getBuilderMergedTemplatePages().length) {
    return `
      <span>Page ${pageIndex + 1} of ${totalPages}</span>
      <span>${state.builderMergePreviewPages.length ? "WISP draft preview" : state.builderMergePdfUrl ? "WISP PDF preview" : state.builderMergeDocxBlob ? "WISP preview" : "WISP preview"}</span>
      <span>${state.builderAttachments.length} attachments</span>
    `;
  }
  return `
    <span>Page ${pageIndex + 1} of ${totalPages}</span>
    <span>${getBuilderReviewSections().length} sections assembled</span>
    <span>${state.builderAttachments.length} attachments</span>
  `;
}

function renderBuilderReviewInlineCanvas(page, pageIndex, totalPages) {
  return `
    <button class="builder-review-side-nav is-left" type="button" data-action="builder-review-prev" ${pageIndex === 0 ? "disabled" : ""} aria-label="Previous page">&#8249;</button>
    ${renderBuilderReviewPage(page, pageIndex + 1, totalPages)}
    <button class="builder-review-side-nav is-right" type="button" data-action="builder-review-next" ${pageIndex === totalPages - 1 ? "disabled" : ""} aria-label="Next page">&#8250;</button>
  `;
}

function renderBuilderReviewModalActions(pageIndex, totalPages) {
  return `
    <button class="btn secondary" type="button" data-action="builder-review-prev" ${pageIndex === 0 ? "disabled" : ""}>Previous</button>
    <button class="btn secondary" type="button" data-action="builder-review-next" ${pageIndex === totalPages - 1 ? "disabled" : ""}>Next</button>
    <button class="btn secondary" type="button" data-action="close-builder-review-expanded">Close</button>
  `;
}

function builderDraftReviewScreen() {
  const pages = getBuilderDraftReviewPages();
  const totalPages = getBuilderReviewTotalPages();
  const pageIndex = Math.max(0, Math.min(state.builderReviewPage || 0, totalPages - 1));
  const page = pages[pageIndex];
  const expandedTitle = getBuilderReviewExpandedTitle(page);
  return `
    <main class="builder-shell builder-review-screen">
      <section class="builder-review-topbar">
        <div class="builder-review-topbar-copy">
          <p class="eyebrow">Draft review</p>
          <h1>Review your WISP draft</h1>
          <p class="lead">Inspect the structured draft, confirm the language reads cleanly, and then return to finalize the package.</p>
        </div>
        <div class="builder-review-topbar-actions">
          <button class="btn secondary" type="button" data-action="close-builder-review">Back to editor</button>
          <button class="btn secondary" type="button" data-action="open-builder-review-expanded">Expand page</button>
          <button class="btn secondary" type="button" data-action="download-builder-review">Download review PDF</button>
          <button class="btn primary" type="button" data-action="finalize-builder-wisp">Finalize WISP</button>
        </div>
      </section>
      <section class="builder-review-meta-strip">
        <div class="builder-review-meta-items" data-builder-review-meta>
          ${renderBuilderReviewMeta(pageIndex, totalPages)}
        </div>
      </section>
      <section class="builder-review-viewer-shell">
        <div class="builder-review-canvas" data-builder-review-inline-canvas>
          ${renderBuilderReviewInlineCanvas(page, pageIndex, totalPages)}
        </div>
      </section>
      ${state.builderReviewExpanded ? `
        <div class="builder-review-modal" role="dialog" aria-modal="true" aria-label="Expanded draft page view">
          <button class="builder-review-modal-backdrop" type="button" data-action="close-builder-review-expanded" aria-label="Close expanded page"></button>
          <section class="builder-review-modal-dialog">
            <div class="builder-review-modal-head">
              <div class="builder-review-modal-title">
                <h2 data-builder-review-modal-title>${expandedTitle}</h2>
                <span class="builder-review-modal-page-count" data-builder-review-modal-page-count>Page ${pageIndex + 1} of ${totalPages}</span>
              </div>
              <div class="builder-review-modal-actions" data-builder-review-modal-actions>
                ${renderBuilderReviewModalActions(pageIndex, totalPages)}
              </div>
            </div>
            <div class="builder-review-modal-canvas" data-builder-review-modal-canvas>
              ${renderBuilderReviewPage(page, pageIndex + 1, totalPages, "builder-review-paper-expanded")}
            </div>
          </section>
        </div>
      ` : ""}
    </main>
  `;
}

function bindActionButtons(scope = document) {
  scope.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button.dataset.action));
  });
}

function updateBuilderReviewDisplay() {
  if (!(state.screen === "builder" && state.builderReviewOpen)) return false;
  const pages = getBuilderDraftReviewPages();
  const totalPages = getBuilderReviewTotalPages();
  const pageIndex = Math.max(0, Math.min(state.builderReviewPage || 0, totalPages - 1));
  state.builderReviewPage = pageIndex;
  const page = pages[pageIndex];
  const inlineCanvas = document.querySelector("[data-builder-review-inline-canvas]");
  const meta = document.querySelector("[data-builder-review-meta]");
  if (!inlineCanvas || !meta) return false;
  meta.innerHTML = renderBuilderReviewMeta(pageIndex, totalPages);
  inlineCanvas.innerHTML = renderBuilderReviewInlineCanvas(page, pageIndex, totalPages);
  bindActionButtons(inlineCanvas);
  const modalCanvas = document.querySelector("[data-builder-review-modal-canvas]");
  if (modalCanvas) {
    modalCanvas.innerHTML = renderBuilderReviewPage(page, pageIndex + 1, totalPages, "builder-review-paper-expanded");
    modalCanvas.scrollTop = 0;
    const modalTitle = document.querySelector("[data-builder-review-modal-title]");
    const modalPageCount = document.querySelector("[data-builder-review-modal-page-count]");
    const modalActions = document.querySelector("[data-builder-review-modal-actions]");
    if (modalTitle) modalTitle.textContent = getBuilderReviewExpandedTitle(page);
    if (modalPageCount) modalPageCount.textContent = `Page ${pageIndex + 1} of ${totalPages}`;
    if (modalActions) {
      modalActions.innerHTML = renderBuilderReviewModalActions(pageIndex, totalPages);
      bindActionButtons(modalActions);
    }
  }
  queueBuilderPdfPreviewRender();
  return true;
}

function changeBuilderReviewPage(delta) {
  const nextPage = Math.max(0, Math.min(getBuilderReviewTotalPages() - 1, (state.builderReviewPage || 0) + delta));
  if (nextPage === state.builderReviewPage) return;
  state.builderReviewPage = nextPage;
  if (!updateBuilderReviewDisplay()) render();
}

function builderScreen() {
  const hasPendingDraft = hasPendingWispDraft();
  const hasActiveWisp = hasActiveWispProject();
  const hasPastVersions = Array.isArray(state.wispVersions) && state.wispVersions.length > 0;
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
  const isRichDraftTopic = isObjectiveTopic || isPurposeTopic || isGlossaryTopic;
  const firmName = (state.form.companyName || "").trim() || "the Firm";
  const objectiveStandardizedText = `Our objective, in the development and implementation of this comprehensive Written Information Security Plan (WISP), is to create effective administrative, technical, and physical safeguards for the protection of the Personally Identifiable Information (PII) retained by ${firmName}, (hereinafter known as the Firm).`;
  const dscName = (state.form.dataSecurityCoordinator || "").trim() || "the Data Security Coordinator";
  const pioName = (state.form.publicInformationOfficer || "").trim() || "the Public Information Officer";
  const dscDraft = state.builderDrafts["officials-dsc"] ?? initialBuilderDrafts["officials-dsc"];
  const pioDraft = state.builderDrafts["officials-pio"] ?? initialBuilderDrafts["officials-pio"];
  const insideFirmIntroDraft = state.builderDrafts["inside-firm-intro"] ?? initialBuilderDrafts["inside-firm-intro"];
  const insideFirmCollectionDraft = state.builderDrafts["inside-firm-collection"] ?? initialBuilderDrafts["inside-firm-collection"];
  const insideFirmPersonnelDraft = state.builderDrafts["inside-firm-personnel"] ?? initialBuilderDrafts["inside-firm-personnel"];
  const insideFirmDisclosureDraft = state.builderDrafts["inside-firm-disclosure"] ?? initialBuilderDrafts["inside-firm-disclosure"];
  const insideFirmReportableDraft = state.builderDrafts["inside-firm-reportable"] ?? initialBuilderDrafts["inside-firm-reportable"];
  const outsideFirmIntroDraft = state.builderDrafts["outside-firm-intro"] ?? initialBuilderDrafts["outside-firm-intro"];
  const outsideFirmNetworkDraft = state.builderDrafts["outside-firm-network"] ?? initialBuilderDrafts["outside-firm-network"];
  const outsideFirmAccessDraft = state.builderDrafts["outside-firm-access"] ?? initialBuilderDrafts["outside-firm-access"];
  const outsideFirmExchangeDraft = state.builderDrafts["outside-firm-exchange"] ?? initialBuilderDrafts["outside-firm-exchange"];
  const outsideFirmWifiDraft = state.builderDrafts["outside-firm-wifi"] ?? initialBuilderDrafts["outside-firm-wifi"];
  const outsideFirmRemoteDraft = state.builderDrafts["outside-firm-remote"] ?? initialBuilderDrafts["outside-firm-remote"];
  const outsideFirmDevicesDraft = state.builderDrafts["outside-firm-devices"] ?? initialBuilderDrafts["outside-firm-devices"];
  const outsideFirmTrainingDraft = state.builderDrafts["outside-firm-training"] ?? initialBuilderDrafts["outside-firm-training"];
  const policiesRulesDraft = state.builderDrafts["policies-rules"] ?? initialBuilderDrafts["policies-rules"];
  const policiesBreachDraft = state.builderDrafts["policies-breach"] ?? initialBuilderDrafts["policies-breach"];
  const resourcesIntroDraft = state.builderDrafts["resources-intro"] ?? initialBuilderDrafts["resources-intro"];

  if (state.builderReviewLoading) {
    return builderDraftReviewLoadingScreen();
  }

  if (state.builderReviewOpen) {
    return builderDraftReviewScreen();
  }

  if (state.builderTab === "active") {
    const activePanel = hasActiveWisp
      ? builderStatusPanel({
          eyebrow: "Current WISP",
          title: state.wispProject?.title || "Written Information Security Plan",
          body: `This is your completed WISP. Updated ${formatDashboardDate(state.wispProject?.updated_at)}. Signature progress and final distribution will appear here as that workflow is wired in.`,
          actions: `${state.wispProject?.latest_generated_file?.downloadUrl ? `<button class="btn secondary" type="button" data-action="download-current-wisp">Download Current WISP</button>` : ""}<button class="btn secondary" type="button" data-builder-status-tab="pending">Open Pending Draft</button>`,
        })
      : builderStatusPanel({
          eyebrow: "No Active WISP",
          title: "No active WISP yet",
          body: "You do not have a completed WISP in circulation yet. Once a draft is finalized, the active document will appear here for review, signatures, and distribution.",
          actions: hasPendingDraft
            ? `<button class="btn primary" type="button" data-builder-status-tab="pending">View Pending Draft</button>`
            : "",
        });

    return `
      <main class="builder-shell builder-shell-status">
        <section class="builder-topbar">
          <div class="builder-topbar-copy">
            <p class="eyebrow">WISP Builder</p>
            <h1>Written Information Security Plan</h1>
            <p class="lead">Edit template sections, review mapped language, and move through the working draft one topic at a time.</p>
          </div>
          ${builderHeaderActions()}
        </section>

        ${builderStatusTabs()}
        <div class="builder-shell-divider builder-shell-divider-static"></div>

        <section class="builder-stage builder-stage-status">
          ${activePanel}
        </section>
      </main>
    `;
  }

  if (state.builderTab === "past") {
    const pastPanel = hasPastVersions
      ? `
          <section class="builder-version-list">
            ${state.wispVersions
              .map(
                (version, index) => `
                  <article class="builder-version-card">
                    <div>
                      <p class="builder-status-panel-kicker">Version ${index + 1}</p>
                      <h3>${escapeHtml(version.fileName || version.title || "Archived WISP version")}</h3>
                      <p>Saved ${escapeHtml(formatDashboardDate(version.updated_at))}</p>
                    </div>
                    ${version.downloadUrl ? `<button class="btn secondary small" type="button" data-download-wisp-version="${index}">Download</button>` : ""}
                  </article>
                `,
              )
              .join("")}
          </section>
        `
      : builderStatusPanel({
          eyebrow: "No Archived Versions",
          title: "No past versions yet",
          body: "Archived WISP versions will appear here once completed documents are superseded by a newer active version.",
        });

    return `
      <main class="builder-shell builder-shell-status">
        <section class="builder-topbar">
          <div class="builder-topbar-copy">
            <p class="eyebrow">WISP Builder</p>
            <h1>Written Information Security Plan</h1>
            <p class="lead">Edit template sections, review mapped language, and move through the working draft one topic at a time.</p>
          </div>
          ${builderHeaderActions()}
        </section>

        ${builderStatusTabs()}
        <div class="builder-shell-divider builder-shell-divider-static"></div>

        <section class="builder-stage builder-stage-status">
          ${pastPanel}
        </section>
      </main>
    `;
  }

  if (!hasPendingDraft && !state.builderResumeEditing) {
    return `
      <main class="builder-shell builder-shell-status">
        <section class="builder-topbar">
          <div class="builder-topbar-copy">
            <p class="eyebrow">WISP Builder</p>
            <h1>Written Information Security Plan</h1>
            <p class="lead">Edit template sections, review mapped language, and move through the working draft one topic at a time.</p>
          </div>
          ${builderHeaderActions()}
        </section>

        ${builderStatusTabs()}
        <div class="builder-shell-divider builder-shell-divider-static"></div>

        <section class="builder-stage builder-stage-status">
          ${builderStatusPanel({
            eyebrow: "No Pending Draft",
            title: "No pending WISP draft yet",
            body: "Start a WISP draft from this builder and it will appear here as a pending item until it is finalized.",
          })}
        </section>
      </main>
    `;
  }

  if (!state.builderResumeEditing) {
    return `
      <main class="builder-shell builder-shell-status">
        <section class="builder-topbar">
          <div class="builder-topbar-copy">
            <p class="eyebrow">WISP Builder</p>
            <h1>Written Information Security Plan</h1>
            <p class="lead">Edit template sections, review mapped language, and move through the working draft one topic at a time.</p>
          </div>
        </section>

        ${builderStatusTabs()}
        <div class="builder-shell-divider builder-shell-divider-static"></div>

        <section class="builder-stage builder-stage-status">
          ${builderStatusPanel({
            eyebrow: "Pending Draft",
            title: state.wispProject?.title || "Draft WISP in progress",
            body: `A saved draft is waiting for edits. Last updated ${formatDashboardDate(state.wispProject?.updated_at)}. Continue editing to resume where you left off.`,
            actions: `<button class="btn primary" type="button" data-action="continue-pending-wisp">Continue Editing</button>`,
          })}
        </section>
      </main>
    `;
  }

  return `
    <main class="builder-shell ${state.builderSidebarOpen ? "is-sidebar-open" : ""} ${state.builderLaunchAnimation ? "is-editor-entering" : ""}">
      <button class="builder-dim ${state.builderSidebarOpen ? "is-visible" : ""}" type="button" data-action="close-builder-sidebar" aria-label="Close topics"></button>
      <aside class="builder-topic-sheet ${state.builderSidebarOpen ? "is-open" : ""}">
        <button class="builder-topic-peek" type="button" data-action="open-builder-sidebar" aria-label="Open topics">
          <span>Sections</span>
        </button>
        <div class="builder-topic-sheet-head">
          <div>
            <p class="rail-kicker">Editable sections</p>
            <h3>Draft outline</h3>
            <p class="builder-topic-sheet-subtext">Choose a section to edit its mapped language and continue through the draft.</p>
          </div>
          <button class="btn ghost small" type="button" data-action="close-builder-sidebar">Close</button>
        </div>
        <div class="builder-topic-list">
          ${builderTopics
            .map(
              (item, index) => `
                <button class="builder-topic-item ${index === state.builderTopicIndex ? "is-active" : ""}" type="button" data-builder-topic="${index}">
                  <span class="builder-topic-index">${index + 1}</span>
                  <span class="builder-topic-body">
                    <span class="builder-topic-name">${escapeHtml(item.title)}</span>
                    <span class="builder-topic-status">${escapeHtml(item.status)}</span>
                  </span>
                </button>
              `,
            )
            .join("")}
        </div>
      </aside>

      <section class="builder-topbar">
        <div class="builder-topbar-copy">
          <p class="eyebrow">WISP Builder</p>
          <h1>Written Information Security Plan</h1>
          <p class="lead">Edit template sections, review mapped language, and move through the working draft one topic at a time.</p>
        </div>
        ${builderHeaderActions()}
      </section>

      ${builderStatusTabs()}

      <div class="builder-shell-divider"></div>

        <section class="builder-stage">
          <section class="builder-editor-panel">
            ${
                isIntroTopic
                ? ``
                : `<div class="builder-editor-head">
                    <div>
                      <h2>${isFirmDetailsTopic ? "Firm details and responsible roles" : isOfficialsTopic ? "Responsible officials" : isInsideFirmTopic ? "Inside the Firm Risk Mitigation" : isOutsideFirmTopic ? "Outside the Firm Risk Mitigation" : isResourcesTopic ? "Resource Links" : escapeHtml(topic.title)}</h2>
                      ${isFirmDetailsTopic ? `<p>Add the core firm details that will be carried through the draft and confirm the individuals assigned to the primary WISP responsibilities. These entries help personalize the document and clarify who is responsible for oversight, coordination, and public-facing information handling.</p>` : ``}
                    </div>
                  </div>`
            }

            <div class="builder-editor-stack">
              ${
                isIntroTopic
                  ? `
              <section class="builder-intro-page">
                <div class="builder-intro-head">
                  <h2>Start your Written Information Security Plan</h2>
                  <p>This workspace helps your firm prepare a structured WISP draft using the information gathered in your assessment and builder workflow. Review each section carefully and update the language so it matches how your firm actually handles data, access, storage, and security responsibilities.</p>
                </div>

                <div class="builder-intro-grid">
                  <section class="builder-doc-block builder-intro-block">
                    <div class="builder-doc-head">
                      <div>
                        <h3>How to use this builder</h3>
                      </div>
                    </div>
                    <div class="builder-doc-body">
                      <p>Work through the draft one section at a time. Some sections collect firm-specific details, while others provide base language that should be reviewed and adjusted to fit your operations.</p>
                    </div>
                  </section>

                  <section class="builder-doc-block builder-intro-block">
                    <div class="builder-doc-head">
                      <div>
                        <h3>Your review matters</h3>
                      </div>
                    </div>
                    <div class="builder-doc-body">
                      <p>This builder is designed to help organize and accelerate WISP preparation, but it should not be treated as legal advice or as a substitute for firm-specific judgment. Before finalizing the document, confirm that the language reflects your real practices, vendors, personnel roles, and record-handling procedures.</p>
                    </div>
                  </section>

                  <section class="builder-doc-block builder-intro-block">
                    <div class="builder-doc-head">
                      <div>
                        <h3>About editable content</h3>
                      </div>
                    </div>
                    <div class="builder-doc-body">
                      <p>Most drafting areas can be edited directly. Use those sections to add firm-specific information, revise placeholder language, and remove anything that does not apply.</p>
                    </div>
                  </section>

                  <section class="builder-doc-block builder-intro-block">
                    <div class="builder-doc-head">
                      <div>
                        <h3>About standardized content</h3>
                      </div>
                    </div>
                    <div class="builder-doc-body">
                      <p>Some areas may be fixed, reference-based, or controlled for consistency within the document workflow. Where editing is limited, review the surrounding sections carefully to ensure the final document still reflects your firmÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢s actual safeguards.</p>
                    </div>
                  </section>
                </div>

                <section class="builder-doc-block builder-intro-example">
                  <div class="builder-doc-head builder-doc-head-split">
                    <div>
                      <h3>Editable section example</h3>
                    </div>
                    <span class="builder-intro-chip">Editable drafting surface</span>
                  </div>
                  <div class="builder-doc-body">
                    <div class="builder-editor-surface">
                      <div class="builder-editor-toolbar">
                        <button class="builder-tool" type="button">B</button>
                        <button class="builder-tool builder-tool-italic" type="button">I</button>
                        <button class="builder-tool builder-tool-underline" type="button">U</button>
                        <span class="builder-tool-sep"></span>
                        <button class="builder-tool" type="button">1.</button>
                        <button class="builder-tool" type="button">-</button>
                        <button class="builder-tool" type="button">L</button>
                        <button class="builder-tool" type="button">C</button>
                      </div>
                      <div class="builder-editor-canvas builder-editor-canvas-direct" contenteditable="true" spellcheck="false" data-builder-editor="${attr(topic.id)}">${escapeHtml(topicDraft)}</div>
                    </div>
                  </div>
                </section>

                <section class="builder-doc-block builder-intro-example builder-intro-example-fixed">
                  <div class="builder-doc-head builder-doc-head-split">
                    <div>
                      <h3>Standardized section example</h3>
                    </div>
                    <span class="builder-intro-chip builder-intro-chip-fixed">Controlled section</span>
                  </div>
                  <div class="builder-doc-body">
                    <div class="builder-intro-fixed-surface">
                      <p>This section is provided in a controlled format and may be limited to preserve document structure or required language.</p>
                    </div>
                  </div>
                </section>
              </section>`
                  : isFirmDetailsTopic
                  ? `
             <section class="builder-doc-block builder-doc-block-firm">
                <div class="builder-doc-head">
                  <div>
                    <h3>Required firm information</h3>
                    <p>Use these fields to confirm the legal or operating name of the firm, assign the primary named roles, and enter the title that should appear on the signature page if applicable.</p>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <div class="field-grid two">
                    ${field("companyName", "Firm name", "text", "", "Enter firm name", true)}
                    ${select("principalOperatingOfficer", "Principal Operating Officer", options.builderRoleOptions, "", "Select name...")}
                    ${select("dataSecurityCoordinator", "Data Security Coordinator", options.builderRoleOptions, "", "Select name...")}
                    ${select("publicInformationOfficer", "Public Information Officer", options.builderRoleOptions, "", "Select name...")}
                    ${field("signatureTitle", "Signature title", "text", "", "Enter signature title", true)}
                  </div>
                </div>
              </section>

              <section class="builder-doc-block builder-doc-block-note">
                <div class="builder-doc-head">
                  <div>
                    <h3>Before you continue</h3>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <p>Make sure the assigned roles reflect how responsibilities are actually handled within the firm. If one person currently fills multiple functions, confirm that this matches your operating reality before finalizing the document.</p>
                </div>
              </section>`
                  : isObjectiveTopic
                  ? `
              <section class="builder-doc-block builder-intro-example builder-intro-example-fixed builder-objective-standardized">
                <div class="builder-doc-body">
                  <div class="builder-intro-fixed-surface">
                    <p>${escapeHtml(objectiveStandardizedText)}</p>
                  </div>
                </div>
              </section>`
                  : isOfficialsTopic
                  ? `
              <section class="builder-doc-block builder-intro-example builder-intro-example-fixed builder-objective-standardized">
                <div class="builder-doc-body">
                  <div class="builder-intro-fixed-surface">
                    <p>${escapeHtml(`${firmName} has designated ${dscName} to be the Data Security Coordinator (hereinafter the DSC).`)}</p>
                  </div>
                </div>
              </section>

              <section class="builder-editor-direct">
                <div class="builder-editor-field builder-editor-field-direct">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="officials-dsc">${dscDraft}</div>
                  </div>
                </div>
              </section>

              <section class="builder-doc-block builder-intro-example builder-intro-example-fixed builder-objective-standardized">
                <div class="builder-doc-body">
                  <div class="builder-intro-fixed-surface">
                    <p>${escapeHtml(`${firmName} has designated ${pioName} to be the Public Information Officer (hereinafter PIO).`)}</p>
                  </div>
                </div>
              </section>

              <section class="builder-editor-direct">
                <div class="builder-editor-field builder-editor-field-direct">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="officials-pio">${pioDraft}</div>
                  </div>
                </div>
              </section>`
                  : isInsideFirmTopic
                  ? `
              <section class="builder-editor-direct">
                <div class="builder-editor-field builder-editor-field-direct">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="inside-firm-intro">${insideFirmIntroDraft}</div>
                  </div>
                </div>
              </section>

              <section class="builder-doc-block">
                <div class="builder-doc-head">
                  <div>
                    <h3>PII Collection and Retention Policy</h3>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="inside-firm-collection">${insideFirmCollectionDraft}</div>
                  </div>
                </div>
              </section>

              <section class="builder-doc-block">
                <div class="builder-doc-head">
                  <div>
                    <h3>Personnel Accountability Policy</h3>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="inside-firm-personnel">${insideFirmPersonnelDraft}</div>
                  </div>
                </div>
              </section>

              <section class="builder-doc-block">
                <div class="builder-doc-head">
                  <div>
                    <h3>PII Disclosure Policy</h3>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="inside-firm-disclosure">${insideFirmDisclosureDraft}</div>
                  </div>
                </div>
              </section>

              <section class="builder-doc-block">
                <div class="builder-doc-head">
                  <div>
                    <h3>Reportable Event Policy</h3>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="inside-firm-reportable">${insideFirmReportableDraft}</div>
                  </div>
                </div>
              </section>`
                  : isOutsideFirmTopic
                  ? `
              <section class="builder-editor-direct">
                <div class="builder-editor-field builder-editor-field-direct">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-intro">${outsideFirmIntroDraft}</div>
                  </div>
                </div>
              </section>

              <section class="builder-doc-block">
                <div class="builder-doc-head">
                  <div>
                    <h3>Network Protection Policy</h3>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-network">${outsideFirmNetworkDraft}</div>
                  </div>
                </div>
              </section>

              <section class="builder-doc-block">
                <div class="builder-doc-head">
                  <div>
                    <h3>Firm User Access Control Policy</h3>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-access">${outsideFirmAccessDraft}</div>
                  </div>
                </div>
              </section>

              <section class="builder-doc-block">
                <div class="builder-doc-head">
                  <div>
                    <h3>Electronic Exchange of PII Policy</h3>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-exchange">${outsideFirmExchangeDraft}</div>
                  </div>
                </div>
              </section>

              <section class="builder-doc-block">
                <div class="builder-doc-head">
                  <div>
                    <h3>Wi-Fi Access Policy</h3>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-wifi">${outsideFirmWifiDraft}</div>
                  </div>
                </div>
              </section>

              <section class="builder-doc-block">
                <div class="builder-doc-head">
                  <div>
                    <h3>Remote Access Policy</h3>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-remote">${outsideFirmRemoteDraft}</div>
                  </div>
                </div>
              </section>

              <section class="builder-doc-block">
                <div class="builder-doc-head">
                  <div>
                    <h3>Connected Devices Policy</h3>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-devices">${outsideFirmDevicesDraft}</div>
                  </div>
                </div>
              </section>

              <section class="builder-doc-block">
                <div class="builder-doc-head">
                  <div>
                    <h3>Information Security Training Policy</h3>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="outside-firm-training">${outsideFirmTrainingDraft}</div>
                  </div>
                </div>
              </section>`
                  : isPoliciesTopic
                  ? `
              <section class="builder-doc-block">
                <div class="builder-doc-head">
                  <div>
                    <h3>Rules of Behavior and Conduct Safeguarding Client PII</h3>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="policies-rules">${policiesRulesDraft}</div>
                  </div>
                </div>
              </section>

              <section class="builder-doc-block">
                <div class="builder-doc-head">
                  <div>
                    <h3>Security Breach Notifications and Procedures</h3>
                  </div>
                </div>
                <div class="builder-doc-body">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="policies-breach">${policiesBreachDraft}</div>
                  </div>
                </div>
              </section>`
                  : isResourcesTopic
                  ? `
              <section class="builder-editor-direct">
                <div class="builder-editor-field builder-editor-field-direct">
                  <div class="builder-editor-surface">
                    <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                    </div>
                    <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="resources-intro">${resourcesIntroDraft}</div>
                  </div>
                </div>
              </section>

${renderBuilderResourceSections()}`                  : isAttachmentsTopic
                  ? `
              <section class="builder-doc-block builder-topic-minimal builder-attachment-minimal">
                <div class="builder-doc-body builder-topic-minimal-body builder-attachment-body-minimal">
                  <div class="builder-topic-intro">
                    <p>Add supporting PDFs to include with the final WISP package. Files appear below in delivery order and can be dragged to reorder before delivery.</p>
                    <p><strong>Please note:</strong> anyone who receives the final WISP package will be able to view these attachments, so only upload files that are appropriate to share.</p>
                  </div>

                  <label class="builder-upload-zone builder-upload-zone-minimal" data-builder-upload-zone>
                    <input class="builder-upload-input" type="file" accept="application/pdf,.pdf" data-builder-upload />
                    <span class="builder-upload-title">Drop file here or browse</span>
                    <span class="builder-upload-subtitle">PDF only</span>
                    <span class="builder-upload-meta-inline">Maximum size: 2MB</span>
                  </label>

                  <div class="builder-attachment-flat-list">
                    <div class="builder-attachment-flat-head">
                      <h4>Attached</h4>
                    </div>
                    ${
                      state.builderAttachments.length
                        ? `<div class="builder-attachment-list builder-attachment-list-flat">
                            ${state.builderAttachments
                              .map(
                                (file, index) => `
                                  <div class="builder-attachment-item builder-attachment-item-flat" draggable="true" data-attachment-index="${index}">
                                    <div class="builder-attachment-file">
                                      <div class="builder-attachment-copy">
                                        <strong>${escapeHtml(file.name)}</strong>
                                        <div class="builder-attachment-meta-row">
                                          <span>${escapeHtml(file.sizeLabel)}</span>
                                          <span>Order ${index + 1}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <button class="builder-attachment-remove" type="button" data-remove-attachment="${index}" aria-label="Remove attachment">&times;</button>
                                  </div>
                                `,
                              )
                              .join("")}
                          </div>`
                        : `<div class="builder-attachment-empty builder-attachment-empty-flat"><p>No attachments added yet.</p></div>`
                    }
                  </div>
                </div>
              </section>`
                  : isFinalizeTopic
                  ? `
              <section class="builder-doc-block builder-topic-minimal builder-finalize-minimal">
                <div class="builder-doc-body builder-topic-minimal-body">
                  <div class="builder-finalize-hero">
                    <div class="builder-finalize-visual" aria-hidden="true">
                      <span class="builder-finalize-sheet"></span>
                    </div>
                    <div class="builder-finalize-copy-minimal">
                      <p class="rail-kicker">Final review</p>
                      <h3>Your WISP is ready for review</h3>
                      <p class="builder-finalize-intro">Review the draft to confirm the language reflects your firm accurately before finalizing the package.</p>
                                      <div class="builder-finalize-actions-minimal">
                        <button class="btn primary" type="button" data-action="review-builder-draft">Review draft</button>
                        <button class="builder-finalize-link" type="button" data-action="download-builder-review">Download review PDF</button>
                      </div>
                      <p class="builder-finalize-footnote">Use the watermarked copy for offline markup or partner review, then return here to finalize.</p>
                    </div>
                  </div>
                </div>
              </section>`
                  : ""
              }

              ${
                isIntroTopic || isFirmDetailsTopic || isOfficialsTopic || isInsideFirmTopic || isOutsideFirmTopic || isPoliciesTopic || isResourcesTopic || isAttachmentsTopic || isFinalizeTopic
                  ? ``
                  : isRichDraftTopic
                  ? `<section class="builder-editor-direct">
                  <div class="builder-editor-field builder-editor-field-direct">
                    <div class="builder-editor-surface">
                      <div class="builder-editor-toolbar">
                        <button class="builder-tool" type="button">B</button>
                        <button class="builder-tool builder-tool-italic" type="button">I</button>
                        <button class="builder-tool builder-tool-underline" type="button">U</button>
                        <span class="builder-tool-sep"></span>
                        <button class="builder-tool" type="button">1.</button>
                        <button class="builder-tool" type="button">-</button>
                        <button class="builder-tool" type="button">L</button>
                        <button class="builder-tool" type="button">C</button>
                      </div>
                      <div class="builder-editor-canvas builder-editor-canvas-direct builder-editor-canvas-rich" contenteditable="true" spellcheck="false" data-builder-editor="${attr(topic.id)}">${topicDraft}</div>
                    </div>
                  </div>
              </section>`
                  : `<section class="builder-editor-direct">
                  <div class="builder-editor-field builder-editor-field-direct">
                    <div class="builder-editor-surface">
                      <div class="builder-editor-toolbar">
                      <button class="builder-tool" type="button">B</button>
                      <button class="builder-tool builder-tool-italic" type="button">I</button>
                      <button class="builder-tool builder-tool-underline" type="button">U</button>
                      <span class="builder-tool-sep"></span>
                      <button class="builder-tool" type="button">1.</button>
                      <button class="builder-tool" type="button">-</button>
                      <button class="builder-tool" type="button">L</button>
                      <button class="builder-tool" type="button">C</button>
                      </div>
                      <div class="builder-editor-canvas builder-editor-canvas-direct" contenteditable="true" spellcheck="false" data-builder-editor="${attr(topic.id)}">${escapeHtml(topicDraft)}</div>
                    </div>
                  </div>
              </section>`
              }
            </div>
          </section>
      </section>
    </main>
  `;
}

function navIcon(name) {
  const icons = {
    home: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.75 10.25 12 4.5l7.25 5.75"></path>
        <path d="M6.75 9.75V19a1 1 0 0 0 1 1h8.5a1 1 0 0 0 1-1V9.75"></path>
        <path d="M10 20v-5.5h4V20"></path>
      </svg>
    `,
    risk: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.75 18.75 6v5.7c0 4.7-2.75 7.9-6.75 8.98-4-1.08-6.75-4.28-6.75-8.98V6Z"></path>
        <path d="M12 8.25v4.35"></path>
        <circle cx="12" cy="16.2" r=".8" fill="currentColor" stroke="none"></circle>
      </svg>
    `,
    builder:       `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.2 4.9h7.35l3.05 3.1v10.95a1.1 1.1 0 0 1-1.1 1.1H7.2a1.1 1.1 0 0 1-1.1-1.1V6a1.1 1.1 0 0 1 1.1-1.1Z"></path>
        <path d="M14.55 4.9v3.15h3.05"></path>
        <path d="M9.1 10.15h5.9"></path>
        <path d="M9.1 13.1h5.9"></path>
        <path d="M9.1 16.05h3.65"></path>
        <path d="M8.25 8.15h.01"></path>
      </svg>
    `,
    documents:       `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.1 6.1h7.35a1 1 0 0 1 1 1v9.8a1 1 0 0 1-1 1H8.1a1 1 0 0 1-1-1V7.1a1 1 0 0 1 1-1Z"></path>
        <path d="M10.3 4.25h7.35a1 1 0 0 1 1 1v9.8"></path>
        <path d="M10 10.3h4.6"></path>
        <path d="M10 13.2h4.6"></path>
        <path d="M10 16.1h3.1"></path>
      </svg>
    `,
    training: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.75 8.2 12 4.75l8.25 3.45L12 11.65Z"></path>
        <path d="M6.75 10.45v4.15c0 1.55 2.35 3.15 5.25 3.15s5.25-1.6 5.25-3.15v-4.15"></path>
        <path d="M20.25 8.25v5.5"></path>
      </svg>
    `,
    download: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4.75v9"></path>
        <path d="m8.5 10.75 3.5 3.5 3.5-3.5"></path>
        <path d="M5.75 19.25h12.5"></path>
      </svg>
    `,
    settings:       `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="2.35"></circle>
        <path d="M12 4.85v1.8"></path>
        <path d="M12 17.35v1.8"></path>
        <path d="M19.15 12h-1.8"></path>
        <path d="M6.65 12h-1.8"></path>
        <path d="m17.05 6.95-1.3 1.3"></path>
        <path d="m8.25 15.75-1.3 1.3"></path>
        <path d="m17.05 17.05-1.3-1.3"></path>
        <path d="m8.25 8.25-1.3-1.3"></path>
      </svg>
    `,
  };

  return icons[name] || "";
}

function documentLibraryIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.25 3.75h7.15l4.1 4.05V19.8a1.45 1.45 0 0 1-1.45 1.45H7.25A1.45 1.45 0 0 1 5.8 19.8V5.2a1.45 1.45 0 0 1 1.45-1.45Z"></path>
      <path d="M14.4 3.75V7.9h4.1"></path>
      <path d="M9.2 11.15h6.15"></path>
      <path d="M9.2 14.15h6.15"></path>
      <path d="M9.2 17.15h4.25"></path>
    </svg>
  `;
}

function templateDownloadIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5.1v8.8"></path>
      <path d="m8.7 10.95 3.3 3.3 3.3-3.3"></path>
      <path d="M6.2 18.7h11.6"></path>
    </svg>
  `;
}

function brandMark() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.2 19 5.55v5.8c0 4.95-2.9 8.3-7 9.45-4.1-1.15-7-4.5-7-9.45v-5.8z"></path>
      <path d="M8.2 8.35 12 17.1l3.8-8.75"></path>
      <path d="M9.55 11.25h4.9"></path>
    </svg>
  `;
}

function appNav() {
  const riskActive = ["welcome", "assessment", "review", "results"].includes(state.screen);
  return `
        <aside class="app-sidebar">
          <div class="app-sidebar-brand">
            <div class="app-sidebar-brand-mark">
              <span class="brand-mark">${brandMark()}</span>
              <div class="app-sidebar-brand-copy">
                <strong>EasyWISP</strong>
                <span>Compliance workspace</span>
              </div>
            </div>
          </div>

        <nav class="app-nav">
          <button class="app-nav-item ${state.screen === "home" ? "is-active" : ""}" type="button" data-action="nav-home">
            <span class="app-nav-icon">${navIcon("home")}</span>
            <span>Home</span>
          </button>
          <button class="app-nav-item ${riskActive ? "is-active" : ""}" type="button" data-action="nav-risk">
            <span class="app-nav-icon">${navIcon("risk")}</span>
            <span>Risk Assessment</span>
          </button>
          <button class="app-nav-item ${state.screen === "builder" ? "is-active" : ""}" type="button" data-action="nav-builder-home">
            <span class="app-nav-icon">${navIcon("builder")}</span>
            <span>WISP Builder</span>
          </button>
          <button class="app-nav-item ${state.screen === "training" ? "is-active" : ""}" type="button" data-action="nav-training">
            <span class="app-nav-icon">${navIcon("training")}</span>
            <span>Training</span>
          </button>
          <button class="app-nav-item ${["documents", "document-editor"].includes(state.screen) ? "is-active" : ""}" type="button" data-action="nav-documents">
            <span class="app-nav-icon">${navIcon("documents")}</span>
            <span>Documents</span>
          </button>
          <button class="app-nav-item ${state.screen === "settings" ? "is-active" : ""}" type="button" data-action="nav-settings">
            <span class="app-nav-icon">${navIcon("settings")}</span>
            <span>Settings</span>
          </button>
          </nav>
          <div class="app-sidebar-footer">
            <button class="app-sidebar-help" type="button">
              <span>Help center</span>
            </button>
            <span class="app-sidebar-meta">Workspace ready</span>
          </div>
        </aside>
  `;
}

function isAssessmentSectionComplete(index) {
  if (index === 0) {
    return ["companyName", "primaryContact", "practiceType", "staffSize", "taxSoftware", "itManagement"].every((field) => Boolean(state.form[field]));
  }
  return Boolean(state.form[`question_${index}`]);
}

function countCompletedAssessmentSections() {
  return sections.reduce((total, _section, index) => total + (isAssessmentSectionComplete(index) ? 1 : 0), 0);
}

function progressRail() {
  const totalSections = sections.length;
  const completedCount = countCompletedAssessmentSections();
  const percent = state.screen === "results" || state.screen === "review"
    ? 100
    : Math.round((completedCount / totalSections) * 100);
  return `
    <aside class="progress-rail">
      <div>
        <p class="rail-kicker">Assessment</p>
        <div class="progress-list">
          ${sections
            .map((section, index) => {
              const active = state.screen === "assessment" && state.sectionIndex === index;
              const complete = isAssessmentSectionComplete(index) || state.screen === "review" || state.screen === "results";
              return `
                <button class="progress-item ${active ? "is-active" : ""} ${complete ? "is-complete" : ""}" data-jump-section="${index}">
                  <span class="progress-index">${String(index + 1).padStart(2, "0")}</span>
                  <span class="progress-label">${section}</span>
                  <span class="progress-status" aria-hidden="true"></span>
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

function authScreen() {
  return     `
    <main class="auth-shell">
      <section class="auth-card">
        <div class="auth-brand">
          <span class="brand-mark auth-brand-mark">${brandMark()}</span>
          <div>
            <strong>EasyWISP Workspace</strong>
            <span>Sign in to access your firm, drafts, documents, and training records.</span>
          </div>
        </div>
        <div class="auth-copy">
          <h1>Sign in with your work email</h1>
          <p>We'll send a magic link so you can open the workspace in a firm-backed session.</p>
        </div>
        <form class="auth-form" data-auth-form>
          <label class="field auth-field">
            <span>Email address</span>
            <input type="email" value="${attr(state.authEmail)}" data-auth-email placeholder="name@firm.com" autocomplete="email" required />
          </label>
          ${state.authError ? `<p class="auth-feedback is-error">${escapeHtml(state.authError)}</p>` : ""}
          ${state.authNotice ? `<p class="auth-feedback is-success">${escapeHtml(state.authNotice)}</p>` : ""}
          <button class="btn primary auth-submit" type="submit" ${state.authBusy ? "disabled" : ""}>${state.authBusy ? "Sending magic link..." : "Send magic link"}</button>
        </form>
      </section>
    </main>
  `;
}

function topbar() {
  if (!state.authUser) return ``;
  return `
    <div class="topbar">
      <div class="topbar-copy">
        <strong>${escapeHtml(state.firmProfile?.name || "Firm workspace")}</strong>
        <span>${escapeHtml(state.authUser.email || "Signed in")}</span>
      </div>
      <button class="btn ghost topbar-signout" type="button" data-action="sign-out">Sign out</button>
    </div>
  `;
}

function shell(content, wide = false, options = {}) {
  const hideRail = options.hideRail || state.screen === "results";
  const shellClass = hideRail ? "workspace report-only" : "workspace";
  const contentClass = [
    wide ? "wide" : "",
    state.screen === "assessment" ? "assessment-flow" : "",
    hideRail ? "report-only" : "",
  ].filter(Boolean).join(" ");

  return `
    <div class="${shellClass}">
      ${hideRail ? "" : progressRail()}
      <main class="content">
        <div class="content-inner ${contentClass}">
          ${content}
        </div>
      </main>
    </div>
  `;
}
function screenHeader(title, intro, stepText = "") {
  const assessmentStep = state.screen === "assessment"
    ? ""
    : '<span class="section-step-pill">Assessment</span>';

  return `
    <div class="screen-head">
      <div>
        <p class="${state.screen === "assessment" && state.sectionIndex > 0 ? "eyebrow is-accent" : "eyebrow"}">${stepText || sectionEyebrow()}</p>
        <h1>${title}</h1>
        <p class="lead">${intro}</p>
      </div>
      ${assessmentStep}
    </div>
    <div class="notice is-hidden" id="sectionNotice">Please complete the required fields before continuing.</div>
  `;
}

function sectionEyebrow() {
  if (state.screen === "assessment" && state.sectionIndex === 0) return "Assessment";
  if (state.screen === "assessment" && state.sectionIndex > 0) return `Section ${state.sectionIndex + 1} &middot; ${sections[state.sectionIndex]}`;
  return "Assessment";
}

function practiceOverview() {
  return `
    ${screenHeader("About Your Practice", "Help us tailor the assessment to your firm's specific environment")}
    <div class="card-grid">
      ${card("Practice Details", `
        <div class="field-grid two">
          ${field("companyName", "Firm Name", "text", "", "Smith & Associates CPA")}
          ${field("primaryContact", "Primary Contact", "text", "", "John Smith, CPA")}
          ${select("practiceType", "Practice Type", options.practiceTypes, "", "Select type")}
          ${select("staffSize", "Number of Staff", options.staffSizes, "", "Select size")}
          ${select("taxSoftware", "Tax Software Used", options.taxSoftware, "", "Select primary software")}
          ${select("itManagement", "Current IT Management", options.itManagement, "", "How is IT currently handled?")}
        </div>
      `, "", "assessment-form-card assessment-form-card-expanded")}
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
    ${screenHeader(item.question, item.context)}
    <div class="card-grid">
      ${card(
        sections[questionIndex + 1],
        `
          <div class="assessment-question-body">
            <div class="field assessment-question-field">
              <span class="assessment-question-kicker">Response</span>
            <span class="label">Choose the answer that best matches your current environment. *</span>
            <div class="choice-grid">
              ${optionRows}
            </div>
            <span class="error ${error ? "is-visible" : ""}">${error || ""}</span>
          </div>
          </div>
        `,
        "",
        "assessment-form-card assessment-question-card"
      )}
    </div>
    ${footer(questionIndex === assessmentQuestions.length - 1 ? "Review Answers" : "Continue")}
  `;
}

function systemsScreen() {
  return `
    ${screenHeader("How you receive and store data", "Identify the core platforms your firm uses to communicate with clients and prepare returns.")}
    ${card("Core Systems", `
      <div class="field-grid">
        ${select("emailProvider", "Email Provider", options.emailProviders, "", "Select email provider...")}
        ${field("emailUsers", "Number of Email Users", "number", "Include active users with access to firm email accounts.")}
      </div>
    `)}
    ${footer("Continue")}
  `;
}

function intakeScreen() {
  return `
    ${screenHeader("How you receive and store data", "These answers help identify how taxpayer information moves into and through your firm.")}
    <div class="card-grid two-col">
      ${card("Taxpayer Materials", checkboxGroup("taxpayerMaterials", "How do you receive taxpayer materials? Choose all that apply.", options.materials, "Select every method clients currently use, even if occasional."))}
      ${card("Work Model", checkboxGroup("workModel", "How does your team work? Choose all that apply.", options.workModel, "Select all operating models that apply to your firm."))}
    </div>
    ${footer("Continue")}
  `;
}

function devicesScreen() {
  return `
    ${screenHeader("How you receive and store data", "These questions assess where firm data lives and how it is protected from loss.")}
    <div class="card-grid">
      ${card("Devices", `
        <div class="field-grid two">
          ${field("computerCount", "How many computers total in your company?", "number")}
          ${select("hasServer", "Do you have a server?", options.server, "A server includes a local file server, NAS, or hosted server used by the firm.")}
        </div>
      `)}
      ${card("File Storage", radioGroup("fileStorage", "Where do you store company files?", options.storage, "", "two"))}
      ${card("Backup", checkboxGroup("backups", "How do you currently back up your data? Choose all that apply.", options.backups, "Select every backup method currently used by the firm."))}
    </div>
    ${footer("Continue to Types of Data & Services")}
  `;
}

function typesScreen() {
  return `
    ${screenHeader("Types of data & services", "This helps estimate the volume and sensitivity of data handled by your firm.")}
    <div class="card-grid two-col">
      ${card("Return Volume", `
        <div class="field-grid">
          ${field("individualReturns", "Individual Returns (per year)", "number", "Approximate annual volume is acceptable. Enter 0 if none.")}
          ${field("corporateReturns", "Corporate Returns (per year)", "number", "Approximate annual volume is acceptable. Enter 0 if none.")}
        </div>
      `)}
      ${card("Services Offered", `
        <div class="field-grid">
          <div class="field"><span class="label">Do you offer bookkeeping services? *</span>${segmented("bookkeeping", ["Yes", "No"])}</div>
          <div class="field"><span class="label">Do you offer payroll services? *</span>${segmented("payroll", ["Yes", "No"])}</div>
          <div class="field"><span class="label">Do you sell insurance policies? *</span>${segmented("insurance", ["Yes", "No"])}</div>
        </div>
      `)}
    </div>
    ${footer("Continue")}
  `;
}

function peopleScreen() {
  return `
    ${screenHeader("Team members", "Include employees, partners, contractors, and vendors who view or handle client data. Add email and phone when possible for WISP signature requests.")}
    <div class="card-grid">
      ${peopleGroup("Team Members", "teamMembers", "Add team member", "No team members added yet.")}
      ${peopleGroup("Contractors", "contractors", "Add contractor", "No contractors added yet.")}
      ${vendorGroup()}
    </div>
    ${footer("Continue")}
  `;
}

function peopleGroup(title, key, button, empty) {
  const list = state.form[key];
  return card(title, `
    <div class="entry-list">
      ${
        list.length
          ? list.map((person, index) => personCard(person, key, index)).join("")
          : `<div class="empty-state"><p>${empty}</p><button class="btn secondary small" data-add-entry="${key}" type="button">+ ${button}</button></div>`
      }
      ${list.length ? `<button class="btn secondary small" data-add-entry="${key}" type="button">+ ${button}</button>` : ""}
    </div>
  `);
}

function personCard(person, key, index) {
  const name = `${person.first || "Unnamed"} ${person.last || ""}`.trim();
  return `
    <div class="summary-card">
      <div class="summary-card-main">
        <div class="summary-card-title">${escapeHtml(name)}</div>
        <div class="summary-card-meta">${escapeHtml(person.role || "Access role not set")} � ${escapeHtml(person.location || "Location not set")} � Remote access: ${escapeHtml(person.remote || "Not set")}</div>
        <div class="summary-card-meta">${escapeHtml(person.email || "No email")} � ${escapeHtml(person.phone || "No phone")}</div>
      </div>
      <div class="action-cluster">
        <button class="btn secondary small" data-edit-entry="${key}:${index}" type="button">Edit</button>
        <button class="btn danger small" data-remove-entry="${key}:${index}" type="button">Remove</button>
      </div>
    </div>
  `;
}

function vendorGroup() {
  const list = state.form.vendors;
  return card("Vendors", `
    <div class="entry-list">
      ${
        list.length
          ? list
              .map(
                (vendor, index) => `
                  <div class="summary-card">
                    <div>
                      <div class="summary-card-title">${escapeHtml(vendor.name || "Unnamed vendor")}</div>
                      <div class="summary-card-meta">Business vendor with possible client-data access</div>
                    </div>
                    <div class="action-cluster">
                      <button class="btn secondary small" data-edit-entry="vendors:${index}" type="button">Edit</button>
                      <button class="btn danger small" data-remove-entry="vendors:${index}" type="button">Remove</button>
                    </div>
                  </div>
                `,
              )
              .join("")
          : `<div class="empty-state"><p>No vendors added yet.</p><button class="btn secondary small" data-add-entry="vendors" type="button">+ Add vendor</button></div>`
      }
      ${list.length ? `<button class="btn secondary small" data-add-entry="vendors" type="button">+ Add vendor</button>` : ""}
    </div>
  `);
}

function securityOfficerScreen() {
  return `
    ${screenHeader("Security Officer", "Designate the qualified individual responsible for coordinating your information security program.")}
    <div class="callout" style="margin-bottom:16px">
      <span class="check">i</span>
      <div>
        <strong>IRS Requirement</strong>
        The Gramm-Leach-Bliley Act requires you to designate a qualified individual to coordinate your information security program. This is typically the firm owner or a senior manager.
      </div>
    </div>
    ${card("Designated Individual", `
      <div class="field-grid two">
        ${field("securityOfficerName", "Security Officer Name", "text", "", "Full name")}
        ${field("securityOfficerTitle", "Title / Role", "text", "", "e.g., Owner, Managing Partner")}
        ${field("securityOfficerEmail", "Security Officer Email", "email")}
        ${field("securityOfficerPhone", "Security Officer Phone", "tel")}
      </div>
    `)}
    ${footer("Continue")}
  `;
}

function accessScreen() {
  const showMfa = ["Yes, on all systems", "Yes, on some systems"].includes(state.form.mfaStatus);
  return `
    ${screenHeader("Access & Protection", "These questions assess whether client data is protected from unauthorized access.")}
    <div class="card-grid">
      ${accessRosterCard()}
      ${card("Multi-Factor Authentication", `
        ${radioGroup("mfaStatus", "When you log into email, tax software, or cloud storage, do you use a second verification step in addition to your password?", options.mfa, "MFA means a second step after your password, such as a text code, authenticator app, or security key. The IRS requires this extra step for all tax preparers.", "two")}
        <div class="conditional ${showMfa ? "is-visible" : ""}">
          ${field("mfaMethod", "What MFA method?", "text", "Examples: text message, authenticator app, security key.", "e.g., authenticator app", true)}
        </div>
      `)}
      ${card("Passwords", radioGroup("passwordPolicy", "Do you have a password policy?", options.password, "", "three"))}
      ${card("Client Data Protection", radioGroup("dataProtection", "Is your client data protected so that only authorized people can read it?", options.dataProtection, "Choose ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œI don't knowÃƒÂ¢Ã¢â€šÂ¬Ã‚Â if you are unsure. The results will identify this as an item to confirm.", "two"))}
    </div>
    ${footer("Continue")}
  `;
}

function accessRosterCard() {
  const people = [
    ...state.form.teamMembers.map((person, index) => ({ ...person, type: "Team member", key: `team-${index}` })),
    ...state.form.contractors.map((person, index) => ({ ...person, type: "Contractor", key: `contractor-${index}` })),
  ];

  const body = people.length
    ? `
      <div class="access-table">
        <div class="access-table-head">
          <span>Name</span>
          <span>Remote Access</span>
          <span>Access Role to Data</span>
        </div>
        ${people
          .map((person) => {
            const name = `${person.first || "Unnamed"} ${person.last || ""}`.trim();
            return `
              <div class="access-table-row">
                <label class="access-name">
                  <input type="checkbox" checked disabled />
                  <span>
                    <strong>${escapeHtml(name)}</strong>
                    <small>${escapeHtml(person.type)}</small>
                  </span>
                </label>
                <span class="access-pill">${escapeHtml(person.remote || "Not set")}</span>
                <span class="access-pill wide">${escapeHtml(person.role || "Access role not set")}</span>
              </div>
            `;
          })
          .join("")}
      </div>
    `
    : `
      <div class="access-empty">
        <p>No team members or contractors have been added yet.</p>
      </div>
    `;

  return card(
    "Who has access to client tax data?",
    `
      ${body}
      <button class="access-add-link" type="button" data-action="add-access-person">+ Add person with access</button>
    `,
    "Select who has access to tax data and assign their role. Use + to add anyone missed in the previous step.",
  );
}

function physicalScreen() {
  return `
    ${screenHeader("Physical Environment", "These questions assess basic physical safeguards around offices, visitors, and devices.")}
    <div class="card-grid">
      ${card("Office Setup", radioGroup("officeType", "What type of office do you have?", options.office, "", "two"))}
      ${card("Facility Safeguards", `
        <div class="field-grid">
          <div class="field"><span class="label">Do you have a security alarm system? *</span>${segmented("alarm", ["Yes", "No"])}</div>
          <div class="field"><span class="label">Do you have secure locks on doors? *</span>${segmented("locks", ["Yes", "No"])}</div>
          ${radioGroup("visitorPolicy", "Do you have a visitor sign-in policy?", options.visitor, "", "two")}
        </div>
      `)}
      ${card("Device Disposal", radioGroup("deviceDisposal", "How do you dispose of old computers and devices?", options.disposal, "Choose the method your firm currently uses most often.", "two"))}
    </div>
    ${footer("Continue")}
  `;
}

function policiesScreen() {
  return `
    ${screenHeader("Policies & Readiness", "These questions assess whether your firm is prepared to handle incidents, records, training, and outside support.")}
    <div class="card-grid two-col">
      ${card("Incident Readiness", `
        <div class="field-grid">
          ${radioGroup("breachHistory", "Have you ever experienced a data breach or suspicious activity?", options.breach, "", "three")}
          ${radioGroup("incidentPlan", "Do you have a documented incident response plan?", options.incident, "A documented plan describes who responds, what steps are taken, and who must be contacted.")}
        </div>
      `)}
      ${card("Records", `
        <div class="field-grid">
          ${select("recordYears", "How many years do you keep client records?", options.years)}
          ${select("recordDisposal", "How do you dispose of old client records?", options.records)}
        </div>
      `)}
      ${card("Training & Support", `
        <div class="field-grid">
          ${radioGroup("securityTraining", "Have you completed security awareness training?", options.training)}
          <div class="field"><span class="label">Do you have IT support? *</span>${segmented("itSupport", ["Yes", "No"])}</div>
        </div>
      `)}
      ${card("Other Vendors", textarea("otherVendors", "List any other third-party vendors with access to client data", "Include IT providers, cloud services, payroll platforms, outsourced bookkeeping, or other firms with client-data access."))}
    </div>
    ${footer("Review Answers")}
  `;
}

function riskSaveStateLabel() {
  if (state.riskDraftStatus === "saving" || state.riskDraftStatus === "pending") return "Saving changes...";
  if (state.riskDraftStatus === "error") return "Saved locally, cloud sync failed";
  if (state.riskDraftSavedAt) return "All changes saved";
  return "Changes save automatically";
}

function footer(primary) {
  return `
    <div class="footer-actions">
      <button class="btn secondary" data-action="back" type="button">Back</button>
      <div class="action-cluster">
        <span class="save-state"><span class="save-dot"></span> ${riskSaveStateLabel()}</span>
        <button class="btn primary" data-action="next" type="button">${primary}</button>
      </div>
    </div>
  `;
}

function reviewScreen() {
  const attention = getFlags();
  const readyToScore = attention.length === 0;
  return shell(`
    ${screenHeader("Review your answers", "Confirm your information before generating your readiness results.", "Review")}
    <section class="review-overview-card ${readyToScore ? "is-ready" : "is-attention"}">
      <div class="review-overview-copy">
        <p class="review-overview-kicker">Assessment Status</p>
        <h3>${readyToScore ? "Your assessment is ready for scoring" : "A few answers should be reviewed before scoring"}</h3>
        <p>Review status: ${sections.length} sections complete. ${attention.length} item${attention.length === 1 ? "" : "s"} may need attention in your results.</p>
        <div class="review-overview-badges">
          <span class="badge ${readyToScore ? "complete" : "attention"}">${readyToScore ? "No required fields missing" : `${attention.length} area${attention.length === 1 ? "" : "s"} flagged for review`}</span>
        </div>
      </div>
      <div class="review-overview-metrics">
        ${reviewOverviewMetric(String(sections.length).padStart(2, "0"), "Sections reviewed")}
        ${reviewOverviewMetric(String(attention.length).padStart(2, "0"), "Priority flags")}
        ${reviewOverviewMetric(readyToScore ? "Ready" : "Review", "Scoring status")}
      </div>
    </section>
    <div class="review-grid">
      ${sections.map((section, index) => reviewCard(section, index, attention)).join("")}
    </div>
    <div class="footer-actions review-footer-actions">
      <button class="btn secondary" data-action="back-to-last" type="button">Back</button>
      <div class="action-cluster">
        <span class="save-state"><span class="save-dot"></span> ${riskSaveStateLabel()}</span>
        <button class="btn primary" data-action="results" type="button">Generate Results</button>
      </div>
    </div>
  `, true);
}

function reviewOverviewMetric(value, label) {
  return `
    <div class="review-overview-metric">
      <strong>${value}</strong>
      <span>${label}</span>
    </div>
  `;
}

function reviewCard(title, index, attention = getFlags()) {
  const sectionFlags = attention.filter((flag) => flag.sectionIndex === index);
  const rows = reviewRows(index);
  const isPractice = index === 0;
  const item = isPractice ? null : assessmentQuestions[index - 1];
  return `
    <section class="review-card ${sectionFlags.length ? "is-attention" : ""} ${isPractice ? "is-practice" : ""}">
      <div class="review-card-head">
        <div class="review-card-head-main">
          <p class="review-card-kicker">${isPractice ? "Practice Details" : `${item.domain} &middot; Section ${String(index).padStart(2, "0")}`}</p>
          <h3>${title}</h3>
          <p class="review-card-subtext">${isPractice ? "Confirm the core firm profile that anchors the assessment and generated recommendations." : escapeHtml(item.question)}</p>
        </div>
        <div class="review-card-head-actions">
          ${sectionFlags.length ? `<span class="badge attention">Needs attention</span>` : `<span class="badge complete">Complete</span>`}
          <button class="btn secondary small" data-edit-section="${index}" type="button">Edit</button>
        </div>
      </div>
      <div class="review-items ${isPractice ? "is-practice" : ""}">
        ${rows.map(([label, value]) => reviewRowMarkup(label, value)).join("")}
      </div>
    </section>
  `;
}

function reviewRowMarkup(label, value) {
  const formatted = formatValue(value);
  const isEmpty = formatted === "Not provided";
  const rowClass = label === "Selected Answer" ? "review-row is-answer" : label === "Domain" ? "review-row is-domain" : "review-row";
  return `
    <div class="${rowClass}">
      <span class="review-label">${label}</span>
      <span class="review-value ${isEmpty ? "is-empty" : ""}">${escapeHtml(formatted)}</span>
    </div>
  `;
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

  return [
    ["Selected Answer", form[`question_${index}`]],
  ];
}

function formatValue(value) {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not provided";
  return value || "Not provided";
}

function resultsScreen() {
  const result = scoreAssessment();
  const domainSummary = summarizeDomainReadiness(result.sectionScores);
  const exposurePoints = topExposurePoints(result.flags);
  return shell(`
    <div class="screen-head">
      <div>
        <p class="eyebrow">Assessment Report</p>
        <h1>WISP readiness report</h1>
        <p class="lead">Prepared from the questionnaire answers submitted for this firm. Scores indicate readiness signals and items to review, not certification.</p>
      </div>
      <span class="section-step-pill">Completed</span>
    </div>
    <div class="results">
      <section class="results-hero ${severityClass(result.label)}">
        <div class="results-hero-score">
          <div class="results-hero-score-value">${result.overall}</div>
          <div class="results-hero-score-meta">Readiness score / 100</div>
          <span class="severity ${severityClass(result.label)}">${result.label}</span>
        </div>
        <div class="results-hero-copy">
          <p class="results-hero-kicker">Assessment posture</p>
          <h2>${resultsAlertHeading(result)}</h2>
          <p>${resultsUrgencyCopy(result)}</p>
          <div class="results-hero-tags">
            <span class="results-hero-tag">${result.flags.length} review signal${result.flags.length === 1 ? "" : "s"} surfaced</span>
            <span class="results-hero-tag">Primary exposure: ${result.topArea}</span>
            <span class="results-hero-tag">${result.sectionScores.length - 1} security sections scored</span>
          </div>
        </div>
      </section>

      <section class="results-alert-band ${severityClass(result.label)}">
        <div class="results-alert-band-head">
          <h3>What this means operationally</h3>
          <span class="results-alert-pill">Needs leadership review</span>
        </div>
        <div class="results-alert-list">
          ${exposurePoints.map((item) => `<div class="results-alert-item">${item}</div>`).join("")}
        </div>
      </section>

      <section class="card pad results-domain-section">
        <div class="card-head">
          <div class="card-title-block">
            <h3>Risk by control area</h3>
            <p>These grouped scores show where gaps are clustering across the assessment.</p>
          </div>
        </div>
        <div class="results-domain-grid">
          ${domainSummary.map((domain) => resultsDomainCard(domain)).join("")}
        </div>
      </section>

      <div class="kpi-grid">
        <section class="card pad results-overview-card">
          <div class="card-title-block">
            <h3>Executive summary</h3>
            <p>${result.summary}</p>
          </div>
          <div class="score-number">${result.overall}<span>out of 100</span></div>
          <div class="results-overview-grid">
            <div class="results-finding">
              <span>Current rating</span>
              <strong>${result.label}</strong>
            </div>
            <div class="results-finding">
              <span>Weakest area</span>
              <strong>${result.topArea}</strong>
            </div>
            <div class="results-finding">
              <span>Items to review</span>
              <strong>${result.flags.length}</strong>
            </div>
          </div>
        </section>
        <section class="card pad">
          <div class="card-title-block">
            <h3>Assessment findings</h3>
            <p>Key review points surfaced by current answers.</p>
          </div>
          <div class="risk-list">
            <div class="risk-row"><span>Urgency level</span><strong>${result.label}</strong></div>
            <div class="risk-row"><span>Highest priority area</span><strong>${result.topArea}</strong></div>
            <div class="risk-row"><span>Immediate items</span><strong>${result.flags.filter((flag) => flag.priority === "Immediate").length}</strong></div>
            <div class="risk-row"><span>Leadership takeaway</span><strong>${result.overall < 55 ? "Operational exposure is material" : result.overall < 75 ? "Several safeguards need formalization" : "Core controls are trending in the right direction"}</strong></div>
          </div>
        </section>
      </div>

      <section class="card pad results-readiness-card">
        <div class="card-head">
          <div class="card-title-block">
            <h3>Section readiness</h3>
            <p>Scores map directly to the current 21 assessment sections.</p>
          </div>
        </div>
        <div class="score-table">
          ${result.sectionScores
            .map(
              (row) => `
              <div class="score-row">
                <strong>${row.name}</strong>
                <div class="bar ${row.score < 55 ? "risk" : row.score < 75 ? "warn" : ""}"><span style="width:${row.score}%"></span></div>
                <span class="severity ${row.score < 55 ? "high" : row.score < 75 ? "medium" : "good"}">${row.score} &middot; ${scoreLabel(row.score)}</span>
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
              <h3>Priority findings</h3>
              <p>The answers below create the strongest drag on readiness and should be addressed first.</p>
            </div>
          </div>
          <div class="weakness-list">
            ${result.flags
              .slice(0, 5)
              .map(
                (flag, index) => `
                <div class="weakness ${flag.priority === "Immediate" ? "is-immediate" : ""}">
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
              <h3>Prioritized recommendations</h3>
              <p>Use this sequence to reduce exposure without losing momentum.</p>
            </div>
          </div>
          ${recommendationBlock("Immediate", result.recommendations.immediate, "Controls in this group are the most likely to shape near-term exposure if left unresolved.")}
          ${recommendationBlock("Within 30 Days", result.recommendations.thirty, "These are the process and documentation gaps that should be tightened once urgent controls are addressed.")}
          ${recommendationBlock("Within 90 Days", result.recommendations.ninety, "Formalize the remaining safeguards so your stronger answers become standard operating practice.")}
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
  `, true);
}

function resultsAlertHeading(result) {
  if (result.overall < 40) return "Your current safeguards leave meaningful operational exposure across client data, access, and recovery controls.";
  if (result.overall < 60) return "Several core controls need immediate follow-through before this environment can be treated as reliably protected.";
  if (result.overall < 75) return "The environment shows progress, but too many safeguards still depend on partial coverage or undocumented practice.";
  return "The environment is trending in the right direction, but a few remaining gaps should still be documented and tightened.";
}

function resultsUrgencyCopy(result) {
  if (result.overall < 40) return "If one weak control fails during tax season, the surrounding gaps can compound quickly across firm operations, client trust, and recovery time. This is the stage where leadership should treat missing safeguards as business risk, not just IT cleanup.";
  if (result.overall < 60) return "The firm already has some safeguards in place, but the answers still point to control areas where inconsistent enforcement or missing documentation could create avoidable disruption under pressure.";
  if (result.overall < 75) return "This is a workable foundation, but the current state still relies on too much operational memory. The next step is making your stronger answers repeatable, documented, and consistent across the firm.";
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
      const score = Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length);
      return {
        domain,
        score,
        label: scoreLabel(score),
      };
    })
    .sort((a, b) => a.score - b.score);
}

function resultsDomainCard(domain) {
  const tone = domain.score < 55 ? "is-critical" : domain.score < 75 ? "is-warning" : "";
  const barTone = domain.score < 55 ? "risk" : domain.score < 75 ? "warn" : "";
  return `
    <article class="results-domain-card ${tone}">
      <div class="results-domain-head">
        <div>
          <div class="results-domain-kicker">Control area</div>
          <strong>${domain.score}<span>/100</span></strong>
        </div>
        <span class="severity ${domain.score < 55 ? "high" : domain.score < 75 ? "medium" : "good"}">${domain.label}</span>
      </div>
      <h4>${domain.domain}</h4>
      <p class="results-domain-copy">${domain.score < 55 ? "This area is currently increasing risk and should be reviewed first." : domain.score < 75 ? "Coverage exists here, but it still depends on inconsistent or incomplete controls." : "This area is showing stronger answers and can serve as a baseline for the rest of the program."}</p>
      <div class="results-domain-bar ${barTone}"><span style="width:${domain.score}%"></span></div>
    </article>
  `;
}

function topExposurePoints(flags) {
  const byArea = {
    "Data Security": "Sensitive client records may still be too exposed if file access, security policy, or device safeguards are inconsistent.",
    "Backup & Recovery": "A disruption during tax season could become a business continuity issue if backup routines and restore discipline are not reliable.",
    "Tax Software & Cloud": "Weaknesses around hosting and software availability can quickly turn into client-service delays when deadlines tighten.",
    "Email & Access": "Incomplete MFA, remote access, or email controls increase the chance that a single compromised account affects the wider firm.",
    "Device Management": "Unmanaged or aging workstations can create a larger attack surface and make response slower when something goes wrong.",
    Compliance: "If safeguards are not documented and enforced, the firm can look less prepared than leadership expects during a client or regulatory review.",
  };

  const mapped = [];
  flags.forEach((flag) => {
    const item = byArea[flag.area] || `${flag.area} still shows answer patterns that could leave the firm relying on informal controls under pressure.`;
    if (!mapped.includes(item)) mapped.push(item);
  });

  if (!mapped.length) {
    mapped.push("The submitted answers do not show any concentrated critical gaps, but the strongest controls should still be documented and reviewed on a regular cadence.");
  }

  return mapped.slice(0, 4);
}

function recommendationBlock(title, items, helper = "") {
  const labelClass = title === "Immediate" ? "high" : title.includes("30") ? "medium" : "good";
  return `
    <div class="recommendation" style="margin-bottom:12px">
      <div class="recommendation-head">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
          <h3>${title}</h3>
          <span class="severity ${labelClass} recommendation-label">${title}</span>
        </div>
        ${helper ? `<p>${helper}</p>` : ""}
      </div>
      <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>
  `;
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
  return `
    <div class="drawer-backdrop is-open">
      <aside class="drawer">
        <div class="card-head">
          <div class="card-title-block">
            <h2>${title}</h2>
            <p>${isVendor ? "Add the business name for vendors with client-data access." : "Add access details for people who handle client data."}</p>
          </div>
          <button class="btn ghost small" data-action="close-drawer" type="button">Close</button>
        </div>
        <div class="drawer-body">
          ${
            isVendor
              ? `<label class="field"><span class="label">Business Name *</span><input class="input" data-drawer-field="name" value="${attr(item.name || "")}" /></label>`
              : `
                <div class="field-grid two">
                  <label class="field"><span class="label">First *</span><input class="input" data-drawer-field="first" value="${attr(item.first || "")}" /></label>
                  <label class="field"><span class="label">Last *</span><input class="input" data-drawer-field="last" value="${attr(item.last || "")}" /></label>
                </div>
                <label class="field"><span class="label">Email <span class="optional">Optional</span></span><input class="input" type="email" data-drawer-field="email" value="${attr(item.email || "")}" /></label>
                <label class="field"><span class="label">Phone <span class="optional">Optional</span></span><input class="input" type="tel" data-drawer-field="phone" value="${attr(item.phone || "")}" /></label>
                <label class="field"><span class="label">Access Role to Data *</span><select class="select" data-drawer-field="role"><option value="">Access Role to Data...</option>${options.roles.map((choice) => `<option value="${attr(choice)}" ${item.role === choice ? "selected" : ""}>${choice}</option>`).join("")}</select></label>
                <label class="field"><span class="label">Work location *</span><select class="select" data-drawer-field="location"><option value="">Work location...</option>${options.locations.map((choice) => `<option value="${attr(choice)}" ${item.location === choice ? "selected" : ""}>${choice}</option>`).join("")}</select></label>
                <div class="field"><span class="label">Remote Access *</span><div class="segmented" data-drawer-segmented="remote"><button class="segment ${item.remote === "Yes" ? "is-active" : ""}" data-value="Yes" type="button">Yes</button><button class="segment ${item.remote === "No" ? "is-active" : ""}" data-value="No" type="button">No</button></div></div>
              `
          }
        </div>
        <div class="drawer-footer">
          <button class="btn secondary" data-action="close-drawer" type="button">Cancel</button>
          <button class="btn primary" data-action="save-drawer" type="button">${isVendor ? "Save Vendor" : "Save Person"}</button>
        </div>
      </aside>
    </div>
  `;
}

function renderAssessmentInPlace() {
  const workspace = document.querySelector(".workspace");
  const railHost = workspace?.querySelector(".progress-rail");
  const contentInner = workspace?.querySelector(".content-inner.assessment-flow");
  if (!workspace || !railHost || !contentInner) return false;

  railHost.outerHTML = progressRail();

  const nextContentInner = document.querySelector(".workspace .content-inner.assessment-flow");
  if (!nextContentInner) return false;
  nextContentInner.innerHTML = assessmentStepContent();

  const contentShell = document.querySelector(".workspace .content");
  if (contentShell?.scrollTo) contentShell.scrollTo({ top: 0, left: 0, behavior: "auto" });

  bindEvents();
  lastRenderedScreen = state.screen;
  return true;
}

async function handleAuthSubmit() {
  const email = String(state.authEmail || "").trim();
  if (!email) {
    state.authError = "Enter the work email tied to your firm membership.";
    state.authNotice = "";
    render();
    return;
  }

  state.authBusy = true;
  state.authError = "";
  state.authNotice = "";
  render();

  try {
    await signInWithMagicLink(email);
    state.authNotice = `Magic link sent to ${email}. Open it in this browser to finish signing in.`;
  } catch (error) {
    state.authError = error?.message || "We could not start the sign-in flow.";
  } finally {
    state.authBusy = false;
    render();
  }
}

function render() {
  if (state.authAvailable && !state.authReady) {
    app.innerHTML = `<div class="app"><main class="auth-shell"><section class="auth-card auth-card-loading"><p>Checking your workspace session...</p></section></main></div>`;
    lastRenderedScreen = null;
    return;
  }

  if (state.authAvailable && !state.authUser) {
    app.innerHTML = `<div class="app auth-app">${authScreen()}</div>`;
    bindEvents();
    lastRenderedScreen = null;
    return;
  }

  if (state.screen === "assessment" && lastRenderedScreen === "assessment" && !state.drawer && renderAssessmentInPlace()) {
    return;
  }

  const body =
    state.screen === "home"
      ? homeScreen()
      : state.screen === "welcome"
        ? welcomeScreen()
        : state.screen === "builder"
          ? builderScreen()
          : state.screen === "documents"
            ? documentsScreen()
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
  app.innerHTML = `
    <div class="app">
      <div class="shell app-shell">
        ${appNav()}
        <div class="main-shell">
          ${topbar()}
          ${body}
        </div>
      </div>
    </div>
    ${drawer()}
  `;
  applyMotionStagger();
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
        state.authError = "";
        render();
      }
    });
  });

  upgradeBuilderEditors();

  document.querySelectorAll("[data-field]").forEach((element) => {
    const handler = (event) => {
      softUpdateField(event.target.dataset.field, event.target.value, event.target);
    };
    element.addEventListener("input", handler);
    element.addEventListener("change", handler);
  });

  document.querySelectorAll("[data-radio]").forEach((element) => {
    element.addEventListener("change", (event) => {
      const fieldName = event.target.dataset.radio;
      if (fieldName === "mfaStatus") toggleMfaMethodField(event.target.value, event.target);
      else softUpdateOption(fieldName, event.target.value, event.target);
    });
  });

  document.querySelectorAll("[data-checkbox]").forEach((element) => {
    element.addEventListener("change", (event) => softToggleArray(event.target.dataset.checkbox, event.target.value, event.target));
  });

  document.querySelectorAll("[data-segmented]").forEach((group) => {
    group.querySelectorAll(".segment").forEach((button) => {
      button.addEventListener("click", () => {
        group.querySelectorAll(".segment").forEach((segment) => segment.classList.remove("is-active"));
        button.classList.add("is-active");
        softUpdateOption(group.dataset.segmented, button.dataset.value, group);
      });
    });
  });

  bindActionButtons();

  document.querySelectorAll("[data-training-search]").forEach((input) => {
    input.addEventListener("input", (event) => {
      state.trainingQuery = event.target.value;
      render();
    });
  });

  document.querySelectorAll("[data-training-asset-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const groupKey = button.dataset.trainingGroup;
      const index = Number(button.dataset.trainingIndex);
      const action = button.dataset.trainingAssetAction;
      if (action === "view") openTrainingAssetPreview(groupKey, index);
      else if (action === "download") downloadTrainingAsset(groupKey, index);
      else if (action === "primary") {
        const item = state.trainingAssets?.[groupKey]?.[index];
        const previewTarget = String(item?.filename || resolveTrainingAssetUrl(item) || "").toLowerCase();
        if (previewTarget.endsWith('.pdf')) openTrainingAssetPreview(groupKey, index);
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

  document.querySelectorAll("[data-user-action]").forEach((button) => {
    button.addEventListener("click", () => {
      handleSettingsUserAction(button.dataset.userId, button.dataset.userAction);
    });
  });

  document.querySelectorAll("[data-staff-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      handleStaffRemove(button.dataset.staffRemove);
    });
  });

  document.querySelectorAll("[data-builder-status-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.builderTab = button.dataset.builderStatusTab;
      state.builderResumeEditing = false;
      render();
    });
  });

  document.querySelectorAll("[data-download-wisp-version]").forEach((button) => {
    button.addEventListener("click", () => downloadStoredWispFile(state.wispVersions[Number(button.dataset.downloadWispVersion)]));
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
    button.addEventListener("click", () => {
      clearCompanyLogo();
    });
  });

  document.querySelectorAll("[data-builder-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      state.builderTopicIndex = Number(button.dataset.builderTopic);
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
      state.builderDrafts[event.target.dataset.builderEditor] = event.target.innerHTML;
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
    button.addEventListener("click", () => handleBuilderEditorCommand(button.dataset.editorId, button.dataset.editorCommand));
  });

  document.querySelectorAll("[data-editor-style]").forEach((selectElement) => {
    selectElement.addEventListener("mousedown", (event) => event.stopPropagation());
    selectElement.addEventListener("change", () => handleBuilderEditorStyle(selectElement.dataset.editorStyle, selectElement.value));
  });

  document.querySelectorAll("[data-editor-action='link']").forEach((button) => {
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", () => openBuilderLinkPopover(button.dataset.editorId));
  });

  document.querySelectorAll("[data-editor-link-apply]").forEach((button) => {
    button.addEventListener("click", () => applyBuilderLink(button.dataset.editorLinkApply));
  });

  document.querySelectorAll("[data-editor-link-remove]").forEach((button) => {
    button.addEventListener("click", () => removeBuilderLink(button.dataset.editorLinkRemove));
  });

  document.querySelectorAll("[data-editor-link-cancel]").forEach((button) => {
    button.addEventListener("click", () => closeBuilderLinkPopover(button.dataset.editorLinkCancel));
  });

  document.querySelectorAll("[data-editor-link-url], [data-editor-link-text]").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const editorId = input.dataset.editorLinkUrl || input.dataset.editorLinkText;
        applyBuilderLink(editorId);
      }
      if (event.key === "Escape") {
        event.preventDefault();
        const editorId = input.dataset.editorLinkUrl || input.dataset.editorLinkText;
        closeBuilderLinkPopover(editorId);
      }
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest(".builder-link-popover") || target.closest("[data-editor-action='link']")) return;
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
    button.addEventListener("click", () => {
      state.builderAttachments.splice(Number(button.dataset.removeAttachment), 1);
      render();
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
    button.addEventListener("click", () => {
      if (state.screen === "assessment") setState({ sectionIndex: Number(button.dataset.jumpSection), section2Substep: 0, errors: {} });
    });
  });

  document.querySelectorAll("[data-jump-substep]").forEach((button) => {
    button.addEventListener("click", () => setState({ section2Substep: Number(button.dataset.jumpSubstep), errors: {} }));
  });

  document.querySelectorAll("[data-add-entry]").forEach((button) => {
    button.addEventListener("click", () => setState({ drawer: { key: button.dataset.addEntry, index: null, draft: {} } }));
  });

  document.querySelectorAll("[data-edit-entry]").forEach((button) => {
    button.addEventListener("click", () => {
      const [key, index] = button.dataset.editEntry.split(":");
      setState({ drawer: { key, index: Number(index), draft: { ...state.form[key][Number(index)] } } });
    });
  });

  document.querySelectorAll("[data-remove-entry]").forEach((button) => {
    button.addEventListener("click", () => {
      const [key, index] = button.dataset.removeEntry.split(":");
      if (!confirm("Remove this entry? This will remove it from the assessment.")) return;
      state.form[key].splice(Number(index), 1);
      render();
    });
  });

  document.querySelectorAll("[data-edit-section]").forEach((button) => {
    button.addEventListener("click", () => setState({ screen: "assessment", sectionIndex: Number(button.dataset.editSection), section2Substep: 0, errors: {} }));
  });

  document.querySelectorAll("[data-documents-upload]").forEach((input) => {
    input.addEventListener("change", async (event) => {
      await addDocumentsFiles(event.target.files);
      event.target.value = "";
    });
  });

  document.querySelectorAll("[data-open-document]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.openDocument);
      openStoredDocument(state.documentsFiles[index]);
    });
  });

  document.querySelectorAll("[data-download-document]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.downloadDocument);
      downloadStoredDocument(state.documentsFiles[index]);
    });
  });

  document.querySelectorAll("[data-remove-document]").forEach((button) => {
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.removeDocument);
      const record = state.documentsFiles[index];
      state.documentsFiles.splice(index, 1);
      if (state.dashboardData) {
        state.dashboardData = {
          ...state.dashboardData,
          documents_count: Math.max(0, (state.dashboardData.documents_count || state.documentsFiles.length + 1) - 1),
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
    element.addEventListener("click", () => openDocumentWorkspace(element.dataset.openTemplate));
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDocumentWorkspace(element.dataset.openTemplate);
      }
    });
  });

  document.querySelectorAll("[data-open-workspace]").forEach((button) => {
    button.addEventListener("click", () => openDocumentWorkspace(button.dataset.openWorkspace));
  });

  document.querySelectorAll("[data-remove-workspace]").forEach((button) => {
    button.addEventListener("click", () => removeDocumentWorkspace(button.dataset.removeWorkspace));
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
      const heading = document.querySelector(".documents-editor-header .documents-header-copy h1");
      if (heading) heading.textContent = nextTitle;
    });
  });

  document.querySelectorAll("[data-doc-column]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const columnIndex = Number(event.target.dataset.docColumn);
      updateDocumentWorkspace(
        (workspace) => {
          workspace.columns[columnIndex] = event.target.value || ("Column " + (columnIndex + 1));
        },
        { render: false },
      );
    });
  });

  document.querySelectorAll("[data-doc-cell]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const [rowIndex, columnIndex] = String(event.target.dataset.docCell).split(":").map(Number);
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
    button.addEventListener("click", () => {
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
    button.addEventListener("click", () => {
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
    button.addEventListener("click", () => {
      updateDocumentWorkspace((workspace) => {
        workspace.rows.push(workspace.columns.map(() => ""));
      });
    });
  });

  document.querySelectorAll("[data-doc-add-column]").forEach((button) => {
    button.addEventListener("click", () => {
      updateDocumentWorkspace((workspace) => {
        const nextColumnIndex = workspace.columns.length;
        workspace.columns.push("New Column " + (nextColumnIndex + 1));
        workspace.rows = workspace.rows.map((row) => [...row, ""]);
        if (state.documentEditor) state.documentEditor.scrollColumnIndex = nextColumnIndex;
      });
    });
  });

  scrollDocumentEditorToPendingColumn();
  bindDrawerEvents();
}

function addBuilderAttachments(fileList) {
  if (!fileList?.length) return;
  [...fileList].forEach((file) => {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) return;
    if (file.size > 2 * 1024 * 1024) return;
    state.builderAttachments.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      sizeLabel: formatAttachmentSize(file.size),
      type: file.type || "application/pdf",
    });
  });
  render();
}

function reorderBuilderAttachments(fromIndex, toIndex) {
  if (Number.isNaN(fromIndex) || Number.isNaN(toIndex) || fromIndex === toIndex) return;
  const [moved] = state.builderAttachments.splice(fromIndex, 1);
  if (!moved) return;
  state.builderAttachments.splice(toIndex, 0, moved);
  render();
}

function formatDashboardDate(value) {
  if (!value) return "Nov 11, 2025";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatAttachmentSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

async function addDocumentsFiles(fileList) {
  if (!fileList?.length) return;
  try {
    const uploaded = await uploadDocuments([...fileList]);
    if (uploaded.length) {
      state.documentsFiles = [...uploaded, ...state.documentsFiles];
    } else {
      [...fileList].forEach((file) => {
        state.documentsFiles.push({
          id: `1782286774782-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          sizeLabel: formatAttachmentSize(file.size),
          type: file.type || "application/octet-stream",
          createdAt: new Date().toISOString(),
        });
      });
    }
  } catch (error) {
    console.warn("Document upload fell back to local state", error);
    [...fileList].forEach((file) => {
      state.documentsFiles.push({
        id: `1782286774782-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        sizeLabel: formatAttachmentSize(file.size),
        type: file.type || "application/octet-stream",
        createdAt: new Date().toISOString(),
      });
    });
  }
  if (state.dashboardData) {
    state.dashboardData = {
      ...state.dashboardData,
      documents_count: state.documentsFiles.length,
      updated_at: new Date().toISOString(),
    };
  }
  render();
}

function removeDocumentWorkspace(templateId) {
  if (!state.documentWorkspaces[templateId]) return;
  delete state.documentWorkspaces[templateId];
  if (state.documentEditor?.templateId === templateId) {
    state.documentEditor = null;
    state.screen = "documents";
  }
  scheduleDocumentWorkspaceSync();
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
  const targetCell = document.querySelector(`[data-doc-index-cell="${pendingColumnIndex}"]`) || document.querySelector(`[data-doc-column="${pendingColumnIndex}"]`);
  if (!targetCell) return;
  targetCell.scrollIntoView({ block: "nearest", inline: "end", behavior: "smooth" });
  state.documentEditor.scrollColumnIndex = null;
}

function updateSettingsState(mutator, activity = "Settings Change", details = "Updated workspace settings") {
  state.settingsData = normalizeSettingsData(state.settingsData);
  mutator(state.settingsData);
  appendSettingsActivityLog(activity, details);
  scheduleSettingsSync();
  render();
}

function promptForValue(label, currentValue = "") {
  const nextValue = window.prompt(label, currentValue ?? "");
  if (nextValue == null) return null;
  return nextValue.trim();
}

function handleSettingsAction(action) {
  const settings = getSettingsData();
  if (action === "change-email") {
    const nextEmail = promptForValue("Enter the profile email address", settings.profile.email);
    if (!nextEmail) return;
    updateSettingsState((draft) => { draft.profile.email = nextEmail; }, "Profile Updated", `Profile email changed to ${nextEmail}`);
  }
  if (action === "update-password") {
    updateSettingsState((draft) => { draft.profile.passwordUpdatedAt = new Date().toISOString(); }, "Security Updated", "Password timestamp refreshed for the active profile");
  }
  if (action === "change-mfa") {
    const nextMethod = promptForValue("Enter the MFA method", settings.profile.mfaMethod);
    if (!nextMethod) return;
    updateSettingsState((draft) => {
      draft.profile.mfaEnabled = true;
      draft.profile.mfaMethod = nextMethod;
      draft.profile.mfaVerifiedOn = new Date().toISOString();
    }, "Security Updated", `MFA method changed to ${nextMethod}`);
  }
  if (action === "manage-sessions") {
    const nextNote = promptForValue("Update the active sessions note", settings.profile.sessionsNote);
    if (!nextNote) return;
    updateSettingsState((draft) => { draft.profile.sessionsNote = nextNote; }, "Security Updated", "Session management note updated");
  }
  if (action === "edit-profile") {
    const nextName = promptForValue("Enter your profile name", settings.profile.name);
    if (!nextName) return;
    updateSettingsState((draft) => { draft.profile.name = nextName; }, "Profile Updated", `Profile name changed to ${nextName}`);
  }
  if (action === "edit-company") {
    const nextAddress = promptForValue("Enter the company address", settings.company.address || formatCompanyAddress());
    if (nextAddress == null) return;
    const nextPhone = promptForValue("Enter the company phone number", settings.company.phone || state.form.officePhone || state.form.mobilePhone || "");
    if (nextPhone == null) return;
    const nextEmail = promptForValue("Enter the company email", settings.company.email || state.form.email || "");
    if (nextEmail == null) return;
    const nextFirmName = promptForValue("Enter the firm name", state.form.companyName || state.firmProfile?.name || "Current Fiscal LLC");
    if (!nextFirmName) return;
    state.form.companyName = nextFirmName;
    state.firmProfile = { ...(state.firmProfile || {}), name: nextFirmName, email: nextEmail };
    updateSettingsState((draft) => {
      draft.company.address = nextAddress;
      draft.company.phone = nextPhone;
      draft.company.email = nextEmail;
    }, "Settings Change", "Company profile details updated");
  }
  if (action === "edit-billing") {
    const nextContact = promptForValue("Enter the billing contact email", settings.billing.billingContact);
    if (nextContact == null) return;
    const nextAddress = promptForValue("Enter the billing address", settings.billing.billingAddress);
    if (nextAddress == null) return;
    const nextMethod = promptForValue("Enter the payment method label", settings.billing.paymentMethod);
    if (nextMethod == null) return;
    updateSettingsState((draft) => {
      draft.billing.billingContact = nextContact;
      draft.billing.billingAddress = nextAddress;
      draft.billing.paymentMethod = nextMethod;
    }, "Billing Updated", "Billing contact and payment method updated");
  }
  if (action === "purchase-service") {
    const service = promptForValue("Enter the service to request", "WISP Assist Service");
    if (!service) return;
    appendSettingsActivityLog("Service Request", `Requested additional service: ${service}`);
    scheduleSettingsSync();
    render();
  }
  if (action === "learn-assist" || action === "learn-review") {
    const serviceName = action === "learn-assist" ? "WISP Assist Service" : "WISP Review Service";
    appendSettingsActivityLog("Service Viewed", `Viewed details for ${serviceName}`);
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
    const permission = promptForValue("Enter permission level (Basic, Manager, Administrator)", "Basic");
    if (!permission) return;
    updateSettingsState((draft) => {
      draft.users.unshift({
        id: `user-${Date.now()}`,
        firstName,
        lastName,
        email,
        permission,
        status: "Invited",
        actions: ["Resend Invitation", "Revoke Invitation"],
      });
      draft.billing.inviteSeatsRemaining = Math.max(0, Number(draft.billing.inviteSeatsRemaining || 0) - 1);
    }, "User Updated", `Invited ${firstName} ${lastName} (${email})`);
  }
  if (action === "add-staff") {
    const firstName = promptForValue("Enter staff first name", "");
    if (!firstName) return;
    const lastName = promptForValue("Enter staff last name", "");
    if (lastName == null) return;
    const email = promptForValue("Enter staff email", "");
    if (!email) return;
    const title = promptForValue("Enter staff title", "Reviewer");
    if (title == null) return;
    const type = promptForValue("Enter staff type", "Employee");
    if (type == null) return;
    updateSettingsState((draft) => {
      draft.staff.unshift({ id: `staff-${Date.now()}`, firstName, lastName, email, title, type });
    }, "Staff Updated", `Added staff record for ${firstName} ${lastName}`);
  }
  if (action === "import-staff") {
    appendSettingsActivityLog("Staff Updated", "Staff import requested from the Settings tab");
    scheduleSettingsSync();
    render();
  }
  if (action === "export-logs") {
    downloadSettingsActivityLogs();
  }
}

function handleSettingsPlanSelection(planName) {
  const planMap = {
    "EasyWISP Core": 149,
    "EasyWISP Professional": 299,
    "EasyWISP Enterprise": 499,
  };
  updateSettingsState((draft) => {
    draft.billing.planName = planName;
    draft.billing.priceMonthly = planMap[planName] || draft.billing.priceMonthly;
    draft.billing.status = "Active";
  }, "Billing Updated", `Subscription changed to ${planName}`);
  state.showPlanModal = false;
  render();
}

function handleSettingsUserAction(userId, action) {
  if (!userId || !action) return;
  if (action === "Resend Invitation") {
    appendSettingsActivityLog("User Updated", `Resent invitation to user ${userId}`);
    scheduleSettingsSync();
    render();
    return;
  }
  if (action === "Revoke Invitation") {
    updateSettingsState((draft) => {
      draft.users = draft.users.filter((user) => user.id !== userId);
      draft.billing.inviteSeatsRemaining = Number(draft.billing.inviteSeatsRemaining || 0) + 1;
    }, "User Updated", `Revoked invitation for user ${userId}`);
  }
}

function handleStaffRemove(staffId) {
  if (!staffId) return;
  updateSettingsState((draft) => {
    draft.staff = draft.staff.filter((member) => member.id !== staffId);
  }, "Staff Updated", `Removed staff record ${staffId}`);
}

function downloadSettingsActivityLogs() {
  const settings = getSettingsData();
  const header = ["Activity", "User", "Details", "Date", "IP Address"];
  const rows = settings.activityLogs.map((row) => [row.activity, row.user, row.details, settingsDisplayDate(row.date), row.ip]);
  const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value || "").replaceAll('"', '""')}"`).join(",")).join("\n");
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
      state.drawer.draft = { ...(state.drawer.draft || {}), [event.target.dataset.drawerField]: event.target.value };
    });
    element.addEventListener("change", (event) => {
      state.drawer.draft = { ...(state.drawer.draft || {}), [event.target.dataset.drawerField]: event.target.value };
    });
  });

  document.querySelectorAll("[data-drawer-segmented]").forEach((group) => {
    group.querySelectorAll(".segment").forEach((button) => {
      button.addEventListener("click", () => {
        state.drawer.draft = { ...(state.drawer.draft || {}), remote: button.dataset.value };
        group.querySelectorAll(".segment").forEach((segment) => segment.classList.remove("is-active"));
        button.classList.add("is-active");
      });
    });
  });
}

function handleAction(action) {
  if (action === "start" || action === "resume") setState({ screen: "assessment", sectionIndex: 0, section2Substep: 0 });
  if (action === "open-builder") setState(getBuilderEditorEntryState());
  if (action === "go-home") setState({ screen: "home", builderSidebarOpen: false, errors: {} });
  if (action === "nav-home") setState({ screen: "home", builderSidebarOpen: false, errors: {} });
  if (action === "nav-risk") setState({ screen: "welcome", builderSidebarOpen: false, errors: {} });
  if (action === "nav-assessment-start") setState({ screen: "assessment-start", builderSidebarOpen: false, errors: {} });
  if (action === "nav-builder-home") setState(getBuilderOverviewState());
  if (action === "nav-builder") setState(getBuilderEditorEntryState());
  if (action === "nav-training") setState({ screen: "training", builderSidebarOpen: false, errors: {} });
  if (action === "close-training-preview") closeTrainingAssetPreview();
  if (action === "nav-documents") setState({ screen: "documents", builderSidebarOpen: false, errors: {} });
  if (action === "nav-settings") setState({ screen: "settings", builderSidebarOpen: false, errors: {} });
  if (action === "create-wisp") setState(getBuilderEditorEntryState());
  if (action === "continue-pending-wisp") setState({ builderTab: "pending", builderResumeEditing: true, builderLaunchAnimation: true, builderSidebarOpen: false, builderReviewLoading: false, builderReviewOpen: false, builderReviewPage: 0, builderTopicIndex: getSavedBuilderTopicIndex(), errors: {} });
  if (action === "review-builder-draft") {
    clearTimeout(builderDraftReviewTimer);
    setState({ builderReviewLoading: true, builderReviewOpen: false, builderReviewExpanded: false, builderReviewPage: 0, builderSidebarOpen: false, builderLaunchAnimation: false });
    requestBuilderMergedDocx()
      .then(() => {
        if (!state.builderMergePdfUrl) throw new Error("The branded WISP PDF preview is unavailable right now.");
        setState({ builderReviewLoading: false, builderReviewOpen: true, builderReviewExpanded: false, builderReviewPage: 0 });
      })
      .catch((error) => {
        console.warn("Builder merge request failed", error);
        setState({ builderReviewLoading: false, builderReviewOpen: false, builderReviewExpanded: false, builderReviewPage: 0 });
        alert(error?.message || "Unable to generate the branded WISP PDF preview right now.");
      });
  }  if (action === "close-builder-review") {
    clearTimeout(builderDraftReviewTimer);
    setState({ builderReviewLoading: false, builderReviewOpen: false, builderReviewExpanded: false, builderReviewPage: 0, builderSidebarOpen: false, builderTopicIndex: Math.max(0, builderTopics.findIndex((topic) => topic.id === "finalize")) });
  }
  if (action === "download-builder-review") {
    downloadBuilderReviewCopy().catch((error) => {
      console.warn("Builder review download failed", error);
      alert(error?.message || "Unable to download the WISP review file right now.");
    });
  }
  if (action === "download-current-wisp") downloadStoredWispFile(state.wispProject?.latest_generated_file);
  if (action === "finalize-builder-wisp") {
    finalizeBuilderWisp().catch((error) => {
      console.warn("Builder finalize failed", error);
      alert(error?.message || "Unable to finalize the WISP right now.");
    });
  }
  if (action === "download-builder-merge-payload") downloadBuilderMergePayload();
  if (action === "generate-builder-merged-docx") requestBuilderMergedDocx().catch((error) => console.warn("Builder merge request failed", error));
  if (action === "download-builder-merged-docx") downloadBuilderMergedDocx();
  if (action === "open-builder-review-expanded") setState({ builderReviewExpanded: true });
  if (action === "close-builder-review-expanded") setState({ builderReviewExpanded: false });
  if (action === "builder-review-prev") changeBuilderReviewPage(-1);
  if (action === "builder-review-next") changeBuilderReviewPage(1);
  if (action === "open-doc-upload") document.querySelector("[data-documents-upload]")?.click();
  if (action === "open-builder-sidebar") setState({ builderSidebarOpen: true });
  if (action === "close-builder-sidebar") setState({ builderSidebarOpen: false });
  if (action === "back") goBack();
  if (action === "next") goNext().catch((error) => { console.warn("Risk assessment navigation failed", error); alert(error?.message || "Unable to save your assessment right now."); });
  if (action === "back-to-last") setState({ screen: "assessment", sectionIndex: sections.length - 1, errors: {} });
  if (action === "results") setState({ screen: "results", errors: {} });
  if (action === "review") setState({ screen: "review", errors: {} });
  if (action === "view-summary") setState({ screen: "review", errors: {} });
  if (action === "add-access-person") setState({ screen: "assessment", sectionIndex: 3, section2Substep: 0, errors: {} });
  if (action === "close-drawer") setState({ drawer: null });
  if (action === "save-drawer") saveDrawer();
  if (action === "open-plan-modal") setState({ showPlanModal: true });
  if (action === "close-plan-modal") setState({ showPlanModal: false });
  if (action === "sign-out") {
    state.authBusy = true;
    render();
    signOutCurrentUser()
      .catch((error) => {
        state.authError = error?.message || "Unable to sign out right now.";
        state.authBusy = false;
        render();
      });
  }
}

function saveDrawer() {
  const { key, index, draft = {} } = state.drawer;
  const item = { ...(index !== null && index !== undefined ? state.form[key][index] : {}), ...draft };
  const required = key === "vendors" ? ["name"] : ["first", "last", "role", "location", "remote"];
  const missing = required.some((fieldName) => !item[fieldName]);
  if (missing) return alert("Complete the required fields before saving this entry.");
  if (index !== null && index !== undefined) state.form[key][index] = item;
  else state.form[key].push(item);
  setState({ drawer: null });
}

function goBack() {
  if (state.sectionIndex > 0) return setState({ sectionIndex: state.sectionIndex - 1, section2Substep: 0, errors: {} });
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
    return setState({ sectionIndex: state.sectionIndex + 1, section2Substep: 0, errors: {} });
  }
  await flushRiskDraftSync({ status: "completed", scoreSummary: scoreAssessment() });
  setState({ screen: "review", errors: {} });
}

function validateCurrent() {
  const errors = {};
  if (state.sectionIndex === 0) {
    ["companyName", "primaryContact", "practiceType", "staffSize", "taxSoftware", "itManagement"].forEach((fieldName) => {
      if (!state.form[fieldName]) errors[fieldName] = "This field is required.";
    });
  } else {
    const fieldName = `question_${state.sectionIndex}`;
    if (!state.form[fieldName]) errors[fieldName] = "Please select an answer before continuing.";
  }
  state.errors = errors;
  render();
  return Object.keys(errors).length === 0;
}

function getFlags() {
  const flags = [];
  const recommendationByDomain = {
    "Data Security": "Standardize secure document access, enforce MFA everywhere, and formalize the firm's written security program.",
    "Backup & Recovery": "Move to automated, isolated backups and test restore procedures on a recurring schedule.",
    "Tax Software & Cloud": "Harden the firm's tax software stack with resilient hosting, documented continuity steps, and managed business email.",
    "Remote Access": "Restrict remote access to managed devices and secure channels, then retire high-risk BYOD and aging endpoints.",
    Compliance: "Document required controls, complete the relevant IRS and FTC reviews, and make training part of routine operations.",
    "IT Support": "Shift from reactive support to documented, proactive IT operations with patching, offboarding, continuity, and renewal evidence.",
  };

  assessmentQuestions.forEach((item, index) => {
    const selected = item.options.find((option) => option.label === state.form[`question_${index + 1}`]);
    if (!selected) return;
    const maxScore = Math.max(...item.options.map((option) => option.score)) || 10;
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
      fix: recommendationByDomain[item.domain] || "Review and document the safeguards behind this answer.",
    });
  });

  return flags;
}

function scoreAssessment() {
  const flags = getFlags();
  const sectionScores = [{ name: sections[0], score: 100 }];

  assessmentQuestions.forEach((item, index) => {
    const selected = item.options.find((option) => option.label === state.form[`question_${index + 1}`]);
    const maxScore = Math.max(...item.options.map((option) => option.score)) || 10;
    const rawScore = selected ? selected.score : 0;
    const normalized = Math.round((rawScore / maxScore) * 100);
    sectionScores.push({ name: sections[index + 1], score: normalized });
  });

  const questionScores = sectionScores.slice(1).map((row) => row.score);
  const overall = questionScores.length ? Math.round(questionScores.reduce((sum, score) => sum + score, 0) / questionScores.length) : 0;
  const label = overall < 40 ? "High Risk" : overall < 60 ? "Needs Immediate Improvement" : overall < 75 ? "Developing" : overall < 90 ? "Mostly Prepared" : "Strong";
  const topArea = flags[0]?.area || "No high-priority area identified";
  const displayFlags = flags.length
    ? flags
    : [{ title: "No critical weaknesses detected", area: "Assessment-wide", priority: "90 days", fix: "Continue maintaining documented safeguards and review answers periodically." }];
  const weakest = [...sectionScores.slice(1)].sort((a, b) => a.score - b.score).slice(0, 3).map((row) => row.name);
  const immediateCount = flags.filter((flag) => flag.priority === "Immediate").length;

  return {
    overall,
    label,
    sectionScores,
    flags: displayFlags,
    topArea,
    recommendations: {
      immediate: recommendationItems(flags, "Immediate", ["Address the lowest-scoring questions first, especially around MFA, backup recovery, compliance, and patching."]),
      thirty: recommendationItems(flags, "30 days", ["Document repeatable operational controls for the answers that landed in the middle of the range."]),
      ninety: recommendationItems(flags, "90 days", ["Use the stronger answers as a baseline and formalize remaining process gaps across the environment."]),
    },
    summary: immediateCount
      ? `${immediateCount} immediate-priority item${immediateCount === 1 ? "" : "s"} surfaced from the imported CPA IT questions, led by ${weakest.slice(0, 2).join(" and ")}.`
      : overall < 75
        ? "Several safeguards are present, but the submitted answers show gaps that should be reviewed and documented."
        : "The submitted answers show a stronger readiness posture, with a smaller number of items to confirm or formalize.",
    narrative: "This report is based on the imported CPA IT assessment questions plus your practice details. Items marked as weaknesses should be reviewed, corrected where needed, and documented before treating the firm's safeguards as mature. This assessment is a readiness tool and does not constitute legal, tax, cybersecurity, or compliance certification.",
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
  const items = flags.filter((flag) => flag.priority === priority).map((flag) => flag.fix);
  return [...new Set(items)].slice(0, 4).concat(items.length ? [] : fallback);
}

window.addEventListener("pagehide", () => {
  if (buildRiskAnswerRows().length || state.form.companyName || state.form.primaryContact) {
    saveLocalRiskDraft();
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

bootstrapApp();









































































