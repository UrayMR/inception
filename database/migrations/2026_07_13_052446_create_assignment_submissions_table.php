<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('assignment_id')->constrained('assignments', 'id')->onDelete('cascade');
            $table->foreignUuid('team_id')->constrained('teams', 'id')->onDelete('cascade');
            $table->string('submission_link');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignment_submissions');
    }
};
