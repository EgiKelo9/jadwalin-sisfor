import collections
from ortools.sat.python import cp_model

# --- Data Input ---
MataKuliah = collections.namedtuple('MataKuliah', 'id kode nama dosen sks kelas status')
RuangKelas = collections.namedtuple('RuangKelas', 'id nama kapasitas status')

mata_kuliah_list = [
    (1, "10321901", "Pancasila", "Pak Ari", 2, "A", "Aktif"),
    (2, "10321902", "Pancasila", "Pak Ari", 2, "B", "Aktif"),
    (3, "10321903", "Pancasila", "Pak Ari", 2, "C", "Aktif"),
    (4, "10321904", "Pancasila", "Pak Ari", 2, "D", "Aktif"),
    (5, "10321905", "Pancasila", "Pak Ari", 2, "E", "Aktif"),
    (6, "20321906", "Pancasila", "Pak Ari", 2, "F", "Aktif"),
    (7, "20321901", "Pendidikan Agama Hindu", "Bu Hindu", 2, "A", "Nonaktif"),
    (8, "20321912", "Pendidikan Agama Hindu", "Bu Hindu", 2, "B", "Nonaktif"),
    (9, "20321913", "Pendidikan Agama Hindu", "Bu Hindu", 2, "C", "Nonaktif"),
    (10, "20321914", "Pendidikan Agama Islam", "Bu Islam", 2, "A", "Nonaktif"),
    (11, "20321915", "Pendidikan Agama Katolik", "Bu Katolik", 2, "A", "Nonaktif"),
    (12, "20321916", "Pendidikan Agama Protestan", "Bu Protestan", 2, "A", "Nonaktif"),
    (13, "20321917", "Pendidikan Agama Buddha", "Bu Buddha", 2, "A", "Nonaktif"),
    (14, "20321918", "Pendidikan Agama Konghuchu", "Bu Konghuchu", 2, "A", "Nonaktif"),
    (15, "10321917", "Matematika Diskrit II", "Pak Geda", 2, "A", "Aktif"),
    (16, "10321918", "Matematika Diskrit II", "Pak Geda", 2, "B", "Aktif"),
    (17, "10321919", "Matematika Diskrit II", "Pak Geda", 2, "C", "Aktif"),
    (18, "10321920", "Matematika Diskrit II", "Pak Geda", 2, "D", "Aktif"),
    (19, "10321921", "Matematika Diskrit II", "Pak Geda", 2, "E", "Aktif"),
    (20, "10321922", "Matematika Diskrit II", "Pak Geda", 2, "F", "Aktif"),
    (21, "10321923", "Struktur Data", "Pak Widi", 3, "A", "Aktif"),
    (22, "10321924", "Struktur Data", "Pak Widi", 3, "B", "Aktif"),
    (23, "10321925", "Struktur Data", "Pak Widi", 3, "C", "Aktif"),
    (24, "10321926", "Struktur Data", "Pak Widi", 3, "D", "Aktif"),
    (25, "10321927", "Struktur Data", "Pak Supri", 3, "E", "Aktif"),
    (26, "10321928", "Struktur Data", "Pak Supri", 3, "F", "Aktif"),
    (27, "10321929", "Sistem Operasi", "Pak Degung", 3, "A", "Aktif"),
    (28, "10321930", "Sistem Operasi", "Pak Degung", 3, "B", "Aktif"),
    (29, "10321931", "Sistem Operasi", "Pak Gungde", 3, "C", "Aktif"),
    (30, "10321932", "Sistem Operasi", "Pak Gungde", 3, "D", "Aktif"),
    (31, "10321933", "Sistem Operasi", "Pak Bayu", 3, "E", "Aktif"),
    (32, "10321934", "Sistem Operasi", "Pak Bayu", 3, "F", "Aktif"),
    (33, "10321935", "Pengantar Probabilitas", "Pak Santi", 2, "A", "Aktif"),
    (34, "10321936", "Pengantar Probabilitas", "Pak Santi", 2, "B", "Aktif"),
    (35, "10321937", "Pengantar Probabilitas", "Pak Santi", 2, "C", "Aktif"),
    (36, "10321938", "Pengantar Probabilitas", "Pak Santi", 2, "D", "Aktif"),
    (37, "10321939", "Pengantar Probabilitas", "Pak Santi", 2, "E", "Aktif"),
    (38, "10321940", "Pengantar Probabilitas", "Pak Santi", 2, "F", "Aktif"),
    (39, "10321941", "Organisasi dan Arsitektur Komputer", "Pak Suhar", 3, "A", "Aktif"),
    (40, "10321942", "Organisasi dan Arsitektur Komputer", "Pak Suhar", 3, "B", "Aktif"),
    (41, "10321943", "Organisasi dan Arsitektur Komputer", "Pak Suhar", 3, "C", "Aktif"),
    (42, "10321944", "Organisasi dan Arsitektur Komputer", "Pak Suhar", 3, "D", "Aktif"),
    (43, "10321945", "Organisasi dan Arsitektur Komputer", "Pak Anom", 3, "E", "Aktif"),
    (44, "10321946", "Organisasi dan Arsitektur Komputer", "Pak Anom", 3, "F", "Aktif"),
    (45, "10321947", "Kewirausahaan", "Pak Widhi", 2, "A", "Aktif"),
    (46, "10321948", "Kewirausahaan", "Pak Widhi", 2, "B", "Aktif"),
    (47, "10321949", "Kewirausahaan", "Pak Widhi", 2, "C", "Aktif"),
    (48, "10321950", "Kewirausahaan", "Pak Widhi", 2, "D", "Aktif"),
    (49, "10321951", "Kewirausahaan", "Pak Widhi", 2, "E", "Aktif"),
    (50, "10321952", "Kewirausahaan", "Pak Widhi", 2, "F", "Aktif"),
    (51, "10321953", "Tata Tulis Karya Ilmiah", "Bu Arida", 2, "A", "Aktif"),
    (52, "10321954", "Tata Tulis Karya Ilmiah", "Bu Arida", 2, "B", "Aktif"),
    (53, "10321955", "Tata Tulis Karya Ilmiah", "Bu Arida", 2, "C", "Aktif"),
    (54, "10321956", "Tata Tulis Karya Ilmiah", "Bu Arida", 2, "D", "Aktif"),
    (55, "10321957", "Tata Tulis Karya Ilmiah", "Bu Arida", 2, "E", "Aktif"),
    (56, "10321958", "Tata Tulis Karya Ilmiah", "Bu Arida", 2, "F", "Aktif"),
    (57, "10321959", "Metode Penelitian", "Pak Gussan", 2, "A", "Aktif"),
    (58, "10321960", "Metode Penelitian", "Pak Gussan", 2, "B", "Aktif"),
    (59, "10321961", "Metode Penelitian", "Pak Gussan", 2, "C", "Aktif"),
    (60, "10321962", "Metode Penelitian", "Pak Gussan", 2, "D", "Aktif"),
    (61, "10321963", "Metode Penelitian", "Pak Anom", 2, "E", "Aktif"),
    (62, "10321964", "Metode Penelitian", "Pak Anom", 2, "F", "Aktif"),
    (63, "10321965", "Analisis dan Desain Sistem", "Pak Wika", 3, "A", "Aktif"),
    (64, "10321966", "Analisis dan Desain Sistem", "Pak Wika", 3, "B", "Aktif"),
    (65, "10321967", "Analisis dan Desain Sistem", "Pak Hendra", 3, "C", "Aktif"),
    (66, "10321968", "Analisis dan Desain Sistem", "Pak Hendra", 3, "D", "Aktif"),
    (67, "10321969", "Analisis dan Desain Sistem", "Bu Vida", 3, "E", "Aktif"),
    (68, "10321970", "Analisis dan Desain Sistem", "Bu Vida", 3, "F", "Aktif"),
    (69, "10321971", "Pengantar Kecerdasan Buatan", "Pak Gussan", 3, "A", "Aktif"),
    (70, "10321972", "Pengantar Kecerdasan Buatan", "Pak Gussan", 3, "B", "Aktif"),
    (71, "10321973", "Pengantar Kecerdasan Buatan", "Pak Anom", 3, "C", "Aktif"),
    (72, "10321974", "Pengantar Kecerdasan Buatan", "Pak Anom", 3, "D", "Aktif"),
    (73, "10321975", "Pengantar Kecerdasan Buatan", "Bu Astuti", 3, "E", "Aktif"),
    (74, "10321976", "Pengantar Kecerdasan Buatan", "Bu Astuti", 3, "F", "Aktif"),
    (75, "10321977", "Sistem Informasi", "Pak Gungde", 3, "A", "Aktif"),
    (76, "10321978", "Sistem Informasi", "Pak Gungde", 3, "B", "Aktif"),
    (77, "10321979", "Sistem Informasi", "Pak Gungde", 3, "C", "Aktif"),
    (78, "10321980", "Sistem Informasi", "Pak Gungde", 3, "D", "Aktif"),
    (79, "10321981", "Sistem Informasi", "Pak Cok", 3, "E", "Aktif"),
    (80, "10321982", "Sistem Informasi", "Pak Cok", 3, "F", "Aktif"),
    (81, "10321983", "Pengantar Pemrosesan Data Multimedia", "Bu Eka", 3, "A", "Aktif"),
    (82, "10321984", "Pengantar Pemrosesan Data Multimedia", "Bu Eka", 3, "B", "Aktif"),
    (83, "10321985", "Pengantar Pemrosesan Data Multimedia", "Bu Eka", 3, "C", "Aktif"),
    (84, "10321986", "Pengantar Pemrosesan Data Multimedia", "Bu Eka", 3, "D", "Aktif"),
    (85, "10321987", "Pengantar Pemrosesan Data Multimedia", "Bu Dayu", 3, "E", "Aktif"),
    (86, "10321988", "Pengantar Pemrosesan Data Multimedia", "Bu Dayu", 3, "F", "Aktif"),
    (87, "10321989", "Keamanan Jaringan", "Pak DeArta", 3, "A", "Aktif"),
    (88, "10321990", "Keamanan Jaringan", "Pak DeArta", 3, "B", "Aktif"),
    (89, "10321991", "Keamanan Jaringan", "Pak DeArta", 3, "C", "Aktif"),
    (90, "10321992", "Keamanan Jaringan", "Pak DeArta", 3, "D", "Aktif"),
    (91, "10321993", "Keamanan Jaringan", "Pak Praba", 3, "E", "Aktif"),
    (92, "10321994", "Keamanan Jaringan", "Pak Praba", 3, "F", "Aktif"),
    (93, "10321995", "Pemrograman Berbasis Web", "Pak Hendra", 3, "A", "Aktif"),
    (94, "10321996", "Pemrograman Berbasis Web", "Pak Hendra", 3, "B", "Aktif"),
    (95, "10321997", "Pemrograman Berbasis Web", "Pak Praba", 3, "C", "Aktif"),
    (96, "10321998", "Pemrograman Berbasis Web", "Pak Praba", 3, "D", "Aktif"),
    (97, "10321999", "Pemrograman Berbasis Web", "Pak Surya", 3, "E", "Aktif"),
    (98, "10322000", "Pemrograman Berbasis Web", "Pak Surya", 3, "F", "Aktif"),
    (99, "10322001", "Siklus Hidup Proyek Kecerdasan Buatan", "Pak Supri", 2, "A", "Nonaktif"),
    (100, "10322002", "Siklus Hidup Proyek Kecerdasan Buatan", "Pak Supri", 2, "B", "Nonaktif"),
    (101, "10322003", "Siklus Hidup Proyek Kecerdasan Buatan", "Pak Wika", 2, "C", "Nonaktif"),
    (102, "10322004", "Siklus Hidup Proyek Kecerdasan Buatan", "Pak Wika", 2, "D", "Nonaktif"),
    (103, "10322005", "Siklus Hidup Proyek Kecerdasan Buatan", "Pak Wika", 2, "E", "Nonaktif"),
    (104, "10322006", "Siklus Hidup Proyek Kecerdasan Buatan", "Pak Supri", 2, "F", "Nonaktif"),
    (105, "10322007", "Pengantar Deep Learning", "Pak Bayu", 3, "A", "Nonaktif"),
    (106, "10322008", "Pengantar Deep Learning", "Pak Bayu", 3, "B", "Nonaktif"),
    (107, "10322009", "Pengantar Deep Learning", "Pak Bayu", 3, "C", "Nonaktif"),
    (108, "10322010", "Pengantar Deep Learning", "Bu Vida", 3, "D", "Nonaktif"),
    (109, "10322011", "Pengantar Deep Learning", "Bu Vida", 3, "E", "Nonaktif"),
    (110, "10322012", "Pengantar Deep Learning", "Bu Vida", 3, "F", "Nonaktif"),
    (111, "10322013", "Pemrosesan Data Tekstual pada Web", "Bu Dayu", 3, "A", "Nonaktif"),
    (112, "10322014", "NoSQL Basis Data Grafik", "Bu Astuti", 3, "A", "Nonaktif"),
    (113, "10322015", "Intelijen Bisnis dan Analisis", "Pak Degung", 3, "A", "Nonaktif"),
    (114, "10322016", "Manajemen Data dan Informasi", "Pak Cok", 3, "A", "Nonaktif"),
    (115, "10322017", "Sistem Temu Kembali Informasi Musik", "Bu Vida", 3, "A", "Nonaktif"),
    (116, "10322018", "Sintesis Bunyi", "Bu Vida", 3, "A", "Nonaktif"),
    (117, "10322019", "Kompresi Data Multimedia", "Pak DeArta", 3, "A", "Nonaktif"),
    (118, "10322020", "Jaringan Multimedia", "Pak Bayu", 3, "A", "Nonaktif"),
    (119, "10322021", "Forensik Digital", "Pak Degung", 3, "A", "Nonaktif"),
    (120, "10322022", "Kriptoanalisis", "Bu Dayu", 3, "A", "Nonaktif"),
    (121, "10322023", "Pemrosesan Dalam Jaringan", "Pak Cok", 3, "A", "Nonaktif"),
    (122, "10322024", "Keamanan Jaringan Sensor", "Pak DeArta", 3, "A", "Nonaktif"),
    (123, "10322025", "Analisis dan Pengolahan Data Digital", "Pak Supri", 3, "A", "Nonaktif"),
    (124, "10322026", "Metode Penalaran", "Pak Supri", 3, "A", "Nonaktif"),
    (125, "10322027", "Pemrograman Berbasis Mobile", "Pak Surya", 3, "A", "Nonaktif"),
    (126, "10322028", "Gedung Data dan Basis Data Terdistribusi", "Pak Surya", 3, "A", "Nonaktif"),
    (127, "10322029", "Perancangan Interaksi", "Pak Degung", 3, "A", "Nonaktif"),
    (128, "10322030", "Pemrograman Sistem Interaktif", "Bu Astuti", 3, "A", "Nonaktif"),
]
ruang_list = [
    RuangKelas(1, "Dekanat 1.1", 28, "layak"),
    RuangKelas(2, "Dekanat 1.2", 28, "layak"),
    RuangKelas(3, "Dekanat 1.3", 28, "layak"),
    RuangKelas(4, "Dekanat 1.4", 28, "layak"),
    RuangKelas(5, "Dekanat 2.1", 28, "layak"),
    RuangKelas(6, "Dekanat 2.2", 28, "layak"),
    RuangKelas(7, "Dekanat 2.3", 28, "layak"),
    RuangKelas(8, "Dekanat 2.4", 56, "layak"),
    RuangKelas(9, "Dekanat 2.5", 28, "layak"),
    RuangKelas(10, "Dekanat 3.1", 28, "layak"),
    RuangKelas(11, "Dekanat 3.2", 28, "layak"),
    RuangKelas(12, "Dekanat 3.3", 28, "layak"),
    RuangKelas(13, "Dekanat LabKom 1", 84, "layak"),
    RuangKelas(14, "Dekanat LabKom 2", 84, "layak"),
    RuangKelas(15, "BG 1.1", 56, "layak"),
    RuangKelas(16, "BG 1.2", 56, "layak"),
    RuangKelas(17, "Lecture Building A.12", 56, "layak"),
]

