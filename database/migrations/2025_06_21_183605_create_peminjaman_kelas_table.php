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
        Schema::create('peminjaman_kelas', function (Blueprint $table) {
            $table->id();
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
                ->constrained('ruang_kelas')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->date('tanggal_peminjaman');
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->string('alasan');
            $table->enum('status', ['pending', 'diterima', 'ditolak'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peminjaman_kelas');
    }
};
