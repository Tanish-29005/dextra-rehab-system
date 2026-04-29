import { useState } from "react";
import InputPanel from "../components/InputPanel.jsx";
import PlanDisplay from "../components/PlanDisplay.jsx";
import SessionPanel from "../components/SessionPanel.jsx";

export default function Rehab() {
  const [plan, setPlan] = useState(null);
  const [running, setRunning] = useState(false);

  const start = async () => {
    await fetch("http://localhost:3001/api/plan/start", { method: "POST" });
    setRunning(true);
  };

  const stop = async () => {
    await fetch("http://localhost:3001/api/plan/stop", { method: "POST" });
    setRunning(false);
  };

  return (
    <div className="page">
      <h2>Rehab Coach</h2>

      <InputPanel setPlanBundle={setPlan} />

      {plan && <PlanDisplay planBundle={plan} />}

      {plan && (
        <button className="primary" onClick={running ? stop : start}>
          {running ? "STOP" : "START"}
        </button>
      )}

      {running && <SessionPanel setRunning={setRunning} />}
    </div>
  );
}