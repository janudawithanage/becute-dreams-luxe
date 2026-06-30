import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/features/auth";

export function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  // Check for success message from registration or redirect message
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
    
    // Load remembered email if exists
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, remember: true }));
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        // Handle "Remember me" functionality
        if (formData.remember) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Redirect to the page they were trying to access, or admin dashboard if they're admin
        const from = location.state?.from;
        const { isAdmin } = useAuthStore.getState();

        if (isAdmin()) {
          navigate("/admin");
        } else if (from) {
          // Redirect back to where they came from
          navigate(from);
        } else {
          navigate("/");
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-dream px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-12 text-center">
          <Link to="/" className="inline-block">
            <h1 className="font-display text-4xl tracking-tight">
              Becute<span className="italic text-muted-foreground"> Dreams</span>
            </h1>
          </Link>
          <p className="mt-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Welcome back
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass shadow-luxe rounded-3xl p-8 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-2xl bg-green-50 p-4 text-sm text-green-600"
              >
                <AlertCircle className="h-4 w-4" />
                {successMessage}
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-600"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </motion.div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 w-full rounded-full border border-border bg-background/50 pl-11 pr-4 text-sm transition-all focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 w-full rounded-full border border-border bg-background/50 pl-11 pr-11 text-sm transition-all focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  className="h-4 w-4 cursor-pointer rounded border-border text-ink focus:ring-2 focus:ring-ring/20"
                />
                <span className="text-xs text-muted-foreground">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-muted-foreground transition hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center rounded-full bg-gradient-ink text-xs uppercase tracking-[0.25em] text-white shadow-soft transition hover:shadow-luxe disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>
        </motion.div>

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-foreground transition hover:text-ink">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
