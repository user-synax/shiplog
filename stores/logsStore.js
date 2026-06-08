import { create } from "zustand";

export const useLogsStore = create((set) => ({
    logs: [],
    hasMore: true,
    currentPage: 1,
    setLogs: (newLogs, newHasMore, newCurrentPage) =>
        set({
            logs: newLogs,
            hasMore: newHasMore,
            currentPage: newCurrentPage,
        }),
    addLog: (log) =>
        set((state) => ({
            logs: [log, ...state.logs],
        })),
    removeLog: (id) =>
        set((state) => ({
            logs: state.logs.filter((l) => l._id !== id),
        })),
}));
