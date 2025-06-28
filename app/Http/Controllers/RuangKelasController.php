<?php

namespace App\Http\Controllers;

use App\Models\RuangKelas;
use Illuminate\Http\Request;
use Inertia\Inertia; // Pastikan ini diimport

class RuangKelasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Mengambil semua data RuangKelas dari database
        $ruangKelas = RuangKelas::all();

        // Merender komponen React 'RuangKelas/Index' dan mengirimkan data $ruangKelas sebagai props
        return Inertia::render('RuangKelas/Index', [
            'ruangKelas' => $ruangKelas,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),     
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Merender komponen React 'RuangKelas/Create' untuk menampilkan form
        return Inertia::render('RuangKelas/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi input dari request
        $validatedData = $request->validate([
            'nama'      => 'required|string|max:255|unique:ruang_kelas,nama', 
            'gedung'    => 'required|string|max:255',
            'lantai'    => 'required|integer|min:0',  
            'kapasitas' => 'required|integer|min:1', 
            'status'    => 'required|in:layak,tidak_layak,perbaikan', 
        ]);

        // Membuat entri RuangKelas baru di database menggunakan data yang sudah divalidasi
        RuangKelas::create($validatedData);

        // Redirect kembali ke halaman index dengan pesan sukses (flash message)
        return redirect()->route('admin.ruang-kelas.index')->with('success', 'Ruang Kelas berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(RuangKelas $ruangKela) // Menggunakan Route Model Binding
    {

        return redirect()->route('admin.ruang-kelas.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RuangKelas $ruangKela) // Menggunakan Route Model Binding: Laravel akan mencari RuangKelas berdasarkan ID dari URL
    {
    
        return Inertia::render('RuangKelas/Edit', [
            'ruangKela' => $ruangKela,
        ]);
    }

    public function update(Request $request, RuangKelas $ruangKela) // Menggunakan Route Model Binding
    {
        // Validasi input dari request
        $validatedData = $request->validate([
            'nama'      => 'required|string|max:255|unique:ruang_kelas,nama,' . $ruangKela->id, // 'nama' harus unik, kecuali untuk ID ruang kelas itu sendiri
            'gedung'    => 'required|string|max:255',
            'lantai'    => 'required|integer|min:0',
            'kapasitas' => 'required|integer|min:1',
            'status'    => 'required|in:layak,tidak_layak,perbaikan', // Sesuai enum migrasi
        ]);

        // Memperbarui data RuangKelas di database menggunakan data yang sudah divalidasi
        $ruangKela->update($validatedData);

        // Redirect kembali ke halaman index dengan pesan sukses (flash message)
        return redirect()->route('admin.ruang-kelas.index')->with('success', 'Ruang Kelas berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RuangKelas $ruangKela) // Menggunakan Route Model Binding
    {
        // Menghapus entri RuangKelas dari database
        $ruangKela->delete();

        // Redirect kembali ke halaman index dengan pesan sukses (flash message)
        return redirect()->route('admin.ruang-kelas.index')->with('success', 'Ruang Kelas berhasil dihapus.');
    }
}