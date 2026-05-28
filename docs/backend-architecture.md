# Project Architecture: Controller, Service, Repository, DTO, and Action Pattern

This project uses a layered backend architecture that separates HTTP concerns, application flow, data access, and input shaping. The current implementation combines the classic Controller-Service-Repository-DTO structure with an Action pattern for mutation-heavy workflows.

This design is used because the project has the potential to grow much larger over time. By structuring the flow cleanly from the start, future development becomes easier to extend, easier to read, and easier to maintain.

The goal is not to put everything into one “service” class. Instead, each layer has a narrower responsibility so the code stays readable, testable, and easy to extend.

## Core Idea

The architecture is built around these responsibilities:

- **Controller**: Handles the HTTP request lifecycle. It authorizes the request, calls the correct application class, and returns a response.
- **DTO**: Carries validated data in a typed, explicit shape between layers.
- **Action**: Orchestrates a single business use case, especially for create/update/delete flows. Actions are a good place for `DB::transaction` when multiple operations must succeed or fail together.
- **Service**: Contains reusable application logic, especially read/query flows and shared operations that are not tied to one specific mutation use case.
- **Repository**: Encapsulates database access and model persistence.

## Why This Structure

This structure is used because the project is expected to grow, and different kinds of logic do not belong in the same class:

- Controllers should stay thin so HTTP code does not become a place for business rules.
- Services should not grow into “god classes” that mix query logic, file handling, transactions, and multi-step write workflows.
- Actions are better for mutation workflows because each action represents one concrete use case, such as “store user”, “update competition”, or “delete team”.
- Repositories keep database access centralized, which makes persistence logic easier to change later.
- DTOs make the input shape explicit and reduce the need to pass raw request arrays around.

The practical result is easier maintenance now and a smoother development experience later:

- you can change request validation without touching persistence,
- you can change persistence without rewriting controllers,
- you can wrap multi-step writes in a transaction at the exact use-case level,
- and you can keep read flows separate from write flows.

## Layer Responsibilities

### 1. Controller Layer

Controllers receive the request, authorize it, and delegate to the correct class.

They should not contain:

- SQL or query logic,
- file storage logic,
- DTO mapping logic beyond calling request helpers,
- or transaction orchestration.

Example responsibilities in this project:

- `Panel/UserController.php` delegates create, update, delete to user actions.
- `Panel/CompetitionController.php` delegates competition mutations to competition actions.
- `Panel/TeamController.php` delegates team mutations to team actions.

### 2. DTO Layer

DTOs define the exact data shape that an action or service expects.

They are used to:

- avoid passing raw request arrays deeper into the application,
- make the expected fields explicit,
- reduce coupling to HTTP request objects,
- and keep the write path predictable.

Examples:

- `StoreUserDTO` carries `name`, `email`, `password`, and `role`.
- `StoreCompetitionDTO` carries competition fields and an optional uploaded file.
- `StoreTeamDTO` carries team fields including `leader_id`.

### 3. Action Layer

Actions are the main orchestration layer for mutation use cases.

Use an action when the operation:

- creates, updates, or deletes data,
- needs a transaction,
- touches more than one repository or service,
- or has business rules that belong to one specific workflow.

Actions are especially useful when one use case includes multiple steps, for example:

- create a record,
- create related child records,
- store or update an uploaded file,
- and then commit everything together.

In this project, actions are used for:

- user mutations,
- team mutations,
- and competition mutations.

### 4. Service Layer

Services remain useful for reusable application logic, especially read/query flows.

In the current structure, services typically handle:

- filtering and pagination,
- lookup methods like `findByIdOrFail`,
- map builders for dropdowns,
- or shared logic that is not tied to a single mutation use case.

Examples:

- `UserService::index()` builds the filter payload and delegates to the repository.
- `CompetitionService::index()`, `findByIdOrFail()`, and `getCompetitionMap()` are read-oriented helpers.
- `TeamService::index()` is also query-focused.

### 5. Repository Layer

Repositories own the persistence details.

They should:

- create/update/delete models,
- build queries,
- and keep database-specific code out of controllers and actions.

Repositories do not decide use cases. They only do the storage work that the action or service asks for.

## Mutation Flow Pattern

For write operations, the current flow is usually:

1. **Form Request** validates the input.
2. **Controller** authorizes access and calls an action.
3. **Action** maps the DTO to attributes, coordinates related work, and wraps the workflow in `DB::transaction` when needed.
4. **Repository** performs the actual persistence.
5. **Action** returns the final model or result to the controller.
6. **Controller** flashes a message or redirects.

Security and business gate checks that protect a write endpoint should also live in this path, ideally in the Form Request or in the endpoint's first validation layer. For example, a competition registration must only work when the competition status is `open`, that rule should be enforced on the registration write endpoint before the action or repository starts mutating data. This keeps the endpoint itself as the source of truth for access rules and avoids relying only on the UI.

