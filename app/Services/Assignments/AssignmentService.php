<?php

namespace App\Services\Assignments;

use App\Actions\Assignments\DeleteAssignment;
use App\Actions\Assignments\StoreAssignment;
use App\Actions\Assignments\UpdateAssignment;
use App\DTOs\Assignments\StoreAssignmentDTO;
use App\DTOs\Assignments\UpdateAssignmentDTO;
use App\Enums\AssignmentStatus;
use App\Models\Assignment;
use App\Repositories\Assignments\AssignmentRepository;
use App\Services\Competitions\CompetitionService;
use Illuminate\Support\Facades\DB;

class AssignmentService
{
  public function __construct(
    protected CompetitionService $competitionService,
    protected AssignmentRepository $assignmentRepository,
    protected StoreAssignment $storeAssignment,
    protected UpdateAssignment $updateAssignment,
    protected DeleteAssignment $deleteAssignment,
  ) {}

  public function index(array $queryParams)
  {
    // Only allow specific query params
    $cleanParams = [
      'search' => $queryParams['search'] ?? null,
      'filters' => [
        'type' => $queryParams['filters']['type'] ?? null,
        // Add more filters if needed
      ],
    ];

    return $this->assignmentRepository->index($cleanParams);
  }

  public function store(StoreAssignmentDTO $dto)
  {
    return DB::transaction(function () use ($dto) {
      return $this->storeAssignment->handle($dto);
    });
  }

  public function update(UpdateAssignmentDTO $dto, Assignment $assignment)
  {
    if ($dto->status === AssignmentStatus::active->value) {
      $this->competitionService->ensureCompetitionIsOngoing($assignment->competition);
    }

    return DB::transaction(function () use ($dto, $assignment) {
      return $this->updateAssignment->handle($dto, $assignment);
    });
  }

  public function destroy(Assignment $assignment): bool
  {
    return DB::transaction(function () use ($assignment) {
      return $this->deleteAssignment->handle($assignment);
    });
  }
}
