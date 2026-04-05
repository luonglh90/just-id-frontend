import { useState, useEffect } from "react";

/**
 * Countdown timer that ticks every second.
 * Returns remaining seconds (0 when expired).
 */
export function useCountdown(expiresAt: number | null): number {
  const [remaining, setRemaining] = useState(() =>
    expiresAt ? Math.max(0, expiresAt - Math.floor(Date.now() / 1000)) : 0
  );

  useEffect(() => {
    if (!expiresAt) {
      setRemaining(0);
      return;
    }

    const update = () => {
      const now = Math.floor(Date.now() / 1000);
      setRemaining(Math.max(0, expiresAt - now));
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  return remaining;
}
