import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"; // Adjust the import path as necessary
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Adjust the import path as necessary
import { ScrollArea } from "@/components/ui/scroll-area"; // Adjust the import path as necessary
import axios from 'axios';
import { ScannedIp } from "@/lib/types"; // Adjust the import path as necessary

export default function Component({ miner }: { miner: ScannedIp }) {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<string | null>(null); // State to hold logs

  useEffect(() => {
    const fetchLogs = async () => {
      if (open) {
        try {
          const response = await axios.get(`http://localhost:7070/logs/${miner.ip}`);
          setLogs(response.data); // Set the fetched logs
        } catch (error) {
          console.error("Error fetching logs:", error);
        }
      }
    };

    fetchLogs();
  }, [open, miner.ip,]); // Fetch logs when dialog opens

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Read Miner Log
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[650px] mx-auto p-6 space-y-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Log for{' '}
            <a
              style={{ color: '#e94d1b' }}
              target="_blank"
              href={`http://root:root@${miner.ip}`}
              rel="noopener noreferrer"
            >
              {miner.ip}
            </a>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-black text-white">
          {logs ? (
            <pre className="whitespace-pre-wrap">{logs}</pre> // Display logs in a preformatted text block
          ) : (
            <p>No logs available / failed to fetch logs.</p> // Fallback Message
          )}
        </ScrollArea>
        <div className="flex justify-center space-x-4">
          <Button
            style={{ backgroundColor: '#4ADE80', color: 'white' }}
            onClick={() => {
              // Create a Blob
              const blob = new Blob([logs || 'No logs available.'], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              // Create a Link Element
              const link = document.createElement('a');
              link.href = url;
              link.download = `${miner.ip}_log.txt`; // File Name
              // Append to the body, click and remove
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              // Clean up the URL Object
              URL.revokeObjectURL(url);
            }}
          >
            Download Log
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close Miner Log
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
