"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Globe, FileText, CheckCircle, Code2, Eye } from "lucide-react";
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
  title:           z.string().min(1, "Title is required"),
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
  const topRef = useRef<HTMLDivElement>(null);
  const [editorMode, setEditorMode] = useState<"visual" | "html">("visual");

  const {
    register, handleSubmit, control, reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      active: false,
    },
  });

  useEffect(() => {
    if (page) {
      reset({
        title:           page.title,
        content:         page.content ?? "",
        metaTitle:       page.metaTitle ?? "",
        metaDescription: page.metaDescription ?? "",
        active:          page.active ?? false,
      });

      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }
  }, [page, reset]);

  async function onSubmit(data: FormData) {
    if (!page?.id) return;
    try {
      await update.mutateAsync({
        id: page.id,
        body: {
          ...data,
          slug: page.slug,
        },
      });
      toast.success("Page updated successfully!");
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-32">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div ref={topRef} className="p-6 max-w-6xl mx-auto space-y-6 min-w-0">
        {/* Header */}
        <PageHeader
          title={page?.title ?? slug}
          description={`Slug: /${slug}`}
          action={
            <Link href="/pages">
              <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
                Back to CMS Pages
              </Button>
            </Link>
          }
        />

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0">
          
          {/* Main Column (8 Cols) — Title & Content */}
          <div className="lg:col-span-8 space-y-6 min-w-0 h-auto">
            <div className="bg-surface rounded-xl border border-border p-6 space-y-5 shadow-sm h-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
                    Page Content
                  </h2>
                </div>
                
                {/* Visual / HTML Mode Toggle */}
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => setEditorMode("visual")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      editorMode === "visual"
                        ? "bg-white text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" /> Visual
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode("html")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      editorMode === "html"
                        ? "bg-white text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Code2 className="h-3.5 w-3.5" /> HTML Source
                  </button>
                </div>
              </div>

              <Input
                label="Page Title"
                {...register("title")}
                error={errors.title?.message}
                placeholder="e.g. About Us"
              />

              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <div>
                    {editorMode === "visual" ? (
                      <RichTextEditor
                        label="Rich Content"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        minHeight={160}
                        maxHeight={360}
                      />
                    ) : (
                      <Textarea
                        label="HTML Code Content"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        rows={14}
                        className="font-mono text-xs leading-relaxed"
                        placeholder="<h2>About Us</h2>..."
                      />
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Side Column (4 Cols) — Status & SEO */}
          <div className="lg:col-span-4 space-y-6 min-w-0 h-auto">
            
            {/* Publish & Action Card */}
            <div className="bg-surface rounded-xl border border-border p-6 space-y-5 shadow-sm h-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
                    Status
                  </h2>
                </div>
              </div>

              <Controller
                control={control}
                name="active"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Published"
                    description="Live on storefront"
                  />
                )}
              />

              <div className="pt-3 border-t border-border">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  size="lg"
                  className="w-full justify-center"
                  icon={<Save className="h-4 w-4" />}
                >
                  Save Page
                </Button>
              </div>
            </div>

            {/* SEO Card */}
            <div className="bg-surface rounded-xl border border-border p-6 space-y-5 shadow-sm h-auto">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Globe className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
                  SEO Metadata
                </h2>
              </div>

              <Input
                label="Meta Title"
                {...register("metaTitle")}
                hint="Defaults to page title"
                placeholder="Meta title..."
              />

              <Textarea
                label="Meta Description"
                {...register("metaDescription")}
                rows={3}
                hint="150–160 characters recommended"
                placeholder="Meta description..."
              />
            </div>

          </div>

        </form>
      </div>
    </AdminLayout>
  );
}
