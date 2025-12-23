import { createContext, useContext, useEffect, useState } from "react";
import supabase from "@utils/SupabaseClient";

const AuthStateContext = createContext({
  user: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ambil session awal
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
      setLoading(false);
    });

    // listen perubahan auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthStateContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthStateContext = () =>
  useContext(AuthStateContext);
