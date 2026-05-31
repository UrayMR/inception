<?php

namespace App\Services\Competitions;

use App\Enums\CompetitionType;
use App\Models\Competition;
use App\Repositories\Competitions\CompetitionRepository;
use App\Actions\Competitions\StoreCompetition;
use App\Actions\Competitions\UpdateCompetition;
use App\Actions\Competitions\DeleteCompetition;
use App\DTOs\Competitions\StoreCompetitionDTO;
use App\DTOs\Competitions\UpdateCompetitionDTO;
use App\Helpers\ThrowException;
use App\Utilities\SlugGenerator;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CompetitionService
{
    public function __construct(
        protected CompetitionRepository $competitionRepository,
        protected StoreCompetition $storeCompetition,
        protected UpdateCompetition $updateCompetition,
        protected DeleteCompetition $deleteCompetition,
    ) {}

    public function index(Request $request, int $perPage = 10): LengthAwarePaginator
    {
        // Only allow specific query params
        $queryParams = [
            'search' => $request->query('search'),
            'filters' => [
                'type' => $request->query('type'),
                // Add more filters if needed
            ],
        ];

        return $this->competitionRepository->index($queryParams, $perPage);
    }

    public function store(StoreCompetitionDTO $dto, array $timelineAttributes = []): Competition
    {
        // Enforce max_member policy at service level (source of truth)
        $dto->max_member = $this->normalizeMaxMemberForType($dto->type, $dto->max_member);

        $slug = $this->generateUniqueSlug($dto->name);

        return DB::transaction(function () use ($dto, $slug, $timelineAttributes) {
            return $this->storeCompetition->handle($dto, $slug, $timelineAttributes);
        });
    }

    public function update(UpdateCompetitionDTO $dto, Competition $competition, array $timelineAttributes = []): Competition
    {
        $slug = null;
        if ($dto->name !== $competition->name) {
            $slug = $this->generateUniqueSlug($dto->name, $competition);
        }
        
        $dto->max_member = $this->normalizeMaxMemberForType($dto->type, $dto->max_member);

        return DB::transaction(function () use ($dto, $competition, $slug, $timelineAttributes) {
            return $this->updateCompetition->handle($dto, $competition, $slug, $timelineAttributes);
        });
    }

    /**
     * Normalize and validate `max_member` according to competition type.
     * - Solo competitions always have `max_member = 1` (leader counted).
     * - Team competitions must have `max_member >= 2` (leader excluded), defaults to 2 when not provided.
     *
     * @param string $type
     * @param int|null $maxMember
     * @return int
     */
    public function normalizeMaxMemberForType(string $type, ?int $maxMember = null): int
    {
        if ($type === CompetitionType::solo->value) {
            return 1;
        }

        // Team competitions
        if ($maxMember === null) {
            return 2;
        }

        if ($maxMember < 2) {
            ThrowException::validation(
                'max_member',
                'Team competitions must have max member of at least 2 (leader is counted separately).'
            );
        }

        return $maxMember;
    }

    public function destroy(Competition $competition): bool
    {
        return DB::transaction(function () use ($competition) {
            return $this->deleteCompetition->handle($competition);
        });
    }

    public function findByIdOrFail(string $id): Competition
    {
        return $this->competitionRepository->findByIdOrFail($id);
    }

    public function getCompetitionMap(array $filters = []): array
    {
        return $this->competitionRepository->getCompetitionMap($filters);
    }

    public function ensureTeamCompetitionPayloadIsValid(string $competitionId, array $members = []): void
    {
        $competition = $this->findByIdOrFail($competitionId);

        if ($competition->type === CompetitionType::solo->value) {
            if (! empty($members)) {
                ThrowException::validation(
                    'members',
                    'Members are not allowed for solo competitions.',
                );
            }

            return;
        }

        // Team competitions: ensure competition is configured with sensible max_member
        if ($competition->max_member <= 1) {
            ThrowException::validation(
                'max_member',
                'This competition is configured as a team competition but has invalid max_member. Please contact the administrator.'
            );
        }

        if (empty($members)) {
            ThrowException::validation(
                'members',
                'At least one team member is required for team competitions.',
            );
        }

        // leader counts as one; ensure submitted members don't exceed allowed slots
        $maxAdditionalMembers = max(0, $competition->max_member - 1);
        if (count($members) > $maxAdditionalMembers) {
            ThrowException::validation(
                'members',
                sprintf('Too many members: maximum allowed (excluding leader) is %d.', $maxAdditionalMembers)
            );
        }
    }

    public function generateUniqueSlug(string $name, ?Competition $ignoreCompetition = null): string
    {
        $baseSlug = SlugGenerator::make($name);
        $slug = $baseSlug;
        $suffix = 2;

        while ($this->competitionRepository->slugExists($slug, $ignoreCompetition?->id)) {
            $slug = sprintf('%s%s%d', $baseSlug, '-', $suffix);
            $suffix++;
        }

        return $slug;
    }
}
