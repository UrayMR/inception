<?php

namespace Tests\Feature\Guest;

use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Models\Competition;
use App\Models\CompetitionTimeline;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CompetitionIndexTest extends TestCase
{
  use RefreshDatabase;

  public function test_guest_can_view_competition_index_with_expected_inertia_props(): void
  {
    // Arrange: Seed two competitions with different statuses and timeline dates.
    $this->withoutVite();

    $openCompetition = Competition::factory()->create([
      'name' => 'Guest Open',
      'slug' => 'guest-open',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    CompetitionTimeline::factory()->create([
      'competition_id' => $openCompetition->id,
      'start_at' => now()->addDays(2),
    ]);

    $closedCompetition = Competition::factory()->create([
      'name' => 'Guest Closed',
      'slug' => 'guest-closed',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::closed->value,
    ]);

    CompetitionTimeline::factory()->create([
      'competition_id' => $closedCompetition->id,
      'start_at' => now()->addDays(1),
    ]);

    // Act: Open the public competition index page.
    $response = $this->get(route('guest.competitions.index'));

    // Assert: The page renders with safe paginated props.
    $response
      ->assertOk()
      ->assertInertia(
        fn(Assert $page) => $page
          ->component('guest/competitions/index')
          ->has('competitions.data', 2)
          ->has('competitions.links')
          ->has('competitions.meta')
      );
  }

  public function test_participant_can_view_competition_index_sorted_by_open_status_and_nearest_timeline(): void
  {
    // Arrange: Seed competitions with different statuses and timeline dates, then sign in as a participant.
    $this->withoutVite();

    $participant = User::factory()->create([
      'role' => 'participant',
    ]);

    $openSoon = Competition::factory()->create([
      'name' => 'Open Soon',
      'slug' => 'open-soon',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    CompetitionTimeline::factory()->create([
      'competition_id' => $openSoon->id,
      'start_at' => now()->addDays(2),
    ]);

    $openLater = Competition::factory()->create([
      'name' => 'Open Later',
      'slug' => 'open-later',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    CompetitionTimeline::factory()->create([
      'competition_id' => $openLater->id,
      'start_at' => now()->addDays(10),
    ]);

    $closedSoon = Competition::factory()->create([
      'name' => 'Closed Soon',
      'slug' => 'closed-soon',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::closed->value,
    ]);

    CompetitionTimeline::factory()->create([
      'competition_id' => $closedSoon->id,
      'start_at' => now()->addDay(),
    ]);

    // Act: Request the competition index page.
    $response = $this->actingAs($participant)->get(route('guest.competitions.index'));

    // Assert: The page renders the guest competition list with the expected ordering and safe props.
    $response
      ->assertOk()
      ->assertInertia(
        fn(Assert $page) => $page
          ->component('guest/competitions/index')
          ->has('competitions.data', 3)
          ->has('competitions.links')
          ->has('competitions.meta')
          ->where('competitions.data.0.id', $openSoon->id)
          ->where('competitions.data.0.slug', 'open-soon')
          ->where('competitions.data.0.name', 'Open Soon')
          ->where('competitions.data.0.status', CompetitionStatus::open->value)
          ->where('competitions.data.1.id', $openLater->id)
          ->where('competitions.data.1.slug', 'open-later')
          ->where('competitions.data.1.name', 'Open Later')
          ->where('competitions.data.1.status', CompetitionStatus::open->value)
          ->where('competitions.data.2.id', $closedSoon->id)
          ->where('competitions.data.2.slug', 'closed-soon')
          ->where('competitions.data.2.name', 'Closed Soon')
          ->where('competitions.data.2.status', CompetitionStatus::closed->value)
          ->missing('competitions.data.0.image_path')
          ->missing('competitions.data.0.max_member')
          ->missing('competitions.data.1.image_path')
          ->missing('competitions.data.1.max_member')
          ->missing('competitions.data.2.image_path')
          ->missing('competitions.data.2.max_member')
      );
  }
}
