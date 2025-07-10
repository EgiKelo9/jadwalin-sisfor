<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\RuangKelas;
use Illuminate\Http\Request;

class RuangKelasController extends Controller
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
        if (!$user->hasAccess('Lihat Ruang Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat data ruang kelas.']);
        }
        return Inertia::render('ruang-kelas/index', [
            'ruangKelas' => RuangKelas::orderByDesc('created_at')->get(),
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canCreate' => $user->hasAccess('Buat Ruang Kelas'),
            'canUpdate' => $user->hasAccess('Ubah Ruang Kelas'),
            'canDelete' => $user->hasAccess('Hapus Ruang Kelas'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Buat Ruang Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat data ruang kelas.']);
        }
        return Inertia::render('ruang-kelas/create', [
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
        if (!$user->hasAccess('Buat Ruang Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat data ruang kelas.']);
        }
        $request->validate([
            'nama' => 'required|string|max:255',
            'gedung' => 'required|string|max:255',
            'lantai' => 'required|integer|min:1',
            'kapasitas' => 'required|integer|min:1',
            'status' => 'required|in:layak,tidak_layak,perbaikan',
        ], [
            'nama.required' => 'Nama harus diisi.',
            'nama.max' => 'Nama maksimal 255 karakter.',
            'gedung.required' => 'Gedung harus diisi.',
            'gedung.max' => 'Gedung maksimal 255 karakter.',
            'lantai.required' => 'Lantai harus diisi.',
            'lantai.integer' => 'Lantai harus berupa angka.',
            'lantai.min' => 'Lantai minimal 1.',
            'kapasitas.required' => 'Kapasitas harus diisi.',
            'kapasitas.integer' => 'Kapasitas harus berupa angka.',
            'kapasitas.min' => 'Kapasitas minimal 1.',
            'status.required' => 'Status harus dipilih.',
        ]);

        try {
            $ruangKelas = RuangKelas::create([
                'nama' => $request->nama,
                'gedung' => $request->gedung,
                'lantai' => $request->lantai,
                'kapasitas' => $request->kapasitas,
                'status' => $request->status,
            ]);
            session()->flash('success', "Data ruang kelas {$ruangKelas->nama} berhasil ditambahkan.");
            return redirect()->route("{$user->role}.ruang-kelas.show", $ruangKelas->id)->with('success', "Data ruang kelas {$ruangKelas->nama} berhasil dibuat.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat membuat data ruang kelas.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Ruang Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat data ruang kelas.']);
        }
        $ruangKelas = RuangKelas::findOrFail($id);
        return Inertia::render('ruang-kelas/show', [
            'ruangKelas' => $ruangKelas,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canUpdate' => $user->hasAccess('Ubah Ruang Kelas'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Ruang Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah data ruang kelas.']);
        }
        $ruangKelas = RuangKelas::findOrFail($id);
        return Inertia::render('ruang-kelas/edit', [
            'ruangKelas' => $ruangKelas,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canDelete' => $user->hasAccess('Hapus Ruang Kelas'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Ruang Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah data ruang kelas.']);
        }
        $request->validate([
            'nama' => 'required|string|max:255',
            'gedung' => 'required|string|max:255',
            'lantai' => 'required|integer|min:1',
            'kapasitas' => 'required|integer|min:1',
            'status' => 'required|in:layak,tidak_layak,perbaikan',
        ], [
            'nama.required' => 'Nama harus diisi.',
            'nama.max' => 'Nama maksimal 255 karakter.',
            'gedung.required' => 'Gedung harus diisi.',
            'gedung.max' => 'Gedung maksimal 255 karakter.',
            'lantai.required' => 'Lantai harus diisi.',
            'lantai.integer' => 'Lantai harus berupa angka.',
            'lantai.min' => 'Lantai minimal 1.',
            'kapasitas.required' => 'Kapasitas harus diisi.',
            'kapasitas.integer' => 'Kapasitas harus berupa angka.',
            'kapasitas.min' => 'Kapasitas minimal 1.',
            'status.required' => 'Status harus dipilih.',
        ]);

        try {
            $ruangKelas = RuangKelas::findOrFail($id);
            $ruangKelas->update([
                'nama' => $request->nama,
                'gedung' => $request->gedung,
                'lantai' => $request->lantai,
                'kapasitas' => $request->kapasitas,
                'status' => $request->status,
            ]);
            session()->flash('success', "Data ruang kelas {$ruangKelas->nama} berhasil diperbarui.");
            return redirect()->route("{$user->role}.ruang-kelas.edit")->with('success', 'Data ruang kelas berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui data ruang kelas.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Hapus Ruang Kelas')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk menghapus data ruang kelas.']);
        }
        try {
            $ruangKelas = RuangKelas::findOrFail($id);
            $ruangKelas->delete();
            session()->flash('success', "Data ruang kelas {$ruangKelas->nama} berhasil dihapus.");
            return redirect()->route("{$user->role}.ruang-kelas.index")->with('success', 'Data ruang kelas berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus data ruang kelas.']);
        }
    }
}
