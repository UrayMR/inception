<?php

namespace App\Services\Competitions;

use App\DTOs\Competitions\StoreCompetitionDTO;
use App\DTOs\Competitions\UpdateCompetitionDTO;
use App\Models\Competition;
use App\Repositories\Competitions\CompetitionRepository;
use App\Utilities\SlugGenerator;
use Illuminate\Http\Request;
use App\Services\FileService;


class CompetitionService
{
  /**
   * The default directory for storing competition-related files.
   *
   * @var string
   */
  protected string $directory = 'competitions';

  public function __construct(
    protected FileService $fileService,
    protected CompetitionRepository $competitionRepository,
  ) {}

  public function index(Request $request)
  {
    // Only allow specific query params
    $queryParams = [
      'search' => $request->query('search'),
      'filters' => [
        'type' => $request->query('type'),
        // Add more filters if needed
      ],
    ];

    return $this->competitionRepository->index($queryParams);
  }

  public function create(StoreCompetitionDTO $dto): Competition
  {
    $attributes = [
      'name' => $dto->name,
      'description' => $dto->description,
      'slug' => SlugGenerator::make($dto->name),
      'type' => $dto->type,
      'price' => $dto->price,
      'status' => $dto->status,
    ];

    if ($dto->image_file) {
      $attributes['image_path'] = $this->fileService->store($dto->image_file, $this->directory);
    }

    return $this->competitionRepository->store($attributes);
  }

  public function update(UpdateCompetitionDTO $dto, Competition $competition): Competition
  {
    $attributes = [
      'name' => $dto->name,
      'description' => $dto->description,
      'type' => $dto->type,
      'price' => $dto->price,
      'status' => $dto->status,
    ];

    if ($dto->name !== $competition->name) {
      $attributes['slug'] = SlugGenerator::make($dto->name);
    }

    if ($dto->image_file) {
      $attributes['image_path'] = $this->fileService->update($dto->image_file, $competition->image_path, $this->directory);
    } elseif ($dto->image_path) {
      $attributes['image_path'] = $dto->image_path;
    }

    return $this->competitionRepository->update($attributes, $competition);
  }

  public function destroy(Competition $competition): bool
  {
    if ($competition->image_path) {
      $this->fileService->delete($competition->image_path);
    }

    return $this->competitionRepository->destroy($competition);
  }
}
