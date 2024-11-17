import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ColumnFilter,
  RowSelectionState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { RebootAction } from "../miner-actions/reboot";

import { Pagination, Toolbar } from "@/components/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";

import { CardDescription } from "@/components/ui/card";
import {
  Dialog,
  // DialogContent,
  // DialogDescription,
  // DialogFooter,
  // DialogHeader,
  // DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  useScanFilters,
  useScannedIps,
  useSelectedIps,
} from "@/stores/scanner";
import { BlinkAction } from "../miner-actions/blink";
// import { ChangePoolsAction } from "../miner-actions/change-pools";
// import { NukeAction } from "../miner-actions/nuke";
import { ScanTableColumns } from "./columns";
import { Button } from "@/components/ui/button";

export default function ScanTable() {
  const { scannedIps } = useScannedIps();

  const d = useMemo(() => scannedIps.filter((x) => x.is_found), [scannedIps]);
  const { filters, setFilters } = useScanFilters();
  const { selectedIps, setSelectedIps } = useSelectedIps();
  //   const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  //   console.log(rowSelection);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    is_underhashing: false,
    psu_failure: false,
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    // data: scannedIps,
    data: d,
    columns: ScanTableColumns,
    // getRowId: (row) => row.ip,
    state: {
      sorting,
      columnVisibility,
      rowSelection: selectedIps,
      columnFilters: filters,
    },
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: (s) => {
      setSelectedIps(
        (s as (old: RowSelectionState) => RowSelectionState)(selectedIps)
      );
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: (f) => {
      setFilters(f as ColumnFilter[]);
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <Card className="mx-10">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col justify-start items-baseline">
          <CardTitle>t0rch - btc tools but better</CardTitle>
          <CardDescription>t0rch is in beta, launching 2025.</CardDescription>
        </div>
        <div className="flex justify-end pb-5">
          <Button
            variant={"outline"}
            style={{ borderColor: "#D22B2B" }}
            className="mr-4"
          >
            Config All (Soon)
          </Button>
          {/* <Button
            variant={"outline"}
            style={{ borderColor: "#D22B2B" }}
            className="mr-4"
          >
            Sleep Miners (Soon)
          </Button> */}
          <Dialog>
            <DialogTrigger>
              <Button
                variant={"outline"}
                style={{ borderColor: "#D22B2B" }}
                className="mr-4"
              >
                Firmware Upgrade (Soon)
              </Button>
            </DialogTrigger>
            {/* <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Upgrade Antminer Firmware</DialogTitle>
                <DialogDescription>
                  Please select the firmware file to upload to selected
                  Antminer.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 py-4">
                <div className="flex flex-col space-y-1.5">
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select A Firmware by Bitmain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Bitmain Firmwares</SelectLabel>
                        <SelectItem value="apple">S21 - 6/3/2024</SelectItem>
                        <SelectItem value="banana">
                          S19 XP - 2/1/2024
                        </SelectItem>
                        <SelectItem value="blueberry">
                          S19k Pro - 12/3/2024
                        </SelectItem>
                        <SelectItem value="grapes">
                          S19 Pro - 6/16/2024
                        </SelectItem>
                        <SelectItem value="pineapple">
                          S19 - 4/3/2024
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Label className="pt-10" htmlFor="file">
                    File Upload{" "}
                  </Label>
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
            </DialogContent> */}
          </Dialog>
          
          {/* Buttons when Miner / Miners are selected. */}
          {Object.keys(selectedIps).length > 0 && (
            <>
            <RebootAction
                miners={table
                  .getSelectedRowModel()
                  .flatRows.map((e) => e.original)}
              />
              {/* <NukeAction /> */}
              <BlinkAction
                miners={table
                  .getSelectedRowModel()
                  .flatRows.map((e) => e.original)}
              />
              {/* <ChangePoolsAction
                miner={table
                  .getSelectedRowModel()
                  .flatRows.map((e) => e.original)}
              /> */}
            </>
          )}
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
