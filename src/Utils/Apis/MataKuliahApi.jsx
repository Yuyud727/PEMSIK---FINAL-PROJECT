import supabase from "@/Utils/SupabaseClient";

export const getAllMataKuliah = async () => {
  const { data, error } = await supabase
    .from("mata_kuliah")
    .select("*")
    .order("name", { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getMataKuliah = async (id) => {
  const { data, error } = await supabase
    .from("mata_kuliah")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data;
};

export const storeMataKuliah = async (payload) => {
  const { data, error } = await supabase
    .from("mata_kuliah")
    .insert(payload)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateMataKuliah = async (id, payload) => {
  const { data, error } = await supabase
    .from("mata_kuliah")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteMataKuliah = async (id) => {
  const { error } = await supabase
    .from("mata_kuliah")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  return true;
};