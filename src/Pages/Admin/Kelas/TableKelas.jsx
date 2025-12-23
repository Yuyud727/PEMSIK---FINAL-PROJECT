import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import Button from "@/Pages/Layouts/Components/Button";

const TableKelas = ({
  data = [],
  isLoading = false,
  onEdit,
  onDelete,
  onDetail,
  getMataKuliahName,
  getMataKuliahSks,
  getDosenName,
  getMahasiswaCount,
  pagination,
}) => {
  const { user } = useAuthStateContext();

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-500">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Search Input */}
      {pagination && (
        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Cari kelas..."
            value={pagination.search}
            onChange={(e) => {
              pagination.setSearch(e.target.value);
              pagination.setPage(1);
            }}
            className="px-3 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Per halaman:</label>
            <select
              value={pagination.perPage}
              onChange={(e) => {
                pagination.setPerPage(Number(e.target.value));
                pagination.setPage(1);
              }}
              className="px-2 py-1 border rounded-md"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      )}

      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">No</th>
            <th
              className="py-2 px-4 text-left cursor-pointer hover:bg-blue-700"
              onClick={() => {
                if (pagination) {
                  pagination.setSort("mata_kuliah_id");
                  pagination.setOrder(pagination.order === "asc" ? "desc" : "asc");
                }
              }}
            >
              Mata Kuliah{" "}
              {pagination?.sort === "mata_kuliah_id" &&
                (pagination.order === "asc" ? "↑" : "↓")}
            </th>
            <th className="py-2 px-4 text-center">SKS</th>
            <th
              className="py-2 px-4 text-left cursor-pointer hover:bg-blue-700"
              onClick={() => {
                if (pagination) {
                  pagination.setSort("dosen_id");
                  pagination.setOrder(pagination.order === "asc" ? "desc" : "asc");
                }
              }}
            >
              Dosen Pengampu{" "}
              {pagination?.sort === "dosen_id" &&
                (pagination.order === "asc" ? "↑" : "↓")}
            </th>
            <th className="py-2 px-4 text-center">Jumlah Mahasiswa</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-8 text-center text-gray-500">
                {pagination?.search
                  ? "Tidak ada data yang cocok dengan pencarian"
                  : "Belum ada data kelas"}
              </td>
            </tr>
          ) : (
            data.map((kelas, index) => {
              const startNumber = pagination
                ? (pagination.page - 1) * pagination.perPage
                : 0;

              return (
                <tr
                  key={kelas.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="py-2 px-4">{startNumber + index + 1}</td>
                  <td className="py-2 px-4">
                    <span className="font-medium">
                      {getMataKuliahName(kelas.mata_kuliah_id)}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                      {getMataKuliahSks(kelas.mata_kuliah_id)} SKS
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {getDosenName(kelas.dosen_id)}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                      {getMahasiswaCount(kelas.mahasiswa_id)} Mahasiswa
                    </span>
                  </td>
                    <td className="py-2 px-4 text-center space-x-2">
                    {onDetail && (
                        <Button size="sm" onClick={() => onDetail(kelas.id)}>
                        Detail
                        </Button>
                    )}

                    {onEdit && (
                        <Button size="sm" variant="warning" onClick={() => onEdit(kelas)}>
                        Edit
                        </Button>
                    )}

                    {onDelete && (
                        <Button size="sm" variant="danger" onClick={() => onDelete(kelas.id)}>
                        Hapus
                        </Button>
                    )}
                    </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableKelas;