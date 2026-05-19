<?php

namespace App\Repositories\Teams\Members;

use App\Models\Team;

interface MemberRepository
{
    public function storeMany(Team $team, array $attributes): void;

    public function updateMany(Team $team, array $attributes): void;

    public function destroyMany(Team $team): bool;
}
