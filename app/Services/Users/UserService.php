<?php

namespace App\Services\Users;

use App\Repositories\Users\UserRepository;
use Illuminate\Http\Request;

class UserService
{
    public function __construct(protected UserRepository $userRepository) {}

    public function index(Request $request)
    {
        // Only allow specific query params
        $queryParams = [
            'search' => $request->query('search'),
            'filters' => [
                'role' => $request->query('role'),
                // Add more filters if needed
            ],
        ];

        return $this->userRepository->index($queryParams);
    }
}
