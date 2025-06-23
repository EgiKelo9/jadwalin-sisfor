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
        Schema::create('ruang_kelas', function (Blueprint $table) {
            $table->id();
            $table->string('nama')->unique();
            $table->string('gedung');
            $table->tinyInteger('lantai');
            $table->tinyInteger('kapasitas');
            $table->enum('status', ['layak', 'tidak_layak', 'perbaikan'])->default('layak');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ruang_kelas');
    }
};
