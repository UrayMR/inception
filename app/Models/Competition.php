<?php

namespace App\Models;

use Database\Factories\CompetitionFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Competition extends Model
{
  /** @use HasFactory<CompetitionFactory> */
  use HasFactory, HasUuids;

  protected $fillable = [
    'name',
    'description',
    'slug',
    'type',
    'image_path',
    'price',
    'status',
  ];

  public function timelines()
  {
    return $this->hasMany(CompetitionTimeline::class);
  }
}
