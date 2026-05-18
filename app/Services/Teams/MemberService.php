<?php

namespace App\Services\Teams\Members;

use App\Models\Team;
use App\Repositories\Teams\Members\MemberRepository;

class MemberService
{
    public function __construct(
        protected MemberRepository $memberRepository,
    ) {}

    public function createMany(Team $team, array $attributes): void
    {
        $this->memberRepository->storeMany($team, $attributes);
    }

    public function updateMany(Team $team, array $attributes): void
    {
        $this->memberRepository->updateMany($team, $attributes);
    }

    public function destroyMany(Team $team): bool
    {
        return $this->memberRepository->destroyMany($team);
    }
}
