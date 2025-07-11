import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const dummySchedule = [
  {
    title: "Analisis Desain dan Sistem - C",
    time: "8:00 - 10:00",
    room: "Ruang 1.3",
    mode: "Offline",
    color: "bg-purple-200",
  },
  {
    title: "Sistem Informasi - D",
    time: "8:00 - 10:30",
    room: "Ruang 2.4",
    mode: "Offline",
    color: "bg-green-200",
  },
  {
    title: "Pemrograman Berbasis Web - D",
    time: "10:30 - 12:30",
    room: "Ruang 2.4",
    mode: "Offline",
    color: "bg-yellow-200",
  },
  {
    title: "Pengantar Pemrosesan Data Multimedia - D",
    time: "17:00 - 18:30",
    room: "Webex",
    mode: "Online",
    color: "bg-cyan-200",
  },
  {
    title: "Sisfor - D",
    time: "17:00 - 18:30",
    room: "Webex",
    mode: "Online",
    color: "bg-yellow-200",
  },
];

function parseTimeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

const BASE_START_MIN = 8 * 60; // 08:00
const BASE_END_MIN = 19 * 60;  // 19:00
const PIXELS_PER_MIN = 1.5;

export default function Schedule() {
  const [selectedPeriod, setSelectedPeriod] = useState("Mei 2025");
  const selectedDate = 27;

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const periods = [];
  for (const year of [2024, 2025, 2026]) {
    for (const month of months) {
      periods.push(`${month} ${year}`);
    }
  }

  // Parse bulan dan tahun
  const [monthName, yearStr] = selectedPeriod.split(" ");
  const year = parseInt(yearStr, 10);
  const monthIndex = months.findIndex((m) => m === monthName);
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();

  const placedEvents: { start: number; end: number; column: number }[] = [];

  const totalHeight = (BASE_END_MIN - BASE_START_MIN) * PIXELS_PER_MIN;

  return (
    <div className="bg-white rounded-lg p-4 w-full border relative">
      {/* Dropdown Bulan & Tahun */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {periods.map((period) => (
            <option key={period} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>

      {/* Baris tanggal scroll */}
      <ScrollArea className="w-[850px] mb-4">
        <div className="flex w-max space-x-2 px-1 pb-2 border-b">
          {Array.from({ length: lastDay }).map((_, idx) => {
            const date = idx + 1;
            const isActive = date === selectedDate;
            const dateObj = new Date(year, monthIndex, date);
            const dayLabel = dateObj.toLocaleDateString("id-ID", {
              weekday: "short",
            });
            const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

            return (
              <div
                key={date}
                className={`flex flex-col items-center justify-center cursor-pointer px-3 py-2 rounded min-w-[50px] ${
                  isActive
                    ? "bg-teal-500 text-white font-medium"
                    : `hover:bg-gray-100 text-gray-700 ${isWeekend ? "text-red-500" : ""}`
                }`}
              >
                <div className="text-xs">{dayLabel}</div>
                <div className="text-base">{date}</div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Grid waktu */}
      <div className="flex w-full overflow-auto relative">
        {/* Sidebar jam */}
        <div className="relative w-[80px] flex-shrink-0">
          {Array.from({
            length: (BASE_END_MIN - BASE_START_MIN) / 60 + 1,
          }).map((_, i) => {
            const hour = 8 + i;
            const top = i * 60 * PIXELS_PER_MIN;
            return (
              <div
                key={hour}
                className="absolute text-xs text-gray-500"
                style={{
                  top: `${top}px`,
                  height: `${60 * PIXELS_PER_MIN}px`,
                }}
              >
                <div className="flex items-start h-full border-t border-gray-200 pt-1">
                  {hour}:00
                </div>
              </div>
            );
          })}
        </div>

        {/* Konten jadwal */}
        <div
          className="relative flex-1"
          style={{ height: `${totalHeight}px`, minWidth: "400px" }}
        >
          {/* Garis bantu */}
          {Array.from({
            length: (BASE_END_MIN - BASE_START_MIN) / 60 + 1,
          }).map((_, i) => {
            const top = i * 60 * PIXELS_PER_MIN;
            return (
              <div
                key={i}
                className="absolute left-0 w-full border-t border-dashed border-gray-200"
                style={{ top: `${top}px` }}
              />
            );
          })}

          {/* Events */}
          {dummySchedule.map((item, idx) => {
            const [startStr, endStr] = item.time.split(" - ");
            const startMin = parseTimeToMinutes(startStr);
            const endMin = parseTimeToMinutes(endStr);
            const top = (startMin - BASE_START_MIN) * PIXELS_PER_MIN;
            const height = (endMin - startMin) * PIXELS_PER_MIN;

            // Overlap handling
            const overlapping = placedEvents.filter(
              (prev) => startMin < prev.end && endMin > prev.start
            );

            let column = 0;
            while (overlapping.some((e) => e.column === column)) {
              column++;
            }

            placedEvents.push({ start: startMin, end: endMin, column });

            const leftOffsetPx = column * 250;

            return (
              <div
                key={idx}
                className={`absolute rounded-lg shadow-md p-2 text-sm ${item.color}`}
                style={{
                  top: `${top}px`,
                  left: `${leftOffsetPx}px`,
                  height: `${height}px`,
                  width: "fit-content",
                  minWidth: "120px",
                  maxWidth: "250px",
                }}
              >
                <div className="font-semibold">{item.title}</div>
                <div className="text-xs">
                  {item.mode} - {item.room}
                </div>
                <div className="text-xs text-gray-600">{item.time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
