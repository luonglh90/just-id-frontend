import { AppstoreOutlined } from "@ant-design/icons";
import type { StatusResponse } from "@/lib/api";

interface SlotCounterProps {
  status: StatusResponse | null;
  loading: boolean;
}

export function SlotCounter({ status, loading }: SlotCounterProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse-soft">
        <AppstoreOutlined className="text-base" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <AppstoreOutlined className="text-base" />
      <span>
        {status ? (
          <>
            <span className="font-bold text-base tabular-nums">
              {status.used.toLocaleString()}
            </span>
            {" active pastes"}
          </>
        ) : (
          "Unavailable"
        )}
      </span>
    </div>
  );
}
