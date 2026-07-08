<?php

namespace App\Http\Controllers\Utils;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class TransactionPaymentProofController extends Controller
{
  /**
   * Show the payment proof file for a given transaction.
   */
  public function show(Transaction $transaction): BinaryFileResponse
  {
    $this->authorize('view', $transaction);

    $path = $transaction->payment_proof_path;

    if (!$path || !Storage::disk('local')->exists($path)) {
      abort(404, 'Payment proof not found.');
    }

    $absolutePath = Storage::disk('local')->path($path);

    return response()->file($absolutePath);
  }
}
