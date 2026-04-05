import { useState, useCallback } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { formatCountdown } from "@/lib/utils";
import { CheckOutlined, CopyOutlined, LinkOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Input, Space, Typography } from "antd";

const { Text } = Typography;

interface ResultDisplayProps {
  url: string;
  expiresAt: number;
  onCreateAnother: () => void;
}

export function ResultDisplay({ url, expiresAt, onCreateAnother }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);
  const remaining = useCountdown(expiresAt);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  return (
    <div className="animate-slide-up space-y-4">
      {/* Success Message */}
      <Alert
        message="Content created successfully!"
        type="success"
        showIcon
      />

      {/* URL Display */}
      <Space.Compact style={{ width: '100%' }} size="large">
        <Input 
          value={url} 
          readOnly 
          style={{ fontFamily: 'monospace' }} 
        />
        <Button 
          type="primary" 
          icon={copied ? <CheckOutlined /> : <CopyOutlined />} 
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
      </Space.Compact>

      {/* Expiry Countdown */}
      <div className="flex items-center justify-between mt-4">
        <Space align="center" size="small" className="text-muted-foreground">
          {remaining > 0 ? (
            <>
              <ClockCircleOutlined />
              <Text>Expires in</Text>
              <Text strong className="font-mono tabular-nums">
                {formatCountdown(remaining)}
              </Text>
            </>
          ) : (
            <Text type="danger">This content has expired</Text>
          )}
        </Space>

        <Button 
          type="link" 
          icon={<LinkOutlined />} 
          onClick={onCreateAnother}
          style={{ padding: 0 }}
        >
          Create another
        </Button>
      </div>
    </div>
  );
}
