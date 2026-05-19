<?php

namespace App\Resources\Transactions;

use Illuminate\Http\Client\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShowTransactionResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @param  Request  $request
   * @return array<string, mixed>
   */
  public function toArray($request): array
  {
    return [
      'team_name' => $this->team?->team_name,
      'competition_name' => $this->team?->competition?->name,
      'amount' => $this->amount,
      'payment_proof_path' => $this->payment_proof_path,
      'status' => $this->status,
    ];
  }
}
