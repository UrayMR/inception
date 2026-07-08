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
      'amount' => $this->amount,
      'payment_method' => $this->payment_method,
      'payment_proof_path' => $this->payment_proof_path,
      'status' => $this->status,
      'created_at' => $this->created_at?->toDateTimeString(),
      'updated_at' => $this->updated_at?->toDateTimeString(),

      'competition_name' => $this->team?->competition?->name,
      'competition_type' => $this->team?->competition?->type,
      'competition_price' => $this->team?->competition?->price,

      'team_name' => $this->team?->team_name,
      'institution' => $this->team?->institution,
      'phone_number' => $this->team?->phone_number,
      'leader_name' => $this->team?->leader?->name,
      'leader_email' => $this->team?->leader?->email,
      'members' => $this->team?->members?->map(fn($member) => [
        'member_name' => $member->member_name,
      ])->toArray() ?? [],
    ];
  }
}
