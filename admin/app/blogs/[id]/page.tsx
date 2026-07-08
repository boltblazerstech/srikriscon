"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Textarea from "@/src/components/ui/Textarea";
import ImageUpload from "@/src/components/ui/ImageUpload";
import RichTextEditor from "@/src/components/ui/RichTextEditor";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";
import { useAdminBlog, useUpdateBlog } from "@/src/hooks/useBlogs";
import { extractApiError } from "@/src/lib/utils";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  readTime: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { data: blog, isLoading } = useAdminBlog(id);
  const updateMutation = useUpdateBlog();
  const [isSlugEdited, setIsSlugEdited] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      author: "",
      imageUrl: "",
      readTime: "",
    },
  });

  useEffect(() => {
    if (blog) {
      reset({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt ?? "",
        content: blog.content,
        category: blog.category ?? "",
        author: blog.author ?? "",
        imageUrl: blog.imageUrl ?? "",
        readTime: blog.readTime ?? "",
      });
    }
  }, [blog, reset]);

  const title = watch("title");

  useEffect(() => {
    if (title && !isSlugEdited) {
      setValue("slug", slugify(title), { shouldDirty: true });
    }
  }, [title, isSlugEdited, setValue]);

  async function onSubmit(data: FormData) {
    try {
      await updateMutation.mutateAsync({
        id,
        body: {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || "",
          content: data.content,
          category: data.category || "",
          author: data.author || "",
          imageUrl: data.imageUrl || "",
          readTime: data.readTime || "",
        },
      });
      toast.success("Blog post updated successfully");
      router.push("/blogs");
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <PageHeader
          title="Edit Blog"
          description="Modify your website's journal article"
          action={
            <Link href="/blogs">
              <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
                Back to Blogs
              </Button>
            </Link>
          }
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-xl border border-border p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Title"
                placeholder="e.g. The Future of Packaging"
                error={errors.title?.message}
                {...register("title")}
              />

              <Input
                label="Slug"
                placeholder="e.g. future-of-packaging"
                error={errors.slug?.message}
                {...register("slug", {
                  onChange: () => setIsSlugEdited(true),
                })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Author"
                placeholder="e.g. Aditya Sharma"
                error={errors.author?.message}
                {...register("author")}
              />

              <Input
                label="Category"
                placeholder="e.g. Insights"
                error={errors.category?.message}
                {...register("category")}
              />

              <Input
                label="Read Time"
                placeholder="e.g. 5 min read"
                error={errors.readTime?.message}
                {...register("readTime")}
              />
            </div>

            <Controller
              control={control}
              name="imageUrl"
              render={({ field }) => (
                <ImageUpload
                  label="Cover Image"
                  value={field.value || undefined}
                  onChange={field.onChange}
                  error={errors.imageUrl?.message}
                />
              )}
            />

            <Textarea
              label="Excerpt"
              placeholder="A short summary of your article to show in the list view..."
              rows={3}
              error={errors.excerpt?.message}
              {...register("excerpt")}
            />

            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <RichTextEditor
                  label="Content"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.content?.message}
                  minHeight={300}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/blogs">
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!isDirty || isSubmitting}
              icon={<Save className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
