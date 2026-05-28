<?php

namespace App\Actions\Users;

use App\DTOs\Users\UpdateUserDTO;
use App\Models\User;
use App\Repositories\Users\UserRepository;

class UpdateUser
{
  public function __construct(
    protected UserRepository $userRepository,
  ) {}

  public function handle(UpdateUserDTO $dto, User $user): User
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
}
