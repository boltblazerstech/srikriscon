"use client";

import Spinner from "@/src/components/ui/Spinner";
import { useCmsPage } from "@/src/hooks/useCmsPage";

export default function PrivacyPolicyPage() {
  const { data: page, isLoading } = useCmsPage("privacy-policy");

  if (isLoading)
    return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">{page?.title ?? "Privacy Policy"}</h1>
      <p className="text-xs text-muted-foreground mb-8" suppressHydrationWarning>
        Last updated: {new Date().getFullYear()}
      </p>
      {page?.content ? (
        <div
          className="prose prose-sm sm:prose max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <p className="text-muted-foreground">Privacy policy content coming soon.</p>
      )}
    </article>
  );
}
