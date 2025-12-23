import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllKelas,
  getKelas,
  storeKelas,
  updateKelas,
  deleteKelas,
} from "@/Utils/Apis/KelasApi";

// FETCH ALL
export const useKelas = (params = {}) =>
  useQuery({
    queryKey: ["kelas", params],
    queryFn: () => getAllKelas(params),
  });

// FETCH BY ID
export const useKelasById = (id) =>
  useQuery({
    queryKey: ["kelas", id],
    queryFn: () => getKelas(id),
    enabled: !!id,
  });

// STORE
export const useStoreKelas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storeKelas,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kelas"] });
    },
  });
};

// UPDATE
export const useUpdateKelas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateKelas(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kelas"] });
    },
  });
};

// DELETE
export const useDeleteKelas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteKelas,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kelas"] });
    },
  });
};