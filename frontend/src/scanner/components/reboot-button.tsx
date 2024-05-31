import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScannedIp } from "@/lib/types";
import { useState } from "react";

export const RebootButton = ({
  miners,
}: // loading,
// setLoading,
// setProgress,
{
  miners: ScannedIp[];
  // loading: boolean;
  // setLoading: Dispatch<SetStateAction<boolean>>;
  // setProgress: Dispatch<SetStateAction<number>>;
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const handleReboot = async (miners: ScannedIp[]) => {
    setLoading(true);
    const response = await fetch("http://localhost:7070/reboot", {
      method: "POST",
      headers: {
        "Content-Type": "text/event-stream",
      },
      body: JSON.stringify(miners.map((x) => x.ip)),
    });
    const reader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();
    if (!reader) return;
    let isDone = false;

    while (!isDone) {
      const res = await reader.read();
      if (res.done) {
        isDone = true;
        break;
      }
      // const parsed = res.value.split("\n\n").filter((x) => x);
      // setProgress((prev) => prev + (parsed.length / miners.length) * 100);
    }
    setLoading(false);
    toast({
      title: "Reboot commands sent successfully",
      variant: "default",
    });
  };
  return (
    <Button
      className="mr-4"
      disabled={loading}
      onClick={() => handleReboot(miners)}
    >
      REBOOT
    </Button>
  );
};
