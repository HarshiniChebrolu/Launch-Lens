# 🚀 Launch Lens

> **AI-powered startup intelligence platform that transforms an early-stage idea into a structured, research-backed execution plan.**

Launch Lens helps aspiring founders, students, builders, and startup teams move from a raw idea to a clearer, more actionable startup strategy. It combines generative AI, live web research, technical planning, business analysis, investor preparation, and academic paper discovery inside one unified workspace.

The project was developed as part of the **Build with AI Camp**, based on an original product idea focused on reducing the confusion, fragmentation, and guesswork founders face during the early stages of building a startup.

---

## ✨ What Launch Lens Does

A user enters a startup idea along with context such as the target users, industry, budget, and goals. Launch Lens then generates a complete startup intelligence report containing:

- Executive summary
- Idea validation and readiness score
- Market signals and opportunities
- Competitor analysis and feature matrix
- Business model and revenue strategy
- MVP feature prioritization
- Technical blueprint and architecture
- Dynamic technology stack recommendations
- Security and privacy analysis
- SWOT analysis
- Cost estimation
- Go-to-market strategy
- Investor readiness assessment
- Startup branding suggestions
- Pitch, investor pitch, and hackathon pitch
- Pitch deck content
- Opportunity radar visualization
- Interactive roadmap
- AI Copilot for follow-up questions
- Research Hub with relevant academic paper links

The platform is designed so that the generated output changes according to the user’s idea instead of returning a fixed template.

---

## 🎯 Problem Statement

Early-stage founders and students often face several problems at once:

- Startup research is scattered across many websites.
- Market, competitor, business, and technical decisions are difficult to connect.
- Existing AI tools often provide generic advice.
- Founders may understand the idea but not know how to build, validate, price, or present it.
- Academic and technical research related to the idea is hard to discover quickly.

Launch Lens brings these activities into one guided workspace so users can research, plan, refine, and present their startup more effectively.

---

## 💡 Core Product Flow

```text
Startup Idea
     ↓
Live Research with Tavily
     ↓
AI Analysis with Gemini
     ↓
Structured Startup Intelligence Report
     ↓
Technical Blueprint + Business Strategy + Investor Readiness
     ↓
AI Copilot + Research Papers Hub
```

---

## 🧠 Key Features

### AI Startup Intelligence Report
Generates a detailed report based on the startup idea, target users, industry, budget, goals, market research, and competitors.

### Live Market Research
Uses Tavily to collect recent web research and relevant market information before the final report is generated.

### Technical Blueprint
Provides startup-specific guidance for:

- Frontend
- Backend
- Database
- Authentication
- AI layer
- Storage
- APIs and integrations
- Database tables
- Folder structure
- Development phases
- Deployment plan
- End-to-end workflow

### AI Copilot
Users can ask follow-up questions such as:

- How can I improve my MVP?
- How can I reduce development cost?
- How can I improve the business model?
- What questions may investors ask?
- What should my marketing strategy be?

The Copilot answers using the generated startup report as context.

### Research Hub
Finds relevant papers and academic resources using Tavily across trusted research sources such as:

- arXiv
- Semantic Scholar
- IEEE Xplore
- ACM Digital Library
- PubMed
- Springer
- ScienceDirect
- Google Scholar search links

### Saved Reports
Authenticated users can save, view, duplicate, favorite, regenerate, compare, and delete startup reports.

### Theme Support
Global dark and light modes are available across the landing page, authentication pages, dashboard, reports, and research hub.

### Authentication and Database
Supabase is used for:

- User registration
- User login
- Secure logout
- Password changes
- Saved startup reports
- Row Level Security policies

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, TypeScript |
| Styling | CSS, responsive glassmorphism UI |
| AI | Google Gemini API |
| Research | Tavily Search API |
| Authentication | Supabase Auth |
| Database | Supabase PostgreSQL |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 📁 Project Structure

```text
Launch-Lens/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts
│   │   ├── copilot/
│   │   │   └── route.ts
│   │   └── research-papers/
│   │       └── route.ts
│   ├── auth/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── charts/
│   ├── copilot/
│   ├── dashboard/
│   ├── landing/
│   ├── report/
│   └── theme/
├── lib/
│   ├── gemini.ts
│   ├── gemini-client.ts
│   ├── report-builder.ts
│   ├── reports-db.ts
│   ├── supabase.ts
│   └── tavily.ts
├── types/
│   └── report.ts
├── public/
├── .env.local
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🚀 Getting Started

## 1. Prerequisites

Install the following before running the project:

- Node.js 18 or later
- npm
- Git
- A Supabase account
- A Google AI Studio API key
- A Tavily API key

---

## 2. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/launch-lens.git
cd launch-lens
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## 3. Install Dependencies

```bash
npm install
```

---

# 🔑 API and Service Setup

Launch Lens requires three external services:

1. Supabase
2. Google Gemini
3. Tavily

Create the keys in the order below.

---

## 4. Create a Supabase Project

1. Sign in to Supabase.
2. Create a new project.
3. Open **Project Settings → API**.
4. Copy:
   - Project URL
   - Anon/Public Key
5. Keep these values ready for `.env.local`.

### Create the `reports` table

Open:

```text
Supabase → SQL Editor → New Query
```

Run:

```sql
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  idea jsonb not null,
  report jsonb not null,
  favorite boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table reports enable row level security;

