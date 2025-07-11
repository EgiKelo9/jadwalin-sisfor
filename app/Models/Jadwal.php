<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Jadwal extends Model
{
    /** @use HasFactory<\Database\Factories\JadwalFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [];

    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class, 'mata_kuliah_id');
    }

    public function ruangKelas(): BelongsTo
    {
        return $this->belongsTo(RuangKelas::class, 'ruang_kelas_id');
    }

    public function JadwalSementaras(): HasMany
    {
        return $this->hasMany(JadwalSementara::class, 'jadwal_id');
    }

    public function perubahanJadwals(): HasMany
    {
        return $this->hasMany(PerubahanJadwal::class, 'jadwal_id');
    }

    public static function withWeeklySchedule($count = 16, $startDate = null, $semester = 'genap')
    {
        $semesterNumbers = match ($semester) {
            'ganjil' => [1, 3, 5, 7],
            'genap' => [2, 4, 6, 8],
            default => [],
        };

        $jadwals = self::where('status', 'aktif')
            ->whereHas('mataKuliah', function ($query) use ($semesterNumbers) {
                $query->whereIn('semester', $semesterNumbers);
            })
            ->get();

        $startDate = $startDate ? Carbon::parse($startDate) : Carbon::now();

        foreach ($jadwals as $jadwal) {
            $dayInIndonesian = $jadwal->hari;
            $dayInEnglish = match ($dayInIndonesian) {
                'senin' => 'monday',
                'selasa' => 'tuesday',
                'rabu' => 'wednesday',
                'kamis' => 'thursday',
                'jumat' => 'friday',
            };

            // Find first occurrence of target day
            $currentDate = clone $startDate;
            while (strtolower($currentDate->englishDayOfWeek) !== $dayInEnglish) {
                $currentDate->addDay();
            }

            // Always start at 08:00
            $start = \Carbon\Carbon::createFromFormat('H:i', $jadwal->jam_mulai);
            $start->minute = (int) floor($start->minute / 10) * 10;
            $earliestStart = \Carbon\Carbon::createFromTime(8, 0);
            if ($start->lessThan($earliestStart)) {
                $start = $earliestStart->copy();
            }

            // Calculate duration by SKS
            $sks = $jadwal->mataKuliah->bobot_sks ?? 1;
            $durationMinutes = $sks * 50;

            // Compute end time
            $end = $start->copy()->addMinutes($durationMinutes);

            // If end exceeds 16:00, cap it
            $latestEnd = \Carbon\Carbon::createFromTime(16, 0);
            if ($end->greaterThan($latestEnd)) {
                $end = $latestEnd->copy();
            }

            // Round start minute to nearest 10
            $start->minute = (int) floor($start->minute / 10) * 10;

            // Validate start < end
            if ($start->greaterThanOrEqualTo($end)) {
                continue;
            }

            for ($i = 0; $i < $count; $i++) {
                if ($i > 0) {
                    $currentDate->addWeek();
                }

                JadwalSementara::create([
                    'jadwal_id' => $jadwal->id,
                    'ruang_kelas_id' => $jadwal->ruang_kelas_id,
                    'tanggal' => $currentDate->format('Y-m-d'),
                    'jam_mulai' => $start->format('H:i'),
                    'jam_selesai' => $end->format('H:i'),
                ]);
            }
        }

        return new self;
    }
}
