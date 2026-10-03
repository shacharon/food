---
name: scope-guard
description: Verify that a requested change belongs to the current sprint story. Use before modifying code, and again after implementing to compare the diff.
---

# Scope guard

Scope comes from `docs/SPRINTS.md`.

## Procedure
1. Read the current story. Write down the goal, required behavior, and exit criteria.
2. List the minimum files expected to change.
3. Classify each change:
   - required now
   - supporting change required now
   - future sprint
   - unrelated
4. Never implement future-sprint behavior.
5. If a contract, port, or tool must change unexpectedly, stop and explain:
   - why it is required
   - which consumers it affects
   - whether the sprint plan should change
6. After implementing, compare `git diff` with the expected file list. Flag unexplained files and unrelated refactors.

## Output
- In scope
- Out of scope
- Expected files
- Unexpected dependencies
- Proceed / stop
