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
import { useToast } from "@/components/ui/use-toast";
import { CustomBase } from "@/lib/types";
import { useLocalStorage } from "@uidotdev/usehooks";

import { ChangeEvent, useRef, useState } from "react";



export const AddIpBaseDialog = () => {
  const [customBases, setCustomBases] = useLocalStorage<CustomBase[]>(
    "custom-ip-bases",
    []
  );
  const { toast } = useToast();

  const nameRef = useRef<HTMLInputElement | null>(null);
  const baseRef = useRef<HTMLInputElement | null>(null);

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
              placeholder="Choose a name for the base. (e.g Pod 69)"
              ref={nameRef}
            />
          </div>
          <div className="w-full gap-2">
            <Label htmlFor="address">IP Base</Label>
            <Input
              id="base"
              placeholder="XX.X.XX or XX.X.XXX (e.g. 10.0.55 or 10.0.169)"
              ref={baseRef}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const input = event.target;
                const value = input.value.replace(/\D/g, ""); // Remove non-digit characters
                const chunks = [
                  value.slice(0, 2),
                  value.slice(2, 3),
                  value.slice(3),
                ].filter(Boolean);
                input.value = chunks.join(".");
                // Allow for 1-3 digits in the third octet
                if (value.length >= 7) {
                  input.value = input.value.slice(0, 7); // Limit to maximum of XX.X.XXX
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (!baseRef.current?.value || baseRef.current?.value === "") {
                return toast({
                  title: "Please choose a name for the base.",
                  variant: "destructive",
                });
              }
              if (!isValidFormat(baseRef.current?.value ?? "")) {
                return toast({
                  title: "Invalid Base! Format should be XX.X.XX or XX.X.XXX",
                  variant: "destructive",
                });
              }
              const newRange = {
                name: nameRef.current!.value!,
                base: baseRef.current!.value!,
              };
              const hasDuplicate = customBases.find(
                (cR) => cR.name === newRange.name || cR.base === newRange.base
              );
              if (hasDuplicate) {
                return toast({
                  title: "Base already exists!",
                  variant: "destructive",
                });
              }
              setCustomBases((prev) => [...prev, newRange]);
              setOpen(false);
              toast({
                title: "Custom Base Added Successfully!",
                variant: "default",
              });
            }}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function isValidFormat(input: string) {
  const regex = /^\d{2}\.\d{1}\.\d{1,3}$/;
  return regex.test(input);
}