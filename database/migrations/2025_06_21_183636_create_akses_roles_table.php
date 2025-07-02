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
        Schema::create('akses_roles', function (Blueprint $table) {
            $table->id();
            $table->enum('nama_role', ['mahasiswa', 'dosen', 'admin'])->default('mahasiswa');
            $table->string('akses');
            $table->text('deskripsi')->nullable();
            $table->timestamps();
            $table->unique(['nama_role', 'akses']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('akses_roles');
    }
};
