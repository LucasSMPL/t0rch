import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScannedIp } from "@/lib/types";
import {
  useScanFilters,
  useScannedIps,
  useSelectedIps,
} from "@/stores/scanner";
import { useLocalStorage } from "@uidotdev/usehooks";
import {
  ArrowBigDownDash,
  Flame,
  HelpCircle,
  LucideIcon,
  Radar,
  Sun,
} from "lucide-react";
import { useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import ScanTable from "./components/scan-table/table";
import { SelectIpBaseSheet } from "./components/select-ip-base-sheet";

export default function ScannerPage() {
  const [banner] = useState({
    message: "There is a curtailment scheduled: Tuesday - 8:00pm to 9:15pm!",
    visible: true,
  });

  const { scannedIps } = useScannedIps();
  const { setFilters, reset: resetFilters } = useScanFilters();
  const { reset: resetSelected } = useSelectedIps();

  return (
    <div className="flex flex-col h-screen">
      {banner.visible && (
        <div className="text-center py-4 border bg-[#0a0a0a] border-[#e94d1b]">
          <p className="text-[#e94d1b]">{banner.message}</p>
        </div>
      )}
      <div className="mb-5">
        <Header />

        <div className="grid gap-4 md:grid-cols-5 lg:grid-cols-5 pt-4 mx-10">
          {[
            {
              title: "Miners On Scan",
              icon: Radar,
              value: scannedIps.filter((x) => x.is_found).length,
              filter: () => {
                resetFilters();
              },
            },
            {
              title: "Miners Not Hashing",
              icon: ArrowBigDownDash,
              value: scannedIps.filter(
                (x) => x.is_found && x.hashrate / 1000 == 0
              ).length,
              filter: () => {
                setFilters([
                  {
                    id: "hashrate",
                    value: 0,
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
                setFilters([
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
                setFilters([
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
                setFilters([
                  {
                    id: "psu_failure",
                    value: true,
                  },
                ]);
              },
            },
          ].map((x) => (
            <InfoCard
              key={x.title}
              {...x}
              onClick={() => {
                resetSelected();
                x.filter();
              }}
            />
          ))}
        </div>
      </div>
      <ScanTable />
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

const IS_IN_SITE = true;

const Header = () => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [selectedBases] = useLocalStorage<string[]>("selected-ip-bases", []);

  const { progress, resetProgress, setScannedIps, reset } = useScannedIps();

  const startScan = async () => {
    if (progress != 0) {
      abortControllerRef.current?.abort();
      resetProgress();
      return;
    }
    reset();
    abortControllerRef.current = new AbortController();
    const response = await fetch("http://localhost:7070/scan", {
      signal: abortControllerRef.current.signal,
      method: "POST",
      headers: {
        "Content-Type": "text/event-stream",
      },
      body: JSON.stringify(selectedBases),
    });
    const reader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();
    if (!reader) return;
    let isDone = false;
    let buffer = "";
    while (!isDone) {
      const res = await reader.read();
      if (res.done) {
        isDone = true;
        break;
      }
      let r = res.value;
      if (buffer) {
        r = buffer + res.value;
        buffer = "";
      }
      let parts = r.split("\n\n");
      const last = parts.at(-1);
      if (last) {
        buffer += last;
        parts = parts.slice(0, -1);
      }
      console.log(parts);
      const parsed: ScannedIp[] = parts
        .filter((x) => x)
        .map((x) => JSON.parse(x));
      setScannedIps(parsed);
    }
  };
  const testScan = async () => {
    reset();
    for (const ipBase of selectedBases) {
      for (let i = 1; i < 256; i++) {
        const ip = `${ipBase}.${i}`;
        console.log(ip);
        await new Promise((resolve) => setTimeout(resolve, 10));
        setScannedIps([
          {
            ip,
            is_found: Math.random() > 0.5,
            miner_type: "Antminer S19",
            worker: "Hello",
            uptime: Math.random() * 100,
            hashrate: Math.random() * 1000000,
            fan_count: Math.floor(Math.random() * 10),
            hb_count: Math.floor(Math.random() * 10),
            power_type: "",
            controller: "",
            hashboard_type: "",
            is_underhashing: Math.random() > 0.5,
            model_found: Math.random() > 0.5,
            psu_failure: Math.random() > 0.5,
            rate_ideal: 0,
            compile_time: "",
            url: "",
          },
        ]);
      }
    }
  };

  console.log(progress);

  return (
    <>
      {progress != 0 && (
        <LoadingBar
          color="#ffffff"
          progress={(progress / (selectedBases.length * 255)) * 100}
          height={5}
          onLoaderFinished={() => resetProgress()}
        />
      )}
      <div className="flex items-center justify-between p-4">
        <h3 className="text-2xl font-bold flex items-center">
          <span className="pl-4 pr-4">t0rch // asic scanner</span>
          <Sun style={{ color: "#e94d1b" }} />
        </h3>
        <div className="flex flex-col p-4 space-x-4 space-y-2">
          <div className="flex flex-col items-end">
            <div className="flex flex-row justify-end">
              <SelectIpBaseSheet />
              <Button
                variant="outline"
                className="mr-4"
                style={{ borderColor: "#e94d1b" }}
                onClick={IS_IN_SITE ? startScan : testScan}
              >
                {progress == 0 ? "Scan Network" : "Stop Scanning"}
              </Button>
              <ModeToggle />
            </div>
            {!!selectedBases.length && (
              <p className="text-sm mt-2 mx-4">
                Selected Bases: {selectedBases.length} (
                {selectedBases.length * 255} IPs)
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
