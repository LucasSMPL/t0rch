import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { Chain, ScannedIp } from "@/lib/types";

interface IpStats {
  STATS: {
    chain: Chain[];
  }[];
}

const AntminerHashboardView = ({ miner }: { miner: ScannedIp }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery(
    ['hashboards', miner.ip],
    async () => {
      const response = await axios.get<IpStats>(`http://localhost:7070/hashboards/${miner.ip}/`);
      console.log('Response data:', response.data);  // Log the response data
      return response.data;
    },
    {
      enabled: isOpen,
    }
  );

  const handleClose = () => {
    setIsOpen(false);
  };

  const getTempColor = (temp: number) => {
    if (temp > 85) return 'text-red-500 dark:text-red-500';
    if (temp > 75) return 'text-yellow-500 dark:text-yellow-500';
    return 'text-gray-500 dark:text-gray-400';
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant={"outline"} style={{ borderColor: "#D22B2B" }} className="w-full">View Hashboards</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1100px]">
        <DialogHeader>
          <DialogTitle className="text-center">Viewing <span style={{ color: "#e94d1b" }}>{miner.worker}</span> Hashboards</DialogTitle>
          <DialogDescription>
            {isLoading && <Loader2 className="mx-auto h-4 w-4 animate-spin" />}
            {data && data.STATS ? (
              <div className="grid grid-cols-3 gap-4 py-4">
                {data.STATS.map(stat =>
                  stat.chain.map((chain, chainIndex) => {
                    const formattedRealHashrate = (chain.rate_real / 1000).toFixed(2);
                    const formattedIdealHashrate = (chain.rate_ideal / 1000).toFixed(2);

                    return (
                      <Card key={chainIndex}>
                        <CardTitle className="p-4 text-center">Hashboard {chainIndex + 1}</CardTitle>
                        <CardContent className="grid gap-6">
                          <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Hashrate</div>
                              <div className="text-lg font-bold">{formattedRealHashrate} / {formattedIdealHashrate} TH</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Chip Count</div>
                              <div className="text-lg font-bold">{chain.asic_num}</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Freq</div>
                              <div className="text-lg font-bold">{chain.freq_avg} MHz</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">EEPROM</div>
                              <div className="text-lg font-bold">
                                {chain.eeprom_loaded ? <Check style={{ color: "green" }} /> : <span style={{ color: "red" }}>Not Loaded</span>}
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Hashboard Temps</div>
                            <div className="grid gap-4">
                              <div className="grid grid-cols-1 items-center gap-2">
                                <div className="flex flex-col items-center">
                                  <div className="text-sm font-medium">PIC Temps</div>
                                  <div className="text-xs">
                                    {chain.temp_pic.map((temp, index) => (
                                      <span key={index} className={getTempColor(temp)}>{temp}{index < chain.temp_pic.length - 1 && ', '}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 items-center gap-2">
                                <div className="flex flex-col items-center">
                                  <div className="text-sm font-medium">PCB Temp</div>
                                  <div className="text-xs">
                                    {chain.temp_pcb.map((temp, index) => (
                                      <span key={index} className={getTempColor(temp)}>{temp}{index < chain.temp_pcb.length - 1 && ', '}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 items-center gap-2">
                                <div className="flex flex-col items-center">
                                  <div className="text-sm font-medium">Chip Temp</div>
                                  <div className="text-xs">
                                    {chain.temp_chip.map((temp, index) => (
                                      <span key={index} className={getTempColor(temp)}>{temp}{index < chain.temp_chip.length - 1 && ', '}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            ) : (
              <div>No data available</div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center items-center">
          <Button className="mx-auto" onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AntminerHashboardView;
