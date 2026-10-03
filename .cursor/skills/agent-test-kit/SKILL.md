---
name: agent-test-kit
description: Procedure for writing unit or scenario tests for agent behavior. Use when adding or reviewing tests for guards, allowed actions, the loop, tools, or verification.
---

# Agent test kit

## Procedure
1. Start from the exit criterion, written as Given / When / Then.
2. Build state with factories such as `gpsState()` and `missingState()`.
3. Use `ScriptedLlmClient` for scripted decisions, once it exists.
4. Use fake tools and ports.
5. Use an injected clock.
6. Use `it.each` tables for rules, guard cases, verifier cases, and limits.
7. For type assertions, prefer Vitest `assertType` / `expectTypeOf`. Use `@ts-expect-error` with exactly one cause.
8. Assert visible behavior: state, finish reason, places, trace order.
9. Do not assert private details. Do not call live Google or a live LLM.
10. If a test finds a bug, report it. Do not fix production code from the test role.

## Naming
`<scenario> -> <expected outcome>`
