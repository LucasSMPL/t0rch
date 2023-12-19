"use client";
import ScanTable from "./components/scan-table";
import ScannerStats from "./components/scanner-stats";

export default function ScannerPage() {
  return (
    <div>
      <div className="pt-10" style={{ marginBottom: "40px" }}>
        <ScannerStats />
      </div>
      <ScanTable />
    </div>
  );
}
