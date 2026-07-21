<?php

namespace App\Resources\Teams;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EditTeamResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        $isCompetitionSolo = $this->competition?->type === 'solo';

        return [
            'id' => $this->id,
            'competition_id' => $this->competition_id,
            'team_name' => $this->team_name,
            'leader_name' => $this->leader?->name,
            'phone_number' => $this->phone_number,
            'institution' => $this->institution,
            'members' => $isCompetitionSolo ? [] : $this->members->map(function ($member) {
                return [
                    'member_name' => $member->member_name,
                ];
            })->toArray(),
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
