<?php

namespace App\DTOs\Teams;

class StoreTeamDTO
{
  public function __construct(
    public string $competition_id,
    public string $team_name,
    public string $leader_id,
    public string $phone_number,
  ) {}
}
