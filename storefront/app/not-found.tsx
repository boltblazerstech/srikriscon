import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-black text-foreground/5 select-none mb-4">
        404
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
        <p className="mt-3 text-muted-foreground max-w-sm mx-auto">
          We couldn&apos;t find the page you were looking for. It might have been moved or deleted.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            <Home className="h-4 w-4" /> Go Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Search className="h-4 w-4" /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
