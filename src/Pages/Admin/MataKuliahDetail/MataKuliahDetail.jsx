import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";

import { getMataKuliah } from "@/Utils/Apis/MataKuliahApi";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

import { useKelas } from "@/Utils/hooks/useKelas";
import { useDosen } from "@/Utils/hooks/useDosen";

const MataKuliahDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mataKuliah, setMataKuliah] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data untuk relasi
  const { data: kelas = [] } = useKelas();
  const { data: dosen = [] } = useDosen();

  useEffect(() => {
    fetchMataKuliah();
  }, [id]);

  const fetchMataKuliah = async () => {
    try {
      const data = await getMataKuliah(id); // Supabase langsung return data
      setMataKuliah(data);
    } catch (err) {
      toastError("Gagal mengambil data mata kuliah");
      setMataKuliah(null);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mendapatkan daftar kelas yang menggunakan mata kuliah ini
  const getKelasWithMataKuliah = (mkId) => {
    return kelas
      .filter((k) => k.mata_kuliah_id === mkId)
      .map((k) => {
        const dosenData = dosen.find((d) => d.id === k.dosen_id);
        return {
          ...k,
          dosen_nama: dosenData?.name || "-",
          jumlah_mahasiswa: k.mahasiswa_id?.length || 0,
        };
      });
  };

  // =============================
  // LOADING
  // =============================
  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Memuat data...</p>
        </div>
      </Card>
    );
  }

  // =============================
  // DATA TIDAK ADA
  // =============================
  if (!mataKuliah) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Data tidak ditemukan</p>
          <Button onClick={() => navigate("/admin/mata-kuliah")}>
            Kembali ke Daftar Mata Kuliah
          </Button>
        </div>
      </Card>
    );
  }

  const kelasWithMataKuliah = getKelasWithMataKuliah(mataKuliah.id);
  const totalMahasiswa = kelasWithMataKuliah.reduce((a, b) => a + b.jumlah_mahasiswa, 0);

  // =============================
  // TAMPILAN DETAIL
  // =============================
  return (
    <div className="space-y-6">
      {/* Card Info Mata Kuliah */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Detail Mata Kuliah
          </Heading>
          <Button variant="secondary" onClick={() => navigate("/admin/mata-kuliah")}>
            ← Kembali
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Info Dasar */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">
              Informasi Mata Kuliah
            </h3>
            <table className="table-auto text-sm w-full">
              <tbody>
                <tr>
                  <td className="py-2 pr-4 font-medium text-gray-600 w-32">Nama</td>
                  <td className="py-2">{mataKuliah.name}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-gray-600">SKS</td>
                  <td className="py-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {mataKuliah.sks} SKS
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Statistik */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">
              Statistik
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Jumlah Kelas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {kelasWithMataKuliah.length}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Total Mahasiswa</p>
                <p className="text-2xl font-bold text-green-600">
                  {totalMahasiswa}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Card Daftar Kelas */}
      <Card>
        <Heading as="h3" className="mb-4 text-left">
          Kelas yang Menggunakan Mata Kuliah Ini ({kelasWithMataKuliah.length})
        </Heading>

        {kelasWithMataKuliah.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Belum ada kelas yang menggunakan mata kuliah ini
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-left">Dosen Pengajar</th>
                  <th className="py-2 px-4 text-center">Jumlah Mahasiswa</th>
                </tr>
              </thead>
              <tbody>
                {kelasWithMataKuliah.map((kls, index) => (
                  <tr
                    key={kls.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{kls.dosen_nama}</td>
                    <td className="py-2 px-4 text-center">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {kls.jumlah_mahasiswa} mahasiswa
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-200 font-semibold">
                <tr>
                  <td colSpan="2" className="py-2 px-4 text-right">
                    Total Mahasiswa:
                  </td>
                  <td className="py-2 px-4 text-center">{totalMahasiswa}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MataKuliahDetail;