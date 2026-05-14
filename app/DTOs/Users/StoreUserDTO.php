<?php

namespace App\DTOs\Users;

use App\Enums\UserRole;

class StoreUserDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly UserRole $role,
        public readonly string $password,
    ) {}
}
