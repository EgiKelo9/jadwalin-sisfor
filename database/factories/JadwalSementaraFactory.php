<?php

namespace Database\Factories;

use App\Models\Jadwal;
use App\Models\RuangKelas;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JadwalSementara>
 */
class JadwalSementaraFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'jadwal_id' => Jadwal::all()->random()->id,
            'ruang_kelas_id' => RuangKelas::all()->random()->id,
            'tanggal' => fake()->date(),
            'jam_mulai' => fake()->time(),
            'jam_selesai' => fake()->time(),
        ];
    }
}
