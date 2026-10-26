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
  const [apiConnected, setApiConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadInterfaces() {
    try {
      const response = await fetch(`${API}/interfaces`);

      if (!response.ok) {
        throw new Error("Could not load interfaces");
      }

      const data = await response.json();
      const items = data.interfaces || [];

      setInterfaces(items);
      setApiConnected(true);

      if (items.length && !items.includes(networkInterface)) {
        setNetworkInterface(items.includes("eth0") ? "eth0" : items[0]);
      }

      setMessage("");
    } catch {
      setApiConnected(false);
      setMessage(
        "Cannot connect to FastAPI. Start the backend and check its connection."
      );
    }
  }

  async function loadStatus() {
    if (!networkInterface) return;

    try {
      const response = await fetch(
        `${API}/status/${encodeURIComponent(networkInterface)}`
      );

      if (!response.ok) {
        throw new Error("Could not load network status");
      }

      const data = await response.json();

      setStatus(data.status || "No status available");
      setApiConnected(true);
    } catch {
      setStatus("Unable to load status. Check the FastAPI backend.");
      setApiConnected(false);
    }
  }

  function addActivity(action, details) {
    const entry = {
      id: Date.now(),
      time: new Date().toLocaleString(),
      action,
      details,
    };

    setActivity((previous) => [entry, ...previous]);
  }

  async function applyConfiguration(event) {
    event.preventDefault();
    setMessage("");

    if (!networkInterface) {
      setMessage("Please select a network interface.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interface: networkInterface,
          latency: Number(latency),
          packet_loss: Number(packetLoss),
          jitter: Number(jitter),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.error || "Configuration failed"
        );
      }

      const details =
        `Interface: ${networkInterface} · ` +
        `Latency: ${latency} ms · ` +
        `Packet loss: ${packetLoss}% · ` +
        `Jitter: ${jitter} ms`;

      addActivity("Applied network configuration", details);

      setMessage(
        data.message || "Network configuration applied successfully."
      );

      await loadStatus();
    } catch (error) {
      setMessage(
        error.message || "Could not apply network configuration."
      );
    } finally {
      setLoading(false);
    }
  }

  async function resetNetwork() {
    if (!networkInterface) {
      setMessage("Please select a network interface.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API}/reset?interface=${encodeURIComponent(networkInterface)}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.error || "Network reset failed"
        );
      }

      addActivity(
        "Reset network configuration",
        `Interface: ${networkInterface} · NetEm configuration removed`
      );

      setLatency(0);
      setPacketLoss(0);
      setJitter(0);

      setMessage(
        data.message || "Network configuration reset successfully."
      );

      await loadStatus();
    } catch (error) {
      setMessage(
        error.message || "Could not reset network configuration."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInterfaces();
  }, []);

  useEffect(() => {
    loadStatus();
  }, [networkInterface]);

  function navigate(page) {
    setActivePage(page);
    setMessage("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function renderDashboard() {
    return (
      <>
        <section className="metrics">
          <article className="metric-card">
            <span>Selected interface</span>
            <strong>{networkInterface || "—"}</strong>
            <small>Linux network device</small>
          </article>

          <article className="metric-card">
            <span>Latency</span>
            <strong>
              {latency} <small>ms</small>
            </strong>
            <small>Selected target</small>
          </article>

          <article className="metric-card">
            <span>Packet loss</span>
            <strong>
              {packetLoss}
              <small>%</small>
            </strong>
            <small>Selected target</small>
          </article>

          <article className="metric-card">
            <span>Jitter</span>
            <strong>
              {jitter}
              <small> ms</small>
            </strong>
            <small>Selected target</small>
          </article>
        </section>

        <section className="workspace">
          <article className="panel">
            <div className="panel-heading">
              <div>
                <h2>Network overview</h2>
                <p>
                  Current information from your local Linux environment.
                </p>
              </div>
              <span className="panel-icon">⌁</span>
            </div>

            <div className="status-summary">
              <span className="status-dot" />

              <div>
                <strong>
                  Interface: {networkInterface || "Not selected"}
                </strong>
                <p>Linux Traffic Control (tc)</p>
              </div>
            </div>

            <label className="status-label">
              Current qdisc configuration
            </label>

            <pre className="status-output">{status}</pre>

            <button
              className="secondary-button"
              type="button"
              onClick={loadStatus}
            >
              Refresh status
            </button>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <div>
                <h2>Quick actions</h2>
                <p>Go directly to a tool.</p>
              </div>

              <span className="panel-icon">↗</span>
            </div>

            <button
              className="primary-button"
              type="button"
              onClick={() => navigate("Network Controls")}
            >
              Configure network
            </button>

            <button
              className="secondary-button"
              type="button"
              onClick={() => navigate("Activity")}
            >
              View activity history
            </button>

            <div className="info-note">
              <strong>About NetChaos</strong>

              <p>
                Simulate latency, packet loss, and jitter to test how
                applications behave under unstable network conditions.
              </p>
            </div>
          </article>
        </section>
      </>
    );
  }

  function renderControls() {
    return (
      <section className="workspace">
        <article className="panel controls-panel">
          <div className="panel-heading">
            <div>
              <h2>Network controls</h2>
              <p>
                Configure the conditions to apply to your interface.
              </p>
            </div>

            <span className="panel-icon">⌁</span>
          </div>

          <form onSubmit={applyConfiguration}>
            <label htmlFor="interface">Network interface</label>

            <select
              id="interface"
              value={networkInterface}
              onChange={(event) =>
                setNetworkInterface(event.target.value)
              }
              required
            >
              {interfaces.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
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
              onChange={(event) =>
                setLatency(event.target.value)
              }
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
              onChange={(event) =>
                setPacketLoss(event.target.value)
              }
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
              onChange={(event) =>
                setJitter(event.target.value)
              }
            />

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Applying..." : "Apply configuration"}
            </button>

            <button
              className="secondary-button"
              type="button"
              onClick={loadStatus}
              disabled={loading}
            >
              Refresh status
            </button>

            <button
              className="reset-button"
              type="button"
              onClick={resetNetwork}
              disabled={loading}
            >
              {loading ? "Working..." : "Reset network"}
            </button>
          </form>

          {message && (
            <p className="message" role="status">
              {message}
            </p>
          )}
        </article>

        <article className="panel status-panel">
          <div className="panel-heading">
            <div>
              <h2>Network status</h2>
              <p>Configuration reported by FastAPI.</p>
            </div>

            <span className="live-badge">
              {apiConnected ? "● CONNECTED" : "● DISCONNECTED"}
            </span>
          </div>

          <div className="status-summary">
            <span className="status-dot" />

            <div>
              <strong>
                {networkInterface || "No interface selected"}
              </strong>

              <p>Linux Traffic Control (tc)</p>
            </div>
          </div>

          <label className="status-label">
            Current configuration
          </label>

          <pre className="status-output">{status}</pre>
        </article>
      </section>
    );
  }

  function renderActivity() {
    return (
      <section className="panel activity-panel">
        <div className="panel-heading">
          <div>
            <h2>Activity history</h2>
            <p>
              Actions recorded during this browser session.
            </p>
          </div>

          <span className="panel-icon">◷</span>
        </div>

        {activity.length === 0 ? (
          <p className="subtitle">
            No actions recorded yet. Apply a network configuration
            to see successful changes here.
          </p>
        ) : (
          <div className="activity-list">
            {activity.map((entry) => (
              <article
                className="activity-entry"
                key={entry.id}
              >
                <strong>{entry.action}</strong>

                <p>{entry.details}</p>

                <small>{entry.time}</small>
              </article>
            ))}
          </div>
        )}

        <p className="subtitle">
          This history is temporary and will clear when the page is
          refreshed.
        </p>
      </section>
    );
  }

  const pageDescriptions = {
    Dashboard: "Monitor your local network test environment.",
    "Network Controls":
      "Configure latency, packet loss, and jitter.",
    Activity: "Review actions performed during this session.",
  };

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

        {["Dashboard", "Network Controls", "Activity"].map(
          (page) => (
            <button
              key={page}
              type="button"
              className={`nav-item ${
                activePage === page ? "active" : ""
              }`}
              aria-current={
                activePage === page ? "page" : undefined
              }
              onClick={() => navigate(page)}
            >
              <span aria-hidden="true">
                {page === "Dashboard"
                  ? "▦"
                  : page === "Network Controls"
                  ? "⌁"
                  : "◷"}
              </span>

              {page}
            </button>
          )
        )}

        <div className="sidebar-bottom">
          <span
            className="status-dot"
            style={{
              background: apiConnected ? "#36d399" : "#f59e0b",
            }}
          />

          {apiConnected
            ? "Local API Connected"
            : "Checking Local API"}

          <small>FastAPI · C++ · NetEm</small>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar" id="dashboard-section">
          <div>
            <p className="eyebrow">NETWORK MANAGEMENT</p>

            <h1>{activePage}</h1>

            <p className="subtitle">
              {pageDescriptions[activePage]}
            </p>
          </div>

          <span className="connection-badge">
            <span
              className="status-dot"
              style={{
                background: apiConnected ? "#36d399" : "#f59e0b",
              }}
            />

            {apiConnected ? "Local API" : "API unavailable"}
          </span>
        </header>

        {activePage === "Dashboard" && renderDashboard()}

        {activePage === "Network Controls" && renderControls()}

        {activePage === "Activity" && renderActivity()}

        {message && activePage !== "Network Controls" && (
          <p className="message" role="status">
            {message}
          </p>
        )}

        <footer>
          Network Chaos Emulator <span>·</span> React + FastAPI +
          Linux NetEm
        </footer>
      </section>
    </main>
  );
}

export default App;