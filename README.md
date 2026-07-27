# STARTUP FUNERAL — AI Startup Pre-Mortem Platform

> **Reveal hidden risks, challenge assumptions, receive expert-level feedback, and build a stronger startup with AI-powered analysis.**

---

# Table of Contents

- The Problem
- The Idea
- Live App
- Features
- The AI Feature
- Tech Stack
- Screenshots
- How to Run Locally
- Future Improvements
- Author

---

# The Problem

Every startup begins with excitement, ambition, and the belief that a great idea will succeed. Unfortunately, many startups fail—not because founders lack passion, but because they discover critical weaknesses too late. Problems such as poor market validation, weak differentiation, unrealistic pricing, customer rejection, or scalability issues often appear only after significant time, money, and effort have already been invested.

Most startup validation tools focus on encouraging founders or giving them a simple score. Very few challenge assumptions, explain why a startup may fail, or provide practical guidance for improvement before launch.

Startup Funeral was built around one simple question:

> **If this startup failed a year from now, what would be the reasons?**

Instead of waiting for the market to answer that question, Startup Funeral helps founders answer it before they launch.

Whether you're a student building your first startup, an aspiring entrepreneur, or someone preparing to pitch investors, Startup Funeral acts as an AI-powered startup pre-mortem that uncovers weaknesses early—when they are still easy and inexpensive to fix.

---

# The Idea

Startup Funeral isn't another startup scoring website.

Instead of predicting success, it assumes the startup has already failed and works backwards to understand **why**.

Users complete a structured multi-step questionnaire describing their startup idea, target audience, market opportunity, business model, pricing strategy, competitors, execution plan, funding requirements, and long-term vision.

Using this information, AI performs a comprehensive startup evaluation from multiple perspectives—including investors, customers, competitors, and business strategy experts—to generate a detailed Startup Pre-Mortem Report.

The report doesn't stop at identifying problems. Every weakness is paired with practical recommendations, recovery strategies, and a structured 90-day action plan that founders can realistically follow.

The experience continues inside the **Strategy Room**, where founders can ask follow-up questions, explore different approaches, validate decisions, and receive iterative AI guidance for improving their startup.

The goal isn't to tell founders not to build their ideas.

The goal is to help them build stronger ones.

---

# Live App

### Live Application

https://startup-funeral.lovable.app

### Public GitHub Repository

https://github.com/aeshahshahid/startup-funeral

---

# Features

| Feature | Description |
|----------|-------------|
| Modern Landing Page | Clean, responsive landing page introducing Startup Funeral and its purpose. |
| Secure Authentication | Login using Email/Password or Google OAuth through Supabase Authentication. |
| Multi-Step Startup Questionnaire | Collects detailed startup information including idea, target market, business model, pricing, competition, execution strategy, and funding. |
| AI Startup Analysis | Uses Google Gemini 3.5 Flash to generate a comprehensive startup pre-mortem report. |
| Executive Summary | Provides a concise overview of the startup's overall evaluation. |
| Startup Health Scores | Evaluates market opportunity, differentiation, execution, scalability, business model, competition, and funding readiness. |
| Risk Analysis | Identifies major risks that could negatively impact the startup if left unresolved. |
| Hidden Assumptions | Detects assumptions founders may have overlooked and explains why they matter. |
| Investor Perspective | Simulates how potential investors may evaluate the startup and highlights key concerns. |
| Customer Perspective | Predicts customer objections, adoption barriers, and market challenges. |
| Competitor Perspective | Evaluates competitive positioning and how easily the startup can be replicated. |
| Recovery Strategy | Suggests practical improvements and actionable recommendations for strengthening the startup. |
| 90-Day Action Plan | Generates a structured roadmap for improving the startup over the next three months. |
| Strategy Room | Interactive AI workspace where founders can discuss recommendations, validate ideas, and receive iterative startup guidance. |
| PDF Export | Download the complete startup report as a professionally formatted PDF. |
| Responsive Design | Optimized for desktop and mobile devices. |

---

# The AI Feature

Startup Funeral is powered by **Google Gemini 3.5 Flash** through **Google AI Studio**.

Rather than acting like a chatbot that simply agrees with every idea, the AI is instructed to think like an experienced startup mentor, investor, and business strategist. It critically evaluates the submitted startup, challenges assumptions, identifies hidden risks, analyzes business viability, and explains its reasoning with practical recommendations.

Based on the information provided by the founder, the AI generates:

