import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import Button from "@/Pages/Layouts/Components/Button";

const TableDosen = ({
  data = [],
  isLoading = false,
  onEdit,
  onDelete,
  onDetail,
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
            placeholder="Cari nama dosen..."
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
                  pagination.setSort("name");
                  pagination.setOrder(pagination.order === "asc" ? "desc" : "asc");
                }
              }}
            >
              Nama {pagination?.sort === "name" && (pagination.order === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="py-2 px-4 text-center cursor-pointer hover:bg-blue-700"
              onClick={() => {
                if (pagination) {
                  pagination.setSort("max_sks");
                  pagination.setOrder(pagination.order === "asc" ? "desc" : "asc");
                }
              }}
            >
              Max SKS {pagination?.sort === "max_sks" && (pagination.order === "asc" ? "↑" : "↓")}
            </th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-8 text-center text-gray-500">
                {pagination?.search
                  ? "Tidak ada data yang cocok dengan pencarian"
                  : "Belum ada data dosen"}
              </td>
            </tr>
          ) : (
            data.map((dsn, index) => {
              const startNumber = pagination ? (pagination.page - 1) * pagination.perPage : 0;

              return (
                <tr
                  key={dsn.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="py-2 px-4">{startNumber + index + 1}</td>
                  <td className="py-2 px-4">{dsn.name}</td>
                  <td className="py-2 px-4 text-center">
                    <span className="font-medium">{dsn.max_sks || "-"}</span>
                  </td>
                  <td className="py-2 px-4 text-center space-x-2">
                    {onDetail && (
                      <Button size="sm" onClick={() => onDetail(dsn.id)}>
                        Detail
                      </Button>
                    )}

                    {onEdit && user?.permission?.includes("dosen.update") && (
                      <Button size="sm" variant="warning" onClick={() => onEdit(dsn)}>
                        Edit
                      </Button>
                    )}

                    {onDelete && user?.permission?.includes("dosen.delete") && (
                      <Button size="sm" variant="danger" onClick={() => onDelete(dsn.id)}>
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

export default TableDosen;