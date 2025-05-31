"use client";

import { useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";

export function Account() {
  const { disconnect } = useDisconnect();

  return (
    <div>
      <Button onClick={() => disconnect()}>Disconnect</Button>
    </div>
  );
}
