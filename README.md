
# SEN College Finder – Frontend

Vite + React + Tailwind frontend with GenAI-driven provider matching, **Instant Dossier Panel** and optional **Deep Dive**.

## Features

### GenAI-Driven Provider Matching
- **Prompt-first search**: Users describe what they're looking for in natural language
- **Intent extraction**: System infers requirements like residential preference, vocational interests, and SEND needs
- **Smart matching**: Results prioritize FE colleges and training providers, excluding schools by default
- **Match explanations**: Each result shows why it matched and what was understood from the search

### Key Capabilities
- Free-text prompt as primary input
- Location-based search (postcode + radius)
- Instant provider overview with match reasons
- Deep dive for detailed contact information and open day details

## Run (Windows)
```powershell
npm install
npm run dev
```
Open http://localhost:5173

## Connect to API
Create `.env` with:
```
VITE_API_BASE=http://localhost:8000
```
Restart `npm run dev`.

## API Integration
See [API_INTEGRATION.md](./API_INTEGRATION.md) for detailed API format and integration guide.

## Build for Production
```bash
npm run build
```

Output will be in `dist/` directory.
