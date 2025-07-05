<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\RuangKelas;
use Illuminate\Http\Request;
use App\Models\PeminjamanKelas;
use App\Http\Controllers\Controller;

class PeminjamanKelasController extends Controller
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
        return Inertia::render('admin/peminjaman-kelas/index', [
            'peminjamanKelas' => PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])
                ->where('status', 'pending')
                ->orderByDesc('created_at')
                ->get(),
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Display a history listing of the resource.
     */
    public function history()
    {
        return Inertia::render('admin/peminjaman-kelas/history', [
            'peminjamanKelas' => PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])
                ->whereNot('status', 'pending')
                ->orderByDesc('updated_at')
                ->get(),
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $ruangKelas = RuangKelas::where('status', 'layak')->orderBy('nama')->get();
        $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])
            ->where('status', 'diterima')
            ->orderByDesc('created_at')
            ->get();
        return Inertia::render('admin/peminjaman-kelas/create', [
            'ruangKelas' => $ruangKelas,
            'peminjamanKelas' => $peminjamanKelas,
            'user' => $this->getReturnedUser(),
            'role' => auth('web')->user()->role,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'mahasiswa_id' => 'nullable|exists:mahasiswas,id',
            'dosen_id' => 'nullable|exists:dosens,id',
            'admin_id' => 'nullable|exists:admins,id',
            'ruang_kelas_id' => 'required|exists:ruang_kelas,id',
            'tanggal_peminjaman' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'alasan' => 'required|string|max:255',
        ]);

        try {
            $peminjamanKelas = PeminjamanKelas::create([
                'mahasiswa_id' => $request->mahasiswa_id,
                'dosen_id' => $request->dosen_id,
                'admin_id' => $request->admin_id,
                'ruang_kelas_id' => $request->ruang_kelas_id,
                'tanggal_peminjaman' => $request->tanggal_peminjaman,
                'jam_mulai' => $request->jam_mulai,
                'jam_selesai' => $request->jam_selesai,
                'alasan' => $request->alasan,
                'status' => 'diterima',
            ]);
            $nama = $peminjamanKelas->mahasiswa?->nama ?? $peminjamanKelas->dosen?->nama ?? $peminjamanKelas->admin?->nama;
            return redirect()->route('admin.peminjaman-kelas.history')->with('success', "Peminjaman kelas oleh {$nama} berhasil dibuat dan menunggu persetujuan.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat membuat data peminjaman kelas.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])->findOrFail($id);
        return Inertia::render('admin/peminjaman-kelas/show-index', [
            'peminjamanKelas' => $peminjamanKelas,
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function historyShow(string $id)
    {
        $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])->findOrFail($id);
        return Inertia::render('admin/peminjaman-kelas/show-history', [
            'peminjamanKelas' => $peminjamanKelas,
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function historyDestroy(string $id)
    {
        try {
            $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])->findOrFail($id);
            $nama = $peminjamanKelas->mahasiswa?->nama ?? $peminjamanKelas->dosen?->nama || $peminjamanKelas->admin?->nama;
            $peminjamanKelas->delete();
            return redirect()->route('admin.peminjaman-kelas.history')->with('success', "Riwayat peminjaman kelas oleh {$nama} berhasil dihapus.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus data peminjaman kelas.']);
        }
    }

    /**
     * Update status field based on toggle switch.
     */
    public function updateStatus(Request $request, string $id)
    {
        $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])->findOrFail($id);
        $request->validate([
            'status' => 'required|in:diterima,ditolak',
        ]);
        $peminjamanKelas->update([
            'status' => $request->status
        ]);
        $nama = $peminjamanKelas->mahasiswa?->nama ?? $peminjamanKelas->dosen?->nama ?? $peminjamanKelas->admin?->nama;
        return redirect()->route('admin.peminjaman-kelas.index')->with('success', "Status peminjaman kelas oleh {$nama} berhasil diperbarui.");
    }
}
