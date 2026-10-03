# Agentic Restaurant Finder — Learning Sprints

## How to work

Each sprint adds one behavior, proven by one exit test, so you always know what changed and why.

- Pipeline per story: `/architect` → `/developer` → `/unit-test` → `/code-reviewer` → `/e2e-scenario` (from Sprint 2). One agent at a time, never in parallel.
- Core agent logic (`allowedActions`, guard, loop, retry, verifier rules, state transitions) is written only for the story explicitly assigned, never ahead of it.
- The human developer reads and understands every change before a story is closed.
- Test first: write the exit test, watch it fail, make it pass.
- One sprint = one branch = one commit you can explain line by line.
- Next sprint only when `typecheck`, `build`, `test`, and `lint` all pass.

**Every sprint has:** Goal · Scenario · Learn · Exit (the test that proves it).

**The loop shape (built so LangGraph is a translation, not a rewrite).** Nodes are pure functions `state → new state`; a router picks the next node:

```
state → allowedActions → decide (LLM) → guard → runTool → verify → update state → repeat → finish
```

- `allowedActions(state)`: deterministic list of legal next actions.
- `decide`: the LLM picks one, given state + allowed actions.
- `guard`: rejects any decision not in the allowed list.
- `runTool`: executes the tool, stores the observation.
- `verify`: always runs after every search. Fixed edge, never a model choice.
- `finish`: builds the response from verified places only.

```ts
while (!isTerminal(state)) {
  const next = route(state);        // pure: state -> node name
  state = await nodes[next](state); // each node returns new state
}
```

## Sprint 0 — Foundation

**Status: Done.** Backend typecheck, build, tests, lint, and the Angular build pass. The "Later, when a test needs it" item is deferred to Sprint 2.

**Done**

- [x] `.oxlintrc.json`: `typescript/no-explicit-any` → `error`.
- [x] `tsconfig.json`: `strictPropertyInitialization` → `true`.
- [x] `filter_and_verify` removed from `ToolName` and `ToolCall`; `ResultVerifier` is a synchronous, non-tool interface.
- [x] `test:e2e` script and `test/` lint path removed.

**Remaining**

- [x] Remove `reply` from `FinishDecision`; the reply is built by code from verified places. (Required before Sprint 1.)
- [x] Angular project (standalone, SCSS) builds.
- [ ] Later, when a test needs it: remove `trace` from state (Sprint 2), DI tokens for ports (Sprint 2). `previousSlots` on the session/state (Sprint 3, with clarification-resume).
- [x] Cleanup: README boilerplate, `deploy` script, `@nestjs/mau`, committed `tsbuildinfo`.

**Exit:** a type test (`// @ts-expect-error`) proves the model cannot express `CALL_TOOL filter_and_verify` or a `FINISH` with restaurant text, and all backend checks plus the frontend build pass.

## Sprint 0.5 — Lock the contracts (no behavior)

**Goal:** fix the tool and slot contracts now, so fakes in Sprints 1–7 match what real Google and a real LLM will need later.

**Learn:** capability boundaries. A fake that accepts inputs the real API rejects teaches you a flow that will break.

### Google Places API (New): what the docs say

| Topic | Nearby Search (New) | Text Search (New) |
| --- | --- | --- |
| Text input | Not supported; text queries must use Text Search | `textQuery`, required |
| Cuisine filter | `includedTypes` list, e.g. `italian_restaurant` | Free text, plus one optional `includedType` (`strictTypeFiltering` makes it hard) |
| Area | `locationRestriction` circle, required | `locationBias` circle or rectangle, or `locationRestriction` rectangle only |
| Open now | Check via response field | `openNow` request parameter |
| Response | Only fields named in the required field mask | Same |

