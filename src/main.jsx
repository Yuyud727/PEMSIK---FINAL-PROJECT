import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";

// Context
import { AuthProvider } from "./Utils/Contexts/AuthContext";

// Routes & Layouts
import AuthLayout from "@/Pages/Layouts/AuthLayout";
import AdminLayout from "@/Pages/Layouts/AdminLayout";
import ProtectedRoute from "@/Pages/Layouts/Components/ProtectedRoute";
import Login from "@/Pages/Auth/Login/Login";
import Dashboard from "@/Pages/Admin/Dashboard/Dashboard";
import Mahasiswa from "@/Pages/Admin/Mahasiswa/Mahasiswa";
import MahasiswaDetail from "@/Pages/Admin/MahasiswaDetail/MahasiswaDetail";
import Dosen from "@/Pages/Admin/Dosen/Dosen";
import DosenDetail from "@/Pages/Admin/DosenDetail/DosenDetail";
import MataKuliah from "@/Pages/Admin/MataKuliah/MataKuliah";
import MataKuliahDetail from "@/Pages/Admin/MataKuliahDetail/MataKuliahDetail";
import Kelas from "@/Pages/Admin/Kelas/Kelas";
import KelasDetail from "@/Pages/Admin/KelasDetail/KelasDetail";
import PageNotFound from "@/Pages/PageNotFound";

// Router define
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      {
        path: "mahasiswa",
        children: [
          { index: true, element: <Mahasiswa /> },
          { path: ":id", element: <MahasiswaDetail /> },  // Ubah dari :nim ke :id
        ],
      },
      {
        path: "dosen",
        children: [
          { index: true, element: <Dosen /> },
          { path: ":id", element: <DosenDetail /> },
        ],
      },
      {
        path: "mata-kuliah",
        children: [
          { index: true, element: <MataKuliah /> },
          { path: ":id", element: <MataKuliahDetail /> },
        ],
      },
      {
        path: "kelas",
        children: [
          { index: true, element: <Kelas /> },
          { path: ":id", element: <KelasDetail /> },
        ],
      },
    ],
  },
  { path: "*", element: <PageNotFound /> },
]);

// 🔥 Buat QueryClient
const queryClient = new QueryClient();

// Render
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);