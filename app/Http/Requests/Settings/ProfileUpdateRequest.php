<?php

namespace App\Http\Requests\Settings;

use App\DTOs\Users\UpdateUserDTO;
use App\Concerns\ProfileValidationRules;
use App\Enums\UserRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->profileRules($this->user()->id);
    }

    public function toDTO(): UpdateUserDTO
    {
        $emailChanged = $this->input('email') !== $this->user()->email;

        return new UpdateUserDTO(
            name: $this->input('name'),
            email: $this->input('email'),
            role: UserRole::from($this->user()->role),
            password: null,
        );
    }
}
