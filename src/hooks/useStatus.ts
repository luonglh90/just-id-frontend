import { useState, useEffect, useCallback } from "react";
import { getStatus, type StatusResponse } from "@/lib/api";

const NORMAL_POLL_MS = 30_000;

export function useStatus() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getStatus();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    const timer = setInterval(fetchStatus, NORMAL_POLL_MS);
    return () => clearInterval(timer);
  }, [fetchStatus]);

  return { status, loading, error, refetch: fetchStatus };
}
