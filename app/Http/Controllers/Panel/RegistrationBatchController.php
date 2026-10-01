<?php

namespace App\Http\Controllers\Panel;

use App\Models\RegistrationBatch;
use App\Http\Controllers\Controller;
use App\Services\Batches\RegistrationBatchService;

class RegistrationBatchController extends Controller
{
  public function __construct(
    protected RegistrationBatchService $registrationBatchService,
  ) {}

  /**
   * Switch the specified resource in storage.
   */
  public function switch(RegistrationBatch $registrationBatch)
  {
    $this->authorize('update', $registrationBatch);

    $this->registrationBatchService->switch($registrationBatch);

    $this->flash('success', 'Registration batch switched successfully.');

    return redirect()->route('panel.configuration');
  }
}
