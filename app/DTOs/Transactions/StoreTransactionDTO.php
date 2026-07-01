<?php

namespace App\DTOs\Transactions;

use Illuminate\Http\UploadedFile;

class StoreTransactionDTO
{
  public function __construct(
    public string $team_id,
    public float $amount,
    public string $payment_method,
    public UploadedFile $payment_proof_file,
    public string $status,
  ) {}
}
