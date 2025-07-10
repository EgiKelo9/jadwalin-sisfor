import { useState } from "react";

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
    time: "8:30 - 10:30",
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
];

function parseTimeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

const BASE_START_MIN = 8 * 60; // 08:00 pagi
const BASE_END_MIN = 19 * 60; // 19:00 malam
const PIXELS_PER_MIN = 1.5;

export default function Schedule() {
  const [selectedMonth, setSelectedMonth] = useState("Mei");
  const [selectedYear, setSelectedYear] = useState(2025);
  const selectedDate = 27;

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const placedEvents: { start: number; end: number; left: number }[] = [];
  const totalHeight = (BASE_END_MIN - BASE_START_MIN) * PIXELS_PER_MIN;

  return (
    <div className="bg-white rounded-lg p-4 w-full border">
      {/* Bulan & Tahun */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm"
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Baris tanggal */}
      <div className="flex border-b pb-2 mb-4">
        {Array.from({ length: 9 }).map((_, idx) => {
          const date = 24 + idx;
          return (
            <div
              key={date}
              className={`flex-1 text-center text-sm px-2 py-1 rounded cursor-pointer ${
                date === selectedDate ? "bg-teal-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              {date}
            </div>
          );
        })}
      </div>

      {/* Grid waktu */}
      <div className="flex w-full overflow-auto relative">
        {/* Sidebar jam */}
        <div className="relative w-[80px] flex-shrink-0">
          {Array.from({ length: (BASE_END_MIN - BASE_START_MIN) / 60 + 1 }).map((_, i) => {
            const hour = 8 + i;
            const top = i * 60 * PIXELS_PER_MIN;
            return (
              <div
                key={hour}
                className="absolute text-xs text-gray-500"
                style={{ top: `${top}px`, height: `${60 * PIXELS_PER_MIN}px` }}
              >
                <div className="flex items-start h-full border-t border-gray-200 pt-1">{hour}:00</div>
              </div>
            );
          })}
        </div>

        {/* Konten jadwal */}
        <div className="relative flex-1" style={{ height: `${totalHeight}px` }}>
          {/* Garis bantu */}
          {Array.from({ length: (BASE_END_MIN - BASE_START_MIN) / 60 + 1 }).map((_, i) => {
            const top = i * 60 * PIXELS_PER_MIN;
            return (
              <div
                key={i}
                className="absolute left-0 w-full border-t border-dashed border-gray-200"
                style={{ top: `${top}px` }}
              />
            );
          })}

          {/* Event */}
          {dummySchedule.map((item, idx) => {
            const [startStr, endStr] = item.time.split(" - ");
            const startMin = parseTimeToMinutes(startStr);
            const endMin = parseTimeToMinutes(endStr);
            const top = (startMin - BASE_START_MIN) * PIXELS_PER_MIN;
            const height = (endMin - startMin) * PIXELS_PER_MIN;

            let leftOffset = 0;
            for (const prev of placedEvents) {
              const overlap = startMin < prev.end && endMin > prev.start;
              if (overlap) {
                leftOffset = Math.max(leftOffset, prev.left + 160);
              }
            }
            placedEvents.push({ start: startMin, end: endMin, left: leftOffset });

            return (
              <div
                key={idx}
                className={`absolute rounded-lg shadow-md p-2 text-sm ${item.color}`}
                style={{
                  top: `${top}px`,
                  left: `${leftOffset}px`,
                  height: `${height}px`,
                  width: "250px",
                }}
              >
                <div className="font-semibold truncate">{item.title}</div>
                <div className="text-xs">{item.mode} - {item.room}</div>
                <div className="text-xs text-gray-600">{item.time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
