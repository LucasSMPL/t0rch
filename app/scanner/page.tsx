"use client";
import TodoTable from "./components/todo-table/scan-table";
import ScannerStats from "./components/todo-table/scanner-stats";

export default function ScannerPage() {
  return (
    <div>
      <div className="pt-10" style={{ marginBottom: "40px" }}>
        <ScannerStats />
      </div>
      <TodoTable />
    </div>
  );
}