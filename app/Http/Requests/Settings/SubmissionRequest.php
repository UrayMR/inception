<?php

namespace App\Http\Requests\Settings;

use App\DTOs\Assignments\StoreSubmissionDTO;
use Illuminate\Foundation\Http\FormRequest;

class SubmissionRequest extends FormRequest
{
  public function rules(): array
  {
    return [
      'assignment_id' => ['required', 'string'],
      'submission_link' => ['required', 'string'],
    ];
  }

  public function toDTO(): StoreSubmissionDTO
  {
    return new StoreSubmissionDTO(
      assignment_id: $this->input('assignment_id'),
      submission_link: $this->input('submission_link'),
    );
  }
}