- Executive Summary
- Startup Health Scores
- Risk Analysis
- Hidden Assumptions
- Investor Perspective
- Customer Perspective
- Competitor Perspective
- Recovery Strategy
- Growth Recommendations
- 90-Day Action Plan

The AI is instructed to challenge assumptions, avoid generic encouragement, explain its reasoning, prioritize actionable business feedback, and generate structured recommendations tailored to the information provided by the founder.

After the report is generated, users can continue the discussion in the **Strategy Room**, where they can ask follow-up questions, explore alternative strategies, validate business decisions, and iteratively improve their startup with AI-powered guidance.

---

# Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React + TypeScript |
| Build Tool | Vite |
| UI Components | shadcn/ui |
| Backend | Supabase Edge Functions |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Authentication (Email/Password & Google OAuth) |
| AI Provider | Google AI Studio |
| AI Model | Google Gemini 3.5 Flash |
| Deployment | Lovable |
| Version Control | GitHub |
| Package Manager | Bun |

---

# Screenshots

### Landing Page

**First impression of Startup Funeral showcasing the homepage, branding, and primary call-to-action.**

<img width="975" height="490" alt="image" src="https://github.com/user-attachments/assets/9ab7c95d-aab2-4f9a-a53f-30c4142b11b5" />


---

### Secure Authentication

**Email/Password and Google sign-in options allowing users to securely access their personalized dashboard.**

<img width="975" height="489" alt="image" src="https://github.com/user-attachments/assets/aaccd43e-d123-4cee-ae7c-a6ecb5f6d34e" />


---

### Startup Questionnaire

**Multi-step startup assessment where founders provide detailed information about their idea, target market, competition, pricing, business model, and execution strategy.**

<img width="975" height="492" alt="image" src="https://github.com/user-attachments/assets/00dcf9c3-698b-4ce4-9b2d-16a9ee70d5a7" />


---

### AI Startup Pre-Mortem Report

**AI-generated report presenting the executive summary, health scores, risk analysis, hidden assumptions, investor perspective, customer perspective, competitor insights, and recommendations.**

<img width="975" height="490" alt="image" src="https://github.com/user-attachments/assets/a570ba7d-db54-4c3c-97c8-6e15e23faa9a" />

<img width="975" height="491" alt="image" src="https://github.com/user-attachments/assets/7a4503df-122c-4b45-9896-12bf503b6283" />

---

### Strategy Room

**Interactive AI workspace where founders can discuss recommendations, ask follow-up questions, and receive personalized startup improvement strategies.**

<img width="1919" height="959" alt="image" src="https://github.com/user-attachments/assets/33b9278e-7148-4762-8e5c-10921fb6a829" />


---

### PDF Export

**Professionally formatted downloadable PDF report summarizing the complete startup analysis.**

<img width="975" height="550" alt="image" src="https://github.com/user-attachments/assets/d9aa83f2-6f72-4860-b63d-45e9e3f4302d" />


---

### User Dashboard

**Personal dashboard displaying saved startup analyses and allowing users to create and manage multiple startup evaluations.**

<img width="975" height="492" alt="image" src="https://github.com/user-attachments/assets/f44caa46-dc6e-478c-bbc3-fd500fea3a33" />


---

# How to Run Locally

Although Startup Funeral is deployed and available through the live application, the project can also be run locally.

### 1. Clone the repository

```bash
git clone https://github.com/aeshahshahid/startup-funeral.git
```

### 2. Navigate to the project directory

```bash
cd startup-funeral
```

### 3. Install dependencies

```bash
bun install
```

> If Bun is not installed, download it from https://bun.sh/.

### 4. Configure environment variables

Create a `.env` file and add the required environment variables for Supabase and Google Gemini.

Example:

```env
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
GOOGLE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 5. Start the development server

```bash
bun run dev
```

The application will be available locally at:

```
http://localhost:5173
```

> **Note:** API keys and secrets are intentionally excluded from the repository and should always be stored securely using environment variables.

---

# Future Improvements

This version focuses on helping founders identify weaknesses before launching. Future versions could include:

- Financial forecasting and revenue projections
- AI-powered pitch deck analysis
- Team collaboration and shared workspaces
- Startup comparison dashboard
- Investor readiness scoring
- Progress tracking across multiple startup iterations
- Industry-specific startup evaluation models
- Shareable reports and collaboration features

---

# Author

**Ayesha Shahid**

GitHub: https://github.com/aeshahshahid

Built as an original end-to-end AI-powered web application for an AI Certification Final Project. Startup Funeral helps founders uncover hidden risks, challenge assumptions, and build stronger startups before they launch.
