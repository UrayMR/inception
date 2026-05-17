<?php

namespace App\Http\Requests\Competitions;

use App\DTOs\Teams\Members\MemberDTO;
use App\DTOs\Teams\UpdateTeamDTO;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Team;

class UpdateTeamRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('update', Team::class);
  }

  public function rules(): array
  {
    $teamRules = [
      'competition_id' => ['required', 'string', Rule::exists('competitions', 'id')],
      'team_name' => ['required', 'string', 'max:255'],
      'phone_number' => ['required', 'string', 'max:20'],
    ];

    $memberRules = [
      'members' => ['required', 'array', 'min:1'],
      'members.*.member_name' => ['required', 'string', 'max:255'],
    ];

    return array_merge($teamRules, $memberRules);
  }

  /**
   * Team DTO
   * 
   * @return UpdateTeamDTO
   */
  public function toTeamDTO(): UpdateTeamDTO
  {
    return new UpdateTeamDTO(
      competition_id: $this->input('competition_id'),
      team_name: $this->input('team_name'),
      leader_id: $this->user()->id,
      phone_number: $this->input('phone_number'),
    );
  }

  /**
   * Member DTO array
   * 
   * @param string $team_id
   * @return array
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
