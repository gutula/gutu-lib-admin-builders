# Admin Builders

<p align="center">
  <img src="./docs/assets/gutu-mascot.png" alt="Gutu mascot" width="220" />
</p>

Admin Builders reusable library exports.

![Maturity: Hardened](https://img.shields.io/badge/Maturity-Hardened-2563eb) ![Verification: Build+Typecheck+Lint+Test](https://img.shields.io/badge/Verification-Build%2BTypecheck%2BLint%2BTest-6b7280) ![UI: Mixed runtime helpers](https://img.shields.io/badge/UI-Mixed%20runtime%20helpers-2563eb) ![Consumption: Imports + typed UI primitives](https://img.shields.io/badge/Consumption-Imports%20%2B%20typed%20UI%20primitives-2563eb)

## Part Of The Gutu Stack

| Aspect | Value |
| --- | --- |
| Repo kind | First-party library |
| Domain group | Admin Experience |
| Primary focus | admin composition, layout builders, operator scaffolding |
| Best when | You need reusable contracts or UI/runtime helpers with their own release cadence and docs. |
| Consumed through | Imports + typed UI primitives |

- Gutu libraries stay intentionally separate from apps and plugins so teams can version shared contracts, UI primitives, and runtime helpers without burying them in product code.
- This library should be consumed through explicit imports, providers, callbacks, and typed helpers rather than undocumented global extension points.

## What It Does Now

- Publishes 1 public module from `@platform/admin-builders`: `./main`.
- Exports 13 named symbols through the public entrypoint, including `packageId`, `packageDisplayName`, `packageDescription`, `createBuilderPanelLayout`, `createBuilderPublishContract`, `assertBuilderRevision`, and more.
- Uses a React-aware surface model: Mixed runtime helpers.
- Verification lanes present: Build+Typecheck+Lint+Test.

## Maturity

**Maturity Tier:** `Hardened`

Why this tier:
- Group: **Admin Experience**
- Public modules: 1
- Named exports: 13
- Test files: 1
- Contract lane: not present

## Verified API Summary

| Field | Value |
| --- | --- |
| Package ID | `admin-builders` |
| Import Name | `@platform/admin-builders` |
| UI Surface | Mixed runtime helpers |
| Consumption Model | Imports + typed UI primitives |
| Verification | Build+Typecheck+Lint+Test |

## Dependency And Compatibility Summary

| Field | Value |
| --- | --- |
| Package Name | `@platform/admin-builders` |
| Direct Dependencies | `@platform/admin-contracts`, `@platform/layout`, `@platform/ui`, `@platform/ui-kit`, `react` |
| Peer Dependencies | None |
| React Runtime | Yes |
| Workspace Requirement | Compatible Gutu workspace required |

## Capability Matrix

| Capability | Count / Mode | Notes |
| --- | --- | --- |
| Public Modules | 1 | `./main` |
| Named Exports | 13 | `packageId`, `packageDisplayName`, `packageDescription`, `createBuilderPanelLayout`, `createBuilderPublishContract`, `assertBuilderRevision`, `BuilderPalette`, `BuilderCanvas` |
| UI Surface | Mixed runtime helpers | React-aware surface detected |
| Tests | 1 | Build+Typecheck+Lint+Test |

## Quick Start For Integrators

Use this repo inside a **compatible Gutu workspace** or the **ecosystem certification workspace** so its `workspace:*` dependencies resolve honestly.

```bash
# from a compatible workspace that already includes this library's dependency graph
bun install
bun run build
bun run test
bun run docs:check
```

```ts
import { packageId, packageDisplayName, createBuilderPanelLayout } from "@platform/admin-builders";

console.log(packageId, packageDisplayName, typeof createBuilderPanelLayout);
```

Use the root repo scripts for day-to-day work after the workspace is bootstrapped, or run the nested package directly from `framework/libraries/admin-builders` if you need lower-level control.

## Current Test Coverage

- `bun run build`
- `bun run typecheck`
- `bun run lint`
- `bun run test`
- `bun run docs:check`
- `bun run test:unit`
- Unit files: 1
- Contract files: 0
- Integration files: 0
- Migration files: 0

## Known Boundaries And Non-Goals

- Not a full product shell or admin application by itself.
- Not a replacement for plugin-owned business logic or data lifecycles.
- This library should be consumed through explicit imports, providers, callbacks, and typed helpers rather than undocumented global hooks.

## Recommended Next Milestones

- Deepen contract coverage around the most reused admin composition paths.
- Add stronger ergonomic guidance where multiple first-party plugins compose the same admin primitives.
- Add contract-focused tests around the most reused public modules and exported helpers.
- Add richer interaction or rendering checks around the primary React-facing exports where hosts depend on them heavily.
- Keep compatibility examples current as more extracted repos consume this library through the workspace vendor model.

## More Docs

- [Developer Guide](./DEVELOPER.md)
- [TODO](./TODO.md)
- [Security](./SECURITY.md)
- [Contributing](./CONTRIBUTING.md)
