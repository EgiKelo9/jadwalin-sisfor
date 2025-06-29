<?php

use App\Http\Controllers\Admin\MahasiswaController as AdminMahasiswaController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');
Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Mahasiswa routes
    Route::get('mahasiswa/beranda', [DashboardController::class, 'mahasiswa'])->name('dashboard.mahasiswa');
    
    // Dosen routes
    Route::get('dosen/beranda', [DashboardController::class, 'dosen'])->name('dashboard.dosen');
    
    // Admin routes
    Route::get('admin/beranda', [DashboardController::class, 'admin'])->name('dashboard.admin');
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('data-mahasiswa', AdminMahasiswaController::class);
        Route::put('data-mahasiswa/{data_mahasiswa}/status', [AdminMahasiswaController::class, 'updateStatus'])->name('data-mahasiswa.updateStatus');
    });

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
