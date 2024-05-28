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
import { ChevronsUpDown } from "lucide-react";
import { AddIpBaseDialog } from "./add-ip-base-dialog";

export const SelectIpBaseSheet = () => {
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
        <Collapsible className="min-w-[350px] space-y-2">
          <div className="flex items-center justify-between space-x-4 px-4">
            <div className="flex flex-row items-center">
              <Checkbox className="mx-2" />
              <h4 className="text-sm font-semibold">Pre-defined for CFU</h4>
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
  );
};
