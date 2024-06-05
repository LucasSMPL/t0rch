import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScannedIp } from "@/lib/types";
import axios from "axios";
import { ZapOff } from "lucide-react";
import { useMutation } from "react-query";

export const SleepAction = ({ miners }: { miners: ScannedIp[] }) => {
  const { toast } = useToast();
  const sleep = useMutation(
    async () => {
      await axios.post("http://localhost:7070/config", {
        ips: miners.map((x) => x.ip),
        mode: 1,
      });
    },
    {
      onSuccess: () => {
        toast({
          title: "Sleep commands sent successfully",
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
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          variant="outline"
          style={{ borderColor: "#49de80", marginRight: "25px" }}
        >
          Sleep <ZapOff className="ml-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will send curtailment commands to
            all Antminers On Scan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => sleep.mutate()}>
            Curtail
          </AlertDialogAction>
          {/* <AlertDialogAction style={{ backgroundColor: "#5D3FD3" }}>
            Schedule
          </AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
