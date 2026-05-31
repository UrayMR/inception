<?php

namespace Tests\Feature\Panel\Competition;

use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Models\Competition;
use App\Models\CompetitionTimeline;
use Inertia\Testing\AssertableInertia as Assert;

class CompetitionUpdateTest extends CompetitionTestCase
{
  public function test_guest_is_redirected_from_competition_edit(): void
  {
    // Arrange: Seed a competition.
    $competition = Competition::factory()->create([
      'type' => CompetitionType::solo->value,
      'status' => CompetitionStatus::closed->value,
    ]);

    // Act: Open the edit route without login.
    $response = $this->get(route('panel.competitions.edit', $competition));

    // Assert: Guests are redirected to login.
    $response->assertRedirect(route('login'));
  }

  public function test_admin_can_view_competition_edit_page_with_timelines(): void
  {
    // Arrange: Seed a competition with timelines and sign in as admin.
    $admin = $this->makeAdminUser();

    $this->withoutVite();

    $competition = Competition::factory()->create([
      'name' => 'Old Cup',
      'slug' => 'old-cup',
      'type' => CompetitionType::solo->value,
      'status' => CompetitionStatus::closed->value,
      'max_member' => 1,
    ]);

    CompetitionTimeline::factory()->create([
      'competition_id' => $competition->id,
      'timeline_name' => 'Initial Phase',
      'sequence' => 1,
      'start_at' => now()->addDay(),
      'end_at' => now()->addDays(2),
    ]);

    // Act: Render the edit page.
    $response = $this->actingAs($admin)->get(route('panel.competitions.edit', $competition));

    // Assert: The React component receives the competition payload and nested timelines.
    $response
      ->assertOk()
      ->assertInertia(
        fn(Assert $page) => $page
          ->component('panel/competitions/edit')
          ->has('competition')
          ->has('competition.timelines', 1)
          ->where('competition.id', $competition->id)
          ->where('competition.slug', 'old-cup')
          ->where('competition.name', 'Old Cup')
          ->where('competition.type', CompetitionType::solo->value)
          ->where('competition.status', CompetitionStatus::closed->value)
          ->where('competition.max_member', 1)
      );
  }

  public function test_admin_can_update_competition_and_timelines(): void
  {
    // Arrange: Seed competition with an existing timeline and sign in as admin.
    $admin = $this->makeAdminUser();
    $competition = Competition::factory()->create([
      'name' => 'Old Cup',
      'slug' => 'old-cup',
      'type' => CompetitionType::solo->value,
      'status' => CompetitionStatus::closed->value,
    ]);

    $timeline = CompetitionTimeline::factory()->create([
      'competition_id' => $competition->id,
      'timeline_name' => 'Initial Phase',
      'sequence' => 1,
      'start_at' => now()->addDay(),
      'end_at' => now()->addDays(2),
    ]);

    $payload = [
      'name' => 'Updated Cup',
      'description' => 'Updated description.',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
      'price' => 500000,
      'max_member' => 4,
      'timelines' => [
        [
          'id' => $timeline->id,
          'timeline_name' => 'Updated Phase',
          'description' => 'Updated timeline description',
          'sequence' => 1,
          'start_at' => now()->addDays(3)->format('Y-m-d H:i:s'),
          'end_at' => now()->addDays(4)->format('Y-m-d H:i:s'),
        ],
      ],
    ];

    // Act: Submit the update form.
    $response = $this->actingAs($admin)
      ->from(route('panel.competitions.edit', $competition))
      ->put(route('panel.competitions.update', $competition), $payload);

    // Assert: The competition is updated and redirected back to the list.
    $response
      ->assertSessionHasNoErrors()
      ->assertRedirect(route('panel.competitions.index'));

    $competition->refresh();

    $this->assertSame('Updated Cup', $competition->name);
    $this->assertSame(CompetitionType::team->value, $competition->type);
    $this->assertSame(CompetitionStatus::open->value, $competition->status);
    $this->assertSame(4, $competition->max_member);
    $this->assertDatabaseHas('competition_timelines', [
      'id' => $timeline->id,
      'competition_id' => $competition->id,
      'timeline_name' => 'Updated Phase',
      'sequence' => 1,
    ]);
    $this->assertDatabaseCount('competition_timelines', 1);
  }

  public function test_admin_cannot_update_solo_competition_with_max_member_not_equal_one(): void
  {
    // Arrange: Seed a solo competition and sign in as admin.
    $admin = $this->makeAdminUser();
    $competition = Competition::factory()->create([
      'name' => 'Solo Cup',
      'slug' => 'solo-cup',
      'type' => CompetitionType::solo->value,
      'status' => CompetitionStatus::closed->value,
      'max_member' => 1,
    ]);

    $payload = [
      'name' => 'Solo Cup Revised',
      'description' => 'Updated solo description.',
      'type' => CompetitionType::solo->value,
      'status' => CompetitionStatus::open->value,
      'price' => 150000,
      'max_member' => 8,
    ];

    // Act: Submit the update form.
    $response = $this->actingAs($admin)
      ->from(route('panel.competitions.edit', $competition))
      ->put(route('panel.competitions.update', $competition), $payload);

    // Assert: Solo competitions must reject max_member values other than 1.
    $response
      ->assertSessionHasErrors(['max_member'])
      ->assertRedirect(route('panel.competitions.edit', $competition));

    $competition->refresh();

    $this->assertSame('Solo Cup', $competition->name);
    $this->assertSame(CompetitionType::solo->value, $competition->type);
    $this->assertSame(CompetitionStatus::closed->value, $competition->status);
    $this->assertSame(1, $competition->max_member);
  }
}
