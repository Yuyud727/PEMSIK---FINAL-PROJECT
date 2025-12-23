import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import TableMataKuliah from "./TableMataKuliah";
import ModalMataKuliah from "./ModalMataKuliah";

import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

import {
  useMataKuliah,
  useStoreMataKuliah,
  useUpdateMataKuliah,
  useDeleteMataKuliah,
} from "@/Utils/hooks/useMataKuliah";

import { useKelas } from "@/Utils/hooks/useKelas";

const MataKuliah = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");

  // Data awal (untuk validasi duplikat)
  const { data: mataKuliahList = [] } = useMataKuliah();

  // Query data paginasi
  const {
    data: result = { data: [], total: 0 },
    isLoading: isLoadingMataKuliah,
  } = useMataKuliah({
    q: search,
    _page: page,
    _limit: perPage,
    _sort: sort,
    _order: order,
  });

  const mataKuliah = result?.data ?? result ?? [];
  const total = result?.total ?? mataKuliah.length ?? 0;
  const totalPages = Math.ceil(total / perPage) || 1;

  // Data kelas untuk cek relasi
  const { data: kelas = [] } = useKelas();

  // Mutations
  const { mutate: store } = useStoreMataKuliah();
  const { mutate: update } = useUpdateMataKuliah();
  const { mutate: remove } = useDeleteMataKuliah();

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: "",
    name: "",
    sks: 0,
  });

  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      sks: 0,
    });
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setForm({
      id: "",
      name: "",
      sks: 0,
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEditModal = (mk) => {
    setForm({
      id: mk.id,
      name: mk.name,
      sks: mk.sks || 0,
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const handleSubmit = (formData) => {
    // Validasi form
    if (!formData.name || !formData.sks) {
      toastError("Nama dan SKS wajib diisi");
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

    // Cek nama duplikat
    const exists = mataKuliahList.find(
      (m) => m.name.toLowerCase() === formData.name.toLowerCase()
    );
    if (exists) {
      toastError("Mata kuliah sudah terdaftar!");
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

  const handleDelete = (id) => {
    // Cek apakah mata kuliah digunakan di kelas
    const isUsed = kelas.some((k) => k.mata_kuliah_id === id);
    if (isUsed) {
      toastError("Mata kuliah masih digunakan di kelas! Hapus kelas terlebih dahulu.");
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

  // Hitung data yang ditampilkan
  const displayData = Array.isArray(mataKuliah) ? mataKuliah : [];

    return (
    <Card>
        <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
            Daftar Mata Kuliah
        </Heading>
        <Button onClick={openAddModal}>+ Tambah Mata Kuliah</Button>
        </div>

        <TableMataKuliah
        data={displayData}
        isLoading={isLoadingMataKuliah}
        onDetail={(id) => navigate(`/admin/mata-kuliah/${id}`)}
        onEdit={openEditModal}
        onDelete={handleDelete}
        pagination={{
            page,
            perPage,
            total: displayData.length,
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
            Menampilkan {displayData.length} dari {displayData.length} data | Halaman {page} dari{" "}
            {totalPages}
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
        <ModalMataKuliah
        isModalOpen={isModalOpen}
        selectedMataKuliah={isEdit ? form : null}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        />
    </Card>
    );
};

export default MataKuliah;