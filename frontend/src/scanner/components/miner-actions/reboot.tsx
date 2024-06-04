import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScannedIp } from "@/lib/types";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import axios from "axios";
import { useMutation } from "react-query";

export const RebootAction = ({ miners }: { miners: ScannedIp[] }) => {
  const { toast } = useToast();
  const reboot = useMutation(
    async (m: ScannedIp[]) => {
      await axios.post(
        "http://localhost:7070/reboot",
        m.map((x) => x.ip)
      );
    },
    {
      onSuccess: () => {
        toast({
          title: "Reboot commands sent successfully",
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
          variant={"outline"}
          className="mr-4"
          isLoading={reboot.isLoading}
        >
          Reboot {miners.length > 1 ? "Miners" : "Miner"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => reboot.mutate(miners)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
