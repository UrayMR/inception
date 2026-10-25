<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('final_team_recipients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('team_id')
                ->unique()
                ->constrained('teams')
                ->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('final_announcement_runs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('team_id')
                ->unique()
                ->constrained('teams')
                ->cascadeOnDelete();
            $table->string('announcement_type'); // finalist, non-finalist
            $table->string('status')->default('ready'); // ready, sent, failed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('final_team_recipients');
        Schema::dropIfExists('final_announcement_runs');
    }
};
