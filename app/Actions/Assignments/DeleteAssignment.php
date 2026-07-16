<?php

namespace App\Actions\Assignments;

use App\Models\Assignment;
use App\Repositories\Assignments\AssignmentRepository;

class DeleteAssignment
{
  public function __construct(
    protected AssignmentRepository $assignmentRepository,
  ) {}

  public function handle(Assignment $assignment): bool
  {
    return $this->assignmentRepository->destroy($assignment);
  }
}
