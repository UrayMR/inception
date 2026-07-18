<?php

namespace App\Actions\Assignments;

use App\DTOs\Assignments\UpdateAssignmentDTO;
use App\Models\Assignment;
use App\Repositories\Assignments\AssignmentRepository;

class UpdateAssignment
{
  public function __construct(
    protected AssignmentRepository $assignmentRepository,
  ) {}

  public function handle(UpdateAssignmentDTO $dto, Assignment $assignment): Assignment
  {
    $attributes = [
      'competition_id' => $dto->competition_id,
      'name' => $dto->name,
      'assignment_guide_link' => $dto->assignment_guide_link,
      'status' => $dto->status,
      'due_at' => $dto->due_at,
    ];

    return $this->assignmentRepository->update($attributes, $assignment);
  }
}
