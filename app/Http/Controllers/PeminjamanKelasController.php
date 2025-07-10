<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\RuangKelas;
use Illuminate\Http\Request;
use App\Models\PeminjamanKelas;

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
        // dd("test");
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Peminjaman Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat peminjaman kelas.']);
        }
        switch ($user->role) {
            case 'mahasiswa':
                $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])
                    ->where('mahasiswa_id', $user->mahasiswa_id)
                    ->where('status', 'pending')
                    ->orderByDesc('created_at')
                    ->get();
                break;
            case 'dosen':
                $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])
                    ->where('dosen_id', $user->dosen_id)
                    ->where('status', 'pending')
                    ->orderByDesc('created_at')
                    ->get();
                break;
            case 'admin':
                $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])
                    ->where('status', 'pending')
                    ->orderByDesc('created_at')
                    ->get();
                break;
        }
        return Inertia::render('peminjaman-kelas/index', [
            'peminjamanKelas' => $peminjamanKelas,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canCreate' => $user->hasAccess('Buat Peminjaman Kelas'),
            'canConfirm' => $user->hasAccess('Konfirmasi Peminjaman Kelas'),
            'canViewHistory' => $user->hasAccess('Lihat Riwayat Peminjaman Kelas'),
        ]);
    }

    /**
     * Display a history listing of the resource.
     */
    public function history()
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Riwayat Peminjaman Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat riwayat peminjaman kelas.']);
        }
        switch ($user->role) {
            case 'mahasiswa':
                $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])
                    ->where('mahasiswa_id', $user->mahasiswa_id)
                    ->whereNot('status', 'pending')
                    ->orderByDesc('created_at')
                    ->get();
                break;
            case 'dosen':
                $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])
                    ->where('dosen_id', $user->dosen_id)
                    ->whereNot('status', 'pending')
                    ->orderByDesc('created_at')
                    ->get();
                break;
            case 'admin':
                $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])
                    ->whereNot('status', 'pending')
                    ->orderByDesc('created_at')
                    ->get();
                break;
        }
        return Inertia::render('peminjaman-kelas/history', [
            'peminjamanKelas' => $peminjamanKelas,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canUpdate' => $user->hasAccess('Ubah Riwayat Peminjaman Kelas'),
            'canDelete' => $user->hasAccess('Hapus Riwayat Peminjaman Kelas'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Buat Peminjaman Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat peminjaman kelas.']);
        }
        $ruangKelas = RuangKelas::where('status', 'layak')->orderBy('nama')->get();
        $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])
            ->where('status', 'diterima')
            ->orderByDesc('created_at')
            ->get();
        return Inertia::render('peminjaman-kelas/create', [
            'ruangKelas' => $ruangKelas,
            'peminjamanKelas' => $peminjamanKelas,
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
        if (!$user->hasAccess('Buat Peminjaman Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat peminjaman kelas.']);
        }
        $request->validate([
            'mahasiswa_id' => 'nullable|exists:mahasiswas,id',
            'dosen_id' => 'nullable|exists:dosens,id',
            'admin_id' => 'nullable|exists:admins,id',
            'ruang_kelas_id' => 'required|exists:ruang_kelas,id',
            'tanggal_peminjaman' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'alasan' => 'required|string|max:255',
        ], [
            'jam_selesai.after' => 'Jam selesai harus setelah jam mulai.',
            'ruang_kelas_id.exists' => 'Ruang kelas yang dipilih tidak valid.',
            'tanggal_peminjaman.date' => 'Tanggal peminjaman harus berupa tanggal yang valid.',
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
                'status' => $user->role === 'admin' ? 'diterima' : 'pending',
            ]);
            $nama = $peminjamanKelas->mahasiswa?->nama ?? $peminjamanKelas->dosen?->nama ?? $peminjamanKelas->admin?->nama;
            $route = $user->role === 'admin' ? 'history' : 'index';
            return redirect()->route("{$user->role}.peminjaman-kelas.{$route}")->with('success', "Peminjaman kelas oleh {$nama} berhasil dibuat dan menunggu persetujuan.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat membuat data peminjaman kelas.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Peminjaman Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat peminjaman kelas.']);
        }
        $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])->findOrFail($id);
        return Inertia::render('peminjaman-kelas/show-index', [
            'peminjamanKelas' => $peminjamanKelas,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canUpdate' => $user->hasAccess('Ubah Peminjaman Kelas'),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function historyShow(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Riwayat Peminjaman Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat riwayat peminjaman kelas.']);
        }
        $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])->findOrFail($id);
        return Inertia::render('peminjaman-kelas/show-history', [
            'peminjamanKelas' => $peminjamanKelas,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canUpdate' => $user->hasAccess('Ubah Riwayat Peminjaman Kelas'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Peminjaman Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah peminjaman kelas.']);
        }
        $ruangKelas = RuangKelas::where('status', 'layak')->orderBy('nama')->get();
        $peminjamanKelasForm = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])->findOrFail($id);
        $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])
            ->where('status', 'diterima')
            ->orderByDesc('created_at')
            ->get();
        return Inertia::render('peminjaman-kelas/edit-index', [
            'ruangKelas' => $ruangKelas,
            'peminjamanKelasForm' => $peminjamanKelasForm,
            'peminjamanKelas' => $peminjamanKelas,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function historyEdit(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Riwayat Peminjaman Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah riwayat peminjaman kelas.']);
        }
        $ruangKelas = RuangKelas::where('status', 'layak')->orderBy('nama')->get();
        $peminjamanKelasForm = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])->findOrFail($id);
        $peminjamanKelas = PeminjamanKelas::with(['mahasiswa', 'dosen', 'admin', 'ruangKelas'])
            ->where('status', 'diterima')
            ->orderByDesc('created_at')
            ->get();
        return Inertia::render('peminjaman-kelas/edit-history', [
            'ruangKelas' => $ruangKelas,
            'peminjamanKelasForm' => $peminjamanKelasForm,
            'peminjamanKelas' => $peminjamanKelas,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canDelete' => $user->hasAccess('Ubah Riwayat Peminjaman Kelas'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Peminjaman Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah peminjaman kelas.']);
        }
        $request->validate([
            'mahasiswa_id' => 'nullable|exists:mahasiswas,id',
            'dosen_id' => 'nullable|exists:dosens,id',
            'admin_id' => 'nullable|exists:admins,id',
            'ruang_kelas_id' => 'required|exists:ruang_kelas,id',
            'tanggal_peminjaman' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'alasan' => 'required|string|max:255',
        ], [
            'jam_selesai.after' => 'Jam selesai harus setelah jam mulai.',
            'ruang_kelas_id.exists' => 'Ruang kelas yang dipilih tidak valid.',
            'tanggal_peminjaman.date' => 'Tanggal peminjaman harus berupa tanggal yang valid.',
        ]);

        try {
            $peminjamanKelas = PeminjamanKelas::findOrFail($id);
            $peminjamanKelas->update([
                'mahasiswa_id' => $request->mahasiswa_id,
                'dosen_id' => $request->dosen_id,
                'admin_id' => $request->admin_id,
                'ruang_kelas_id' => $request->ruang_kelas_id,
                'tanggal_peminjaman' => $request->tanggal_peminjaman,
                'jam_mulai' => $request->jam_mulai,
                'jam_selesai' => $request->jam_selesai,
                'alasan' => $request->alasan,
                'status' => 'pending',
            ]);
            $nama = $peminjamanKelas->mahasiswa?->nama ?? $peminjamanKelas->dosen?->nama ?? $peminjamanKelas->admin?->nama;
            return redirect()->route("{$user->role}.peminjaman-kelas.edit")->with('success', "Peminjaman kelas oleh {$nama} berhasil diubah dan menunggu persetujuan.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat membuat data peminjaman kelas.']);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function historyUpdate(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Riwayat Peminjaman Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah riwayat peminjaman kelas.']);
        }
        $request->validate([
            'mahasiswa_id' => 'nullable|exists:mahasiswas,id',
            'dosen_id' => 'nullable|exists:dosens,id',
            'admin_id' => 'nullable|exists:admins,id',
            'ruang_kelas_id' => 'required|exists:ruang_kelas,id',
            'tanggal_peminjaman' => 'required|date',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'alasan' => 'required|string|max:255',
        ], [
            'jam_selesai.after' => 'Jam selesai harus setelah jam mulai.',
            'ruang_kelas_id.exists' => 'Ruang kelas yang dipilih tidak valid.',
            'tanggal_peminjaman.date' => 'Tanggal peminjaman harus berupa tanggal yang valid.',
        ]);

        try {
            $peminjamanKelas = PeminjamanKelas::findOrFail($id);
            $peminjamanKelas->update([
                'mahasiswa_id' => $request->mahasiswa_id,
                'dosen_id' => $request->dosen_id,
                'admin_id' => $request->admin_id,
                'ruang_kelas_id' => $request->ruang_kelas_id,
                'tanggal_peminjaman' => $request->tanggal_peminjaman,
                'jam_mulai' => $request->jam_mulai,
                'jam_selesai' => $request->jam_selesai,
                'alasan' => $request->alasan,
                'status' => $user->role === 'admin' ? 'diterima' : 'pending',
            ]);
            $nama = $peminjamanKelas->mahasiswa?->nama ?? $peminjamanKelas->dosen?->nama ?? $peminjamanKelas->admin?->nama;
            return redirect()->route("{$user->role}.peminjaman-kelas.edit")->with('success', "Peminjaman kelas oleh {$nama} berhasil diubah dan menunggu persetujuan.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat membuat data peminjaman kelas.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function historyDestroy(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Hapus Riwayat Peminjaman Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk menghapus riwayat peminjaman kelas.']);
        }
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
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Konfirmasi Peminjaman Kelas')) {
            abort(403, 'Anda tidak memiliki akses untuk mengkonfirmasi peminjaman kelas.');
        }
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
