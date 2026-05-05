"use client";

import Spinner from "@/src/components/ui/Spinner";
import { useCmsPage } from "@/src/hooks/useCmsPage";

export default function AboutPage() {
  const { data: page, isLoading, error } = useCmsPage("about");

  if (isLoading)
    return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;

  if (error || !page)
    return <FallbackAbout />;

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-6">{page.title}</h1>
      {page.content && (
        <div
          className="prose prose-sm sm:prose max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      )}
    </article>
  );
}

function FallbackAbout() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <p className="text-muted-foreground leading-relaxed">
        We are a passionate team dedicated to bringing you the best products at
        great prices. Our mission is to make quality accessible to everyone.
      </p>
    </article>
  );
}
