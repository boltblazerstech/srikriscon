"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import type { SettingsMap } from "@/src/types";

export function useSettings() {
  return useQuery<SettingsMap>({
    queryKey: ["settings"],
    queryFn: () =>
      api.get<SettingsMap>("/api/settings/public").then((r) => r.data),
    staleTime: Infinity, // Settings rarely change; refetch on window focus is enough
  });
}

/** Convenience hook that returns a single setting value. */
export function useSetting(key: string) {
  const { data, ...rest } = useSettings();
  return { value: data?.[key] ?? null, ...rest };
}
