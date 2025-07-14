<?php
namespace Database\Factories;
use App\Models\Dosen;
use App\Models\Jadwal;
use App\Models\MataKuliah;
use Illuminate\Database\Eloquent\Factories\Factory;

class MataKuliahFactory extends Factory
{
    public function definition(): array
    {
        return [
            'kode' => $this->faker->unique()->bothify('MK-######'),
            'nama' => ucwords($this->faker->words(4, true)),
            'bobot_sks' => $this->faker->numberBetween(1, 4),
            'kapasitas' => $this->faker->numberBetween(20, 60),
            'semester' => $this->faker->numberBetween(1, 8),
            'status' => $this->faker->randomElement(['aktif', 'nonaktif']),
            'jenis' => $this->faker->randomElement(['wajib', 'pilihan']),
            'dosen_id' => Dosen::inRandomOrder()->first()->id ?? null,
        ];
    }

    public function withClasses($classCount = 6, $isObscure = false)
    {
        // For obscure subjects, limit to class A only
        if ($isObscure) {
            $classCount = 1;
        }
        
        // Limit class count to maximum of 6 (A-F)
        $classCount = min($classCount, 6);
        
        $baseKode = $this->faker->unique()->bothify('MK-######');
        $baseName = ucwords(implode(' ', $this->faker->words(4, false)));
        $baseProperties = [
            'bobot_sks' => $this->faker->numberBetween(1, 4),
            'kapasitas' => $this->faker->numberBetween(20, 60),
            'semester' => $this->faker->numberBetween(1, 8),
            'status' => $this->faker->randomElement(['aktif', 'nonaktif']),
            'jenis' => $this->faker->randomElement(['wajib', 'pilihan']),
        ];
        
        $createdClasses = collect();
        $classes = ['A', 'B', 'C', 'D', 'E', 'F'];
        
        for ($i = 0; $i < $classCount; $i++) {
            $classLetter = $classes[$i];
            $currentKode = $i === 0 ? $baseKode : $this->incrementKode($baseKode, $i);
            
            $mataKuliah = MataKuliah::create(array_merge($baseProperties, [
                'kode' => $currentKode,
                'nama' => $baseName . ' - ' . $classLetter,
                'dosen_id' => Dosen::inRandomOrder()->first()->id ?? null,
            ]));
            
            $createdClasses->push($mataKuliah);
        }
        
        return $createdClasses;
    }

    public function obscure()
    {        
        return $this->state(function (array $attributes) {
            return [
                'nama' => $this->faker->words(3, true) . ' - A',
                'bobot_sks' => 2,
                'jenis' => 'wajib',
                'kapasitas' => $this->faker->numberBetween(40, 80),
            ];
        });
    }

    private function incrementKode($baseKode, $increment)
    {
        if (preg_match('/^([A-Z-]+)(\d+)$/', $baseKode, $matches)) {
            $prefix = $matches[1];
            $number = intval($matches[2]);
            $newNumber = $number + $increment;
            
            $paddedNumber = str_pad($newNumber, strlen($matches[2]), '0', STR_PAD_LEFT);
            
            return $prefix . $paddedNumber;
        }
        
        return $baseKode . '-' . $increment;
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
