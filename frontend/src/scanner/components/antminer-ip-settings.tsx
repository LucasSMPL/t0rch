// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { SelectSeparator } from "@/components/ui/select"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScannedIp } from "@/lib/types"
// import { TabsContent } from "@radix-ui/react-tabs"
// import { useState } from "react"

// const AntminerIPSettings = ({
//     miners,
//   }: {
//     miners: ScannedIp[];
//   }) => {
//     // const { toast } = useToast();
//     const [, setLoading] = useState(false);
//     const [logs, setLogs] = useState("");
  
//     const handleIPSettings = async (miners: ScannedIp[]) => {
//       setLoading(true);
//       const response = await fetch("http://localhost:7070/ip_settings", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(miners.map((x) => x.ip)),
//       });
//       const reader = response.body
//         ?.pipeThrough(new TextDecoderStream())
//         .getReader();
//       if (!reader) return;
//       let isDone = false;
  
//       while (!isDone) {
//         const res = await reader.read();
//         if (res.done) {
//           isDone = true;
//           break;
//         }
//         setLogs((prevLogs) => prevLogs + res.value);
//       }
//       setLoading(false);
//     };
//     const [open, setOpen] = useState(false);

//     const handleClose = () => {
//       setOpen(false);
//     };
//     return (
//         <div>
        
//         </div>
//     )
// }

// export default AntminerIPSettings