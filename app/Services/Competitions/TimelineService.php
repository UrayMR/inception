<?php

namespace App\Services\Competitions;

use App\Models\Competition;
use App\Repositories\Competitions\Timelines\TimelineRepository;

class TimelineService
{
    public function __construct(
        protected TimelineRepository $timelineRepository,
    ) {}

    public function createMany(Competition $competition, array $attributes): void
    {
        $this->timelineRepository->storeMany($competition, $attributes);
    }

    public function updateMany(Competition $competition, array $attributes): void
    {
        $this->timelineRepository->updateMany($competition, $attributes);
    }

    public function destroyMany(Competition $competition): bool
    {
        return $this->timelineRepository->destroyMany($competition);
    }
}
