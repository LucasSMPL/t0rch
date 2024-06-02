import { ColumnHeader, Pagination, Toolbar } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ColumnDef, flexRender, Table as tTable } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ScannedIp } from "@/lib/types";
import { Dispatch, SetStateAction, useState } from "react";
import AntminerHashboardView from "./antminer-hashboards";
import { MinerDetailsSheet } from "./miner-details-sheet";
import { RebootButton } from "./reboot-button";
// import AntminerIPSettings from "./antminer-ip-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Pool {
  url: string;
  user: string;
  pass: string;
}

export default function ScanTable({
  table,
  setProgress,
}: {
  table: tTable<ScannedIp>;
  setProgress: Dispatch<SetStateAction<number>>;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBlink = async (miners: ScannedIp[]) => {
    setLoading(true);
    const response = await fetch("http://localhost:7070/blink", {
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
      const parsed = res.value.split("\n\n").filter((x) => x);
      setProgress((prev) => prev + (parsed.length / miners.length) * 100);
    }
    setLoading(false);
    toast({
      title: "Blink commands sent successfully",
      variant: "default",
    });
  };

  const [pool1, setPool1] = useState<Pool>({ url: "", user: "", pass: "" });
  const [pool2, setPool2] = useState<Pool>({ url: "", user: "", pass: "" });
  const [pool3, setPool3] = useState<Pool>({ url: "", user: "", pass: "" });

  const handleChangePool1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPool1((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChangePool2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPool2((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChangePool3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPool3((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdatePools = async (miners: ScannedIp[]) => {
    setLoading(true);
    const pools = [pool1, pool2, pool3];
    const requestBody = {
      ips: miners.map((x) => x.ip),
      pools: pools,
    };

    const response = await fetch("http://localhost:7070/pool", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
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
      const parsed = res.value.split("\n\n").filter((x) => x);
      setProgress((prev) => prev + (parsed.length / miners.length) * 100);
    }
    setLoading(false);
    toast({
      title: "Pool configurations updated successfully",
      variant: "default",
    });
    setIsDialogOpen(false); // Close the dialog
  };

  return (
    <Card className="mx-10">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col justify-start items-baseline">
          <CardTitle>t0rch - btc tools but better</CardTitle>
          <CardDescription>t0rch is in beta, launching 2024.</CardDescription>
        </div>
        <div className="flex justify-end pb-5">
          <Dialog>
            <DialogTrigger>
              <Button
                variant={"outline"}
                style={{ borderColor: "#D22B2B" }}
                className="mr-4"
              >
                IP Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[850px]">
              <DialogHeader>
                <DialogTitle>Change IP Settings</DialogTitle>
                <DialogDescription>
                  Please modify the internet protocol information below, and
                  click update.
                </DialogDescription>
              </DialogHeader>
              {/* <SelectSeparator /> */}
              <div className="grid gap-3 pt-10">
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Protocol</span>
                    <span style={{ color: "#e94d1b" }}>Static</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">IP</span>
                    <span style={{ color: "#e94d1b" }}>
                      <a href="http://root:root@ip" target="_blank">
                        $ip
                      </a>
                      10.0.0.0
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">MAC</span>
                    <span style={{ color: "#e94d1b" }}>AB:CD:EF:GH:1</span>
                  </li>
                </ul>
              </div>
              <Tabs defaultValue="static">
                <div className="flex items-center justify-center">
                  <TabsList>
                    <TabsTrigger value="static">Static</TabsTrigger>
                    <TabsTrigger value="dhcp">DHCP</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="static">
                  <div className="grid grid-cols-1 gap-4 pt-10">
                    <Label>IP Address</Label>
                    <Input
                      className="col-span-1"
                      placeholder="IP Address"
                      name="ip"
                    />
                    <Label>Netmask</Label>
                    <Input
                      className="col-span-1"
                      placeholder="Netmask"
                      name="netmask"
                    />
                    <Label>Gateway</Label>
                    <Input
                      className="col-span-1"
                      placeholder="Gateway"
                      name="gateway"
                    />
                    <Label>DNS Server</Label>
                    <Input
                      className="col-span-1"
                      placeholder="DNS Server"
                      name="dns"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="dhcp">
                  <div className="flex items-center justify-center pt-10 pb-10">
                    <Label>
                      Your miner will auto configure the network configuration
                      to DHCP Protocol.
                    </Label>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter className="flex justify-center items-center">
                <Button className="mx-auto">Update IP Settings</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AntminerHashboardView />
          <Button style={{ backgroundColor: "#e94d1b" }} className="mr-4">
            Reboot All
          </Button>
          <Button
            variant={"outline"}
            style={{ borderColor: "#D22B2B" }}
            className="mr-4"
          >
            Config All
          </Button>
          {/* <MinerDetailsSheet  /> */}

          <Button
            className="mr-4"
            variant="outline"
            disabled={loading}
            // loading={loading}
            onClick={() =>
              handleBlink(
                table.getSelectedRowModel().flatRows.map((e) => e.original)
              )
            }
          >
            Blink LED
          </Button>
          <Button
            variant={"outline"}
            style={{ borderColor: "#D22B2B" }}
            className="mr-4"
          >
            Sleep Miner
          </Button>
          <Dialog>
            <DialogTrigger>
              <Button
                variant={"outline"}
                style={{ borderColor: "#D22B2B" }}
                className="mr-4"
              >
                Firmware Upgrade
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Upgrade Antminer Firmware</DialogTitle>
                <DialogDescription>
                  Please select the firmware file to upload to selected
                  Antminer.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 py-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="file">File Upload </Label>
                  <Input
                    className="w-full"
                    id="file"
                    type="file"
                    style={{ backgroundColor: "#e94d1b" }}
                  />
                </div>
              </div>
              <DialogFooter className="justify-center">
                <Button className="mx-auto">Update</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
              <Button
                variant={"outline"}
                style={{ borderColor: "#D22B2B" }}
                className="mr-4"
              >
                Change Pools
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[850px]">
              <DialogHeader>
                <DialogTitle>Changing Pools</DialogTitle>
                <DialogDescription>
                  Please enter your stratum url, worker/account, and password
                  below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-12 gap-4 py-4">
                <Input
                  className="col-span-6"
                  placeholder={pool1.url}
                  name="url"
                  value={pool1.url}
                  onChange={handleChangePool1}
                />
                <Input
                  className="col-span-4"
                  placeholder={pool1.user}
                  name="user"
                  value={pool1.user}
                  onChange={handleChangePool1}
                />
                <Input
                  className="col-span-2"
                  placeholder={pool1.pass}
                  name="pass"
                  value={pool1.pass}
                  onChange={handleChangePool1}
                />
              </div>
              <div className="grid grid-cols-12 gap-4 py-4">
                <Input
                  className="col-span-6"
                  placeholder="Stratum URL #2"
                  name="url"
                  value={pool2.url}
                  onChange={handleChangePool2}
                />
                <Input
                  className="col-span-4"
                  placeholder="Worker"
                  name="user"
                  value={pool2.user}
                  onChange={handleChangePool2}
                />
                <Input
                  className="col-span-2"
                  placeholder="Password"
                  name="pass"
                  value={pool2.pass}
                  onChange={handleChangePool2}
                />
              </div>
              <div className="grid grid-cols-12 gap-4 py-4">
                <Input
                  className="col-span-6"
                  placeholder="Stratum URL #3"
                  name="url"
                  value={pool3.url}
                  onChange={handleChangePool3}
                />
                <Input
                  className="col-span-4"
                  placeholder="Worker"
                  name="user"
                  value={pool3.user}
                  onChange={handleChangePool3}
                />
                <Input
                  className="col-span-2"
                  placeholder="Password"
                  name="pass"
                  value={pool3.pass}
                  onChange={handleChangePool3}
                />
              </div>
              <DialogFooter className="flex justify-center items-center">
                <Button
                  className="mx-auto"
                  onClick={() =>
                    handleUpdatePools(
                      table
                        .getSelectedRowModel()
                        .flatRows.map((e) => e.original)
                    )
                  }
                >
                  Update Pool
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <RebootButton
            miners={table.getSelectedRowModel().flatRows.map((e) => e.original)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Toolbar table={table} searchColumnId={"worker"} />
          <div className="rounded-md border max-h-[calc(100vh-560px)] overflow-auto">
            <Table className="h-full">
              <TableHeader className="sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={ScanTableColumns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination table={table} />
        </div>
      </CardContent>
    </Card>
  );
}

export const ScanTableColumns: ColumnDef<ScannedIp>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <ColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div>{row.id}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "ip",
    header: ({ column }) => <ColumnHeader column={column} title="IP" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <a
            href={`http://root:root@${row.original.ip}`}
            target="_blank"
            className="truncate font-medium"
          >
            {row.original.ip}
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "miner_type",
    header: ({ column }) => <ColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>
            {row.original.miner_type} (
            {(row.original.rate_ideal / 1000).toFixed(0)} TH)
          </span>
        </div>
      );
    },
    //   filterFn: (row, id, value) => {
    //     return value.includes(original.id);
    //  },
  },
  {
    accessorKey: "worker",
    header: ({ column }) => <ColumnHeader column={column} title="Worker" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.original.worker}</span>
        </div>
      );
    },

    //   filterFn: (row, id, value) => {
    //     return value.includes(original.id);
    //  },
  },
  // {
  //   accessorKey: "pool_1",
  //   header: ({ column }) => <ColumnHeader column={column} title="Pool" />,
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="truncate font-medium">{row.original.pool_1}</span>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "uptime",
    header: ({ column }) => <ColumnHeader column={column} title="Uptime" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">{row.original.uptime}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "hashrate",
    header: ({ column }) => <ColumnHeader column={column} title="Hashrate" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {/* {getSiPrefixedNumber(row.original.hashrate)}TH */}
            {(row.original.hashrate / 1000).toFixed(2)} TH/s
          </span>
        </div>
      );
    },
    filterFn: (row, _id, value) => {
      return row.original.is_found && row.original.hashrate / 1000 == value;
    },
  },
  {
    accessorKey: "fan_count",
    header: ({ column }) => <ColumnHeader column={column} title="Fans" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {row.getValue("fan_count")}
          </span>
        </div>
      );
    },
    filterFn: (row, _id, value) => {
      return row.original.fan_count < value;
    },
  },
  {
    accessorKey: "hb_count",
    header: ({ column }) => (
      <div className="flex items-center">
        <ColumnHeader column={column} title="HB's" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">{row.original.hb_count}</span>
        </div>
      );
    },
    filterFn: (row, _id, value) => {
      return row.original.hb_count < value;
    },
  },
  {
    accessorKey: "psu_type",
    header: ({ column }) => <ColumnHeader column={column} title="PSU" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {row.original.power_type}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "controller",
    header: ({ column }) => (
      <ColumnHeader column={column} title="Control Board" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {row.original.controller}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "hashboard_type",
    header: ({ column }) => <ColumnHeader column={column} title="Hashboard" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {row.original.hashboard_type}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "psu_failure",
    header: ({ column }) => (
      <ColumnHeader column={column} title="PSU Failure" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {row.original.psu_failure ? "Yes" : "No"}
          </span>
        </div>
      );
    },
    filterFn: (row, _id, value) => {
      return row.original.psu_failure == value;
    },
  },
  {
    accessorKey: "is_underhashing",
    header: ({ column }) => (
      <ColumnHeader column={column} title="PSU Failure" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {row.original.is_underhashing ? "Yes" : "No"}
          </span>
        </div>
      );
    },
    filterFn: (row, _id, value) => {
      return row.original.is_underhashing == value;
    },
  },
  {
    accessorKey: "miner_details",
    header: "",
    cell: ({ row }) => {
      return <MinerDetailsSheet miner={row.original} />;
    },
  },

  // ACTIONS NEED BUILT FROM SCRATCH
  // {
  //   id: "actions",
  //   cell: ({ row }) => <TodoActions row={row} />,
  // },
];
