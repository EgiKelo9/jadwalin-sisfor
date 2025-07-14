import collections
import json
from ortools.sat.python import cp_model

# Definisi namedtuple
MataKuliah = collections.namedtuple('MataKuliah', 'id kode nama bobot_sks kapasitas semester status jenis dosen_id')
RuangKelas = collections.namedtuple('RuangKelas', 'id nama gedung lantai kapasitas status')

# Data mata kuliah dengan format tuple collection
mata_kuliah_list = [
    MataKuliah(1, "MK-230001", "Pancasila - A", 2, 24, 1, "aktif", "wajib", 1),
    MataKuliah(2, "MK-230002", "Pancasila - B", 2, 24, 1, "aktif", "wajib", 1),
    MataKuliah(3, "MK-230003", "Pancasila - C", 2, 24, 1, "aktif", "wajib", 1),
    MataKuliah(4, "MK-230004", "Pancasila - D", 2, 24, 1, "aktif", "wajib", 1),
    MataKuliah(5, "MK-230005", "Pancasila - E", 2, 24, 1, "aktif", "wajib", 1),
    MataKuliah(6, "MK-230006", "Pancasila - F", 2, 24, 1, "aktif", "wajib", 1),
    MataKuliah(7, "MK-230007", "Pendidikan Agama Hindu - A", 2, 24, 1, "nonaktif", "wajib", 2),
    MataKuliah(8, "MK-230008", "Pendidikan Agama Hindu - B", 2, 24, 1, "nonaktif", "wajib", 2),
    MataKuliah(9, "MK-230009", "Pendidikan Agama Hindu - C", 2, 24, 1, "nonaktif", "wajib", 2),
    MataKuliah(10, "MK-230010", "Pendidikan Agama Islam - A", 2, 24, 1, "nonaktif", "wajib", 3),
    MataKuliah(11, "MK-230011", "Pendidikan Agama Katolik - A", 2, 24, 1, "nonaktif", "wajib", 4),
    MataKuliah(12, "MK-230012", "Pendidikan Agama Protestan - A", 2, 24, 1, "nonaktif", "wajib", 5),
    MataKuliah(13, "MK-230013", "Pendidikan Agama Buddha - A", 2, 24, 1, "nonaktif", "wajib", 6),
    MataKuliah(14, "MK-230014", "Pendidikan Agama Konghuchu - A", 2, 24, 1, "nonaktif", "wajib", 7),
    MataKuliah(15, "MK-230015", "Matematika Diskrit II - A", 2, 24, 2, "aktif", "wajib", 8),
    MataKuliah(16, "MK-230016", "Matematika Diskrit II - B", 2, 24, 2, "aktif", "wajib", 8),
    MataKuliah(17, "MK-230017", "Matematika Diskrit II - C", 2, 24, 2, "aktif", "wajib", 8),
    MataKuliah(18, "MK-230018", "Matematika Diskrit II - D", 2, 24, 2, "aktif", "wajib", 8),
    MataKuliah(19, "MK-230019", "Matematika Diskrit II - E", 2, 24, 2, "aktif", "wajib", 8),
    MataKuliah(20, "MK-230020", "Matematika Diskrit II - F", 2, 24, 2, "aktif", "wajib", 8),
    MataKuliah(21, "MK-230021", "Struktur Data - A", 3, 24, 2, "aktif", "wajib", 9),
    MataKuliah(22, "MK-230022", "Struktur Data - B", 3, 24, 2, "aktif", "wajib", 9),
    MataKuliah(23, "MK-230023", "Struktur Data - C", 3, 24, 2, "aktif", "wajib", 9),
    MataKuliah(24, "MK-230024", "Struktur Data - D", 3, 24, 2, "aktif", "wajib", 9),
    MataKuliah(25, "MK-230025", "Struktur Data - E", 3, 24, 2, "aktif", "wajib", 10),
    MataKuliah(26, "MK-230026", "Struktur Data - F", 3, 24, 2, "aktif", "wajib", 10),
    MataKuliah(27, "MK-230027", "Sistem Operasi - A", 3, 24, 3, "aktif", "wajib", 11),
    MataKuliah(28, "MK-230028", "Sistem Operasi - B", 3, 24, 3, "aktif", "wajib", 11),
    MataKuliah(29, "MK-230029", "Sistem Operasi - C", 3, 24, 3, "aktif", "wajib", 12),
    MataKuliah(30, "MK-230030", "Sistem Operasi - D", 3, 24, 3, "aktif", "wajib", 12),
    MataKuliah(31, "MK-230031", "Sistem Operasi - E", 3, 24, 3, "aktif", "wajib", 13),
    MataKuliah(32, "MK-230032", "Sistem Operasi - F", 3, 24, 3, "aktif", "wajib", 13),
    MataKuliah(33, "MK-230033", "Pengantar Probabilitas - A", 2, 24, 3, "aktif", "wajib", 14),
    MataKuliah(34, "MK-230034", "Pengantar Probabilitas - B", 2, 24, 3, "aktif", "wajib", 14),
    MataKuliah(35, "MK-230035", "Pengantar Probabilitas - C", 2, 24, 3, "aktif", "wajib", 14),
    MataKuliah(36, "MK-230036", "Pengantar Probabilitas - D", 2, 24, 3, "aktif", "wajib", 14),
    MataKuliah(37, "MK-230037", "Pengantar Probabilitas - E", 2, 24, 3, "aktif", "wajib", 14),
    MataKuliah(38, "MK-230038", "Pengantar Probabilitas - F", 2, 24, 3, "aktif", "wajib", 14),
    MataKuliah(39, "MK-230039", "Organisasi dan Arsitektur Komputer - A", 3, 24, 3, "aktif", "wajib", 15),
    MataKuliah(40, "MK-230040", "Organisasi dan Arsitektur Komputer - B", 3, 24, 3, "aktif", "wajib", 15),
    MataKuliah(41, "MK-230041", "Organisasi dan Arsitektur Komputer - C", 3, 24, 3, "aktif", "wajib", 15),
    MataKuliah(42, "MK-230042", "Organisasi dan Arsitektur Komputer - D", 3, 24, 3, "aktif", "wajib", 15),
    MataKuliah(43, "MK-230043", "Organisasi dan Arsitektur Komputer - E", 3, 24, 3, "aktif", "wajib", 16),
    MataKuliah(44, "MK-230044", "Organisasi dan Arsitektur Komputer - F", 3, 24, 3, "aktif", "wajib", 16),
    MataKuliah(45, "MK-230045", "Kewirausahaan - A", 2, 24, 4, "aktif", "wajib", 17),
    MataKuliah(46, "MK-230046", "Kewirausahaan - B", 2, 24, 4, "aktif", "wajib", 17),
    MataKuliah(47, "MK-230047", "Kewirausahaan - C", 2, 24, 4, "aktif", "wajib", 17),
    MataKuliah(48, "MK-230048", "Kewirausahaan - D", 2, 24, 4, "aktif", "wajib", 17),
    MataKuliah(49, "MK-230049", "Kewirausahaan - E", 2, 24, 4, "aktif", "wajib", 17),
    MataKuliah(50, "MK-230050", "Kewirausahaan - F", 2, 24, 4, "aktif", "wajib", 17),
    MataKuliah(51, "MK-230051", "Tata Tulis Karya Ilmiah - A", 2, 24, 5, "aktif", "wajib", 18),
    MataKuliah(52, "MK-230052", "Tata Tulis Karya Ilmiah - B", 2, 24, 5, "aktif", "wajib", 18),
    MataKuliah(53, "MK-230053", "Tata Tulis Karya Ilmiah - C", 2, 24, 5, "aktif", "wajib", 18),
    MataKuliah(54, "MK-230054", "Tata Tulis Karya Ilmiah - D", 2, 24, 5, "aktif", "wajib", 18),
    MataKuliah(55, "MK-230055", "Tata Tulis Karya Ilmiah - E", 2, 24, 5, "aktif", "wajib", 18),
    MataKuliah(56, "MK-230056", "Tata Tulis Karya Ilmiah - F", 2, 24, 5, "aktif", "wajib", 18),
    MataKuliah(57, "MK-230057", "Metode Penelitian - A", 2, 24, 6, "aktif", "wajib", 19),
    MataKuliah(58, "MK-230058", "Metode Penelitian - B", 2, 24, 6, "aktif", "wajib", 19),
    MataKuliah(59, "MK-230059", "Metode Penelitian - C", 2, 24, 6, "aktif", "wajib", 19),
    MataKuliah(60, "MK-230060", "Metode Penelitian - D", 2, 24, 6, "aktif", "wajib", 19),
    MataKuliah(61, "MK-230061", "Metode Penelitian - E", 2, 24, 6, "aktif", "wajib", 16),
    MataKuliah(62, "MK-230062", "Metode Penelitian - F", 2, 24, 6, "aktif", "wajib", 16),
    MataKuliah(63, "MK-230063", "Analisis dan Desain Sistem - A", 3, 24, 4, "aktif", "wajib", 20),
    MataKuliah(64, "MK-230064", "Analisis dan Desain Sistem - B", 3, 24, 4, "aktif", "wajib", 20),
    MataKuliah(65, "MK-230065", "Analisis dan Desain Sistem - C", 3, 24, 4, "aktif", "wajib", 21),
    MataKuliah(66, "MK-230066", "Analisis dan Desain Sistem - D", 3, 24, 4, "aktif", "wajib", 21),
    MataKuliah(67, "MK-230067", "Analisis dan Desain Sistem - E", 3, 24, 4, "aktif", "wajib", 22),
    MataKuliah(68, "MK-230068", "Analisis dan Desain Sistem - F", 3, 24, 4, "aktif", "wajib", 22),
    MataKuliah(69, "MK-230069", "Pengantar Kecerdasan Buatan - A", 3, 24, 5, "aktif", "wajib", 19),
    MataKuliah(70, "MK-230070", "Pengantar Kecerdasan Buatan - B", 3, 24, 5, "aktif", "wajib", 19),
    MataKuliah(71, "MK-230071", "Pengantar Kecerdasan Buatan - C", 3, 24, 5, "aktif", "wajib", 16),
    MataKuliah(72, "MK-230072", "Pengantar Kecerdasan Buatan - D", 3, 24, 5, "aktif", "wajib", 16),
    MataKuliah(73, "MK-230073", "Pengantar Kecerdasan Buatan - E", 3, 24, 5, "aktif", "wajib", 23),
    MataKuliah(74, "MK-230074", "Pengantar Kecerdasan Buatan - F", 3, 24, 5, "aktif", "wajib", 23),
    MataKuliah(75, "MK-230075", "Sistem Informasi - A", 3, 24, 4, "aktif", "wajib", 12),
    MataKuliah(76, "MK-230076", "Sistem Informasi - B", 3, 24, 4, "aktif", "wajib", 12),
    MataKuliah(77, "MK-230077", "Sistem Informasi - C", 3, 24, 4, "aktif", "wajib", 12),
    MataKuliah(78, "MK-230078", "Sistem Informasi - D", 3, 24, 4, "aktif", "wajib", 12),
    MataKuliah(79, "MK-230079", "Sistem Informasi - E", 3, 24, 4, "aktif", "wajib", 24),
    MataKuliah(80, "MK-230080", "Sistem Informasi - F", 3, 24, 4, "aktif", "wajib", 24),
    MataKuliah(81, "MK-230081", "Pengantar Pemrosesan Data Multimedia - A", 3, 24, 5, "aktif", "pilihan", 25),
    MataKuliah(82, "MK-230082", "Pengantar Pemrosesan Data Multimedia - B", 3, 24, 5, "aktif", "pilihan", 25),
    MataKuliah(83, "MK-230083", "Pengantar Pemrosesan Data Multimedia - C", 3, 24, 5, "aktif", "pilihan", 25),
    MataKuliah(84, "MK-230084", "Pengantar Pemrosesan Data Multimedia - D", 3, 24, 5, "aktif", "pilihan", 25),
    MataKuliah(85, "MK-230085", "Pengantar Pemrosesan Data Multimedia - E", 3, 24, 5, "aktif", "pilihan", 26),
    MataKuliah(86, "MK-230086", "Pengantar Pemrosesan Data Multimedia - F", 3, 24, 5, "aktif", "pilihan", 26),
    MataKuliah(87, "MK-230087", "Keamanan Jaringan - A", 3, 24, 6, "aktif", "pilihan", 27),
    MataKuliah(88, "MK-230088", "Keamanan Jaringan - B", 3, 24, 6, "aktif", "pilihan", 27),
    MataKuliah(89, "MK-230089", "Keamanan Jaringan - C", 3, 24, 6, "aktif", "pilihan", 27),
    MataKuliah(90, "MK-230090", "Keamanan Jaringan - D", 3, 24, 6, "aktif", "pilihan", 27),
    MataKuliah(91, "MK-230091", "Keamanan Jaringan - E", 3, 24, 6, "aktif", "pilihan", 28),
    MataKuliah(92, "MK-230092", "Keamanan Jaringan - F", 3, 24, 6, "aktif", "pilihan", 28),
    MataKuliah(93, "MK-230093", "Pemrograman Berbasis Web - A", 3, 24, 5, "aktif", "pilihan", 21),
    MataKuliah(94, "MK-230094", "Pemrograman Berbasis Web - B", 3, 24, 5, "aktif", "pilihan", 21),
    MataKuliah(95, "MK-230095", "Pemrograman Berbasis Web - C", 3, 24, 5, "aktif", "pilihan", 28),
    MataKuliah(96, "MK-230096", "Pemrograman Berbasis Web - D", 3, 24, 5, "aktif", "pilihan", 28),
    MataKuliah(97, "MK-230097", "Pemrograman Berbasis Web - E", 3, 24, 5, "aktif", "pilihan", 29),
    MataKuliah(98, "MK-230098", "Pemrograman Berbasis Web - F", 3, 24, 5, "aktif", "pilihan", 29),
    MataKuliah(99, "MK-230099", "Siklus Hidup Proyek Kecerdasan Buatan - A", 2, 24, 6, "nonaktif", "pilihan", 10),
    MataKuliah(100, "MK-230100", "Siklus Hidup Proyek Kecerdasan Buatan - B", 2, 24, 6, "nonaktif", "pilihan", 10),
    MataKuliah(101, "MK-230101", "Siklus Hidup Proyek Kecerdasan Buatan - C", 2, 24, 6, "nonaktif", "pilihan", 20),
    MataKuliah(102, "MK-230102", "Siklus Hidup Proyek Kecerdasan Buatan - D", 2, 24, 6, "nonaktif", "pilihan", 20),
    MataKuliah(103, "MK-230103", "Siklus Hidup Proyek Kecerdasan Buatan - E", 2, 24, 6, "nonaktif", "pilihan", 20),
    MataKuliah(104, "MK-230104", "Siklus Hidup Proyek Kecerdasan Buatan - F", 2, 24, 6, "nonaktif", "pilihan", 10),
    MataKuliah(105, "MK-230105", "Pengantar Deep Learning - A", 3, 24, 7, "nonaktif", "pilihan", 13),
    MataKuliah(106, "MK-230106", "Pengantar Deep Learning - B", 3, 24, 7, "nonaktif", "pilihan", 13),
    MataKuliah(107, "MK-230107", "Pengantar Deep Learning - C", 3, 24, 7, "nonaktif", "pilihan", 13),
    MataKuliah(108, "MK-230108", "Pengantar Deep Learning - D", 3, 24, 7, "nonaktif", "pilihan", 22),
    MataKuliah(109, "MK-230109", "Pengantar Deep Learning - E", 3, 24, 7, "nonaktif", "pilihan", 22),
    MataKuliah(110, "MK-230110", "Pengantar Deep Learning - F", 3, 24, 7, "nonaktif", "pilihan", 22),
    MataKuliah(111, "MK-230111", "Pemrosesan Data Tekstual pada Web - A", 3, 24, 7, "nonaktif", "pilihan", 26),
    MataKuliah(112, "MK-230112", "NoSQL Basis Data Grafik - A", 3, 24, 7, "nonaktif", "pilihan", 23),
    MataKuliah(113, "MK-230113", "Intelijen Bisnis dan Analisis - A", 3, 24, 7, "nonaktif", "pilihan", 11),
    MataKuliah(114, "MK-230114", "Manajemen Data dan Informasi - A", 3, 24, 7, "nonaktif", "pilihan", 24),
    MataKuliah(115, "MK-230115", "Sistem Temu Kembali Informasi Musik - A", 3, 24, 7, "nonaktif", "pilihan", 22),
    MataKuliah(116, "MK-230116", "Sintesis Bunyi - A", 3, 24, 7, "nonaktif", "pilihan", 22),
    MataKuliah(117, "MK-230117", "Kompresi Data Multimedia - A", 3, 24, 7, "nonaktif", "pilihan", 27),
    MataKuliah(118, "MK-230118", "Jaringan Multimedia - A", 3, 24, 7, "nonaktif", "pilihan", 13),
    MataKuliah(119, "MK-230119", "Forensik Digital - A", 3, 24, 7, "nonaktif", "pilihan", 11),
    MataKuliah(120, "MK-230120", "Kriptoanalisis - A", 3, 24, 7, "nonaktif", "pilihan", 26),
    MataKuliah(121, "MK-230121", "Pemrosesan Dalam Jaringan - A", 3, 24, 7, "nonaktif", "pilihan", 24),
    MataKuliah(122, "MK-230122", "Keamanan Jaringan Sensor - A", 3, 24, 7, "nonaktif", "pilihan", 27),
    MataKuliah(123, "MK-230123", "Analisis dan Pengolahan Data Digital - A", 3, 24, 7, "nonaktif", "pilihan", 10),
    MataKuliah(124, "MK-230124", "Metode Penalaran - A", 3, 24, 7, "nonaktif", "pilihan", 10),
    MataKuliah(125, "MK-230125", "Pemrograman Berbasis Mobile - A", 3, 24, 7, "nonaktif", "pilihan", 29),
    MataKuliah(126, "MK-230126", "Gedung Data dan Basis Data Terdistribusi - A", 3, 24, 7, "nonaktif", "pilihan", 29),
    MataKuliah(127, "MK-230127", "Perancangan Interaksi - A", 3, 24, 7, "nonaktif", "pilihan", 11),
    MataKuliah(128, "MK-230128", "Pemrograman Sistem Interaktif - A", 3, 24, 7, "nonaktif", "pilihan", 23),
]

