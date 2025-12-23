import supabase from "@utils/SupabaseClient";

export const login = async (email, password) => {
  console.log("Attempting login with:", email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error details:", error);
    throw error;
  }

  return data.user;
};

export const logout = async () => {
  await supabase.auth.signOut();
};

export const register = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Register error:", error);
    throw error;
  }

  return data.user;
};