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

    $emailChanged = $user->email !== $dto->email;

    if ($emailChanged) {
      $attributes['email_verified_at'] = null;
      $attributes['google_id'] = null;
    }

    if ($dto->password) {
      $attributes['password'] = $dto->password;
    }

    $updatedUser = $this->userRepository->update($attributes, $user);

    if ($emailChanged) {
      $updatedUser->sendEmailVerificationNotification();
    }

    return $updatedUser;
  }
}
