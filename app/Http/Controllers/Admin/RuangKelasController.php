<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\RuangKelas;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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
        return Inertia::render('admin/ruang-kelas/index', [
            'ruangKelas' => RuangKelas::orderByDesc('created_at')->get(),
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/ruang-kelas/create', [
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
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
            return redirect()->route('admin.ruang-kelas.show', $ruangKelas->id)->with('success', "Data ruang kelas {$ruangKelas->nama} berhasil dibuat.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat membuat data ruang kelas.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $ruangKelas = RuangKelas::findOrFail($id);
        return Inertia::render('admin/ruang-kelas/show', [
            'ruangKelas' => $ruangKelas,
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $ruangKelas = RuangKelas::findOrFail($id);
        return Inertia::render('admin/ruang-kelas/edit', [
            'ruangKelas' => $ruangKelas,
            'user' => $this->getReturnedUser(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
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
            return redirect()->route('admin.ruang-kelas.edit')->with('success', 'Data ruang kelas berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui data ruang kelas.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $ruangKelas = RuangKelas::findOrFail($id);
            $ruangKelas->delete();
            session()->flash('success', "Data ruang kelas {$ruangKelas->nama} berhasil dihapus.");
            return redirect()->route('admin.ruang-kelas.index')->with('success', 'Data ruang kelas berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus data ruang kelas.']);
        }
    }
}
