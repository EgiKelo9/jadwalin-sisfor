<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Admin;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Mahasiswa::factory(10)->create();
        Dosen::factory(10)->create();
        Admin::factory(10)->create();
        User::factory(10)->create();
    }
}
