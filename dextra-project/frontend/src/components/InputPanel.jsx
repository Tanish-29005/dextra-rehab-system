import { useState } from "react";

export default function InputPanel({ setPlanBundle }) {
  const [input, setInput] = useState("");

  const parsePlan = async () => {
    const res = await fetch("http://localhost:3001/api/plan/parse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: input }),
    });

    const data = await res.json();
    setPlanBundle(data);
  };

  return (
    <div className="card">
      <h3>Instruction</h3>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter instruction..."
      />

      <button className="primary" onClick={parsePlan}>
        Parse Plan
      </button>
    </div>
  );
}