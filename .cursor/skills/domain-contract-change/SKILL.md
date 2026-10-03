---
name: domain-contract-change
description: Checklist for changing a domain type, union, state, decision, tool input/output, or response. Use whenever such a shared contract changes.
---

# Domain contract change

## Checklist
1. Find every consumer first.
2. Change the contract.
3. Export it from `src/domain/index.ts`.
4. Update union members consistently.
5. Update exhaustive switches. Never add a `default` branch just to silence an error.
6. Update factories, fakes, and fixtures.
7. Add `@ts-expect-error` tests for impossible shapes. Each has exactly one cause: a valid shape plus one bad field.
8. Never widen a union or make a field optional just to fix compilation.
9. Search for old names to find stale consumers.
10. A contract-only change adds no runtime behavior.
11. Run all checks (see `story-workflow`).
12. Report:
    - contract changed
    - consumers updated
    - invalid shapes now rejected