drop policy if exists "Users can view own reports" on reports;
drop policy if exists "Users can insert own reports" on reports;
drop policy if exists "Users can update own reports" on reports;
drop policy if exists "Users can delete own reports" on reports;

create policy "Users can view own reports"
on reports for select
using (auth.uid() = user_id);

create policy "Users can insert own reports"
on reports for insert
with check (auth.uid() = user_id);

create policy "Users can update own reports"
on reports for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own reports"
on reports for delete
using (auth.uid() = user_id);
```

This enables each authenticated user to access only their own reports.

---

## 5. Get a Gemini API Key

1. Open Google AI Studio.
2. Sign in with your Google account.
3. Open the API key section.
4. Create a new API key.
5. Copy the key.

The Gemini key must stay server-side and must never be exposed in frontend code.

---

## 6. Get a Tavily API Key

1. Create a Tavily account.
2. Open the dashboard.
3. Generate or copy your API key.
4. Keep it ready for `.env.local`.

Tavily is used for market research and academic paper discovery.

---

## 7. Create `.env.local`

Create a file named:

```text
.env.local
```

Place it in the project root, at the same level as `package.json`.

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
```

Do not add quotes around the values unless a value specifically requires them.

---

## 8. Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 9. Build for Production

Before deployment, run:

```bash
npm run build
```

Then test the production build locally:

```bash
npm start
```

---

# 🌐 Deployment on Vercel

1. Push the project to GitHub.
2. Sign in to Vercel.
3. Import the GitHub repository.
4. Add the following environment variables in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GEMINI_API_KEY
TAVILY_API_KEY
```

5. Deploy the project.
6. Test authentication, report generation, Copilot, report saving, and Research Hub after deployment.

> Never commit `.env.local` to GitHub.

---

# 🧪 Recommended Testing Checklist

Before publishing or deploying, verify:

- Landing page opens correctly
- Dark and light themes work
- Registration works
- Login works
- Invalid login errors appear inside the form
- Logout works
- New startup report generates successfully
- Tavily research is included
- Gemini returns all required sections
- Report tabs and sidebar navigation work
- Technical Blueprint renders correctly
- Copilot answers follow-up questions
- Reports save to Supabase
- Favorite, duplicate, regenerate, compare, and delete work
- Research Hub returns relevant paper links
- Google Scholar links open correctly
- Export PDF works
- Mobile layout is usable
- `npm run build` completes without errors

---

# 🔒 Security Notes

- Never expose `GEMINI_API_KEY` or `TAVILY_API_KEY` in client-side code.
- Keep secret API calls inside Next.js API routes.
- Do not commit `.env.local`.
- Use Supabase Row Level Security.
- Validate AI responses before rendering.
- Use safe defaults for optional arrays and objects.
- Review API usage and quotas before public deployment.

---

# 📸 Screenshots

Add screenshots after deployment for stronger GitHub presentation.

Suggested structure:

```text
public/screenshots/
├── landing-page.png
├── dashboard.png
├── startup-report.png
├── technical-blueprint.png
├── research-hub.png
└── ai-copilot.png
```

Then include them in this README:

```md
![Launch Lens Dashboard](public/screenshots/dashboard.png)
```

---

# 🗺️ Future Enhancements

- Professional PDF, DOCX, and PPTX exports
- Visual architecture diagrams
- Editable financial projections
- Saved paper collections
- Research paper summarization
- Team collaboration
- Shareable public startup reports
- Admin dashboard
- Usage analytics
- Email notifications
- AI-generated logo creation

---

# 💼 Why This Project Matters

Launch Lens demonstrates practical experience with:

- Full-stack application development
- React and Next.js architecture
- TypeScript
- AI API integration
- Prompt engineering
- Web research pipelines
- Authentication and authorization
- PostgreSQL and Supabase
- Row Level Security
- API route development
- Dynamic structured JSON generation
- Responsive UI/UX design
- Data visualization
- SaaS product thinking
- Production deployment workflows

It is designed as more than a simple AI wrapper. Launch Lens combines AI generation, live research, persistent user data, technical planning, academic discovery, and interactive follow-up guidance into one complete product experience.

---

# 👩‍💻 Author

**Chebrolu Harshini**  
B.Tech Computer Science Engineering  
AI/ML Enthusiast and Full-Stack Developer

---

# 📄 License

This project is intended for educational, portfolio, and demonstration purposes.

You may add an MIT License before making the repository public if you want others to use, modify, and contribute to the project.

---

## ⭐ Support

If you find Launch Lens useful or interesting, consider starring the repository.

