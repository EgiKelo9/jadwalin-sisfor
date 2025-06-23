<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AksesRole extends Model
{
    /** @use HasFactory<\Database\Factories\AksesRoleFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $guarded = [];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'akses_akuns', 'akses_role_id', 'user_id');
    }
}
