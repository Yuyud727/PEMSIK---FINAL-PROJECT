# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


KODE SEBELUM

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import TableMahasiswa from "./TableMahasiswa";
import ModalMahasiswa from "./ModalMahasiswa";
import { mahasiswaList } from "@/Data/Dummy";

const Mahasiswa = () => {
  const navigate = useNavigate();

  // ❌ MASALAH: Parent mengelola state form (seharusnya di modal)
  const [mahasiswa, setMahasiswa] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({ nim: "", nama: "", status: true });

  useEffect(() => {
    setTimeout(() => fetchMahasiswa(), 500);
  }, []);

  const fetchMahasiswa = async () => {
    setMahasiswa(mahasiswaList);
  };

  const storeMahasiswa = (newMahasiswa) => {
    setMahasiswa([...mahasiswa, newMahasiswa]);
  };

  // ❌ MASALAH: Parameter tidak konsisten (nim, newData terpisah)
  const updateMahasiswa = (nim, newData) => {
    const updated = mahasiswa.map((mhs) =>
      mhs.nim === nim ? { ...mhs, ...newData } : mhs
    );
    setMahasiswa(updated);
  };

  const deleteMahasiswa = (nim) => {
    const filtered = mahasiswa.filter((mhs) => mhs.nim !== nim);
    setMahasiswa(filtered);
  };

  // ❌ MASALAH: Parent mengelola handleChange (seharusnya di modal)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === "checkbox" ? checked : value
    });
  };

  // ❌ MASALAH: Terlalu banyak logic di parent, validasi campur dengan CRUD
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.nim || !form.nama) {
      alert("NIM dan Nama wajib diisi!");
      return;
    }

    if (isEdit) {
      if (!confirm("Yakin ingin mengubah data ini?")) {
        return;
      }
      updateMahasiswa(form.nim, form);
      alert("Data berhasil diupdate!");
    } else {
      const exists = mahasiswa.find((m) => m.nim === form.nim);
      if (exists) {
        alert("NIM sudah terdaftar! Gunakan NIM yang berbeda.");
        return;
      }
      storeMahasiswa(form);
      alert("Data berhasil ditambahkan!");
    }

    setForm({ nim: "", nama: "", status: true });
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const handleEdit = (mhs) => {
    setForm({ nim: mhs.nim, nama: mhs.nama, status: mhs.status });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleDelete = (nim) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      deleteMahasiswa(nim);
      alert("Data berhasil dihapus!");
    }
  };

  const openAddModal = () => {
    setIsModalOpen(true);
    setForm({ nim: "", nama: "", status: true });
    setIsEdit(false);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
          Daftar Mahasiswa
        </Heading>
        <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
      </div>

      <TableMahasiswa
        data={mahasiswa}
        openEditModal={handleEdit}
        onDelete={handleDelete}
        onDetail={(nim) => navigate(`/admin/mahasiswa/${nim}`)}
      />

      {/* ❌ MASALAH: Terlalu banyak props (6 props) */}
      <ModalMahasiswa
        isOpen={isModalOpen}
        isEdit={isEdit}
        form={form}
        onChange={handleChange}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};

export default Mahasiswa;

KODE SESUDAH (Sudah Diperbaiki)

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import TableMahasiswa from "./TableMahasiswa";
import ModalMahasiswa from "./ModalMahasiswa";
import { mahasiswaList } from "@/Data/Dummy";

const Mahasiswa = () => {
  const navigate = useNavigate();

  // ✅ PERBAIKAN: State management lebih clean
  const [mahasiswa, setMahasiswa] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null); 
  // null = mode tambah, object = mode edit

  useEffect(() => {
    setTimeout(() => fetchMahasiswa(), 500);
  }, []);

  const fetchMahasiswa = async () => {
    setMahasiswa(mahasiswaList);
  };

  // ✅ PERBAIKAN: Gunakan prev state (avoid stale state)
  const storeMahasiswa = (newMahasiswa) => {
    setMahasiswa(prev => [...prev, newMahasiswa]);
  };

  // ✅ PERBAIKAN: Parameter konsisten (terima 1 objek lengkap)
  const updateMahasiswa = (updatedMahasiswa) => {
    setMahasiswa(prev =>
      prev.map(mhs =>
        mhs.nim === updatedMahasiswa.nim ? updatedMahasiswa : mhs
      )
    );
  };

  // ✅ PERBAIKAN: Gunakan prev state
  const deleteMahasiswa = (nim) => {
    setMahasiswa(prev => prev.filter((mhs) => mhs.nim !== nim));
  };

  // ✅ PERBAIKAN: Lebih simpel, tidak perlu set form
  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setIsModalOpen(true);
  };

  // ✅ PERBAIKAN: Rename untuk clarity, tidak perlu set form manual
  const openEditModal = (mahasiswaObj) => {
    setSelectedMahasiswa(mahasiswaObj);
    setIsModalOpen(true);
  };

  // ✅ PERBAIKAN: Hanya business logic, validasi dipindah ke modal
  const handleSubmit = (formData) => {
    if (selectedMahasiswa !== null) {
      // Mode edit
      if (!confirm("Yakin ingin mengubah data ini?")) {
        return;
      }
      updateMahasiswa(formData);
      alert("Data berhasil diupdate!");
    } else {
      // Mode tambah
      const exists = mahasiswa.find((m) => m.nim === formData.nim);
      if (exists) {
        alert("NIM sudah terdaftar! Gunakan NIM yang berbeda.");
        return;
      }
      storeMahasiswa(formData);
      alert("Data berhasil ditambahkan!");
    }
  };

  const handleDelete = (nim) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      deleteMahasiswa(nim);
      alert("Data berhasil dihapus!");
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
          Daftar Mahasiswa
        </Heading>
        <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
      </div>

      <TableMahasiswa
        data={mahasiswa}
        openEditModal={openEditModal}
        onDelete={handleDelete}
        onDetail={(nim) => navigate(`/admin/mahasiswa/${nim}`)}
      />

      {/* ✅ PERBAIKAN: Props berkurang dari 6 → 4 */}
      <ModalMahasiswa
        isModalOpen={isModalOpen}
        selectedMahasiswa={selectedMahasiswa}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};

