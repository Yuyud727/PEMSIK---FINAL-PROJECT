import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMahasiswa,
  getMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/Utils/Apis/MahasiswaApi";

// FETCH ALL
export const useMahasiswa = (params = {}) =>
  useQuery({
    queryKey: ["mahasiswa", params],
    queryFn: () => getAllMahasiswa(params),
  });

// FETCH BY ID
export const useMahasiswaById = (id) =>
  useQuery({
    queryKey: ["mahasiswa", id],
    queryFn: () => getMahasiswa(id),
    enabled: !!id,
  });

// STORE
export const useStoreMahasiswa = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storeMahasiswa,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mahasiswa"] });
    },
  });
};

// UPDATE
export const useUpdateMahasiswa = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMahasiswa(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mahasiswa"] });
    },
  });
};

// DELETE
export const useDeleteMahasiswa = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteMahasiswa,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mahasiswa"] });
    },
  });
};