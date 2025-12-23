import { useState, useEffect } from "react";

const ModalMahasiswa = ({
  isModalOpen,
  selectedMahasiswa,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    nim: "",
    nama: "",
    max_sks: 0,
    status: true,
  });

  // Sync form dengan selectedMahasiswa saat modal dibuka
  useEffect(() => {
    if (selectedMahasiswa) {
      setForm({
        nim: selectedMahasiswa.nim || "",
        nama: selectedMahasiswa.nama || "",
        max_sks: selectedMahasiswa.max_sks || 0,
        status: selectedMahasiswa.status ?? true,
      });
    } else {
      setForm({
        nim: "",
        nama: "",
        max_sks: 0,
        status: true,
      });
    }
  }, [selectedMahasiswa, isModalOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue;
    if (type === "checkbox") {
      newValue = checked;
    } else if (type === "number") {
      newValue = parseInt(value) || 0;
    } else {
      newValue = value;
    }

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi
    if (!form.nim.trim()) {
      alert("NIM harus diisi!");
      return;
    }

    if (!form.nama.trim()) {
      alert("Nama harus diisi!");
      return;
    }

    if (!form.max_sks || form.max_sks <= 0) {
      alert("Max SKS harus lebih dari 0!");
      return;
    }

    // Kirim data ke parent
    onSubmit(form);
  };

  if (!isModalOpen) return null;

  const isEdit = selectedMahasiswa !== null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* NIM */}
          <div>
            <label htmlFor="nim" className="block text-sm font-medium mb-1">
              NIM <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nim"
              id="nim"
              value={form.nim}
              onChange={handleChange}
              readOnly={isEdit}
              placeholder="Contoh: M001"
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isEdit ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
            {isEdit && (
              <p className="text-xs text-gray-500 mt-1">
                NIM tidak dapat diubah saat edit
              </p>
            )}
          </div>

          {/* Nama */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama"
              id="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Contoh: Budi Santoso"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Max SKS */}
          <div>
            <label htmlFor="max_sks" className="block text-sm font-medium mb-1">
              Max SKS <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="max_sks"
              id="max_sks"
              value={form.max_sks}
              onChange={handleChange}
              placeholder="Masukkan Max SKS"
              min="1"
              max="24"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Batas SKS yang dapat diambil mahasiswa (1-24)
            </p>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-200">
            <input
              type="checkbox"
              name="status"
              id="status"
              checked={form.status}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="status"
              className="text-sm font-medium cursor-pointer select-none"
            >
              Status Aktif
            </label>
            <span
              className={`ml-auto px-2 py-1 rounded text-xs font-medium ${
                form.status
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {form.status ? "Aktif" : "Tidak Aktif"}
            </span>
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

export default ModalMahasiswa;