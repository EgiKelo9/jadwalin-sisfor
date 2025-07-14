<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\MataKuliah;
use App\Models\RuangKelas;
use Illuminate\Http\Request;
use App\Models\JadwalSementara;
use Illuminate\Support\Facades\DB;
use App\Models\PerubahanJadwalSementara;

class PerubahanJadwalController extends Controller
{
    /**
     * Get the authenticated user based on their role.
     */
    private function getReturnedUser()
    {
        $user = auth('web')->user();
        return match ($user->role) {
            'mahasiswa' => $user->mahasiswa,
            'dosen' => $user->dosen,
            'admin' => $user->admin,
            default => null,
        };
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Perubahan Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat perubahan jadwal perkuliahan.']);
        }
        if (auth('web')->user()->role === 'admin') {
            if ($request->has('tabAktif') && $request->get('tabAktif') === 'Dikonfirmasi') {
                $perubahanJadwals = PerubahanJadwalSementara::with(['jadwalSementara.jadwal.mataKuliah.dosen', 'jadwalSementara.jadwal.ruangKelas', 'ruangKelas'])
                    ->whereNot('status', 'pending')
                    ->orderByDesc('updated_at')
                    ->get();
            } else {
                $perubahanJadwals = PerubahanJadwalSementara::with(['jadwalSementara.jadwal.mataKuliah.dosen', 'jadwalSementara.jadwal.ruangKelas', 'ruangKelas'])
                    ->where('status', 'pending')
                    ->orderByDesc('updated_at')
                    ->get();
            }
        } else {
            if ($user->dosen) {
                $perubahanJadwals = PerubahanJadwalSementara::with(['jadwalSementara.jadwal.mataKuliah.dosen', 'jadwalSementara.jadwal.ruangKelas', 'ruangKelas'])
                    ->where('dosen_id', $user->dosen->id)
                    ->orderByDesc('updated_at')
                    ->get();
            } else {
                $perubahanJadwals = PerubahanJadwalSementara::with(['jadwalSementara.jadwal.mataKuliah.dosen', 'jadwalSementara.jadwal.ruangKelas', 'ruangKelas'])
                    ->where('mahasiswa_id', $user->mahasiswa->id)
                    ->orderByDesc('updated_at')
                    ->get();
            }
        }
        return Inertia::render('ajukan-perubahan-jadwal/index', [
            'perubahanJadwals' => $perubahanJadwals,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canCreate' => $user->hasAccess('Buat Perubahan Jadwal Perkuliahan'),
            'canUpdate' => $user->hasAccess('Ubah Perubahan Jadwal Perkuliahan'),
            'canDelete' => $user->hasAccess('Hapus Perubahan Jadwal Perkuliahan'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Buat Perubahan Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat jadwal perkuliahan.']);
        }

        $ruangKelas = RuangKelas::where('status', 'layak')->orderBy('nama')->get();

        // Get jadwal sementara with all necessary relationships
        if ($user->dosen && $user->dosen_id !== null) {
            $jadwalSementaras = JadwalSementara::with([
                'jadwal.mataKuliah.dosen',
                'jadwal.ruangKelas',
                'ruangKelas'
            ])
            ->whereHas('jadwal.mataKuliah', function ($query) use ($user) {
                $query->where('dosen_id', $user->dosen->id);
            })
            ->orderBy('tanggal')
            ->get();
        } else {
            $jadwalSementaras = JadwalSementara::with([
                'jadwal.mataKuliah.dosen',
                'jadwal.ruangKelas',
                'ruangKelas'
            ])
            ->whereHas('jadwal.mataKuliah', function ($query) {
                $query->where('status', 'aktif');
            })
            ->orderBy('tanggal')
            ->get();
        }

        return Inertia::render('ajukan-perubahan-jadwal/create', [
            'ruangKelas' => $ruangKelas,
            'jadwalSementaras' => $jadwalSementaras, // Changed from mataKuliahs to jadwalSementaras
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Buat Perubahan Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat perubahan jadwal perkuliahan.']);
        }

        $rules = [
            'jadwal_sementara_id' => 'required|exists:jadwal_sementaras,id',
            'tanggal_perubahan' => 'required|date',
            'jam_mulai_baru' => 'required|date_format:H:i',
            'jam_selesai_baru' => 'required|date_format:H:i|after:jam_mulai_baru',
            'alasan_perubahan' => 'required|string|max:500',
            'lokasi' => 'required|in:online,offline',
        ];

        // Only require ruang_kelas_id if lokasi is offline
        if ($request->lokasi === 'offline') {
            $rules['ruang_kelas_id'] = 'required|exists:ruang_kelas,id';
        } else {
            $rules['ruang_kelas_id'] = 'nullable';
        }

        $request->validate($rules, [
            'jadwal_sementara_id.required' => 'Jadwal sementara wajib dipilih.',
            'jadwal_sementara_id.exists' => 'Jadwal sementara tidak ditemukan.',
            'tanggal_perubahan.required' => 'Tanggal perubahan wajib diisi.',
            'tanggal_perubahan.date' => 'Format tanggal tidak valid.',
            'jam_mulai_baru.required' => 'Jam mulai baru wajib diisi.',
            'jam_mulai_baru.date_format' => 'Format jam mulai tidak valid.',
            'jam_selesai_baru.required' => 'Jam selesai baru wajib diisi.',
            'jam_selesai_baru.date_format' => 'Format jam selesai tidak valid.',
            'jam_selesai_baru.after' => 'Jam selesai harus setelah jam mulai.',
            'alasan_perubahan.required' => 'Alasan perubahan wajib diisi.',
            'alasan_perubahan.max' => 'Alasan perubahan maksimal 500 karakter.',
            'lokasi.required' => 'Lokasi perkuliahan wajib dipilih.',
            'lokasi.in' => 'Lokasi harus online atau offline.',
            'ruang_kelas_id.required' => 'Ruang kelas wajib dipilih untuk perkuliahan offline.',
            'ruang_kelas_id.exists' => 'Ruang kelas tidak ditemukan.',
        ]);

        try {
            DB::beginTransaction();

            $perubahanJadwal = PerubahanJadwalSementara::create([
                'jadwal_sementara_id' => $request->jadwal_sementara_id,
                'mahasiswa_id' => $user->role === 'mahasiswa' ? $user->mahasiswa->id : null,
                'dosen_id' => $user->role === 'dosen' ? $user->dosen->id : null,
                'admin_id' => $user->role === 'admin' ? $user->admin->id : null,
                'ruang_kelas_id' => $request->lokasi === 'offline' ? $request->ruang_kelas_id : 1,
                'tanggal_perubahan' => $request->tanggal_perubahan,
                'jam_mulai_baru' => $request->jam_mulai_baru,
                'jam_selesai_baru' => $request->jam_selesai_baru,
                'alasan_perubahan' => $request->alasan_perubahan,
                'lokasi' => $request->lokasi,
                'status' => 'pending',
            ]);

            DB::commit();

            return redirect()->route("{$user->role}.ajukan-perubahan-jadwal.index")
                ->with('success', 'Perubahan jadwal berhasil diajukan dan menunggu persetujuan.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withErrors(['error' => 'Gagal mengajukan perubahan jadwal: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Perubahan Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat perubahan jadwal perkuliahan.']);
        }

        $perubahanJadwal = PerubahanJadwalSementara::with([
            'jadwalSementara.jadwal.mataKuliah.dosen',
            'jadwalSementara.jadwal.ruangKelas',
            'jadwalSementara.ruangKelas',
            'ruangKelas'
        ])->findOrFail($id);

        return Inertia::render('ajukan-perubahan-jadwal/show', [
            'perubahanJadwal' => $perubahanJadwal,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canUpdate' => $user->hasAccess('Ubah Perubahan Jadwal Perkuliahan'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Perubahan Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah perubahan jadwal perkuliahan.']);
        }

        $perubahanJadwal = PerubahanJadwalSementara::with([
            'jadwalSementara.jadwal.mataKuliah.dosen',
            'jadwalSementara.jadwal.ruangKelas',
            'jadwalSementara.ruangKelas',
            'ruangKelas'
        ])->findOrFail($id);

        // Only allow editing if status is pending
        if ($perubahanJadwal->status !== 'pending') {
            return redirect()->route("{$user->role}.ajukan-perubahan-jadwal.show", $id)
                ->withErrors(['error' => 'Perubahan jadwal yang sudah dikonfirmasi tidak dapat diubah.']);
        }

        $ruangKelas = RuangKelas::where('status', 'layak')->orderBy('nama')->get();

        return Inertia::render('ajukan-perubahan-jadwal/edit', [
            'perubahanJadwal' => $perubahanJadwal,
            'ruangKelas' => $ruangKelas,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canDelete' => $user->hasAccess('Hapus Perubahan Jadwal Perkuliahan'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Perubahan Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah perubahan jadwal perkuliahan.']);
        }

        $perubahanJadwal = PerubahanJadwalSementara::findOrFail($id);

        // Only allow updating if status is pending
        if ($perubahanJadwal->status !== 'pending') {
            return redirect()->route("{$user->role}.ajukan-perubahan-jadwal.edit", $id)
                ->withErrors(['error' => 'Perubahan jadwal yang sudah dikonfirmasi tidak dapat diubah.']);
        }

        $rules = [
            'tanggal_perubahan' => 'required|date',
            'jam_mulai_baru' => 'required|date_format:H:i',
            'jam_selesai_baru' => 'required|date_format:H:i|after:jam_mulai_baru',
            'alasan_perubahan' => 'required|string|max:500',
            'lokasi' => 'required|in:online,offline',
        ];

        // Only require ruang_kelas_id if lokasi is offline
        if ($request->lokasi === 'offline') {
            $rules['ruang_kelas_id'] = 'required|exists:ruang_kelas,id';
        } else {
            $rules['ruang_kelas_id'] = 'nullable';
        }

        $request->validate($rules, [
            'tanggal_perubahan.required' => 'Tanggal perubahan wajib diisi.',
            'tanggal_perubahan.date' => 'Format tanggal tidak valid.',
            'jam_mulai_baru.required' => 'Jam mulai baru wajib diisi.',
            'jam_mulai_baru.date_format' => 'Format jam mulai tidak valid.',
            'jam_selesai_baru.required' => 'Jam selesai baru wajib diisi.',
            'jam_selesai_baru.date_format' => 'Format jam selesai tidak valid.',
            'jam_selesai_baru.after' => 'Jam selesai harus setelah jam mulai.',
            'alasan_perubahan.required' => 'Alasan perubahan wajib diisi.',
            'alasan_perubahan.max' => 'Alasan perubahan maksimal 500 karakter.',
            'lokasi.required' => 'Lokasi perkuliahan wajib dipilih.',
            'lokasi.in' => 'Lokasi harus online atau offline.',
            'ruang_kelas_id.required' => 'Ruang kelas wajib dipilih untuk perkuliahan offline.',
            'ruang_kelas_id.exists' => 'Ruang kelas tidak ditemukan.',
        ]);

        try {
            DB::beginTransaction();

            $perubahanJadwal->update([
                'ruang_kelas_id' => $request->lokasi === 'offline' ? $request->ruang_kelas_id : null,
                'tanggal_perubahan' => $request->tanggal_perubahan,
                'jam_mulai_baru' => $request->jam_mulai_baru,
                'jam_selesai_baru' => $request->jam_selesai_baru,
                'alasan_perubahan' => $request->alasan_perubahan,
                'lokasi' => $request->lokasi,
            ]);

            DB::commit();

            return redirect()->route("{$user->role}.ajukan-perubahan-jadwal.edit", $id)
                ->with('success', 'Perubahan jadwal perkuliahan berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withErrors(['error' => 'Gagal memperbarui perubahan jadwal: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Hapus Perubahan Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk menghapus perubahan jadwal perkuliahan.']);
        }

        try {
            $perubahanJadwal = PerubahanJadwalSementara::findOrFail($id);

            // Only allow deletion if status is pending
            if ($perubahanJadwal->status !== 'pending') {
                return redirect()->back()
                    ->withErrors(['error' => 'Perubahan jadwal yang sudah dikonfirmasi tidak dapat dihapus.']);
            }

            $perubahanJadwal->delete();

            return redirect()->route("{$user->role}.ajukan-perubahan-jadwal.index")
                ->with('success', 'Perubahan jadwal perkuliahan berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Gagal menghapus perubahan jadwal perkuliahan: ' . $e->getMessage()]);
        }
    }

    /**
     * Update status field based on toggle switch.
     */
    public function updateStatus(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah status daftar jadwal perkuliahan.']);
        }

        $request->validate([
            'status' => 'required|in:diterima,ditolak',
        ]);

        try {
            $perubahanJadwal = PerubahanJadwalSementara::findOrFail($id);
            $perubahanJadwal->update(['status' => $request->status]);

            if ($request->status === 'diterima') {
                $jadwal = $perubahanJadwal->jadwalSementara();
                $jadwal->update([
                    'tanggal' => $perubahanJadwal->tanggal_perubahan,
                    'lokasi' => $perubahanJadwal->lokasi,
                    'jam_mulai' => $perubahanJadwal->jam_mulai_baru,
                    'jam_selesai' => $perubahanJadwal->jam_selesai_baru,
                    'ruang_kelas_id' => $perubahanJadwal->lokasi === 'offline' ? $perubahanJadwal->ruang_kelas_id : null,
                ]);
            }

            session()->flash('success', 'Status jadwal perkuliahan berhasil diperbarui.');
            return redirect()->route("{$user->role}.jadwal-perkuliahan.index")->with('success', 'Status jadwal perkuliahan berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui status jadwal perkuliahan: ' . $e->getMessage()]);
        }
    }
}
