
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [interfaces, setInterfaces] = useState([]);
  const [networkInterface, setNetworkInterface] = useState("eth0");
  const [latency, setLatency] = useState(100);
  const [packetLoss, setPacketLoss] = useState(0);
  const [jitter, setJitter] = useState(20);
  const [status, setStatus] = useState("Loading network status...");
  const [message, setMessage] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");
  const [activity, setActivity] = useState([]);

  async function loadInterfaces() {
    try {
      const response = await fetch(`${API}/interfaces`);
      if (!response.ok) throw new Error("Could not load interfaces");
      const data = await response.json();
      const items = data.interfaces || [];
      setInterfaces(items);

      if (items.length && !items.includes(networkInterface)) {
        setNetworkInterface(items.includes("eth0") ? "eth0" : items[0]);
      }
    } catch {
      setMessage("Cannot connect to FastAPI. Check that the backend is running.");
    }
  }

  async function loadStatus() {
    if (!networkInterface) return;

    try {
      const response = await fetch(
        `${API}/status/${encodeURIComponent(networkInterface)}`
      );
      if (!response.ok) throw new Error("Could not load network status");
      const data = await response.json();
      setStatus(data.status || "No status available");
    } catch {
      setStatus("Unable to load status. Check the FastAPI backend.");
    }
  }

  async function applyConfiguration(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interface: networkInterface,
          latency: Number(latency),
          packet_loss: Number(packetLoss),
          jitter: Number(jitter),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.detail || "Configuration failed");
      }

      const entry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        action: "Applied network configuration",
        details: `Interface: ${networkInterface} · Latency: ${latency} ms · Packet loss: ${packetLoss}% · Jitter: ${jitter} ms`,
      };

      setActivity((previous) => [entry, ...previous]);
      setMessage(data.message || "Network configuration applied.");
      await loadStatus();
    } catch (error) {
      setMessage(error.message || "Could not apply network configuration.");
    }
  }

  async function resetNetwork() {
    setMessage(
      "Reset is not connected yet. We need to add or verify a reset endpoint in FastAPI."
    );
  }

  useEffect(() => {
    loadInterfaces();
  }, []);

  useEffect(() => {
    loadStatus();
  }, [networkInterface]);

  function navigate(page) {
    setActivePage(page);

    if (page === "Network Controls") {
      document.getElementById("network-controls")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (page === "Dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (page === "Activity") {
      document.getElementById("activity-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">N</span>
          <div>
            <strong>NetChaos</strong>
            <small>NETWORK LAB</small>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>

        {["Dashboard", "Network Controls", "Activity"].map((page) => (
          <button
            key={page}
            type="button"
            className={`nav-item ${activePage === page ? "active" : ""}`}
            onClick={() => navigate(page)}
          >
            {page === "Dashboard" ? "▦" : page === "Network Controls" ? "⌁" : "◷"}
            &nbsp; {page}
          </button>
        ))}

        <div className="sidebar-bottom">
          <span className="status-dot" />
          Local Linux Environment
          <small>FastAPI · C++ · NetEm</small>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar" id="dashboard-section">
          <div>
            <p className="eyebrow">NETWORK MANAGEMENT</p>
            <h1>Network Dashboard</h1>
            <p className="subtitle">
              Simulate network conditions in your local test environment.
            </p>
          </div>
          <span className="connection-badge">
            <span className="status-dot" /> Local API
          </span>
        </header>

        <section className="metrics">
          <article className="metric-card">
            <span>Selected interface</span>
            <strong>{networkInterface || "—"}</strong>
            <small>Linux network device</small>
          </article>
          <article className="metric-card">
            <span>Latency</span>
            <strong>{latency} <small>ms</small></strong>
            <small>Configured target</small>
          </article>
          <article className="metric-card">
            <span>Packet loss</span>
            <strong>{packetLoss}<small>%</small></strong>
            <small>Configured target</small>
          </article>
          <article className="metric-card">
            <span>Jitter</span>
            <strong>{jitter}<small> ms</small></strong>
            <small>Configured variation</small>
          </article>
        </section>

        <section className="workspace">
          <article className="panel controls-panel" id="network-controls">
            <div className="panel-heading">
              <div>
                <h2>Network controls</h2>
                <p>Configure the conditions to apply.</p>
              </div>
              <span className="panel-icon">⌁</span>
            </div>

            <form onSubmit={applyConfiguration}>
              <label htmlFor="interface">Network interface</label>
              <select
                id="interface"
                value={networkInterface}
                onChange={(event) => setNetworkInterface(event.target.value)}
                required
              >
                {interfaces.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <div className="field-heading">
                <label htmlFor="latency">Latency</label>
                <strong>{latency} ms</strong>
              </div>
              <input
                id="latency"
                type="range"
                min="0"
                max="500"
                step="10"
                value={latency}
                onChange={(event) => setLatency(event.target.value)}
              />

              <div className="field-heading">
                <label htmlFor="packetLoss">Packet loss</label>
                <strong>{packetLoss}%</strong>
              </div>
              <input
                id="packetLoss"
                type="range"
                min="0"
                max="100"
                step="1"
                value={packetLoss}
                onChange={(event) => setPacketLoss(event.target.value)}
              />

              <div className="field-heading">
                <label htmlFor="jitter">Jitter</label>
                <strong>{jitter} ms</strong>
              </div>
              <input
                id="jitter"
                type="range"
                min="0"
                max="100"
                step="5"
                value={jitter}
                onChange={(event) => setJitter(event.target.value)}
              />

              <button className="primary-button" type="submit">
                Apply configuration
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={loadStatus}
              >
                Refresh status
              </button>
              <button
                className="reset-button"
                type="button"
                onClick={resetNetwork}
              >
                Reset network
              </button>
            </form>

            {message && <p className="message" role="status">{message}</p>}
          </article>

          <article className="panel status-panel">
            <div className="panel-heading">
              <div>
                <h2>Live network status</h2>
                <p>Reported by your FastAPI backend.</p>
              </div>
              <span className="live-badge">● LIVE</span>
            </div>

            <div className="status-summary">
              <span className="status-dot" />
              <div>
                <strong>Interface: {networkInterface || "Not selected"}</strong>
                <p>Linux Traffic Control (tc)</p>
              </div>
            </div>

            <label className="status-label">Current qdisc configuration</label>
            <pre className="status-output">{status}</pre>

            <div className="info-note">
              <strong>About this tool</strong>
              <p>
                NetEm applies delay, packet loss, and jitter to help test
                application behaviour under unstable network conditions.
              </p>
            </div>
          </article>
        </section>

        <section className="panel activity-panel" id="activity-section">
          <div className="panel-heading">
            <div>
              <h2>Activity history</h2>
              <p>Network configuration actions performed during this session.</p>
            </div>
            <span className="panel-icon">◷</span>
          </div>

          {activity.length === 0 ? (
            <p className="subtitle">
              No actions recorded yet. Apply a network configuration to see it here.
            </p>
          ) : (
            <div className="activity-list">
              {activity.map((entry) => (
                <article className="activity-entry" key={entry.id}>
                  <strong>{entry.action}</strong>
                  <p>{entry.details}</p>
                  <small>{entry.time}</small>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer>
          Network Chaos Emulator <span>·</span> React + FastAPI + Linux NetEm
        </footer>
      </section>
    </main>
  );
}

export default App;
