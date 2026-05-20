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
      'id' => $this->id,
      'team_name' => $this->team?->team_name,
      'competition_name' => $this->team?->competition?->name,
      'amount' => $this->amount,
      'payment_method' => $this->payment_method,
      'payment_proof_path' => $this->payment_proof_path,
      'status' => $this->status,
      'created_at' => $this->created_at?->toDateTimeString(),
      'updated_at' => $this->updated_at?->toDateTimeString(),
    ];
  }
}