export default Mahasiswa;


import { useState, useEffect } from "react";
import Form from "@/Pages/Layouts/Components/Form";
import Input from "@/Pages/Layouts/Components/Input";
import Label from "@/Pages/Layouts/Components/Label";
import Button from "@/Pages/Layouts/Components/Button";

// ✅ PERBAIKAN: Props berkurang, modal lebih independent
const ModalMahasiswa = ({
  isModalOpen,
  selectedMahasiswa,  // ✅ Hanya terima data, bukan form state
  onClose,
  onSubmit
}) => {
  // ✅ PERBAIKAN: State form internal di modal
  const [form, setForm] = useState({
    nim: "",
    nama: "",
    status: true
  });

  // ✅ PERBAIKAN: useEffect untuk auto-sync form dengan selectedMahasiswa
  useEffect(() => {
    if (selectedMahasiswa) {
      // Mode edit: isi form dengan data mahasiswa
      setForm({
        nim: selectedMahasiswa.nim,
        nama: selectedMahasiswa.nama,
        status: selectedMahasiswa.status
      });
    } else {
      // Mode tambah: reset form
      setForm({
        nim: "",
        nama: "",
        status: true
      });
    }
  }, [selectedMahasiswa, isModalOpen]);

  // ✅ PERBAIKAN: HandleChange internal di modal
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // ✅ PERBAIKAN: HandleSubmit dengan validasi di modal
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi di modal
    if (!form.nim.trim() || !form.nama.trim()) {
      alert("NIM dan Nama harus diisi!");
      return;
    }

    // Panggil onSubmit parent dengan data form
    onSubmit(form);
    
    // Close modal
    onClose();
  };

  if (!isModalOpen) return null;

  // ✅ PERBAIKAN: isEdit dihitung dari selectedMahasiswa
  const isEdit = selectedMahasiswa !== null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-xl"
          >
            &times;
          </button>
        </div>

        {/* ✅ PERBAIKAN: onSubmit menggunakan handleSubmit lokal */}
        <Form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="nim">NIM *</Label>
            {/* ✅ PERBAIKAN: Menggunakan state dan handler lokal */}
            <Input
              type="text"
              name="nim"
              value={form.nim}
              onChange={handleChange}
              readOnly={isEdit}
              placeholder="Contoh: 20211001"
              required
              className={isEdit ? "bg-gray-100 cursor-not-allowed" : ""}
            />
            {isEdit && (
              <p className="text-xs text-gray-500 mt-1">
                NIM tidak dapat diubah saat edit
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="nama">Nama Lengkap *</Label>
            <Input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Contoh: Budi Santoso"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="status"
              id="status"
              checked={form.status}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="status" className="mb-0">
              Status Aktif
            </Label>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button type="submit">
              {isEdit ? "Update" : "Simpan"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ModalMahasiswa;

import Button from "@/Pages/Layouts/Components/Button";

const TableMahasiswa = ({ data = [], openEditModal, onDelete, onDetail }) => {
  // Panggil onDelete dengan parameter nim mahasiswa
  const handleDelete = (nim) => {
    onDelete(nim);
  };

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">NIM</th>
          <th className="py-2 px-4 text-left">Nama</th>
          <th className="py-2 px-4 text-center">Status</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="4" className="py-4 text-center text-gray-500">
              Belum ada data mahasiswa
            </td>
          </tr>
        ) : (
          data.map((mhs, index) => (
            <tr
              key={mhs.nim}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
            >
              <td className="py-2 px-4">{mhs.nim}</td>
              <td className="py-2 px-4">{mhs.nama}</td>
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
                {/* Panggil onDetail dengan parameter nim */}
                <Button size="sm" onClick={() => onDetail(mhs.nim)}>
                  Detail
                </Button>
                
                {/* Panggil openEditModal dengan parameter objek mahasiswa */}
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => openEditModal(mhs)}
                >
                  Edit
                </Button>
                
                {/* Panggil handleDelete dengan parameter nim */}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(mhs.nim)}
                >
                  Hapus
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default TableMahasiswa;


📝 KETERANGAN:

✅ Component ini sudah benar dari awal
✅ Tidak ada perubahan yang diperlukan
✅ Props sudah sesuai dengan requirement


📊 Ringkasan Perubahan
Mahasiswa.jsx:

❌ Hapus: form, isEdit, handleChange
✅ Tambah: selectedMahasiswa
✅ Ubah: updateMahasiswa(), openEditModal(), handleSubmit()
✅ Props ke modal: 6 → 4

ModalMahasiswa.jsx:

✅ Tambah: form state internal
✅ Tambah: useEffect untuk sync
✅ Tambah: handleChange internal
✅ Tambah: handleSubmit internal dengan validasi

TableMahasiswa.jsx:

✅ Tidak ada perubahan


🎯 Manfaat Refactoring

✅ Separation of Concerns - Setiap komponen punya tanggung jawab jelas
✅ Reusability - Modal bisa digunakan ulang lebih mudah
✅ Maintainability - Lebih mudah di-maintain dan debug
✅ Cleaner Code - Props lebih sedikit, kode lebih rapi
✅ Better Encapsulation - Modal tidak expose internal logic ke parent# Trigger redeploy
