---
name: agent-safety-review
description: Checklist for reviewing or testing anything that touches agent behavior. Use for code review of guards, the loop, tools, or verification, and when designing safety tests.
---

# Agent safety review

For each check, say where to look and what failing test would prove it.

## Checks
1. Can the model skip verify or act outside `allowedActions`?
2. Can a non-terminal state return zero allowed actions?
3. Can an explicit radius be widened, or can the model supply the anchor or radius?
4. Can `maxSteps`, `maxSearchAttempts`, or `maxClarificationsPerTurn` be exceeded?
5. Can an unverified or invented place reach the response?
6. Can a tool call the LLM, can the agent call Google directly, or can domain code bypass the port/tool boundary?

## Output
Per check: `safe` / `unsafe` / `n/a`.
For each `unsafe`:
- location
- risk
- suggested test
