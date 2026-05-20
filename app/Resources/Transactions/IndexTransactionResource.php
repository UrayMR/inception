<?php

namespace App\Resources\Transactions;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IndexTransactionResource extends JsonResource
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
      'status' => $this->status,
    ];
  }
}
