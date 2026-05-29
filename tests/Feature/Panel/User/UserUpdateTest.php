<?php

namespace Tests\Feature\Panel\User;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\Feature\Panel\User\UserTestCase;

class UserUpdateTest extends UserTestCase
{
  public function test_guest_is_redirected_from_user_edit(): void
  {
    // Arrange: No authenticated user.

    // Act: Open the edit route.
    $response = $this->get(route('panel.users.edit', User::factory()->create()));

    // Assert: Guests are redirected to login.
    $response->assertRedirect(route('login'));
  }

  public function test_admin_can_view_user_edit_page_with_inertia_props(): void
  {
    // Arrange: Seed a user to edit and sign in as admin.
    $user = User::factory()->create([
      'name' => 'Edit User',
      'email' => 'edit@example.com',
      'role' => UserRole::participant->value,
    ]);

    $admin = $this->makeAdminUser();

    // Act: Render the edit page.
    $response = $this->actingAs($admin)->get(route('panel.users.edit', $user));

    // Assert: The React component receives the expected user payload only.
    $response
      ->assertOk()
      ->assertInertia(
        fn(Assert $page) => $page
          ->component('panel/users/edit')
          ->has('user')
          ->where('user.id', $user->id)
          ->where('user.name', 'Edit User')
          ->where('user.email', 'edit@example.com')
          ->where('user.role', UserRole::participant->value)
          ->missing('user.password')
      );
  }

  public function test_admin_can_update_user_with_new_password(): void
  {
    // Arrange: Seed a user and prepare a new update payload.
    $admin = $this->makeAdminUser();
    $user = User::factory()->create([
      'name' => 'Old Name',
      'email' => 'old@example.com',
      'role' => UserRole::participant->value,
    ]);

    $payload = [
      'name' => 'Updated Name',
      'email' => 'updated@example.com',
      'password' => 'new-password123',
      'password_confirmation' => 'new-password123',
      'role' => UserRole::accountant->value,
    ];

    // Act: Submit the update form.
    $response = $this->actingAs($admin)
      ->from(route('panel.users.edit', $user))
      ->put(route('panel.users.update', $user), $payload);

    // Assert: The database reflects the updated state and password hash.
    $response
      ->assertSessionHasNoErrors()
      ->assertRedirect(route('panel.users.index'));

    $user->refresh();

    $this->assertSame('Updated Name', $user->name);
    $this->assertSame('updated@example.com', $user->email);
    $this->assertSame(UserRole::accountant->value, $user->role);
    $this->assertTrue(Hash::check('new-password123', $user->password));
  }

  public function test_admin_cannot_update_user_with_duplicate_email(): void
  {
    // Arrange: Seed a conflicting email and the target user.
    $admin = $this->makeAdminUser();
    User::factory()->create([
      'email' => 'duplicate@example.com',
    ]);

    $user = User::factory()->create([
      'email' => 'original@example.com',
      'role' => UserRole::participant->value,
    ]);

    $payload = [
      'name' => 'Original User',
      'email' => 'duplicate@example.com',
      'password' => null,
      'password_confirmation' => null,
      'role' => UserRole::participant->value,
    ];

    // Act: Submit the update form with a duplicate email.
    $response = $this->actingAs($admin)
      ->from(route('panel.users.edit', $user))
      ->put(route('panel.users.update', $user), $payload);

    // Assert: Validation blocks the update and the model stays unchanged.
    $response
      ->assertSessionHasErrors('email')
      ->assertRedirect(route('panel.users.edit', $user));

    $user->refresh();

    $this->assertSame('original@example.com', $user->email);
  }
}
