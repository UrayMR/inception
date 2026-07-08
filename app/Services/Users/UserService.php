<?php

namespace App\Services\Users;

use App\Repositories\Users\UserRepository;
use App\Actions\Users\StoreUser;
use App\Actions\Users\UpdateUser;
use App\Actions\Users\DeleteUser;
use App\DTOs\Users\StoreUserDTO;
use App\DTOs\Users\UpdateUserDTO;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class UserService
{
    public function __construct(
        protected UserRepository $userRepository,
        protected StoreUser $storeUser,
        protected UpdateUser $updateUser,
        protected DeleteUser $deleteUser,
    ) {}

    public function index(array $queryParams)
    {
        // Only allow specific query params
        $cleanParams = [
            'search' => $queryParams['search'] ?? null,
            'filters' => [
                'role' => $queryParams['filters']['role'] ?? null,
                // Add more filters if needed
            ],
        ];

        return $this->userRepository->index($cleanParams);
    }

    public function store(StoreUserDTO $dto): User
    {
        return DB::transaction(function () use ($dto) {
            return $this->storeUser->handle($dto);
        });
    }

    public function update(UpdateUserDTO $dto, User $user): User
    {
        return DB::transaction(function () use ($dto, $user) {
            return $this->updateUser->handle($dto, $user);
        });
    }

    public function destroy(User $user): bool
    {
        return DB::transaction(function () use ($user) {
            return $this->deleteUser->handle($user);
        });
    }
}
