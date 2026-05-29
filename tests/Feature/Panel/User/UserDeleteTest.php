<?php

namespace Tests\Feature\Panel\User;

use App\Enums\UserRole;
use App\Models\User;

class UserDeleteTest extends UserTestCase
{
  public function test_guest_is_redirected_from_user_destroy(): void
  {
    // Arrange: Create a user that could be deleted.
    $user = User::factory()->create();

    // Act: Call the delete route without authentication.
    $response = $this->delete(route('panel.users.destroy', $user));

    // Assert: Guests are redirected to login.
    $response->assertRedirect(route('login'));
  }

  public function test_admin_can_delete_user(): void
  {
    // Arrange: Sign in as admin and create a target user.
    $admin = $this->makeAdminUser();
    $user = User::factory()->create([
      'role' => UserRole::participant->value,
    ]);

    // Act: Submit the delete request.
    $response = $this->actingAs($admin)
      ->from(route('panel.users.index'))
      ->delete(route('panel.users.destroy', $user));

    // Assert: The target user is removed from the database.
    $response
      ->assertSessionHasNoErrors()
      ->assertRedirect(route('panel.users.index'));

    $this->assertDatabaseMissing('users', [
      'id' => $user->id,
    ]);
  }

  public function test_admin_cannot_delete_their_own_account(): void
  {
    // Arrange: Sign in as the same admin we are going to delete.
    $admin = $this->makeAdminUser();

    // Act: Try to delete the authenticated admin account.
    $response = $this->actingAs($admin)
      ->delete(route('panel.users.destroy', $admin));

    // Assert: Policy blocks self-deletion and the record remains.
    $response->assertForbidden();

    $this->assertDatabaseHas('users', [
      'id' => $admin->id,
    ]);
  }

  public function test_non_admin_cannot_delete_user(): void
  {
    // Arrange: Sign in as a non-admin and prepare a target user.
    $user = User::factory()->create([
      'role' => UserRole::participant->value,
    ]);

    $target = User::factory()->create([
      'role' => UserRole::accountant->value,
    ]);

    // Act: Attempt the delete action as a non-admin user.
    $response = $this->actingAs($user)->delete(route('panel.users.destroy', $target));

    // Assert: The request is forbidden and the target still exists.
    $response->assertForbidden();

    $this->assertDatabaseHas('users', [
      'id' => $target->id,
    ]);
  }
}
