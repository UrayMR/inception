<?php

namespace App\DTOs\Competitions\Timelines;

use Illuminate\Support\Carbon;

class TimelineDTO
{
    public function __construct(
        public string $competition_id,
        public string $timeline_name,
        public ?string $description,
        public int $sequence,
        public string $start_at,
        public string $end_at,
    ) {}

    /**
     * Convert the TimelineDTO to an array.
     */
    public function toArray(): array
    {
        return [
            'competition_id' => $this->competition_id,
            'timeline_name' => $this->timeline_name,
            'description' => $this->description,
            'sequence' => $this->sequence,
            'start_at' => Carbon::parse($this->start_at)->format('Y-m-d H:i:s'),
            'end_at' => Carbon::parse($this->end_at)->format('Y-m-d H:i:s'),
        ];
    }
}
