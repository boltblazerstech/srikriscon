"use client";

import Spinner from "@/src/components/ui/Spinner";
import { useCmsPage } from "@/src/hooks/useCmsPage";

export default function TermsPage() {
  const { data: page, isLoading } = useCmsPage("terms");

  if (isLoading)
    return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">{page?.title ?? "Terms & Conditions"}</h1>
      {page?.content ? (
        <div
          className="prose prose-sm sm:prose max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <p className="text-muted-foreground">Terms and conditions content coming soon.</p>
      )}
    </article>
  );
}
