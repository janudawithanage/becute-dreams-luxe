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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Switch } from "@/shared/components/ui/switch";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/features/settings";
import { accountService } from "@/features/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Settings() {
  const { settings, loadSettings, updateShippingSettings, updateSettings, isLoading } = useSettingsStore();
  const [shippingData, setShippingData] = useState(settings.shipping);
  const [heroData, setHeroData] = useState(settings.hero);
  const [isSaving, setIsSaving] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    setShippingData(settings.shipping);
    setHeroData(settings.hero);
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateShippingSettings(shippingData);
      toast.success("Shipping settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleHeroSave = async () => {
    setIsSaving(true);
    try {
      // Update the store with hero settings
      await updateSettings({
        ...settings,
        hero: heroData,
      });
      toast.success("Hero section settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save hero settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-[0.35em] text-muted-foreground"
        >
          ✦ Configuration
        </motion.p>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-2 font-display text-4xl tracking-tight"
        >
          Settings
        </motion.h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your store settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="glass border border-foreground/10">
            <TabsTrigger
              value="account"
              className="uppercase tracking-[0.15em] data-[state=active]:bg-foreground/5"
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              value="hero"
              className="uppercase tracking-[0.15em] data-[state=active]:bg-foreground/5"
            >
              Hero Section
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="uppercase tracking-[0.15em] data-[state=active]:bg-foreground/5"
            >
              Shipping
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            {/* Change Password Card */}
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
          </TabsContent>

          {/* Hero Section Tab */}
          <TabsContent value="hero" className="space-y-6">
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl tracking-tight">
                  Hero Section Configuration
                </CardTitle>
                <CardDescription className="text-xs uppercase tracking-[0.2em]">
                  Customize the hero section tags and pricing display
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Top-left badge settings */}
                <div className="space-y-4 border-b border-foreground/10 pb-6">
                  <h3 className="text-sm font-medium">Top-left Badge</h3>
                  <div className="space-y-2">
                    <Label
                      htmlFor="heroTagLabel"
                      className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      Badge Label
                    </Label>
                    <Input
                      id="heroTagLabel"
                      type="text"
                      value={heroData.tagLabel}
                      onChange={(e) =>
                        setHeroData({ ...heroData, tagLabel: e.target.value })
                      }
                      placeholder="New drop"
                      className="h-12 rounded-xl border-foreground/10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Small text above the main title (e.g., "New drop", "Sale")
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="heroTagTitle"
                      className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      Badge Title
                    </Label>
                    <Input
                      id="heroTagTitle"
                      type="text"
                      value={heroData.tagTitle}
                      onChange={(e) =>
                        setHeroData({ ...heroData, tagTitle: e.target.value })
                      }
                      placeholder="Lavender Series"
                      className="h-12 rounded-xl border-foreground/10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Main title text (e.g., collection name or promotion)
                    </p>
                  </div>
                </div>

                {/* Bottom-right badge settings */}
                <div className="space-y-4 border-b border-foreground/10 pb-6">
                  <h3 className="text-sm font-medium">Bottom-right Badge (Price)</h3>
                  <div className="space-y-2">
                    <Label
                      htmlFor="heroPriceLabel"
                      className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      Price Label
                    </Label>
                    <Input
                      id="heroPriceLabel"
                      type="text"
                      value={heroData.priceLabel}
                      onChange={(e) =>
                        setHeroData({ ...heroData, priceLabel: e.target.value })
                      }
                      placeholder="From"
                      className="h-12 rounded-xl border-foreground/10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Small text above the price (e.g., "From", "Starting at")
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="heroPriceValue"
                      className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      Price Value
                    </Label>
                    <Input
                      id="heroPriceValue"
                      type="text"
                      value={heroData.priceValue}
                      onChange={(e) =>
                        setHeroData({ ...heroData, priceValue: e.target.value })
                      }
                      placeholder="Rs. 500"
                      className="h-12 rounded-xl border-foreground/10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Price text to display (e.g., "Rs. 500", "$19.99")
                    </p>
                  </div>
                </div>

                {/* Hero image URL (optional) */}
                <div className="space-y-2">
                  <Label
                    htmlFor="heroImageUrl"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Custom Hero Image URL (Optional)
                  </Label>
                  <Input
                    id="heroImageUrl"
                    type="text"
                    value={heroData.imageUrl || ''}
                    onChange={(e) =>
                      setHeroData({ ...heroData, imageUrl: e.target.value || null })
                    }
                    placeholder="https://example.com/hero-image.jpg"
                    className="h-12 rounded-xl border-foreground/10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use the default hero image
                  </p>
                </div>

                <Button
                  onClick={handleHeroSave}
                  disabled={isSaving || isLoading}
                  className="h-12 w-full rounded-full bg-gradient-ink px-8 text-xs uppercase tracking-[0.2em] shadow-soft hover:shadow-luxe disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-6">
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl tracking-tight">
                  Shipping Configuration
                </CardTitle>
                <CardDescription className="text-xs uppercase tracking-[0.2em]">
                  Set up your shipping options and rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="freeShipping"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Free Shipping Threshold (Rs.)
                  </Label>
                  <Input
                    id="freeShipping"
                    type="number"
                    step="0.01"
                    min="0"
                    value={shippingData.freeShippingThreshold}
                    onChange={(e) =>
                      setShippingData({
                        ...shippingData,
                        freeShippingThreshold: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="100"
                    className="h-12 rounded-xl border-foreground/10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Orders over this amount get free shipping
                  </p>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="standardRate"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Standard Shipping Rate (Rs.)
                  </Label>
                  <Input
                    id="standardRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={shippingData.standardRate}
                    onChange={(e) =>
                      setShippingData({
                        ...shippingData,
                        standardRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="5.99"
                    className="h-12 rounded-xl border-foreground/10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Standard delivery (5-7 business days)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="expressRate"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Express Shipping Rate (Rs.)
                  </Label>
                  <Input
                    id="expressRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={shippingData.expressRate}
                    onChange={(e) =>
                      setShippingData({
                        ...shippingData,
                        expressRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="15.99"
                    className="h-12 rounded-xl border-foreground/10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Express delivery (2-3 business days)
                  </p>
                </div>
                <div className="flex items-center justify-between py-4 border-t border-foreground/10">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">International Shipping</Label>
                    <p className="text-xs text-muted-foreground">Allow international orders</p>
                  </div>
                  <Switch
                    checked={shippingData.internationalShipping}
                    onCheckedChange={(checked) =>
                      setShippingData({ ...shippingData, internationalShipping: checked })
                    }
                  />
                </div>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || isLoading}
                  className="h-12 w-full rounded-full bg-gradient-ink px-8 text-xs uppercase tracking-[0.2em] shadow-soft hover:shadow-luxe disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
