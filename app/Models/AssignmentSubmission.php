<?php

namespace App\Models;

use Database\Factories\AssignmentSubmissionFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentSubmission extends Model
{
    /** @use HasFactory<AssignmentSubmissionFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'assignment_id',
        'user_id',
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
