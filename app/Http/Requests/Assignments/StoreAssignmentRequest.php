<?php

namespace App\Http\Requests\Assignments;

use App\DTOs\Assignments\StoreAssignmentDTO;
use App\Enums\AssignmentStatus;
use App\Models\Assignment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssignmentRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('create', Assignment::class);
  }

  public function rules(): array
  {
    $rules = [
      'competition_id' => ['required', 'string', Rule::exists('competitions', 'id')],
      'name' => ['required', 'string', 'max:255'],
      'assignment_guide_link' => ['required', 'string', 'url'],
      'status' => ['required', 'string', Rule::in(AssignmentStatus::cases())],
      'due_at' => ['required', 'date', 'after:now'],
    ];

    return $rules;
  }

  public function toDTO(): StoreAssignmentDTO
  {
    return new StoreAssignmentDTO(
      competition_id: $this->input('competition_id'),
      name: $this->input('name'),
      assignment_guide_link: $this->input('assignment_guide_link'),
      status: $this->input('status'),
      due_at: $this->input('due_at'),
    );
  }
}
