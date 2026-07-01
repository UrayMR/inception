<?php

namespace App\Actions\Users;

use App\DTOs\Users\StoreUserDTO;
use App\Models\User;
use App\Repositories\Users\UserRepository;

class StoreUser
{
  public function __construct(
    protected UserRepository $userRepository,
  ) {}

  public function handle(StoreUserDTO $dto): User
  {
    return $this->userRepository->store([
      'name' => $dto->name,
      'email' => $dto->email,
      'password' => $dto->password,
      'role' => $dto->role->value,
    ]);
  }
}
