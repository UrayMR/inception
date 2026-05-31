# Testing Guidelines

This document defines the required testing structure and style for all backend features. It is designed to ensure consistent, maintainable, and effective tests across the codebase.

## 1) File Architecture

Keep tests modular and aligned with the controller routing namespace.

- `tests/Feature/Auth/` for authentication flows such as login, registration, password reset, and verification.
- `tests/Feature/Panel/` for authenticated admin panel flows.
- If a panel module has multiple responsibilities, split it into its own folder:
    - `tests/Feature/Panel/User/UserIndexTest.php`
    - `tests/Feature/Panel/User/UserCreateTest.php`
    - `tests/Feature/Panel/User/UserUpdateTest.php`
    - `tests/Feature/Panel/User/UserDeleteTest.php`
    - `tests/Feature/Panel/Competition/CompetitionIndexTest.php`
    - `tests/Feature/Panel/Competition/CompetitionCreateTest.php`
    - `tests/Feature/Panel/Competition/CompetitionUpdateTest.php`
    - `tests/Feature/Panel/Competition/CompetitionDeleteTest.php`
    - `tests/Feature/Panel/Team/TeamIndexTest.php`
    - `tests/Feature/Panel/Team/TeamCreateTest.php`
    - `tests/Feature/Panel/Team/TeamUpdateTest.php`
    - `tests/Feature/Panel/Team/TeamDeleteTest.php`
- `tests/Unit/` is reserved for pure logic, helpers, enums, and algorithms that do not touch HTTP or the database.

## 2) AAA Pattern

Every test method must use explicit `Arrange`, `Act`, and `Assert` comments.

- `Arrange`: build factories, mock dependencies, prepare payloads, and authenticate with `actingAs`.
- `Act`: execute the HTTP request or the unit action being tested.
- `Assert`: verify status codes, redirects, validation errors, database state, and Inertia props.

## 3) Inertia Requirements

Any GET test that renders an Inertia page must validate the frontend contract.

- Assert the React component name with `->component('path/to/page')`.
- Assert the props shape with `->has('prop')` or `->has('prop.items')`.
- Assert sensitive fields do not leak with `->missing('password')` or similar where relevant.
- For nested collections, validate the nested structure that the page depends on.

## 4) Naming Convention

- File names must be PascalCase and end with `Test.php`.
- Method names must be snake_case.
- Method names must start with `test_` and describe actor + action + result.

## 5) Team and Member Coverage

`TeamMember` is tested through Team workflows because it is a nested relation, not a standalone controller resource.

- Team index tests should cover list rendering and collection integrity.
- Team create tests should cover the form, competition map props, and store logic.
- Team update tests should cover the edit form, member payload handling, and update logic.
- Team delete tests should cover authorization and database removal.
- Where Team resources include `members`, verify the nested array shape in Inertia tests.

## 6) Practical Expectations

- Use the smallest module boundary that still matches the feature behavior.
- Prefer feature tests for HTTP flows and database assertions.
- Avoid one large catch-all file when the module has independent create/update/delete behaviors.
- Keep test data aligned with the real React form payload, especially for nested arrays like timelines and members.
