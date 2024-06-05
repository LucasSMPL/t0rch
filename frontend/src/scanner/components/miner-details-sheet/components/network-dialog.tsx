import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkInfo, ScannedIp } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { TabsContent } from "@radix-ui/react-tabs";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { z } from "zod";

export const NetworkDialog = ({ miner }: { miner: ScannedIp }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button
          variant={"outline"}
          style={{ borderColor: "#D22B2B" }}
          className="mr-4"
        >
          IP Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px]">
        <DialogHeader>
          <DialogTitle>Change IP Settings</DialogTitle>
          <DialogDescription>
            Please modify the internet protocol information below, and click
            update.
          </DialogDescription>
        </DialogHeader>
        {/* <SelectSeparator /> */}
        {isOpen && <NetworkData miner={miner} />}
      </DialogContent>
    </Dialog>
  );
};

const NetworkData = ({ miner }: { miner: ScannedIp }) => {
  const networkData = useQuery(["network", miner.ip], async () => {
    const response = await axios.get<NetworkInfo>(
      `http://localhost:7070/network/${miner.ip}/`
    );

    return response.data;
  });
  return (
    <>
      <div className="grid gap-3 pt-10">
        <ul className="grid gap-3">
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Protocol</span>
            <span style={{ color: "#e94d1b" }}>Static</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">IP</span>
            <span style={{ color: "#e94d1b" }}>
              <a href="http://root:root@ip" target="_blank">
                $ip
              </a>
              {miner.ip}
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">MAC</span>
            <span style={{ color: "#e94d1b" }}>
              {networkData.data?.macaddr}
            </span>
          </li>
        </ul>
      </div>
      <Tabs defaultValue="static">
        <div className="flex items-center justify-center">
          <TabsList>
            <TabsTrigger value="static">Static</TabsTrigger>
            <TabsTrigger value="dhcp">DHCP</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="static">
          {networkData.isLoading ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          ) : (
            networkData.data && <NetworkInfoForm info={networkData.data} />
          )}
        </TabsContent>
        <TabsContent value="dhcp">
          <div className="flex items-center justify-center pt-10 pb-10">
            <Label>
              Your miner will auto configure the network configuration to DHCP
              Protocol.
            </Label>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

const NetworkInfoFormSchema = z.object({
  ip: z.string().ip(),
  netmask: z.string(),
  gateway: z.string(),
  dns: z.string(),
});

const NetworkInfoForm = ({ info }: { info: NetworkInfo }) => {
  const form = useForm<z.infer<typeof NetworkInfoFormSchema>>({
    resolver: zodResolver(NetworkInfoFormSchema),
    defaultValues: {
      ip: info.ipaddress,
      netmask: info.netmask,
      gateway: info.conf_gateway,
      dns: info.conf_dnsservers,
    },
  });

  function onSubmit(values: z.infer<typeof NetworkInfoFormSchema>) {
    console.log(values);
    // changePools.mutate({ m: miners, pools: values.pools });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="ip"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>IP Address</FormLabel>
              <FormControl>
                <Input placeholder="IP Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gateway"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Gateway</FormLabel>
              <FormControl>
                <Input placeholder="Gateway" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="netmask"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Netmask</FormLabel>
              <FormControl>
                <Input placeholder="Netmask" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dns"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>DNS</FormLabel>
              <FormControl>
                <Input placeholder="DNS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="flex justify-center items-center">
          <Button type="submit">Update Network Info</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
