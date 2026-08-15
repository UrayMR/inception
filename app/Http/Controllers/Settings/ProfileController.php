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

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return $this->render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        $isEmailChanged = $user->isDirty('email');

        if ($isEmailChanged) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($isEmailChanged) {
            $user->sendEmailVerificationNotification();

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

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $this->flash('success', "Akun {$name} telah berhasil dihapus!");

        return redirect('/');
    }
}
