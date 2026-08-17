<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\SubmissionRequest;
use App\Services\Assignments\SubmissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class SubmissionController extends Controller
{
  public function __construct(
    protected SubmissionService $submissionService,
  ) {}

  public function store(SubmissionRequest $request): RedirectResponse
  {
    $user = Auth::user();

    if (!$user?->team) {
      $this->flash('error', 'Anda tidak memiliki tim.');
      return redirect()->back();
    }

    $this->submissionService->storeOrUpdate($user->team, $request->toDTO());
    $this->flash('success', 'Pengiriman tugas berhasil.');

    return redirect()->back();
  }
}
