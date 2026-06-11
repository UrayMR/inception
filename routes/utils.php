<?php

use App\Http\Controllers\Utils\TransactionPaymentProofController;
use Illuminate\Support\Facades\Route;

Route::as('utils.')->middleware(['auth'])->group(function () {
  
  // Return the payment proof image for a transaction
  Route::get('/transactions/{transaction}/payment-proof', [TransactionPaymentProofController::class, 'show'])->name('transactions.payment-proof');
});
