<?php

namespace App\Http\Requests\Teams;

use App\DTOs\Teams\Members\MemberDTO;
use App\DTOs\Teams\UpdateTeamDTO;
use App\Enums\CompetitionType;
use App\Enums\TeamStatus;
use App\Models\Competition;
use App\Models\Team;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('team'));
    }

    public function rules(): array
    {
        $isSoloCompetition = $this->isSoloCompetition();

        $teamRules = [
            'competition_id' => ['required', 'string', Rule::exists('competitions', 'id')],
            'team_name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:20'],
            'institution' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(TeamStatus::cases())],
        ];

        $memberRules = [
            'members' => $isSoloCompetition ? ['prohibited'] : ['required', 'array', 'min:1'],
            'members.*.member_name' => $isSoloCompetition ? ['prohibited'] : ['required', 'string', 'max:255'],
        ];

        return array_merge($teamRules, $memberRules);
    }

    /**
     * Check if the competition is a solo type
     */
    protected function isSoloCompetition(): bool
    {
        $competitionId = $this->input('competition_id');

        if (! $competitionId) {
            return false;
        }

        return Competition::query()
            ->whereKey($competitionId)
            ->value('type') === CompetitionType::solo->value;
    }

    /**
     * Team DTO
     */
    public function toTeamDTO(): UpdateTeamDTO
    {
        return new UpdateTeamDTO(
            competition_id: $this->input('competition_id'),
            team_name: $this->input('team_name'),
            phone_number: $this->input('phone_number'),
            institution: $this->input('institution'),
            status: $this->input('status'),
        );
    }

    /**
     * Member DTO array
     */
    public function toMemberDTO(string $team_id): array
    {
        $membersData = $this->input('members', []);

        return array_map(function ($member) use ($team_id) {
            $dto = new MemberDTO(
                team_id: $team_id,
                member_name: $member['member_name'],
            );

            return $dto->toArray();
        }, $membersData);
    }
}
