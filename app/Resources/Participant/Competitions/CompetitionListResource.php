<?php

namespace App\Resources\Participant\Competitions;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompetitionListResource extends JsonResource
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
      'slug' => $this->slug,
      'name' => $this->name,
      'image_path' => $this->image_path,
      'description' => $this->description,
      'type' => $this->type,
      'status' => $this->status,
      'price' => $this->price,
      'created_at' => $this->created_at?->toDateTimeString(),
      'updated_at' => $this->updated_at?->toDateTimeString(),
    ];
  }
}
