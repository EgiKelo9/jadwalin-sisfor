import { useState } from "react";
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Schedule from './dashboard/Schedule';
import Calendar from './dashboard/Calendar';
import { router } from '@inertiajs/react'

export default function Dashboard({ userRole, jadwal }: { userRole: string, jadwal: any[] }) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: userRole.charAt(0).toUpperCase() + userRole.slice(1),
      href: `/${userRole}/beranda`,
    },
    {
      title: 'Beranda',
      href: `/${userRole}/beranda`,
    },
  ];


  const handleDateChange = (date: number) => {
    setSelectedDate(date);

    const [monthName, yearStr] = selectedMonthYear.split(" ");
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];
    const monthIndex = months.findIndex((m) => m === monthName) + 1;

    const formattedDate = `${yearStr}-${String(monthIndex).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    console.log(formattedDate)

    router.get(
      window.location.pathname,
      { date: formattedDate },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };


  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedMonthYear, setSelectedMonthYear] = useState(
    `${today.toLocaleString("id-ID", { month: "long" })} ${today.getFullYear()}`
  );


  return (
    <AppLayout breadcrumbs={breadcrumbs} userRole={userRole}>
      <Head title="Beranda" />
      <div className="flex w-full h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        {/* <div className="grid w-full gap-4 md:grid-cols-[3fr_1fr]">
          <div>
            <Schedule
              jadwal={jadwal}
              selectedDate={selectedDate}
              selectedMonthYear={selectedMonthYear}
              setSelectedDate={handleDateChange}
              setSelectedMonthYear={setSelectedMonthYear}
            />
          </div>
          <div>
            <Calendar
              selectedDate={selectedDate}
              selectedMonthYear={selectedMonthYear}
              setSelectedDate={handleDateChange}
            />
          </div>
        </div> */}
        <div>
          <Schedule
            jadwal={jadwal}
            selectedDate={selectedDate}
            selectedMonthYear={selectedMonthYear}
            setSelectedDate={handleDateChange}
            setSelectedMonthYear={setSelectedMonthYear}
          />
        </div>
      </div>
    </AppLayout>
  );
}
