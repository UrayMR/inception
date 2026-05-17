<?php

namespace App\Resources\Teams;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndexTeamResource extends JsonResource
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
      'competition_name' => $this->competition?->name,
      'team_name' => $this->team_name,
      'leader_name' => $this->leader?->name, // This need to be checked again
    ];
  }
}
