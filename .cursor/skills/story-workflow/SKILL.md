---
name: story-workflow
description: Procedure for starting, implementing, reviewing, testing, or closing a sprint story. Use whenever work is tied to a story in docs/SPRINTS.md.
---

# Story workflow

Scope comes from `docs/SPRINTS.md`; architecture from `docs/REQUIREMENTS.md`.

## Procedure
1. Read the current story in `docs/SPRINTS.md`.
2. State its goal and exit criteria.
3. List the files expected to change.
4. Check scope with the `scope-guard` skill.
5. Write the exit test first.
   - Executable behavior: a behavior test.
   - Contract-only work: type tests first.
   Then make the smallest change that meets the exit criteria.
6. If a contract, port, or tool must change unexpectedly, stop and explain before editing it.
7. Run from the backend folder:
   - `npm run typecheck`
   - `npm run build`
   - `npm test`
   - `npm run lint`
   - the frontend build, if Angular was touched
8. Report:
   - files changed
   - each exit criterion: met / not met
   - what was intentionally not implemented
   - validation results
9. Tick boxes in `docs/SPRINTS.md` only after the exit criteria pass.
10. Suggest a commit message: `sprint-N: <summary>`.

## Never
- Commit automatically.
- Start the next story automatically.
- Tick a box for work that was only partly done.
