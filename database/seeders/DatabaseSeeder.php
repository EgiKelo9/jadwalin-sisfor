<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Admin;
use App\Models\AksesRole;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\PeminjamanKelas;
use App\Models\RuangKelas;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Mahasiswa::factory(100)->withAccount()->create();
        Dosen::factory(10)->withAccount()->create();
        Admin::factory(3)->withAccount()->create();
        RuangKelas::factory(20)->create();
        MataKuliah::factory(20)->create();
        PeminjamanKelas::factory(20)->create();
        AksesRole::createDefaultAccess();
        AksesRole::withCustom();
    }
}
