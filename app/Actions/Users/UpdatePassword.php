<?php

namespace App\Actions\Users;

use App\Models\User;
use App\Repositories\Users\UserRepository;

class UpdatePassword
{
  public function __construct(
    protected UserRepository $userRepository,
  ) {}

  public function handle(User $user, string $password): User
  {
    return $this->userRepository->updatePassword($user, $password);
  }
}
