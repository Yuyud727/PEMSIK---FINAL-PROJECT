import { useState, useEffect } from "react";

const ModalKelas = ({
  isModalOpen,
  selectedKelas,
  onClose,
  onSubmit,
  mataKuliahList = [],
  dosenList = [],
  mahasiswaList = [],
}) => {
  const [form, setForm] = useState({
    mata_kuliah_id: "",
    dosen_id: "",
    mahasiswa_id: [],
  });

  const [searchMahasiswa, setSearchMahasiswa] = useState("");

  // Sync form dengan selectedKelas saat modal dibuka
  useEffect(() => {
    if (selectedKelas) {
      setForm({
        mata_kuliah_id: selectedKelas.mata_kuliah_id || "",
        dosen_id: selectedKelas.dosen_id || "",
        mahasiswa_id: selectedKelas.mahasiswa_id || [],
      });
    } else {
      setForm({
        mata_kuliah_id: "",
        dosen_id: "",
        mahasiswa_id: [],
      });
    }
    setSearchMahasiswa("");
  }, [selectedKelas, isModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle mahasiswa selection
  const handleToggleMahasiswa = (id) => {
    setForm((prev) => {
      const isSelected = prev.mahasiswa_id.includes(id);
      return {
        ...prev,
        mahasiswa_id: isSelected
          ? prev.mahasiswa_id.filter((mId) => mId !== id)
          : [...prev.mahasiswa_id, id],
      };
    });
  };

  // Filter mahasiswa berdasarkan search
  const filteredMahasiswa = Array.isArray(mahasiswaList)
    ? mahasiswaList.filter(
        (m) =>
          m.nama?.toLowerCase().includes(searchMahasiswa.toLowerCase()) ||
          m.nim?.toLowerCase().includes(searchMahasiswa.toLowerCase())
      )
    : [];

  // Select all filtered
  const handleSelectAllFiltered = () => {
    const filteredIds = filteredMahasiswa.map((m) => m.id);
    const allSelected = filteredIds.every((id) =>
      form.mahasiswa_id.includes(id)
    );

    if (allSelected) {
      setForm((prev) => ({
        ...prev,
        mahasiswa_id: prev.mahasiswa_id.filter(
          (id) => !filteredIds.includes(id)
        ),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        mahasiswa_id: [...new Set([...prev.mahasiswa_id, ...filteredIds])],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi
    if (!form.mata_kuliah_id) {
      alert("Mata Kuliah harus dipilih!");
      return;
    }

    if (!form.dosen_id) {
      alert("Dosen Pengampu harus dipilih!");
      return;
    }

    if (form.mahasiswa_id.length === 0) {
      alert("Pilih minimal 1 mahasiswa!");
      return;
    }

    // Kirim data ke parent
    onSubmit(form);
  };

  if (!isModalOpen) return null;

  const isEdit = selectedKelas !== null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Kelas" : "Tambah Kelas"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Mata Kuliah */}
          <div>
            <label
              htmlFor="mata_kuliah_id"
              className="block text-sm font-medium mb-1"
            >
              Mata Kuliah <span className="text-red-500">*</span>
            </label>
            <select
              name="mata_kuliah_id"
              id="mata_kuliah_id"
              value={form.mata_kuliah_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Mata Kuliah --</option>
              {mataKuliahList.map((mk) => (
                <option key={mk.id} value={mk.id}>
                  {mk.name} ({mk.sks} SKS)
                </option>
              ))}
            </select>
          </div>

          {/* Dosen Pengampu */}
          <div>
            <label
              htmlFor="dosen_id"
              className="block text-sm font-medium mb-1"
            >
              Dosen Pengampu <span className="text-red-500">*</span>
            </label>
            <select
              name="dosen_id"
              id="dosen_id"
              value={form.dosen_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Dosen --</option>
              {dosenList.map((dosen) => (
                <option key={dosen.id} value={dosen.id}>
                  {dosen.name} (Max {dosen.max_sks} SKS)
                </option>
              ))}
            </select>
          </div>

          {/* Mahasiswa Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mahasiswa <span className="text-red-500">*</span>
              <span className="ml-2 text-xs text-gray-500 font-normal">
                ({form.mahasiswa_id.length} dipilih)
              </span>
            </label>

            {/* Search Mahasiswa */}
            <input
              type="text"
              placeholder="Cari mahasiswa..."
              value={searchMahasiswa}
              onChange={(e) => setSearchMahasiswa(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Select All Button */}
            <div className="flex justify-between items-center mb-2">
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {filteredMahasiswa.length > 0 &&
                filteredMahasiswa.every((m) =>
                  form.mahasiswa_id.includes(m.id)
                )
                  ? "Batal Pilih Semua"
                  : "Pilih Semua"}
              </button>
              <span className="text-xs text-gray-500">
                {filteredMahasiswa.length} mahasiswa ditemukan
              </span>
            </div>

            {/* Mahasiswa List */}
            <div className="border rounded-md max-h-48 overflow-y-auto">
              {filteredMahasiswa.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Tidak ada mahasiswa ditemukan
                </div>
              ) : (
                filteredMahasiswa.map((mahasiswa) => (
                  <label
                    key={mahasiswa.id}
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-blue-50 border-b last:border-b-0 ${
                      form.mahasiswa_id.includes(mahasiswa.id)
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.mahasiswa_id.includes(mahasiswa.id)}
                      onChange={() => handleToggleMahasiswa(mahasiswa.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium">{mahasiswa.nama}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({mahasiswa.nim})
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      Max {mahasiswa.max_sks} SKS
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isEdit ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalKelas;