import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { ScannedIp } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { z } from "zod";

const ChnagePoolsFormSchema = z.object({
  pools: z
    .array(
      z.object({
        url: z.string(),
        user: z.string(),
        pass: z.string(),
      })
    )
    .length(3),
});

export const ChangePoolsAction = ({ miners }: { miners: ScannedIp[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const existingPools = useQuery(
    ["pools"],
    async () => {
      const response = await axios.get<
        z.infer<typeof ChnagePoolsFormSchema>["pools"]
      >(`http://localhost:7070/pools/${miners.at(0)!.ip}`);
      return response.data;
    },
    {
      enabled: miners.length === 1,
    }
  );

  const form = useForm<z.infer<typeof ChnagePoolsFormSchema>>({
    resolver: zodResolver(ChnagePoolsFormSchema),
    defaultValues: {
      pools: miners.length === 1 ? existingPools.data : undefined,
    },
  });

  function onSubmit(values: z.infer<typeof ChnagePoolsFormSchema>) {
    console.log(values);
    changePools.mutate({ m: miners, pools: values.pools });
  }

  const changePools = useMutation(
    async ({
      m,
      pools,
    }: {
      m: ScannedIp[];
      pools: z.infer<typeof ChnagePoolsFormSchema>["pools"];
    }) => {
      await axios.post("http://localhost:7070/change-pools", {
        ips: m.map((x) => x.ip),
        pools: pools,
      });
    },
    {
      onSuccess: () => {
        form.reset();
        toast({
          title: "Change Pool commands sent successfully",
          variant: "success",
        });
      },
      onError: (e) => {
        console.log(e);
        toast({
          title: "Something went wrong!",
          variant: "destructive",
        });
      },
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button
          variant={"outline"}
          style={{ borderColor: "#D22B2B" }}
          className="mr-4"
        >
          Change Pools
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px]">
        <DialogHeader>
          <DialogTitle>Changing Pools</DialogTitle>
          <DialogDescription>
            Please enter your stratum url, worker/account, and password below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {[0, 1, 2].map((index) => (
              <div key={index} className="grid grid-cols-12 gap-4 py-4">
                <FormField
                  control={form.control}
                  name={`pools.${index}.url`}
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Pool URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`pools.${index}.user`}
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>User</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`pools.${index}.pass`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Pass</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <DialogFooter className="flex justify-center items-center">
              <Button type="submit">Update Pools</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
