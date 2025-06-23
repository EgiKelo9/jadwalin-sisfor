<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MataKuliah extends Model
{
    /** @use HasFactory<\Database\Factories\MataKuliahFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [];

    public function dosen(): BelongsTo
    {
        return $this->belongsTo(Dosen::class, 'dosen_id');
    }

    public function jadwals(): HasMany
    {
        return $this->hasMany(Jadwal::class, 'mata_kuliah_id');
    }
}
