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
        Schema::create('sync_trackers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('table_name');
            $table->string('target_name')->unique(); // 'transactions_to_gsheet'
            $table->string('last_synced_id'); // to track the last synced record ID
            $table->timestamp('last_synced_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sync_trackers');
    }
};
