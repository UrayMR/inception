<?php

namespace App\Repositories\Competitions\Timelines;

use App\Models\Competition;
use App\Models\CompetitionTimeline;

class EloquentTimelineRepository implements TimelineRepository
{
    // TODO: This is a method helper to get the max sequence for a competition, we might want to move this to a service or a trait if we find ourselves needing it elsewhere.
    public function getMaxSequence(string $competitionId): int
    {
        return CompetitionTimeline::where('competition_id', $competitionId)->max('sequence') ?? 0;
    }

    public function storeMany(Competition $competition, array $attributes): void
    {
        foreach ($attributes as $item) {
            if (! isset($item['sequence']) || is_null($item['sequence'])) {
                $item['sequence'] = $this->getMaxSequence($competition->id) + 1;
            }
        }

        $competition->timelines()->createMany($attributes);
    }

    public function updateMany(Competition $competition, array $attributes): void
    {
        // Update or Insert timelines based on the presence of 'id' in the attributes.
        // If 'id' is present, it will update; if not, it will create a new timeline.
        CompetitionTimeline::upsert($attributes, ['id'], ['timeline_name', 'description', 'sequence', 'start_at', 'end_at']);

        // Because upsert does not handle deletions, we need to manually delete any timelines that were removed from the competition.
        $timelineIds = $competition->timelines()->pluck('id')->toArray();
        $idsToDelete = array_diff($timelineIds, array_column($attributes, 'id'));
        if (! empty($idsToDelete)) {
            $competition->timelines()->whereIn('id', $idsToDelete)->delete();
        }
    }

    public function destroyMany(Competition $competition): bool
    {
        return $competition->timelines()->delete();
    }
}
