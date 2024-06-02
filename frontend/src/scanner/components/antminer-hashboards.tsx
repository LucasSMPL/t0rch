import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Check } from "lucide-react"
import { useState } from "react"

const AntminerHashboardView = () => {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
      setOpen(false);
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <Button variant={"outline"} style={{ borderColor: "#D22B2B" }} className="mr-4" >View Hashboards</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1100px]">
              <DialogHeader>
                <DialogTitle className="text-center">Viewing 'worker' Hashboards</DialogTitle>
                <DialogDescription>
        <div className="grid grid-cols-3 gap-4 py-4">
                <Card>
                <CardTitle className="p-4 text-center">Hashboard 1</CardTitle>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Hashrate</div>
                        <div className="text-lg font-bold">34.5 / 35 TH</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Chip Count</div>
                        <div className="text-lg font-bold">126</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Freq</div>
                        <div className="text-lg font-bold">84 MHz</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">EEPROM</div>
                        <div className="text-lg font-bold"><Check style={{ color: "green" }}/></div>
                    </div>
                    </div>
                    <div className="text-center">
                    <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Hashboard Temps</div>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-1 items-center gap-2">
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-medium">PIC Temps</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">50, 55, 61, 54</div>
                        </div>
                        </div>
                        <div className="grid grid-cols-1 items-center gap-2">
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-medium">PCB Temp</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">50, 55, 61, 54</div>
                        </div>
                        </div>
                        <div className="grid grid-cols-1 items-center gap-2">
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-medium">Chip Temp</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">50, 55, 61, 54</div>
                        </div>
                        </div>
                    </div>
                    </div>
                </CardContent>
                </Card>
                <Card>
                <CardTitle className="p-4 text-center">Hashboard 2</CardTitle>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Hashrate</div>
                        <div className="text-lg font-bold">34.5 / 35 TH</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Chip Count</div>
                        <div className="text-lg font-bold">126</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Freq</div>
                        <div className="text-lg font-bold">84 MHz</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">EEPROM</div>
                        <div className="text-lg font-bold"><Check style={{ color: "green" }}/></div>
                    </div>
                    </div>
                    <div className="text-center">
                    <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Hashboard Temps</div>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-1 items-center gap-2">
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-medium">PIC Temps</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">50, 55, 61, 54</div>
                        </div>
                        </div>
                        <div className="grid grid-cols-1 items-center gap-2">
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-medium">PCB Temp</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">50, 55, 61, 54</div>
                        </div>
                        </div>
                        <div className="grid grid-cols-1 items-center gap-2">
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-medium">Chip Temp</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">50, 55, 61, 54</div>
                        </div>
                        </div>
                    </div>
                    </div>
                </CardContent>
                </Card>
                <Card>
                <CardTitle className="p-4 text-center">Hashboard 3</CardTitle>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Hashrate</div>
                        <div className="text-lg font-bold">34.5 / 35 TH</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Chip Count</div>
                        <div className="text-lg font-bold">126</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Freq</div>
                        <div className="text-lg font-bold">84 MHz</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">EEPROM</div>
                        <div className="text-lg font-bold"><Check style={{ color: "green" }}/></div>
                    </div>
                    </div>
                    <div className="text-center">
                    <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Hashboard Temps</div>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-1 items-center gap-2">
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-medium">PIC Temps</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">50, 55, 61, 54</div>
                        </div>
                        </div>
                        <div className="grid grid-cols-1 items-center gap-2">
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-medium">PCB Temp</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">50, 55, 61, 54</div>
                        </div>
                        </div>
                        <div className="grid grid-cols-1 items-center gap-2">
                        <div className="flex flex-col items-center">
                            <div className="text-sm font-medium">Chip Temp</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">50, 55, 61, 54</div>
                        </div>
                        </div>
                    </div>
                    </div>
                </CardContent>
                </Card>
                </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-center items-center">
              <Button className="mx-auto" onClick={handleClose}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

    )
}

export default AntminerHashboardView