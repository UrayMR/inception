<?php

namespace Tests\Feature\Panel\Competition;

use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Models\Competition;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

class CompetitionIndexTest extends CompetitionTestCase
{
  public function test_guest_is_redirected_from_competition_index(): void
  {
    // Arrange: No authenticated user.

    // Act: Open the competition index route.
    $response = $this->get(route('panel.competitions.index'));

    // Assert: Guests are redirected to login.
    $response->assertRedirect(route('login'));
  }

  public function test_admin_can_view_competition_index_with_expected_inertia_props(): void
  {
    // Arrange: Seed one competition and sign in as admin.
    $admin = $this->makeAdminUser();

    $competition = Competition::factory()->create([
      'name' => 'Inception Cup',
      'slug' => 'inception-cup',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    // Act: Request the competition index page.
    $response = $this->actingAs($admin)->get(route('panel.competitions.index'));

    // Assert: The React component and paginated props are correct.
    $response
      ->assertOk()
      ->assertInertia(
        fn(Assert $page) => $page
          ->component('panel/competitions/index')
          ->has('competitions.data', 1)
          ->has('competitions.links')
          ->has('competitions.meta')
          ->where('competitions.data.0.id', $competition->id)
          ->where('competitions.data.0.slug', 'inception-cup')
          ->where('competitions.data.0.name', 'Inception Cup')
          ->where('competitions.data.0.type', CompetitionType::team->value)
          ->where('competitions.data.0.status', CompetitionStatus::open->value)
      );
  }

  public function test_non_admin_cannot_view_competition_index(): void
  {
    // Arrange: Sign in as a non-admin user.
    $user = User::factory()->create([
      'role' => 'participant',
    ]);

    // Act: Request the competition index page.
    $response = $this->actingAs($user)->get(route('panel.competitions.index'));

    // Assert: Policy denies access.
    $response->assertForbidden();
  }
}
