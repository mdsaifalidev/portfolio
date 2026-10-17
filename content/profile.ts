// Single source of truth for the home page (and, from M3, the RAG knowledge base).
// Wrap a phrase in **double asterisks** to highlight it as a metric.

export type Link = { label: string; href: string };

export type Experience = {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
  tags: string[];
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  highlights: string[];
  tags: string[];
  kind: "personal" | "work";
  status?: "in-progress";
  featured?: boolean;
  /** Has a case study at content/projects/<slug>.mdx */
  caseStudy?: boolean;
  /** Draft case studies only render in `pnpm dev` until reviewed. */
  draft?: boolean;
  /** Screenshot under /public, 16:10. Default / light theme. */
  image?: string;
  /** Screenshot under /public, 16:10. Dark theme variant. */
  imageDark?: string;
  live?: string;
  code?: Link[];
};

export type SkillGroup = { label: string; items: string[] };

/**
 * A HashCash platform Saif worked on. Product names are withheld under company policy.
 * `draft: true` hides the whole entry outside `pnpm dev`; `caseStudy.draft` hides only the write-up.
 */
export type Platform = {
  slug: string;
  /** Shown as `<service>.service` in the systemctl-style card. */
  service: string;
  name: string;
  tagline: string;
  /** What Saif personally did. */
  contribution: string[];
  /** Notable engineering decisions on the platform. */
  decisions: string[];
  stack: string[];
  metric?: string;
  caseStudy?: { draft?: boolean };
  draft?: boolean;
};

export type Evidence = { text: string; href?: string; draft?: boolean };

/** One row of the capability matrix: a domain, what Saif shipped in it, and the tools used. */
export type Capability = { domain: string; evidence: Evidence[]; tools: string[] };

export const profile = {
  name: "Md. Saif Ali",
  initials: "MSA",
  role: "Full-Stack Software Engineer",
  headline:
    "I build scalable Node.js backends and production AI systems (RAG, MCP).",
  location: "Durgapur, West Bengal, India",
  timezone: "IST (UTC+5:30)",
  availability: "Open to work, remote or relocation",
  email: "saifmd9536@gmail.com",
  resume: "/MD.%20SAIF%20ALI_RESUME.pdf",
  github: "https://github.com/mdsaifalidev",
  linkedin: "https://www.linkedin.com/in/mdsaifali09",
};

export const about: string[] = [
  "I'm a full-stack software engineer with **3+ years** of experience, specialising in Node.js backends, event-driven microservices and Generative AI applications.",
  "At HashCash Consultants LLC I architected a multi-tenant **RAG chatbot platform** with isolated per-tenant knowledge bases, and built a read-only **MCP server** that gives AI agents governed access to organisational knowledge. Before that, at Ayanlabs, I designed a **6+ service** microservices backend wired together with RabbitMQ and deployed to Kubernetes on AWS EKS.",
  "I like work I can measure: lower p95 latency, faster releases, higher test coverage. I'm comfortable across the stack, from GraphQL and REST API design to React and Next.js frontends to CI/CD on AWS.",
];

