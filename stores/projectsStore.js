import { create } from "zustand";

export const useProjectsStore = create((set) => ({
    projects: [],
    setProjects: (projects) => set({ projects }),
    addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
    updateProject: (id, updates) =>
        set((state) => ({
            projects: state.projects.map((p) =>
                p._id === id ? { ...p, ...updates } : p,
            ),
        })),
    removeProject: (id) =>
        set((state) => ({
            projects: state.projects.filter((p) => p._id !== id),
        })),
    togglePin: (id) =>
        set((state) => ({
            projects: state.projects.map((p) =>
                p._id === id ? { ...p, isPinned: !p.isPinned } : p,
            ),
        })),
    reorderProject: (id, direction) =>
        set((state) => {
            const projects = [...state.projects];
            const index = projects.findIndex((p) => p._id === id);
            if (index === -1) return state;
            const newIndex = direction === "up" ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= projects.length) return state;
            const temp = projects[index];
            projects[index] = projects[newIndex];
            projects[newIndex] = temp;
            return { projects };
        }),
}));
