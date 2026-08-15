<?php

namespace App\Resources\Assignments;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserAssignmentSubmissionResource extends JsonResource
{
  public function toArray(Request $request): array
  {
    $submission = $this->submission;

    return [
      'id' => $this->id,
      'competition' => [
        'value' => $this->competition?->id,
        'label' => $this->competition?->name,
      ],
      'name' => $this->name,
      'status' => $this->status,
      'due_at' => $this->due_at,
      'assignment_guide_link' => $this->assignment_guide_link,
      'submission' => $submission ? [
        'id' => $submission->id,
        'submission_link' => $submission->submission_link,
        'updated_at' => $submission->updated_at,
        'created_at' => $submission->created_at,
      ] : null,
    ];
  }
}
