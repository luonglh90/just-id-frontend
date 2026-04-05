import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef, useCallback, useImperativeHandle, forwardRef } from "react";

export interface TurnstileWidgetRef {
  getToken: () => string | null;
  reset: () => void;
}

interface TurnstileWidgetProps {
  onSuccess?: (token: string) => void;
  onError?: () => void;
}

export const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  function TurnstileWidget({ onSuccess, onError }, ref) {
    const turnstileRef = useRef<TurnstileInstance>(null);
    const tokenRef = useRef<string | null>(null);

    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

    useImperativeHandle(ref, () => ({
      getToken: () => tokenRef.current,
      reset: () => {
        tokenRef.current = null;
        turnstileRef.current?.reset();
      },
    }));

    const handleSuccess = useCallback(
      (token: string) => {
        tokenRef.current = token;
        onSuccess?.(token);
      },
      [onSuccess]
    );

    const handleError = useCallback(() => {
      tokenRef.current = null;
      onError?.();
    }, [onError]);

    return (
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={handleSuccess}
        onError={handleError}
        onExpire={() => {
          tokenRef.current = null;
          turnstileRef.current?.reset();
        }}
        options={{
          size: "invisible",
          theme: "dark",
        }}
      />
    );
  }
);
