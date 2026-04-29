# 🖐️ Dextra — Remote Physiotherapy System

> **🏆 Hackathon Winner — Don Bosco Institute of Technology | ₹10,000 Cash Prize**

Dextra is a remote physiotherapy platform that uses live hand tracking and AI-powered analytics to guide and monitor patients through rehabilitation exercises — no wearables, no clinic visit needed.

---

## 🎯 What It Does

| Feature | Description |
|---|---|
| ✋ Live Hand Tracking | Real-time hand landmark detection using MediaPipe |
| 🖐️ Per-Finger Analytics | Individual finger movement range, speed, and accuracy metrics |
| 💬 Interactive Feedback | Visual and audio cues to correct form during exercises |
| 📊 Session Reports | Auto-generated performance summaries after each session |
| 🤖 AI Insights | Google Gemini analyzes sessions and provides rehabilitation guidance |

---

## 🛠️ Tech Stack

- **Hand Tracking:** MediaPipe Hands
- **Computer Vision:** OpenCV
- **AI / Report Generation:** Google Gemini API
- **Language:** Python

---

## 🏗️ How It Works

```
Webcam Feed
     │
     ▼
┌──────────────────┐
│  MediaPipe Hands │  ──► 21 landmarks per hand, 30fps
└──────────────────┘
     │
     ▼
┌──────────────────┐
│  Per-Finger      │  ──► Flexion, extension, velocity per finger
│  Analytics Engine│
└──────────────────┘
     │
     ▼
┌──────────────────┐
│  Feedback System │  ──► Real-time overlay + audio prompts
└──────────────────┘
     │
     ▼
┌──────────────────┐
│  Gemini AI       │  ──► Session summary + personalized rehab advice
│  Report Engine   │
└──────────────────┘
```

---

## 🚀 Key Features

- **Zero hardware requirement** — works with any standard webcam
- **Per-finger granularity** — tracks each finger independently for targeted rehab
- **Real-time correction** — live visual overlays guide the patient mid-exercise
- **Automated Gemini reports** — plain-language AI summaries replace manual physiotherapist notes
- **Remote-ready** — designed for patients who can't visit a clinic

---

## ⚙️ Setup & Run

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/dextra.git
cd dextra

# Install dependencies
pip install opencv-python mediapipe google-generativeai

# Add your Gemini API key
export GEMINI_API_KEY=your_key_here

# Run
python main.py
```

---

## 🏆 Achievement

Won **3rd place** at the Don Bosco Institute of Technology Hackathon, awarded a **₹10,000 cash prize** for innovation in healthcare technology.

---

## 👤 Author

**Tanish Nagarkar**
[LinkedIn](https://linkedin.com/in/tanish-nagarkar-768384251) | [Email](mailto:tanishnagarkar@gmail.com)
