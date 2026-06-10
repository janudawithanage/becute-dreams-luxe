import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Password reset for:", email);
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-dream px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Back Link */}
        <Link
          to="/sign-in"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <Link to="/" className="inline-block">
            <h1 className="font-display text-4xl tracking-tight">
              Becute<span className="italic text-muted-foreground"> Dreams</span>
            </h1>
          </Link>
          <p className="mt-4 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            {submitted ? "Check your email" : "Reset password"}
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass shadow-luxe rounded-3xl p-8 md:p-10"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-center text-sm text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password.
              </p>

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full rounded-full border border-border bg-background/50 pl-11 pr-4 text-sm transition-all focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex h-12 w-full items-center justify-center rounded-full bg-gradient-ink text-xs uppercase tracking-[0.25em] text-white shadow-soft transition hover:shadow-luxe"
              >
                Send Reset Link
              </motion.button>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-blush"
              >
                <Mail className="h-8 w-8 text-ink" />
              </motion.div>
              <div>
                <h2 className="font-display text-2xl">Check your inbox</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We've sent a password reset link to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>
              <div className="space-y-3 pt-4">
                <p className="text-xs text-muted-foreground">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-foreground transition hover:text-ink"
                  >
                    try again
                  </button>
                </p>
                <Link
                  to="/sign-in"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background/50 px-6 text-xs uppercase tracking-[0.25em] transition hover:bg-background"
                >
                  Return to sign in
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
