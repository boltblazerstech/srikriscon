"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Textarea from "@/src/components/ui/Textarea";
import Switch from "@/src/components/ui/Switch";
import RichTextEditor from "@/src/components/ui/RichTextEditor";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";
import { useCmsPage, useUpdateCmsPage } from "@/src/hooks/useCmsPages";
import { extractApiError } from "@/src/lib/utils";

const schema = z.object({
  title:           z.string().min(1, "Required"),
  content:         z.string().optional(),
  metaTitle:       z.string().optional(),
  metaDescription: z.string().optional(),
  active:          z.boolean(),
});
type FormData = z.infer<typeof schema>;

export default function EditPagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: page, isLoading } = useCmsPage(slug);
  const update = useUpdateCmsPage();

  const {
    register, handleSubmit, control, reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", content: "", metaTitle: "", metaDescription: "", active: true },
  });

  useEffect(() => {
    if (page) {
      reset({
        title:           page.title,
        content:         page.content ?? "",
        metaTitle:       page.metaTitle ?? "",
        metaDescription: page.metaDescription ?? "",
        active:          page.active,
      });
    }
  }, [page, reset]);

  async function onSubmit(data: FormData) {
    if (!page?.id) return;
    try {
      await update.mutateAsync({ id: page.id, body: data });
      toast.success("Page saved");
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
      <div className="p-6 max-w-4xl mx-auto">
        <PageHeader
          title={page?.title ?? slug}
          description={`/${slug}`}
          action={
            <Link href="/pages">
              <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>Back</Button>
            </Link>
          }
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Section title="Page Content">
            <Input label="Page Title" {...register("title")} error={errors.title?.message} />
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <RichTextEditor
                  label="Content"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  minHeight={300}
                />
              )}
            />
            <Controller
              control={control}
              name="active"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} label="Published" />
              )}
            />
          </Section>

          <Section title="SEO">
            <Input
              label="Meta Title"
              {...register("metaTitle")}
              hint="Defaults to page title"
            />
            <Textarea
              label="Meta Description"
              {...register("metaDescription")}
              rows={2}
              hint="150–160 characters recommended"
            />
          </Section>

          <div className="flex gap-3 justify-end pb-6">
            <Button type="submit" loading={isSubmitting} size="lg">Save Page</Button>
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

