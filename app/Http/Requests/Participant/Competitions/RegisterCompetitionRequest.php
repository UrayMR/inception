<?php

namespace App\Http\Requests\Participant\Competitions;

use App\Enums\TransactionMethod;
use App\DTOs\Competitions\Registrations\RegisterCompetitionDTO;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
      'institution' => ['nullable', 'string', 'max:255'],
      'requirement_link' => ['required', 'url'],
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

  public function toDTO(): RegisterCompetitionDTO
  {
    return new RegisterCompetitionDTO(
      competition_id: $this->input('competition_id'),
      team_name: $this->input('team_name'),
      leader_id: $this->user()->id,
      leader_name: $this->user()->name,
      phone_number: $this->input('phone_number'),
      requirement_link: $this->input('requirement_link'),
      institution: $this->input('institution'),
      payment_method: $this->input('payment_method'),
      payment_proof_file: $this->file('payment_proof_file'),
      members: $this->input('members', []),
    );
  }
}