Sources: [Migrate to Nearby Search (New)](https://developers.google.com/maps/documentation/places/web-service/migrate-nearby), [Nearby Search (New)](https://developers.google.com/maps/documentation/places/web-service/nearby-search), [Text Search (New)](https://developers.google.com/maps/documentation/places/web-service/text-search).

**What this changes in our contracts**

- [x] `PlaceType` is exactly five values: `italian_restaurant`, `hamburger_restaurant`, `pizza_restaurant`, `sushi_restaurant`, `restaurant`. `Circle` is `{ center: Coordinates, radiusMeters }`.
- [x] `GoogleNearbySearchInput`: `includedTypes` is a non-empty tuple `readonly [PlaceType, ...PlaceType[]]` and `locationRestriction: Circle`. `keyword` and `openNow` are removed; the verifier checks open state.
- [x] Tool choice becomes clear: cuisine maps to a Google type → nearby; a dish or free text ("carbonara", "smash burger") → text search.
- [x] `GoogleTextSearchInput`: `query` renamed `textQuery`; required `locationBias: Circle`; optional `includedType` and `openNow` use absence, not `null`. A circle can only bias, not restrict, so results outside the radius are expected and the verifier removes them.
- [x] Radius widening ("never widen an explicit radius") is NOT typed in tool inputs; it is deterministic behavior tested in Sprint 7.
- [x] `RawPlace.rating` stays nullable. Rating and opening hours sit in the most expensive Text Search SKU tier; the real field-mask and rating decision is deferred to Sprint 9.

### Slot contract (locked)

**Decision:** slot extraction is a separate first step, not part of each loop decision.

- `extractSlots(message: string, gps: Coordinates | null, previousSlots: Slots | null): Promise<Slots>` runs once per turn, before the loop. A `SlotExtractor` port (not a tool): fake now, LLM structured output in Sprint 10. `AgentSession` is unchanged in Sprint 0.5; `previousSlots` is added to session/state in Sprint 3 with the clarification-resume behavior. The DI token comes in Sprint 2.
- Inside the loop, slots change only through code: geocode result → `anchor`; retry → `radiusMeters` (only when `radiusSource` is `default`).
- The LLM decision never edits slots. It chooses actions; it doesn't rewrite what the user asked.
- Turn 2 of a clarification merges new slots over `previousSlots`.

**Exit:** updated contract files compile, plus one type test per change above.

**Status: Done.** Type specs for nearby, text, `ToolCall` and `SlotExtractor`; backend typecheck, build, tests and lint pass.

## Sprints 1–3 — Control, loop, clarification (fakes only)

### Sprint 1 — Legal actions

**Goal:** implement `allowedActions(state)` as a pure function.

**Scenario:** "open hamburger near me" with GPS.

**Learn:** state-driven control; deterministic guardrails; agent freedom vs business rules.

**Exit (table-driven tests):**

- GPS present → `geocode_location` not allowed; both searches allowed.
- Anchor null → no search allowed.
- Location missing → only `ASK_CLARIFICATION` allowed.
- A decision outside the list is rejected by `guard`, with a reason.
- A decision that names a restaurant not in any search result is rejected.

### Sprint 2 — First manual loop

**Goal:** write the loop yourself, with a minimal verifier and a trace from day one.

**Flow:** state → allowedActions → decide (scripted LLM) → guard → fake tool → verify → update state → repeat → finish.

**Learn:** ReAct-style loop; state transitions; termination; `maxSteps`; observability.

- [ ] `ScriptedLlmClient`, fake nearby search, `InMemoryTraceRecorder` with an injected clock.
- [ ] Minimal `ResultVerifier`: distance only (Haversine). `verify` always runs after a search.
- [ ] Trace events: decision, tool call, tool result, verification, state transition, finish.
- [ ] `finish` builds the reply from verified places only.

**Exit:** GPS → nearby → verified test passes; a place outside the radius never reaches the response; a looping script stops at 6 steps with `max_steps`; a malformed decision ends `failed` with a `failure` event.

### Sprint 3 — Clarification

**Scenario:** "I want a burger", no location.

**Learn:** human-in-the-loop; resumable state across turns.

**Exit:**

- Turn 1: status `need_input`, exactly one question, zero tool calls, a `clarification` trace event.
- `previousSlots` is added to session/state here (not in Sprint 0.5) so clarification-resume can restore it.
- Turn 2 ("Tel Aviv"): `previousSlots` keeps `burger`, and the agent proceeds to geocode.
- A second clarification in the same turn is rejected (`maxClarificationsPerTurn = 1`).

## Sprints 4–7 — Paths, strategy, verification, recovery (fakes only)

### Sprint 4 — Geocoding path

**Scenario:** "Italian food near Champs-Élysées".

**Flow:** place name → geocode → search → verify → finish.

**Learn:** tool dependency; observations feeding later decisions.

**Exit:** trace shows geocode → search → verify in that order; the geocoded point becomes `anchor`; search is not allowed before it exists. A partial or ambiguous geocode match leads to a clarification instead of a search.

### Sprint 5 — Search strategy

**Goal:** the agent chooses between text search and nearby search, using the contracts locked in Sprint 0.5.

**Learn:** tool selection; capability boundaries; structured tool arguments.

**Exit:** "italian" (maps to a Google type) → nearby with `includedTypes`; "carbonara" (a dish) → text search; a nearby call with free text cannot be expressed in the types.

### Sprint 6 — Full verification

**Goal:** the verifier checks distance, opening state, and cuisine or dish fit.

**Learn:** model reasoning vs deterministic policy; why business rules must not depend on the LLM.

**Exit (table-driven):** too far · closed · opening unknown when the user asked for open (rejected as `opening_unknown`) · cuisine mismatch · passes. Multiple rejection reasons per place; a `verification` trace event lists them.

### Sprint 7 — Retry and recovery

**Scenario:** default-radius search returns zero results.

**Learn:** recovery loops; soft vs hard failures; bounded autonomy.

**Exit:**

- Default radius, zero results → one retry, wider radius → `radius_widened`.
- Explicit 300 m, zero results → no retry → `no_results_explicit_radius`, even if the scripted LLM asks to widen.
- Geocode fails once → one retry → success.
- `searchAttempts` never exceeds 2; every retry has a `retry` trace event.

## Sprints 8–11 — Safety net, then real integrations

### Sprint 8 — Golden scenario tests

**Goal:** every requirement scenario has a named, deterministic test before anything real is plugged in.

**Learn:** regression testing; tests as the contract that later refactors must keep.

**Exit:** one green test each for Champs-Élysées 300 m, open hamburger with GPS, burger without location, default-radius retry, explicit radius with no widening, geocode failure, hallucinated restaurant, max steps, Google failure, malformed LLM decision.

### Sprint 9 — Real Google

**Goal:** swap the fake tools for real Geocoding, Text Search, and Nearby Search behind `GooglePlacesClient`.

**Learn:** ports and adapters; mapping an external API into domain types; production failure handling.

- [ ] Google-shaped types inside the adapter; tools map them to `RawPlace`.
- [ ] API key server-side only; minimal field mask.
- [ ] HTTP and quota errors → `AgentError`.
- [ ] Decide how to treat areas, not points (geocoding the 2 km Champs-Élysées returns one point).

**Exit:** contract tests against recorded JSON; one manual GPS run returns real places; Sprints 1–8 tests pass unchanged.

### Sprint 10 — Real LLM

**Goal:** a real model behind `LlmClient` and `SlotExtractor`.

**Learn:** structured output; runtime schema validation; prompts for a constrained agent.

- [ ] One schema (e.g. Zod) for `AgentDecision` and `Slots`; derive the TS types from it.
- [ ] Prompt from state + allowed actions + a summary of the last observation, never raw Google payloads.
- [ ] Invalid output → `llm_failed` → the guard path from Sprint 2.

**Exit:** the three requirement examples work with the real model, and the loop code did not change.

### Sprint 11 — POST /agent and Angular UI

**Goal:** expose one endpoint and a chat UI that renders places only from structured data.

**Learn:** thin controllers and DTO validation; standalone components and typed HTTP.

- [ ] `POST /agent`: message, optional GPS, optional session context (`previousSlots`, turn); returns `AgentResponse`.
- [ ] UI: chat, clarification prompt, restaurant cards from `places`, "use my location", trace viewer.

**Exit:** Supertest e2e with fakes passes; a clarification round-trip works in the browser; no component parses `reply` to find restaurants.

## Sprints 12–13 — LangGraph, then evaluation

### Sprint 12 — LangGraph refactor

**Goal:** replace the hand-written loop with a LangGraph `StateGraph`. Do not redesign behavior.

**Learn:** what LangGraph abstracts; what stays your application logic; manual loop vs graph orchestration.

**Map**

| Manual loop | LangGraph |
| --- | --- |
| `AgentState` | Graph state |
| `decide` | Agent node |
| Each tool | Your own tool node |
| `allowedActions` + `guard` | Guard node + conditional edges |
| `verify` | Node on a fixed edge after every search |
| Clarification (resumable turn) | `interrupt()` |
| Finish states | Terminal nodes |

**Warning:** don't use the prebuilt `ToolNode` or `createReactAgent`. They let the model call tools freely and bypass `allowedActions` and the verifier.

**Exit:** every test from Sprints 1–11 passes on the graph version without editing the tests. If a test must change, the refactor changed behavior; find out why.

### Sprint 13 — Live evaluation

**Goal:** measure the real model, not just the deterministic code.

**Learn:** agent evaluation; observability; regression over model or prompt changes.

**Measure:** correct tool choice · retries · illegal actions rejected by the guard · final verified results · latency, calls, failures.

**Exit:** an eval set of 15–20 requests you run by hand, with a score you record and compare before every prompt or model change.

Only after this: memory, RAG, or multi-agent, and only for a concrete need.

## Discovered cases (backlog)

- Out-of-scope request ('what time is it?') -> no tools, stop. Needs intent in Slots + finish reason decision. Target: Sprint 3.
- Optional: replace toHaveLength/toBeDefined bookkeeping in type specs with Vitest assertType/expectTypeOf.
