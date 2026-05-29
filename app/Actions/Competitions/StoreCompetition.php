<?php

namespace App\Actions\Competitions;

use App\DTOs\Competitions\StoreCompetitionDTO;
use App\Models\Competition;
use App\Repositories\Competitions\CompetitionRepository;
use App\Utilities\SlugGenerator;
use App\Services\Competitions\TimelineService;
use App\Services\FileService;

class StoreCompetition
{
  protected string $directory = 'competitions';

  public function __construct(
    protected FileService $fileService,
    protected CompetitionRepository $competitionRepository,
    protected TimelineService $timelineService,
  ) {}

  public function handle(StoreCompetitionDTO $dto, string $slug, array $timelineAttributes = []): Competition
  {
    $attributes = [
      'name' => $dto->name,
      'description' => $dto->description,
      'slug' => $slug,
      'type' => $dto->type,
      'price' => $dto->price,
      'status' => $dto->status,
    ];

    if ($dto->image_file) {
      $attributes['image_path'] = $this->fileService->store($dto->image_file, $this->directory);
    }

    $competition = $this->competitionRepository->store($attributes);

    if (! empty($timelineAttributes)) {
      $this->timelineService->createMany($competition, $this->formatTimelines($timelineAttributes, $competition->id));
    }

    return $competition;
  }

  protected function formatTimelines(array $timelines, string $competitionId): array
  {
    return array_map(function (array $timeline) use ($competitionId): array {
      $timeline['competition_id'] = $competitionId;

      return $timeline;
    }, $timelines);
  }
}
