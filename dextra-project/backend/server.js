import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import { spawn } from "child_process";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

const PORT = 3001;

// =====================
// STATE
// =====================
let pyProcess = null;
let activePlan = null;
let exerciseSession = null;

// =====================
// WEBSOCKET BROADCAST
// =====================
function broadcast(type, payload) {
  const msg = JSON.stringify({ type, payload });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
}

// =====================
// PYTHON CONTROL
// =====================
app.post("/api/python/start", (req, res) => {
  if (pyProcess) {
    return res.json({ ok: true, msg: "Already running" });
  }

  pyProcess = spawn("python", ["../python/hand_tracking.py"], {
    stdio: "inherit",
  });

  pyProcess.on("close", () => {
    console.log("Python stopped");
    pyProcess = null;
  });

  res.json({ ok: true });
});

app.post("/api/python/stop", (req, res) => {
  if (pyProcess) {
    pyProcess.kill();
    pyProcess = null;
  }
  res.json({ ok: true });
});

// =====================
// TELEMETRY (FROM PYTHON)
// =====================
app.post("/api/telemetry", (req, res) => {
  const { flexion = 0, fingers = {} } = req.body;

  // Send raw telemetry to frontend
  broadcast("TELEMETRY", { flexion, fingers });

  // If rehab running → fake validation logic (simple)
  if (exerciseSession?.running) {
    const avg =
      Object.values(fingers).reduce((a, b) => a + b, 0) / 5;

    const validation = {
      overallScore: Math.round(avg),
      isCorrect: avg > 50,
      phase: "HOLD",
    };

    broadcast("VALIDATION", validation);
  }

  res.json({ ok: true });
});

// =====================
// PLAN PARSE (simple)
// =====================
app.post("/api/plan/parse", (req, res) => {
  const { text } = req.body;

  // Simple dummy parser (you can replace later)
  const plan = {
    exercise: "grip",
    intensity: "medium",
    reps: 10,
    holdTime: 5,
    restTime: 3,
  };

  activePlan = plan;

  res.json({ ok: true, plan });
});

// =====================
// SESSION CONTROL
// =====================
app.post("/api/plan/start", (req, res) => {
  exerciseSession = {
    running: true,
  };

  res.json({ ok: true });
});

app.post("/api/plan/stop", (req, res) => {
  if (exerciseSession) {
    exerciseSession.running = false;
  }

  broadcast("EXERCISE_COMPLETE", {});

  res.json({ ok: true });
});

app.post("/api/insights", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    Generate physiotherapy report:
    - Grip strength
    - Finger coordination
    - Suggestions for improvement
    `;

    const result = await model.generateContent(prompt);
    res.send(result.response.text());
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating report");
  }
});
// =====================
server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});