# Data ruang kelas dengan format tuple collection
ruang_list = [
    RuangKelas(1, "ruang 1.1", "dekanat", 1, 24, "layak"),
    RuangKelas(2, "ruang 1.2", "dekanat", 1, 24, "layak"),
    RuangKelas(3, "ruang 1.3", "dekanat", 1, 24, "layak"),
    RuangKelas(4, "ruang 1.4", "dekanat", 1, 24, "layak"),
    RuangKelas(5, "ruang 2.1", "dekanat", 2, 24, "layak"),
    RuangKelas(6, "ruang 2.2", "dekanat", 2, 24, "layak"),
    RuangKelas(7, "ruang 2.3", "dekanat", 2, 24, "layak"),
    RuangKelas(8, "ruang 2.4", "dekanat", 2, 48, "layak"),
    RuangKelas(9, "ruang 2.5", "dekanat", 2, 24, "layak"),
    RuangKelas(10, "ruang 3.1", "dekanat", 3, 24, "layak"),
    RuangKelas(11, "ruang 3.2", "dekanat", 3, 24, "layak"),
    RuangKelas(12, "ruang 3.3", "dekanat", 3, 24, "layak"),
    RuangKelas(13, "labkom 1", "dekanat", 1, 72, "layak"),
    RuangKelas(14, "labkom 2", "dekanat", 1, 72, "layak"),
    RuangKelas(15, "ruang 1.1", "bg", 1, 48, "layak"),
    RuangKelas(16, "ruang 1.2", "bg", 1, 48, "layak"),
    RuangKelas(17, "ruang a.12", "lecture building", 1, 48, "layak"),
]

HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]
START_HOUR = 8
END_HOUR = 16
SLOT_DURATION_MINUTES = 10
SLOTS_PER_SKS = 50 // SLOT_DURATION_MINUTES
SLOTS_PER_DAY = ((END_HOUR - START_HOUR) * 60) // SLOT_DURATION_MINUTES
TOTAL_SLOTS = len(HARI) * SLOTS_PER_DAY

def get_kelas_rpartition(nama_mata_kuliah):
    before, separator, after = nama_mata_kuliah.rpartition(" - ")
    if separator:
        return after
    return None

def buat_jadwal():
    model = cp_model.CpModel()

    mata_kuliah_aktif = [mk for mk in mata_kuliah_list if mk.status == "aktif"]
    ruang_layak = [rk for rk in ruang_list if rk.status == "layak"]

    jadwal_vars = {}
    for mk in mata_kuliah_aktif:
        duration = mk.bobot_sks * SLOTS_PER_SKS
        start_var = model.NewIntVar(0, TOTAL_SLOTS - duration, f'start_{mk.id}')
        end_var = model.NewIntVar(0, TOTAL_SLOTS, f'end_{mk.id}')
        interval_var = model.NewIntervalVar(start_var, duration, end_var, f'interval_{mk.id}')
        ruang_var = model.NewIntVar(0, len(ruang_layak) - 1, f'ruang_{mk.id}')
        
        jadwal_vars[mk.id] = {
            'start': start_var, 'end': end_var, 'interval': interval_var, 
            'ruang': ruang_var, 'mk_obj': mk
        }

    for i, ruang in enumerate(ruang_layak):
        intervals_di_ruang = []
        for vars in jadwal_vars.values():
            is_in_room = model.NewBoolVar(f'is_in_{vars["mk_obj"].id}_ruang_{i}')
            model.Add(vars['ruang'] == i).OnlyEnforceIf(is_in_room)
            model.Add(vars['ruang'] != i).OnlyEnforceIf(is_in_room.Not())
            intervals_di_ruang.append(
                model.NewOptionalIntervalVar(vars['start'], vars['mk_obj'].bobot_sks * SLOTS_PER_SKS, vars['end'], is_in_room, f'opt_interval_{vars["mk_obj"].id}_{i}')
            )
        model.AddNoOverlap(intervals_di_ruang)

    dosen_intervals = collections.defaultdict(list)
    kelas_intervals = collections.defaultdict(list)
    for vars in jadwal_vars.values():
        dosen_intervals[vars['mk_obj'].dosen_id].append(vars['interval'])
        kelas = get_kelas_rpartition(vars['mk_obj'].nama)
        if kelas:
            kelas_intervals[kelas].append(vars['interval'])
    
    for intervals in dosen_intervals.values():
        if len(intervals) > 1: 
            model.AddNoOverlap(intervals)
    
    for intervals in kelas_intervals.values():
        if len(intervals) > 1: 
            model.AddNoOverlap(intervals)
            
    for vars in jadwal_vars.values():
        duration = vars['mk_obj'].bobot_sks * SLOTS_PER_SKS
        start_day = model.NewIntVar(0, len(HARI)-1, f'start_day_{vars["mk_obj"].id}')
        end_day = model.NewIntVar(0, len(HARI)-1, f'end_day_{vars["mk_obj"].id}')
        model.AddDivisionEquality(start_day, vars['start'], SLOTS_PER_DAY)
        model.AddDivisionEquality(end_day, vars['start'] + duration - 1, SLOTS_PER_DAY)
        model.Add(start_day == end_day)

    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 720.0
    status = solver.Solve(model)
    
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print("Jadwal berhasil dibuat dan disimpan ke jadwal.json")
        
        sorted_mk = sorted(mata_kuliah_aktif, key=lambda x: solver.Value(jadwal_vars[x.id]['start']))
        
        jadwal_data = []
        
        for idx, mk in enumerate(sorted_mk, 1):
            vars = jadwal_vars[mk.id]
            start_val = solver.Value(vars['start'])
            ruang_idx = solver.Value(vars['ruang'])
            
            day_idx = start_val // SLOTS_PER_DAY
            slot_in_day = start_val % SLOTS_PER_DAY
            
            start_hour = START_HOUR + (slot_in_day * SLOT_DURATION_MINUTES) // 60
            start_min = (slot_in_day * SLOT_DURATION_MINUTES) % 60
            
            duration_min = mk.bobot_sks * 50
            end_time_min_from_start = start_min + duration_min
            end_hour = start_hour + end_time_min_from_start // 60
            end_min = end_time_min_from_start % 60
            
            jam_mulai = f"{start_hour:02d}:{start_min:02d}"
            jam_selesai = f"{end_hour:02d}:{end_min:02d}"
            
            jadwal_data.append({
                "id": idx,
                "mata_kuliah_id": mk.id,
                "ruang_kelas_id": ruang_layak[ruang_idx].id,
                "hari": HARI[day_idx],
                "jam_mulai": jam_mulai,
                "jam_selesai": jam_selesai
            })
        
        with open('jadwal.json', 'w', encoding='utf-8') as jsonfile:
            json.dump(jadwal_data, jsonfile, indent=2, ensure_ascii=False)
            
    elif status == cp_model.INFEASIBLE:
        print("Jadwal tidak dapat dibuat. Cek kembali batasan atau jumlah sumber daya.")
    else:
        print("Gagal menemukan solusi dalam batas waktu.")

if __name__ == '__main__':
    buat_jadwal()