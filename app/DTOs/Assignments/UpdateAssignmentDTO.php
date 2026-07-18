<?php

namespace App\DTOs\Assignments;

class UpdateAssignmentDTO
{
  public function __construct(
    public string $competition_id,
    public string $name,
    public string $assignment_guide_link,
    public string $status,
    public string $due_at,
  ) {}
}
