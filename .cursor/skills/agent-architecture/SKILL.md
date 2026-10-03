---
name: agent-architecture
description: Decide where agent behavior belongs, or review agent control flow. Use when designing or reviewing guards, loop steps, decisions, tools, or verification.
---

# Agent architecture

## Where does it belong?
- Legal or not in this state? -> `allowedActions` / guard.
- Must always happen? -> a fixed loop step (for example verify after every search), never a tool.
- Needs model judgment? -> `AgentDecision`.
- Fetches external facts? -> a tool behind a port.
- Checks results? -> `ResultVerifier`.
- Control data the system already knows (anchor, radius)? -> built by code, never by the model.

## Loop shape
`state -> allowedActions -> decide -> guard -> runTool -> verify -> update state -> repeat -> finish`

## Nodes
- One responsibility each.
- Prefer `state -> new state`.
- Tool execution may do external I/O, but state changes stay explicit and there is no hidden mutation.

## Before approving a design, name
1. State read
2. Decision made
3. External capability used
4. Deterministic rule applied
5. Next state produced
