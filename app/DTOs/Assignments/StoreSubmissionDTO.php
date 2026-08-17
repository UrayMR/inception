<?php

namespace App\DTOs\Assignments;

class StoreSubmissionDTO
{
  /**
   * @param string $assignment_id
   * @param string $submission_link
   */
  public function __construct(
    public readonly string $assignment_id,
    public readonly string $submission_link,
  ) {}
}
