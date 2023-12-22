"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [streamRes, setStreamRes] = useState<any[]>([]);
  useEffect(() => {
    return () => {
      console.log(`hello: ${Math.random()}`);
    };
  }, []);

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
        const d = decoder.decode(value);
        console.log(d);
        const decoded = JSON.parse(`[${d.replace(/}{/g, "},{")}]`);

        setStreamRes((prev) => [...prev, ...decoded]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Link href={"/scanner"}>Open Scanner</Link>
      <Button onClick={fetchData}>Start Stream</Button>
      <pre>{JSON.stringify(streamRes, null, 2)}</pre>
    </main>
  );
}
