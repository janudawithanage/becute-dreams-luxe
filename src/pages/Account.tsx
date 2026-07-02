import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { accountService } from "@/features/auth";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { User } from "lucide-react";

export function Account() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Password change state
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

    // Validation
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
      const result = await accountService.updatePassword({
        currentPassword,
        newPassword,
      });

      if (result.success) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.error || "Failed to update password");
      }
    } catch (error) {
      toast.error("An error occurred while updating password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-[900px] px-6 py-16 lg:px-12 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
          ✦ Your Account
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-tight lg:text-7xl">
          Account <em className="font-light">Settings.</em>
        </h1>
      </motion.div>

      <div className="mt-12 space-y-6">
        {/* Account Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="glass border-foreground/10 shadow-soft">
            <CardHeader>
              <CardTitle className="font-display text-2xl tracking-tight">
                Account Information
              </CardTitle>
              <CardDescription className="text-xs uppercase tracking-[0.2em]">
                Your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Name
                  </p>
                  <p className="mt-1 text-base">{user.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-1 text-base">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Phone
                    </p>
                    <p className="mt-1 text-base">{user.phone}</p>
                  </div>
                )}
                {user.address && (
                  <div className="sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Address
                    </p>
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Change Password Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass border-foreground/10 shadow-soft">
            <CardHeader>
              <CardTitle className="font-display text-2xl tracking-tight">
                Change Password
              </CardTitle>
              <CardDescription className="text-xs uppercase tracking-[0.2em]">
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="h-12 rounded-xl border-foreground/10"
                    disabled={isChangingPassword}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="h-12 rounded-xl border-foreground/10"
                    disabled={isChangingPassword}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters
                  </p>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="h-12 rounded-xl border-foreground/10"
                    disabled={isChangingPassword}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="h-12 w-full rounded-full bg-gradient-ink px-8 text-xs uppercase tracking-[0.2em] shadow-soft hover:shadow-luxe disabled:opacity-50"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <Link
            to="/my-orders"
            className="inline-flex h-12 items-center rounded-full border border-foreground/20 px-6 text-xs uppercase tracking-[0.2em] transition hover:bg-foreground/5"
          >
            View My Orders
          </Link>
          <Link
            to="/shop"
            className="inline-flex h-12 items-center rounded-full border border-foreground/20 px-6 text-xs uppercase tracking-[0.2em] transition hover:bg-foreground/5"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
