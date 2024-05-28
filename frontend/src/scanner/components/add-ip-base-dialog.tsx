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

import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";

export const AddIpBaseDialog = ({
  customBases,
}: {
  customBases: {
    value: CustomBase[];
    setValue: Dispatch<SetStateAction<CustomBase[]>>;
  };
}) => {
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
              placeholder="XX.X.XXX (10.0.169)"
              ref={baseRef}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const input = event.target;
                const value = input.value.replace(/\D/g, ""); // Remove non-digit characters
                input.value = (value.match(/.{1,3}/g) || []).join(".");
                const chunks = [
                  value.slice(0, 2),
                  value.slice(2, 3),
                  value.slice(3),
                ].filter(Boolean); // Filter out empty strings
                input.value = chunks.join(".");
                if (value.length >= 7)
                  return (input.value = input.value.slice(0, 8));
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
                  title: "Invalid Base!",
                  variant: "destructive",
                });
              }
              const newRange = {
                name: nameRef.current!.value!,
                base: baseRef.current!.value!,
              };
              const hasDuplicate = customBases.value.find(
                (cR) => cR.name === newRange.name || cR.base === newRange.base
              );
              if (hasDuplicate) {
                return toast({
                  title: "Base already exists!",
                  variant: "destructive",
                });
              }
              customBases.setValue((prev) => [...prev, newRange]);
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
  const regex = /^\d{2}\.\d{1}\.\d{3}$/;
  return regex.test(input);
}
