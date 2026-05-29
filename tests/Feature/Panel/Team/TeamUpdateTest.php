<?php

namespace Tests\Feature\Panel\Team;

use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Enums\TeamStatus;
use App\Models\Competition;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\Feature\Panel\Team\TeamTestCase;

class TeamUpdateTest extends TeamTestCase
{
  public function test_guest_is_redirected_from_team_edit(): void
  {
    // Arrange: Seed a team.
    $team = Team::factory()->create();

    // Act: Open the team edit route without authentication.
    $response = $this->get(route('panel.teams.edit', $team));

    // Assert: Guests are redirected to login.
    $response->assertRedirect(route('login'));
  }

  public function test_admin_can_view_team_edit_page_with_members_and_competition_map(): void
  {
    // Arrange: Seed competition, team, and members.
    $admin = $this->makeAdminUser();
    $competition = Competition::factory()->create([
      'name' => 'Team Competition',
      'slug' => 'team-competition',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    $team = Team::factory()->create([
      'competition_id' => $competition->id,
      'leader_id' => $admin->id,
      'team_name' => 'Alpha Team',
      'status' => TeamStatus::active->value,
    ]);

    TeamMember::factory()->create([
      'team_id' => $team->id,
      'member_name' => 'Member One',
    ]);
    TeamMember::factory()->create([
      'team_id' => $team->id,
      'member_name' => 'Member Two',
    ]);

    // Act: Request the team edit page.
    $response = $this->actingAs($admin)->get(route('panel.teams.edit', $team));

    // Assert: The React component receives the team payload, members, and competition map.
    $response
      ->assertOk()
      ->assertInertia(
        fn(Assert $page) => $page
          ->component('panel/teams/edit')
          ->has('team')
          ->has('team.members', 2)
          ->has('competitionMap', 1)
          ->where('team.id', $team->id)
          ->where('team.competition_id', $competition->id)
          ->where('team.team_name', 'Alpha Team')
          ->where('team.status', TeamStatus::active->value)
          ->where('team.members.0.member_name', 'Member One')
          ->where('team.members.1.member_name', 'Member Two')
      );
  }

  public function test_admin_can_update_team_and_members(): void
  {
    // Arrange: Seed competition, team, and an existing member set.
    $admin = $this->makeAdminUser();
    $competition = Competition::factory()->create([
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    $team = Team::factory()->create([
      'competition_id' => $competition->id,
      'leader_id' => $admin->id,
      'team_name' => 'Old Team',
      'phone_number' => '0811111111',
      'institution' => 'Old Institution',
      'status' => TeamStatus::active->value,
    ]);

    TeamMember::factory()->create([
      'team_id' => $team->id,
      'member_name' => 'Old Member',
    ]);

    $payload = [
      'competition_id' => $competition->id,
      'team_name' => 'Updated Team',
      'phone_number' => '0822222222',
      'institution' => 'Updated Institution',
      'status' => TeamStatus::registered->value,
      'members' => [
        ['member_name' => 'New Member One'],
        ['member_name' => 'New Member Two'],
      ],
    ];

    // Act: Submit the team update form.
    $response = $this->actingAs($admin)
      ->from(route('panel.teams.edit', $team))
      ->put(route('panel.teams.update', $team), $payload);

    // Assert: The team and members are updated atomically.
    $response
      ->assertSessionHasNoErrors()
      ->assertRedirect(route('panel.teams.index'));

    $team->refresh();

    $this->assertSame($competition->id, $team->competition_id);
    $this->assertSame('Updated Team', $team->team_name);
    $this->assertSame('0822222222', $team->phone_number);
    $this->assertSame('Updated Institution', $team->institution);
    $this->assertSame(TeamStatus::registered->value, $team->status);
    $this->assertDatabaseCount('team_members', 2);
    $this->assertDatabaseMissing('team_members', [
      'team_id' => $team->id,
      'member_name' => 'Old Member',
    ]);
    $this->assertDatabaseHas('team_members', [
      'team_id' => $team->id,
      'member_name' => 'New Member One',
    ]);
    $this->assertDatabaseHas('team_members', [
      'team_id' => $team->id,
      'member_name' => 'New Member Two',
    ]);
  }
}
