# Full Stack Blog Application

**Live Demo:** [Click here to view the deployed app](https://blog-app-git-main-nandinirathore40s-projects.vercel.app)

## Overview
This is a full-stack blog application built as an assignment for the Full Stack Development internship. It integrates a modern frontend framework with a backend database and an AI-powered feature for enhanced user experience.

## Tech Stack
* **Frontend:** Next.js (React)
* **Backend & Database:** Supabase
* **AI Integration:** Google Gemini API (for content summarization)
* **Deployment:** Vercel

## 🔍 Feature Logic
The application follows a simple workflow:
* Users can create, read, and comment on blog posts.
* When a new post is created, a summary is generated (AI or fallback logic).
* The summary is stored in the database and displayed on the homepage.
* **Access Control:** Basic access control is implemented where users can create and edit their own posts, and view or comment on others.

## 🤖 AI Integration (Gemini)
Initially, the Google Gemini API was integrated to automatically generate summaries of blog posts (150–200 words). However, due to API quota limits, rate limiting errors (429), and model availability issues, a robust fallback mechanism was implemented.
* If the AI fails, the summary is automatically generated using the first 150 characters of the content.
* This ensures the feature always works reliably for the end user without breaking the app.

## 💸 Cost Optimization
Avoided excessive API calls and potential billing overruns by:
* Using the fallback summary method when the API fails.
* Limiting the number of retries for failed requests.
This drastically reduces dependency on paid API usage and keeps the application fully functional even without active billing.

## 🐞 Challenges & Bugs Faced
Some key issues resolved during development:
* **Gemini API Errors:** Handled HTTP 429 (quota exceeded), 404 (model not found), and 503 (high demand) errors gracefully via the fallback logic.
* **Next.js Build Errors:** Resolved syntax and structure issues (e.g., missing brackets `Expected '}', got <eof>`) that prevented successful compilation.
* **Deployment Issues:** Initial Vercel build failed due to missing credentials. Fixed by manually injecting `SUPABASE_URL`, `ANON_KEY`, and `GEMINI_API_KEY` into Vercel's Environment Variables settings.

## 🚀 Future Enhancements
* Implementation of full role-based access control (Admin/Viewer separation).
* Comprehensive admin dashboard for content moderation.

## How to Run Locally
1. Clone the repository: `git clone https://github.com/nandinirathore40/blog-app.git`
2. Install dependencies: `npm install`
3. Create a `.env.local` file and add your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY`.
4. Start the server: `npm run dev`
