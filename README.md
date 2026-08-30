# OpsPilot AI

## AI-Powered Operations Intelligence Assistant

OpsPilot AI is an AI-powered operations assistant built for the AI Infra Summit Hackathon 2026.

It helps operations teams turn real-world operational problems into actionable decisions. Users describe an operational situation, and Gemini AI analyzes the situation and provides a risk level, priority, possible cause, and recommended next actions.

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
- Loading and error handling
- Responsive dashboard UI
- Google Gemini AI integration
- Vercel deployment

## How It Works

1. User describes an operational problem.
2. OpsPilot AI sends the situation to the AI analysis API.
3. Gemini AI analyzes the operational situation.
4. The system generates:
   - Situation summary
   - Risk level
   - Priority
   - Possible cause
   - Recommended actions
5. The result is displayed in the dashboard.
6. Previous analyses can be viewed in history.

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

## API Endpoint

### POST `/api/analyze`

Example request:

```json
{
  "situation": "The production server is running slowly."
}