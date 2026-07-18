<?php

namespace App\Actions\Assignments;

use App\DTOs\Assignments\StoreAssignmentDTO;
use App\Models\Assignment;
use App\Repositories\Assignments\AssignmentRepository;

class StoreAssignment
{
  public function __construct(
    protected AssignmentRepository $assignmentRepository,
  ) {}

  public function handle(StoreAssignmentDTO $dto): Assignment
  {
    $attributes = [
      'competition_id' => $dto->competition_id,
      'name' => $dto->name,
      'assignment_guide_link' => $dto->assignment_guide_link,
      'status' => $dto->status,
      'due_at' => $dto->due_at,
    ];

    return $this->assignmentRepository->store($attributes);
  }
}
