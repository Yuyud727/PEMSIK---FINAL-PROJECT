import { useState, useEffect } from "react";

const ModalMataKuliah = ({
  isModalOpen,
  selectedMataKuliah,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    name: "",
    sks: 0,
  });

  // Sync form dengan selectedMataKuliah saat modal dibuka
  useEffect(() => {
    if (selectedMataKuliah) {
      setForm({
        name: selectedMataKuliah.name || "",
        sks: selectedMataKuliah.sks || 0,
      });
    } else {
      setForm({
        name: "",
        sks: 0,
      });
    }
  }, [selectedMataKuliah, isModalOpen]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let newValue;
    if (type === "number") {
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
    if (!form.name.trim()) {
      alert("Nama mata kuliah harus diisi!");
      return;
    }

    if (!form.sks || form.sks <= 0) {
      alert("SKS harus lebih dari 0!");
      return;
    }

    // Kirim data ke parent
    onSubmit(form);
  };

  if (!isModalOpen) return null;

  const isEdit = selectedMataKuliah !== null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
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
          {/* Nama Mata Kuliah */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nama Mata Kuliah <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Algoritma dan Pemrograman"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* SKS */}
          <div>
            <label htmlFor="sks" className="block text-sm font-medium mb-1">
              SKS <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="sks"
              id="sks"
              value={form.sks}
              onChange={handleChange}
              placeholder="Masukkan jumlah SKS"
              min="1"
              max="6"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Jumlah SKS mata kuliah (1-6)
            </p>
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

export default ModalMataKuliah;