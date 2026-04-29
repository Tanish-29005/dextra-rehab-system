import { useEffect, useState } from "react";

export default function Dashboard() {
  const [flexion, setFlexion] = useState(0);
  const [force, setForce] = useState(0);
  const [fingers, setFingers] = useState({});
  const [report, setReport] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === "TELEMETRY") {
        setFlexion(msg.payload.flexion || 0);
        setForce(msg.payload.flexion || 0);
        setFingers(msg.payload.fingers || {});
      }
    };

    return () => ws.close();
  }, []);

  const generateReport = async () => {
    const res = await fetch("http://localhost:3001/api/insights", {
      method: "POST",
    });
    const text = await res.text();
    setReport(text);
  };

  const startPython = () => {
    fetch("http://localhost:3001/api/python/start", { method: "POST" });
  };

  const stopPython = () => {
    fetch("http://localhost:3001/api/python/stop", { method: "POST" });
  };

  const fingerNames = ["THUMB","INDEX","MIDDLE","RING","PINKY"];

  return (
    <div className="dashboard">

      {/* LEFT PANEL */}
      <div className="sidebar">

        <div className="stat-card">
          <p>TOTAL GRIPS</p>
          <div className="stat-value">{Math.round(flexion)}</div>
        </div>

        <div className="stat-card">
          <p>PEAK FORCE</p>
          <div className="stat-value">{force}%</div>
        </div>

        <div className="stat-card">
          <p>MAX FLEXION</p>
          <div className="stat-value">{flexion}</div>
        </div>

        <button className="start-btn" onClick={startPython}>
          Start Camera
        </button>

        <button className="start-btn stop" onClick={stopPython}>
          Stop Camera
        </button>
      </div>

      {/* CENTER */}
      <div className="center">

        <div className="flex-row">

          <div className="card">
            <p>GRIP FLEXION</p>
            <div className="arc">{flexion}%</div>
          </div>

          <div className="card">
            <p>FSR FORCE</p>
            <div className="force-track">
              <div
                className="force-fill"
                style={{ width: `${force}%` }}
              />
            </div>
          </div>

        </div>

        {/* FINGERS */}
        <div className="card">
          <p>Per Finger Flexion</p>

          <div className="finger-row">
            {fingerNames.map((f) => (
              <div className="finger" key={f}>
                <div className="finger-bar">
                  <div
                    className="finger-fill"
                    style={{ height: `${fingers[f] || 0}%` }}
                  />
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="right">

        <button className="generate-btn" onClick={generateReport}>
          Generate Report
        </button>

        <div className="report-box">
          {report || "No report yet..."}
        </div>

      </div>
    </div>
  );
}