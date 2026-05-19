<?php

namespace App\Repositories\Teams\Members;

use App\Models\Team;
use App\Models\TeamMember;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EloquentMemberRepository implements MemberRepository
{
    public function storeMany(Team $team, array $attributes): void
    {
        $team->members()->createMany($attributes);
    }

    public function updateMany(Team $team, array $attributes): void
    {
        DB::transaction(function () use ($team, $attributes) {
            // TODO: This is a temporary solution to ensure that the team members are updated correctly.
            //  We should implement a more efficient way to handle updates and deletions without deleting all members first.
            $team->members()->delete();

            $formattedAttributes = array_map(function ($attribute) use ($team) {
                $attribute['id'] = Str::uuid();
                $attribute['team_id'] = $team->id;

                return $attribute;
            }, $attributes);

            TeamMember::insert($formattedAttributes);
        });
    }

    public function destroyMany(Team $team): bool
    {
        return $team->members()->delete();
    }
}
