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
import { ZapOff } from "lucide-react";

export const NukeAction = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          variant="outline"
          style={{ borderColor: "#49de80", marginRight: "25px" }}
        >
          NUKE <ZapOff className="ml-4" />
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
          <AlertDialogAction>Curtail</AlertDialogAction>
          <AlertDialogAction style={{ backgroundColor: "#5D3FD3" }}>
            Schedule
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
