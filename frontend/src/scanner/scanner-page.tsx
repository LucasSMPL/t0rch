import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowBigDownDash,
  FireExtinguisher,
  Flame,
  FlameKindling,
  HelpCircle,
  Radar,
} from "lucide-react";

import useLocalStorage from "@/hooks/use-local-storage";
import {
  ColumnFiltersState,
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
import { LucideIcon } from "lucide-react";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import { ScannedIp } from "../lib/types";
import { NukeDialog } from "./components/nuke-dialog";
import ScanTable, { ScanTableColumns } from "./components/scan-table";
import { SelectIpBaseSheet } from "./components/select-ip-base-sheet";

export default function ScannerPage() {
  const [progress, setProgress] = useState(0);
  const [banner] = useState({
    message: "There is a curtailment scheduled: Tuesday - 8:00pm to 9:15pm!",
    visible: true,
  });
  const [scannedIps, setScannedIps] = useState<ScannedIp[]>([]);
  const d = useMemo(() => scannedIps.filter((x) => x.is_found), [scannedIps]);
  // const d = useMemo<ScannedIp[]>(
  //   () => [
  //     {
  //       controller: "unknown",
  //       fan_count: 0,
  //       hashboard_type: "unknown",
  //       hashrate: 0,
  //       hb_count: 0,
  //       ip: "89.0.142.86",
  //       is_found: false,
  //       is_underhashing: false,
  //       miner_type: "unknown",
  //       model_found: false,
  //       power_type: "unknown",
  //       psu_failure: false,
  //       uptime: 0,
  //       worker: "unknown",
  //     },
  //   ],
  //   []
  // );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    // data: scannedIps,
    data: d,
    columns: ScanTableColumns,
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
    <div className="flex flex-col h-screen">
      {banner.visible && (
        <div className="text-center py-4 border bg-[#0a0a0a] border-[#e94d1b]">
          <p className="text-[#e94d1b]">{banner.message}</p>
        </div>
      )}
      <div className="mb-5">
        <Header
          setScannedIps={setScannedIps}
          progress={progress}
          setProgress={setProgress}
        />

        <div className="grid gap-4 md:grid-cols-5 lg:grid-cols-5 pt-4 mx-10">
          {[
            {
              title: "Miners On Scan",
              icon: Radar,
              value: scannedIps.filter((x) => x.is_found).length,
              filter: () => {
                table.resetColumnFilters();
              },
            },
            {
              title: "Miners Underhashing",
              icon: ArrowBigDownDash,
              value: scannedIps.filter((x) => x.is_found && x.is_underhashing)
                .length,
              filter: () => {
                table.setColumnFilters([
                  {
                    id: "is_underhashing",
                    value: "true",
                  },
                ]);
              },
            },
            {
              title: "Miners Missing Boards",
              icon: HelpCircle,
              value: scannedIps.filter((x) => x.is_found && x.hb_count < 3)
                .length,
              filter: () => {
                table.setColumnFilters([
                  {
                    id: "hb_count",
                    value: 3,
                  },
                ]);
              },
            },
            {
              title: "Miners Missing Fans",
              icon: Flame,
              value: scannedIps.filter((x) => x.is_found && x.fan_count < 4)
                .length,
              filter: () => {
                table.setColumnFilters([
                  {
                    id: "fan_count",
                    value: 4,
                  },
                ]);
              },
            },
            {
              title: "Miners Needing PSU",
              icon: Flame,
              value: scannedIps.filter((x) => x.is_found && x.psu_failure)
                .length,
              filter: () => {
                table.setColumnFilters([
                  {
                    id: "psu_failure",
                    value: true,
                  },
                ]);
              },
            },
          ].map((x) => (
            <InfoCard key={x.title} {...x} onClick={x.filter} />
          ))}
        </div>
      </div>
      <ScanTable table={table} setProgress={setProgress} />
    </div>
  );
}

const InfoCard = ({
  title,
  icon: Icon,
  value,
  onClick,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  onClick: () => void;
}) => {
  return (
    <Card className="hover:border-[#e94d1b]" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="mr-3" style={{ width: "15px", height: "15px" }} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-orange-600">{value}</div>
      </CardContent>
    </Card>
  );
};

const Header = ({
  setScannedIps,
  progress,
  setProgress,
}: {
  setScannedIps: React.Dispatch<React.SetStateAction<ScannedIp[]>>;
  progress: number;
  setProgress: Dispatch<SetStateAction<number>>;
}) => {
  const selectedBases = useLocalStorage<string[]>("selected-ip-bases", []);

  const startScan = async () => {
    setScannedIps([]);
    const response = await fetch("http://localhost:7070/scan", {
      method: "POST",
      headers: {
        "Content-Type": "text/event-stream",
      },
      body: JSON.stringify(selectedBases.value),
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
      const parsed: ScannedIp[] = res.value
        .split("\n\n")
        .filter((x) => x)
        .map((x) => JSON.parse(x));
      setScannedIps((prev) => [...prev, ...parsed]);
      setProgress(
        (prev) =>
          prev + (parsed.length / (selectedBases.value.length * 255)) * 100
      );
    }
  };
  return (
    <>
      <LoadingBar
        color="#ffffff"
        progress={progress}
        height={5}
        onLoaderFinished={() => setProgress(0)}
      />

      <div className="flex items-center justify-between p-4">
        <h3 className="text-2xl font-bold text-orange-600 flex items-center">
          <FlameKindling style={{ color: "#ffffff" }} />
          <span className="pl-4 pr-4">t0rch | asic scanner</span>
          <FireExtinguisher style={{ color: "#ffffff" }} />
        </h3>
        <div className="flex flex-col p-4 space-x-4 space-y-2">
          <div className="flex flex-row justify-end">
            <NukeDialog />
            <SelectIpBaseSheet />
            <Button
              variant="outline"
              className="mr-4"
              style={{ borderColor: "#e94d1b" }}
              onClick={startScan}
            >
              Scan Network
            </Button>
            <ModeToggle />
          </div>
        </div>
      </div>
    </>
  );
};
