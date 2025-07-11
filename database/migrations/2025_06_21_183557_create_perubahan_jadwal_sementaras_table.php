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
        Schema::create('perubahan_jadwal_sementaras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jadwal_sementara_id')
                ->constrained('jadwal_sementaras')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('mahasiswa_id')
                ->nullable()
                ->constrained('mahasiswas')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('dosen_id')
                ->nullable()
                ->constrained('dosens')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('admin_id')
                ->nullable()
                ->constrained('admins')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('ruang_kelas_id')
                ->nullable()
                ->constrained('ruang_kelas')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->date('tanggal_perubahan');
            $table->time('jam_mulai_baru');
            $table->time('jam_selesai_baru');
            $table->string('alasan_perubahan');
            $table->enum('lokasi', ['online', 'offline'])->default('offline');
            $table->enum('status', ['pending', 'diterima', 'ditolak'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perubahan_jadwal_sementaras');
    }
};
