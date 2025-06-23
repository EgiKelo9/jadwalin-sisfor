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
        Schema::create('jadwal_sementaras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jadwal_id')
                ->constrained('jadwals')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('ruang_kelas_id')
                ->constrained('ruang_kelas')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->date('tanggal');
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_sementaras');
    }
};
