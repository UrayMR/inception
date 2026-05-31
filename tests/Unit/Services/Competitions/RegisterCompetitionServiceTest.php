<?php

namespace Tests\Unit\Services\Competitions;

use App\Actions\Competitions\Registrations\StoreCompetitionRegistration;
use App\Actions\Competitions\Registrations\UpdateCompetitionRegistration;
use App\DTOs\Competitions\Registrations\RegisterCompetitionDTO;
use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Enums\TeamStatus;
use App\Models\Competition;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Services\Competitions\Registrations\RegisterCompetitionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Mockery;
use Tests\TestCase;

class RegisterCompetitionServiceTest extends TestCase
{
  use RefreshDatabase;

  protected function tearDown(): void
  {
    Mockery::close();

    parent::tearDown();
  }

  private function makeDTO(User $user, Competition $competition, array $overrides = []): RegisterCompetitionDTO
  {
    Storage::fake('public');

    return new RegisterCompetitionDTO(
      competition_id: $competition->id,
      team_name: array_key_exists('team_name', $overrides) ? $overrides['team_name'] : 'Team X',
      leader_id: $user->id,
      leader_name: $user->name,
      phone_number: array_key_exists('phone_number', $overrides) ? $overrides['phone_number'] : '08123456789',
      institution: array_key_exists('institution', $overrides) ? $overrides['institution'] : 'Acme University',
      payment_method: array_key_exists('payment_method', $overrides) ? $overrides['payment_method'] : 'qris',
      payment_proof_file: array_key_exists('payment_proof_file', $overrides) ? $overrides['payment_proof_file'] : UploadedFile::fake()->image('proof.jpg'),
      members: array_key_exists('members', $overrides) ? $overrides['members'] : [['member_name' => 'A']],
    );
  }

  public function test_register_throws_when_competition_is_not_open(): void
  {
    // Arrange
    $this->expectException(ValidationException::class);

    $user = User::factory()->create();
    $competition = Competition::factory()->create([
      'status' => CompetitionStatus::closed->value,
    ]);

    $dto = $this->makeDTO($user, $competition);

    $store = Mockery::mock(StoreCompetitionRegistration::class);
    $update = Mockery::mock(UpdateCompetitionRegistration::class);

    $service = new RegisterCompetitionService($store, $update);

    // Act
    $service->register($dto, $competition);

    // Assert: handled by expectException
  }

  public function test_register_throws_when_leader_has_active_registration(): void
  {
    // Arrange
    $this->expectException(ValidationException::class);

    $user = User::factory()->create();
    $competition = Competition::factory()->create(['status' => CompetitionStatus::open->value]);

    // Existing active team for same leader
    Team::factory()->create([
      'leader_id' => $user->id,
      'status' => TeamStatus::active->value,
    ]);

    $dto = $this->makeDTO($user, $competition);

    $store = Mockery::mock(StoreCompetitionRegistration::class);
    $update = Mockery::mock(UpdateCompetitionRegistration::class);

    $service = new RegisterCompetitionService($store, $update);

    // Act
    $service->register($dto, $competition);

    // Assert: handled by expectException
  }

  public function test_register_throws_when_team_competition_missing_team_name(): void
  {
    // Arrange
    $this->expectException(ValidationException::class);

    $user = User::factory()->create();
    $competition = Competition::factory()->create([
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    $dto = $this->makeDTO($user, $competition, ['team_name' => null]);

    $store = Mockery::mock(StoreCompetitionRegistration::class);
    $update = Mockery::mock(UpdateCompetitionRegistration::class);

    $service = new RegisterCompetitionService($store, $update);

    // Act
    $service->register($dto, $competition);

    // Assert: handled by expectException
  }

  public function test_register_throws_when_team_competition_missing_members(): void
  {
    // Arrange
    $this->expectException(ValidationException::class);

    $user = User::factory()->create();
    $competition = Competition::factory()->create([
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    $dto = $this->makeDTO($user, $competition, ['members' => []]);

    $store = Mockery::mock(StoreCompetitionRegistration::class);
    $update = Mockery::mock(UpdateCompetitionRegistration::class);

    $service = new RegisterCompetitionService($store, $update);

    // Act
    $service->register($dto, $competition);

    // Assert: handled by expectException
  }

  public function test_register_calls_update_when_existing_rejected_team_found(): void
  {
    // Arrange
    $user = User::factory()->create();
    $competition = Competition::factory()->create([
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    $existing = Team::factory()->create([
      'leader_id' => $user->id,
      'competition_id' => $competition->id,
      'status' => TeamStatus::rejected->value,
    ]);

    $dto = $this->makeDTO($user, $competition);

    $store = Mockery::mock(StoreCompetitionRegistration::class);
    $update = Mockery::mock(UpdateCompetitionRegistration::class);

    $update->shouldReceive('handle')->once()->withArgs(function ($argDto, $argCompetition, $argTeam) use ($existing) {
      return $argTeam->id === $existing->id;
    })->andReturn($existing);

    $store->shouldNotReceive('handle');


    $service = new RegisterCompetitionService($store, $update);

    // Prevent nested DB transaction issues in unit tests: run closure directly
    DB::shouldReceive('transaction')->andReturnUsing(function ($closure) {
      return $closure();
    });

    // Act
    $service->register($dto, $competition);

    // Assert: if no exception, test passes
    $this->assertTrue(true);
  }

  public function test_register_calls_store_when_no_existing_rejected_team(): void
  {
    // Arrange
    $user = User::factory()->create();
    $competition = Competition::factory()->create([
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
      'price' => 50000,
    ]);

    $dto = $this->makeDTO($user, $competition);

    // Precondition: there should be no active/registered team for this leader
    $this->assertDatabaseCount('teams', 0);
    $this->assertFalse(Team::query()->where('leader_id', $user->id)->whereIn('status', [TeamStatus::active->value, TeamStatus::registered->value])->exists());

    $store = Mockery::mock(StoreCompetitionRegistration::class);
    $update = Mockery::mock(UpdateCompetitionRegistration::class);

    $store->shouldReceive('handle')->once()->withArgs(function ($argDto, $argCompetition) use ($competition) {
      return $argCompetition->id === $competition->id;
    })->andReturnUsing(function () use ($user, $competition) {
      return Team::factory()->create([
        'leader_id' => $user->id,
        'competition_id' => $competition->id,
        'status' => TeamStatus::active->value,
      ]);
    });

    $update->shouldNotReceive('handle');

    $service = new RegisterCompetitionService($store, $update);

    // Prevent nested DB transaction issues in unit tests: run closure directly
    DB::shouldReceive('transaction')->andReturnUsing(function ($closure) {
      return $closure();
    });

    // Act
    $service->register($dto, $competition);

    // Assert: if no exception, test passes
    $this->assertTrue(true);
  }
}
