# Admin Builders TODO

**Maturity Tier:** `Hardened`

## Shipped Now

- Publishes 1 public module from `@platform/admin-builders`: `./main`.
- Exports 18 named symbols through the public entrypoint, including `packageId`, `packageDisplayName`, `packageDescription`, `createBuilderPanelLayout`, `createBuilderPublishContract`, `assertBuilderRevision`, and more.
- Uses a React-aware surface model: Mixed runtime helpers.
- Verification lanes present: Build+Typecheck+Lint+Test.

## Current Gaps

- Broad public API surface still relies on unit coverage only; there is no separate contract lane yet.
- Standalone consumers still need a compatible Gutu workspace to resolve workspace-scoped dependencies honestly.
- React-facing behavior is covered lightly; the repo does not yet ship deeper interaction or visual verification lanes.

## Recommended Next

- Deepen contract coverage around the most reused admin composition paths.
- Add stronger ergonomic guidance where multiple first-party plugins compose the same admin primitives.
- Add contract-focused tests around the most reused public modules and exported helpers.
- Add richer interaction or rendering checks around the primary React-facing exports where hosts depend on them heavily.
- Keep compatibility examples current as more extracted repos consume this library through the workspace vendor model.

## Later / Optional

- Reference themes, presets, and richer visual regression checks once the API shape settles.
