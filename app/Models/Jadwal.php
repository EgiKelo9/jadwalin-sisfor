<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
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
                // Perbaikan untuk MySQL - gunakan CAST yang lebih kompatibel
                $query->whereIn(DB::raw('CAST(semester AS SIGNED)'), $semesterNumbers);
            })
            ->with(['mataKuliah', 'ruangKelas']) // Eager loading untuk performa
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
                default => null,
            };
            if (!$dayInEnglish) {
                continue;
            }

            // Find first occurrence of target day
            $currentDate = $startDate->copy();
            while (strtolower($currentDate->englishDayOfWeek) !== $dayInEnglish) {
                $currentDate->addDay();
            }

            // Parsing jam mulai dengan validasi
            $start = Carbon::createFromFormat('H:i:s', $jadwal->jam_mulai);

            // Round start minute to nearest 10
            $start->minute = (int) floor($start->minute / 10) * 10;

            // Always start at 08:00 minimum
            $earliestStart = Carbon::createFromTime(8, 0);
            if ($start->lessThan($earliestStart)) {
                $start = $earliestStart->copy();
            }

            // Calculate duration by SKS
            $sks = $jadwal->mataKuliah->bobot_sks ?? 1;
            $durationMinutes = $sks * 50;

            // Compute end time
            $end = $start->copy()->addMinutes($durationMinutes);

            // If end exceeds 16:00, cap it
            $latestEnd = Carbon::createFromTime(16, 0);
            if ($end->greaterThan($latestEnd)) {
                $end = $latestEnd->copy();
            }

            // Validate start < end
            if ($start->greaterThanOrEqualTo($end)) {
                continue;
            }

            // Batch insert untuk performa yang lebih baik
            $jadwalSementaraData = [];
            $currentScheduleDate = $currentDate->copy();

            for ($i = 0; $i < $count; $i++) {
                if ($i > 0) {
                    $currentScheduleDate->addWeek();
                }

                $jadwalSementaraData[] = [
                    'jadwal_id' => $jadwal->id,
                    'lokasi' => 'offline',
                    'ruang_kelas_id' => $jadwal->ruang_kelas_id,
                    'tanggal' => $currentScheduleDate->format('Y-m-d'),
                    'jam_mulai' => $start->format('H:i'),
                    'jam_selesai' => $end->format('H:i'),
                ];
            }

            // Insert batch untuk performa
            if (!empty($jadwalSementaraData)) {
                JadwalSementara::insert($jadwalSementaraData);
            }
        }

        return new self;
    }
}
