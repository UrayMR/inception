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
    Schema::create('transactions', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->foreignUuid('team_id')->constrained('teams', 'id')->onDelete('cascade');
      $table->float('amount');
      $table->string('payment_method')->default('qris'); // qris, bank_transfer
      $table->string('payment_proof_path');
      $table->string('status')->default('pending'); // pending, verified, rejected
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('transactions');
  }
};
