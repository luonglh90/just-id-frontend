import { useCountdown } from "@/hooks/useCountdown";
import { formatCountdown } from "@/lib/utils";
import { AppstoreOutlined } from "@ant-design/icons";
import type { StatusResponse } from "@/lib/api";

interface SlotCounterProps {
  status: StatusResponse | null;
  loading: boolean;
}

export function SlotCounter({ status, loading }: SlotCounterProps) {
  const nextExpiry = status?.nextExpiryAt ?? null;
  const remaining = useCountdown(nextExpiry);
  const isFull = status !== null && status.available === 0;

  const getColorClass = () => {
    if (!status) return "text-muted-foreground";
    const ratio = status.available / status.total;
    if (ratio === 0) return "text-slot-full";
    if (ratio < 0.1) return "text-slot-warning";
    return "text-slot-available";
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse-soft">
        <AppstoreOutlined className="text-base" />
        <span>Loading slots...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center gap-2 text-sm font-medium ${getColorClass()}`}>
        <AppstoreOutlined className="text-base" />
        <span>
          {status ? (
            <>
              <span className="font-bold text-base tabular-nums">
                {status.available.toLocaleString()}
              </span>
              {" / "}
              <span className="text-muted-foreground">
                {status.total.toLocaleString()}
              </span>
              {" available"}
            </>
          ) : (
            "Unavailable"
          )}
        </span>
      </div>

      {isFull && remaining > 0 && (
        <div className="flex items-center gap-1.5 text-sm text-slot-warning animate-pulse-soft">
          <span>Next slot in:</span>
          <span className="font-mono font-bold tabular-nums">
            {formatCountdown(remaining)}
          </span>
        </div>
      )}
    </div>
  );
}
