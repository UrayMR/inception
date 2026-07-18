<?php

namespace App\Resources\Assignments;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShowAssignmentResource extends JsonResource
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
      'competition_id' => $this->competition_id,
      'competition' => [
        'label' => $this->competition?->name,
        'value' => $this->competition?->id,
      ],
      'name' => $this->name,
      'assignment_guide_link' => $this->assignment_guide_link,
      'status' => $this->status,
      'due_at' => $this->due_at,
      'created_at' => $this->created_at?->toDateTimeString(),
      'updated_at' => $this->updated_at?->toDateTimeString(),
    ];
  }
}
