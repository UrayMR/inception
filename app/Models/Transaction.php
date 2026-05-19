<?php

namespace App\Models;

use Database\Factories\TransactionFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
  /** @use HasFactory<TransactionFactory> */
  use HasFactory, HasUuids;

  protected $fillable = [
    'team_id',
    'amount',
    'payment_method',
    'payment_proof_path',
    'status',
  ];

  protected function casts(): array
  {
    return [
      'amount' => 'float',
    ];
  }

  public function team()
  {
    return $this->belongsTo(Team::class);
  }
}
