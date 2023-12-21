"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [streamRes, setStreamRes] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      // const abortController = new AbortController();
      const response = await fetch(`/api/stream-test`, {
        method: "GET",
        // keepalive: false,
        // signal: abortController.signal,
      });
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true && reader) {
        const { value, done } = await reader.read();
        if (done) break;
        const decoded = JSON.parse(decoder.decode(value));
        setStreamRes((prev) => [...prev, decoded]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Button onClick={fetchData}>Start Stream</Button>
      <p>{JSON.stringify(streamRes, null, 2)}</p>
    </main>
  );
}
