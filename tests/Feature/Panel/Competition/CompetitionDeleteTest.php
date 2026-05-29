<?php

namespace Tests\Feature\Panel\Competition;

use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Models\Competition;
use App\Models\CompetitionTimeline;
use Tests\Feature\Panel\Competition\CompetitionTestCase;

class CompetitionDeleteTest extends CompetitionTestCase
{
  public function test_guest_is_redirected_from_competition_destroy(): void
  {
    // Arrange: Seed a competition.
    $competition = Competition::factory()->create([
      'name' => 'Delete Cup',
      'slug' => 'delete-cup',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    // Act: Try to delete without login.
    $response = $this->delete(route('panel.competitions.destroy', $competition));

    // Assert: Guests are redirected to login.
    $response->assertRedirect(route('login'));
  }

  public function test_admin_can_delete_competition(): void
  {
    // Arrange: Seed a competition and sign in as admin.
    $admin = $this->makeAdminUser();
    $competition = Competition::factory()->create([
      'name' => 'Delete Cup',
      'slug' => 'delete-cup',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    CompetitionTimeline::factory()->create([
      'competition_id' => $competition->id,
      'timeline_name' => 'Deletion Timeline',
      'sequence' => 1,
      'start_at' => now()->addDay(),
      'end_at' => now()->addDays(2),
    ]);

    // Act: Submit the delete request.
    $response = $this->actingAs($admin)
      ->from(route('panel.competitions.index'))
      ->delete(route('panel.competitions.destroy', $competition));

    // Assert: The competition is removed from the database.
    $response
      ->assertSessionHasNoErrors()
      ->assertRedirect(route('panel.competitions.index'));

    $this->assertDatabaseMissing('competitions', [
      'id' => $competition->id,
    ]);
  }
}
