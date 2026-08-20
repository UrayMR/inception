<?php

namespace App\Services\Settings;

use App\Models\User;

class ProfileService
{
  public function getSchedule(?User $user)
  {
    return $user?->team?->competition?->timelines ?? [];
  }
}
