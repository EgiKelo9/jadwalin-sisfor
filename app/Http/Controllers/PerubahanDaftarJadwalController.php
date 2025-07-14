<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\MataKuliah;
use App\Models\RuangKelas;
use Illuminate\Http\Request;
use App\Models\PerubahanJadwal;

class PerubahanDaftarJadwalController extends Controller
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
        if (!$user->hasAccess('Lihat Perubahan Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat perubahan daftar jadwal perkuliahan.']);
        }
        if (auth('web')->user()->role === 'admin') {
            if ($request->has('tabAktif') && $request->get('tabAktif') === 'Dikonfirmasi') {
                $perubahanJadwals = PerubahanJadwal::with(['jadwal.mataKuliah.dosen', 'jadwal.ruangKelas', 'ruangKelas'])
                    ->whereNot('status', 'pending')
                    ->orderByDesc('updated_at')
                    ->get();
            } else {
                $perubahanJadwals = PerubahanJadwal::with(['jadwal.mataKuliah.dosen', 'jadwal.ruangKelas', 'ruangKelas'])
                    ->where('status', 'pending')
                    ->orderByDesc('updated_at')
                    ->get();
            }
        } else {
            if ($user->dosen) {
                $perubahanJadwals = PerubahanJadwal::with(['jadwal.mataKuliah.dosen', 'jadwal.ruangKelas', 'ruangKelas'])
                    ->where('dosen_id', $user->dosen->id)
                    ->orderByDesc('updated_at')
                    ->get();
            } else {
                $perubahanJadwals = PerubahanJadwal::with(['jadwal.mataKuliah.dosen', 'jadwal.ruangKelas', 'ruangKelas'])
                    ->where('mahasiswa_id', $user->mahasiswa->id)
                    ->orderByDesc('updated_at')
                    ->get();
            }
        }
        return Inertia::render('ajukan-perubahan-daftar/index', [
            'perubahanJadwals' => $perubahanJadwals,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canCreate' => $user->hasAccess('Buat Perubahan Daftar Jadwal Perkuliahan'),
            'canUpdate' => $user->hasAccess('Ubah Perubahan Daftar Jadwal Perkuliahan'),
            'canDelete' => $user->hasAccess('Hapus Perubahan Daftar Jadwal Perkuliahan'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Buat Perubahan Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat daftar jadwal perkuliahan.']);
        }
        $ruangKelas = RuangKelas::where('status', 'layak')->orderBy('nama')->get();
        if ($user->dosen) {
            $mataKuliahs = MataKuliah::whereHas('jadwal')
                ->with(['dosen', 'jadwal'])
                ->where('dosen_id', $user->dosen_id)
                ->orderBy('nama')
                ->get();
        } else {
            $mataKuliahs = MataKuliah::whereHas('jadwal')
                ->with(['dosen', 'jadwal'])
                ->orderBy('nama')
                ->get();
        }
        return Inertia::render('ajukan-perubahan-daftar/create', [
            'ruangKelas' => $ruangKelas,
            'mataKuliahs' => $mataKuliahs,
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
        if (!$user->hasAccess('Buat Perubahan Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat daftar jadwal perkuliahan.']);
        }
        $request->validate([
            'jadwal_id' => 'required|exists:jadwals,id',
            'mahasiswa_id' => 'nullable|exists:mahasiswas,id',
            'dosen_id' => 'nullable|exists:dosens,id',
            'admin_id' => 'nullable|exists:admins,id',
            'ruang_kelas_id' => 'required|exists:ruang_kelas,id',
            'hari_perubahan' => 'required|in:senin,selasa,rabu,kamis,jumat',
            'jam_mulai_baru' => 'required|date_format:H:i',
            'jam_selesai_baru' => 'required|date_format:H:i|after:jam_mulai_baru',
            'alasan_perubahan' => 'required|string|max:1000',
        ], [
            'jadwal_id.required' => 'Jadwal perkuliahan harus dipilih.',
            'hari_perubahan.required' => 'Hari perkuliahan harus dipilih.',
            'jam_mulai_baru.required' => 'Jam mulai baru harus diisi.',
            'jam_selesai_baru.required' => 'Jam selesai baru harus diisi.',
            'ruang_kelas_id.required' => 'Ruang kelas harus dipilih.',
            'alasan_perubahan.required' => 'Alasan perubahan harus diisi.',
            'jam_selesai_baru.after' => 'Jam selesai baru harus setelah jam mulai baru.',
        ]);

        try {
            $perubahanJadwal = PerubahanJadwal::create([
                'jadwal_id' => $request->jadwal_id,
                'mahasiswa_id' => $request->mahasiswa_id,
                'dosen_id' => $request->dosen_id,
                'admin_id' => $request->admin_id,
                'ruang_kelas_id' => $request->ruang_kelas_id,
                'hari_perubahan' => $request->hari_perubahan,
                'jam_mulai_baru' => $request->jam_mulai_baru,
                'jam_selesai_baru' => $request->jam_selesai_baru,
                'alasan_perubahan' => $request->alasan_perubahan,
                'status' => 'pending',
            ]);

            session()->flash('success', 'Perubahan daftar jadwal perkuliahan berhasil dibuat.');
            return redirect()->route("{$user->role}.ajukan-perubahan-daftar.index")->with('success', 'Perubahan daftar jadwal perkuliahan berhasil dibuat.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal membuat perubahan daftar jadwal perkuliahan: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Perubahan Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat perubahan daftar jadwal perkuliahan.']);
        }
        $perubahanJadwal = PerubahanJadwal::with(['jadwal.mataKuliah.dosen', 'jadwal.ruangKelas', 'ruangKelas'])
            ->findOrFail($id);
        return Inertia::render('ajukan-perubahan-daftar/show', [
            'perubahanJadwal' => $perubahanJadwal,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canUpdate' => $user->hasAccess('Ubah Perubahan Daftar Jadwal Perkuliahan'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Perubahan Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah perubahan daftar jadwal perkuliahan.']);
        }

        $perubahanJadwal = PerubahanJadwal::with(['jadwal.mataKuliah.dosen', 'jadwal.ruangKelas', 'ruangKelas'])
            ->findOrFail($id);

        // Only allow editing if status is pending
        if ($perubahanJadwal->status !== 'pending') {
            return redirect()->route("{$user->role}.ajukan-perubahan-daftar.show", $id)
                ->withErrors(['error' => 'Perubahan jadwal yang sudah dikonfirmasi tidak dapat diubah.']);
        }

        $ruangKelas = RuangKelas::where('status', 'layak')->orderBy('nama')->get();

        return Inertia::render('ajukan-perubahan-daftar/edit', [
            'perubahanJadwal' => $perubahanJadwal,
            'ruangKelas' => $ruangKelas,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canDelete' => $user->hasAccess('Hapus Perubahan Daftar Jadwal Perkuliahan'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Perubahan Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah perubahan daftar jadwal perkuliahan.']);
        }

        $perubahanJadwal = PerubahanJadwal::findOrFail($id);

        // Only allow updating if status is pending
        if ($perubahanJadwal->status !== 'pending') {
            return redirect()->route("{$user->role}.ajukan-perubahan-daftar.edit", $id)
                ->withErrors(['error' => 'Perubahan jadwal yang sudah dikonfirmasi tidak dapat diubah.']);
        }

        $request->validate([
            'ruang_kelas_id' => 'required|exists:ruang_kelas,id',
            'hari_perubahan' => 'required|in:senin,selasa,rabu,kamis,jumat',
            'jam_mulai_baru' => 'required|date_format:H:i',
            'jam_selesai_baru' => 'required|date_format:H:i|after:jam_mulai_baru',
            'alasan_perubahan' => 'required|string|max:1000',
        ], [
            'hari_perubahan.required' => 'Hari perkuliahan harus dipilih.',
            'jam_mulai_baru.required' => 'Jam mulai baru harus diisi.',
            'jam_selesai_baru.required' => 'Jam selesai baru harus diisi.',
            'ruang_kelas_id.required' => 'Ruang kelas harus dipilih.',
            'alasan_perubahan.required' => 'Alasan perubahan harus diisi.',
            'jam_selesai_baru.after' => 'Jam selesai baru harus setelah jam mulai baru.',
        ]);

        try {
            $perubahanJadwal->update([
                'ruang_kelas_id' => $request->ruang_kelas_id,
                'hari_perubahan' => $request->hari_perubahan,
                'jam_mulai_baru' => $request->jam_mulai_baru,
                'jam_selesai_baru' => $request->jam_selesai_baru,
                'alasan_perubahan' => $request->alasan_perubahan,
            ]);

            session()->flash('success', 'Perubahan daftar jadwal perkuliahan berhasil diperbarui.');
            return redirect()->route("{$user->role}.ajukan-perubahan-daftar.edit", $id)
                ->with('success', 'Perubahan daftar jadwal perkuliahan berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui perubahan daftar jadwal perkuliahan: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Hapus Perubahan Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk menghapus daftar jadwal perkuliahan.']);
        }
        try {
            $perubahanJadwal = PerubahanJadwal::findOrFail($id);
            $perubahanJadwal->delete();
            session()->flash('success', 'Perubahan daftar jadwal perkuliahan berhasil dihapus.');
            return redirect()->route("{$user->role}.ajukan-perubahan-daftar.index")->with('success', 'Daftar jadwal perkuliahan berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus daftar jadwal perkuliahan: ' . $e->getMessage()]);
        }
    }

    /**
     * Update status field based on toggle switch.
     */
    public function updateStatus(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah status daftar jadwal perkuliahan.']);
        }

        $request->validate([
            'status' => 'required|in:diterima,ditolak',
        ]);

        try {
            $perubahanJadwal = PerubahanJadwal::findOrFail($id);
            $perubahanJadwal->update(['status' => $request->status]);

            if ($request->status === 'diterima') {
                $jadwal = $perubahanJadwal->jadwal();
                $jadwal->update([
                    'hari' => $perubahanJadwal->hari_perubahan,
                    'jam_mulai' => $perubahanJadwal->jam_mulai_baru,
                    'jam_selesai' => $perubahanJadwal->jam_selesai_baru,
                    'ruang_kelas_id' => $perubahanJadwal->ruang_kelas_id,
                ]);
            }

            session()->flash('success', 'Status daftar jadwal perkuliahan berhasil diperbarui.');
            return redirect()->route("{$user->role}.daftar-jadwal.index")->with('success', 'Status daftar jadwal perkuliahan berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui status daftar jadwal perkuliahan: ' . $e->getMessage()]);
        }
    }
}
