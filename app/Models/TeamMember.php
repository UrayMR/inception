<?php

namespace App\Models;

use Database\Factories\TeamMemberFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    /** @use HasFactory<TeamMemberFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'team_id',
        'member_name',
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
