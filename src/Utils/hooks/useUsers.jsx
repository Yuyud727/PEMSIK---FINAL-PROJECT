import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  getUser,
  storeUser,
  updateUser,
  deleteUser,
} from "@/Utils/Apis/UsersApi";

// FETCH ALL
export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    select: (res) => res?.data ?? [],
  });

// FETCH BY ID
export const useUserById = (id) =>
  useQuery({
    queryKey: ["users", id],
    queryFn: () => getUser(id),
    select: (res) => res?.data ?? null,
    enabled: !!id,
  });

// STORE
export const useStoreUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: storeUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// UPDATE
export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// DELETE
export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
};