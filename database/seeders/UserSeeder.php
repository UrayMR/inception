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
        User::updateOrCreate([
            'email' => 'admin@gmail.com',
        ], [
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'role' => UserRole::admin->value,
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        User::updateOrCreate([
            'email' => 'accountant@gmail.com',
        ], [
            'name' => 'Accountant',
            'email' => 'accountant@gmail.com',
            'role' => UserRole::accountant->value,
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        User::updateOrCreate([
            'email' => 'user@gmail.com',
        ], [
            'name' => 'User',
            'email' => 'user@gmail.com',
            'role' => UserRole::participant->value,
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        // User::factory(5)->withGoogle()->create();
        // User::factory(5)->unverified()->create();
        // User::factory(5)->withTwoFactor()->create();
    }
}
