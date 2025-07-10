<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MahasiswaController extends Controller
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
        if (!$user->hasAccess('Lihat Data Mahasiswa')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat data mahasiswa.']);
        }
        return Inertia::render('data-mahasiswa/index', [
            'mahasiswas' => Mahasiswa::orderByDesc('created_at')->get(),
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canCreate' => $user->hasAccess('Buat Data Mahasiswa'),
            'canUpdate' => $user->hasAccess('Ubah Data Mahasiswa'),
            'canDelete' => $user->hasAccess('Hapus Data Mahasiswa'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Buat Data Mahasiswa')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat data mahasiswa.']);
        }
        return Inertia::render('data-mahasiswa/create', [
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
        if (!$user->hasAccess('Buat Data Mahasiswa')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk membuat data mahasiswa.']);
        }
        $request->validate([
            'nim' => 'required|string|max:10|unique:mahasiswas,nim',
            'nama' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:mahasiswas,email',
            'telepon' => 'required|string|max:15|unique:mahasiswas,telepon',
            'alamat' => 'required|string',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'status' => 'required|in:aktif,nonaktif',
        ], [
            'nim.required' => 'NIM harus diisi.',
            'nim.max' => 'NIM maksimal 10 karakter.',
            'nim.unique' => 'NIM sudah terdaftar.',
            'nama.required' => 'Nama harus diisi.',
            'nama.max' => 'Nama maksimal 255 karakter.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email maksimal 255 karakter.',
            'email.unique' => 'Email sudah terdaftar.',
            'telepon.required' => 'Telepon harus diisi.',
            'telepon.max' => 'Telepon maksimal 15 karakter.',
            'telepon.unique' => 'Telepon sudah terdaftar.',
            'alamat.required' => 'Alamat harus diisi.',
            'foto.image' => 'File foto harus berupa gambar.',
            'status.required' => 'Status harus dipilih.',
        ]);

        try {
            $fotoPath = null;
            if ($request->hasFile('foto')) {
                if ($fotoPath && Storage::disk('public')->exists($fotoPath)) {
                    Storage::disk('public')->delete($fotoPath);
                }

                $file = $request->file('foto');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = 'mahasiswa/' . $filename;
                
                Storage::disk('public')->putFileAs('mahasiswa', $file, $filename);
                $fotoPath = $path;
            }
            $mahasiswa = Mahasiswa::create([
                'nim' => $request->nim,
                'nama' => $request->nama,
                'email' => $request->email,
                'telepon' => $request->telepon,
                'alamat' => $request->alamat,
                'foto' => $fotoPath,
                'status' => $request->status,
            ]);
            session()->flash('success', "Data mahasiswa {$mahasiswa->nama} berhasil ditambahkan.");
            return redirect()->route("{$user->role}.data-mahasiswa.show", $mahasiswa->id)->with('success', "Data mahasiswa {$mahasiswa->nama} berhasil dibuat.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat membuat data mahasiswa.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Lihat Data Mahasiswa')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk melihat data mahasiswa.']);
        }
        $mahasiswa = Mahasiswa::findOrFail($id);
        return Inertia::render('data-mahasiswa/show', [
            'mahasiswa' => $mahasiswa,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canUpdate' => $user->hasAccess('Ubah Data Mahasiswa'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Data Mahasiswa')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah data mahasiswa.']);
        }
        $mahasiswa = Mahasiswa::findOrFail($id);
        return Inertia::render('data-mahasiswa/edit', [
            'mahasiswa' => $mahasiswa,
            'userRole' => $user->role,
            'user' => $this->getReturnedUser(),
            'canDelete' => $user->hasAccess('Hapus Data Mahasiswa'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Data Mahasiswa')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah data mahasiswa.']);
        }
        $request->validate([
            'nim' => 'required|string|max:10|unique:mahasiswas,nim,' . $id,
            'nama' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:mahasiswas,email,' . $id,
            'telepon' => 'required|string|max:15|unique:mahasiswas,telepon,' . $id,
            'alamat' => 'required|string',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'status' => 'required|in:aktif,nonaktif',
        ], [
            'nim.required' => 'NIM harus diisi.',
            'nim.max' => 'NIM maksimal 10 karakter.',
            'nim.unique' => 'NIM sudah terdaftar.',
            'nama.required' => 'Nama harus diisi.',
            'nama.max' => 'Nama maksimal 255 karakter.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email maksimal 255 karakter.',
            'email.unique' => 'Email sudah terdaftar.',
            'telepon.required' => 'Telepon harus diisi.',
            'telepon.max' => 'Telepon maksimal 15 karakter.',
            'telepon.unique' => 'Telepon sudah terdaftar.',
            'alamat.required' => 'Alamat harus diisi.',
            'foto.image' => 'File foto harus berupa gambar.',
            'status.required' => 'Status harus dipilih.',
        ]);

        try {
            $mahasiswa = Mahasiswa::findOrFail($id);
            $fotoPath = $mahasiswa->foto;
            if ($request->hasFile('foto')) {
                if ($fotoPath && Storage::disk('public')->exists($fotoPath)) {
                    Storage::disk('public')->delete($fotoPath);
                }

                $file = $request->file('foto');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = 'mahasiswa/' . $filename;
                
                Storage::disk('public')->putFileAs('mahasiswa', $file, $filename);
                $fotoPath = $path;
            }
            $mahasiswa->update([
                'nim' => $request->nim,
                'nama' => $request->nama,
                'email' => $request->email,
                'telepon' => $request->telepon,
                'alamat' => $request->alamat,
                'foto' => $fotoPath,
                'status' => $request->status,
            ]);
            session()->flash('success', "Data mahasiswa {$mahasiswa->nama} berhasil diperbarui.");
            return redirect()->route("{$user->role}.data-mahasiswa.edit")->with('success', 'Data mahasiswa berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui data mahasiswa.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Hapus Data Mahasiswa')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk menghapus data mahasiswa.']);
        }
        try {
            $mahasiswa = Mahasiswa::findOrFail($id);
            if ($mahasiswa->foto && Storage::disk('public')->exists($mahasiswa->foto)) {
                Storage::disk('public')->delete($mahasiswa->foto);
            }
            $mahasiswa->delete();
            session()->flash('success', "Data mahasiswa {$mahasiswa->nama} berhasil dihapus.");
            return redirect()->route("{$user->role}.data-mahasiswa.index")->with('success', 'Data mahasiswa berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus data mahasiswa.']);
        }
    }

    /**
     * Update status field based on toggle switch.
     */
    public function updateStatus(Request $request, string $id)
    {
        $user = User::find(auth('web')->user()->id);
        if (!$user->hasAccess('Ubah Data Mahasiswa')) {
            return redirect()->back()->withErrors(['error' => 'Anda tidak memiliki akses untuk mengubah data mahasiswa.']);
        }
        $mahasiswa = Mahasiswa::findOrFail($id);
        $request->validate([
            'status' => 'required|in:aktif,nonaktif',
        ]);
        $mahasiswa->update([
            'status' => $request->status
        ]);
        return redirect()->route("{$user->role}.data-mahasiswa.index")->with('success', "Status mahasiswa {$mahasiswa->nama} berhasil diperbarui.");
    }
}
