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
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast";
import { ScannedIp } from "@/lib/types";
import { useState } from "react";
  
export const FactoryResetButton = ({
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
    const [, setLoading] = useState(false);
    const handleFactoryReset = async (miners: ScannedIp[]) => {
      setLoading(true);
      const response = await fetch("http://localhost:7070/factory_reset", {
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
        title: "Factory Reset Command Sent",
        variant: "default",
      });
    };
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Factory Reset</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will factory reset the Antminer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleFactoryReset(miners)}>Factory Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  