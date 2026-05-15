<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('competition_timelines', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->uuid('competition_id');
      $table->string('timeline_name');
      $table->text('description')->nullable();
      $table->integer('sequence')->default(0);
      $table->timestamp('start_at');
      $table->timestamp('end_at');
      $table->timestamps();

      $table->foreign('competition_id')->references('id')->on('competitions')->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('competition_timelines');
  }
};
