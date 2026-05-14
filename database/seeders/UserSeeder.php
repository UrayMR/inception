<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed the database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'role' => UserRole::admin->value,
            'password' => bcrypt('password'),
        ]);

        User::factory(5)->withGoogle()->create();
        User::factory(5)->unverified()->create();
        User::factory(5)->withTwoFactor()->create();
    }
}
