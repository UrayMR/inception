<?php

namespace Tests\Feature\Panel\Team;

use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Enums\TeamStatus;
use App\Models\Competition;
use App\Models\Team;
use App\Models\TeamMember;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\Feature\Panel\Team\TeamTestCase;

class TeamCreateTest extends TeamTestCase
{
  public function test_guest_is_redirected_from_team_create(): void
  {
    // Arrange: No authenticated user.

    // Act: Open the team create route.
    $response = $this->get(route('panel.teams.create'));

    // Assert: Guests are redirected to login.
    $response->assertRedirect(route('login'));
  }

  public function test_admin_can_view_team_create_page_with_competition_map(): void
  {
    // Arrange: Seed a team competition and sign in as admin.
    $admin = $this->makeAdminUser();
    $competition = Competition::factory()->create([
      'name' => 'Team Competition',
      'slug' => 'team-competition',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    // Act: Request the team create page.
    $response = $this->actingAs($admin)->get(route('panel.teams.create'));

    // Assert: The React component receives the competition map.
    $response
      ->assertOk()
      ->assertInertia(
        fn(Assert $page) => $page
          ->component('panel/teams/create')
          ->has('competitionMap', 1)
          ->where('competitionMap.0.value', $competition->id)
          ->where('competitionMap.0.label', 'Team Competition')
          ->where('competitionMap.0.otherValues.slug', 'team-competition')
          ->where('competitionMap.0.otherValues.type', CompetitionType::team->value)
      );
  }

  public function test_admin_can_store_team_with_members(): void
  {
    // Arrange: Seed a team competition and prepare a valid payload.
    $admin = $this->makeAdminUser();
    $competition = Competition::factory()->create([
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    $payload = [
      'competition_id' => $competition->id,
      'team_name' => 'Alpha Team',
      'phone_number' => '08123456789',
      'institution' => 'Inception University',
      'status' => TeamStatus::active->value,
      'members' => [
        ['member_name' => 'Member One'],
        ['member_name' => 'Member Two'],
      ],
    ];

    // Act: Submit the team create form.
    $response = $this->actingAs($admin)
      ->from(route('panel.teams.create'))
      ->post(route('panel.teams.store'), $payload);

    // Assert: Team and members are persisted.
    $response
      ->assertSessionHasNoErrors()
      ->assertRedirect(route('panel.teams.index'));

    $team = Team::query()->where('team_name', 'Alpha Team')->firstOrFail();

    $this->assertSame($admin->id, $team->leader_id);
    $this->assertSame($competition->id, $team->competition_id);
    $this->assertSame(TeamStatus::active->value, $team->status);
    $this->assertDatabaseCount('team_members', 2);
    $this->assertDatabaseHas('team_members', [
      'team_id' => $team->id,
      'member_name' => 'Member One',
    ]);
    $this->assertDatabaseHas('team_members', [
      'team_id' => $team->id,
      'member_name' => 'Member Two',
    ]);
  }

  public function test_admin_cannot_store_team_without_members_for_team_competition(): void
  {
    // Arrange: Seed a team competition and prepare a payload without members.
    $admin = $this->makeAdminUser();
    $competition = Competition::factory()->create([
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    $payload = [
      'competition_id' => $competition->id,
      'team_name' => 'Alpha Team',
      'phone_number' => '08123456789',
      'institution' => 'Inception University',
      'status' => TeamStatus::active->value,
      'members' => [],
    ];

    // Act: Submit the team create form without members.
    $response = $this->actingAs($admin)
      ->from(route('panel.teams.create'))
      ->post(route('panel.teams.store'), $payload);

    // Assert: Validation blocks the request.
    $response
      ->assertSessionHasErrors('members')
      ->assertRedirect(route('panel.teams.create'));

    $this->assertDatabaseMissing('teams', [
      'team_name' => 'Alpha Team',
    ]);
    $this->assertDatabaseCount('team_members', 0);
  }
}
