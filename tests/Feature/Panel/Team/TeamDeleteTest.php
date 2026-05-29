<?php

namespace Tests\Feature\Panel\Team;

use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Enums\TeamStatus;
use App\Models\Competition;
use App\Models\Team;
use App\Models\TeamMember;
use Tests\Feature\Panel\Team\TeamTestCase;

class TeamDeleteTest extends TeamTestCase
{
  public function test_guest_is_redirected_from_team_destroy(): void
  {
    // Arrange: Seed a team.
    $team = Team::factory()->create();

    // Act: Call the delete route without authentication.
    $response = $this->delete(route('panel.teams.destroy', $team));

    // Assert: Guests are redirected to login.
    $response->assertRedirect(route('login'));
  }

  public function test_admin_can_delete_team_and_members(): void
  {
    // Arrange: Seed competition, team, members, and sign in as admin.
    $admin = $this->makeAdminUser();
    $competition = Competition::factory()->create([
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    $team = Team::factory()->create([
      'competition_id' => $competition->id,
      'leader_id' => $admin->id,
      'status' => TeamStatus::active->value,
    ]);

    TeamMember::factory()->create([
      'team_id' => $team->id,
      'member_name' => 'Member One',
    ]);

    // Act: Submit the delete request.
    $response = $this->actingAs($admin)
      ->from(route('panel.teams.index'))
      ->delete(route('panel.teams.destroy', $team));

    // Assert: The team and its members are removed.
    $response
      ->assertSessionHasNoErrors()
      ->assertRedirect(route('panel.teams.index'));

    $this->assertDatabaseMissing('teams', [
      'id' => $team->id,
    ]);
    $this->assertDatabaseMissing('team_members', [
      'team_id' => $team->id,
    ]);
  }

  public function test_non_admin_cannot_delete_team(): void
  {
    // Arrange: Sign in as a non-admin user and seed a team.
    $user = $this->makeAdminUser();
    $user->update(['role' => 'participant']);

    $team = Team::factory()->create();

    // Act: Attempt to delete the team as a non-admin.
    $response = $this->actingAs($user)->delete(route('panel.teams.destroy', $team));

    // Assert: The policy blocks access.
    $response->assertForbidden();
  }
}
