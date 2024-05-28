import { Button } from "@/components/ui/button";
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

import { useState } from "react";

export const AddIpBaseDialog = () => {
  const [open, setOpen] = useState(false);
  return (
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
              placeholder="Choose a name for the range. (e.g Pod 69)"
            />
          </div>
          <div className="w-full gap-2">
            <Label htmlFor="address">Address Prefix</Label>
            <Input id="address" placeholder="XX.X.XXX (10.0.169)" />
          </div>
          <div className="w-full gap-2">
            <Label htmlFor="start">Starting IP</Label>
            <Input id="start" placeholder="1" />
          </div>
          <div className="w-full gap-2">
            <Label htmlFor="end">Ending IP</Label>
            <Input id="end" placeholder="99" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
