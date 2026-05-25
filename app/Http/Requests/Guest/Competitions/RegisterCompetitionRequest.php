<?php

namespace App\Http\Requests\Guest\Competitions;

use App\Enums\CompetitionType;
use App\Enums\TransactionMethod;
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

      if (! $competition || $competition->type !== CompetitionType::team->value) {
        return;
      }

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
    });
  }
}
