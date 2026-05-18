<?php

namespace App\DTOs\Teams\Members;

class MemberDTO
{
    public function __construct(
        public string $team_id,
        public string $member_name,
    ) {}

    /**
     * Convert the MemberDTO to an array.
     */
    public function toArray(): array
    {
        return [
            'team_id' => $this->team_id,
            'member_name' => $this->member_name,
        ];
    }
}
