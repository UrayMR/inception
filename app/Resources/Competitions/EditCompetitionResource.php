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
            'slug' => $this->slug,
            'description' => $this->description,
            'type' => $this->type,
            'image_path' => $this->image_path,
            'price' => $this->price,
            'max_member' => $this->max_member,
            'guidebook_link' => $this->guidebook_link,
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
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
