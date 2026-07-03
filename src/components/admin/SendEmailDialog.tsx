import { useState } from "react";
import { Mail, ExternalLink, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

interface SendEmailDialogProps {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  currentStatus?: string;
}

const TEMPLATES: Record<string, { subject: string; body: string }> = {
  custom: { subject: "", body: "" },
  shipped: {
    subject: "Your order has been shipped! 📦",
    body: `Hi {name},

Great news! Your order {order} is on its way.

You can expect delivery within 3–5 business days. We'll keep you updated along the way.

Thank you for shopping with Becute Dreams Luxe!

Warm regards,
Becute Dreams Luxe`,
  },
  delivered: {
    subject: "Your order has been delivered ✨",
    body: `Hi {name},

Your order {order} has been delivered! We hope you love your items.

If you have any questions or concerns, please don't hesitate to reach out.

Thank you for shopping with Becute Dreams Luxe!

Warm regards,
Becute Dreams Luxe`,
  },
  processing: {
    subject: "Your order is being processed",
    body: `Hi {name},

We've received your order {order} and our team is now preparing it for shipment.

We'll send you another update once it's on the way.

Thank you for your patience!

Warm regards,
Becute Dreams Luxe`,
  },
  cancelled: {
    subject: "Your order has been cancelled",
    body: `Hi {name},

We're sorry to inform you that your order {order} has been cancelled.

If you believe this is a mistake or have any questions, please contact us and we'll be happy to help.

Thank you for understanding.

Warm regards,
Becute Dreams Luxe`,
  },
};

function fillTemplate(text: string, name: string, order: string): string {
  return text.replace(/{name}/g, name).replace(/{order}/g, order);
}

export function SendEmailDialog({
  customerEmail,
  customerName,
  orderNumber,
  currentStatus,
}: SendEmailDialogProps) {
  const [open, setOpen] = useState(false);

  // Pre-select the template matching the current order status, fallback to custom
  const defaultTemplate =
    currentStatus && TEMPLATES[currentStatus] ? currentStatus : "custom";

  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate);
  const [subject, setSubject] = useState(
    fillTemplate(TEMPLATES[defaultTemplate].subject, customerName, orderNumber),
  );
  const [message, setMessage] = useState(
    fillTemplate(TEMPLATES[defaultTemplate].body, customerName, orderNumber),
  );

  const handleTemplateChange = (key: string) => {
    setSelectedTemplate(key);
    setSubject(fillTemplate(TEMPLATES[key].subject, customerName, orderNumber));
    setMessage(fillTemplate(TEMPLATES[key].body, customerName, orderNumber));
  };

  const handleOpenMailClient = () => {
    const mailto = `mailto:${encodeURIComponent(customerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(mailto, "_blank");
  };

  const handleOpenChange = (next: boolean) => {
    if (next) {
      // Re-apply default when opening so it's always fresh
      const tpl = defaultTemplate;
      setSelectedTemplate(tpl);
      setSubject(fillTemplate(TEMPLATES[tpl].subject, customerName, orderNumber));
      setMessage(fillTemplate(TEMPLATES[tpl].body, customerName, orderNumber));
    }
    setOpen(next);
  };

  const canSend = subject.trim().length > 0 && message.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-12 rounded-full border-foreground/20 text-xs uppercase tracking-[0.2em] hover:border-foreground"
        >
          <Mail className="h-4 w-4 mr-2" />
          Send Email to Customer
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-tight">
            Send Email
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Composing for{" "}
            <span className="font-medium text-foreground">{customerName}</span>
            {" — "}
            <span className="font-medium text-foreground">{customerEmail}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Quick templates */}
          <div>
            <Label className="text-xs uppercase tracking-[0.2em] mb-2 block">
              Template
            </Label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(TEMPLATES).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTemplateChange(key)}
                  className={`px-3 py-1.5 rounded-full text-xs capitalize border transition-colors ${
                    selectedTemplate === key
                      ? "bg-foreground text-background border-foreground"
                      : "border-foreground/20 text-muted-foreground hover:border-foreground/50"
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* To (read-only) */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-[0.2em]">To</Label>
            <Input
              readOnly
              value={customerEmail}
              className="h-11 rounded-xl bg-muted/50 cursor-default"
            />
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <Label htmlFor="email-subject" className="text-xs uppercase tracking-[0.2em]">
              Subject
            </Label>
            <Input
              id="email-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject…"
              className="h-11 rounded-xl"
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label htmlFor="email-message" className="text-xs uppercase tracking-[0.2em]">
              Message
            </Label>
            <Textarea
              id="email-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message…"
              rows={7}
              className="rounded-xl resize-none"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Clicking <span className="font-medium text-foreground">Open in Email Client</span> will
            open your default mail app with these details pre-filled.
          </p>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button
            variant="outline"
            className="rounded-full border-foreground/20"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4 mr-1.5" />
            Cancel
          </Button>
          <Button
            onClick={handleOpenMailClient}
            disabled={!canSend}
            className="rounded-full bg-gradient-ink text-xs uppercase tracking-[0.2em] shadow-soft hover:shadow-luxe disabled:opacity-50"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Email Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
