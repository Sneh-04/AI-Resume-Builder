# ResumeAI — AI-Powered Resume Builder

> Build professional resumes in minutes with real AI-generated content. Live preview, 3 premium templates, one-click PDF export.

![ResumeAI Banner](https://img.shields.io/badge/Powered%20by-Claude%20AI-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## ✨ Features

- **AI Summary Generator** — Powered by Claude (claude-sonnet-4), generates a tailored professional summary from your experience and skills
- **AI Bullet Point Writer** — Writes strong, action-verb-led bullet points for each job role
- **Live Preview** — See your resume update in real time as you type
- **3 Premium Templates** — Modern (dark sidebar), Classic (navy professional), Minimal (typographic)
- **Dark / Light Mode** — Full theme toggle across the builder UI
- **One-Click PDF Export** — Print-ready A4 PDF via html2pdf.js
- **Fully Responsive** — Works on desktop and mobile with tab-switching layout
- **All Sections Supported** — Personal info, experience, education, skills, projects, certifications & awards

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 |
| AI Integration | Anthropic Claude API (claude-sonnet-4) |
| PDF Export | html2pdf.js |
| Icons | Lucide React |
| Fonts | Playfair Display + DM Sans (Google Fonts) |
| Hosting | Vercel |

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-resume-builder.git
cd ai-resume-builder

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

---

## 🤖 How the AI Works

The app calls the **Anthropic Claude API** directly from the browser:

1. **Professional Summary** — Takes your name, title, experience, and skills → prompts Claude to write a 60-80 word ATS-friendly summary
2. **Experience Bullets** — Takes your job description → prompts Claude to write 3 achievement-focused bullet points with action verbs

The AI prompt is carefully engineered to produce:
- First-person professional tone
- Specific, impactful language
- ATS-compatible keywords
- Measurable outcomes where possible

---

## 📁 Project Structure

```
src/
├── components/
│   ├── LandingPage.jsx       # Hero landing page
│   ├── Builder.jsx           # Main builder layout (2-pane)
│   ├── FormPanel.jsx         # All form sections + AI buttons
│   ├── PreviewPanel.jsx      # Live resume preview wrapper
│   ├── TemplateSelector.jsx  # Template switcher UI
│   └── templates/
│       ├── ModernTemplate.jsx   # Dark sidebar with gold accents
│       ├── ClassicTemplate.jsx  # Traditional navy professional
│       └── MinimalTemplate.jsx  # Ultra-clean typographic
├── App.jsx                   # Root app + page routing
├── index.css                 # Global styles + CSS variables
└── main.jsx                  # React entry point
```

---

## 🖼️ Templates

| Template | Style | Best For |
|---|---|---|
| **Modern** | Dark sidebar, gold accents | Tech, Design, Creative roles |
| **Classic** | Navy header, two-column | Finance, Law, Corporate |
| **Minimal** | White space, red accent | Any role, clean & ATS-safe |

---

## 📄 License

MIT — free to use, modify, and distribute.

---

Built for **Techrise Internship Assignment** · Round 2 · Website Development
