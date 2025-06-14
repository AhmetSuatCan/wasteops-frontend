// hooks/useAuth.ts
import { useForm } from "react-hook-form";
import { RegisterData } from "../services/api/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/userStore";

interface AuthFormInputs extends RegisterData {
  password: string;
}

export function useAuth(isLogin: boolean) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, register: registerUser, user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormInputs>();

  const onSubmit = async (data: AuthFormInputs) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (isLogin) {
        await login(data.email, data.password);
        if (user?.role === 'A') {
          navigate("/dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      } else {
        await registerUser(data);
        if (user?.role === 'A') {
          navigate("/dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }
      reset();
    } catch (error: any) {
      console.error("Auth error:", error);
      setErrorMessage(
        error.response?.data?.detail || "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    loading,
    errorMessage,
  };
}

