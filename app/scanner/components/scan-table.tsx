import { DataTable } from "@/components/data-table";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import { ColumnHeader } from "@/components/data-table";

export default function ScanTable({ scannedIps }: { scannedIps: ScannedIp[] }) {
  const ips = useMemo(() => scannedIps, [scannedIps]);

  return (
    <Card>
      <DataTable
        title="t0rch - btc tools but better"
        description="t0rch is in beta, launching 2024."
        data={ips}
        columns={TodoColumns}
        searchColumnId="worker"
      />
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
    cell: ({ row }) => <div>{row.original.id}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "ip",
    header: ({ column }) => <ColumnHeader column={column} title="IP" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <a href={`http://${row.original.ip}`} target="_blank" className="truncate font-medium">
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
            {row.original.hashrate}
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
          <span className="truncate font-medium">
            {row.original.fan_count}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "hb_count",
    header: ({ column }) => <ColumnHeader column={column} title="HB's" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="truncate font-medium">
            {row.original.hb_count}
          </span>
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

  // ACTIONS NEED BUILT FROM SCRATCH
  // {
  //   id: "actions",
  //   cell: ({ row }) => <TodoActions row={row} />,
  // },
];
