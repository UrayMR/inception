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
    // 1. Otorisasi (Pastikan hanya pemilik atau admin yang bisa lihat)
    // abort_if($transaction->user_id !== auth()->user()->id, 403, 'Akses ditolak.');
    // TODO: Implement proper authorization logic with policy here.

    $path = $transaction->payment_proof_path;

    if (!$path || !Storage::disk('local')->exists($path)) {
      abort(404, 'Payment proof not found.');
    }

    $absolutePath = Storage::disk('local')->path($path);

    return response()->file($absolutePath);
  }
}
