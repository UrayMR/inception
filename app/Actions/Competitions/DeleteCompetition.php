<?php

namespace App\Actions\Competitions;

use App\Models\Competition;
use App\Repositories\Competitions\CompetitionRepository;
use App\Services\Competitions\TimelineService;
use App\Services\FileService;
use Illuminate\Support\Facades\DB;
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
    return DB::transaction(function () use ($competition) {
      if (! $this->timelineService->destroyMany($competition)) {
        throw new RuntimeException('Failed to delete competition timelines.');
      }

      if ($competition->image_path) {
        $this->fileService->delete($competition->image_path);
      }

      if (! $this->competitionRepository->destroy($competition)) {
        throw new RuntimeException('Failed to delete competition.');
      }

      return true;
    });
  }
}