export const experience: Experience[] = [
  {
    company: "HashCash Consultants LLC",
    role: "Software Engineer",
    location: "Kolkata, West Bengal",
    start: "Sep 2025",
    end: "Present",
    bullets: [
      "Architected a multi-tenant Retrieval-Augmented Generation (RAG) chatbot platform with isolated per-tenant knowledge bases, cutting manual information-retrieval time by **~30%**.",
      "Built the RAG pipeline: document ingestion, chunking, embeddings, vector database storage and semantic search.",
      "Created a read-only Model Context Protocol (MCP) server giving AI agents governed access to organisational knowledge.",
      "Designed and shipped a GraphQL API (schemas, resolvers, query/mutation contracts), reducing payloads and round trips.",
      "Reduced p95 REST API latency by **20%** in a production MERN environment by optimising database indexing and query logic.",
    ],
    tags: ["Node.js", "Python", "LangChain", "OpenAI", "Gemini", "pgvector", "MCP", "GraphQL"],
  },
  {
    company: "Ayanlabs Solutions Pvt. Ltd.",
    role: "Full Stack Developer",
    location: "Remote",
    start: "Aug 2024",
    end: "Aug 2025",
    bullets: [
      "Designed and built a Node.js/Express.js microservices backend of **6+ services**, containerised with Docker (images in AWS ECR) and deployed on Kubernetes (AWS EKS) using Helm charts.",
      "Deployed applications on AWS EC2 with S3 for media and backups, managed IAM roles and permissions, connected domains with Route 53, and monitored with CloudWatch.",
      "Implemented asynchronous RabbitMQ messaging between services (RPC and event-driven), decoupling core business logic.",
      "Built GitHub Actions CI/CD pipelines with Mocha/Chai unit and integration suites, cutting manual release effort by **~60%** and raising test coverage to **80%+**.",
    ],
    tags: ["Node.js", "Express", "Docker", "Kubernetes", "AWS EKS", "Helm", "RabbitMQ", "GitHub Actions"],
  },
  {
    company: "Sasefied",
    role: "Full Stack Developer Intern",
    location: "Remote",
    start: "Jan 2024",
    end: "Jun 2024",
    bullets: [
      "Developed features for a PERN-stack application through production deployment, including Stripe payments and asynchronous RabbitMQ order confirmations.",
      "Isolated high-traffic workloads into microservices and reduced page load times by **~40%** through PostgreSQL query optimisation, Redis caching and TanStack Query.",
    ],
    tags: ["PostgreSQL", "Express", "React", "Node.js", "Stripe", "RabbitMQ", "Redis"],
  },
  {
    company: "E-SUTRA Technologies Pvt. Ltd.",
    role: "Full Stack Developer Intern",
    location: "Remote",
    start: "Jun 2023",
    end: "Nov 2023",
    bullets: [
      "Built MERN-stack features, including RESTful APIs and third-party payment gateway integrations.",
      "Integrated OAuth2-based social login and refined UI/UX iteratively within an Agile/Scrum team.",
    ],
    tags: ["MongoDB", "Express", "React", "Node.js", "OAuth2"],
  },
];

export const projects: Project[] = [
  {
    slug: "insightflow",
    title: "InsightFlow",
    summary:
      "Upload a CSV or Excel file and get an interactive dashboard plus an AI-written executive brief. Every number is computed, never generated by the model.",
    highlights: [
      "p95 filtered queries **368-377 ms**",
      "1M rows (86.7 MB) to a dashboard in **~12 s**",
      "**189** unit & integration tests + Playwright E2E",
    ],
    tags: ["Next.js 16", "Fastify", "FastAPI", "Polars", "PostgreSQL", "Redis", "S3", "Docker", "Turborepo"],
    kind: "personal",
    featured: true,
    caseStudy: true,
    image: "/projects/dashboard-light.webp",
    imageDark: "/projects/dashboard-dark.webp",
    live: "https://useinsightflow.vercel.app",
    code: [{ label: "Code", href: "https://github.com/mdsaifalidev/InsightFlow" }],
  },
  {
    slug: "portfolio-ai-assistant",
    title: "Portfolio AI Assistant",
    summary:
      "The assistant on this site: ask about my experience and get streamed answers grounded in my CV and case studies, with numbered links to the sources.",
    highlights: [
      "RAG over a build-time embeddings index, with no vector DB needed at this scale",
      "Streaming answers with **[n]** source citations",
      "Upstash rate limiting + prompt-injection guardrails",
    ],
    tags: ["Next.js", "Vercel AI SDK", "Gemini", "Embeddings", "Upstash Redis", "TypeScript"],
    kind: "personal",
    caseStudy: true,
    image: "/projects/portfolio-ai-assistant-v3.jpg",
    // TODO(Saif): add `code: [{ label: "Code", href: "https://github.com/mdsaifalidev/<repo>" }]` once pushed.
  },
  {
    slug: "event-driven-microservices",
    title: "Event-driven Microservices on AWS EKS",
    summary:
      "A Node.js/Express microservices backend communicating over RabbitMQ (RPC and events), containerised and shipped to Kubernetes on AWS EKS with Helm and GitHub Actions.",
    highlights: [
      "**~60%** less manual release effort",
      "**80%+** test coverage",
      "**6+** services on Kubernetes",
    ],
    tags: ["Node.js", "Express", "RabbitMQ", "Docker", "Kubernetes", "Helm", "AWS", "GitHub Actions"],
    kind: "work",
    caseStudy: true,
    draft: true,
  },
];

