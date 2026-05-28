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
        Schema::create('teams', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('competition_id')->constrained('competitions', 'id')->onDelete('cascade');
            $table->string('team_name');
            $table->foreignUuid('leader_id')->constrained('users', 'id')->onDelete('cascade');
            $table->string('phone_number');
            $table->string('institution')->nullable();
            $table->string('status')->default('active'); // registered, active, rejected
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
