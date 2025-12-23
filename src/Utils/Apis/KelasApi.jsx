import supabase from "@/Utils/SupabaseClient";

export const getAllKelas = async () => {
  const { data, error } = await supabase
    .from("kelas")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getKelas = async (id) => {
  const { data, error } = await supabase
    .from("kelas")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data;
};

export const storeKelas = async (payload) => {
  const { data, error } = await supabase
    .from("kelas")
    .insert(payload)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateKelas = async (id, payload) => {
  const { data, error } = await supabase
    .from("kelas")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteKelas = async (id) => {
  const { error } = await supabase
    .from("kelas")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  return true;
};