<?php

namespace App\DTOs\Auth;

class GoogleUserDTO
{
  public function __construct(
    public readonly string $googleId,
    public readonly string $name,
    public readonly string $email,
  ) {}
}
