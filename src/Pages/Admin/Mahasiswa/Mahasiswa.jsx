import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import TableMahasiswa from "./TableMahasiswa";
import ModalMahasiswa from "./ModalMahasiswa";

import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "@/Utils/hooks/useMahasiswa";

import { useKelas } from "@/Utils/hooks/useKelas";
import { useMataKuliah } from "@/Utils/hooks/useMataKuliah";

const Mahasiswa = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();

  // Pagination & filter state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sort, setSort] = useState("nama");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");

  // Query data - useMahasiswa return array langsung
  const { data: mahasiswaRaw = [], isLoading: isLoadingMahasiswa } = useMahasiswa();

  // Pastikan data selalu array
  const mahasiswaAll = Array.isArray(mahasiswaRaw) ? mahasiswaRaw : [];

  // Filter berdasarkan search
  const filteredData = mahasiswaAll.filter((m) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      m.nama?.toLowerCase().includes(searchLower) ||
      m.nim?.toLowerCase().includes(searchLower)
    );
  });

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    const valA = a[sort] || "";
    const valB = b[sort] || "";
    if (order === "asc") {
      return valA > valB ? 1 : -1;
    }
    return valA < valB ? 1 : -1;
  });

  // Pagination
  const total = sortedData.length;
  const totalPages = Math.ceil(total / perPage);
  const mahasiswa = sortedData.slice((page - 1) * perPage, page * perPage);

  // Data untuk perhitungan SKS
  const { data: kelasRaw = [] } = useKelas();
  const { data: mataKuliahRaw = [] } = useMataKuliah();

  // Pastikan data selalu array
  const kelas = Array.isArray(kelasRaw) ? kelasRaw : [];
  const mataKuliah = Array.isArray(mataKuliahRaw) ? mataKuliahRaw : [];

  // Mutations
  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    id: "",
    nim: "",
    nama: "",
    max_sks: 0,
    status: true,
  });

  // Fungsi untuk menghitung total SKS yang diambil mahasiswa
  const getTotalSks = (mhsId) => {
    return kelas
      .filter((k) => k.mahasiswa_id?.includes(mhsId))
      .map((k) => mataKuliah.find((mk) => mk.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
  };

  // Form handlers
  const resetForm = () => {
    setForm({ id: "", nim: "", nama: "", max_sks: 0, status: true });
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setForm({ id: "", nim: "", nama: "", max_sks: 0, status: true });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEditModal = (mhs) => {
    setForm({
      id: mhs.id,
      nim: mhs.nim,
      nama: mhs.nama,
      max_sks: mhs.max_sks || 0,
      status: mhs.status ?? true,
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  // Pagination handlers
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  // Submit handler
  const handleSubmit = (formData) => {
    // Validasi form
    if (!formData.nim || !formData.nama || !formData.max_sks) {
      toastError("NIM, Nama, dan Max SKS wajib diisi");
      return;
    }

    if (isEdit) {
      confirmUpdate(() => {
        update(
          { id: form.id, data: formData },
          {
            onSuccess: () => {
              toastSuccess("Data berhasil diperbarui");
              resetForm();
            },
            onError: () => {
              toastError("Gagal memperbarui data");
            },
          }
        );
      });
      return;
    }

    // Cek NIM duplikat
    const exists = mahasiswaAll.find((m) => m.nim === formData.nim);
    if (exists) {
      toastError("NIM sudah terdaftar!");
      return;
    }

    store(formData, {
      onSuccess: () => {
        toastSuccess("Data berhasil ditambahkan");
        resetForm();
      },
      onError: () => {
        toastError("Gagal menambahkan data");
      },
    });
  };

  // Delete handler
  const handleDelete = (id) => {
    // Cek apakah mahasiswa terdaftar di kelas
    const isEnrolled = kelas.some((k) => k.mahasiswa_id?.includes(id));
    if (isEnrolled) {
      toastError(
        "Mahasiswa masih terdaftar di kelas! Hapus dari kelas terlebih dahulu."
      );
      return;
    }

    confirmDelete(() => {
      remove(id, {
        onSuccess: () => {
          toastSuccess("Data berhasil dihapus");
        },
        onError: () => {
          toastError("Gagal menghapus data");
        },
      });
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
        isLoading={isLoadingMahasiswa}
        onDetail={(id) => navigate(`/admin/mahasiswa/${id}`)}
        onEdit={openEditModal}
        onDelete={handleDelete}
        getTotalSks={getTotalSks}
        pagination={{
          page,
          perPage,
          total,
          setPage,
          setPerPage,
          setSort,
          setOrder,
          setSearch,
          sort,
          order,
          search,
        }}
      />

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Menampilkan {mahasiswa.length} dari {total} data | Halaman {page} dari{" "}
          {totalPages || 1}
        </p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePrev}
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNext}
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      <ModalMahasiswa
        isModalOpen={isModalOpen}
        selectedMahasiswa={isEdit ? form : null}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};

export default Mahasiswa;