<?php

namespace Tests\Unit\Services\Competitions;

use App\Enums\CompetitionStatus;
use App\Enums\CompetitionType;
use App\Models\Competition;
use App\Services\Competitions\CompetitionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class CompetitionServiceTest extends TestCase
{
  use RefreshDatabase;

  public function test_throws_when_members_provided_for_solo_competition(): void
  {
    // Arrange
    $this->expectException(ValidationException::class);

    $competition = Competition::factory()->create([
      'type' => CompetitionType::solo->value,
      'status' => CompetitionStatus::open->value,
    ]);

    $service = app(CompetitionService::class);

    // Act
    $service->ensureTeamCompetitionPayloadIsValid($competition->id, [['member_name' => 'X']]);

    // Assert: expectException
  }

  public function test_throws_when_no_members_for_team_competition(): void
  {
    // Arrange
    $this->expectException(ValidationException::class);

    $competition = Competition::factory()->create([
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    $service = app(CompetitionService::class);

    // Act
    $service->ensureTeamCompetitionPayloadIsValid($competition->id, []);

    // Assert: expectException
  }

  public function test_no_exception_for_valid_cases(): void
  {
    // Arrange
    $competitionSolo = Competition::factory()->create([
      'type' => CompetitionType::solo->value,
      'status' => CompetitionStatus::open->value,
    ]);

    $competitionTeam = Competition::factory()->create([
      'type' => CompetitionType::team->value,
      'status' => CompetitionStatus::open->value,
    ]);

    $service = app(CompetitionService::class);

    // Act
    // solo without members should pass
    $service->ensureTeamCompetitionPayloadIsValid($competitionSolo->id, []);

    // team with members should pass
    $service->ensureTeamCompetitionPayloadIsValid($competitionTeam->id, [['member_name' => 'A']]);

    // Assert: if no exception, test passes
    $this->assertTrue(true);
  }
}
