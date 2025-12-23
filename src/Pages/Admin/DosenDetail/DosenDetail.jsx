import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";

import { getDosen } from "@/Utils/Apis/DosenApi";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

import { useKelas } from "@/Utils/hooks/useKelas";
import { useMataKuliah } from "@/Utils/hooks/useMataKuliah";

const DosenDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dosen, setDosen] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data untuk perhitungan SKS
  const { data: kelas = [] } = useKelas();
  const { data: mataKuliah = [] } = useMataKuliah();

  useEffect(() => {
    fetchDosen();
  }, [id]);

  const fetchDosen = async () => {
    try {
      const data = await getDosen(id); // Supabase langsung return data
      setDosen(data);
    } catch (err) {
      toastError("Gagal mengambil data dosen");
      setDosen(null);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menghitung total SKS yang diajarkan dosen
  const getTotalSks = (dosenId) => {
    return kelas
      .filter((k) => k.dosen_id === dosenId)
      .map((k) => mataKuliah.find((mk) => mk.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
  };

  // Fungsi untuk mendapatkan daftar kelas yang diajar
  const getKelasTeaching = (dosenId) => {
    return kelas
      .filter((k) => k.dosen_id === dosenId)
      .map((k) => {
        const mk = mataKuliah.find((m) => m.id === k.mata_kuliah_id);
        return {
          ...k,
          mata_kuliah_nama: mk?.name || "-",
          mata_kuliah_sks: mk?.sks || 0,
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
  if (!dosen) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Data tidak ditemukan</p>
          <Button onClick={() => navigate("/admin/dosen")}>
            Kembali ke Daftar Dosen
          </Button>
        </div>
      </Card>
    );
  }

  const totalSks = getTotalSks(dosen.id);
  const kelasTeaching = getKelasTeaching(dosen.id);
  const isOverLimit = totalSks > (dosen.max_sks || 0);
  const totalMahasiswa = kelasTeaching.reduce((a, b) => a + b.jumlah_mahasiswa, 0);

  // =============================
  // TAMPILAN DETAIL
  // =============================
  return (
    <div className="space-y-6">
      {/* Card Info Dosen */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Detail Dosen
          </Heading>
          <Button variant="secondary" onClick={() => navigate("/admin/dosen")}>
            ← Kembali
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Info Dasar */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">
              Informasi Dasar
            </h3>
            <table className="table-auto text-sm w-full">
              <tbody>
                <tr>
                  <td className="py-2 pr-4 font-medium text-gray-600 w-32">ID</td>
                  <td className="py-2 font-mono text-xs">{dosen.id}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-gray-600">Nama</td>
                  <td className="py-2">{dosen.name}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Info SKS */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 border-b pb-2">
              Informasi SKS Mengajar
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Max SKS</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dosen.max_sks || 0}
                </p>
              </div>
              <div
                className={`rounded-lg p-4 text-center ${
                  isOverLimit ? "bg-red-50" : "bg-green-50"
                }`}
              >
                <p className="text-sm text-gray-600">SKS Terpakai</p>
                <p
                  className={`text-2xl font-bold ${
                    isOverLimit ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {totalSks}
                  {isOverLimit && <span className="ml-1 text-sm">⚠️</span>}
                </p>
              </div>
            </div>
            {isOverLimit && (
              <p className="text-sm text-red-600 text-center">
                ⚠️ SKS melebihi batas maksimal!
              </p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Sisa SKS</p>
                <p
                  className={`text-2xl font-bold ${
                    isOverLimit ? "text-red-600" : "text-gray-700"
                  }`}
                >
                  {(dosen.max_sks || 0) - totalSks}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Total Mahasiswa</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalMahasiswa}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Card Daftar Kelas yang Diajar */}
      <Card>
        <Heading as="h3" className="mb-4 text-left">
          Kelas yang Diajar ({kelasTeaching.length})
        </Heading>

        {kelasTeaching.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Dosen belum mengajar kelas manapun
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-2 px-4 text-left">No</th>
                  <th className="py-2 px-4 text-left">Mata Kuliah</th>
                  <th className="py-2 px-4 text-center">SKS</th>
                  <th className="py-2 px-4 text-center">Jumlah Mahasiswa</th>
                </tr>
              </thead>
              <tbody>
                {kelasTeaching.map((kls, index) => (
                  <tr
                    key={kls.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{kls.mata_kuliah_nama}</td>
                    <td className="py-2 px-4 text-center font-medium">
                      {kls.mata_kuliah_sks}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {kls.jumlah_mahasiswa} mahasiswa
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-200 font-semibold">
                <tr>
                  <td colSpan="2" className="py-2 px-4 text-right">
                    Total:
                  </td>
                  <td className="py-2 px-4 text-center">{totalSks} SKS</td>
                  <td className="py-2 px-4 text-center">{totalMahasiswa} mahasiswa</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DosenDetail;