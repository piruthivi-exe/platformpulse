# PlatformPulse 🚆

**PlatformPulse** is a portfolio project exploring a common passenger problem: finding a train's platform quickly when app updates may be delayed.

Built with **Node.js, Express, HTML, CSS and vanilla JavaScript**. Designed for local development and deployment to Render.

> **Important:** The included train entries are fictional demo/sample data. This project does not connect to a live Indian Railways platform feed. Never rely on the sample platform numbers for real travel. Verify using official railway displays and announcements.

## Features

- Search sample trains by train number, train name, station code or station name.
- Clear demo-data and source labels plus update timestamps.
- Passenger platform-sighting submission form.
- Community reports are explicitly labelled **unverified**.
- REST API endpoints for train lookup, reports and health check.
- Responsive layout for mobile and desktop.
- No API keys required for the demo.

## Run locally

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npm start
```

Open <http://localhost:3000>.

For development with automatic restart (Node.js 18.11+):

```bash
npm run dev
```

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/trains` | List sample trains |
| GET | `/api/trains?q=12657` | Search sample trains |
| GET | `/api/reports` | Read community sightings |
| POST | `/api/reports` | Submit a passenger sighting |

Example request:

```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{"trainNumber":"12657","station":"MAS","platform":"4","reporter":"Passenger"}'
```

Reports are stored in memory for this demo and will be lost when the server restarts. For production, use a database such as PostgreSQL and add rate limiting, moderation, abuse prevention and audit logs.

## Deploy to Render

1. Create a GitHub repository named `platformpulse`.
2. Upload/push the project files to that repository.
3. In Render, choose **New → Web Service** and connect the repository.
4. Use these settings:
   - **Runtime:** Node
   - **Build command:** `npm install`
   - **Start command:** `npm start`
5. Deploy and open the generated Render URL.

The server uses `process.env.PORT`, as required by Render.

## Suggested next steps

1. Add PostgreSQL persistence for reports.
2. Add duplicate-report detection and community confidence scoring.
3. Add notifications for changes only after a trustworthy data source exists.
4. Integrate an authorized official data feed if access is available.
5. Display source, verification state, and last-updated time for every platform assignment.

## Project structure

```text
platformpulse/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── package.json
├── server.js
└── README.md
```

## GitHub description

A responsive railway platform information demo built with Node.js and Express, featuring train search, timestamps, and clearly labelled community platform reports.

## LinkedIn launch post

🚆 **Introducing PlatformPulse — a railway platform information project**

One frustrating part of train travel is trying to confirm the correct platform when digital updates are delayed.

I built PlatformPulse, a Node.js + Express project that explores a simpler experience:
- Search train and station information
- See timestamps and transparent source labels
- Submit passenger platform sightings
- Clearly distinguish unverified reports from official information

**Tech stack:** Node.js, Express, HTML, CSS, JavaScript, Render

This version uses sample data, not live railway platform assignments. My next steps are persistent storage, report verification and exploring authorized data integrations.

I’d love feedback and suggestions on how to make platform information more reliable and accessible.

#NodeJS #WebDevelopment #ExpressJS #BuildInPublic #Railways #PortfolioProject

## License

MIT — see `LICENSE`.