export const skills: SkillGroup[] = [
  { label: "Languages", items: ["JavaScript (ES6+)", "TypeScript", "Python", "SQL"] },
  {
    label: "Generative AI",
    items: ["RAG", "MCP", "LangChain", "OpenAI & Gemini LLMs", "Semantic Search", "Prompt Engineering"],
  },
  {
    label: "Backend",
    items: [
      "Node.js", "Express.js", "REST APIs", "GraphQL", "Microservices",
      "RabbitMQ", "JWT", "OAuth2", "Stripe", "PayPal",
    ],
  },
  {
    label: "Frontend",
    items: ["React.js", "Next.js", "TanStack Query", "Zustand", "Tailwind CSS", "Socket.IO"],
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "MongoDB", "Redis", "Prisma ORM", "pgvector"],
  },
  {
    label: "Cloud & DevOps",
    items: [
      "Docker", "Kubernetes", "AWS (EC2, S3, IAM, Route 53, CloudWatch, ECR)",
      "GitHub Actions", "Git",
    ],
  },
  { label: "Testing & Process", items: ["Jest", "Mocha", "Chai", "Agile / Scrum"] },
];

// ---------------------------------------------------------------------------
// HashCash Consultants LLC platforms. Published fields stick to facts on Saif's CV;
// anything drafted from a teammate's public write-up stays `draft` until Saif confirms it.
// ---------------------------------------------------------------------------
export const platforms: Platform[] = [
  {
    slug: "mcp-knowledge-server",
    service: "mcp-knowledge",
    name: "MCP Knowledge Server",
    tagline: "A read-only Model Context Protocol server that gives AI agents governed access to organisational knowledge.",
    contribution: [
      "Created the read-only MCP server so AI agents and coding assistants can query organisational knowledge through one governed interface.",
    ],
    decisions: [
      "Read-only boundary: the server exposes search and retrieval tools only, so nothing an agent calls can change data.",
      "Governed access: agents reach knowledge through the server's tools instead of raw systems or credentials.",
    ],
    stack: ["MCP", "Node.js", "Python", "TypeScript"],
    caseStudy: { draft: true },
  },
  {
    slug: "multi-tenant-rag",
    service: "rag-platform",
    name: "Multi-tenant RAG Platform",
    tagline: "A RAG chatbot platform where every tenant gets an isolated knowledge base.",
    contribution: [
      "Architected the multi-tenant platform with isolated per-tenant knowledge bases.",
      "Built the pipeline end to end: document ingestion, chunking, embeddings, vector storage and semantic search.",
    ],
    decisions: [
      "Tenant isolation: every retrieval is scoped to the asking tenant's knowledge base.",
      "One reusable pipeline: new tenants get their own knowledge base without new infrastructure.",
    ],
    stack: ["Node.js", "Python", "LangChain", "OpenAI", "Gemini", "pgvector"],
    metric: "**~30%** less manual information-retrieval time",
    caseStudy: { draft: true },
  },
  {
    slug: "hrms",
    service: "hrms",
    name: "HRMS",
    tagline: "Internal human-resources platform: onboarding, attendance, leave, payroll and the org hierarchy.",
    contribution: [
      // TODO(Saif): replace with the modules and features you personally built.
      "Contributed to the HRMS platform across onboarding, attendance, leave and payroll workflows.",
    ],
    decisions: [
      "Approval-workflow engine routes leave requests through configurable approval chains.",
      "Approved leave and attendance feed payroll, so pay calculations use the same records HR approves.",
      "Access follows the org hierarchy: managers act on their own reports' requests.",
    ],
    stack: [], // TODO(Saif): add the stack you used.
    caseStudy: { draft: true },
    draft: true,
  },
  {
    slug: "realtime-communication",
    service: "realtime-comms",
    name: "Real-Time Communication Platform",
    tagline: "Slack-style team messaging with channels, threads, presence, and audio/video calls.",
    contribution: [
      // TODO(Saif): replace with the parts you personally built (messaging, presence, calling, ...).
      "Contributed to the real-time messaging and calling features.",
    ],
    decisions: [
      "One Socket.IO event model carries messages, delivery and read receipts, presence and typing indicators.",
      "Calling moved from peer-to-peer WebRTC to a LiveKit SFU so group calls stay smooth without overloading clients.",
    ],
    stack: ["Socket.IO", "WebRTC", "LiveKit", "Node.js"],
    caseStudy: { draft: true },
    draft: true,
  },
];

