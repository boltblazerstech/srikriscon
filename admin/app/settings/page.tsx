"use client";

import { useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Textarea from "@/src/components/ui/Textarea";
import ImageUpload from "@/src/components/ui/ImageUpload";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";
import { useStoreSettings, useUpdateSettings } from "@/src/hooks/useSettings";
import { extractApiError } from "@/src/lib/utils";

const schema = z.object({
  storeName:              z.string().min(1, "Required"),
  storeTagline:           z.string().optional(),
  logoUrl:                z.string().optional(),
  faviconUrl:             z.string().optional(),
  storeEmail:             z.string().email("Invalid email"),
  storePhone:             z.string().min(1, "Required"),
  whatsappNumber:         z.string().optional(),
  storeAddress:           z.string().min(1, "Required"),
  gstNumber:              z.string().optional(),
  currency:               z.string().min(1, "Required"),
  currencySymbol:         z.string().min(1, "Required"),
  freeShippingThreshold:  z.number().min(0),
  shippingFee:            z.number().min(0),
  razorpayKeyId:          z.string().optional(),
  googleAnalyticsId:      z.string().optional(),
  facebookUrl:            z.string().optional(),
  instagramUrl:           z.string().optional(),
  youtubeUrl:             z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function SettingsPage() {
  const { data: settings, isLoading } = useStoreSettings();
  const update = useUpdateSettings();

  const {
    register, handleSubmit, control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: settings ? {
      storeName:             settings.storeName,
      storeTagline:          settings.storeTagline ?? "",
      logoUrl:               settings.logoUrl ?? "",
      faviconUrl:            settings.faviconUrl ?? "",
      storeEmail:            settings.storeEmail,
      storePhone:            settings.storePhone,
      whatsappNumber:        settings.whatsappNumber ?? "",
      storeAddress:          settings.storeAddress,
      gstNumber:             settings.gstNumber ?? "",
      currency:              settings.currency,
      currencySymbol:        settings.currencySymbol,
      freeShippingThreshold: Number(settings.freeShippingThreshold ?? 0),
      shippingFee:           Number(settings.shippingFee ?? 0),
      razorpayKeyId:         settings.razorpayKeyId ?? "",
      googleAnalyticsId:     settings.googleAnalyticsId ?? "",
      facebookUrl:           settings.facebookUrl ?? "",
      instagramUrl:          settings.instagramUrl ?? "",
      youtubeUrl:            settings.youtubeUrl ?? "",
    } : undefined,
  });

  async function onSubmit(data: FormData) {
    try {
      await update.mutateAsync(data);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <PageHeader title="Settings" description="Configure your store" />

        <form onSubmit={handleSubmit(onSubmit, (errs) => {
          console.error("Form validation errors:", errs);
          const firstError = Object.values(errs)[0]?.message;
          toast.error(firstError ? String(firstError) : "Please check required fields");
        })}>
          <Tabs.Root defaultValue="general">
            <Tabs.List className="flex gap-1 border-b border-border mb-6">
              {["general", "contact", "social", "integrations"].map((tab) => (
                <Tabs.Trigger
                  key={tab}
                  value={tab}
                  className="px-4 py-2 text-sm font-medium capitalize text-muted-foreground border-b-2 border-transparent -mb-px
                    data-[state=active]:text-primary data-[state=active]:border-primary transition-colors"
                >
                  {tab}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* General */}
            <Tabs.Content value="general" className="space-y-4">
              <Card title="Branding">
                <Input label="Store Name" {...register("storeName")} error={errors.storeName?.message} />
                <Input label="Tagline" {...register("storeTagline")} placeholder="Your slogan here" />
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={control}
                    name="logoUrl"
                    render={({ field }) => (
                      <ImageUpload
                        label="Logo"
                        value={field.value || undefined}
                        onChange={(url) => field.onChange(url ?? "")}
                        folder="settings"
                        aspectRatio="aspect-video"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="faviconUrl"
                    render={({ field }) => (
                      <ImageUpload
                        label="Favicon"
                        value={field.value || undefined}
                        onChange={(url) => field.onChange(url ?? "")}
                        folder="settings"
                        aspectRatio="aspect-square"
                      />
                    )}
                  />
                </div>
              </Card>

              <Card title="Currency & Shipping">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Currency Code" {...register("currency")} placeholder="INR" error={errors.currency?.message} />
                  <Input label="Currency Symbol" {...register("currencySymbol")} placeholder="₹" error={errors.currencySymbol?.message} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Free Shipping Threshold"
                    type="number"
                    {...register("freeShippingThreshold", { valueAsNumber: true })}
                    error={errors.freeShippingThreshold?.message}
                    hint="Set 0 to disable"
                  />
                  <Input
                    label="Default Shipping Fee"
                    type="number"
                    {...register("shippingFee", { valueAsNumber: true })}
                    error={errors.shippingFee?.message}
                  />
                </div>
              </Card>
              <div className="flex justify-end pt-2">
                <Button type="submit" loading={isSubmitting} disabled={!isDirty}>Save General Settings</Button>
              </div>
            </Tabs.Content>

            {/* Contact */}
            <Tabs.Content value="contact" className="space-y-4">
              <Card title="Contact Information">
                <Input label="Email" type="email" {...register("storeEmail")} error={errors.storeEmail?.message} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Phone" {...register("storePhone")} placeholder="+91 98765 43210" error={errors.storePhone?.message} />
                  <Input label="WhatsApp Number" {...register("whatsappNumber")} placeholder="+91 98765 43210" />
                </div>
                <Textarea
                  label="Address"
                  {...register("storeAddress")}
                  rows={3}
                  error={errors.storeAddress?.message}
                />
                <Input label="GST Number" {...register("gstNumber")} placeholder="22AAAAA0000A1Z5" />
              </Card>
              <div className="flex justify-end pt-2">
                <Button type="submit" loading={isSubmitting} disabled={!isDirty}>Save Contact Settings</Button>
              </div>
            </Tabs.Content>

            {/* Social */}
            <Tabs.Content value="social" className="space-y-4">
              <Card title="Social Media Links">
                <Input label="Facebook URL" {...register("facebookUrl")} placeholder="https://facebook.com/yourpage" />
                <Input label="Instagram URL" {...register("instagramUrl")} placeholder="https://instagram.com/yourhandle" />
                <Input label="YouTube URL" {...register("youtubeUrl")} placeholder="https://youtube.com/@yourchannel" />
              </Card>
              <div className="flex justify-end pt-2">
                <Button type="submit" loading={isSubmitting} disabled={!isDirty}>Save Social Links</Button>
              </div>
            </Tabs.Content>

            {/* Integrations */}
            <Tabs.Content value="integrations" className="space-y-4">
              <Card title="Payment">
                <Input
                  label="Razorpay Key ID"
                  {...register("razorpayKeyId")}
                  placeholder="rzp_live_..."
                  hint="Public key — never enter your secret key here"
                />
              </Card>
              <Card title="Analytics">
                <Input
                  label="Google Analytics Measurement ID"
                  {...register("googleAnalyticsId")}
                  placeholder="G-XXXXXXXXXX"
                />
              </Card>
              <div className="flex justify-end pt-2">
                <Button type="submit" loading={isSubmitting} disabled={!isDirty}>Save Integrations</Button>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </form>
      </div>
    </AdminLayout>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
