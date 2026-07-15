<?php

namespace App\Resources\Assignments\Submissions;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndexSubmissionResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @param  Request  $request
   * @return array<string, mixed>
   */
  public function toArray($request): array
  {
    return [
      'id' => $this->id,
      'assignment' => [
        'value' => $this->assignment?->id,
        'label' => $this->assignment?->name,
      ],
      'team' => [
        'value' => $this->team?->id,
        'label' => $this->team?->name,
      ],
      'submission_link' => $this->submission_link,
    ];
  }
}
