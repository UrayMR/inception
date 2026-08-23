<?php

namespace App\Http\Requests\Announcements;

use App\DTOs\Announcements\AnnouncementDTO;
use App\Enums\AnnouncementStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAnnouncementRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('update', $this->route('announcement'));
  }

  public function rules(): array
  {
    $rules = [
      'message' => ['required', 'string', 'max:255'],
      'status' => ['required', 'string', Rule::in(AnnouncementStatus::cases())],
    ];

    return $rules;
  }

  public function toDTO(): AnnouncementDTO
  {
    return new AnnouncementDTO(
      message: $this->input('message'),
      status: $this->input('status'),
    );
  }
}