## Read Flow Pattern

For read operations, the flow is simpler:

1. **Controller** authorizes access.
2. **Controller** calls a service.
3. **Service** prepares filters or query parameters.
4. **Repository** executes the query.
5. **Controller** formats the response using a resource.

## Examples From This Codebase

### User Management

User mutations now use actions:

- `Actions/Users/StoreUser.php`
- `Actions/Users/UpdateUser.php`
- `Actions/Users/DeleteUser.php`

Flow:

- `StoreUserRequest` validates the form and builds `StoreUserDTO`.
- `UserController` authorizes the request and calls `StoreUser`.
- `StoreUser` maps the DTO to model attributes and calls `UserRepository::store()`.
- `UserRepository` writes the data.

Why this is good:

- `UserService` no longer mixes create/update/delete with query logic.
- each mutation has one explicit class,
- and future changes like hashing, auditing, or notifications can stay localized.

### Team Management

Team mutations use actions because the workflow involves the team record plus member records.

Action classes:

- `Actions/Teams/CreateTeam.php`
- `Actions/Teams/UpdateTeam.php`
- `Actions/Teams/DeleteTeam.php`

Flow:

- `StoreTeamRequest` or `UpdateTeamRequest` validates input and builds DTO/member payload.
- `TeamController` authorizes the request and calls the correct team action.
- The action starts `DB::transaction`.
- The action creates/updates/deletes the team.
- The action also creates, updates, or deletes team members.
- If any step fails, the transaction rolls back.

Why this is good:

- team and member data stay consistent,
- the controller stays thin,
- and the use case is easy to reason about because it lives in one class.

### Competition Management

Competition mutations use actions because the workflow involves competition records, timelines, and file handling.

Action classes:

- `Actions/Competitions/StoreCompetition.php`
- `Actions/Competitions/UpdateCompetition.php`
- `Actions/Competitions/DeleteCompetition.php`

Flow:

- `StoreCompetitionRequest` or `UpdateCompetitionRequest` validates the competition payload and timeline payload.
- `CompetitionController` authorizes the request and calls the corresponding action.
- The action starts `DB::transaction`.
- The action stores or updates the competition through `CompetitionRepository`.
- The action handles related timelines through `TimelineService`.
- The action handles image storage or replacement through `FileService`.
- If any step fails, the transaction rolls back.

Why this is good:

- competition, timelines, and file metadata are handled as one business operation,
- the file handling remains reusable in `FileService`,
- and the transaction boundary is placed exactly where the business process ends.

## Why Image Handling Stays in FileService

`FileService` is still the right place for low-level file operations such as store, update, and delete.

That is because it represents infrastructure behavior, not a business use case.

Use an action around it only when the file work is part of a larger workflow, such as:

- store competition image + create competition + create timelines,
- update competition image + update competition + update timelines,
- delete competition timelines + delete competition image + delete competition.

So the rule is:

- **FileService** = how to manipulate files.
- **Action** = when and why that file manipulation happens inside a business process.

## Current Folder Map

```
app/
  Actions/
    Competitions/
      StoreCompetition.php
      UpdateCompetition.php
      DeleteCompetition.php
    Teams/
      StoreTeam.php
      UpdateTeam.php
      DeleteTeam.php
    Users/
      StoreUser.php
      UpdateUser.php
      DeleteUser.php
  Services/
    Competitions/
      CompetitionService.php
      TimelineService.php
    Teams/
      TeamService.php
    Users/
      UserService.php
  Repositories/
    Competitions/
    Teams/
    Users/
  DTOs/
    Competitions/
    Teams/
    Users/
```

## Practical Rule of Thumb

Use these guidelines when deciding where new logic belongs:

- Put **request validation** in Form Requests.
- Put **input shape** in DTOs.
- Put **single-use-case mutations** in Actions.
- Put **reusable query logic** in Services.
- Put **database access** in Repositories.
- Put **file storage primitives** in FileService.
- Put **security or business gates for write endpoints** in the Form Request or the endpoint's first validation layer, so rules like `a competition should not be registered if the status is not open` fail before mutation logic runs.

## Summary

The architecture is intentionally split this way because the project has both simple read flows and more complex write workflows, and it is likely to keep growing in size and complexity.

If everything stayed in services, the service layer would grow too broad and harder to maintain. Because this project is expected to grow further, moving mutation orchestration into actions keeps the flow tidy now and makes future changes much easier to implement.

That is why the current structure is more scalable:

- controllers stay thin,
- services stay reusable,
- actions stay focused on one workflow,
- repositories stay persistence-only,
- and DTOs keep data contracts explicit.
