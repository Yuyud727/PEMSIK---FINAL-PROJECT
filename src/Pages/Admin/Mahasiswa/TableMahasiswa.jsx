import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import Button from "@/Pages/Layouts/Components/Button";

const TableMahasiswa = ({
  data = [],
  isLoading = false,
  onEdit,
  onDelete,
  onDetail,
  getTotalSks,
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
            placeholder="Cari NIM atau Nama..."
            value={pagination.search}
            onChange={(e) => {
              pagination.setSearch(e.target.value);
              pagination.setPage(1); // Reset ke halaman 1 saat search
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
                  pagination.setSort("nim");
                  pagination.setOrder(pagination.order === "asc" ? "desc" : "asc");
                }
              }}
            >
              NIM {pagination?.sort === "nim" && (pagination.order === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-4 text-left cursor-pointer hover:bg-blue-700"
              onClick={() => {
                if (pagination) {
                  pagination.setSort("nama");
                  pagination.setOrder(pagination.order === "asc" ? "desc" : "asc");
                }
              }}
            >
              Nama {pagination?.sort === "nama" && (pagination.order === "asc" ? "↑" : "↓")}
            </th>
            <th className="py-2 px-4 text-center">Max SKS</th>
            <th className="py-2 px-4 text-center">SKS Terpakai</th>
            <th className="py-2 px-4 text-center">Status</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-8 text-center text-gray-500">
                {pagination?.search
                  ? "Tidak ada data yang cocok dengan pencarian"
                  : "Belum ada data mahasiswa"}
              </td>
            </tr>
          ) : (
            data.map((mhs, index) => {
              const totalSks = getTotalSks ? getTotalSks(mhs.id) : 0;
              const isOverLimit = totalSks > (mhs.max_sks || 0);
              const startNumber = pagination ? (pagination.page - 1) * pagination.perPage : 0;

              return (
                <tr
                  key={mhs.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="py-2 px-4">{startNumber + index + 1}</td>
                  <td className="py-2 px-4 font-mono">{mhs.nim}</td>
                  <td className="py-2 px-4">{mhs.nama}</td>
                  <td className="py-2 px-4 text-center">
                    <span className="font-medium">{mhs.max_sks || "-"}</span>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span
                      className={`font-medium ${
                        isOverLimit ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {totalSks}
                    </span>
                    {isOverLimit && (
                      <span className="ml-1 text-red-500" title="Melebihi batas SKS">
                        ⚠️
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        mhs.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {mhs.status ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center space-x-2">
                    {onDetail && (
                      <Button size="sm" onClick={() => onDetail(mhs.id)}>
                        Detail
                      </Button>
                    )}

                    {onEdit && (
                      <Button size="sm" variant="warning" onClick={() => onEdit(mhs)}>
                        Edit
                      </Button>
                    )}

                    {onDelete && (
                      <Button size="sm" variant="danger" onClick={() => onDelete(mhs.id)}>
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

export default TableMahasiswa;