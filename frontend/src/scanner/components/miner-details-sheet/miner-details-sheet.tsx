import { Button } from "@/components/ui/button";

import { CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { ScannedIp } from "@/lib/types";
import { useState } from "react";
import { FactoryResetButton } from "../factory-reset-button";
import { ChangePoolsAction } from "../miner-actions/change-pools";
import { RebootAction } from "../miner-actions/reboot";
import { HashrateChart } from "./components/hashrate-chart";
import { NetworkDialog } from "./components/network-dialog";
import AntminerHashboardView from "./components/antminer-hashboards";
import { ScanSearch } from "lucide-react";
import ReadLogs from "./components/read-logs";


export const MinerDetailsSheet = ({ miner }: { miner: ScannedIp }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formattedHashrate = (miner.hashrate / 1000).toFixed(2);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant={"outline"} className="mr-4">
        <SheetTrigger>Details <ScanSearch className="pl-3 w-8 h-8"/></SheetTrigger>
      </Button>
      <SheetContent className="max-w-[800px] sm:max-w-[540px] overflow-scroll">
        <CardContent className="p-6 text-sm">
          {isOpen && <HashrateChart miner={miner} />}
          <div className="grid gap-3">
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {miner.miner_type}
                </span>
                <span>{formattedHashrate} TH/S</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">IP:</span>
                <span>
                  <a href={`http://root:root@${miner.ip}`}>{miner.ip}</a>
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Control Board:</span>
                <span className="text-muted-foreground">
                  {miner.controller}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Hashboards:</span>
                <span className="text-muted-foreground">
                  {miner.hashboard_type}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>PSU:</span>
                <span className="text-muted-foreground">
                  {miner.power_type}
                </span>
              </li>
            </ul>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Pool:</span>
              <span>{miner.url}</span>
            </li>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Worker 1:</span>
                <span>{miner.worker}</span>
              </li>
            </ul>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Blink:</span>
                <span>
                  <Switch />
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">FW Ver:</span>
                <span>{miner.compile_time}</span>
              </li>
            </ul>
            <RebootAction miners={[miner]} />
            <AntminerHashboardView miner={miner} />
            <ChangePoolsAction miner={miner} />
            <NetworkDialog miner={miner} />
            <ReadLogs miner={miner} />
            <FactoryResetButton miners={[miner]} />
          </div>
          {/* <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <RebootButton miners={[miner]} />
            </div>
            <div className="flex flex-col gap-3">
              <Button>Create Repair Ticket</Button>
            </div>
            <div className="flex flex-col gap-3">
              <Button style={{ backgroundColor: "#e94d1b" }}>
                Change Pools
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              <Button style={{ backgroundColor: "#e94d1b" }}>
                IP Settings
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              <ShowLogsDialog miners={[miner]} />
            </div>
            <div className="flex flex-col gap-3">
              <FactoryResetButton miners={[miner]}/>
            </div>
          </div> */}
        </CardContent>
      </SheetContent>
    </Sheet>
  );
};
