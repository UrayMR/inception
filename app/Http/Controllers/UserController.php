<?php

namespace App\Http\Controllers;

use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Models\User;
use App\Resources\Users\EditUserResource;
use App\Resources\Users\IndexUserResource;
use App\Resources\Users\ShowUserResource;
use App\Services\Users\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $users = $this->userService->index($request);

        return $this->render('panel/users/index', [
            'users' => IndexUserResource::collection($users),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', User::class);

        return $this->render('panel/users/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $this->authorize('create', User::class);

        $this->userService->create($request->toDTO());

        $this->flash('success', 'User created successfully.');

        return redirect()->route('users.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);

        return $this->render('panel/users/show', [
            'user' => ShowUserResource::make($user)->resolve(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $this->authorize('update', $user);

        return $this->render('panel/users/edit', [
            'user' => EditUserResource::make($user)->resolve(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $this->authorize('update', $user);

        $user = $this->userService->update($request->toDTO(), $user);

        $this->flash('success', 'User updated successfully.');

        return redirect()->route('users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        $this->userService->destroy($user);

        $this->flash('success', 'User deleted successfully.');

        return redirect()->route('users.index');
    }
}
