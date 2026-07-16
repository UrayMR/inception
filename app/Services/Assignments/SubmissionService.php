<?php

namespace App\Services\Assignments;

use App\Repositories\Assignments\Submissions\SubmissionRepository;

class SubmissionService
{
  public function __construct(
    protected SubmissionRepository $submissionRepository,
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

    return $this->submissionRepository->index($cleanParams);
  }
}
