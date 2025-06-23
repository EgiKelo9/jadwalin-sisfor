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
        Schema::create('mata_kuliahs', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 20);
            $table->string('nama');
            $table->tinyInteger('bobot_sks')->default(1);
            $table->tinyInteger('kapasitas');
            $table->tinyInteger('semester');
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->enum('jenis', ['wajib', 'pilihan'])->default('wajib');
            $table->foreignId('dosen_id')->nullable()->constrained('dosens')->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mata_kuliahs');
    }
};
