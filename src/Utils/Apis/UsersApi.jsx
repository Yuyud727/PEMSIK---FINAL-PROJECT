import supabase from "@/Utils/SupabaseClient";

// Login - cari user berdasarkan username & password
export const loginUser = async (username, password) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error) throw error;
  return { data };
};

// Ambil semua users
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return { data };
};

// Ambil 1 user by ID
export const getUser = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return { data };
};

// Tambah user baru
export const storeUser = async (payload) => {
  const { data, error } = await supabase
    .from("users")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return { data };
};

// Update user
export const updateUser = async (id, payload) => {
  const { data, error } = await supabase
    .from("users")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return { data };
};

// Hapus user
export const deleteUser = async (id) => {
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return { success: true };
};