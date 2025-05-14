// hooks/useAuth.ts
import { useForm } from "react-hook-form";
import { authApi, RegisterData } from "../services/api/auth";
import { useState } from "react";
import { useNavigate } from "react-router";

interface AuthFormInputs extends RegisterData {
  password: string;
}

export function useAuth(isLogin: boolean) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate()

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
        const result = await authApi.login(data.email, data.password);
        navigate("/dashboard")
        console.log("Login successful:", result);
      } else {
        const result = await authApi.register(data);
        console.log("Registration successful:", result);
      }
      reset();
    } catch (error : any) {
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

