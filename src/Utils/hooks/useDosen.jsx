import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllDosen,
  getDosen,
  storeDosen,
  updateDosen,
  deleteDosen,
} from "@/Utils/Apis/DosenApi";

// FETCH ALL
export const useDosen = (params = {}) =>
  useQuery({
    queryKey: ["dosen", params],
    queryFn: () => getAllDosen(params),
    // Supabase langsung return array, bukan res.data
  });

// FETCH BY ID
export const useDosenById = (id) =>
  useQuery({
    queryKey: ["dosen", id],
    queryFn: () => getDosen(id),
    enabled: !!id,
  });

// STORE
export const useStoreDosen = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storeDosen,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dosen"] });
    },
  });
};

// UPDATE
export const useUpdateDosen = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateDosen(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dosen"] });
    },
  });
};

// DELETE
export const useDeleteDosen = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDosen,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dosen"] });
    },
  });
};