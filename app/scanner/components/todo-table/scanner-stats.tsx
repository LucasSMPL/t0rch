"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowBigDownDash, Flame, HelpCircle, Radar } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ScanStats() {
  const startScan = async () => {
    try {
      const response = await fetch("/api/api-test", { method: "GET" });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error during scan:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <h3 className="text-2xl font-bold text-orange-600">
          <Flame style={{color: "#ffffff"}} />
          t0rch | asic scanner
        </h3>
        <div className="justify-right p-4">
          <Input placeholder="10.0.215.1-10.0.215.5" />
          <Button>Configure Network</Button>
          <Button onClick={() => startScan()}>Scan Network</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Miners On Scan
            </CardTitle>
            <Radar />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">X</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Miners Underhashing
            </CardTitle>
            <ArrowBigDownDash />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">X</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Miners Missing Boards
            </CardTitle>
            <HelpCircle />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">X</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Miners Needing PSU
            </CardTitle>
            <Flame />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              X <Button>filter</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}