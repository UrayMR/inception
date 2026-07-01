<?php

namespace App\Actions\Competitions;

use App\Helpers\ThrowException;
use App\Models\Competition;
use App\Repositories\Competitions\CompetitionRepository;
use App\Services\Competitions\TimelineService;
use App\Services\FileService;
use RuntimeException;

class DeleteCompetition
{
  public function __construct(
    protected FileService $fileService,
    protected CompetitionRepository $competitionRepository,
    protected TimelineService $timelineService,
  ) {}

  public function handle(Competition $competition): bool
  {
    if (! $this->timelineService->destroyMany($competition)) {
      ThrowException::runtime('Failed to delete competition timelines.');
    }

    if ($competition->image_path) {
      $this->fileService->delete($competition->image_path);
    }

    if (! $this->competitionRepository->destroy($competition)) {
      ThrowException::runtime('Failed to delete competition.');
    }

    return true;
  }
}
