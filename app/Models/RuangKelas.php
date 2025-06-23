<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RuangKelas extends Model
{
    /** @use HasFactory<\Database\Factories\RuangKelasFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [];

    public function jadwals(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'ruang_kelas_id');
    }

    public function perubahanJadwals(): HasMany
    {
        return $this->hasMany(PerubahanJadwal::class, 'ruang_kelas_id');
    }
}
