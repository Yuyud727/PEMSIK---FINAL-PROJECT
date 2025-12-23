import { useParams, useNavigate } from "react-router-dom";
import { useKelasById } from "@/Utils/hooks/useKelas";
import { useMataKuliah } from "@/Utils/hooks/useMataKuliah";
import { useDosen } from "@/Utils/hooks/useDosen";
import { useMahasiswa } from "@/Utils/hooks/useMahasiswa";

const KelasDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch data
  const { data: kelas, isLoading, isError } = useKelasById(id);
  const { data: mataKuliahList = [] } = useMataKuliah();
  const { data: dosenList = [] } = useDosen();
  const { data: mahasiswaList = [] } = useMahasiswa();

  // Helper functions
  const getMataKuliah = (mkId) =>
    mataKuliahList.find((item) => item.id === mkId);

  const getDosen = (dosenId) =>
    dosenList.find((item) => item.id === dosenId);

  const getMahasiswaInKelas = () => {
    if (!kelas?.mahasiswa_id) return [];
    return mahasiswaList.filter((m) => kelas.mahasiswa_id.includes(m.id));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !kelas) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Kelas Tidak Ditemukan
          </h2>
          <p className="text-red-600 mb-4">
            Data kelas dengan ID tersebut tidak ditemukan.
          </p>
          <button
            onClick={() => navigate("/admin/kelas")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            ← Kembali ke Daftar Kelas
          </button>
        </div>
      </div>
    );
  }

  const mataKuliah = getMataKuliah(kelas.mata_kuliah_id);
  const dosen = getDosen(kelas.dosen_id);
  const mahasiswaInKelas = getMahasiswaInKelas();

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/kelas")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
      >
        <span>←</span>
        <span>Kembali ke Daftar Kelas</span>
      </button>

      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm mb-3">
              <span>🏫</span>
              Kelas
            </span>
            <h1 className="text-2xl font-bold mb-2">
              {mataKuliah?.name || "Mata Kuliah"}
            </h1>
            <p className="text-blue-100">
              {mataKuliah?.sks || 0} SKS • {mahasiswaInKelas.length} Mahasiswa
            </p>
          </div>
          <div className="text-6xl">📚</div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Mata Kuliah Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📖</span>
            </div>
            <h3 className="font-semibold text-gray-800">Mata Kuliah</h3>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-800">
              {mataKuliah?.name || "-"}
            </p>
            <p className="text-sm text-gray-500">
              Jumlah SKS: <span className="font-medium">{mataKuliah?.sks || 0} SKS</span>
            </p>
          </div>
        </div>

        {/* Dosen Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">👨‍🏫</span>
            </div>
            <h3 className="font-semibold text-gray-800">Dosen Pengampu</h3>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-800">
              {dosen?.name || "-"}
            </p>
            <p className="text-sm text-gray-500">
              Max SKS: <span className="font-medium">{dosen?.max_sks || 0} SKS</span>
            </p>
          </div>
        </div>
      </div>

      {/* Mahasiswa List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Daftar Mahasiswa</h3>
                <p className="text-sm text-gray-500">
                  {mahasiswaInKelas.length} mahasiswa terdaftar
                </p>
              </div>
            </div>
          </div>
        </div>

        {mahasiswaInKelas.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500">Belum ada mahasiswa terdaftar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    NIM
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Nama Mahasiswa
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Max SKS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mahasiswaInKelas.map((mahasiswa, index) => (
                  <tr
                    key={mahasiswa.id}
                    className="hover:bg-blue-50/50 transition"
                  >
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {mahasiswa.nim}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {mahasiswa.nama}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {mahasiswa.max_sks} SKS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default KelasDetail;