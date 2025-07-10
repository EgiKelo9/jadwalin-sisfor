<?php

namespace Database\Factories;

use App\Models\MataKuliah;
use App\Models\RuangKelas;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Jadwal>
 */
class JadwalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mata_kuliah_id' => MataKuliah::all()->random()->id,
            'ruang_kelas_id' => RuangKelas::all()->random()->id,
            'hari' => $this->faker->randomElement(['senin', 'selasa', 'rabu', 'kamis', 'jumat']),
            'jam_mulai' => $this->faker->time('H:i'),
            'jam_selesai' => $this->faker->time('H:i'),
        ];
    }
}
