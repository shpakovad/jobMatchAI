# JobPath — AI-Powered Resume & Vacancy Validator 🚀

**JobPath** is a high-performance fullstack application built on top of Next.js 15+ and Google Gemini AI, designed to instantly match a candidate's resume with IT job descriptions. The system parses text blocks, calculates a precise tech stack match percentage, highlights missing skills, and generates actionable, detailed recommendations on how to adapt the profile for the specific role.

The application is engineered following the strict principles of **Feature-Sliced Design (FSD)** and optimized to handle rigid regional infrastructure and API restrictions gracefully.

---

## 🏗️ Architecture & Tech Stack

The project leverages a hybrid architecture powered by Next.js App Router, where each layer performs a strictly isolated role with zero cross-contaminations:

*   **Framework:** `Next.js 15+` (App Router) with full support for React 19 features.
*   **Artificial Intelligence:** `Google Gemini API` (`gemini-3.6-flash`) utilizing `zod` at the AI → Domain boundary for rigid runtime validation of heterogeneous LLM JSON responses.
*   **Database:** `PostgreSQL` (Cloud serverless provider `Neon.tech`) + `Prisma ORM` as a type-safe data access layer.
*   **State Management:** `Zustand` (Isolated actions and slices confined strictly to the `entities` layer).
*   **Architectural Methodology:** `Feature-Sliced Design (FSD)` with full isolation of end-to-end features and zero cross-feature dependencies.
*   **Internationalization:** `Next-intl` (Comprehensive `ru` / `en` locale routing, including robust Server Components support).
*   **Styling & UI:** `Tailwind CSS` + `Shadcn UI` (Radix primitives finely tuned and optimized for premium Dark Mode aesthetics).
*   **Code Quality:** `ESLint 8+` (Flat Config) + `eslint-plugin-simple-import-sort` for enforced automatic hygiene of the import hierarchy on save.

---

## 🧠 Engineering Insights & Solved Challenges (Architectural Focus)

The development process successfully addressed critical fullstack bottlenecks frequently encountered in production-grade software:

1.  **Fault-Tolerant UI (Graceful Region Block Handling):** Direct requests to Google Gemini API are strictly blocked at the gateway level for users in certain CIS regions (RU/BY). The app addresses this with a proactive warning pattern: the UI alerts the user via a balanced amber-alert status before execution. The server-side `catch` layer extracts raw HTTP error codes programmatically (preventing fragile string parsing) to output meaningful user-facing feedback instead of app crashes.
2.  **Secure Anonymous Session Management:** Guest user sessions are assigned a secure UUID written into an `httpOnly` cookie with `secure` and explicit `sameSite: "lax"` flags enabled, mitigating Cross-Site Request Forgery (CSRF) vulnerabilities.
3.  **Elimination of Cascading Renders & Hydration Mismatch:** The browser synchronization logic for `sessionStorage` (used to instantly drop anonymous session tokens when a browser tab closes) has been completely decoupled from heavy `useEffect` hooks and reactive `setState` cascades. Implementing the cutting-edge React 18/19 `useSyncExternalStore` hook eliminated Next.js server/client mismatch alerts and guaranteed exactly zero redundant re-renders.
4.  **SOLID & Ultra-Thin Controllers:** Server Actions are heavily deconstructed. Web scraping, Google Gemini configurations, and Prisma data mutations are moved to completely isolated API services. The core Action acts exclusively as a thin runtime orchestrator.

---

## 🔮 Roadmap: Upcoming Sprints & Scalability

The project is architected for massive horizontal growth. The structural flexibility of FSD allows for seamless introduction of large modules scheduled for the upcoming sprints:

*   **🔒 Full Authentication & User Dashboard:** Integration of NextAuth.js / Auth.js for user onboarding. Upon registration, existing guest report entries will seamlessly migrate from temporary tables into the user's relational DB history.
*   **🎯 AI Interview Simulator (Targeted Q&A Generator):** An advanced AI sub-module that leverages the extracted `Missing Skills` gap analysis to generate a personalized list of technical questions the candidate is highly likely to encounter during the interview, paired with perfect model answers.
*   **✍️ Smart AI Cover Letter Generator:** An automated service that composes tailored, high-converting cover letters for specific vacancies. The AI dynamically emphasizes the resume's `Matched Skills` while safely framing or smoothing out missing areas to maximize response rates.
