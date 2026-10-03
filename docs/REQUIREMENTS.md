Build a brand-new standalone **Agentic Restaurant Finder** in:

`C:\dev\piza\food`

Do not inspect, import, reference, or copy code from any other project or sibling directory.

## Stack

Backend:
- NestJS
- TypeScript strict
- Node.js
- OOP
- SOLID
- Dependency Injection
- Modular architecture

Frontend:
- Angular
- TypeScript
- SCSS
- Standalone components

## Goal

The system receives a natural-language restaurant request and returns only verified Google restaurant results.

The model is responsible for planning and choosing actions.

Tools provide factual data.

Deterministic code validates and filters results.

The model must never invent restaurant names, locations, opening hours, distances, ratings, or other place facts.

## Locked Agent Flow

1. Agent reasons about the request.
2. If required location is missing:
   - stop the turn
   - ask exactly one clarification question
   - do not search
3. If the user provides a named place or address:
   - call `geocode_location`
4. If device GPS is already provided:
   - skip geocoding
5. Agent chooses:
   - `google_text_search`
   - or `google_nearby_search`
6. Raw Google results are passed through deterministic verification.
7. Verification checks:
   - distance
   - opening state
   - cuisine/dish fit
8. Allow one retry only on soft failure:
   - geocode failure
   - or zero results when the radius was system-defaulted
9. Never widen a radius explicitly supplied by the user.
10. Finish with verified places only.

## Agent-Selectable Tools

Only these actions are selectable by the agent:

- `geocode_location`
- `google_text_search`
- `google_nearby_search`

`filter_and_verify` is **not a tool**.

It is mandatory deterministic application code and cannot be skipped by the model.

Clarification is also **not a tool**. It is an `AgentDecision`.

## Core Domain

Define and maintain strongly typed contracts for:

- `AgentState`
- `AgentSession`
- `Slots`
- `Coordinates`
- `RadiusSource`
- `AgentStatus`
- `FinishReason`
- `AgentError`
- `TraceEvent`
- `AgentDecision`
- `AgentResponse`
- `VerifiedPlace`
- `RawPlace`
- `Tool<I, O>`
- `ResultVerifier`
- `TraceRecorder`
- `GooglePlacesClient`
- `LlmClient`

## Locked Limits

- `maxSteps = 6`
- `maxSearchAttempts = 2`
- `maxClarificationsPerTurn = 1`
- `defaultRadiusMeters = 1500`

`RadiusSource` must be exactly:

```ts
'default' | 'explicit'
```

## Locked Finish Reasons

Only:

```text
missing_location
verified
no_results_explicit_radius
radius_widened
max_steps
failed
```

No free-form finish reason strings.

## Statuses

Only:

```text
searching
need_input
done
failed
```

## Agent Decisions

Only:

```text
ASK_CLARIFICATION
CALL_TOOL
FINISH
```

No separate ask tool.

## Location Model

Location must explicitly represent:

- GPS
- named place
- address
- missing

GPS skips geocoding.

Named places and addresses require geocoding before coordinate-based nearby search.

## Result Verification

`ResultVerifier` is synchronous deterministic code.

Input:
- raw candidates
- extracted slots

Output:
- verified places
- rejected places
- rejection reasons

It must never call:
- the LLM
- Google
- another tool

## Response Rules

The final response should support:

- `reply`
- `status`
- `question`
- `anchors`
- `places`
- `meta`
- `trace`

The final prose may mention a restaurant only if that restaurant exists in the verified `places` collection.

## Traceability

Every run must produce a structured, readable trace containing:

- model decision
- tool call
- tool arguments
- tool result
- state transition
- retry
- clarification
- failure
- finish reason

Every event must contain:
- step
- timestamp
- strongly typed payload

Tracing behavior belongs in `TraceRecorder`, not inside state objects.

## Engineering Rules

- Strict TypeScript
- No `any`
- `typescript/no-explicit-any = error`
- `strictPropertyInitialization = true`
- `noImplicitAny = true`
- `noUncheckedIndexedAccess = true`
- `exactOptionalPropertyTypes = true`
- `noImplicitOverride = true`
- OOP where it creates clear ownership
- SOLID
- Dependency Injection
- no hidden mutable global state
- immutable/readonly domain data where practical
- state contains data only
- tools do not call the model
- agent does not call Google directly
- Google access goes through `GooglePlacesClient`
- deterministic rules are never delegated to the LLM
- API keys stay server-side
- architecture must remain easy to debug and unit test

## Delivery Strategy

Build in baby steps.

### Step 1 — Technical Foundation and Contracts

Create:
- NestJS backend
- Angular frontend
- strict TypeScript configuration
- build/typecheck/lint/test infrastructure
- domain contracts
- tool contracts
- dependency ports
- state types
- trace types
- response types

No runtime agent behavior.

Exit:
- backend typecheck passes
- backend build passes
- backend tests pass
- backend lint passes
- frontend typecheck passes
- frontend build passes

### Step 2 — Agent Behavior with Fakes Only

Implement:
- `RestaurantAgent`
- `AgentSession` state transitions
- agent loop
- `TraceRecorder`
- deterministic `ResultVerifier`
- fake/scripted `LlmClient`
- fake geocode tool
- fake text-search tool
- fake nearby-search tool

No external APIs.

Prove these scenarios:
1. Missing location → one clarification question
2. GPS request → skip geocode → nearby search
3. Named place → geocode → search
4. Default radius returns zero → one retry allowed
5. Explicit radius returns zero → no widening
6. Agent cannot return an unverified restaurant
7. Step/search limits terminate correctly

### Step 3 — Real Google Integration

Implement real server-side:
- Google Geocoding
- Google Places Text Search
- Google Places Nearby Search

All Google calls must stay behind `GooglePlacesClient` and tool classes.

Keep deterministic verification unchanged.

### Step 4 — Real LLM Integration

Connect a real LLM behind `LlmClient`.

The LLM:
- reads current state
- chooses allowed next action
- supplies typed tool arguments
- asks clarification when necessary
- decides when to finish

Use structured outputs and runtime schema validation.

The LLM may not bypass guardrails or verification.

### Step 5 — Backend API

Expose one NestJS endpoint:

```text
POST /agent
```

It receives:
- user message
- optional GPS coordinates
- optional session/turn context

It returns:
- reply
- status
- question
- anchors
- verified places
- metadata
- trace

### Step 6 — Angular UI

Build:
- chat interface
- restaurant cards
- optional location/GPS input
- execution trace viewer

The UI renders restaurant information only from the structured `places` response, never by parsing model prose.

### Step 7 — Scenario and Failure Testing

Test at minimum:

- `"italian restaurant within 300 meters of the Champs-Élysées in Paris"`
- `"open hamburger near me"` with GPS
- `"I want a burger"` without location
- default-radius soft failure and one retry
- explicit-radius zero results with no widening
- geocode failure
- model attempts to name a restaurant that no search returned
- max steps reached
- Google failure
- malformed LLM decision

## Explicitly Out of Scope Until the Core Agent Works

Do not add prematurely:

- LangChain
- LangGraph
- multi-agent architecture
- Redis
- database
- RAG
- embeddings
- vector DB
- persistent memory
- authentication
- reservations
- menus
- complex dietary logic
- extra Google enrichment
- production observability platforms

## Later Learning Phase

After the manual TypeScript agent works and is fully understood:

1. Rebuild or migrate the same state/tool loop using LangGraph.
2. Add memory only when there is a concrete requirement.
3. Add RAG/vector search only for real knowledge gaps that Google Places cannot solve.
4. Consider multi-agent architecture only if a single-agent design becomes measurably insufficient.