# --- Konfigurasi Waktu ---
HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]
START_HOUR = 8
END_HOUR = 16
SLOT_DURATION_MINUTES = 10
SLOTS_PER_SKS = 50 // SLOT_DURATION_MINUTES
SLOTS_PER_DAY = ((END_HOUR - START_HOUR) * 60) // SLOT_DURATION_MINUTES
TOTAL_SLOTS = len(HARI) * SLOTS_PER_DAY

def buat_jadwal():
    model = cp_model.CpModel()

    # Filter hanya matkul aktif dan ruang layak
    mata_kuliah_aktif = [MataKuliah(*mk) for mk in mata_kuliah_list if mk[-1] == "Aktif"]
    ruang_layak = [rk for rk in ruang_list if rk.status == "layak"]

    # 1. Variabel Keputusan
    jadwal_vars = {}
    for mk in mata_kuliah_aktif:
        duration = mk.sks * SLOTS_PER_SKS
        start_var = model.NewIntVar(0, TOTAL_SLOTS - duration, f'start_{mk.id}')
        end_var = model.NewIntVar(0, TOTAL_SLOTS, f'end_{mk.id}')
        interval_var = model.NewIntervalVar(start_var, duration, end_var, f'interval_{mk.id}')
        ruang_var = model.NewIntVar(0, len(ruang_layak) - 1, f'ruang_{mk.id}')
        
        jadwal_vars[mk.id] = {
            'start': start_var, 'end': end_var, 'interval': interval_var, 
            'ruang': ruang_var, 'mk_obj': mk
        }

    # 2. Batasan (Constraints)
    # Batasan Ruangan: tidak ada jadwal tumpang tindih di ruangan yang sama
    for i, ruang in enumerate(ruang_layak):
        intervals_di_ruang = []
        for vars in jadwal_vars.values():
            is_in_room = model.NewBoolVar(f'is_in_{vars["mk_obj"].id}_ruang_{i}')
            model.Add(vars['ruang'] == i).OnlyEnforceIf(is_in_room)
            model.Add(vars['ruang'] != i).OnlyEnforceIf(is_in_room.Not())
            intervals_di_ruang.append(
                model.NewOptionalIntervalVar(vars['start'], vars['mk_obj'].sks * SLOTS_PER_SKS, vars['end'], is_in_room, f'opt_interval_{vars["mk_obj"].id}_{i}')
            )
        model.AddNoOverlap(intervals_di_ruang)

    # Batasan Dosen & Kelas Mahasiswa
    dosen_intervals = collections.defaultdict(list)
    kelas_intervals = collections.defaultdict(list)
    for vars in jadwal_vars.values():
        dosen_intervals[vars['mk_obj'].dosen].append(vars['interval'])
        kelas_intervals[vars['mk_obj'].kelas].append(vars['interval'])
    
    for intervals in dosen_intervals.values():
        if len(intervals) > 1: model.AddNoOverlap(intervals)
    
    for intervals in kelas_intervals.values():
        if len(intervals) > 1: model.AddNoOverlap(intervals)
            
    # Batasan Jadwal tidak terpotong antar hari
    for vars in jadwal_vars.values():
        duration = vars['mk_obj'].sks * SLOTS_PER_SKS
        start_day = model.NewIntVar(0, len(HARI)-1, f'start_day_{vars["mk_obj"].id}')
        end_day = model.NewIntVar(0, len(HARI)-1, f'end_day_{vars["mk_obj"].id}')
        model.AddDivisionEquality(start_day, vars['start'], SLOTS_PER_DAY)
        model.AddDivisionEquality(end_day, vars['start'] + duration - 1, SLOTS_PER_DAY)
        model.Add(start_day == end_day)

    # 3. Solve & Tampilkan Hasil
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 720.0
    status = solver.Solve(model)
    
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print("Jadwal berhasil dibuat:")
        
        hasil = collections.defaultdict(str)
        sorted_mk = sorted(mata_kuliah_aktif, key=lambda x: solver.Value(jadwal_vars[x.id]['start']))
        
        for mk in sorted_mk:
            vars = jadwal_vars[mk.id]
            start_val = solver.Value(vars['start'])
            ruang_idx = solver.Value(vars['ruang'])
            
            day_idx = start_val // SLOTS_PER_DAY
            slot_in_day = start_val % SLOTS_PER_DAY
            
            start_hour = START_HOUR + (slot_in_day * SLOT_DURATION_MINUTES) // 60
            start_min = (slot_in_day * SLOT_DURATION_MINUTES) % 60
            
            duration_min = mk.sks * 40
            end_time_min_from_start = start_min + duration_min
            end_hour = start_hour + end_time_min_from_start // 60
            end_min = end_time_min_from_start % 60
            
            time_str = f"{start_hour:02d}:{start_min:02d} - {end_hour:02d}:{end_min:02d}"
            ruang_str = ruang_layak[ruang_idx].nama
            
            print(
                f"[{HARI[day_idx]:<6} | {time_str:<13}] "
                f"Ruang: {ruang_str:<22} | "
                f"Kelas: {mk.kelas:<2} | "
                f"Dosen: {mk.dosen:<12} | "
                f"Matkul: {mk.nama}"
            )
            
    elif status == cp_model.INFEASIBLE:
        print("Jadwal tidak dapat dibuat. Cek kembali batasan atau jumlah sumber daya (ruangan/waktu).")
    else:
        print("Gagal menemukan solusi dalam batas waktu.")

if __name__ == '__main__':
    buat_jadwal()
