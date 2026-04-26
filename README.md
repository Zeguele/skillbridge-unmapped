# SkillBridge

**Bridging the gap between hidden skills and formal labor markets.**

[![Project URL](https://img.shields.io/badge/Live-skillbridge--unmapped.lovable.app-blue)](https://skillbridge-unmapped.lovable.app)
[![GitHub](https://img.shields.io/badge/GitHub-skillbridge--unmapped-lightgrey)](https://github.com/Zeguele/skillbridge-unmapped)

## 🌍 The Mission
SkillBridge transforms informal, self-taught skills into structured, visible, and actionable profiles. We believe that economic mobility should be driven by what you can do, not just the degrees you hold—especially for millions of talented youth in low- and middle-income countries (LMICs).

---

## 📉 The Problem
Millions of young people in LMICs possess valuable, real-world skills but lack formal recognition. Because labor markets rely heavily on degrees and certifications, these individuals remain invisible to employers and disconnected from economic opportunities.

*   **Skilled Workers:** Cannot access stable income pathways.
*   **Employers:** Miss out on capable, self-taught talent.
*   **Policymakers:** Lack accurate, ground-level labor data to design effective programs.

## 🚀 The Solution
SkillBridge turns informal, unverified skills into structured, income-linked opportunities. 

1.  **Capture:** We identify real-world skills even without traditional credentials.
2.  **Translate:** Our AI engine standardizes these skills into recognized professional profiles.
3.  **Match:** We connect users to real job opportunities and income pathways.
4.  **Insights:** We provide users with earning potential tied to their specific skill sets.

---

## ✨ Key Features (MVP)

### 🧠 Skill Mapping Engine
Users input their real-world experience in natural language. Our **AI-powered NLP engine** parses and translates unstructured work history into recognized, standardized skill competencies.

### 💼 Opportunity Matching
A sophisticated algorithm that matches users to relevant jobs, gigs, or income paths based on their mapped skills. It provides estimated earning potential, giving users a clear roadmap for growth.

### 📊 Labor Intelligence
For policymakers and NGOs, SkillBridge generates aggregated, anonymized skill data to help design better workforce development programs based on real-time market needs.

---

## 👥 Who This Affects

| User Tier | Target Audience | Impact |
| :--- | :--- | :--- |
| **Primary** | **Youth (18-30)** | Informal workers, freelancers, and technicians gaining documented profiles. |
| **Secondary** | **Policymakers / NGOs** | Access to real-time, skills-based data for workforce planning. |
| **Tertiary** | **Employers** | Discovery of skilled talent beyond traditional degree-based hiring. |

---

## 📈 Market Opportunity
*   **TAM (Total Addressable Market):** 500M+ youth globally with unrecognized skills.
*   **SAM (Serviceable Addressable Market):** 150M–200M digitally connected youth in LMICs.
*   **SOM (Serviceable Obtainable Market):** 5M–10M users in early markets (India, Nigeria, Kenya, Indonesia).

**Why Now?** Rapid mobile adoption, the growth of the gig economy, and a global shift toward skills-based hiring.

---

## 🛠️ Technology Stack

### Core Framework
*   **[React 18](https://reactjs.org/)** - UI library for building the interface.
*   **[TypeScript](https://www.typescriptlang.org/)** - Static typing for improved developer experience and code quality.
*   **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling for fast builds and HMR.

### UI & UX
*   **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for styling.
*   **[Shadcn/UI](https://ui.shadcn.com/)** - High-quality, accessible components built on top of **Radix UI** primitives.
*   **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icon set.
*   **[Framer Motion](https://www.framer.com/motion/)** & **Tailwind Animate** - Smooth animations and transitions.
*   **[Recharts](https://recharts.org/)** - Composable charting library for labor data visualization.

### Data & State Management
*   **[Supabase](https://supabase.com/)** - Backend-as-a-Service (BaaS) providing PostgreSQL, Authentication, and Edge Functions.
*   **[TanStack Query (React Query)](https://tanstack.com/query/latest)** - Powerful asynchronous state management and data fetching.
*   **[React Hook Form](https://react-hook-form.com/)** & **[Zod](https://zod.dev/)** - Robust form handling and schema validation.
*   **[React Router](https://reactrouter.com/)** - Client-side routing.

### AI & Processing
*   **[Google Gemini](https://deepmind.google/technologies/gemini/)** - Powering the AI skill mapping engine, labor market analysis, and policy recommendations via **Gemini 2.0 Flash**.
*   **NLP Standardization** - Mapping informal skills to international taxonomies (ISCO-08, ESCO, O*NET).
*   **Mobile-First Design** - Optimized for low-bandwidth and high-latency environments common in LMICs.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Installation
1.  **Clone the repository**
    ```bash
    git clone https://github.com/Zeguele/skillbridge-unmapped.git
    cd skillbridge-unmapped
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

### Environment Setup
Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🔗 Links
- **Live Application:** [skillbridge-unmapped.lovable.app](https://skillbridge-unmapped.lovable.app)
- **GitHub Repository:** [https://github.com/Zeguele/skillbridge-unmapped](https://github.com/Zeguele/skillbridge-unmapped)

---

## ⚖️ License
This project is licensed under the ISC License - see the LICENSE file for details.
