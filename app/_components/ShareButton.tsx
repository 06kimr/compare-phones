"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PropsWithChildren } from "react";

function ShareButton({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const { toast } = useToast();
  return (
    <Button
      className={className}
      onClick={async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "주소가 복사되었습니다.",
          description: "이 페이지의 주소가 복사되었습니다.",
        });
      }}
    >
      {children}
    </Button>
  );
}

export default ShareButton;
