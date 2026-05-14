<?php

namespace App\Services\Users;

use App\DTOs\Users\StoreUserDTO;
use App\DTOs\Users\UpdateUserDTO;
use App\Models\User;
use App\Repositories\Users\UserRepository;
use Illuminate\Http\Request;

class UserService
{
    public function __construct(protected UserRepository $userRepository) {}

    public function index(Request $request)
    {
        // Only allow specific query params
        $queryParams = [
            'search' => $request->query('search'),
            'filters' => [
                'role' => $request->query('role'),
                // Add more filters if needed
            ],
        ];

        return $this->userRepository->index($queryParams);
    }

    public function create(StoreUserDTO $dto): User
    {
        $attributes = [
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => $dto->password,
            'role' => $dto->role->value,
        ];

        return $this->userRepository->store($attributes);
    }

    public function update(UpdateUserDTO $dto, User $user): User
    {
        $attributes = [
            'name' => $dto->name,
            'email' => $dto->email,
            'role' => $dto->role->value,
        ];

        if ($dto->password) {
            $attributes['password'] = $dto->password;
        }

        return $this->userRepository->update($attributes, $user);
    }

    public function destroy(User $user): bool
    {
        return $this->userRepository->destroy($user);
    }
}
