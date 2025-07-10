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
        return $this->belongsToMany(User::class, 'akses_akuns', 'akses_role_id', 'user_id')
            ->withPivot('status')
            ->withTimestamps();
    }

    /**
     * Mendapatkan semua akses untuk role tertentu
     */
    public static function getAccessByRole(string $role): array
    {
        return self::where('nama_role', $role)->pluck('akses')->toArray();
    }

    /**
     * Membuat akses default untuk semua role
     */
    public static function createDefaultAccess(): void
    {
        $defaultAccess = [
            'mahasiswa' => [
                'Lihat Data Mahasiswa',
                'Lihat Data Dosen',
                'Lihat Mata Kuliah',
                'Lihat Ruang Kelas',
                'Lihat Peminjaman Kelas',
                'Buat Peminjaman Kelas',
                'Ubah Peminjaman Kelas',
                'Lihat Riwayat Peminjaman Kelas',
                'Ubah Riwayat Peminjaman Kelas',
                'Lihat Jadwal Perkuliahan',
                'Lihat Daftar Jadwal Perkuliahan',
            ],
            'dosen' => [
                'Lihat Data Mahasiswa',
                'Lihat Data Dosen',
                'Lihat Mata Kuliah',
                'Lihat Ruang Kelas',
                'Lihat Peminjaman Kelas',
                'Buat Peminjaman Kelas',
                'Ubah Peminjaman Kelas',
                'Lihat Riwayat Peminjaman Kelas',
                'Ubah Riwayat Peminjaman Kelas',
                'Lihat Jadwal Perkuliahan',
                'Lihat Daftar Jadwal Perkuliahan',
                'Lihat Perubahan Jadwal Perkuliahan',
                'Buat Perubahan Jadwal Perkuliahan',
                'Lihat Perubahan Daftar Jadwal Perkuliahan',
                'Buat Perubahan Daftar Jadwal Perkuliahan',
            ],
            'admin' => [
                'Lihat Data Mahasiswa',
                'Buat Data Mahasiswa',
                'Ubah Data Mahasiswa',
                'Hapus Data Mahasiswa',
                'Lihat Data Dosen',
                'Buat Data Dosen',
                'Ubah Data Dosen',
                'Hapus Data Dosen',
                'Lihat Mata Kuliah',
                'Buat Mata Kuliah',
                'Ubah Mata Kuliah',
                'Hapus Mata Kuliah',
                'Lihat Ruang Kelas',
                'Buat Ruang Kelas',
                'Ubah Ruang Kelas',
                'Hapus Ruang Kelas',
                'Lihat Peminjaman Kelas',
                'Buat Peminjaman Kelas',
                'Konfirmasi Peminjaman Kelas',
                'Lihat Riwayat Peminjaman Kelas',
                'Ubah Riwayat Peminjaman Kelas',
                'Hapus Riwayat Peminjaman Kelas',
                'Lihat Jadwal Perkuliahan',
                'Buat Jadwal Perkuliahan',
                'Ubah Jadwal Perkuliahan',
                'Hapus Jadwal Perkuliahan',
                'Lihat Daftar Jadwal Perkuliahan',
                'Buat Daftar Jadwal Perkuliahan',
                'Ubah Daftar Jadwal Perkuliahan',
                'Hapus Daftar Jadwal Perkuliahan',
                'Lihat Perubahan Jadwal Perkuliahan',
                'Buat Perubahan Jadwal Perkuliahan',
                'Ubah Perubahan Jadwal Perkuliahan',
                'Hapus Perubahan Jadwal Perkuliahan',
                'Lihat Perubahan Daftar Jadwal Perkuliahan',
                'Buat Perubahan Daftar Jadwal Perkuliahan',
                'Ubah Perubahan Daftar Jadwal Perkuliahan',
                'Hapus Perubahan Daftar Jadwal Perkuliahan',
                'Lihat Peran dan Akses',
                'Ubah Peran dan Akses',
            ],
        ];

        foreach ($defaultAccess as $role => $accesses) {
            foreach ($accesses as $access) {
                self::firstOrCreate([
                    'nama_role' => $role,
                    'akses' => $access,
                ], [
                    'deskripsi' => "{$role} dapat melakukan: {$access}",
                ]);
            }
        }
    }

    public static function withCustom(): void
    {
        $users = User::with('aksesRoles')->get();
        $aksesRole = AksesRole::with('users')->get();
        foreach ($users as $user) {
            foreach ($aksesRole as $akses) {
                $user->grantCustomAccess($user->role, $akses->akses);
            }
        }
    }
}
