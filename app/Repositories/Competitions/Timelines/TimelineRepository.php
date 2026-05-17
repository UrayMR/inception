<?php

namespace App\Repositories\Competitions\Timelines;

use App\Models\Competition;
use App\Models\CompetitionTimeline;
use Illuminate\Support\Collection;

interface TimelineRepository
{
  public function storeMany(Competition $competition, array $attributes): void;

  public function updateMany(Competition $competition, array $attributes): void;

  public function destroyMany(Competition $competition): bool;
}
