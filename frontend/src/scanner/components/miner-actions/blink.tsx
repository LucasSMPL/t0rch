import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScannedIp } from "@/lib/types";
import axios from "axios";
import { useMutation } from "react-query";

export const BlinkAction = ({ miners }: { miners: ScannedIp[] }) => {
  const { toast } = useToast();

  const blink = useMutation(
    async (m: ScannedIp[]) => {
      await axios.post(
        "http://localhost:7070/blink",
        m.map((x) => x.ip)
      );
    },
    {
      onSuccess: () => {
        toast({
          title: "Blink commands sent successfully",
          variant: "success",
        });
      },
      onError: (e) => {
        console.log(e);
        toast({
          title: "Something went wrong!",
          variant: "destructive",
        });
      },
    }
  );

  return (
    <Button
      className="mr-4"
      variant="outline"
      isLoading={blink.isLoading}
      onClick={() => blink.mutate(miners)}
    >
      Blink LED
    </Button>
  );
};
