import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Home,
  Globe,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/features/auth";

export function SignUp() {
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    terms: false,
    newsletter: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      });

      if (result.success) {
        // Redirect to sign-in page
        navigate("/sign-in", {
          state: { message: "Account created successfully! Please sign in." },
        });
      } else {
        setError(result.error || "Registration failed");
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
            Begin your journey
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass shadow-luxe rounded-3xl p-8 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Name Input */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 w-full rounded-full border border-border bg-background/50 pl-11 pr-4 text-sm transition-all focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

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

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="h-12 w-full rounded-full border border-border bg-background/50 pl-11 pr-11 text-sm transition-all focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-muted-foreground">Shipping Details</span>
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-12 w-full rounded-full border border-border bg-background/50 pl-11 pr-4 text-sm transition-all focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Address Input */}
            <div className="space-y-2">
              <label
                htmlFor="address"
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Street Address
              </label>
              <div className="relative">
                <Home className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="h-12 w-full rounded-full border border-border bg-background/50 pl-11 pr-4 text-sm transition-all focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>
            </div>

            {/* City & Postal Code Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label
                  htmlFor="city"
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                >
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="h-12 w-full rounded-full border border-border bg-background/50 pl-11 pr-4 text-sm transition-all focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                    placeholder="New York"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="postalCode"
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="h-12 w-full rounded-full border border-border bg-background/50 px-4 text-sm transition-all focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="10001"
                />
              </div>
            </div>

            {/* Country Input */}
            <div className="space-y-2">
              <label
                htmlFor="country"
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="country"
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="h-12 w-full rounded-full border border-border bg-background/50 pl-11 pr-4 text-sm transition-all focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="United States"
                />
              </div>
            </div>

            {/* Terms & Newsletter */}
            <div className="space-y-3 pt-2">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  required
                  checked={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border text-ink focus:ring-2 focus:ring-ring/20"
                />
                <span className="text-xs text-muted-foreground">
                  I agree to the{" "}
                  <Link to="/terms" className="text-foreground hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-foreground hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.newsletter}
                  onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border text-ink focus:ring-2 focus:ring-ring/20"
                />
                <span className="text-xs text-muted-foreground">
                  Send me exclusive offers and updates
                </span>
              </label>
            </div>

            {/* Sign Up Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center rounded-full bg-gradient-ink text-xs uppercase tracking-[0.25em] text-white shadow-soft transition hover:shadow-luxe disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>
        </motion.div>

        {/* Sign In Link */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-foreground transition hover:text-ink">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
