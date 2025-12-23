import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import TableKelas from "./TableKelas";
import ModalKelas from "./ModalKelas";

import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

import {
  useKelas,
  useStoreKelas,
  useUpdateKelas,
  useDeleteKelas,
} from "@/Utils/hooks/useKelas";

import { useMataKuliah } from "@/Utils/hooks/useMataKuliah";
import { useDosen } from "@/Utils/hooks/useDosen";
import { useMahasiswa } from "@/Utils/hooks/useMahasiswa";

const Kelas = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();

  // Pagination & filter state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");

  // Query data paginasi
  const {
    data: result = { data: [], total: 0 },
    isLoading: isLoadingKelas,
  } = useKelas({
    q: search,
    _page: page,
    _limit: perPage,
    _sort: sort,
    _order: order,
  });

  const kelasList = Array.isArray(result) ? result : (result.data || []);
  const total = result.total || kelasList.length;
  const totalPages = Math.ceil(total / perPage);

  // Data relasi
  const { data: mataKuliahRaw = [] } = useMataKuliah();
  const { data: dosenRaw = [] } = useDosen();
  const { data: mahasiswaRaw = [] } = useMahasiswa();

  // Pastikan data selalu array
  const mataKuliahList = Array.isArray(mataKuliahRaw) ? mataKuliahRaw : [];
  const dosenList = Array.isArray(dosenRaw) ? dosenRaw : [];
  const mahasiswaList = Array.isArray(mahasiswaRaw) ? mahasiswaRaw : [];

  // Mutations
  const { mutate: store } = useStoreKelas();
  const { mutate: update } = useUpdateKelas();
  const { mutate: remove } = useDeleteKelas();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    id: "",
    mata_kuliah_id: "",
    dosen_id: "",
    mahasiswa_id: [],
  });

  // Helper functions
  const getMataKuliahName = (id) => {
    const mk = mataKuliahList.find((item) => item.id === id);
    return mk?.name || "-";
  };

  const getMataKuliahSks = (id) => {
    const mk = mataKuliahList.find((item) => item.id === id);
    return mk?.sks || 0;
  };

  const getDosenName = (id) => {
    const dosen = dosenList.find((item) => item.id === id);
    return dosen?.name || "-";
  };

  const getMahasiswaCount = (mahasiswaIds) => {
    if (!Array.isArray(mahasiswaIds)) return 0;
    return mahasiswaIds.length;
  };

  // Form handlers
  const resetForm = () => {
    setForm({ id: "", mata_kuliah_id: "", dosen_id: "", mahasiswa_id: [] });
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setForm({ id: "", mata_kuliah_id: "", dosen_id: "", mahasiswa_id: [] });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEditModal = (kelas) => {
    setForm({
      id: kelas.id,
      mata_kuliah_id: kelas.mata_kuliah_id || "",
      dosen_id: kelas.dosen_id || "",
      mahasiswa_id: kelas.mahasiswa_id || [],
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  // Pagination handlers
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  // Submit handler
  const handleSubmit = (formData) => {
    // Validasi
    if (!formData.mata_kuliah_id) {
      toastError("Mata Kuliah wajib dipilih");
      return;
    }
    if (!formData.dosen_id) {
      toastError("Dosen Pengampu wajib dipilih");
      return;
    }
    if (!formData.mahasiswa_id || formData.mahasiswa_id.length === 0) {
      toastError("Pilih minimal 1 mahasiswa");
      return;
    }

    if (isEdit) {
      confirmUpdate(() => {
        update(
          { id: form.id, data: formData },
          {
            onSuccess: () => {
              toastSuccess("Kelas berhasil diperbarui");
              resetForm();
            },
            onError: () => {
              toastError("Gagal memperbarui kelas");
            },
          }
        );
      });
      return;
    }

    store(formData, {
      onSuccess: () => {
        toastSuccess("Kelas berhasil ditambahkan");
        resetForm();
      },
      onError: () => {
        toastError("Gagal menambahkan kelas");
      },
    });
  };

  // Delete handler
  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id, {
        onSuccess: () => {
          toastSuccess("Kelas berhasil dihapus");
        },
        onError: () => {
          toastError("Gagal menghapus kelas");
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
            Daftar Kelas
        </Heading>
        <Button onClick={openAddModal}>+ Tambah Kelas</Button>
        </div>

        <TableKelas
        data={kelasList}
        isLoading={isLoadingKelas}
        onDetail={(id) => navigate(`/admin/kelas/${id}`)}
        onEdit={openEditModal}
        onDelete={handleDelete}
        getMataKuliahName={getMataKuliahName}
        getMataKuliahSks={getMataKuliahSks}
        getDosenName={getDosenName}
        getMahasiswaCount={getMahasiswaCount}
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
            Menampilkan {kelasList.length} dari {total} data | Halaman {page} dari{" "}
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
        <ModalKelas
        isModalOpen={isModalOpen}
        selectedKelas={isEdit ? form : null}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        mataKuliahList={mataKuliahList}
        dosenList={dosenList}
        mahasiswaList={mahasiswaList}
        />
    </Card>
    );
};

export default Kelas;