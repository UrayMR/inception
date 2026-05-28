<?php

namespace App\Http\Requests\Participant\Competitions;

use App\DTOs\Teams\Members\MemberDTO;
use App\DTOs\Teams\StoreTeamDTO;
use App\DTOs\Transactions\StoreTransactionDTO;
use App\Enums\CompetitionType;
use App\Enums\CompetitionStatus;
use App\Enums\TransactionMethod;
use App\Enums\TransactionStatus;
use App\Models\Competition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class RegisterCompetitionRequest extends FormRequest
{
  public function authorize(): bool
  {
    return (bool) $this->user();
  }

  public function rules(): array
  {
    return [
      'competition_id' => ['required', 'uuid', Rule::exists('competitions', 'id')],
      'team_name' => ['nullable', 'string', 'max:255'],
      'phone_number' => ['required', 'string', 'max:20'],
      'payment_method' => [
        'required',
        'string',
        Rule::in(TransactionMethod::cases()),
      ],
      'payment_proof_file' => ['required', 'file', 'image', 'mimes:png,jpg,jpeg,webp', 'max:2048'],
      'members' => ['nullable', 'array'],
      'members.*.member_name' => ['required', 'string', 'max:255'],
    ];
  }

  public function withValidator(Validator $validator): void
  {
    $validator->after(function (Validator $validator) {
      $competition = Competition::query()->find($this->input('competition_id'));
      if (! $competition) {
        return;
      }

      $this->ensureCompetitionIsOpen($validator, $competition);

      if ($competition->type !== CompetitionType::team->value) {
        return;
      }

      $this->ensureTeamCompetitionPayloadIsValid($validator);
    });
  }

  private function ensureCompetitionIsOpen(Validator $validator, Competition $competition): void
  {
    if ($competition->status === CompetitionStatus::open->value) {
      return;
    }

    $validator->errors()->add(
      'competition_id',
      'Registration is only available for competitions with open status.',
    );
  }

  private function ensureTeamCompetitionPayloadIsValid(Validator $validator): void
  {
    if (! filled($this->input('team_name'))) {
      $validator->errors()->add(
        'team_name',
        'Team name is required for team competitions.',
      );
    }

    $members = $this->input('members', []);

    if (! is_array($members) || count($members) < 1) {
      $validator->errors()->add(
        'members',
        'At least one team member is required for team competitions.',
      );
    }
  }

  /**
   * Format team attributes.
   */
  public function toTeamDTO(Competition $competition): StoreTeamDTO
  {
    $teamName = $competition->type === CompetitionType::solo->value
      ? $this->user()->name
      : trim((string) $this->input('team_name'));

    return new StoreTeamDTO(
      competition_id: $competition->id,
      team_name: $teamName,
      leader_id: $this->user()->id,
      phone_number: $this->input('phone_number'),
    );
  }

  /**
   * Format member DTO array.
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

  /**
   * Format transaction DTO.
   */
  public function toTransactionDTO(string $team_id, float $amount): StoreTransactionDTO
  {
    return new StoreTransactionDTO(
      team_id: $team_id,
      amount: $amount,
      payment_method: $this->input('payment_method'),
      payment_proof_file: $this->file('payment_proof_file'),
      status: TransactionStatus::pending->value,
    );
  }
}
