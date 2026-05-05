"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/src/components/ui/Button";
import { theme } from "@/src/config/theme";
import { whatsappLink } from "@/src/lib/utils";

const schema = z.object({
  name:    z.string().min(1, "Required"),
  email:   z.string().email("Invalid email"),
  phone:   z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

const { business } = theme;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    // Forward to WhatsApp if configured, otherwise show success (backend contact form can be wired later)
    const msg = `*Contact Form Enquiry*\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone ?? "-"}\n\nMessage:\n${data.message}`;
    if (business.whatsapp) {
      window.open(whatsappLink(business.whatsapp, msg), "_blank");
    }
    toast.success("Message sent! We'll get back to you shortly.");
    reset();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-muted-foreground mb-10">
        Have a question? We&apos;d love to hear from you.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field label="Your Name" error={errors.name?.message}>
            <input {...register("name")} className={inp()} placeholder="John Doe" />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input {...register("email")} type="email" className={inp()} placeholder="john@example.com" />
          </Field>
          <Field label="Phone (optional)" error={errors.phone?.message}>
            <input {...register("phone")} type="tel" className={inp()} placeholder="+91 98765 43210" />
          </Field>
          <Field label="Message" error={errors.message?.message}>
            <textarea
              {...register("message")}
              rows={5}
              className={`${inp()} resize-none`}
              placeholder="Tell us how we can help…"
            />
          </Field>
          <Button type="submit" loading={isSubmitting} icon={<Send className="h-4 w-4" />} size="lg" fullWidth>
            Send Message
          </Button>
        </form>

        {/* Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 space-y-5">
            {business.phone && (
              <InfoRow icon={Phone} label="Phone">
                <a href={`tel:${business.phone}`} className="text-sm text-foreground hover:text-primary transition-colors">
                  {business.phone}
                </a>
              </InfoRow>
            )}
            {business.email && (
              <InfoRow icon={Mail} label="Email">
                <a href={`mailto:${business.email}`} className="text-sm text-foreground hover:text-primary transition-colors break-all">
                  {business.email}
                </a>
              </InfoRow>
            )}
            {business.address && (
              <InfoRow icon={MapPin} label="Address">
                <p className="text-sm text-muted-foreground">{business.address}</p>
              </InfoRow>
            )}
            {business.whatsapp && (
              <InfoRow icon={MessageCircle} label="WhatsApp">
                <a
                  href={whatsappLink(business.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-success hover:underline"
                >
                  Chat with us on WhatsApp
                </a>
              </InfoRow>
            )}
          </div>

          {/* Business hours placeholder */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5">
            <h3 className="font-semibold mb-3 text-sm">Business Hours</h3>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <div className="flex justify-between"><span>Mon – Sat</span><span>9:00 AM – 6:00 PM</span></div>
              <div className="flex justify-between"><span>Sunday</span><span>Closed</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function InfoRow({ icon: Icon, label, children }: { icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  );
}

function inp() {
  return "w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors";
}
