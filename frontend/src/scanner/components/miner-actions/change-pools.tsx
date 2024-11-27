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
import { Config, ScannedIp } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation,useQuery } from "react-query";
import { z } from "zod";

const ChangePoolsFormSchema = z.object({
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

export const ChangePoolsAction = ({ miner }: { miner: ScannedIp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ChangePoolsFormSchema>>({
    resolver: zodResolver(ChangePoolsFormSchema),
    defaultValues: {
      pools: undefined,
    },
  });

  useQuery(
    ["pools", miner.ip],
    async () => {
      try {
        const response = await axios.get<
          Config
        >(`http://localhost:7070/config/${miner.ip}`);
        form.setValue("pools", response.data.pools);
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching current pools:", error);
        toast({
          title: "Error fetching current pools",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      }
    },
    {
      enabled: isOpen,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  function onSubmit(values: z.infer<typeof ChangePoolsFormSchema>) {
    console.log(values);
    changePools.mutate({ m: miner, pools: values.pools });
  }

  const changePools = useMutation(
    async ({
      m,
      pools,
    }: {
      m: ScannedIp;
      pools: z.infer<typeof ChangePoolsFormSchema>["pools"];
    }) => {
      try {
        await axios.post("http://localhost:7070/pools", {
          ips: [m.ip],
          pools: pools,
        });
      } catch (error) {
        console.error("Error changing pools:", error);
        throw error; // Rethrow to trigger onError
      }
    },
    {
      onSuccess: () => {
        form.reset();
        toast({
          title: "Change Pool Command Sent Successfully",
          description: "Please allow 15-30 seconds for the miners to update.",
          variant: "success",
        });
      },
      onError: (e) => {
        console.log(e);
        toast({
          title: "Something went wrong!",
          description: e instanceof Error ? e.message : "Unknown error",
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
          className="w-full"
        >
          Change Pools
        </Button>
      </DialogTrigger>
      {isOpen && (
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
                            defaultValue={field.value}
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
      )}
    </Dialog>
  );
};
