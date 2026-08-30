<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;
use App\Services\Settings\ProfileService;
use App\Services\Users\UserService;

class ProfileController extends Controller
{
    public function __construct(
        protected ProfileService $profileService,
        protected UserService $userService,
    ) {}

    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $schedule = $this->profileService->getSchedule($request->user());

        return $this->render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'schedule' => $schedule,
            'hasPassword' => ! empty($request->user()?->password),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        $hasPassword = $user->password !== null;

        if (!$hasPassword) {
            return redirect()->back()->withErrors(['name' => 'Anda harus memiliki kata sandi untuk memperbarui profil.']);
        }

        $oldEmail = $user->email;
        $this->userService->update($request->toDTO(), $user);

        $isEmailChanged = $oldEmail !== $request->input('email');

        if ($isEmailChanged) {
            $this->flash('success', 'Profil diperbarui. Silakan verifikasi email baru Anda!');
        } else {
            $this->flash('success', 'Profil berhasil diperbarui!');
        }

        return redirect()->back();
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        $name = $user->name;

        Auth::logout();

        $this->userService->destroy($user);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $this->flash('success', "Akun {$name} telah berhasil dihapus!");

        return redirect('/');
    }
}
