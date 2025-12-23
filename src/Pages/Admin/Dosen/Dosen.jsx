import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import TableDosen from "./TableDosen";
import ModalDosen from "./ModalDosen";

import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

import {
  useDosen,
  useStoreDosen,
  useUpdateDosen,
  useDeleteDosen,
} from "@/Utils/hooks/useDosen";

const Dosen = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");

  // Data awal (untuk validasi duplikat)
  const { data: dosenList = [] } = useDosen();

  // Query data paginasi
  const {
    data: result = { data: [], total: 0 },
    isLoading: isLoadingDosen,
  } = useDosen({
    q: search,
    _page: page,
    _limit: perPage,
    _sort: sort,
    _order: order,
  });

  const dosen = result?.data ?? result ?? [];
  const total = result?.total ?? dosen.length ?? 0;
  const totalPages = Math.ceil(total / perPage) || 1;

  // Mutations
  const { mutate: store } = useStoreDosen();
  const { mutate: update } = useUpdateDosen();
  const { mutate: remove } = useDeleteDosen();

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: "",
    name: "",
    max_sks: 0,
  });

  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      max_sks: 0,
    });
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setForm({
      id: "",
      name: "",
      max_sks: 0,
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEditModal = (dsn) => {
    setForm({
      id: dsn.id,
      name: dsn.name,
      max_sks: dsn.max_sks || 0,
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const handleSubmit = (formData) => {
    // Validasi form
    if (!formData.name || !formData.max_sks) {
      toastError("Nama dan Max SKS wajib diisi");
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

  // Hitung data yang ditampilkan untuk array biasa
  const displayData = Array.isArray(dosen) ? dosen : [];

    return (
    <Card>
        <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
            Daftar Dosen
        </Heading>
        <Button onClick={openAddModal}>+ Tambah Dosen</Button>
        </div>

        <TableDosen
        data={displayData}
        isLoading={isLoadingDosen}
        onDetail={(id) => navigate(`/admin/dosen/${id}`)}
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
        <ModalDosen
        isModalOpen={isModalOpen}
        selectedDosen={isEdit ? form : null}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        />
    </Card>
    );
};

export default Dosen;