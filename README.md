# Agentic Restaurant Finder

An agent that finds restaurants from a natural-language request. An LLM chooses among three tools (`geocode_location`, `google_text_search`, `google_nearby_search`); deterministic application code enforces limits and verifies every result. Only verified places reach the UI.

## Layout
- `backend/`: NestJS + TypeScript (strict, ESM).
- `frontend/`: Angular + TypeScript + SCSS.
- `docs/`: sprint plan and requirements.

## Backend checks
```powershell
cd backend
npm install
npm run typecheck
npm run build
npm test
npm run lint
```

## Frontend build
```powershell
cd frontend
npm install
npx ng build
```

## Where to look
- [docs/SPRINTS.md](docs/SPRINTS.md): sprint plan and exit criteria.
- [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md): locked requirements.
- [.cursor/rules/00-project.mdc](.cursor/rules/00-project.mdc): architecture invariants and coding standards.
