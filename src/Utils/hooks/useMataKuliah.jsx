import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMataKuliah,
  getMataKuliah,
  storeMataKuliah,
  updateMataKuliah,
  deleteMataKuliah,
} from "@/Utils/Apis/MataKuliahApi";

// FETCH ALL
export const useMataKuliah = (params = {}) =>
  useQuery({
    queryKey: ["mata-kuliah", params],
    queryFn: () => getAllMataKuliah(params),
  });

// FETCH BY ID
export const useMataKuliahById = (id) =>
  useQuery({
    queryKey: ["mata-kuliah", id],
    queryFn: () => getMataKuliah(id),
    enabled: !!id,
  });

// STORE
export const useStoreMataKuliah = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storeMataKuliah,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mata-kuliah"] });
    },
  });
};

// UPDATE
export const useUpdateMataKuliah = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMataKuliah(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mata-kuliah"] });
    },
  });
};

// DELETE
export const useDeleteMataKuliah = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteMataKuliah,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mata-kuliah"] });
    },
  });
};