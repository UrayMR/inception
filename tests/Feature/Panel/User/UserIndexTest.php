<?php

namespace Tests\Feature\Panel\User;

use App\Enums\UserRole;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

class UserIndexTest extends UserTestCase
{
  public function test_guest_is_redirected_from_user_index(): void
  {
    // Arrange: No authenticated user.

    // Act: Open the admin user index route.
    $response = $this->get(route('panel.users.index'));

    // Assert: Guests are redirected to login.
    $response->assertRedirect(route('login'));
  }

  public function test_admin_can_view_user_index_with_expected_inertia_props(): void
  {
    // Arrange: Seed a member and sign in as admin.
    $member = User::factory()->create([
      'name' => 'Jane Doe',
      'email' => 'jane@example.com',
      'role' => UserRole::participant->value,
    ]);

    $admin = $this->makeAdminUser();

    // Act: Request the user index page.
    $response = $this->actingAs($admin)->get(route('panel.users.index'));

    // Assert: The React component and collection props are correct.
    $response
      ->assertOk()
      ->assertInertia(
        fn(Assert $page) => $page
          ->component('panel/users/index')
          ->has('users.data', 2)
          ->has('users.links')
          ->has('users.meta')
          ->where('users.data.0.id', $admin->id)
          ->where('users.data.0.role', UserRole::admin->value)
          ->where('users.data.1.id', $member->id)
          ->where('users.data.1.role', UserRole::participant->value)
          ->missing('users.data.0.password')
          ->missing('users.data.1.password')
      );
  }
}
