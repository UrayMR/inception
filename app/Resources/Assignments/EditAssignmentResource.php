<?php

namespace App\Resources\Assignments;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EditAssignmentResource extends JsonResource
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
      'competition' => [
        'value' => $this->competition?->id,
        'label' => $this->competition?->name,
      ],
      'name' => $this->name,
      'status' => $this->status,
      'due_at' => $this->due_at,
      'created_at' => $this->created_at?->toDateTimeString(),
      'updated_at' => $this->updated_at?->toDateTimeString(),
    ];
  }
}
