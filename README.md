# OpsPilot AI

## AI-Powered Operations Intelligence Assistant

OpsPilot AI is an AI-powered operations assistant built for the AI Infra Summit Hackathon 2026.

It helps operations teams turn real-world operational problems into actionable decisions. Users describe an operational situation, and the system uses Gemini AI to identify the situation, assess risk and priority, identify possible causes, and recommend practical next actions.

## Live Demo

https://ops-pilot-ai-jade.vercel.app/

## Features

- AI-powered operational situation analysis
- Risk level assessment
- Priority assessment
- Possible cause identification
- Three practical recommended actions
- Analysis history
- Example operational scenarios
- Loading and error states
- Responsive and professional dashboard UI
- Gemini AI integration
- Production deployment with Vercel

## How It Works

1. User describes an operational problem.
2. OpsPilot AI sends the situation to the AI analysis API.
3. Gemini AI evaluates the operational situation.
4. The system generates:
   - Situation summary
   - Risk level
   - Priority
   - Possible cause
   - Recommended actions
5. The result is displayed in the AI Analysis dashboard.
6. Previous analyses are stored in the browser history.

## Intelligence Pipeline

Situation → AI Reasoning → Risk Assessment → Recommended Action

## Example

### Input

> The production server is running slowly and several users are experiencing timeout errors.

### AI Output

- Risk Level: High
- Priority: High
- Situation Summary: Production server performance degradation causing user timeout errors.
- Possible Cause: High CPU or memory utilization, network congestion, or database connection bottlenecks.
- Recommended Actions:
  1. Check server resource metrics.
  2. Inspect application and database logs.
  3. Scale resources or restart affected services if necessary.

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express
- CORS
- dotenv

### AI

- Google Gemini AI
- @google/genai

### Deployment

- Vercel
- GitHub

## Project Structure

```text
AIInfraHackathon/
├── api/
│   └── analyze.js
├── public/
├── server/
│   ├── index.js
│   └── package.json
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── index.css
├── .gitignore
├── package.json
├── vite.config.js
└── README.md