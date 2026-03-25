# AskIt 🚀 | Multi-Model AI Aggregator

**AskIt** allows users to query multiple Large Language Models (LLMs) simultaneously, providing a side-by-side performance and latency comparison.

!

## 🌟 Key Features
* **Multi-Model Inference:** Concurrent querying of Gemini 1.5 Flash, ChatGPT, Claude, and Grok.
* **Real-time Latency Tracking:** Measures and displays exact response times for performance benchmarking.
* **Decoupled Architecture:** Built with a high-speed Next.js frontend and a robust FastAPI backend.
* **Responsive UI:** A dark-themed, glassmorphic dashboard designed for clarity and efficiency.

---

## 🏗️ Technical Stack

### Frontend
* **Framework:** Next.js 16 (App Router)
* **Styling:** Tailwind CSS + Shadcn UI
* **Icons:** Lucide React
* **Deployment:** Vercel

### Backend
* **Language:** Python 3.10+
* **Framework:** FastAPI
* **AI Integration:** Google Generative AI (Gemini SDK)
* **Deployment:** Render

---

## 📂 Project Structure
```text
AskIt/
├── frontend/           # Next.js Application
│   ├── app/            # Main dashboard logic
│   ├── components/     # UI elements (FlashCards, Sidebar)
│   └── package.json    # Frontend dependencies
├── backend/            # Python FastAPI Service
│   ├── main.py         # API Endpoints & Gemini Logic
│   └── requirements.txt # Python dependencies
└── README.md
