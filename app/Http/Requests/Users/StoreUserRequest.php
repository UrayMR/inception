<?php

namespace App\Http\Requests\Users;

use App\DTOs\Users\StoreUserDTO;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', User::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', Rule::in(UserRole::cases())],

            'competition_id' => [
                Rule::requiredIf(fn() => $this->input('role') === UserRole::committee->value),
                Rule::exists('competitions', 'id'),
                'nullable'
            ],
        ];
    }

    public function toDTO(): StoreUserDTO
    {
        return new StoreUserDTO(
            name: $this->input('name'),
            email: $this->input('email'),
            role: UserRole::from($this->input('role')),
            password: $this->input('password'),
            competition_id: $this->input('competition_id'),
        );
    }

    public function messages(): array
    {
        return [
            'competition_id.required_if' => 'Kompetisi wajib dipilih jika role adalah Committee.',
            'competition_id.exists' => 'Kompetisi yang dipilih tidak valid.'
        ];
    }
}
