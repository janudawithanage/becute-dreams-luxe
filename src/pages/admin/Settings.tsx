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

export function Settings() {
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
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="glass border border-foreground/10">
            <TabsTrigger
              value="general"
              className="uppercase tracking-[0.15em] data-[state=active]:bg-foreground/5"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="uppercase tracking-[0.15em] data-[state=active]:bg-foreground/5"
            >
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="uppercase tracking-[0.15em] data-[state=active]:bg-foreground/5"
            >
              Shipping
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl tracking-tight">
                  Store Information
                </CardTitle>
                <CardDescription className="text-xs uppercase tracking-[0.2em]">
                  Update your store's basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="storeName"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Store Name
                  </Label>
                  <Input
                    id="storeName"
                    defaultValue="BeCute Dreams Luxe"
                    className="h-12 rounded-xl border-foreground/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="storeEmail"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Store Email
                  </Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    defaultValue="contact@becute.com"
                    className="h-12 rounded-xl border-foreground/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="storePhone"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Store Phone
                  </Label>
                  <Input
                    id="storePhone"
                    defaultValue="+1 234 567 8900"
                    className="h-12 rounded-xl border-foreground/10"
                  />
                </div>
                <Button className="h-12 rounded-full bg-gradient-ink px-8 text-xs uppercase tracking-[0.2em] shadow-soft hover:shadow-luxe">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="glass border-foreground/10 shadow-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl tracking-tight">
                  Email Notifications
                </CardTitle>
                <CardDescription className="text-xs uppercase tracking-[0.2em]">
                  Manage email notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-foreground/5">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Order Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive emails for new orders</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-4 border-b border-foreground/5">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Low Stock Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified when products are low in stock
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Customer Inquiries</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive customer contact form submissions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button className="h-12 rounded-full bg-gradient-ink px-8 text-xs uppercase tracking-[0.2em] shadow-soft hover:shadow-luxe">
                  Save Changes
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
                    Free Shipping Threshold
                  </Label>
                  <Input
                    id="freeShipping"
                    type="number"
                    defaultValue="100"
                    placeholder="0"
                    className="h-12 rounded-xl border-foreground/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="standardRate"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Standard Shipping Rate
                  </Label>
                  <Input
                    id="standardRate"
                    type="number"
                    defaultValue="5.99"
                    placeholder="0.00"
                    className="h-12 rounded-xl border-foreground/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="expressRate"
                    className="text-xs uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    Express Shipping Rate
                  </Label>
                  <Input
                    id="expressRate"
                    type="number"
                    defaultValue="15.99"
                    placeholder="0.00"
                    className="h-12 rounded-xl border-foreground/10"
                  />
                </div>
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">International Shipping</Label>
                    <p className="text-xs text-muted-foreground">Allow international orders</p>
                  </div>
                  <Switch />
                </div>
                <Button className="h-12 rounded-full bg-gradient-ink px-8 text-xs uppercase tracking-[0.2em] shadow-soft hover:shadow-luxe">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
