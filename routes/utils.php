<?php

use App\Http\Controllers\Utils\TransactionPaymentProofController;
use Illuminate\Support\Facades\Route;

Route::as('utils.')->middleware(['auth'])->group(function () {
  Route::get('/transactions/{transaction}/payment-proof', [TransactionPaymentProofController::class, 'show'])->name('transactions.payment-proof');
});
