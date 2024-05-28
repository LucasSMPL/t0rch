import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useLocalStorage from "@/hooks/use-local-storage";
import { CustomBase } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ChevronsUpDown } from "lucide-react";
import { AddIpBaseDialog } from "./add-ip-base-dialog";

export const SelectIpBaseSheet = () => {
  const customBases = useLocalStorage<CustomBase[]>("custom-ip-bases", []);
  const selectedBases = useLocalStorage<string[]>("selected-ip-bases", []);

  const allSelected = (bases: string[]): boolean => {
    if (!selectedBases.value.length) return false;
    for (const r of bases) {
      const isSelected = selectedBases.value.find((e) => e === r);
      if (!isSelected) {
        return false;
      }
    }
    return true;
  };

  const toggleAll = (isChecked: CheckedState, bases: string[]): void => {
    selectedBases.setValue((prev) => [
      ...prev.filter((r) => !bases.find((e) => e === r)),
      ...(isChecked ? bases : []),
    ]);
  };
  return (
    <Sheet>
      <Button style={{ marginRight: "25px" }} asChild variant={"outline"}>
        <SheetTrigger>Configure Network</SheetTrigger>
      </Button>
      <SheetContent className="min-w-[600px] sm:w-[540px] overflow-scroll">
        <SheetHeader className="flex flex-row justify-between m-4">
          <div>
            <SheetTitle>IP Ranges</SheetTitle>
            <SheetDescription>These are your IP ranges.</SheetDescription>
          </div>
          <AddIpBaseDialog customBases={customBases} />
        </SheetHeader>
        <Collapsible className="min-w-[350px] space-y-2">
          <div className="flex items-center justify-between space-x-4 px-4">
            <div className="flex flex-row items-center">
              <Checkbox
                className="mx-2"
                checked={allSelected(customBases.value.map((e) => e.base))}
                onCheckedChange={(c) =>
                  toggleAll(
                    c,
                    customBases.value.map((e) => e.base)
                  )
                }
              />
              <h4 className="text-sm font-semibold">
                Custom ({customBases.value.length})
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
            {customBases.value.map((e, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-md border px-4 py-3 font-mono text-sm",
                  selectedBases.value.find((r) => e.base === r)
                    ? "bg-green-400"
                    : ""
                )}
                onClick={() => {
                  const hasRange = selectedBases.value.find(
                    (r) => e.base === r
                  );
                  if (hasRange) {
                    selectedBases.setValue((prev) => [
                      ...prev.filter((r) => e.base !== r),
                    ]);
                  } else {
                    selectedBases.setValue((prev) => [...prev, e.base]);
                  }
                }}
              >
                {e.name}: {e.base}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
        {predefinedBases.map((e) => (
          <Collapsible className="min-w-[350px] space-y-2" key={e.name}>
            <div className="flex items-center justify-between space-x-4 px-4">
              <div className="flex flex-row items-center">
                <Checkbox
                  className="mx-2"
                  checked={allSelected(e.bases)}
                  onCheckedChange={(c) => toggleAll(c, e.bases)}
                />
                <h4 className="text-sm font-semibold">{e.name}</h4>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Show</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              {e.bases.map((b) => (
                <div
                  key={b}
                  className={cn(
                    "rounded-md border px-4 py-3 font-mono text-sm",
                    selectedBases.value.find((r) => b === r)
                      ? "bg-green-400"
                      : ""
                  )}
                  onClick={() => {
                    const hasRange = selectedBases.value.find((r) => b === r);
                    if (hasRange) {
                      selectedBases.setValue((prev) => [
                        ...prev.filter((r) => b !== r),
                      ]);
                    } else {
                      selectedBases.setValue((prev) => [...prev, b]);
                    }
                  }}
                >
                  {b}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </SheetContent>
    </Sheet>
  );
};

const predefinedBases = [
  {
    name: "Site 1",
    bases: [
      "10.0.0", // R1 Start
      "10.0.1",
      "10.0.2",
      "10.0.3",
      "10.0.4",
      "10.0.5",
      "10.0.6",
      "10.0.7",
      "10.0.8",
      "10.0.9",
      "10.0.10",
      "10.0.11",
      "10.0.12",
      "10.0.13",
      "10.0.14",
      "10.0.15",
      "10.0.16",
      "10.0.17",
      "10.0.18",
      "10.0.19",
      "10.0.20", // R1 End
      "10.0.42", // R2 Start
      "10.0.43",
      "10.0.44",
      "10.0.45",
      "10.0.46",
      "10.0.47", // R2 End
      "10.0.68", // R3 Start
      "10.0.69",
      "10.0.70",
      "10.0.71",
      "10.0.72",
      "10.0.73",
      "10.0.74",
      "10.0.75", // R3 End
      "10.0.90", // R4 Start
      "10.0.91",
      "10.0.92", // R4 End
      "10.0.100", // R5 Start
      "10.0.101",
      "10.0.102",
      "10.0.103", // R5 End
      "10.0.104", // R6 Start
      "10.0.105",
      "10.0.106",
      "10.0.107",
      "10.0.108",
      "10.0.109",
      "10.0.110",
      "10.0.111",
      "10.0.112",
      "10.0.113",
      "10.0.114",
      "10.0.115",
      "10.0.116",
      "10.0.117",
      "10.0.118",
      "10.0.119",
      "10.0.120",
      "10.0.121",
      "10.0.122",
      "10.0.123",
      "10.0.124",
      "10.0.125",
      "10.0.126",
      "10.0.127",
      "10.0.128",
      "10.0.129",
      "10.0.130",
      "10.0.131",
      "10.0.132",
      "10.0.133",
      "10.0.134",
      "10.0.135",
      "10.0.136",
      "10.0.137", // R6 End
      "10.0.150", // R7 Start
      "10.0.151",
      "10.0.152",
      "10.0.153",
      "10.0.154",
      "10.0.155",
      "10.0.156",
      "10.0.157",
      "10.0.158",
      "10.0.159",
      "10.0.160",
      "10.0.161",
      "10.0.162",
      "10.0.163",
      "10.0.164",
      "10.0.165", // R7 End
      "10.0.169", // R8 Start
      "10.0.170",
      "10.0.171",
      "10.0.172",
      "10.0.173",
      "10.0.174",
      "10.0.175", // R8 End
    ],
  },
  {
    name: "Site 3",
    bases: [
      "10.0.131",
      "10.0.132",
      "10.0.133",
      "10.0.134",
      "10.0.135",
      "10.0.136",
      "10.0.137",
      "10.0.138",
      "10.0.140",
    ],
  },
];
