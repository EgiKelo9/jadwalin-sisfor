<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Dosen;
use App\Models\Jadwal;
use App\Models\MataKuliah;
use App\Models\RuangKelas;
use Illuminate\Http\Request;

class DaftarJadwalController extends Controller
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
    public function index()
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat daftar jadwal perkuliahan.']);
        }
        $jadwals = Jadwal::with(['mataKuliah', 'ruangKelas'])
            ->orderBy('status')
            ->orderByDesc('hari')
            ->orderBy('jam_mulai')
            ->get();
        return Inertia::render('daftar-jadwal/index', [
            'daftarJadwals' => $jadwals,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canCreate' => $user->hasAccess('Buat Daftar Jadwal Perkuliahan'),
            'canUpdate' => $user->hasAccess('Ubah Daftar Jadwal Perkuliahan'),
            'canDelete' => $user->hasAccess('Hapus Daftar Jadwal Perkuliahan'),
            'canShowAjukan' => $user->hasAccess('Lihat Perubahan Daftar Jadwal Perkuliahan'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Buat Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat daftar jadwal perkuliahan.']);
        }
        $ruangKelas = RuangKelas::where('status', 'layak')->orderBy('nama')->get();
        $mataKuliahs = MataKuliah::whereDoesntHave('jadwal')
            ->with('dosen')
            ->orderBy('nama')
            ->get();
        return Inertia::render('daftar-jadwal/create', [
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
        if (!$user->hasAccess('Buat Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat daftar jadwal perkuliahan.']);
        }
        $request->validate([
            'hari' => 'required|string|in:senin,selasa,rabu,kamis,jumat',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'mata_kuliah_id' => 'required|exists:mata_kuliahs,id',
            'ruang_kelas_id' => 'required|exists:ruang_kelas,id',
        ], [
            'hari.required' => 'Hari wajib diisi.',
            'jam_mulai.required' => 'Jam mulai wajib diisi.',
            'jam_selesai.required' => 'Jam selesai wajib diisi.',
            'mata_kuliah_id.required' => 'Mata kuliah wajib dipilih.',
            'ruang_kelas_id.required' => 'Ruang kelas wajib dipilih.',
        ]);

        try {
            $jadwal = Jadwal::create([
                'hari' => $request->hari,
                'jam_mulai' => $request->jam_mulai,
                'jam_selesai' => $request->jam_selesai,
                'mata_kuliah_id' => $request->mata_kuliah_id,
                'ruang_kelas_id' => $request->ruang_kelas_id,
            ]);
            session()->flash('success', 'Daftar jadwal perkuliahan berhasil dibuat.');
            return redirect()->route("{$user->role}.daftar-jadwal.show", $jadwal->id)->with('success', 'Daftar jadwal perkuliahan berhasil dibuat.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal membuat daftar jadwal perkuliahan: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat daftar jadwal perkuliahan.']);
        }
        $jadwal = Jadwal::with(['mataKuliah', 'ruangKelas'])->findOrFail($id);
        $mataKuliah = $jadwal->mataKuliah->with('dosen')->first();
        return Inertia::render('daftar-jadwal/show', [
            'daftarJadwal' => $jadwal,
            'mataKuliah' => $mataKuliah,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canUpdate' => $user->hasAccess('Ubah Daftar Jadwal Perkuliahan'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat daftar jadwal perkuliahan.']);
        }
        $jadwal = Jadwal::with(['mataKuliah', 'ruangKelas'])->findOrFail($id);
        $mataKuliah = $jadwal->mataKuliah->with('dosen')->first();
        $ruangKelas = RuangKelas::where('status', 'layak')->orderBy('nama')->get();
        return Inertia::render('daftar-jadwal/edit', [
            'daftarJadwal' => $jadwal,
            'mataKuliah' => $mataKuliah,
            'ruangKelas' => $ruangKelas,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canDelete' => $user->hasAccess('Hapus Daftar Jadwal Perkuliahan'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat daftar jadwal perkuliahan.']);
        }
        $request->validate([
            'hari' => 'required|string|in:senin,selasa,rabu,kamis,jumat',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'mata_kuliah_id' => 'required|exists:mata_kuliahs,id',
            'ruang_kelas_id' => 'required|exists:ruang_kelas,id',
        ], [
            'hari.required' => 'Hari wajib diisi.',
            'jam_mulai.required' => 'Jam mulai wajib diisi.',
            'jam_selesai.required' => 'Jam selesai wajib diisi.',
            'mata_kuliah_id.required' => 'Mata kuliah wajib dipilih.',
            'ruang_kelas_id.required' => 'Ruang kelas wajib dipilih.',
        ]);

        try {
            $jadwal = Jadwal::findOrFail($id);
            $jadwal->update([
                'hari' => $request->hari,
                'jam_mulai' => $request->jam_mulai,
                'jam_selesai' => $request->jam_selesai,
                'mata_kuliah_id' => $request->mata_kuliah_id,
                'ruang_kelas_id' => $request->ruang_kelas_id,
            ]);
            session()->flash('success', 'Daftar jadwal perkuliahan berhasil diperbarui.');
            return redirect()->route("{$user->role}.daftar-jadwal.edit", $jadwal->id)->with('success', 'Daftar jadwal perkuliahan berhasil diperbarui.');
        } catch (\Exception $e) {
            session()->flash('error', 'Gagal memperbarui daftar jadwal perkuliahan: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Hapus Daftar Jadwal Perkuliahan')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk menghapus daftar jadwal perkuliahan.']);
        }
        try {
            $jadwal = Jadwal::findOrFail($id);
            $jadwal->delete();
            session()->flash('success', 'Daftar jadwal perkuliahan berhasil dihapus.');
            return redirect()->route("{$user->role}.daftar-jadwal.index")->with('success', 'Daftar jadwal perkuliahan berhasil dihapus.');
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
            'status' => 'required|in:aktif,nonaktif',
        ]);

        try {
            $jadwal = Jadwal::findOrFail($id);
            $jadwal->update(['status' => $request->status]);
            session()->flash('success', 'Status daftar jadwal perkuliahan berhasil diperbarui.');
            return redirect()->route("{$user->role}.daftar-jadwal.index")->with('success', 'Status daftar jadwal perkuliahan berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui status daftar jadwal perkuliahan: ' . $e->getMessage()]);
        }
    }
}
