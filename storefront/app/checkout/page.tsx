"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useCart } from "@/src/hooks/useCart";
import { useCreateOrder } from "@/src/hooks/useOrders";
import { useRazorpay } from "@/src/hooks/useRazorpay";
import { useAuth } from "@/src/hooks/useAuth";
import Button from "@/src/components/ui/Button";
import { formatPrice, cn } from "@/src/lib/utils";
import { theme } from "@/src/config/theme";
import type { OrderRequest } from "@/src/types";

// ─── Schemas ──────────────────────────────────────────────────────────────────
const contactSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName:  z.string().min(1, "Required"),
  email:     z.string().email("Invalid email"),
  phone:     z.string().min(10, "Enter a valid 10-digit number").max(15),
});

const addressSchema = z.object({
  line1:      z.string().min(1, "Required"),
  line2:      z.string().optional(),
  city:       z.string().min(1, "Required"),
  state:      z.string().min(1, "Required"),
  postalCode: z.string().length(6, "Enter a valid 6-digit pincode"),
  country:    z.string().min(1, "Required"),
});

type ContactData = z.infer<typeof contactSchema>;
type AddressData  = z.infer<typeof addressSchema>;

const STEPS = ["Contact", "Address", "Review & Pay"] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const { user, loading } = useAuth();
  const createOrder = useCreateOrder();
  const { pay, loading: payLoading } = useRazorpay();
  const [step, setStep] = useState(0);
  const [contactData, setContactData] = useState<ContactData | null>(null);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please login to proceed to checkout");
      router.push("/login?from=/checkout");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Button onClick={() => router.push("/products")}>Browse Products</Button>
      </div>
    );
  }

  const shipping = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      {/* Stepper */}
      <ol className="flex items-center mb-10">
        {STEPS.map((label, i) => (
          <li key={label} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors",
                i < step
                  ? "bg-success text-white"
                  : i === step
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "ml-2 text-sm font-medium hidden sm:inline",
                i === step ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="flex-1 mx-3 h-px bg-border" />
            )}
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <StepMotion key="contact">
            <ContactStep
              defaultValues={
                contactData ?? {
                  firstName: user?.firstName ?? "",
                  lastName: user?.lastName ?? "",
                  email: user?.email ?? "",
                  phone: user?.phone ?? "",
                }
              }
              onNext={(data) => { setContactData(data); setStep(1); }}
            />
          </StepMotion>
        )}

        {step === 1 && (
          <StepMotion key="address">
            <AddressStep
              onBack={() => setStep(0)}
              onNext={async (address, selectedPaymentMethod) => {
                if (!contactData) return;
                const name = `${contactData.firstName} ${contactData.lastName}`;
                const req: OrderRequest = {
                  shippingName:       name,
                  shippingPhone:      contactData.phone,
                  shippingLine1:      address.line1,
                  shippingLine2:      address.line2,
                  shippingCity:       address.city,
                  shippingState:      address.state,
                  shippingPostalCode: address.postalCode,
                  shippingCountry:    address.country ?? "India",
                  paymentMethod:      selectedPaymentMethod,
                  items: items.map((i) => ({
                    productId: i.productId,
                    variantId: i.variantId,
                    quantity:  i.quantity,
                  })),
                };
                try {
                  const order = await createOrder.mutateAsync(req);
                  if (selectedPaymentMethod === "COD") {
                    clear();
                    router.push(`/order-confirmation?orderId=${order.id}`);
                  } else {
                    await pay({
                      orderId: order.id,
                      name,
                      email: contactData.email,
                      contact: contactData.phone,
                      onSuccess: () => {
                        clear();
                        router.push(`/order-confirmation?orderId=${order.id}`);
                      },
                      onError: (err) => toast.error(err.message),
                    });
                  }
                } catch (err: unknown) {
                  const msg = err instanceof Error ? err.message : "Something went wrong";
                  toast.error(msg);
                }
              }}
              loading={createOrder.isPending || payLoading}
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
          </StepMotion>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Step 1: Contact ──────────────────────────────────────────────────────────
function ContactStep({
  defaultValues,
  onNext,
}: {
  defaultValues: Partial<ContactData>;
  onNext: (data: ContactData) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name" error={errors.firstName?.message}>
          <input {...register("firstName")} className={inputCls()} placeholder="John" />
        </Field>
        <Field label="Last Name" error={errors.lastName?.message}>
          <input {...register("lastName")} className={inputCls()} placeholder="Doe" />
        </Field>
      </div>
      <Field label="Email" error={errors.email?.message}>
        <input {...register("email")} type="email" className={inputCls()} placeholder="john@example.com" />
      </Field>
      <Field label="Phone" error={errors.phone?.message}>
        <input {...register("phone")} type="tel" className={inputCls()} placeholder="+91 98765 43210" />
      </Field>
      <Button type="submit" size="lg" fullWidth icon={<ChevronRight className="h-4 w-4" />}>
        Continue to Address
      </Button>
    </form>
  );
}

// ─── Step 2 + 3: Address + Review ────────────────────────────────────────────
function AddressStep({
  onBack,
  onNext,
  loading,
  items,
  subtotal,
  shipping,
  total,
}: {
  onBack: () => void;
  onNext: (data: AddressData, paymentMethod: "COD" | "RAZORPAY") => void;
  loading: boolean;
  items: ReturnType<typeof useCart>["items"];
  subtotal: number;
  shipping: number;
  total: number;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressData>({ resolver: zodResolver(addressSchema) });

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">("RAZORPAY");

  const onSubmitForm = (data: AddressData) => {
    onNext(data, paymentMethod);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <form onSubmit={handleSubmit(onSubmitForm)} className="lg:col-span-3 space-y-4">
        <Field label="Address Line 1" error={errors.line1?.message}>
          <input {...register("line1")} className={inputCls()} placeholder="House / Flat no., Street" />
        </Field>
        <Field label="Address Line 2 (optional)" error={errors.line2?.message}>
          <input {...register("line2")} className={inputCls()} placeholder="Landmark, Colony" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" error={errors.city?.message}>
            <input {...register("city")} className={inputCls()} placeholder="Mumbai" />
          </Field>
          <Field label="State" error={errors.state?.message}>
            <input {...register("state")} className={inputCls()} placeholder="Maharashtra" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Pincode" error={errors.postalCode?.message}>
            <input {...register("postalCode")} className={inputCls()} placeholder="400001" maxLength={6} />
          </Field>
          <Field label="Country" error={errors.country?.message}>
            <input {...register("country")} className={inputCls()} defaultValue="India" readOnly />
          </Field>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-md font-semibold text-foreground">Select Payment Method</h3>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setPaymentMethod("COD")}
              className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all select-none ${
                paymentMethod === "COD"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">Cash On Delivery</span>
                <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === "COD" ? "border-primary bg-primary" : "border-muted-foreground"
                }`}>
                  {paymentMethod === "COD" && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Pay in cash when your order is delivered.</p>
            </div>

            <div
              onClick={() => setPaymentMethod("RAZORPAY")}
              className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all select-none ${
                paymentMethod === "RAZORPAY"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">Pay Online (UPI/Cards)</span>
                <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === "RAZORPAY" ? "border-primary bg-primary" : "border-muted-foreground"
                }`}>
                  {paymentMethod === "RAZORPAY" && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Pay securely via UPI, Cards, or NetBanking.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <Button variant="outline" onClick={onBack} type="button" size="lg" className="flex-1">
            Back
          </Button>
          <Button type="submit" loading={loading} size="lg" className="flex-2 flex-1">
            {paymentMethod === "COD" ? `Place Order (COD) - ${formatPrice(total)}` : `Pay & Place Order - ${formatPrice(total)}`}
          </Button>
        </div>
      </form>

      {/* Order summary sidebar */}
      <div className="lg:col-span-2">
        <div className="p-4 rounded-xl border border-border bg-muted/30 sticky top-24">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
                <span className="text-muted-foreground truncate flex-1 pr-2">
                  {item.productName}{item.variantValue ? ` (${item.variantValue})` : ""} × {item.quantity}
                </span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-border mb-3" />
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className={shipping === 0 ? "text-success" : ""}>
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between font-bold pt-1 border-t border-border">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StepMotion({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function inputCls() {
  return "w-full h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors";
}
