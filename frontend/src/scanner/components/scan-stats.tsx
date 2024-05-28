import { ModeToggle } from "@/components/mode-toggle";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ArrowBigDownDash,
  ChevronsUpDown,
  FireExtinguisher,
  Flame,
  FlameKindling,
  HelpCircle,
  Radar,
  ZapOff,
} from "lucide-react";

import { useRef, useState } from "react";
// import { z } from "zod";

export default function ScanStats({
  onScan,
  scanCount,
  underhashingCount,
  lessThan3Count,
  missingFanCount,
  // notFoundCount,
  psuFailureCount,
  totalHashrate,
}: {
  onScan: () => void; // New prop
  scanCount: number;
  underhashingCount: number;
  lessThan3Count: number;
  missingFanCount: number;
  notFoundCount: number;
  psuFailureCount: number;
  totalHashrate: number;
}) {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const startRef = useRef<HTMLInputElement | null>(null);
  const endRef = useRef<HTMLInputElement | null>(null);
  // const { toast } = useToast();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <h3 className="text-2xl font-bold text-orange-600 flex items-center">
          <FlameKindling style={{ color: "#ffffff" }} />
          <span className="pl-4 pr-4">t0rch | asic scanner</span>
          <FireExtinguisher style={{ color: "#ffffff" }} />
        </h3>
        <div className="flex flex-col p-4 space-x-4 space-y-2">
          <div className="flex flex-row justify-end">
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="outline" style={{ borderColor: "#49de80", marginRight: "25px" }}>NUKE <ZapOff className="ml-4" /></Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will send curtailment commands to all Antminers On Scan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Curtail</AlertDialogAction>
                  <AlertDialogAction style={{backgroundColor: "#5D3FD3"}}>Schedule</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Sheet>
              <Button
                style={{ marginRight: "25px" }}
                asChild
                variant={"outline"}
              >
                <SheetTrigger>Configure Network</SheetTrigger>
              </Button>
              <SheetContent className="min-w-[600px] sm:w-[540px] overflow-scroll">
                <SheetHeader className="flex flex-row justify-between m-4">
                  <div>
                    <SheetTitle>IP Ranges</SheetTitle>
                    <SheetDescription>
                      These are your IP ranges.
                    </SheetDescription>
                  </div>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Add Custom Range</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add A New Custom IP Range</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center space-y-4 w-full">
                        <div className="w-full gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            ref={nameRef}
                            placeholder="Choose a name for the range. (e.g Pod 69)"
                          />
                        </div>
                        <div className="w-full gap-2">
                          <Label htmlFor="address">Address Prefix</Label>
                          <Input
                            id="address"
                            ref={addressRef}
                            placeholder="XX.X.XXX (10.0.169)"
                          />
                        </div>
                        <div className="w-full gap-2">
                          <Label htmlFor="start">Starting IP</Label>
                          <Input id="start" ref={startRef} placeholder="1" />
                        </div>
                        <div className="w-full gap-2">
                          <Label htmlFor="end">Ending IP</Label>
                          <Input id="end" ref={endRef} placeholder="99" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="secondary">
                          Add
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </SheetHeader>
                <Collapsible className="min-w-[350px] space-y-2">
                  <div className="flex items-center justify-between space-x-4 px-4">
                    <div className="flex flex-row items-center">
                      <Checkbox className="mx-2" />
                      <h4 className="text-sm font-semibold">
                        Pre-defined for CFU
                      </h4>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Show</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="space-y-2"></CollapsibleContent>
                </Collapsible>
                <Collapsible className="min-w-[350px] space-y-2">
                  <div className="flex items-center justify-between space-x-4 px-4">
                    <div className="flex flex-row items-center">
                      <Checkbox className="mx-2" />
                      <h4 className="text-sm font-semibold">Custom</h4>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Show</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="space-y-2"></CollapsibleContent>
                </Collapsible>
              </SheetContent>
            </Sheet>
            <Button variant="outline" className="mr-4" style={{ borderColor: "#e94d1b" }} onClick={onScan}>
              Scan Network
            </Button>
            <ModeToggle />
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-5 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Miners On Scan
            </CardTitle>
            <Radar />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {scanCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Miners Underhashing
            </CardTitle>
            <ArrowBigDownDash />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {underhashingCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Miners Missing Boards
            </CardTitle>
            <HelpCircle />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {lessThan3Count}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Miners Missing Fans
            </CardTitle>
            <Flame />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {missingFanCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Miners Needing PSU
            </CardTitle>
            <Flame />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {psuFailureCount}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="pt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Hashrate
            </CardTitle>
            <Radar />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-orange-600">
            {totalHashrate.toFixed(2)} PH
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              total power
            </CardTitle>
            <Radar />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-orange-600">
              developing
            </div>
          </CardContent>
        </Card>
        </div>
    </div>
  );
}
