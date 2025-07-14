import collections
import json
import sys
from ortools.sat.python import cp_model

# Definisi namedtuple
MataKuliah = collections.namedtuple('MataKuliah', 'id kode nama bobot_sks kapasitas semester status jenis dosen_id')
RuangKelas = collections.namedtuple('RuangKelas', 'id nama gedung lantai kapasitas status')

HARI = ["senin", "selasa", "rabu", "kamis", "jumat"]
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

def load_data_from_json(mata_kuliah_json, ruang_json):
    """Load data from JSON input (from Laravel database)"""
    mata_kuliah_list = []
    ruang_list = []
    
    # Convert JSON mata kuliah to namedtuple
    for mk_data in mata_kuliah_json:
        mata_kuliah = MataKuliah(
            id=mk_data['id'],
            kode=mk_data['kode'],
            nama=mk_data['nama'],
            bobot_sks=mk_data['bobot_sks'],
            kapasitas=mk_data['kapasitas'],
            semester=mk_data['semester'],
            status=mk_data['status'],
            jenis=mk_data['jenis'],
            dosen_id=mk_data['dosen_id']
        )
        mata_kuliah_list.append(mata_kuliah)
    
    # Convert JSON ruang to namedtuple
    for ruang_data in ruang_json:
        ruang = RuangKelas(
            id=ruang_data['id'],
            nama=ruang_data['nama'],
            gedung=ruang_data['gedung'],
            lantai=ruang_data['lantai'],
            kapasitas=ruang_data['kapasitas'],
            status=ruang_data['status']
        )
        ruang_list.append(ruang)
    
    return mata_kuliah_list, ruang_list

def buat_jadwal_from_json(input_data):
    """Generate schedule from JSON input data"""
    try:
        # Parse input data
        mata_kuliah_json = input_data.get('mata_kuliah', [])
        ruang_json = input_data.get('ruang_kelas', [])
        
        # Load data
        mata_kuliah_list, ruang_list = load_data_from_json(mata_kuliah_json, ruang_json)
        
        model = cp_model.CpModel()

        mata_kuliah_aktif = [mk for mk in mata_kuliah_list if mk.status == "aktif"]
        ruang_layak = [rk for rk in ruang_list if rk.status == "layak"]

        if not mata_kuliah_aktif:
            return {
                "success": False,
                "message": "Tidak ada mata kuliah aktif yang ditemukan",
                "data": []
            }

        if not ruang_layak:
            return {
                "success": False,
                "message": "Tidak ada ruang yang layak ditemukan",
                "data": []
            }

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

        # Room constraints
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

        # Dosen constraints
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
                
        # Same day constraint
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
                    "jam_selesai": jam_selesai,
                    "mata_kuliah": {
                        "id": mk.id,
                        "kode": mk.kode,
                        "nama": mk.nama,
                        "bobot_sks": mk.bobot_sks,
                        "semester": mk.semester,
                        "dosen_id": mk.dosen_id
                    },
                    "ruang_kelas": {
                        "id": ruang_layak[ruang_idx].id,
                        "nama": ruang_layak[ruang_idx].nama,
                        "gedung": ruang_layak[ruang_idx].gedung,
                        "lantai": ruang_layak[ruang_idx].lantai,
                        "kapasitas": ruang_layak[ruang_idx].kapasitas
                    }
                })
            
            return {
                "success": True,
                "message": "Jadwal berhasil dibuat",
                "data": jadwal_data,
                "total_scheduled": len(jadwal_data),
                "total_courses": len(mata_kuliah_aktif)
            }
            
        elif status == cp_model.INFEASIBLE:
            return {
                "success": False,
                "message": "Jadwal tidak dapat dibuat. Cek kembali batasan atau jumlah sumber daya.",
                "data": []
            }
        else:
            return {
                "success": False,
                "message": "Gagal menemukan solusi dalam batas waktu.",
                "data": []
            }
            
    except Exception as e:
        return {
            "success": False,
            "message": f"Error: {str(e)}",
            "data": []
        }

def main():
    """Main function to handle command line input/output"""
    try:
        # Read JSON input from stdin
        input_data = json.loads(sys.stdin.read())
        
        # Generate schedule
        result = buat_jadwal_from_json(input_data)
        
        # Output JSON result
        print(json.dumps(result, ensure_ascii=False, indent=2))
        
    except json.JSONDecodeError as e:
        error_result = {
            "success": False,
            "message": f"Invalid JSON input: {str(e)}",
            "data": []
        }
        print(json.dumps(error_result, ensure_ascii=False, indent=2))
        
    except Exception as e:
        error_result = {
            "success": False,
            "message": f"Unexpected error: {str(e)}",
            "data": []
        }
        print(json.dumps(error_result, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()