<?php

namespace App\Services\Competitions;

use App\DTOs\Competitions\StoreCompetitionDTO;
use App\DTOs\Competitions\UpdateCompetitionDTO;
use App\Models\Competition;
use App\Repositories\Competitions\CompetitionRepository;
use App\Repositories\Competitions\Timelines\TimelineRepository;
use App\Utilities\SlugGenerator;
use Illuminate\Http\Request;
use App\Services\FileService;
use Illuminate\Support\Collection;

class TimelineService
{

  public function __construct(
    protected TimelineRepository $timelineRepository,
  ) {}

  public function createMany(Competition $competition, array $attributes): void
  {
    $this->timelineRepository->storeMany($competition, $attributes);
  }

  public function updateMany(Competition $competition, array $attributes): void
  {
    $this->timelineRepository->updateMany($competition, $attributes);
  }

  public function destroyMany(Competition $competition): bool
  {
    return $this->timelineRepository->destroyMany($competition);
  }
}
