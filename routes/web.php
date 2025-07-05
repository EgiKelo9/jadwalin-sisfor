<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\DosenController as AdminDosenController;
use App\Http\Controllers\Admin\MahasiswaController as AdminMahasiswaController;
use App\Http\Controllers\Admin\MataKuliahController as AdminMataKuliahController;
use App\Http\Controllers\Admin\RuangKelasController as AdminRuangKelasController;
use App\Http\Controllers\Admin\PeminjamanKelasController as AdminPeminjamanKelasController;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Mahasiswa routes
    Route::get('mahasiswa/beranda', [DashboardController::class, 'mahasiswa'])->name('mahasiswa.dashboard');
    
    // Dosen routes
    Route::get('dosen/beranda', [DashboardController::class, 'dosen'])->name('dosen.dashboard');
    
    // Admin routes
    Route::get('admin/beranda', [DashboardController::class, 'admin'])->name('admin.dashboard');
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('data-mahasiswa', AdminMahasiswaController::class);
        Route::put('data-mahasiswa/{data_mahasiswa}/status', [AdminMahasiswaController::class, 'updateStatus'])->name('data-mahasiswa.updateStatus');
        Route::resource('data-dosen', AdminDosenController::class);
        Route::put('data-dosen/{data_dosen}/status', [AdminDosenController::class, 'updateStatus'])->name('data-dosen.updateStatus');
        Route::resource('ruang-kelas', AdminRuangKelasController::class);
        Route::resource('mata-kuliah', AdminMataKuliahController::class);
        Route::put('mata-kuliah/{mata_kuliah}/status', [AdminMataKuliahController::class, 'updateStatus'])->name('mata-kuliah.updateStatus');
        Route::prefix('peminjaman-kelas')->name('peminjaman-kelas.')->group(function () {
            Route::get('riwayat', [AdminPeminjamanKelasController::class, 'history'])->name('history');
            Route::get('riwayat/{peminjaman_kelas}', [AdminPeminjamanKelasController::class, 'historyShow'])->name('history.show');
            Route::delete('riwayat/{peminjaman_kelas}', [AdminPeminjamanKelasController::class, 'historyDestroy'])->name('history.destroy');
            Route::put('{peminjaman_kelas}/status', [AdminPeminjamanKelasController::class, 'updateStatus'])->name('updateStatus');
        });
        Route::resource('peminjaman-kelas', AdminPeminjamanKelasController::class)->except(['edit', 'update', 'destroy']);
    });

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
