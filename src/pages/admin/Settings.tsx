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
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Settings() {
  const { settings, loadSettings, updateShippingSettings, isLoading } = useSettingsStore();
  const [formData, setFormData] = useState(settings.shipping);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    setFormData(settings.shipping);
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateShippingSettings(formData);
      toast.success("Shipping settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
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
        <Tabs defaultValue="shipping" className="space-y-6">
          <TabsList className="glass border border-foreground/10">
            <TabsTrigger
              value="shipping"
              className="uppercase tracking-[0.15em] data-[state=active]:bg-foreground/5"
            >
              Shipping
            </TabsTrigger>
          </TabsList>

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
                    Free Shipping Threshold ($)
                  </Label>
                  <Input
                    id="freeShipping"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.freeShippingThreshold}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
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
                    Standard Shipping Rate ($)
                  </Label>
                  <Input
                    id="standardRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.standardRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
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
                    Express Shipping Rate ($)
                  </Label>
                  <Input
                    id="expressRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.expressRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
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
                    checked={formData.internationalShipping}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, internationalShipping: checked })
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
