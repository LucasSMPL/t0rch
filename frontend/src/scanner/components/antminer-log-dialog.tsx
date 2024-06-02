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
  import { useState } from "react";
  
  export const ShowLogsDialog = ({
    miners,
  }: {
    miners: ScannedIp[];
  }) => {
    const { toast } = useToast();
    const [, setLoading] = useState(false);
    const [logs, setLogs] = useState("");
  
    const handleShowLogs = async (miners: ScannedIp[]) => {
      setLoading(true);
      const response = await fetch("http://localhost:7070/log", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
        setLogs((prevLogs) => prevLogs + res.value);
      }
      setLoading(false);
      toast({
        title: "Logs Fetched",
        variant: "default",
      });
    };
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Show Logs</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Miner Logs</AlertDialogTitle>
            <AlertDialogDescription>
              Logs from the selected miners.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div style={{ whiteSpace: "pre-wrap", maxHeight: "300px", overflowY: "scroll" }}>
            {logs}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleShowLogs(miners)}>Fetch Log</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  