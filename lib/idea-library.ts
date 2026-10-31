export interface DiscoveryIdea {
  id: string;
  name: string;
  category: string;
  problem: string;
  intendedUsers: string;
  proposedSolution: string;
  mvpFeatures: string[];
  differentiators: string[];
  revenueModels: string[];
  implementationComplexity: "Low" | "Medium" | "High";
  assumptionsToValidate: string[];
  tags: string[];
}

export const IDEA_CATEGORIES = [
  "All Categories",
  "AI and Machine Learning",
  "FinTech",
  "HealthTech",
  "EdTech",
  "Agriculture and AgriTech",
  "ClimateTech",
  "Cybersecurity",
  "Developer Tools",
  "Productivity",
  "E-commerce",
  "Logistics",
  "Accessibility",
  "Smart Cities",
  "Small Business Solutions",
  "Personal Finance",
] as const;

export const STARTER_IDEAS: DiscoveryIdea[] = [
  // 1. AI and Machine Learning
  {
    id: "ai-patent-copilot",
    name: "PatentLens AI",
    category: "AI and Machine Learning",
    problem: "Deep-tech startups spend $15,000–$40,000 on IP attorneys for early patentability searches that take 4 to 8 weeks, frequently finding prior art after significant legal expense.",
    intendedUsers: "Seed & Series A hardware, biotech, and software founders",
    proposedSolution: "A multimodal patent search & claims drafting engine that queries global USPTO, WIPO, and academic archives to identify prior art conflicts within 60 seconds.",
    mvpFeatures: [
      "Semantic similarity search across 120M+ patent claims",
      "Interactive 2D prior-art distance visualization matrix",
      "Draft claim generator with novelty score estimation",
      "Exportable attorney-ready disclosure report"
    ],
    differentiators: [
      "Sub-minute graph retrieval vs manual 30-day legal searches",
      "90% cheaper pre-filing validation with attorney-reviewed prompt guardrails"
    ],
    revenueModels: [
      "$149 per patent analysis dossier",
      "$499/mo unlimited IP monitoring for incubator portfolios"
    ],
    implementationComplexity: "Medium",
    assumptionsToValidate: [
      "IP attorneys and founders trust automated prior-art queries for preliminary diligence",
      "Founders are willing to pay out-of-pocket before retaining law firms"
    ],
    tags: ["IP", "LegalTech", "Search", "Patents"]
  },
  {
    id: "ai-contract-auditor",
    name: "ClauseGuard AI",
    category: "AI and Machine Learning",
    problem: "SMBs sign vendor and vendor SaaS agreements with predatory auto-renewal clauses, indemnification traps, and hidden liabilities due to lacking in-house legal counsel.",
    intendedUsers: "Non-technical small business owners, agency operators, and solo founders",
    proposedSolution: "An autonomous contract review bot that flags high-risk clauses in redline format, suggests balanced renegotiation language, and benchmarks payment terms against industry averages.",
    mvpFeatures: [
      "Instant PDF/Docx redlining of predatory liability clauses",
      "Risk severity scoring (Low, Moderate, Critical)",
      "One-click counter-proposal email drafting",
      "Renewal calendar tracking with 60-day cancellation alarms"
    ],
    differentiators: [
      "Zero legal jargon: explains risks in plain operational impact",
      "No enterprise sales cycle: self-serve Chrome extension + web uploader"
    ],
    revenueModels: [
      "$29/mo for up to 10 contract reviews",
      "$19 per single emergency audit"
    ],
    implementationComplexity: "Low",
    assumptionsToValidate: [
      "SMB operators will upload sensitive contracts to a secure cloud tool",
      "Automated counter-proposals successfully convince counter-parties"
    ],
    tags: ["Contracts", "SMB", "Risk", "NLP"]
  },

  // 2. FinTech
  {
    id: "fintech-micro-factoring",
    name: "FlowInvoice",
    category: "FinTech",
    problem: "Freelance developers and boutique design studios face 60 to 90-day client payment terms, causing acute working capital shortfalls and payroll crunches.",
    intendedUsers: "Independent contractors, freelancers, and small digital agencies ($5k–$50k/mo revenue)",
    proposedSolution: "Instant micro-factoring platform that advances 85% of verified B2B invoice value within 2 hours, funded through programmatic liquidity pools.",
    mvpFeatures: [
      "Stripe and QuickBooks automated invoice synchronization",
      "Instant algorithmic underwriting based on client credit history",
      "Same-day ACH payout mechanism",
      "Automated polite payment reminders to end-clients"
    ],
    differentiators: [
      "Zero personal credit checks; underwrites the paying corporate client",
      "Micro-ticket friendliness ($500 to $10,000 invoices rejected by traditional banks)"
    ],
    revenueModels: [
      "Flat 2.5% to 3.5% factoring fee per 30-day term",
      "Optional $19/mo premium invoicing & automated collections suite"
    ],
    implementationComplexity: "High",
    assumptionsToValidate: [
      "Default rates on verified corporate invoices remain below 1.8%",
      "Freelancers are willing to sacrifice 3% margin for instant liquidity"
    ],
    tags: ["Invoicing", "Cash Flow", "Freelancers", "Lending"]
  },

  // 3. HealthTech
  {
    id: "healthtech-clinical-notes",
    name: "PulseScribe",
    category: "HealthTech",
    problem: "Independent physicians and mental health clinicians spend 2.5 hours every day typing EHR notes, contributing to 62% provider burnout rates.",
    intendedUsers: "Private practice therapists, general practitioners, and allied health professionals",
    proposedSolution: "A HIPAA-compliant ambient voice copilot that records clinical consultations, extracts diagnostic criteria, and drafts structured SOAP notes in under 15 seconds.",
    mvpFeatures: [
      "HIPAA-compliant on-device & encrypted audio transcription",
      "Automatic DSM-5 / ICD-10 diagnostic code tagging",
      "One-click export into Epic, AthenaHealth, and SimplePractice",
      "Patient consent recording prompt & verification logging"
    ],
    differentiators: [
      "Engineered specifically for outpatient solo practices, not bulky hospital systems",
      "No dedicated hardware required; works on clinician's existing smartphone or laptop"
    ],
    revenueModels: [
      "$79/month per practitioner subscription",
      "$699/year annual billing with priority EHR connector support"
    ],
    implementationComplexity: "Medium",
    assumptionsToValidate: [
      "Patients readily consent to ambient AI note-taking in confidential therapy settings",
      "SOAP note accuracy satisfies insurance reimbursement audits"
    ],
    tags: ["HIPAA", "EHR", "Clinical", "Voice"]
  },

  // 4. EdTech
  {
    id: "edtech-adaptive-code",
    name: "CodeCoach Adaptive",
    category: "EdTech",
    problem: "Computer science students drop out of introductory coding courses at a 35% rate because standard tutorials fail to debug individual student mental models and logic traps.",
    intendedUsers: "University CS undergraduates, bootcamp learners, and self-taught software engineers",
    proposedSolution: "An intelligent interactive IDE plugin that analyzes compilation errors and student edit sequences to deliver Socratic debugging hints without spoiling answers.",
    mvpFeatures: [
      "Socratic debugging assistant that asks guiding questions",
      "Visual memory stack and pointer state diagrams",
      "Tailored micro-quizzes reinforcing specific misunderstood concepts",
      "Course syllabus alignment for instructors"
    ],
    differentiators: [
      "Promotes genuine learning retention over copy-pasting ChatGPT solutions",
      "Direct VS Code and web browser IDE integration"
    ],
    revenueModels: [
      "Freemium with $12/month Student Pro tier",
      "Institutional license at $8/student/semester for university departments"
    ],
    implementationComplexity: "Medium",
    assumptionsToValidate: [
      "Students value step-by-step Socratic guidance over instant AI answers",
      "Universities will adopt AI tools that prevent academic dishonesty"
    ],
    tags: ["Coding", "CS Education", "VS Code", "Adaptive Learning"]
  },

  // 5. Agriculture and AgriTech
  {
    id: "agritech-soil-satellite",
    name: "TerraScope",
    category: "Agriculture and AgriTech",
    problem: "Small-to-midscale farmers over-apply chemical nitrogen fertilizers by 28%, wasting money and degrading soil biology due to expensive lab soil tests.",
    intendedUsers: "Crop farmers (100–2,000 acres) and independent agronomists",
    proposedSolution: "Satellite multispectral imagery combined with local weather stations to generate field-level nitrogen and moisture maps, recommending precise variable-rate fertilizer schedules.",
    mvpFeatures: [
      "10-meter resolution NDVI and chlorophyll satellite index updates every 5 days",
      "Prescription fertilizer rate export compatible with John Deere / Trimble tractors",
      "Drought stress early warning notifications via SMS and WhatsApp",
      "Historic yield vs input correlation charts"
    ],
    differentiators: [
      "Zero hardware installation required on farm fields",
      "Works via simple SMS/WhatsApp alerts for rural areas with spotty 4G"
    ],
    revenueModels: [
      "$2.50 per acre per year subscription",
      "Co-op partner revenue share with fertilizer retailers"
    ],
    implementationComplexity: "High",
    assumptionsToValidate: [
      "Satellite resolution accurately reflects sub-surface soil nutrient deficiencies",
      "Farmers trust automated prescription maps without physical soil core validation"
    ],
    tags: ["Satellite", "Fertilizer", "Sustainable Agriculture", "Agronomy"]
  },

  // 6. ClimateTech
  {
    id: "climatetech-scope3-tracker",
    name: "CarbonTrace",
    category: "ClimateTech",
    problem: "Mid-sized supply chain companies face corporate Scope 3 emission reporting mandates from enterprise buyers (Apple, Walmart, EU CSRD), but cannot afford $50k consultants.",
    intendedUsers: "Supply chain managers, tier-1/tier-2 manufacturing vendors",
    proposedSolution: "Automated carbon accounting platform that ingests ERP purchase orders and utility invoices to calculate audited GHG Protocol Scope 1-3 footprint scores in 48 hours.",
    mvpFeatures: [
      "Automated utility bill & freight invoice OCR carbon parser",
      "EPA & DEFRA emission factor database matching",
      "CSRD and SEC compliant ESG disclosure export templates",
      "Supplier decarbonization benchmark ranking"
    ],
    differentiators: [
      "Self-serve invoice ingestion requiring zero manual spreadsheets",
      "Priced at 10% of traditional Big-4 accounting audit firms"
    ],
    revenueModels: [
      "$350/month per facility subscription",
      "$2,500 one-time annual audited certification badge"
    ],
    implementationComplexity: "Medium",
    assumptionsToValidate: [
      "Enterprise buyers accept standardized digital carbon audit certificates",
      "Manufacturers can easily extract raw utility and freight invoices"
    ],
    tags: ["ESG", "Carbon Accounting", "Scope 3", "Compliance"]
  },

  // 7. Cybersecurity
  {
    id: "cyber-api-shield",
    name: "API Sentinel",
    category: "Cybersecurity",
    problem: "Fintech and SaaS companies expose hundreds of undocumented internal API endpoints, leading to broken object-level authorization (BOLA) data leaks.",
    intendedUsers: "DevSecOps leads, CTOs, and backend engineering teams",
    proposedSolution: "Continuous passive API discovery and shadow endpoint scanner that intercepts API traffic, flags permission vulnerabilities, and generates automated regression tests.",
    mvpFeatures: [
      "Zero-latency eBPF traffic analyzer for automated endpoint discovery",
      "Automated OWASP API Top 10 vulnerability fuzzing",
      "Real-time alerts in Slack/PagerDuty for BOLA/BFLA security leaks",
      "Instant OpenAPI specification drift detection"
    ],
    differentiators: [
      "Passive eBPF kernel inspection: zero application code modifications",
      "Eliminates 95% of false-positive alerts by verifying active payload data flow"
    ],
    revenueModels: [
      "$199/month for up to 50 monitored endpoints",
      "$799/month for enterprise with custom compliance rules"
    ],
    implementationComplexity: "High",
    assumptionsToValidate: [
      "DevOps engineers permit non-intrusive eBPF agents on staging/production clusters",
      "Automated fuzzing does not trigger accidental database mutations"
    ],
    tags: ["API Security", "eBPF", "OWASP", "DevSecOps"]
  },

  // 8. Developer Tools
  {
    id: "devtools-schema-migration",
    name: "SchemaSafe",
    category: "Developer Tools",
    problem: "Database schema migrations in PostgreSQL cause unexpected table locks, downtime, and data corruption during rapid production deployments.",
    intendedUsers: "Backend engineers, database administrators, and DevOps teams",
    proposedSolution: "A GitHub Action and CI bot that tests SQL migrations against cloned production schema replicas, detecting locking statements and generating zero-downtime migration recipes.",
    mvpFeatures: [
      "CI/CD PR bot reviewing SQL & Prisma/TypeORM/Drizzle migrations",
      "Lock detection engine flagging ACCESS EXCLUSIVE locks on large tables",
      "Automatic rewrite suggestions into non-blocking multi-step migrations",
      "Instant rollback script generator"
    ],
    differentiators: [
      "Runs directly in GitHub Actions with zero external database credential access",
      "Supports complex edge cases (concurrent index creation, foreign key constraints)"
    ],
    revenueModels: [
      "Free for open-source repositories",
      "$39/mo for small teams; $199/mo for organization plan"
    ],
    implementationComplexity: "Medium",
    assumptionsToValidate: [
      "Engineering teams prioritize migration safety over manual DBA reviews",
      "Automated migration rewrites are trusted by senior engineers"
    ],
    tags: ["Database", "PostgreSQL", "CI/CD", "Migrations"]
  },

  // 9. Productivity
  {
    id: "prod-slack-distill",
    name: "ThreadDigest",
    category: "Productivity",
    problem: "Remote teams spend 90+ minutes daily reading through noisy Slack channels to reconstruct technical decisions and action items made across sprawling time zones.",
    intendedUsers: "Remote engineering managers, product leads, and asynchronously distributed teams",
    proposedSolution: "An AI Slack bot that detects decision consensus in public channels, generates structured 3-bullet daily digests, and automatically pushes action tasks to Linear and Jira.",
    mvpFeatures: [
      "Channel decision extractor filtering out conversational chatter",
      "Daily 9:00 AM personalized digest delivered via DM",
      "One-click sync to Linear, Jira, and Notion",
      "Privacy-first filtering with sensitive channel exclusion rules"
    ],
    differentiators: [
      "Focuses strictly on ratified decisions and assigned action items, not generic chat summaries",
      "SOC2 compliant data lifecycle with zero model training on company messages"
    ],
    revenueModels: [
      "$6/user/month for team workspaces",
      "$49/month flat rate for small startups up to 15 users"
    ],
    implementationComplexity: "Low",
    assumptionsToValidate: [
      "Employees trust automated task extraction without manual verification",
      "Teams find DM summaries more useful than native Slack search"
    ],
    tags: ["Slack", "Remote Work", "Asynchronous", "Linear"]
  },

  // 10. E-commerce
  {
    id: "ecom-return-rescue",
    name: "KeepOrSwap",
    category: "E-commerce",
    problem: "Direct-to-consumer apparel brands lose up to 30% of gross margin on returns due to reverse logistics shipping costs, restocking fees, and liquidation discounts.",
    intendedUsers: "Shopify DTC apparel and footwear merchants ($1M–$20M GMV)",
    proposedSolution: "Post-purchase returns optimization engine that offers customers personalized instant exchanges, bonus store credits, or peer-to-peer neighborhood swaps before issuing shipping labels.",
    mvpFeatures: [
      "Shopify app with branded customer self-service return portal",
      "Dynamic incentive engine offering 120% store credit for exchanges",
      "Instant sizing swap recommendation based on fit reviews",
      "Reverse logistics carrier label generator with bulk discounted rates"
    ],
    differentiators: [
      "Converts 42% of refund requests into retained store revenue",
      "Simple 5-minute Shopify app installation with no developer required"
    ],
    revenueModels: [
      "$149/mo platform fee + $0.50 per retained exchange",
      "Enterprise custom volume pricing"
    ],
    implementationComplexity: "Medium",
    assumptionsToValidate: [
      "Consumers accept bonus store credit over credit card cash refunds",
      "Shopify merchants see positive ROI within the 14-day free trial"
    ],
    tags: ["Shopify", "DTC", "Returns", "E-commerce"]
  },

  // 11. Logistics
  {
    id: "logistics-cold-chain",
    name: "FrostGuard IoT",
    category: "Logistics",
    problem: "Perishable food and specialty pharma distributors lose $18B annually to cold-chain temperature excursions during final-mile refrigerated van transit.",
    intendedUsers: "Regional food distributors, pharmaceutical cold-chain couriers",
    proposedSolution: "Low-cost Bluetooth/cellular sensor tags paired with a driver mobile app that monitors real-time trailer temperature and predicts insulation failure 45 minutes before spoilage.",
    mvpFeatures: [
      "$15 reusable temperature & humidity logging beacon tags",
      "Driver audio alert on mobile app when door is left open > 3 minutes",
      "Automated FDA/HACCP temperature compliance report PDF on delivery",
      "Fleet dispatcher GPS dashboard with real-time temperature telemetry"
    ],
    differentiators: [
      "10x cheaper than legacy satellite reefer tracking systems",
      "Instant Bluetooth auto-pairing with driver's existing smartphone"
    ],
    revenueModels: [
      "$19/month per active delivery vehicle",
      "Hardware beacon sales at $15/unit (15% hardware margin)"
    ],
    implementationComplexity: "High",
    assumptionsToValidate: [
      "Drivers reliably carry smartphones into the cargo area for Bluetooth handshakes",
      "Predictive thermal decay models work across varying ambient outside temperatures"
    ],
    tags: ["Cold Chain", "IoT", "Logistics", "Food Safety"]
  },

  // 12. Accessibility
  {
    id: "access-screen-auditor",
    name: "A11yLens",
    category: "Accessibility",
    problem: "Over 96% of top 1M websites fail WCAG 2.1 accessibility criteria, exposing companies to Americans with Disabilities Act (ADA) lawsuits and alienating disabled consumers.",
    intendedUsers: "Frontend engineers, design systems leads, and QA teams",
    proposedSolution: "A developer-focused accessibility test suite that simulates screen reader audio paths, automated contrast remediation, and keyboard focus traps directly inside playwright CI workflows.",
    mvpFeatures: [
      "Automated screen reader audio simulation preview in browser",
      "One-click CSS contrast fix suggestions with color token preservation",
      "Keyboard navigation trap detector with interactive breadcrumb timeline",
      "Automated legal compliance certificate generation for ADA/WCAG 2.2"
    ],
    differentiators: [
      "Native CI/CD and developer-tooling focus rather than generic overlays",
      "Zero intrusive javascript widgets added to customer-facing code"
    ],
    revenueModels: [
      "Free for open-source; $49/mo per developer team",
      "$499/mo for enterprise compliance audit suite"
    ],
    implementationComplexity: "Medium",
    assumptionsToValidate: [
      "Engineering teams prefer native CI tests over client-side accessibility widgets",
      "Legal counsel accepts automated WCAG audit reports as lawsuit defense evidence"
    ],
    tags: ["WCAG", "ADA", "Screen Reader", "Accessibility"]
  },

  // 13. Smart Cities
  {
    id: "cities-curb-flow",
    name: "CurbPulse",
    category: "Smart Cities",
    problem: "Urban delivery vehicles (Amazon, FedEx, Uber Eats) double-park and block bicycle lanes 45% of the time due to chaotic unmanaged curb spaces in downtown corridors.",
    intendedUsers: "Municipal transportation departments, business improvement districts",
    proposedSolution: "Computer-vision enabled curb-space allocation platform that turns existing street security cameras into dynamic commercial delivery reservation zones.",
    mvpFeatures: [
      "Automated curb occupancy detection using existing camera streams",
      "Commercial delivery reservation mobile app for delivery drivers",
      "Dynamic congestion pricing based on real-time street demand",
      "Automated digital double-parking infraction logs for parking enforcement"
    ],
    differentiators: [
      "Uses existing municipal camera infrastructure: zero in-ground sensor installation",
      "Incentivizes delivery drivers through guaranteed 15-minute load windows"
    ],
    revenueModels: [
      "$5,000/month annual municipal SaaS contract per urban district",
      "$1.50 micro-fee per delivery vehicle reservation"
    ],
    implementationComplexity: "High",
    assumptionsToValidate: [
      "Delivery couriers will reserve loading zones in advance to avoid $85 parking tickets",
      "City councils will share camera feeds with private software vendors"
    ],
    tags: ["Urban Planning", "Transit", "Computer Vision", "Delivery"]
  },

  // 14. Small Business Solutions
  {
    id: "smb-local-procure",
    name: "BoutiqueStock",
    category: "Small Business Solutions",
    problem: "Independent coffee shops, bakeries, and retail boutiques spend 10+ hours weekly ordering from 8 separate local food distributors via phone calls, paper slips, and SMS.",
    intendedUsers: "Independent restaurant owners, specialty café managers, regional food suppliers",
    proposedSolution: "A unified wholesale ordering app that aggregates all regional suppliers into one digital checkout cart, sending automated order sheets to each distributor via their preferred channel.",
    mvpFeatures: [
      "Unified digital catalogue aggregating milk, beans, produce, and packaging",
      "One-click reorder based on POS sales volume trends (Square/Clover)",
      "Automated conversion into distributor-preferred formats (SMS, WhatsApp, Email, PDF)",
      "Consolidated monthly credit invoice with single bank payment"
    ],
    differentiators: [
      "Requires zero distributor software adoption: sends orders into their existing legacy inbox",
      "Integrates directly with point-of-sale inventory depletion"
    ],
    revenueModels: [
      "$49/month per venue subscription",
      "Optional 1.5% merchant payment processing discount"
    ],
    implementationComplexity: "Medium",
    assumptionsToValidate: [
      "Local wholesale distributors will accept orders generated via automated emails/SMS",
      "Café managers will switch from informal phone calls to a mobile app"
    ],
    tags: ["Wholesale", "Procurement", "Restaurants", "POS"]
  },

  // 15. Personal Finance
  {
    id: "pfin-subscription-negotiator",
    name: "SubSqueeze",
    category: "Personal Finance",
    problem: "Average consumers waste $680 annually on forgotten streaming services, gym memberships, and sneaky price hikes that employ dark-pattern cancellation mazes.",
    intendedUsers: "Gen-Z and millennial professionals with 8+ recurring digital subscriptions",
    proposedSolution: "A privacy-first subscription manager that links to bank statements, detects silent price increases, and uses automated cancellation bots to terminate unwanted subscriptions with zero phone calls.",
    mvpFeatures: [
      "Read-only Plaid bank account subscription audit in 10 seconds",
      "Hidden price hike detection alerts with historical cost charts",
      "Automated cancellation agent navigating gym and streaming retention loops",
      "Annual savings tracker with one-click budget goal reallocation"
    ],
    differentiators: [
      "No selling of personal customer financial data to credit card brokers",
      "Guaranteed automated cancellation without requiring customer to speak with retention agents"
    ],
    revenueModels: [
      "Success fee: 25% of first-year savings achieved",
      "Optional $4.99/mo premium proactive price monitoring"
    ],
    implementationComplexity: "Medium",
    assumptionsToValidate: [
      "Users will authorize an automated agent to cancel accounts on their behalf",
      "Retention call centers can be bypassed via certified mail or automated web flows"
    ],
    tags: ["Subscriptions", "Personal Finance", "Savings", "Plaid"]
  }
];
