<?php

namespace Tests\Feature\Panel\Competition;

use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Models\Competition;
use Inertia\Testing\AssertableInertia as Assert;

class CompetitionCreateTest extends CompetitionTestCase
{
  public function test_guest_is_redirected_from_competition_create(): void
  {
    // Arrange: No authenticated user.

    // Act: Open the competition create route.
    $response = $this->get(route('panel.competitions.create'));

    // Assert: Guests are redirected to login.
    $response->assertRedirect(route('login'));
  }

  public function test_admin_can_view_competition_create_page(): void
  {
    // Arrange: Sign in as admin.
    $admin = $this->makeAdminUser();

    // Act: Render the competition create page.
    $response = $this->actingAs($admin)->get(route('panel.competitions.create'));

    // Assert: The React component is rendered and shared error props exist.
    $response
      ->assertOk()
      ->assertInertia(
        fn(Assert $page) => $page
          ->component('panel/competitions/create')
          ->has('errors')
      );
  }

  public function test_admin_can_store_competition_with_timelines(): void
  {
    // Arrange: Sign in as admin and prepare valid competition payload.
    $admin = $this->makeAdminUser();

    $payload = [
      'name' => 'Inception Cup',
      'description' => 'A sample team competition.',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
      'price' => 250000,
      'timelines' => [
        [
          'timeline_name' => 'Registration',
          'description' => 'Open registration period',
          'sequence' => 1,
          'start_at' => now()->addDay()->format('Y-m-d H:i:s'),
          'end_at' => now()->addDays(2)->format('Y-m-d H:i:s'),
        ],
      ],
    ];

    // Act: Submit the create form.
    $response = $this->actingAs($admin)
      ->from(route('panel.competitions.create'))
      ->post(route('panel.competitions.store'), $payload);

    // Assert: Competition and timeline are persisted.
    $response
      ->assertSessionHasNoErrors()
      ->assertRedirect(route('panel.competitions.index'));

    $competition = Competition::query()->where('slug', 'inception-cup')->firstOrFail();

    $this->assertSame('Inception Cup', $competition->name);
    $this->assertSame(CompetitionType::team->value, $competition->type);
    $this->assertSame(CompetitionStatus::open->value, $competition->status);
    $this->assertDatabaseHas('competition_timelines', [
      'competition_id' => $competition->id,
      'timeline_name' => 'Registration',
      'sequence' => 1,
    ]);
  }
}
