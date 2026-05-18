import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef, useCallback, useImperativeHandle, forwardRef, useState } from "react";
import { Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export interface TurnstileWidgetRef {
  /** Renders the widget in a dialog and resolves with the token or null on timeout. */
  execute: () => Promise<string | null>;
  reset: () => void;
}

interface TurnstileWidgetProps {
  onError?: () => void;
}

export const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  function TurnstileWidget({ onError }, ref) {
    const turnstileRef = useRef<TurnstileInstance>(null);
    const tokenRef = useRef<string | null>(null);
    const resolveRef = useRef<((token: string | null) => void) | null>(null);
    const [open, setOpen] = useState(false);

    // Dev fallback: invisible test key (always passes).
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000BB";

    useImperativeHandle(ref, () => ({
      execute: () => {
        tokenRef.current = null;
        setOpen(true);
        return new Promise<string | null>((resolve) => {
          resolveRef.current = resolve;
          // Timeout after 15s if no token received
          setTimeout(() => {
            if (resolveRef.current === resolve) {
              resolveRef.current = null;
              setOpen(false);
              resolve(null);
            }
          }, 15_000);
        });
      },
      reset: () => {
        tokenRef.current = null;
        resolveRef.current = null;
        setOpen(false);
        turnstileRef.current?.reset();
      },
    }));

    const handleSuccess = useCallback((token: string) => {
      tokenRef.current = token;
      resolveRef.current?.(token);
      resolveRef.current = null;
      setOpen(false);
    }, []);

    const handleError = useCallback(() => {
      tokenRef.current = null;
      resolveRef.current?.(null);
      resolveRef.current = null;
      setOpen(false);
      onError?.();
    }, [onError]);

    return (
      <Modal
        open={open}
        footer={null}
        closable={false}
        centered
        width={360}
        maskClosable={false}
        styles={{ body: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "24px 16px" } }}
      >
        <LoadingOutlined style={{ fontSize: 24 }} spin />
        <p className="text-sm text-muted-foreground m-0">Verifying you're human...</p>
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
            size: "normal",
            theme: "light",
          }}
        />
      </Modal>
    );
  }
);
