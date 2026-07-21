"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Textarea from "@/src/components/ui/Textarea";
import Switch from "@/src/components/ui/Switch";
import Select from "@/src/components/ui/Select";
import RichTextEditor from "@/src/components/ui/RichTextEditor";
import MultiImageUpload from "@/src/components/ui/MultiImageUpload";
import { useCreateProduct } from "@/src/hooks/useProducts";
import { useAllCategories } from "@/src/hooks/useCategories";
import { slugify, extractApiError } from "@/src/lib/utils";

const variantSchema = z.object({
  type:          z.string().min(1, "Required"),
  value:         z.string().min(1, "Required"),
  price:         z.preprocess((val) => val === "" || val === undefined || val === null || isNaN(Number(val)) ? null : Number(val), z.number().min(0).nullable().optional()),
  stockQuantity: z.number().int().min(0),
  active:        z.boolean(),
});

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer:   z.string().min(1, "Answer is required"),
});

const schema = z.object({
  name:            z.string().min(1, "Required"),
  slug:            z.string().min(1, "Required"),
  description:     z.string().optional(),
  price:           z.number().min(0),
  stockQuantity:   z.number().int().min(0),
  categoryId:      z.string().optional(),
  active:          z.boolean(),
  featured:        z.boolean(),
  images:          z.array(z.string()),
  variants:        z.array(variantSchema),
  faqs:            z.array(faqSchema).optional(),
  metaTitle:       z.string().optional(),
  metaDescription: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewProductPage() {
  const router = useRouter();
  const create = useCreateProduct();
  const { data: categories } = useAllCategories();

  const {
    register, handleSubmit, control, watch, setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: "", slug: "", description: "", price: 0, stockQuantity: 0,
      categoryId: "",
      active: true, featured: false, images: [], variants: [], faqs: [],
      metaTitle: "", metaDescription: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });
  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({ control, name: "faqs" });
  const nameVal = watch("name");

  useEffect(() => {
    setValue("slug", slugify(nameVal ?? ""));
  }, [nameVal, setValue]);

  const categoryOptions = [
    { value: "", label: "No category" },
    ...(categories ?? []).map((c) => ({ value: String(c.id), label: c.name })),
  ];

  async function onSubmit(data: FormData) {
    try {
      await create.mutateAsync({
        ...data,
        categoryId: data.categoryId ? Number(data.categoryId) : undefined,
        variants: data.variants.map((v) => ({ ...v, id: undefined })),
      } as any);
      toast.success("Product created");
      router.push("/products");
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <PageHeader
          title="New Product"
          action={
            <Link href="/products">
              <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
                Back
              </Button>
            </Link>
          }
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic info */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Product Name" {...register("name")} error={errors.name?.message} />
              <Input
                label="Slug"
                {...register("slug")}
                error={errors.slug?.message}
                hint="Auto-generated, editable"
              />
            </div>

            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <RichTextEditor
                  label="Description"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Price (₹)"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                error={errors.price?.message}
              />
              <Input
                label="Stock Quantity"
                type="number"
                {...register("stockQuantity", { valueAsNumber: true })}
                error={errors.stockQuantity?.message}
              />
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    label="Category"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    options={categoryOptions}
                  />
                )}
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <Controller
                control={control}
                name="active"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} label="Active" />
                )}
              />
              <Controller
                control={control}
                name="featured"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} label="Featured" />
                )}
              />
            </div>
          </Section>

          {/* Images */}
          <Section title="Product Images">
            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <MultiImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  folder="products"
                  maxFiles={8}
                  label="Upload up to 8 images — drag to reorder"
                />
              )}
            />
          </Section>

          {/* Variants */}
          <Section title="Variants">
            <p className="text-xs text-muted-foreground mb-3">
              Add variants (e.g. Size: S/M/L or Color: Red/Blue). Leave empty if the product has no variants.
            </p>
            {fields.length > 0 && (
              <div className="space-y-2 mb-3">
                <div className="grid grid-cols-12 gap-2 px-1">
                  {["Type", "Value", "Price (₹)", "Stock", "Active", ""].map((h) => (
                    <span key={h} className="col-span-2 text-xs font-medium text-muted-foreground">
                      {h}
                    </span>
                  ))}
                </div>
                {fields.map((field, i) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="col-span-2">
                      <Controller
                        control={control}
                        name={`variants.${i}.type`}
                        render={({ field: f, fieldState: { error } }) => (
                          <Select
                            value={f.value}
                            onChange={f.onChange}
                            error={error?.message}
                            options={[
                              { value: "SIZE", label: "Size" },
                              { value: "DESIGN", label: "Design" },
                              { value: "MATERIAL", label: "Material" },
                              { value: "COLOR", label: "Color" },
                            ]}
                            placeholder="Type"
                          />
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      {watch(`variants.${i}.type`) === "COLOR" ? (
                        <div className="flex items-center gap-2">
                          <Input
                            {...register(`variants.${i}.value`)}
                            placeholder="#C9A84C or Red"
                            error={errors.variants?.[i]?.value?.message}
                          />
                          <input
                            type="color"
                            value={watch(`variants.${i}.value`)?.startsWith("#") ? watch(`variants.${i}.value`) : "#000000"}
                            onChange={(e) => setValue(`variants.${i}.value`, e.target.value)}
                            className="w-10 h-9 p-0.5 border border-border rounded-lg cursor-pointer bg-white flex-shrink-0"
                          />
                        </div>
                      ) : (
                        <Input
                          {...register(`variants.${i}.value`)}
                          placeholder="Red"
                          error={errors.variants?.[i]?.value?.message}
                        />
                      )}
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`variants.${i}.price`, { valueAsNumber: true })}
                        placeholder="999"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        {...register(`variants.${i}.stockQuantity`, { valueAsNumber: true })}
                        placeholder="100"
                      />
                    </div>
                    <div className="col-span-2">
                      <Controller
                        control={control}
                        name={`variants.${i}.active`}
                        render={({ field: f }) => (
                          <Switch checked={f.value} onCheckedChange={f.onChange} />
                        )}
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => remove(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() =>
                append({ type: "", value: "", price: 0, stockQuantity: 0, active: true })
              }
            >
              Add Variant
            </Button>
          </Section>

          {/* Product FAQs */}
          <Section title="Product FAQs">
            <p className="text-xs text-muted-foreground mb-3">
              Add frequently asked questions specific to this product (e.g. warranty, MOQ, custom printing).
            </p>
            {faqFields.length > 0 && (
              <div className="space-y-4 mb-4">
                {faqFields.map((field, i) => (
                  <div
                    key={field.id}
                    className="p-4 rounded-xl border border-border bg-muted/20 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-wide">
                        FAQ #{i + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive h-7 px-2"
                        onClick={() => removeFaq(i)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                    <Input
                      label="Question"
                      {...register(`faqs.${i}.question`)}
                      error={errors.faqs?.[i]?.question?.message}
                      placeholder="e.g. What is the minimum order quantity for custom printing?"
                    />
                    <Textarea
                      label="Answer"
                      {...register(`faqs.${i}.answer`)}
                      error={errors.faqs?.[i]?.answer?.message}
                      rows={2}
                      placeholder="e.g. Our minimum order quantity for custom printed bags is 500 units."
                    />
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => appendFaq({ question: "", answer: "" })}
            >
              Add Product FAQ
            </Button>
          </Section>

          {/* SEO */}
          <Section title="SEO">
            <Input
              label="Meta Title"
              {...register("metaTitle")}
              hint="Defaults to product name if empty"
            />
            <Textarea
              label="Meta Description"
              {...register("metaDescription")}
              rows={2}
              hint="Recommended: 150–160 characters"
            />
          </Section>

          {/* Submit */}
          <div className="flex gap-3 justify-end pb-6">
            <Link href="/products">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button type="submit" loading={isSubmitting} size="lg">
              Create Product
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
