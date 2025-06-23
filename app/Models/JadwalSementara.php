<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JadwalSementara extends Model
{
    /** @use HasFactory<\Database\Factories\JadwalSementaraFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [];

    public function ruangKelas(): BelongsTo
    {
        return $this->belongsTo(RuangKelas::class, 'ruang_kelas_id');
    }
    
    public function jadwal(): BelongsTo
    {
        return $this->belongsTo(Jadwal::class, 'jadwal_id');
    }

    public function perubahanJadwalSementaras(): HasMany
    {
        return $this->hasMany(PerubahanJadwalSementara::class, 'jadwal_sementara_id');
    }
}
