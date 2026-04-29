import { useState } from "react";
import "./App.css";

import Dashboard from "./pages/Dashboard.jsx";
import Rehab from "./pages/Rehab.jsx";

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="app">
      <div className="nav">
        <button
          className={page === "dashboard" ? "active" : ""}
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={page === "rehab" ? "active" : ""}
          onClick={() => setPage("rehab")}
        >
          Rehab Coach
        </button>
      </div>

      {page === "dashboard" && <Dashboard />}
      {page === "rehab" && <Rehab />}
    </div>
  );
}