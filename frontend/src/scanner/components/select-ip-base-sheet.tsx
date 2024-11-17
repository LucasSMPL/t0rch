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
import { CustomBase } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useLocalStorage } from "@uidotdev/usehooks";
import { ChevronsUpDown } from "lucide-react";
import { AddIpBaseDialog } from "./add-ip-base-dialog";

export const SelectIpBaseSheet = () => {
  const [customBases] = useLocalStorage<CustomBase[]>("custom-ip-bases", []);
  const [selectedBases, setSelectedBases] = useLocalStorage<string[]>("selected-ip-bases", []);

  const handleBaseSelection = (base: string) => {
    try {
      setSelectedBases((prev) => {
        const currentBases = Array.isArray(prev) ? prev : [];
        const hasRange = currentBases.includes(base);
        return hasRange 
          ? currentBases.filter(r => r !== base)
          : [...currentBases, base];
      });
    } catch (error) {
      console.error('Error selecting base:', base, error);
    }
  };

  const allSelected = (bases: string[]): boolean => {
    if (!bases.length || !selectedBases?.length) return false;
    return bases.every(base => selectedBases.includes(base));
  };

  const toggleAll = (isChecked: CheckedState, bases: string[]): void => {
    setSelectedBases((prev) => {
      const currentBases = Array.isArray(prev) ? prev : [];
      const filteredBases = currentBases.filter(r => !bases.includes(r));
      return isChecked ? [...filteredBases, ...bases] : filteredBases;
    });
  };

  // Find orphaned bases
  const orphanedBases = selectedBases?.filter(base => 
    !customBases.some(cb => cb.base === base) && 
    !predefinedBases.some(pb => pb.bases.includes(base))
  );

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
          <AddIpBaseDialog />
        </SheetHeader>

        {/* Orphaned Bases Section */}
        {orphanedBases?.length > 0 && (
          <Collapsible className="min-w-[350px] space-y-2">
            <div className="flex items-center justify-between space-x-4 px-4">
              <div className="flex flex-row items-center">
                <h4 className="text-sm font-semibold text-yellow-600">
                  Previously Selected Ranges ({orphanedBases.length})
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
              {orphanedBases.map(base => (
                <div
                  key={base}
                  className={cn(
                    "rounded-md border px-4 py-3 font-mono text-sm",
                    selectedBases?.includes(base) ? "bg-green-400" : ""
                  )}
                  onClick={() => handleBaseSelection(base)}
                >
                  {base}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Custom Bases Section */}
        <Collapsible className="min-w-[350px] space-y-2">
          <div className="flex items-center justify-between space-x-4 px-4">
            <div className="flex flex-row items-center">
              <Checkbox
                className="mx-2"
                checked={allSelected(customBases.map((e) => e.base))}
                onCheckedChange={(c) =>
                  toggleAll(
                    c,
                    customBases.map((e) => e.base)
                  )
                }
              />
              <h4 className="text-sm font-semibold">
                Custom ({customBases.length})
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
            {customBases.map((e, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-md border px-4 py-3 font-mono text-sm",
                  selectedBases?.includes(e.base) ? "bg-green-400" : ""
                )}
                onClick={() => handleBaseSelection(e.base)}
              >
                {e.name}: {e.base}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Predefined Bases Section */}
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
                    selectedBases?.includes(b) ? "bg-green-400" : ""
                  )}
                  onClick={() => handleBaseSelection(b)}
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
      "10.0.150",
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
      "10.0.145",
      "10.0.146",
      "10.0.147",
      "10.0.148",
      "10.0.149",
      "10.0.15",
      "10.0.16",
      "10.0.17",
      "10.0.18",
      "10.0.19",
      "10.0.20",
      "10.0.21",
      "10.0.22",
      "10.0.23",
    ],
  },
  // {
  //   name: "Site 5",
  //   bases: [
  //     "10.0.10",
  //     "10.0.11",
  //     "10.0.12",
  //     "10.0.13",
  //     "10.0.14",
  //     "10.0.15",
  //     "10.0.16",
  //     "10.0.17",
  //     "10.0.18",
  //     "10.0.183",
  //     "10.0.19",
  //     "10.0.20",
  //     "10.0.3",
  //     "10.0.4",
  //     "10.0.5",
  //     "10.0.50",
  //     "10.0.51",
  //     "10.0.52",
  //     "10.0.53",
  //     "10.0.54",
  //     "10.0.55",
  //     "10.0.6",
  //     "10.0.7",
  //     "10.0.8",
  //     "10.0.9",
  //   ],
  // },
  // {
  //   name: "Site 5 BTC",
  //   bases: [
  //     "10.0.150",
  //     "10.0.151",
  //     "10.0.152",
  //     "10.0.153",
  //     "10.0.154",
  //     "10.0.155",
  //     "10.0.156",
  //     "10.0.157",
  //     "10.0.158",
  //     "10.0.159",
  //     "10.0.160",
  //     "10.0.145",
  //     "10.0.146",
  //     "10.0.147",
  //     "10.0.148",
  //     "10.0.149",
  //     "10.0.15",
  //     "10.0.16",
  //     "10.0.17",
  //     "10.0.18",
  //     "10.0.19",
  //     "10.0.20",
  //     "10.0.21",
  //     "10.0.22",
  //     "10.0.23",
  //   ],
  // },
  // {
  //   name: "HQ",
  //   bases: [
  //     "10.0.45",
  //     "10.0.46",
  //     "10.0.47",
  //     "10.0.48",
  //     "10.0.49",
  //     "10.0.50",
  //     "10.0.51",
  //     "10.0.52",
  //     "10.0.53",
  //     "10.0.54",
  //     "10.0.55",
  //   ],
  // },
];

