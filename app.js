const trainList = document.querySelector("#trainList");
const resultCount = document.querySelector("#resultCount");
const empty = document.querySelector("#empty");
const searchInput = document.querySelector("#search");
const form = document.querySelector("#reportForm");
const formMessage = document.querySelector("#formMessage");

function formatTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Time unavailable" : date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[ch]));
}

function renderTrains(trains) {
  resultCount.textContent = `${trains.length} result${trains.length === 1 ? "" : "s"}`;
  empty.classList.toggle("hidden", trains.length !== 0);
  trainList.innerHTML = trains.map(t => `
    <article class="train-card">
      <div class="card-top"><span class="train-number">${escapeHTML(t.trainNumber)}</span><span class="demo-label">DEMO DATA</span></div>
      <h3>${escapeHTML(t.trainName)}</h3>
      <div class="station">${escapeHTML(t.stationName)} · ${escapeHTML(t.stationCode)}</div>
      <div class="platform-row"><div><div class="platform-label">Sample platform</div><div class="muted">Verify at station</div></div><div class="platform-number">${escapeHTML(t.platform)}</div></div>
      <div class="updated">Updated ${formatTime(t.updatedAt)}</div>
      <div class="updated">${escapeHTML(t.source)}</div>
    </article>`).join("");
}

async function loadTrains() {
  const query = searchInput.value.trim();
  try {
    const response = await fetch(`/api/trains?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Request failed");
    const data = await response.json();
    renderTrains(data.trains);
  } catch {
    trainList.innerHTML = '<p class="muted">Could not load train data. Check that the server is running.</p>';
    resultCount.textContent = "Unavailable";
  }
}

async function loadReports() {
  const list = document.querySelector("#reportsList");
  try {
    const response = await fetch("/api/reports");
    const data = await response.json();
    if (!data.reports.length) {
      list.innerHTML = '<p class="muted">No reports submitted in this session yet. Try submitting a sighting above.</p>';
      return;
    }
    list.innerHTML = data.reports.map(r => `
      <article class="report-item">
        <div><strong>Train ${escapeHTML(r.trainNumber)} · Platform ${escapeHTML(r.platform)}</strong>
          <p>${escapeHTML(r.station)} · Reported by ${escapeHTML(r.reporter)} · ${formatTime(r.submittedAt)}</p></div>
        <div class="unverified">● ${escapeHTML(r.verification)}</div>
      </article>`).join("");
  } catch {
    list.innerHTML = '<p class="muted">Could not load reports.</p>';
  }
}

document.querySelector("#searchBtn").addEventListener("click", loadTrains);
searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter") loadTrains();
});
searchInput.addEventListener("input", () => {
  clearTimeout(window.searchDelay);
  window.searchDelay = setTimeout(loadTrains, 180);
});
document.querySelector("#refreshReports").addEventListener("click", loadReports);

form.addEventListener("submit", async event => {
  event.preventDefault();
  formMessage.textContent = "Submitting…";
  const values = Object.fromEntries(new FormData(form).entries());
  try {
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not submit report.");
    formMessage.textContent = result.message;
    form.reset();
    await loadReports();
  } catch (error) {
    formMessage.textContent = error.message || "Could not submit report.";
  }
});

loadTrains();
loadReports();
