<?php

namespace App\DTOs\Users;

use App\Enums\UserRole;

class UpdateUserDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly UserRole $role,
        public readonly ?string $password,
    ) {}
}
