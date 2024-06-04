import { ScannedIp } from "@/lib/types";
import { ColumnFiltersState, RowSelectionState } from "@tanstack/react-table";
import { create } from "zustand";

type ScannedIpsStore = {
  progress: number;
  scannedIps: ScannedIp[];
  setScannedIps: (newScanned: ScannedIp[]) => void;
  reset: () => void;
  resetProgress: () => void;
};
export const useScannedIps = create<ScannedIpsStore>((set) => ({
  progress: 0,
  scannedIps: [],
  reset: () => set({ scannedIps: [], progress: 0 }),
  resetProgress: () => set((state) => ({ ...state, progress: 0 })),
  setScannedIps: (newScanned) =>
    set((state) => ({
      scannedIps: [...state.scannedIps, ...newScanned],
      progress: state.progress + newScanned.length,
    })),
}));

type SelectedIpsStore = {
  selectedIps: RowSelectionState;
  setSelectedIps: (newSelectedIps: RowSelectionState) => void;
  reset: () => void;
};
export const useSelectedIps = create<SelectedIpsStore>((set) => ({
  selectedIps: {},
  setSelectedIps: (newSelectedIps) => set({ selectedIps: newSelectedIps }),
  reset: () => set({ selectedIps: {} }),
}));

type ScanFiltersStore = {
  filters: ColumnFiltersState;
  setFilters: (newFilters: ColumnFiltersState) => void;
  reset: () => void;
};
export const useScanFilters = create<ScanFiltersStore>((set) => ({
  filters: [],
  setFilters: (newFilters) => set({ filters: newFilters }),
  reset: () => set({ filters: [] }),
}));
