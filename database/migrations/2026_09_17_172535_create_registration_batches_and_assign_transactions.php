<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registration_batches', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique(); // batch-1, batch-2, batch-3, ...
            $table->string('status')->default('active');
            $table->timestamps();
        });

        $batchId = (string) Str::uuid();

        DB::table('registration_batches')->insert([
            'id' => $batchId,
            'name' => 'batch-1',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Schema::table('transactions', function (Blueprint $table) {
            $table->uuid('registration_batch_id')
                ->nullable()
                ->after('status');
        });

        DB::table('transactions')
            ->whereNull('registration_batch_id')
            ->update([
                'registration_batch_id' => $batchId,
            ]);

        DB::statement('
            ALTER TABLE transactions
            MODIFY registration_batch_id CHAR(36) NOT NULL
        ');

        Schema::table('transactions', function (Blueprint $table) {
            $table->foreign('registration_batch_id')
                ->references('id')
                ->on('registration_batches')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['registration_batch_id']);
            $table->dropColumn('registration_batch_id');
        });

        Schema::dropIfExists('registration_batches');
    }
};
