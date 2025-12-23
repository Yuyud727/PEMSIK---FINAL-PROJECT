import supabase from "@/Utils/SupabaseClient";

export const getAllDosen = async () => {
  const { data, error } = await supabase
    .from("dosen")
    .select("*")
    .order("name", { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getDosen = async (id) => {
  const { data, error } = await supabase
    .from("dosen")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data;
};

export const storeDosen = async (payload) => {
  const { data, error } = await supabase
    .from("dosen")
    .insert(payload)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateDosen = async (id, payload) => {
  const { data, error } = await supabase
    .from("dosen")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteDosen = async (id) => {
  const { error } = await supabase
    .from("dosen")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  return true;
};