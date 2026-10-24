const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

const trains = [
  {
    trainNumber: "12657",
    trainName: "Bengaluru Mail (Demo)",
    stationCode: "MAS",
    stationName: "Chennai Central",
    platform: "5",
    status: "Sample data",
    updatedAt: new Date().toISOString(),
    source: "DEMO — not live railway data",
    reports: 2
  },
  {
    trainNumber: "12658",
    trainName: "Chennai Mail (Demo)",
    stationCode: "SBC",
    stationName: "KSR Bengaluru",
    platform: "3",
    status: "Sample data",
    updatedAt: new Date().toISOString(),
    source: "DEMO — not live railway data",
    reports: 1
  },
  {
    trainNumber: "12007",
    trainName: "Shatabdi Express (Demo)",
    stationCode: "SBC",
    stationName: "KSR Bengaluru",
    platform: "1",
    status: "Sample data",
    updatedAt: new Date().toISOString(),
    source: "DEMO — not live railway data",
    reports: 0
  }
];

const reports = [];

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "PlatformPulse API", timestamp: new Date().toISOString() });
});

app.get("/api/trains", (req, res) => {
  const query = String(req.query.q || "").trim().toLowerCase();
  const results = trains.filter(t =>
    !query ||
    t.trainNumber.toLowerCase().includes(query) ||
    t.trainName.toLowerCase().includes(query) ||
    t.stationCode.toLowerCase().includes(query) ||
    t.stationName.toLowerCase().includes(query)
  );
  res.json({ demo: true, notice: "Sample data only; verify platform information at the station.", trains: results });
});

app.get("/api/reports", (_req, res) => {
  res.json({ reports: reports.slice(-50).reverse() });
});

app.post("/api/reports", (req, res) => {
  const trainNumber = String(req.body.trainNumber || "").trim();
  const station = String(req.body.station || "").trim().slice(0, 80);
  const platform = String(req.body.platform || "").trim().slice(0, 12);
  const reporter = String(req.body.reporter || "Passenger").trim().slice(0, 40) || "Passenger";

  if (!/^\d{4,6}$/.test(trainNumber) || !station || !platform) {
    return res.status(400).json({ error: "Enter a 4–6 digit train number, station, and platform." });
  }

  const report = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    trainNumber,
    station,
    platform,
    reporter,
    submittedAt: new Date().toISOString(),
    verification: "Unverified passenger report"
  };
  reports.push(report);
  res.status(201).json({
    message: "Report received. It is unverified and should not replace official station information.",
    report
  });
});

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`PlatformPulse running on port ${PORT}`));
