<?php

namespace App\Services\Assignments;

use App\Repositories\Assignments\AssignmentRepository;

class SubmissionService
{
  public function __construct(
    protected AssignmentRepository $assignmentRepository,
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
}
