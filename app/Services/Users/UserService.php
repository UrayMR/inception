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
