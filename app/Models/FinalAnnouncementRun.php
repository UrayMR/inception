<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class FinalAnnouncementRun extends Model
{
  use HasUuids;

  protected $fillable = [
    'team_id',
    'announcement_type',
    'status',
  ];

  public function team()
  {
    return $this->belongsTo(Team::class);
  }
}
