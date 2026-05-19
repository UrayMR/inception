<?php

namespace App\Http\Requests\Transactions;

use App\DTOs\Transactions\StoreTransactionDTO;
use App\Enums\TransactionStatus;
use App\Models\Transaction;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;
use Illuminate\Validation\Rule;

class StoreTransactionRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->can('create', Transaction::class);
  }

  public function rules(): array
  {
    return [
      'amount' => ['required', 'numeric', 'min:0'],
      'payment_method' => ['required', 'string', Rule::in(['QRIS', 'Transfer'])],
      'payment_proof_file' => ['required', File::image()->max(5 * 1024)], // Max 5MB
      'status' => ['required', 'string', Rule::in(TransactionStatus::cases())],
    ];
  }

  public function toDTO(): StoreTransactionDTO
  {
    return new StoreTransactionDTO(
      team_id: $this->user()->leader()->id, // team_id is from the authenticated user's team (leader)
      amount: $this->input('amount'),
      payment_method: $this->input('payment_method'),
      payment_proof_file: $this->file('payment_proof_file'),
      status: $this->input('status'),
    );
  }
}
