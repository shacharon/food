---
name: add-port-adapter
description: Add or replace an external dependency (Google, LLM, clock, storage) behind a port and adapter. Use when introducing a new integration or swapping a provider.
---

# Add a port and adapter

## Procedure
1. Define the port interface in `src/domain/ports`.
2. Keep provider SDK types out of the port.
3. Export it from the domain barrel (`src/domain/index.ts`).
4. Add a `Symbol` DI token when the runtime needs it, not before.
5. Create the adapter in the infrastructure layer.
6. Map provider request/response objects inside the adapter.
7. Map provider errors into domain/application errors, following the current error contract.
8. Register the adapter in Nest with `useClass` or `useFactory`.
9. Inject the dependency by token.
10. Create a deterministic fake for tests.
11. Replace the real provider in Nest tests with `overrideProvider`.
12. Run all checks (see `story-workflow`).

## Review point
The domain layer compiles without importing the provider SDK.
