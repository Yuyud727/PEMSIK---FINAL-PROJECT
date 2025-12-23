import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { login } from "@apis/AuthApi";
import { useAuthStateContext } from "@contexts/AuthContext";

import Input from "@/Pages/Layouts/Components/Input";
import Label from "@/Pages/Layouts/Components/Label";
import Button from "@/Pages/Layouts/Components/Button";
import Link from "@/Pages/Layouts/Components/Link";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Form from "@/Pages/Layouts/Components/Form";

import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();
  const [form, setForm] = useState({ email: "", password: "" });

  if (user) return <Navigate to="/admin/dashboard" replace />;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toastSuccess("Login berhasil");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      toastError(err.message || "Email atau password salah");
    }
  };

  return (
    <Card className="max-w-md">
      <Heading as="h2">Login</Heading>

      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
      </Form>

      <p className="text-sm text-center mt-4">
        Belum punya akun? <Link href="#">Daftar</Link>
      </p>
    </Card>
  );
};

export default Login;
