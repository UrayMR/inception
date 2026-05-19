<?php

namespace App\DTOs\Teams;

class UpdateTeamDTO
{
    public function __construct(
        public string $competition_id,
        public string $team_name,
        public string $phone_number,
    ) {}
}
