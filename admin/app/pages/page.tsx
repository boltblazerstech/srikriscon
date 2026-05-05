"use client";

import Link from "next/link";
import { FileText, Pencil } from "lucide-react";
import AdminLayout from "@/src/components/layout/AdminLayout";
import PageHeader from "@/src/components/ui/PageHeader";
import DataTable, { type Column } from "@/src/components/ui/DataTable";
import Button from "@/src/components/ui/Button";
import Badge from "@/src/components/ui/Badge";
import { useCmsPages } from "@/src/hooks/useCmsPages";
import { formatDate } from "@/src/lib/utils";
import type { CmsPage } from "@/src/types";

const columns: Column<CmsPage>[] = [
  {
    key: "icon",
    header: "",
    className: "w-10",
    cell: () => <FileText className="h-4 w-4 text-muted-foreground" />,
  },
  {
    key: "title",
    header: "Page",
    cell: (p) => (
      <div>
        <p className="font-medium text-sm text-foreground">{p.title}</p>
        <p className="text-xs text-muted-foreground font-mono">/{p.slug}</p>
      </div>
    ),
  },
  {
    key: "active",
    header: "Status",
    cell: (p) => (
      <Badge variant={p.active ? "success" : "muted"}>{p.active ? "Active" : "Inactive"}</Badge>
    ),
  },
  {
    key: "updatedAt",
    header: "Last Updated",
    cell: (p) => <span className="text-xs text-muted-foreground">{formatDate(p.updatedAt)}</span>,
  },
  {
    key: "actions",
    header: "",
    className: "w-20",
    cell: (p) => (
      <Link href={`/pages/${p.slug}`}>
        <Button variant="outline" size="sm" icon={<Pencil className="h-3.5 w-3.5" />}>
          Edit
        </Button>
      </Link>
    ),
  },
];

export default function PagesListPage() {
  const { data: pages, isLoading } = useCmsPages();

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <PageHeader
          title="CMS Pages"
          description="Edit static page content"
        />
        <DataTable
          columns={columns}
          data={pages ?? []}
          isLoading={isLoading}
          rowKey={(p) => p.id}
          emptyTitle="No CMS pages found"
          emptyDescription="Pages are created automatically from backend configuration."
        />
      </div>
    </AdminLayout>
  );
}
