<?php

namespace Tests\Feature\Guest;

use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Models\Competition;
use App\Models\CompetitionTimeline;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CompetitionShowTest extends TestCase
{
  use RefreshDatabase;

  public function test_guest_can_view_competition_show_with_expected_inertia_props(): void
  {
    // Arrange: Seed a public competition with timelines.
    $this->withoutVite();

    $competition = Competition::factory()->create([
      'name' => 'Guest Show Cup',
      'slug' => 'guest-show-cup',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    CompetitionTimeline::factory()->create([
      'competition_id' => $competition->id,
      'timeline_name' => 'Registration',
      'sequence' => 1,
    ]);

    // Act: Open the public competition detail page.
    $response = $this->get(route('guest.competitions.show', $competition));

    // Assert: The page renders with the expected detail payload.
    $response
      ->assertOk()
      ->assertInertia(
        fn(Assert $page) => $page
          ->component('guest/competitions/show')
          ->where('competition.id', $competition->id)
          ->where('competition.slug', 'guest-show-cup')
          ->where('competition.name', 'Guest Show Cup')
          ->where('competition.status', CompetitionStatus::open->value)
          ->has('competition.timelines', 1)
      );
  }
}
