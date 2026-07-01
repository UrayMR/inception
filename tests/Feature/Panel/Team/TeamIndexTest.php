<?php

namespace Tests\Feature\Panel\Team;

use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Enums\TeamStatus;
use App\Models\Competition;
use App\Models\Team;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\Feature\Panel\Team\TeamTestCase;

class TeamIndexTest extends TeamTestCase
{
  public function test_guest_is_redirected_from_team_index(): void
  {
    // Arrange: No authenticated user.

    // Act: Open the team index route.
    $response = $this->get(route('panel.teams.index'));

    // Assert: Guests are redirected to login.
    $response->assertRedirect(route('login'));
  }

  public function test_admin_can_view_team_index_with_expected_inertia_props(): void
  {
    // Arrange: Seed competition, leader, and a team.
    $admin = $this->makeAdminUser();
    $competition = Competition::factory()->create([
      'name' => 'Team Competition',
      'slug' => 'team-competition',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    $leader = User::factory()->create([
      'name' => 'Leader Name',
      'role' => 'participant',
    ]);

    $team = Team::factory()->create([
      'competition_id' => $competition->id,
      'leader_id' => $leader->id,
      'team_name' => 'Alpha Team',
      'status' => TeamStatus::active->value,
    ]);

    // Act: Request the team index page.
    $response = $this->actingAs($admin)->get(route('panel.teams.index'));

    // Assert: The React component and paginated props are correct.
    $response
      ->assertOk()
      ->assertInertia(
        fn(Assert $page) => $page
          ->component('panel/teams/index')
          ->has('teams.data', 1)
          ->has('teams.links')
          ->has('teams.meta')
          ->where('teams.data.0.id', $team->id)
          ->where('teams.data.0.competition.value', $competition->id)
          ->where('teams.data.0.competition.label', 'Team Competition')
          ->where('teams.data.0.team_name', 'Alpha Team')
          ->where('teams.data.0.leader_name', 'Leader Name')
          ->where('teams.data.0.status', TeamStatus::active->value)
      );
  }

  public function test_non_admin_cannot_view_team_index(): void
  {
    // Arrange: Sign in as a participant.
    $user = User::factory()->create([
      'role' => 'participant',
    ]);

    // Act: Request the team index page.
    $response = $this->actingAs($user)->get(route('panel.teams.index'));

    // Assert: Policy denies access.
    $response->assertForbidden();
  }
}
