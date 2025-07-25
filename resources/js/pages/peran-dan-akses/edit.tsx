import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Eye, LoaderCircle, Pencil } from 'lucide-react';
import { useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Admin',
    href: '/admin/beranda',
  },
  {
    title: 'Peran dan Akses',
    href: '/admin/peran-dan-akses',
  },
  {
    title: 'Ubah',
    href: '/admin/peran-dan-akses/{id}',
  },
];

type Account = {
  id: number;
  mahasiswa?: {
    id: number;
    nama: string;
    nim: string;
  };
  dosen?: {
    id: number;
    nama: string;
    nip: string;
    nidn: string;
  };
  admin?: {
    id: number;
    nama: string;
    nip: string;
  };
};

type AksesRoleData = {
  id: number;
  nama_role: string;
  akses: string;
  deskripsi: string;
  pivot?: {
    status: boolean | number;
    user_id: number;
    akses_role_id: number;
  };
};

export default function UbahAksesRole({
  account,
  aksesRoles,
}: {
  account: Account;
  aksesRoles: AksesRoleData[];
}) {

  const [processing, setProcessing] = useState(false);

  const [akses, setAkses] = useState(() =>
    aksesRoles.map((role) => ({
      ...role,
      status: !!role.pivot?.status,
    }))
  );

  const toggleStatus = (id: number) => {
    setAkses((prev) =>
      prev.map((role) =>
        role.id === id ? { ...role, status: !role.status } : role
      )
    );
  };

  const handleSave = (id: number) => {
    setProcessing(true);
    const aktifIds = akses.filter(role => role.status).map(role => role.id);

    router.put(`/admin/peran-dan-akses/${id}`, {
      akses: aktifIds,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        console.log('Berhasil update akses');
        // opsional: tampilkan notifikasi
      },
      onError: (errors) => {
        console.error('Terjadi error:', errors);
        alert('Gagal menyimpan data.');
      },
      onFinish: () => {
        console.log('Request selesai');
        setProcessing(false);
      }
    });
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs} userRole="admin">
      <Head title="Ubah Peran dan Akses" />
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-xl py-2 font-semibold">Ubah Peran dan Akses</h1>
          <Button variant="outline" asChild>
            <Link href={`/admin/peran-dan-akses/${account.id}`}>
              <Eye />
              Lihat
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 items-start gap-4 w-full">
          <div className="grid gap-4 mt-2 col-span-2">
            <Label htmlFor="identitas">Identitas Pengguna</Label>
            <Input
              id="identitas"
              type="text"
              tabIndex={1}
              disabled
              value={
                account.mahasiswa
                  ? `${account.mahasiswa.nama} - ${account.mahasiswa.nim} - Mahasiswa`
                  : account.dosen
                    ? `${account.dosen.nama} - ${account.dosen.nip} - Dosen`
                    : account.admin
                      ? `${account.admin.nama} - ${account.admin.nip} - Admin`
                      : "Tidak Diketahui"
              }
              className="w-full"
            />
          </div>

          <div className="grid gap-4 mt-2 col-span-2">
            <Label htmlFor="mahasiswa">Akses Dimiliki</Label>
            {akses.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 p-4 border border-secondary rounded-lg">
                {akses.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-start gap-2 col-span-1 w-full"
                  >
                    <Switch
                      id={`mahasiswa-${role.id}`}
                      className="mr-1"
                      checked={role.status}
                      onCheckedChange={() => toggleStatus(role.id)}
                    />
                    <Label htmlFor={`mahasiswa-${role.id}`} className="text-sm">
                      {role.akses}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border border-secondary rounded-lg text-center text-gray-500">
                Tidak ada akses yang dimiliki
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4 mt-2">
          <Button
            variant="primary"
            type="button"
            onClick={() => handleSave(account.id)}
          >
            {processing ? <LoaderCircle className='h-4 w-4 animate-spin' /> : "Simpan"}
          </Button>
          <Button
            variant={"outline"}
            type="button"
            onClick={() => window.history.back()}
          >
            Kembali
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
