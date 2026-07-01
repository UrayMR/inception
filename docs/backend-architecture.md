# Backend Architecture and Flow

This document is the single source of truth for backend architecture and request flow in this project.

For quick daily checks, use [backend-guidelines.md](backend-guidelines.md).

## Goal

The backend is intentionally layered so features stay readable, testable, and safe as the project grows.

Core flow:

Request (FormRequest) -> Controller -> DTO -> Service (guards + transaction + lock) -> Action(s) (write workers) -> Repository (data access)

Apply this pattern consistently across domains: users, teams, competitions, transactions, and others.

## Why This Structure

- Keep HTTP concerns out of business logic.
- Keep write orchestration predictable and atomic.
- Keep query logic centralized.
- Prevent Service classes from becoming god classes.
- Make mutation workflows easy to test and refactor.

## Layer Responsibilities

### 1) Request (FormRequest)

Request classes validate payload shape and UX-level constraints.

Allowed:

- Required/optional fields and data types.
- File validation rules.
- Simple conditional UX checks using sanitized input.

Not allowed:

- Business rules that affect domain state.
- Query-based domain decisions as source of truth.

Notes:

- `after()` should be used only for UX-level checks.
- Business gates must be enforced in Service before any write.

### 2) Controller

Controllers are thin transport layers.

Must do:

- Authorize request.
- Map validated request to DTO(s).
- Call Service.
- Return HTTP response/resource/redirect.

Must not do:

- Direct DB queries.
- Business guard logic.
- Transaction orchestration.

### 3) DTO

DTOs are typed input contracts passed from Controller to Service.

Guidelines:

- Prefer small DTOs per use case.
- Do not pass Request objects to deeper layers.
- Keep value shape explicit and stable.

### 4) Service (Orchestrator)

Service is the orchestration and guard layer.

Must do for write flows:

- Enforce business guards.
- Open one transaction boundary with `DB::transaction()`.
- Acquire `lockForUpdate` when concurrency-sensitive rows are involved.
- Delegate write steps to one or more Actions.
- Throw validation-shaped domain errors via `App\Helpers\ThrowException` when appropriate.

Must do for read flows:

- Prepare filter/query payload.
- Delegate query execution to Repository.

### 5) Action

Actions are small write workers.

Must do:

- Perform focused mutation or side effect.
- Stay single-responsibility and independently testable.
- Use repositories/services passed by orchestration.

Must not do by default:

- Open nested transactions.
- Re-implement business guards already owned by Service.

Exception:

- Independent async/background actions may own their own transaction if needed. Document this explicitly.

### 6) Repository

Repository owns data access details.

Must do:

- Encapsulate Eloquent query logic.
- Handle create/update/delete and query composition.
- Keep persistence concerns out of Controller/Service/Action.

Must not do:

- Enforce business guard decisions.

## Canonical Flow Patterns

### Write Flow (Create/Update/Delete/Register)

1. FormRequest validates payload and UX constraints.
2. Controller authorizes and maps request to DTO.
3. Service verifies business rules.
4. Service opens `DB::transaction()`.
5. Service acquires `lockForUpdate` if needed.
6. Service calls Actions to perform writes.
7. Actions write through repositories/services.
8. Service returns result; controller returns response.

If any step throws, transaction is rolled back.

### Read Flow (Index/Show/Lookup)

1. Controller authorizes.
2. Controller calls Service.
3. Service prepares filters/options.
4. Repository executes query.
5. Controller returns resource/response.

## Transactions and Concurrency

Rules:

- One transaction boundary per write flow, defined in Service.
- Take `lockForUpdate` inside that Service transaction before competing writes.
- Avoid nested `DB::transaction()` calls in Actions.
- Re-check critical conditions inside the lock when preventing duplicate writes.

Rationale:

- Clear rollback boundary.
- Consistent behavior across workflows.
- Better resilience under parallel requests.

## Error Handling

- Use `ThrowException::validation($field, $message)` for domain errors that should map to form fields.
- Let unexpected exceptions bubble to Laravel handler for logging and proper server error responses.

## File and Naming Conventions

- Actions: `app/Actions/<Domain>/...`
- Services: `app/Services/<Domain>/...`
- Repositories: `app/Repositories/<Domain>/...`
- DTOs: `app/DTOs/<Domain>/...`

For feature groups, use subfolders (example: `Registrations`).

## Testing Strategy

- Unit test Actions and Repositories independently where practical.
- Integration test Service-level write flows with a real DB transaction path.
- Include concurrency-oriented tests for lock-sensitive workflows.

## Migration Notes (Refactoring Existing Code)

- If a flow has duplicated guards in Request + Service + Action, keep source of truth in Service.
- If Actions open transactions inside a Service-orchestrated write flow, remove inner transactions.
- Re-test mutation flows after refactor, especially where files, timelines, or related child writes are involved.

## Example: Registration Pattern

1. `RegisterCompetitionRequest` validates payload shape and uploads.
2. Controller builds `RegisterCompetitionDTO` and calls registration service.
3. Service checks business gates (status open, eligibility, duplicate prevention).
4. Service opens transaction and takes required `lockForUpdate` locks.
5. Service calls registration Actions to write team/member/transaction records.
6. On error, transaction rolls back and error is propagated as validation or server error.

## PR Checklist

- [ ] Request validates payload and UX constraints only.
- [ ] Controller maps Request to DTO and delegates to Service.
- [ ] Service owns business guards and single transaction boundary.
- [ ] Service applies `lockForUpdate` where concurrency matters.
- [ ] Actions remain focused write workers without nested transactions.
- [ ] Repositories keep query and persistence logic only.
- [ ] Domain validation errors use `ThrowException` consistently.

## Summary

This project uses Controller + DTO + Service + Action + Repository to keep responsibilities explicit.

For write flows, Service is the source of truth for guards, transaction boundaries, and locking.
For read flows, Service prepares queries and Repository executes data access.

Use [backend-guidelines.md](backend-guidelines.md) for a shorter operational checklist.
