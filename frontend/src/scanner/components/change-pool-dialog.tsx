// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { ScannedIp } from "@/lib/types"
// import { table } from "console"
// import { useState } from "react"

// const ChangePoolDialog = ({ miner }: { miner: ScannedIp }) => {
//   const [pool1, setPool1] = useState<Pool>({ url: "", user: "", pass: "" });
//   const [pool2, setPool2] = useState<Pool>({ url: "", user: "", pass: "" });
//   const [pool3, setPool3] = useState<Pool>({ url: "", user: "", pass: "" });

//   const handleChangePool1 = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setPool1((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleChangePool2 = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setPool2((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleChangePool3 = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setPool3((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleUpdatePools = async (miners: ScannedIp[]) => {
//     setLoading(true);
//     const pools = [pool1, pool2, pool3];
//     const requestBody = {
//       ips: miners.map((x) => x.ip),
//       pools: pools,
//     };

//     const response = await fetch("http://localhost:7070/pool", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(requestBody),
//     });

//     const reader = response.body
//       ?.pipeThrough(new TextDecoderStream())
//       .getReader();
//     if (!reader) return;
//     let isDone = false;

//     while (!isDone) {
//       const res = await reader.read();
//       if (res.done) {
//         isDone = true;
//         break;
//       }
//       const parsed = res.value.split("\n\n").filter((x) => x);
//       setProgress((prev) => prev + (parsed.length / miners.length) * 100);
//     }
//     setLoading(false);
//     toast({
//       title: "Pool configurations updated successfully",
//       variant: "default",
//     });
//     setIsDialogOpen(false); // Close the dialog
//   };
//     return (
//         <div>
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger>
//               <Button
//                 variant={"outline"}
//                 style={{ borderColor: "#D22B2B" }}
//                 className="mr-4"
//               >
//                 Change Pools
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[850px]">
//               <DialogHeader>
//                 <DialogTitle>Changing Pools</DialogTitle>
//                 <DialogDescription>
//                   Please enter your stratum url, worker/account, and password
//                   below.
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="grid grid-cols-12 gap-4 py-4">
//                 <Input
//                   className="col-span-6"
//                   placeholder={miner.url}
//                   name="url"
//                   value={pool1.url}
//                   onChange={handleChangePool1}
//                 />
//                 <Input
//                   className="col-span-4"
//                   placeholder={miner.worker}
//                   name="user"
//                   value={pool1.user}
//                   onChange={handleChangePool1}
//                 />
//                 <Input
//                   className="col-span-2"
//                   placeholder="Password"
//                   name="pass"
//                   value={pool1.pass}
//                   onChange={handleChangePool1}
//                 />
//               </div>
//               <div className="grid grid-cols-12 gap-4 py-4">
//                 <Input
//                   className="col-span-6"
//                   placeholder="Stratum URL #2"
//                   name="url"
//                   value={pool2.url}
//                   onChange={handleChangePool2}
//                 />
//                 <Input
//                   className="col-span-4"
//                   placeholder="Worker"
//                   name="user"
//                   value={pool2.user}
//                   onChange={handleChangePool2}
//                 />
//                 <Input
//                   className="col-span-2"
//                   placeholder="Password"
//                   name="pass"
//                   value={pool2.pass}
//                   onChange={handleChangePool2}
//                 />
//               </div>
//               <div className="grid grid-cols-12 gap-4 py-4">
//                 <Input
//                   className="col-span-6"
//                   placeholder="Stratum URL #3"
//                   name="url"
//                   value={pool3.url}
//                   onChange={handleChangePool3}
//                 />
//                 <Input
//                   className="col-span-4"
//                   placeholder="Worker"
//                   name="user"
//                   value={pool3.user}
//                   onChange={handleChangePool3}
//                 />
//                 <Input
//                   className="col-span-2"
//                   placeholder="Password"
//                   name="pass"
//                   value={pool3.pass}
//                   onChange={handleChangePool3}
//                 />
//               </div>
//               <DialogFooter className="flex justify-center items-center">
//                 <Button
//                   className="mx-auto"
//                   onClick={() =>
//                     handleUpdatePools(
//                       table
//                         .getSelectedRowModel()
//                         .flatRows.map((e) => e.original)
//                     )
//                   }
//                 >
//                   Update Pool
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>
//     )
// }

// export default ChangePoolDialog