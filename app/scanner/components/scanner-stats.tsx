"use client";
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
import { useToast } from "@/components/ui/use-toast";
import useLocalStorage from "@/hooks/use-local-storage";
import { cn, ipRangeStr } from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import {
  ArrowBigDownDash,
  ChevronsUpDown,
  FireExtinguisher,
  Flame,
  FlameKindling,
  HelpCircle,
  Radar,
} from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { z } from "zod";

export default function ScanStats({
  onScan,
  scanCount,
  underhashingCount,
  lessThan3Count,
  notFoundCount,
  psuFailureCount,
}: {
  onScan: () => void;
  scanCount: number;
  underhashingCount: number;
  lessThan3Count: number;
  notFoundCount: number;
  psuFailureCount: number;
}) {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const addressRef = useRef<HTMLInputElement | null>(null);
  const startRef = useRef<HTMLInputElement | null>(null);
  const endRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const [customRanges, saveCustomRanges] = useLocalStorage<IpRange[]>(
    "custom-ranges",
    []
  );
  const [selectedRanges, saveSelectedRanges] = useLocalStorage<IpRange[]>(
    "selected-ranges",
    []
  );

  function onAddressInput(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const value = input.value.replace(/\D/g, ""); // Remove non-digit characters
    input.value = (value.match(/.{1,3}/g) || []).join(".");
    const chunks = [
      value.slice(0, 2),
      value.slice(2, 3),
      value.slice(3),
    ].filter(Boolean); // Filter out empty strings
    input.value = chunks.join(".");
    if (value.length >= 7) return (input.value = input.value.slice(0, 8));
  }

  function isValidFormat(input: string) {
    const regex = /^\d{2}\.\d{1}\.\d{3}$/;
    return regex.test(input);
  }

  function areAllDefaultSelected(): boolean {
    if (!selectedRanges.length) return false;
    for (const r of ipRanges) {
      const isSelected = selectedRanges.find(
        (e) => ipRangeStr(e) === ipRangeStr(r)
      );
      if (!isSelected) {
        return false;
      }
    }
    return true;
  }
  function areAllCustomSelected(): boolean {
    if (!selectedRanges.length) return false;
    for (const r of customRanges) {
      const isSelected = selectedRanges.find(
        (e) => ipRangeStr(e) === ipRangeStr(r)
      );
      if (!isSelected) {
        return false;
      }
    }
    return true;
  }
  function toggleDefault(isChecked: CheckedState): void {
    saveSelectedRanges((prev) => [
      ...prev.filter(
        (r) => !ipRanges.find((e) => ipRangeStr(e) === ipRangeStr(r))
      ),
      ...(isChecked ? ipRanges : []),
    ]);
  }
  function toggleCustom(isChecked: CheckedState): void {
    saveSelectedRanges((prev) => [
      ...prev.filter(
        (r) => !customRanges.find((e) => ipRangeStr(e) === ipRangeStr(r))
      ),
      ...(isChecked ? customRanges : []),
    ]);
  }

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
            <Sheet>
              <SheetTrigger>
                <Button style={{ marginRight: "25px" }}>
                  Configure Network
                </Button>
              </SheetTrigger>
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
                            onChange={onAddressInput}
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
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            if (
                              !addressRef.current?.value ||
                              addressRef.current?.value === ""
                            ) {
                              return toast({
                                title: "Please choose a name for the range.",
                                variant: "destructive",
                              });
                            }
                            if (
                              !isValidFormat(addressRef.current?.value ?? "")
                            ) {
                              return toast({
                                title: "Invalid Address!",
                                variant: "destructive",
                              });
                            }
                            if (
                              startRef.current?.value == "" ||
                              !z.coerce
                                .number()
                                .safeParse(startRef.current?.value ?? "")
                                .success
                            ) {
                              return toast({
                                title: "Invalid Start IP",
                                variant: "destructive",
                              });
                            }
                            if (
                              endRef.current?.value == "" ||
                              !z.coerce
                                .number()
                                .safeParse(endRef.current?.value ?? "").success
                            ) {
                              return toast({
                                title: "Invalid End IP",
                                variant: "destructive",
                              });
                            }
                            const newRange = {
                              label: nameRef.current!.value!,
                              address: addressRef.current!.value!,
                              start: z.coerce
                                .number()
                                .parse(startRef.current!.value!),
                              end: z.coerce
                                .number()
                                .parse(endRef.current!.value!),
                            };
                            const hasDuplicate = customRanges.find(
                              (cR) =>
                                cR.label === newRange.label ||
                                (cR.address === newRange.address &&
                                  cR.start === newRange.start &&
                                  cR.end === newRange.end)
                            );
                            if (hasDuplicate) {
                              return toast({
                                title: "Range already exists!",
                                variant: "destructive",
                              });
                            }
                            saveCustomRanges((prev) => [...prev, newRange]);
                            setOpen(false);
                            toast({
                              title: "Custom Range Added Successfully!",
                              variant: "default",
                            });
                          }}
                        >
                          Add
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </SheetHeader>
                <Collapsible className="min-w-[350px] space-y-2">
                  <div className="flex items-center justify-between space-x-4 px-4">
                    <div className="flex flex-row items-center">
                      <Checkbox
                        className="mx-2"
                        checked={areAllDefaultSelected()}
                        onCheckedChange={toggleDefault}
                      />
                      <h4 className="text-sm font-semibold">
                        Pre-defined for CFU ({ipRanges.length})
                      </h4>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Show</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="space-y-2">
                    {ipRanges.map((e, i) => (
                      <div
                        key={i}
                        className={cn(
                          "rounded-md border px-4 py-3 font-mono text-sm",
                          selectedRanges.find(
                            (r) => ipRangeStr(e) === ipRangeStr(r)
                          )
                            ? "bg-green-400"
                            : ""
                        )}
                        onClick={() => {
                          const hasRange = selectedRanges.find(
                            (r) => ipRangeStr(e) === ipRangeStr(r)
                          );
                          if (hasRange) {
                            const withoutSelected = selectedRanges.filter(
                              (r) => ipRangeStr(e) !== ipRangeStr(r)
                            );
                            saveSelectedRanges((prev) => [...withoutSelected]);
                          } else {
                            saveSelectedRanges((prev) => [...prev, e]);
                          }
                        }}
                      >
                        {ipRangeStr(e)}
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible className="min-w-[350px] space-y-2">
                  <div className="flex items-center justify-between space-x-4 px-4">
                    <div className="flex flex-row items-center">
                      <Checkbox
                        className="mx-2"
                        checked={areAllCustomSelected()}
                        onCheckedChange={toggleCustom}
                      />
                      <h4 className="text-sm font-semibold">
                        Custom ({customRanges.length})
                      </h4>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Show</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="space-y-2">
                    {customRanges.map((e, i) => (
                      <div
                        key={i}
                        className={cn(
                          "rounded-md border px-4 py-3 font-mono text-sm",
                          selectedRanges.find(
                            (r) => ipRangeStr(e) === ipRangeStr(r)
                          )
                            ? "bg-green-400"
                            : ""
                        )}
                        onClick={() => {
                          const hasRange = selectedRanges.find(
                            (r) => ipRangeStr(e) === ipRangeStr(r)
                          );
                          if (hasRange) {
                            const withoutSelected = selectedRanges.filter(
                              (r) => ipRangeStr(e) !== ipRangeStr(r)
                            );
                            saveSelectedRanges((prev) => [...withoutSelected]);
                          } else {
                            saveSelectedRanges((prev) => [...prev, e]);
                          }
                        }}
                      >
                        {ipRangeStr(e)}
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </SheetContent>
            </Sheet>
            <Button style={{ backgroundColor: "#e94d1b" }} onClick={onScan}>
              Scan Network
            </Button>
          </div>
          <p className="font-mono text-xs">
            {selectedRanges.length
              ? `Selected: ${selectedRanges.length}`
              : "No Range Selected"}
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
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
    </div>
  );
}

const ipRanges: IpRange[] = [
  {
    label: "OSO",
    address: "10.0.100",
    start: 1,
    end: 50,
  },
  {
    label: "P1",
    address: "10.0.101",
    start: 1,
    end: 96,
  },
  {
    label: "P2",
    address: "10.0.102",
    start: 1,
    end: 96,
  },
  {
    label: "P3",
    address: "10.0.103",
    start: 1,
    end: 96,
  },
  {
    label: "P4",
    address: "10.0.104",
    start: 1,
    end: 96,
  },
  {
    label: "P5",
    address: "10.0.105",
    start: 1,
    end: 96,
  },
  {
    label: "P6",
    address: "10.0.106",
    start: 1,
    end: 96,
  },
  {
    label: "P7",
    address: "10.0.107",
    start: 1,
    end: 96,
  },
  {
    label: "P8",
    address: "10.0.108",
    start: 1,
    end: 96,
  },
  {
    label: "P9",
    address: "10.0.109",
    start: 1,
    end: 96,
  },
  {
    label: "P10",
    address: "10.0.110",
    start: 1,
    end: 96,
  },
  {
    label: "P11",
    address: "10.0.111",
    start: 1,
    end: 96,
  },
  {
    label: "P12",
    address: "10.0.112",
    start: 1,
    end: 96,
  },
  {
    label: "P13",
    address: "10.0.113",
    start: 1,
    end: 96,
  },
  {
    label: "P14",
    address: "10.0.114",
    start: 1,
    end: 96,
  },
  {
    label: "P15",
    address: "10.0.115",
    start: 1,
    end: 96,
  },
  {
    label: "P16",
    address: "10.0.116",
    start: 1,
    end: 96,
  },
  {
    label: "P17",
    address: "10.0.117",
    start: 1,
    end: 96,
  },
  {
    label: "P18",
    address: "10.0.118",
    start: 1,
    end: 96,
  },
  {
    label: "P19",
    address: "10.0.119",
    start: 1,
    end: 96,
  },
  {
    label: "P20",
    address: "10.0.120",
    start: 1,
    end: 96,
  },
  {
    label: "P21",
    address: "10.0.121",
    start: 1,
    end: 96,
  },
  {
    label: "P22",
    address: "10.0.122",
    start: 1,
    end: 96,
  },
  {
    label: "P23",
    address: "10.0.123",
    start: 1,
    end: 96,
  },
  {
    label: "P24",
    address: "10.0.124",
    start: 1,
    end: 96,
  },
  {
    label: "P25",
    address: "10.0.125",
    start: 1,
    end: 96,
  },
  {
    label: "P26",
    address: "10.0.126",
    start: 1,
    end: 96,
  },
  {
    label: "P27",
    address: "10.0.127",
    start: 1,
    end: 96,
  },
  {
    label: "P28",
    address: "10.0.128",
    start: 1,
    end: 96,
  },
  {
    label: "P29",
    address: "10.0.129",
    start: 1,
    end: 96,
  },
  {
    label: "P30",
    address: "10.0.130",
    start: 1,
    end: 96,
  },
  {
    label: "P31",
    address: "10.0.131",
    start: 1,
    end: 96,
  },
  {
    label: "P32",
    address: "10.0.132",
    start: 1,
    end: 96,
  },
  {
    label: "P33",
    address: "10.0.133",
    start: 1,
    end: 96,
  },
  {
    label: "P34",
    address: "10.0.134",
    start: 1,
    end: 96,
  },
  {
    label: "P35",
    address: "10.0.135",
    start: 1,
    end: 96,
  },
  {
    label: "P36",
    address: "10.0.136",
    start: 1,
    end: 96,
  },
  {
    label: "P37",
    address: "10.0.137",
    start: 1,
    end: 96,
  },
];
