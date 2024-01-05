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
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { formatDistance } from "date-fns";
import { Filter } from "lucide-react";
import * as React from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
export default function ScanTable({ scannedIps }: { scannedIps: ScannedIp[] }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const ips = useMemo(() => scannedIps, [scannedIps]);
  console.log(rowSelection);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: ips,
    columns: TodoColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <Card className=" max-h-[calc(100vh-80px)]">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col justify-start items-baseline">
          <CardTitle>t0rch - btc tools but better</CardTitle>
          <CardDescription>t0rch is in beta, launching 2024.</CardDescription>
        </div>
        <div className="flex justify-end pb-5">
          <Button
            style={{ backgroundColor: "#e94d1b" }}
            className="mr-4"
            disabled={loading}
            loading={loading}
            onClick={async () => {
              try {
                setLoading(true);
                await axios.post("http://localhost:7070/reboot", {
                  ips: table
                    .getSelectedRowModel()
                    .flatRows.map((e) => e.original.ip),
                });
                setLoading(false);
                toast({
                  title: "Reboot sequence successfull",
                  variant: "default",
                });
              } catch (error) {
                setLoading(false);
                console.log(error);
                toast({
                  title: "Something went wrong!",
                  variant: "destructive",
                });
              }
            }}
          >
            Reboot Miner
          </Button>
          <Button style={{ backgroundColor: "#e94d1b" }} className="mr-4">
            Sleep Miner
          </Button>
          <Button
            style={{ backgroundColor: "#e94d1b" }}
            disabled={loading}
            loading={loading}
            onClick={async () => {
              try {
                setLoading(true);
                await axios.post("http://localhost:7070/blink", {
                  ips: table
                    .getSelectedRowModel()
                    .flatRows.map((e) => e.original.ip),
                });
                setLoading(false);
                toast({
                  title: "Blink sequence successfull",
                  variant: "default",
                });
              } catch (error) {
                setLoading(false);
                console.log(error);
                toast({
                  title: "Something went wrong!",
                  variant: "destructive",
                });
              }
            }}
          >
            Blink LED
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        <div className="space-y-4">
          <Toolbar table={table} searchColumnId={"worker"} />
          <div className="rounded-md border min-h-[100px] max-h-[calc(100vh-280px)] overflow-y-auto">
            <Table className="h-full overflow-y-auto">
              <TableHeader className="sticky top-0 bg-white">
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
                      colSpan={TodoColumns.length}
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

// Temperature
// Firmware Version

export const TodoColumns: ColumnDef<ScannedIp>[] = [
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
            href={`http://${row.original.ip}`}
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
          <span>{row.original.miner_type}</span>
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
          <span className="truncate font-medium">
            {formatDistance(0, row.original.uptime * 1000, {
              includeSeconds: true,
            })}
          </span>
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
            {row.original.hashrate.toFixed(2)} TH
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "fan_count",
    header: ({ column }) => <ColumnHeader column={column} title="Fans" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">{row.original.fan_count}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "hb_count",
    header: ({ column }) => (
      <div className="flex items-center">
        <ColumnHeader column={column} title="HB's" />
        <Filter className="" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">{row.original.hb_count}</span>
        </div>
      );
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
  },

  // ACTIONS NEED BUILT FROM SCRATCH
  // {
  //   id: "actions",
  //   cell: ({ row }) => <TodoActions row={row} />,
  // },
];
