"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import Button from "@/src/components/ui/Button";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";
import EmptyState from "@/src/components/ui/EmptyState";
import { useAdminBlogs, useDeleteBlog } from "@/src/hooks/useBlogs";
import { extractApiError, formatDate } from "@/src/lib/utils";
import type { BlogPost } from "@/src/types";

export default function BlogsPage() {
  const router = useRouter();
  const { data: blogs, isLoading } = useAdminBlogs();
  const deleteMutation = useDeleteBlog();
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Blog post deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <PageHeader
          title="Blogs"
          description="Manage your website's journal, articles, and industry insights"
          action={
            <Link href="/blogs/new">
              <Button icon={<Plus className="h-4 w-4" />}>Create Blog</Button>
            </Link>
          }
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : !blogs || blogs.length === 0 ? (
          <EmptyState
            title="No blog posts found"
            description="Get started by creating your first blog article."
            action={{
              label: "Create Blog",
              onClick: () => router.push("/blogs/new"),
              icon: <Plus className="h-4 w-4" />,
            }}
          />
        ) : (
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm text-foreground">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-medium max-w-md truncate">
                        {blog.title}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{blog.author || "—"}</td>
                      <td className="px-6 py-4">
                        {blog.category ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {blog.category}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDate(blog.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/blogs/${blog.id}`}>
                            <Button variant="outline" size="sm" icon={<Pencil className="h-3.5 w-3.5" />} title="Edit" />
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/5 hover:border-destructive/30"
                            icon={<Trash2 className="h-3.5 w-3.5" />}
                            onClick={() => setDeleteTarget(blog)}
                            title="Delete"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={Boolean(deleteTarget)}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          title="Delete Blog Post"
          description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      </div>
    </AdminLayout>
  );
}
