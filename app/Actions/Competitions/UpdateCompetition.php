<?php

namespace App\Actions\Competitions;

use App\DTOs\Competitions\UpdateCompetitionDTO;
use App\Enums\CompetitionType;
use App\Models\Competition;
use App\Repositories\Competitions\CompetitionRepository;
use App\Utilities\SlugGenerator;
use App\Services\Competitions\TimelineService;
use App\Services\FileService;

class UpdateCompetition
{
  protected string $directory = 'competitions';

  public function __construct(
    protected FileService $fileService,
    protected CompetitionRepository $competitionRepository,
    protected TimelineService $timelineService,
  ) {}

  public function handle(UpdateCompetitionDTO $dto, Competition $competition, ?string $slug = null, array $timelineAttributes = []): Competition
  {
    $attributes = [
      'name' => $dto->name,
      'description' => $dto->description,
      'type' => $dto->type,
      'price' => $dto->price,
      'status' => $dto->status,
      'max_member' => $dto->max_member,
    ];

    if ($dto->name !== $competition->name) {
      $attributes['slug'] = $slug ?? SlugGenerator::make($dto->name);
    }

    if ($dto->image_file) {
      $attributes['image_path'] = $this->fileService->update($dto->image_file, $competition->image_path, $this->directory);
    } elseif ($dto->image_path) {
      $attributes['image_path'] = $dto->image_path;
    }

    $updatedCompetition = $this->competitionRepository->update($attributes, $competition);

    if (! empty($timelineAttributes)) {
      $this->timelineService->updateMany($updatedCompetition, $this->formatTimelines($timelineAttributes, $updatedCompetition->id));
    }

    return $updatedCompetition;
  }

  protected function formatTimelines(array $timelines, string $competitionId): array
  {
    return array_map(function (array $timeline) use ($competitionId): array {
      $timeline['competition_id'] = $competitionId;

      return $timeline;
    }, $timelines);
  }
}
