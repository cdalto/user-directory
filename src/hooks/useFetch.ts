import { useEffect, useState } from "react";

import type { FetchResult } from "@/types/FetchResult";

export function useFetch<T>(url: string): FetchResult<T> {
  const [result, setResult] = useState<FetchResult<T>>({
    data: null, loading: true, error: null
  });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json() as T;
        setResult({ data, loading: false, error: null });
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") return;

        setResult({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    }

    load();

    return () => controller.abort();
  }, [url]);

  return result;
}