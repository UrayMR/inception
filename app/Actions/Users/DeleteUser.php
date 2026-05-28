<?php

namespace App\Actions\Users;

use App\Models\User;
use App\Repositories\Users\UserRepository;

class DeleteUser
{
  public function __construct(
    protected UserRepository $userRepository,
  ) {}

  public function handle(User $user): bool
  {
    return $this->userRepository->destroy($user);
  }
}
