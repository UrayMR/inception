<?php

namespace App\Actions\Auth;

use App\DTOs\Auth\GoogleUserDTO;
use App\Enums\UserRole;
use App\Models\User;
use App\Repositories\Users\UserRepository;

class SyncGoogleUser
{
  public function __construct(
    protected UserRepository $userRepository,
  ) {}

  public function handle(GoogleUserDTO $dto): User
  {
    $user = $this->userRepository->findByGoogleIdOrEmail($dto->googleId, $dto->email);

    $attributes = [
      'google_id' => $dto->googleId,
      'name' => $dto->name,
      'email' => $dto->email,
      'role' => $user?->role ?? UserRole::participant->value,
      'email_verified_at' => $user?->email_verified_at ?? now(),
    ];

    if ($user) {
      return $this->userRepository->update($attributes, $user);
    }

    return $this->userRepository->store($attributes);
  }
}
