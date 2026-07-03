import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { accountService } from "@/features/auth";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ShoppingBag, ArrowUpRight, Lock, User as UserIcon } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Account() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-in", {
        state: { from: { pathname: "/account" }, message: "Please sign in to access your account" },
      });
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsChangingPassword(true);
    try {
      const result = await accountService.updatePassword({ currentPassword, newPassword });
      if (result.success) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.error || "Failed to update password");
      }
    } catch {
      toast.error("An error occurred while updating password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="page-enter mx-auto max-w-[900px] px-6 py-16 lg:px-12 lg:py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">✦ Your account</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight lg:text-7xl">
          Account <em className="font-light">settings.</em>
        </h1>
      </motion.div>

      <div className="mt-12 space-y-6">
        {/* Account info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="rounded-3xl border bg-background p-8 shadow-soft"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-display text-2xl leading-none">Account information</h2>
              <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Your details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {(
              [
                ["Name", user.name],
                ["Email", user.email],
                ...(user.phone ? [["Phone", user.phone]] : []),
              ] as [string, string][]
            ).map(([label, val]) => (
                <div key={label as string}>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1 text-base">{val}</p>
                </div>
              ))}

            {user.address && (
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Address</p>
                <p className="mt-1 text-base">
                  {user.address}
                  {user.city && (
                    <>
                      <br />
                      {user.city}
                      {user.postalCode && `, ${user.postalCode}`}
                    </>
                  )}
                  {user.country && (
                    <>
                      <br />
                      {user.country}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Change password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          className="rounded-3xl border bg-background p-8 shadow-soft"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-display text-2xl leading-none">Change password</h2>
              <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Update your credentials
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-5">
            {[
              { id: "currentPassword", label: "Current password", value: currentPassword, setter: setCurrentPassword },
              { id: "newPassword", label: "New password", value: newPassword, setter: setNewPassword, hint: "Min. 6 characters" },
              { id: "confirmPassword", label: "Confirm new password", value: confirmPassword, setter: setConfirmPassword },
            ].map(({ id, label, value, setter, hint }) => (
              <div key={id} className="space-y-1.5">
                <Label
                  htmlFor={id}
                  className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                >
                  {label}
                </Label>
                <Input
                  id={id}
                  type="password"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-foreground/10 focus:border-foreground"
                  disabled={isChangingPassword}
                />
                {hint && (
                  <p className="text-xs text-muted-foreground">{hint}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isChangingPassword}
              className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-ink text-xs uppercase tracking-[0.2em] text-white shadow-soft transition hover:shadow-luxe disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isChangingPassword ? "Updating…" : "Update password"}
            </button>
          </form>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          className="flex flex-wrap gap-3"
        >
          <Link
            to="/my-orders"
            className="group inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition hover:border-foreground hover:bg-foreground/5"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            View my orders
          </Link>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition hover:border-foreground hover:bg-foreground/5"
          >
            Continue shopping
            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:rotate-45" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
