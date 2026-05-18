<?php

namespace App\Repositories\Competitions\Timelines;

use App\Models\Team;
use App\Models\TeamMember;
use App\Repositories\Teams\Members\MemberRepository;

class EloquentMemberRepository implements MemberRepository
{
    public function storeMany(Team $team, array $attributes): void
    {
        $team->members()->createMany($attributes);
    }

    public function updateMany(Team $team, array $attributes): void
    {
        // Update or Insert members based on the presence of 'id' in the attributes.
        // If 'id' is present, it will update; if not, it will create a new member.
        TeamMember::upsert($attributes, ['id'], ['user_name', 'phone_number']);

        // Because upsert does not handle deletions, we need to manually delete any members that were removed from the team.
        $memberIds = $team->members()->pluck('id')->toArray();
        $idsToDelete = array_diff($memberIds, array_column($attributes, 'id'));
        if (! empty($idsToDelete)) {
            $team->members()->whereIn('id', $idsToDelete)->delete();
        }
    }

    public function destroyMany(Team $team): bool
    {
        return $team->members()->delete();
    }
}
