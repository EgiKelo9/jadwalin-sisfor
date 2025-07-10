export default function Calendar() {
  return (
    <div className="bg-white rounded-lg p-4 w-72">
      <h2 className="text-lg font-semibold mb-2">Kalender</h2>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <div key={d} className="font-medium">{d}</div>
        ))}
        {Array.from({ length: 31 }, (_, i) => (
          <div
            key={i}
            className={`p-1 rounded-full ${
              i + 1 === 27 ? "bg-teal-500 text-white" : ""
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
