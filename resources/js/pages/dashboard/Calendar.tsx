export default function Calendar({
  selectedDate,
  selectedMonthYear,
  setSelectedDate,
}: {
  selectedDate: number;
  selectedMonthYear: string;
  setSelectedDate: (date: number) => void;
}) {
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

  const [monthName, yearStr] = selectedMonthYear.split(" ");
  const year = parseInt(yearStr, 10);
  const monthIndex = months.findIndex((m) => m === monthName);
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();

  return (
    <div className="bg-white rounded-lg p-4 w-72">
      <h2 className="text-lg font-semibold mb-2">Kalender</h2>

      {/* Header bulan dan tahun */}
      <div className="flex justify-center items-center mb-2 gap-2">
        {/* Optional: Tombol navigasi */}
        {/* <button className="text-gray-500 hover:text-gray-700">&lt;</button> */}
        <div className="text-base font-medium">
          {monthName} {year}
        </div>
        {/* <button className="text-gray-500 hover:text-gray-700">&gt;</button> */}
      </div>

      {/* Hari */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <div key={d} className="font-medium">{d}</div>
        ))}

        {Array.from({ length: lastDay }, (_, i) => (
          <div
            key={i}
            onClick={() => setSelectedDate(i + 1)}
            className={`p-1 cursor-pointer rounded-full ${
              i + 1 === selectedDate
                ? "bg-teal-500 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
