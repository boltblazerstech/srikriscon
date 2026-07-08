"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import DataTable, { type Column } from "@/src/components/ui/DataTable";
import Button from "@/src/components/ui/Button";
import Input from "@/src/components/ui/Input";
import Switch from "@/src/components/ui/Switch";
import Badge from "@/src/components/ui/Badge";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import Pagination from "@/src/components/ui/Pagination";
import Select from "@/src/components/ui/Select";
import { useAdminProducts, useDeleteProduct, useToggleProductActive } from "@/src/hooks/useProducts";
import { useAllCategories } from "@/src/hooks/useCategories";
import { formatPrice, extractApiError } from "@/src/lib/utils";
import type { Product } from "@/src/types";

export default function ProductsPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { data, isLoading } = useAdminProducts({
    page,
    search: search || undefined,
    categoryId: categoryId || undefined,
  });
  const { data: categories } = useAllCategories();
  const del    = useDeleteProduct();
  const toggle = useToggleProductActive();

  const categoryOptions = [
    { value: "", label: "All categories" },
    ...(categories ?? []).map((c) => ({ value: String(c.id), label: c.name })),
  ];

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await del.mutateAsync(deleteTarget.id);
      toast.success("Product deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(extractApiError(err));
    }
  }

  function handleToggle(product: Product, active: boolean) {
    toggle.mutate(
      { id: product.id, active },
      { onError: (err) => toast.error(extractApiError(err)) }
    );
  }

  const columns: Column<Product>[] = [
    {
      key: "image",
      header: "Image",
      cell: (p) =>
        p.images[0] ? (
          <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-border flex-shrink-0">
            <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-lg bg-muted" />
        ),
    },
    {
      key: "name",
      header: "Product",
      cell: (p) => (
        <div>
          <p className="font-medium text-sm text-foreground line-clamp-1">{p.name}</p>
          <p className="text-xs text-muted-foreground font-mono">{p.slug}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (p) =>
        p.categoryName ? (
          <Badge variant="muted">{p.categoryName}</Badge>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    {
      key: "price",
      header: "Price",
      cell: (p) => (
        <span className="font-semibold text-sm">
          {formatPrice(p.startingPrice ?? p.price)}
        </span>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      cell: (p) => (
        <span
          className={
            p.stockQuantity === 0
              ? "text-destructive font-semibold text-sm"
              : "text-sm"
          }
        >
          {p.stockQuantity}
        </span>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      cell: (p) =>
        p.featured ? (
          <Badge variant="primary">Featured</Badge>
        ) : null,
    },
    {
      key: "active",
      header: "Active",
      cell: (p) => (
        <Switch
          checked={p.active}
          onCheckedChange={(v) => handleToggle(p, v)}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      cell: (p) => (
        <div className="flex gap-1">
          <Link href={`/products/${p.id}`}>
            <Button variant="ghost" size="sm">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteTarget(p)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <PageHeader
          title="Products"
          description="Manage your product catalogue"
          action={
            <Link href="/products/new">
              <Button icon={<Plus className="h-4 w-4" />}>Add Product</Button>
            </Link>
          }
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <form
            className="flex-1 flex gap-2"
            onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(0); }}
          >
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products…"
              prefix={<Search className="h-3.5 w-3.5" />}
              suffix={
                searchInput ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      setSearch("");
                      setPage(0);
                    }}
                    className="p-1 hover:bg-muted rounded text-muted-foreground transition-colors flex items-center justify-center"
                    title="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null
              }
              className="flex-1"
            />
            <Button type="submit" variant="secondary" size="md">Search</Button>
          </form>
          <Select
            value={categoryId}
            onChange={(v) => { setCategoryId(v); setPage(0); }}
            options={categoryOptions}
            className="w-48"
          />
          {(search || categoryId) && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSearchInput("");
                setSearch("");
                setCategoryId("");
                setPage(0);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Reset Filters
            </Button>
          )}
        </div>

        <DataTable
          columns={columns}
          data={data?.content ?? []}
          isLoading={isLoading}
          rowKey={(p) => p.id}
          skeletonRows={8}
          emptyTitle="No products found"
          emptyAction={{
            label: "Add Product",
            onClick: () => window.location.href = "/products/new",
          }}
        />

        {data && data.totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        description={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </AdminLayout>
  );
}
