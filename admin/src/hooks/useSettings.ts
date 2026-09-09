import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/config/api";
import type { ApiResponse, StoreSettings } from "@/src/types";

// Backend: GET /api/settings  (returns Map<String,String> of all settings, admin-only)
export function useStoreSettings(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<StoreSettings>>(
        "/api/settings"
      );
      return data.data;
    },
    staleTime: 300_000,
    enabled,
  });
}

// Backend: PUT /api/settings/batch  — upsert multiple key/value pairs at once
// Body: Array<{ key: string; value: string; group?: string; isPublic?: boolean }>
export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Partial<StoreSettings>) => {
      // Convert the settings object into the array format the backend expects
      const requests = Object.entries(body).map(([key, value]) => ({
        key,
        value: String(value ?? ""),
        "public": true,
      }));
      const { data } = await api.put<ApiResponse<StoreSettings>>(
        "/api/settings/batch",
        requests
      );
      return data.data;
    },
    onSuccess: (updatedList) => {
      qc.setQueryData(["admin", "settings"], (old: any) => {
        const next = { ...old };
        if (Array.isArray(updatedList)) {
          updatedList.forEach((s: any) => {
            if (s && s.key) {
              next[s.key] = s.value ?? "";
            }
          });
        }
        return next;
      });
    },
  });
}
