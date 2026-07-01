# Backend Guidelines (Streamlined)

This is a practical guide to keep backend implementation consistent and fast to review.

Primary reference: [backend-architecture.md](backend-architecture.md)

## 1) Canonical Flow

Request (FormRequest) -> Controller -> DTO -> Service -> Action(s) -> Repository

For write flows, Service owns:

- business guards
- transaction boundary
- lock strategy

## 2) Layer Quick Rules

### FormRequest

- Validate payload shape, types, files, and simple UX constraints.
- Keep `after()` for UX-level checks only.
- Do not make business-state decisions here.

### Controller

- Authorize request.
- Build DTO from validated input.
- Call Service and return response/resource.
- Do not run query logic or transaction logic.

### DTO

- Use small typed DTOs per use case.
- Do not pass Request objects into Service/Action layers.

### Service

- Enforce business rules.
- Open a single `DB::transaction()` for write flow.
- Apply `lockForUpdate` before concurrency-sensitive writes.
- Delegate focused writes to Actions.
- Use `ThrowException::validation($field, $message)` for form-mapped domain errors.

### Action

- Keep single responsibility.
- Perform focused write/side effect work.
- Assume transaction already exists when called by Service.
- Do not open nested transactions unless explicitly documented for independent execution.

### Repository

- Own Eloquent query and persistence logic.
- Do not contain business guards.

## 3) Write Flow Checklist

- [ ] Request only validates payload and UX checks.
- [ ] Controller maps to DTO and calls Service.
- [ ] Service validates business gates.
- [ ] Service opens one transaction.
- [ ] Service applies locks for race-prone writes.
- [ ] Actions execute focused writes.
- [ ] Repositories handle data access only.
- [ ] Errors are mapped consistently.

## 4) Concurrency Guardrails

- Re-check critical conditions under lock.
- Avoid duplicate-write windows in registration/payment style flows.
- Keep lock scope small but sufficient for correctness.

## 5) Testing Guardrails

- Unit test Actions and Repositories.
- Integration test Service write flows with real transaction path.
- Add concurrency-focused tests for lock-protected use cases.

## 6) Anti-Patterns to Avoid

- Nested transactions between Service and Action.
- Business rules split across Request and Action while Service is bypassed.
- Controller-heavy logic (query, persistence, orchestration).
- Repository methods that decide business policy.

## 7) Refactor Priority (When Cleaning Legacy Flows)

1. Move business guards to Service.
2. Move transaction boundary to Service.
3. Remove Action nested transactions.
4. Keep Request focused on payload/UX validation.
5. Add integration tests for the migrated flow.
