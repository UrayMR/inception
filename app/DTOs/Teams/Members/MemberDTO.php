<?php

namespace App\DTOs\Teams\Members;

class MemberDTO
{
    public function __construct(
        public string $team_id,
        public string $member_name,
        public string $member_phone_number,
    ) {}

    /**
     * Convert the MemberDTO to an array.
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id ?? null, // Ensure 'id' is included in the array, even if it's null for new members
            'team_id' => $this->team_id,
            'member_name' => $this->member_name,
            'member_phone_number' => $this->member_phone_number,
        ];
    }
}
