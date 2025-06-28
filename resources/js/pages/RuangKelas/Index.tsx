import React from 'react';
import { Head } from '@inertiajs/react'; // Hanya import Head dari Inertia



export default function Index() { // Hapus { auth }: IndexProps atau sejenisnya
    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Head title="Halaman Ruang Kelas (Sangat Sederhana)" />

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Ruang Kelas</h1>
                <p className="text-gray-600 mb-2">Test</p>
                <p className="text-gray-600"></p>
                <p className="mt-4 text-sm text-gray-500">.</p>
            </div>
        </div>
    );
}