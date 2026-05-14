<?php

namespace App\Repositories\Users;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class EloquentUserRepository implements UserRepository
{
    /**
     * @param  array  $queryParams  (optional: ['search' => '', 'filters' => ['role' => '', 'status' => '']])
     * @param  int  $perPage  (optional, default 15)
     */
    public function index(array $queryParams = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = User::query();

        // Searching
        if (! empty($queryParams['search'])) {
            $search = $queryParams['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        }

        // Filter by role
        if (! empty($queryParams['filters']['role'])) {
            $query->where('role', $queryParams['filters']['role']);
        }

        return $query->orderByDesc('updated_at')->paginate($perPage);
    }

    /**
     * @param  array  $attributes  (data sent from form)
     */
    public function store(array $attributes): User
    {
        return User::create($attributes);
    }

    /**
     * @param  array  $attributes  (data sent from form)
     * @param  User  $user  (to be updated)
     */
    public function update(array $attributes, User $user): User
    {
        $data = [
            'name' => $attributes['name'],
            'email' => $attributes['email'],
            'role' => $attributes['role'],
            // 'status' => $attributes['status'],
        ];

        if (! empty($attributes['password'])) {
            $data['password'] = Hash::make($attributes['password']);
        }

        if (! empty($attributes['profile_picture_path'])) {
            $data['profile_picture_path'] = $attributes['profile_picture_path'];
        }

        $user->update($data);

        return $user;
    }

    /**
     * @param  User  $user  (to be deleted)
     */
    public function destroy(User $user): bool
    {
        return $user->delete();
    }
}
