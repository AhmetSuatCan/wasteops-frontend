import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, onSubmit, errors } = useAuth(isLogin);

  return (
    <div className="flex-col flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-5xl mb-12 text-brandGreen">WasteOps</p>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Segmented Picker */}
        <div className="flex mb-6 bg-gray-200 p-1 rounded-full">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${isLogin
              ? "bg-white shadow text-brandGreen"
              : "text-gray-600 hover:text-brandGreen"
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${!isLogin
              ? "bg-white shadow text-brandGreen"
              : "text-gray-600 hover:text-brandGreen"
              }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Full Name"
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}

              <select
                {...register("gender")}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>

              <input
                type="number"
                {...register("age", { valueAsNumber: true })}
                placeholder="Age"
                className="w-full p-2 border border-gray-300 rounded"
              />

              <select
                {...register("role")}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="A">Admin</option>
                <option value="E">Employee</option>
              </select>

              <input
                type="text"
                {...register("phone_number")}
                placeholder="Phone Number"
                className="w-full p-2 border border-gray-300 rounded"
              />

              <textarea
                {...register("address")}
                placeholder="Address"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </>
          )}

          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}

          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-brandGreen text-white p-2 rounded hover:bg-brandGreen/90"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

