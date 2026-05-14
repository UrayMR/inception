<?php

namespace App\Repositories\Users;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface UserRepository
{
    public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator;

    public function store(array $attributes): User;

    public function update(array $attributes, User $user): User;

    public function destroy(User $user): bool;
}
