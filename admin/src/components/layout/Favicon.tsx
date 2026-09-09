"use client";

import { useEffect } from "react";
import { useStoreSettings } from "@/src/hooks/useSettings";
import { useAuth } from "@/src/hooks/useAuth";

export default function Favicon() {
  const { token } = useAuth();
  const { data: settings } = useStoreSettings(!!token);
  const faviconUrl = settings?.faviconUrl;

  useEffect(() => {
    if (faviconUrl) {
      // Find all icon links in head and update them to prevent duplicates/collisions
      const links = document.querySelectorAll<HTMLLinkElement>(
        "link[rel='icon'], link[rel='shortcut icon']"
      );
      
      if (links.length > 0) {
        links.forEach((link) => {
          link.href = faviconUrl;
        });
      } else {
        const link = document.createElement("link");
        link.rel = "shortcut icon";
        link.href = faviconUrl;
        document.head.appendChild(link);
      }
    }
  }, [faviconUrl]);

  return null;
}
