import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaRecycle, FaTruck, FaLeaf } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, onSubmit, errors, loading, errorMessage } = useAuth(isLogin);
  const { checkAuth, isAuthenticated, isLoading, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuth = await checkAuth();
      if (isAuth) {
        // If user has no organization, redirect to organization creation/join
        const { organization, user } = useAuthStore.getState();
        if (!organization) {
          if (user?.role === 'A') {
            navigate("/create-organization");
          } else {
            navigate("/join-organization");
          }
        } else {
          // Redirect based on role
          if (user?.role === 'A') {
            navigate("/dashboard");
          } else {
            navigate("/employee-dashboard");
          }
        }
      }
    };
    checkAuthentication();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brandGreen/10 to-brandGreen/5">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 border-4 border-brandGreen border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // This will be replaced by the redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brandGreen/10 to-brandGreen/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {i % 3 === 0 ? (
              <FaRecycle className="text-brandGreen/10 w-8 h-8" />
            ) : i % 3 === 1 ? (
              <FaTruck className="text-brandGreen/10 w-8 h-8" />
            ) : (
              <FaLeaf className="text-brandGreen/10 w-8 h-8" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block mb-4"
          >
            <MdDelete className="w-16 h-16 text-brandGreen" />
          </motion.div>
          <h1 className="text-5xl font-bold text-brandGreen mb-2">WasteOps</h1>
          <p className="text-gray-600">Smart Waste Management Solutions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
            {/* Segmented Picker */}
            <div className="flex mb-8 bg-gray-100/50 p-1 rounded-full">
              <motion.button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-full text-sm font-medium transition-all relative ${isLogin ? "text-brandGreen" : "text-gray-600 hover:text-brandGreen"
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLogin && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white shadow-sm rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">Login</span>
              </motion.button>
              <motion.button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-full text-sm font-medium transition-all relative ${!isLogin ? "text-brandGreen" : "text-gray-600 hover:text-brandGreen"
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {!isLogin && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white shadow-sm rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">Register</span>
              </motion.button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg"
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div>
                      <input
                        {...register("name", { required: "Name is required" })}
                        placeholder="Full Name"
                        className="w-full p-3 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brandGreen/50 focus:border-brandGreen transition-all"
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-1 text-sm text-red-600"
                        >
                          {errors.name.message}
                        </motion.p>
                      )}
                    </div>

                    <select
                      {...register("gender")}
                      className="w-full p-3 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brandGreen/50 focus:border-brandGreen transition-all"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>

                    <input
                      type="number"
                      {...register("age", { valueAsNumber: true })}
                      placeholder="Age"
                      className="w-full p-3 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brandGreen/50 focus:border-brandGreen transition-all"
                    />

                    <select
                      {...register("role")}
                      className="w-full p-3 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brandGreen/50 focus:border-brandGreen transition-all"
                    >
                      <option value="A">Admin</option>
                      <option value="E">Employee</option>
                    </select>

                    <input
                      type="text"
                      {...register("phone_number")}
                      placeholder="Phone Number"
                      className="w-full p-3 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brandGreen/50 focus:border-brandGreen transition-all"
                    />

                    <textarea
                      {...register("address")}
                      placeholder="Address"
                      className="w-full p-3 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brandGreen/50 focus:border-brandGreen transition-all"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Email"
                  className="w-full p-3 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brandGreen/50 focus:border-brandGreen transition-all"
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  placeholder="Password"
                  className="w-full p-3 bg-white/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brandGreen/50 focus:border-brandGreen transition-all"
                />
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-brandGreen text-white rounded-lg font-medium transition-all ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-brandGreen/90"
                  }`}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                  />
                ) : (
                  isLogin ? "Login" : "Register"
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

