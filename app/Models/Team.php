<?php

namespace App\Models;

use Database\Factories\TeamFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    /** @use HasFactory<TeamFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'competition_id',
        'team_name',
        'leader_id',
        'phone_number',
    ];

    public function competition()
    {
        return $this->belongsTo(Competition::class);
    }

    public function leader()
    {
        return $this->belongsTo(User::class);
    }

    public function members()
    {
        return $this->hasMany(TeamMember::class);
    }
}
