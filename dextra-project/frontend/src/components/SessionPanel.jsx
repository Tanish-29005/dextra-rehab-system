import { useEffect, useState } from "react";

export default function SessionPanel({ setRunning }) {
  const [phase, setPhase] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === "VALIDATION") {
        const v = msg.payload;
        setPhase(v.phase);

        if (v.isCorrect) {
          setFeedback("Perfect form ✅");
        } else {
          setFeedback("Adjust grip ⚠️");
        }
      }

      if (msg.type === "SAFETY_ALERT") {
        setFeedback("⚠ Overextension!");
      }

      if (msg.type === "EXERCISE_COMPLETE") {
        alert("Session Complete!");
        setRunning(false);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="card">
      <h3>Live Feedback</h3>
      <p>Phase: {phase}</p>
      <p>{feedback}</p>
    </div>
  );
}