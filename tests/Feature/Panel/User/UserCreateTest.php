<?php

namespace Tests\Feature\Panel\User;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

class UserCreateTest extends UserTestCase
{
  public function test_guest_is_redirected_from_user_create(): void
  {
    // Arrange: No authenticated user.

    // Act: Open the create user route.
    $response = $this->get(route('panel.users.create'));

    // Assert: Guests are redirected to login.
    $response->assertRedirect(route('login'));
  }

  public function test_admin_can_view_user_create_page(): void
  {
    // Arrange: Sign in as an admin user.
    $admin = $this->makeAdminUser();

    // Act: Render the create user page.
    $response = $this->actingAs($admin)->get(route('panel.users.create'));

    // Assert: The expected React component is rendered and shared props exist.
    $response
      ->assertOk()
      ->assertInertia(
        fn(Assert $page) => $page
          ->component('panel/users/create')
          ->has('errors')
      );
  }

  public function test_admin_can_store_user_with_valid_payload(): void
  {
    // Arrange: Sign in as an admin and prepare a valid payload.
    $admin = $this->makeAdminUser();

    $payload = [
      'name' => 'New User',
      'email' => 'new-user@example.com',
      'password' => 'password123',
      'password_confirmation' => 'password123',
      'role' => UserRole::accountant->value,
    ];

    // Act: Submit the create form.
    $response = $this->actingAs($admin)
      ->from(route('panel.users.create'))
      ->post(route('panel.users.store'), $payload);

    // Assert: The user is persisted and the password is hashed.
    $response
      ->assertSessionHasNoErrors()
      ->assertRedirect(route('panel.users.index'));

    $storedUser = User::query()->where('email', 'new-user@example.com')->firstOrFail();

    $this->assertSame('New User', $storedUser->name);
    $this->assertSame(UserRole::accountant->value, $storedUser->role);
    $this->assertTrue(Hash::check('password123', $storedUser->password));
  }

  public function test_admin_cannot_store_user_with_duplicate_email(): void
  {
    // Arrange: Seed an existing email and sign in as admin.
    $admin = $this->makeAdminUser();
    User::factory()->create([
      'email' => 'duplicate@example.com',
    ]);

    $payload = [
      'name' => 'Duplicate User',
      'email' => 'duplicate@example.com',
      'password' => 'password123',
      'password_confirmation' => 'password123',
      'role' => UserRole::participant->value,
    ];

    // Act: Submit the create form with a duplicate email.
    $response = $this->actingAs($admin)
      ->from(route('panel.users.create'))
      ->post(route('panel.users.store'), $payload);

    // Assert: Validation fails and no extra user is created.
    $response
      ->assertSessionHasErrors('email')
      ->assertRedirect(route('panel.users.create'));

    $this->assertDatabaseCount('users', 2);
  }
}
