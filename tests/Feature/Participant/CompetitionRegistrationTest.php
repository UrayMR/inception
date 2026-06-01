<?php

namespace Tests\Feature\Participant;

use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Enums\TransactionMethod;
use App\Enums\TransactionStatus;
use App\Models\Competition;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CompetitionRegistrationTest extends TestCase
{
  use RefreshDatabase;

  public function test_guest_is_redirected_from_competition_register_page(): void
  {
    // Arrange: No authenticated user is present.

    // Act: Open the competition registration page.
    $response = $this->get(route('participant.competitions.register'));

    // Assert: Guests are redirected to login.
    $response->assertRedirect(route('login'));
  }

  public function test_participant_can_view_competition_register_page_with_open_competitions_only(): void
  {
    // Arrange: Seed open and closed competitions, then sign in as a participant.
    $this->withoutVite();

    $participant = User::factory()->create([
      'role' => 'participant',
    ]);

    $openCompetition = Competition::factory()->create([
      'name' => 'Open Cup',
      'slug' => 'open-cup',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    Competition::factory()->create([
      'name' => 'Closed Cup',
      'slug' => 'closed-cup',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::closed->value,
    ]);

    // Act: Request the registration page.
    $response = $this->actingAs($participant)->get(route('participant.competitions.register'));

    // Assert: The page renders with only open competitions in the map.
    $response
      ->assertOk()
      ->assertInertia(
        fn(Assert $page) => $page
          ->component('participant/competitions/register')
          ->has('competitionMap', 1)
          ->where('competitionMap.0.value', $openCompetition->id)
          ->where('competitionMap.0.label', 'Open Cup')
          ->where('competitionMap.0.otherValues.slug', 'open-cup')
          ->where('competitionMap.0.otherValues.type', CompetitionType::team->value)
          ->where('competitionMap.0.otherValues.price', $openCompetition->price)
      );
  }

  public function test_participant_can_submit_team_registration_successfully(): void
  {
    // Arrange: Prepare a participant, an open team competition, and a valid upload payload.
    Storage::fake('public');

    $participant = User::factory()->create([
      'role' => 'participant',
    ]);

    $competition = Competition::factory()->create([
      'name' => 'Inception Clash',
      'slug' => 'inception-clash',
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
      'price' => 150000,
    ]);

    $payload = [
      'competition_id' => $competition->id,
      'team_name' => 'Alpha Team',
      'phone_number' => '08123456789',
      'institution' => 'Inception University',
      'payment_method' => TransactionMethod::qris->value,
      'payment_proof_file' => UploadedFile::fake()->image('payment-proof.jpg'),
      'members' => [
        ['member_name' => 'Member One'],
        ['member_name' => 'Member Two'],
      ],
    ];

    // Act: Submit the registration form.
    $response = $this->actingAs($participant)
      ->from(route('participant.competitions.register'))
      ->post(route('participant.competitions.register.store'), $payload);

    // Assert: The registration is stored and the user is redirected back to the competition list.
    $response
      ->assertSessionHasNoErrors()
      ->assertRedirect(route('guest.competitions.index'));

    $team = Team::query()->where('team_name', 'Alpha Team')->firstOrFail();
    $transaction = Transaction::query()->where('team_id', $team->id)->firstOrFail();

    $this->assertSame($participant->id, $team->leader_id);
    $this->assertSame($competition->id, $team->competition_id);
    $this->assertSame('08123456789', $team->phone_number);
    $this->assertSame('Inception University', $team->institution);
    $this->assertSame(2, TeamMember::query()->where('team_id', $team->id)->count());

    $this->assertDatabaseHas('team_members', [
      'team_id' => $team->id,
      'member_name' => 'Member One',
    ]);

    $this->assertDatabaseHas('team_members', [
      'team_id' => $team->id,
      'member_name' => 'Member Two',
    ]);

    $this->assertEquals($competition->price, $transaction->amount);
    $this->assertSame(TransactionMethod::qris->value, $transaction->payment_method);
    $this->assertSame(TransactionStatus::pending->value, $transaction->status);
    $this->assertTrue(Storage::disk('public')->exists($transaction->payment_proof_path));
  }

  public function test_participant_cannot_submit_team_registration_without_team_name(): void
  {
    // Arrange: Prepare a participant and a team competition without a team name.
    Storage::fake('public');

    $participant = User::factory()->create([
      'role' => 'participant',
    ]);

    $competition = Competition::factory()->create([
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    $payload = [
      'competition_id' => $competition->id,
      'team_name' => null,
      'phone_number' => '08123456789',
      'institution' => 'Inception University',
      'payment_method' => TransactionMethod::qris->value,
      'payment_proof_file' => UploadedFile::fake()->image('payment-proof.jpg'),
      'members' => [
        ['member_name' => 'Member One'],
      ],
    ];

    // Act: Submit the registration form without a team name.
    $response = $this->actingAs($participant)
      ->from(route('participant.competitions.register'))
      ->post(route('participant.competitions.register.store'), $payload);

    // Assert: Validation blocks the request and no registration data is persisted.
    $response
      ->assertSessionHasErrors('team_name')
      ->assertRedirect(route('participant.competitions.register'));

    $this->assertDatabaseCount('teams', 0);
    $this->assertDatabaseCount('transactions', 0);
  }

  public function test_participant_cannot_submit_team_registration_without_members(): void
  {
    // Arrange: Prepare a participant and a team competition without team members.
    Storage::fake('public');

    $participant = User::factory()->create([
      'role' => 'participant',
    ]);

    $competition = Competition::factory()->create([
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    $payload = [
      'competition_id' => $competition->id,
      'team_name' => 'Alpha Team',
      'phone_number' => '08123456789',
      'institution' => 'Inception University',
      'payment_method' => TransactionMethod::qris->value,
      'payment_proof_file' => UploadedFile::fake()->image('payment-proof.jpg'),
      'members' => [],
    ];

    // Act: Submit the registration form without team members.
    $response = $this->actingAs($participant)
      ->from(route('participant.competitions.register'))
      ->post(route('participant.competitions.register.store'), $payload);

    // Assert: Validation blocks the request and no registration data is persisted.
    $response
      ->assertSessionHasErrors('members')
      ->assertRedirect(route('participant.competitions.register'));

    $this->assertDatabaseCount('teams', 0);
    $this->assertDatabaseCount('transactions', 0);
  }
}