export const capabilities: Capability[] = [
  {
    domain: "Generative AI & RAG",
    evidence: [
      { text: "Multi-tenant RAG platform that cut manual retrieval time ~30%", href: "/#platforms" },
      { text: "Grounded AI briefs in InsightFlow", href: "/projects/insightflow" },
      { text: "This site's cited AI assistant", href: "/projects/portfolio-ai-assistant" },
    ],
    tools: ["RAG", "LangChain", "OpenAI", "Gemini", "pgvector", "Prompt engineering"],
  },
  {
    domain: "AI agent tooling",
    evidence: [{ text: "Read-only MCP server for governed knowledge access", href: "/#platforms" }],
    tools: ["MCP", "Semantic search"],
  },
  {
    domain: "Backend & APIs",
    evidence: [
      { text: "GraphQL API with typed contracts at HashCash", href: "/#experience" },
      { text: "p95 REST latency cut by 20% through indexing and query work", href: "/#experience" },
      { text: "Fastify + FastAPI services in InsightFlow", href: "/projects/insightflow" },
    ],
    tools: ["Node.js", "Express", "Fastify", "GraphQL", "REST", "Python", "JWT", "OAuth2"],
  },
  {
    domain: "Distributed systems",
    evidence: [{ text: "6+ microservices over RabbitMQ RPC and events", href: "/#experience" }],
    tools: ["Microservices", "RabbitMQ", "Redis", "Event-driven design"],
  },
  {
    domain: "Real-time systems",
    evidence: [
      { text: "Full-stack real-time chat app", href: "https://github.com/mdsaifalidev/Full-Stack-Realtime-Chat-App" },
      { text: "Team messaging and calling platform at HashCash", href: "/#platforms", draft: true },
    ],
    tools: ["Socket.IO", "WebSockets", "WebRTC", "LiveKit"],
  },
  {
    domain: "Frontend",
    evidence: [
      { text: "Shopfinity admin dashboard and storefront", href: "https://shopfinity-xi.vercel.app" },
      { text: "InsightFlow dashboards and this site", href: "/projects/insightflow" },
    ],
    tools: ["React", "Next.js", "TypeScript", "TanStack Query", "Zustand", "Tailwind CSS"],
  },
  {
    domain: "Data",
    evidence: [
      { text: "Page loads ~40% faster via PostgreSQL tuning and Redis caching", href: "/#experience" },
      { text: "1M-row datasets queried at p95 under 400 ms with Polars", href: "/projects/insightflow" },
    ],
    tools: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "pgvector", "Polars"],
  },
  {
    domain: "Cloud & DevOps",
    evidence: [
      { text: "Services on Kubernetes (AWS EKS) with Helm and ECR", href: "/#experience" },
      { text: "CI/CD that cut manual release effort ~60%", href: "/#experience" },
    ],
    tools: ["Docker", "Kubernetes", "Helm", "AWS", "GitHub Actions"],
  },
  {
    domain: "Payments & auth",
    evidence: [
      { text: "Stripe payments and asynchronous order processing at Sasefied", href: "/#experience" },
      { text: "OAuth2 social login and payment gateway integrations at E-SUTRA", href: "/#experience" },
    ],
    tools: ["Stripe", "PayPal", "JWT", "OAuth2"],
  },
  {
    domain: "Testing & quality",
    evidence: [
      { text: "80%+ coverage with Mocha/Chai at Ayanlabs", href: "/#experience" },
      { text: "189 tests + Playwright E2E in InsightFlow", href: "/projects/insightflow" },
    ],
    tools: ["Jest", "Mocha", "Chai", "Vitest", "Playwright"],
  },
];

export const education = {
  degree: "Bachelor of Computer Applications (BCA)",
  school: "Bengal College of Engineering and Technology (BCET), Durgapur",
  start: "2022",
  end: "2025",
};

export const certifications: (Link & { issuer: string })[] = [
  {
    label: "NodeJS - The Complete Guide (MVC, REST APIs, GraphQL, Deno)",
    issuer: "Udemy",
    href: "https://ude.my/UC-d9afe7b1-4a9f-4111-8355-cd1d05775d53",
  },
];

export type NavItem = { id: string; label: string; primary?: boolean };

/** `primary` sections appear in the stub's nav; the command palette lists them all. */
export const navSections: NavItem[] = [
  { id: "work", label: "Work", primary: true },
  { id: "platforms", label: "Platforms" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience", primary: true },
  { id: "capabilities", label: "Capabilities", primary: true },
  { id: "telemetry", label: "Visitors" },
  { id: "writing", label: "Writing" },
  { id: "about", label: "About", primary: true },
  { id: "contact", label: "Contact", primary: true },
];
