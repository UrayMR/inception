<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class FinalTeamRecipient extends Model
{
  use HasUuids;

  protected $fillable = [
    'team_id',
  ];

  public function team()
  {
    return $this->belongsTo(Team::class);
  }
}
