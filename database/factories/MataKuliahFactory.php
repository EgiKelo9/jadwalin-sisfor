<?php

namespace Database\Factories;

use App\Models\Dosen;
use App\Models\Jadwal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MataKuliah>
 */
class MataKuliahFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kode' => $this->faker->unique()->bothify('MK-######'),
            'nama' => $this->faker->sentence(3),
            'bobot_sks' => $this->faker->numberBetween(1, 4),
            'kapasitas' => $this->faker->numberBetween(20, 60),
            'semester' => $this->faker->numberBetween(1, 8),
            'status' => $this->faker->randomElement(['aktif', 'nonaktif']),
            'jenis' => $this->faker->randomElement(['wajib', 'pilihan']),
            'dosen_id' => Dosen::all()->random()->id ?? null,
        ];
    }

    public function withSchedule($count = 1)
    {
        return $this->afterCreating(function ($mataKuliah) use ($count) {
            if ($mataKuliah->status === 'aktif') {
                $jadwal = Jadwal::factory($count)->create(['mata_kuliah_id' => $mataKuliah->id]);
                $mataKuliah->jadwal()->saveMany($jadwal);
            }
        });
    }
}
