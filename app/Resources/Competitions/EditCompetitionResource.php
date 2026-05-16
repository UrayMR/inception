<?php

namespace App\Resources\Competitions;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EditCompetitionResource extends JsonResource
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
      'name' => $this->name,
      'description' => $this->description,
      'type' => $this->type,
      'image_path' => $this->image_path,
      'price' => $this->price,
      'status' => $this->status,
      'timelines' => collect($this->timelines)->sortBy('sequence')->values()->map(function ($timeline) {
        return [
          'id' => $timeline->id,
          'timeline_name' => $timeline->timeline_name,
          'description' => $timeline->description,
          'sequence' => $timeline->sequence,
          'start_at' => $timeline->start_at,
          'end_at' => $timeline->end_at,
        ];
      }),
    ];
  }
}
