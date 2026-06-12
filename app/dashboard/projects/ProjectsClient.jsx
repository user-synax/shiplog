"use client";

import { useState, useEffect } from "react";
import { useProjectsStore } from "@/stores/projectsStore";
import { X } from "lucide-react";
import { Pin } from "lucide-react";
import { PinOff } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";

export default function ProjectsClient({ initialProjects, isPro }) {
    const { projects, setProjects, addProject, updateProject, removeProject } =
        useProjectsStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        setProjects(initialProjects);
    }, [initialProjects, setProjects]);

    return (
        <div className="max-w-6xl mt-14 md:mt-13 mx-auto space-y-6 md:space-y-8 px-4 md:px-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1
                    className="text-2xl md:text-3xl font-bold tracking-tight"
                    style={{
                        fontFamily: "var(--font-plus-jakarta-sans)",
                        color: "var(--color-ink)",
                        letterSpacing: "-0.8px",
                    }}
                >
                    Projects
                </h1>
                {!isPro && projects.length >= 5 ? (
                    <button
                        disabled
                        className="px-6 py-3 rounded-full opacity-50 cursor-not-allowed"
                        style={{
                            backgroundColor: "var(--color-surface-1)",
                            color: "var(--color-ink-muted)",
                            fontSize: "14px",
                            fontWeight: "500",
                            letterSpacing: "-0.14px",
                        }}
                    >
                        Add Project (Locked)
                    </button>
                ) : (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 rounded-full font-medium hover:cursor-pointer transition-all duration-200 hover:opacity-90"
                        style={{
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-canvas)",
                            fontSize: "14px",
                            fontWeight: "500",
                            letterSpacing: "-0.14px",
                        }}
                    >
                        Add Project
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {projects.map((project, index) => (
                    <div
                        key={project._id}
                        className="group relative p-5 md:p-6 rounded-2xl transition-all duration-200 hover:border-[rgba(255,255,255,0.14)]"
                        style={{
                            backgroundColor: "var(--color-surface-1)",
                            border: "1px solid var(--color-hairline)",
                            borderRadius: "20px",
                        }}
                    >
                        {/* ── Header ── */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                            {/* Left: pin star + title + status */}
                            <div className="flex items-center gap-2 flex-wrap min-w-0">
                                {project.isPinned && (
                                    <span
                                        className="text-base leading-none select-none"
                                        aria-label="Pinned"
                                    >
                                        ⭐
                                    </span>
                                )}
                                <h3
                                    className="text-base md:text-lg font-medium truncate"
                                    style={{
                                        color: "var(--color-ink)",
                                        letterSpacing: "-0.4px",
                                    }}
                                >
                                    {project.title}
                                </h3>
                                <span
                                    className="shrink-0 px-3 py-1 text-xs font-medium"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-2)",
                                        color: "var(--color-ink-muted)",
                                        borderRadius: "100px",
                                        fontSize: "12px",
                                        letterSpacing: "-0.12px",
                                    }}
                                >
                                    {project.status}
                                </span>
                            </div>

                            {/* Right: control buttons */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    onClick={() => handleTogglePin(project._id)}
                                    title={project.isPinned ? "Unpin" : "Pin"}
                                    className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-150 active:scale-90"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-2)",
                                        color: project.isPinned
                                            ? "#f5c542"
                                            : "var(--color-ink-muted)",
                                    }}
                                >
                                    {project.isPinned ? (
                                        <PinOff className="w-3.5 h-3.5" />
                                    ) : (
                                        <Pin className="w-3.5 h-3.5" />
                                    )}
                                </button>

                                <button
                                    onClick={() =>
                                        handleReorder(project._id, "up")
                                    }
                                    disabled={index === 0}
                                    className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-150 active:scale-90 disabled:opacity-25 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-2)",
                                        color: "var(--color-ink-muted)",
                                    }}
                                >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                </button>

                                <button
                                    onClick={() =>
                                        handleReorder(project._id, "down")
                                    }
                                    disabled={index === projects.length - 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-150 active:scale-90 disabled:opacity-25 disabled:cursor-not-allowed"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-2)",
                                        color: "var(--color-ink-muted)",
                                    }}
                                >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* ── Cover image / gradient ── */}
                        {project.coverImage ? (
                            <img
                                src={project.coverImage}
                                alt=""
                                className="w-full h-40 md:h-44 object-cover mb-4"
                                style={{ borderRadius: "15px" }}
                            />
                        ) : (
                            <div
                                className="w-full h-40 md:h-44 mb-4 flex items-end p-4"
                                style={{
                                    background:
                                        "linear-gradient(135deg, var(--color-gradient-violet), var(--color-gradient-magenta))",
                                    borderRadius: "15px",
                                }}
                            >
                                <span
                                    className="text-xs font-medium opacity-60"
                                    style={{
                                        color: "#fff",
                                        letterSpacing: "-0.12px",
                                    }}
                                >
                                    No cover
                                </span>
                            </div>
                        )}

                        {/* ── Description ── */}
                        <p
                            className="mb-4 line-clamp-3"
                            style={{
                                color: "var(--color-ink-muted)",
                                fontSize: "14px",
                                letterSpacing: "-0.14px",
                                lineHeight: "1.45",
                            }}
                        >
                            {project.description}
                        </p>

                        {/* ── Tech stack chips ── */}
                        {project.techStack?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {project.techStack
                                    .slice(0, 4)
                                    .map((tech, i) => (
                                        <span
                                            key={i}
                                            className="px-2.5 py-1"
                                            style={{
                                                backgroundColor:
                                                    "var(--color-surface-2)",
                                                color: "var(--color-ink-muted)",
                                                borderRadius: "100px",
                                                fontSize: "11px",
                                                fontWeight: "500",
                                                letterSpacing: "-0.11px",
                                            }}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                {project.techStack.length > 4 && (
                                    <span
                                        className="px-2.5 py-1"
                                        style={{
                                            backgroundColor:
                                                "var(--color-surface-2)",
                                            color: "var(--color-ink-muted)",
                                            borderRadius: "100px",
                                            fontSize: "11px",
                                            fontWeight: "500",
                                            letterSpacing: "-0.11px",
                                        }}
                                    >
                                        +{project.techStack.length - 4}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* ── Divider + Actions ── */}
                        <div
                            className="h-px mb-3"
                            style={{ backgroundColor: "var(--color-hairline)" }}
                        />

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setEditingProject(project)}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm transition-all duration-150 hover:opacity-80 active:scale-95"
                                style={{
                                    backgroundColor: "var(--color-surface-2)",
                                    color: "var(--color-ink)",
                                    borderRadius: "100px",
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    letterSpacing: "-0.13px",
                                }}
                            >
                                <Pencil className="w-3 h-3" />
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(project._id)}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm transition-all duration-150 hover:opacity-80 active:scale-95"
                                style={{
                                    backgroundColor: "var(--color-surface-2)",
                                    color: "var(--color-accent-red)",
                                    borderRadius: "100px",
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    letterSpacing: "-0.13px",
                                }}
                            >
                                <Trash2 className="w-3 h-3" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {(isModalOpen || editingProject) && (
                <AddEditModal
                    isOpen={isModalOpen || !!editingProject}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingProject(null);
                    }}
                    onSave={async (data) => {
                        if (editingProject) {
                            const res = await fetch(
                                `/api/projects/${editingProject._id}`,
                                {
                                    method: "PATCH",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(data),
                                },
                            );
                            const updatedProject = (await res.json()).project;
                            updateProject(editingProject._id, updatedProject);
                        } else {
                            const res = await fetch("/api/projects", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(data),
                            });
                            const project = (await res.json()).project;
                            addProject(project);
                        }
                        setIsModalOpen(false);
                        setEditingProject(null);
                    }}
                    project={editingProject}
                />
            )}
        </div>
    );

    async function handleTogglePin(id) {
        const res = await fetch(`/api/projects/${id}/pin`, { method: "PATCH" });
        const updatedProject = (await res.json()).project;
        updateProject(id, updatedProject);
    }

    async function handleReorder(id, direction) {
        const newProjects = [...projects];
        const index = newProjects.findIndex((p) => p._id === id);
        const newIndex = direction === "up" ? index - 1 : index + 1;
        const temp = newProjects[index];
        newProjects[index] = newProjects[newIndex];
        newProjects[newIndex] = temp;
        setProjects(newProjects);
        await fetch("/api/projects/reorder", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                updates: newProjects.map((p, i) => ({ id: p._id, order: i })),
            }),
        });
    }

    async function handleDelete(id) {
        if (!confirm("Delete this project?")) return;
        await fetch(`/api/projects/${id}`, { method: "DELETE" });
        removeProject(id);
    }
}

function AddEditModal({ isOpen, onClose, onSave, project }) {
    const [formData, setFormData] = useState({
        title: project?.title || "",
        description: project?.description || "",
        coverImage: project?.coverImage || "",
        techStack: project?.techStack || [],
        demoUrl: project?.demoUrl || "",
        repoUrl: project?.repoUrl || "",
        status: project?.status || "building",
    });
    const [isUploading, setIsUploading] = useState(false);
    const [newTech, setNewTech] = useState("");

    function handleTechAdd(e) {
        if (e.key === "Enter" && newTech.trim()) {
            e.preventDefault();
            if (!formData.techStack.includes(newTech.trim())) {
                setFormData({
                    ...formData,
                    techStack: [...formData.techStack, newTech.trim()],
                });
            }
            setNewTech("");
        }
    }

    function removeTech(tech) {
        setFormData({
            ...formData,
            techStack: formData.techStack.filter((t) => t !== tech),
        });
    }

    async function handleCoverUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        const formDataObj = new FormData();
        formDataObj.append("file", file);
        const res = await fetch("/api/projects/cover", {
            method: "POST",
            body: formDataObj,
        });
        const { url } = await res.json();
        setFormData({ ...formData, coverImage: url });
        setIsUploading(false);
    }

    return (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center bg-black/50 z-50 p-0 sm:p-4">
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    await onSave(formData);
                }}
                className="w-full max-w-lg p-5 sm:p-6 md:p-8 rounded-t-3xl sm:rounded-3xl flex flex-col max-h-[90vh] sm:max-h-[85vh]"
                style={{
                    backgroundColor: "var(--color-surface-1)",
                    borderRadius: "30px 30px 0 0",
                    border: "1px solid var(--color-hairline)",
                    borderBottom: "none",
                }}
            >
                <div className="flex items-center justify-between mb-5 sm:mb-6 shrink-0">
                    <h2
                        className="text-xl sm:text-2xl font-bold tracking-tight"
                        style={{
                            fontFamily: "var(--font-plus-jakarta-sans)",
                            color: "var(--color-ink)",
                            letterSpacing: "-0.8px",
                        }}
                    >
                        {project ? "Edit Project" : "Add Project"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl p-2 rounded-full transition-all duration-200 hover:opacity-80"
                        style={{
                            color: "var(--color-ink-muted)",
                            backgroundColor: "var(--color-surface-2)",
                            borderRadius: "9999px",
                        }}
                    >
                        <X />
                    </button>
                </div>
                <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                    <div>
                        <label
                            className="block mb-2"
                            style={{
                                color: "var(--color-ink-muted)",
                                fontSize: "14px",
                                letterSpacing: "-0.14px",
                            }}
                        >
                            Cover Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverUpload}
                            disabled={isUploading}
                            className="w-full"
                            style={{
                                color: "var(--color-ink)",
                            }}
                        />
                        {formData.coverImage && (
                            <img
                                src={formData.coverImage}
                                className="w-full h-28 sm:h-32 object-cover mt-3"
                                style={{
                                    borderRadius: "15px",
                                }}
                            />
                        )}
                    </div>
                    <div>
                        <label
                            className="block mb-2"
                            style={{
                                color: "var(--color-ink-muted)",
                                fontSize: "14px",
                                letterSpacing: "-0.14px",
                            }}
                        >
                            Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 rounded-lg bg-transparent border"
                            style={{
                                borderColor: "var(--color-hairline)",
                                color: "var(--color-ink)",
                                backgroundColor: "var(--color-surface-1)",
                                borderRadius: "10px",
                                fontSize: "15px",
                                letterSpacing: "-0.15px",
                            }}
                        />
                    </div>
                    <div>
                        <label
                            className="block mb-2"
                            style={{
                                color: "var(--color-ink-muted)",
                                fontSize: "14px",
                                letterSpacing: "-0.14px",
                            }}
                        >
                            Description *
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg bg-transparent border resize-none"
                            style={{
                                borderColor: "var(--color-hairline)",
                                color: "var(--color-ink)",
                                backgroundColor: "var(--color-surface-1)",
                                borderRadius: "10px",
                                fontSize: "15px",
                                letterSpacing: "-0.15px",
                                lineHeight: "1.30",
                            }}
                        />
                    </div>
                    <div>
                        <label
                            className="block mb-2"
                            style={{
                                color: "var(--color-ink-muted)",
                                fontSize: "14px",
                                letterSpacing: "-0.14px",
                            }}
                        >
                            Tech Stack (enter to add)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {formData.techStack.map((tech) => (
                                <span
                                    key={tech}
                                    onClick={() => removeTech(tech)}
                                    className="flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer transition-all duration-200 hover:opacity-80"
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface-2)",
                                        color: "var(--color-ink)",
                                        borderRadius: "100px",
                                        fontSize: "12px",
                                        letterSpacing: "-0.12px",
                                    }}
                                >
                                    {tech}{" "}
                                    <span className="cursor-pointer">×</span>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={newTech}
                            onChange={(e) => setNewTech(e.target.value)}
                            onKeyDown={handleTechAdd}
                            className="w-full px-4 py-3 rounded-lg bg-transparent border"
                            style={{
                                borderColor: "var(--color-hairline)",
                                color: "var(--color-ink)",
                                backgroundColor: "var(--color-surface-1)",
                                borderRadius: "10px",
                                fontSize: "15px",
                                letterSpacing: "-0.15px",
                            }}
                        />
                    </div>
                    <div>
                        <label
                            className="block mb-2"
                            style={{
                                color: "var(--color-ink-muted)",
                                fontSize: "14px",
                                letterSpacing: "-0.14px",
                            }}
                        >
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    status: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 rounded-lg bg-transparent border"
                            style={{
                                borderColor: "var(--color-hairline)",
                                color: "var(--color-ink)",
                                backgroundColor: "var(--color-surface-1)",
                                borderRadius: "10px",
                                fontSize: "15px",
                                letterSpacing: "-0.15px",
                            }}
                        >
                            {["building", "launched", "paused", "archived"].map(
                                (s) => (
                                    <option key={s} value={s}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </option>
                                ),
                            )}
                        </select>
                    </div>
                    <div>
                        <label
                            className="block mb-2"
                            style={{
                                color: "var(--color-ink-muted)",
                                fontSize: "14px",
                                letterSpacing: "-0.14px",
                            }}
                        >
                            Demo URL
                        </label>
                        <input
                            type="url"
                            value={formData.demoUrl}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    demoUrl: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 rounded-lg bg-transparent border"
                            style={{
                                borderColor: "var(--color-hairline)",
                                color: "var(--color-ink)",
                                backgroundColor: "var(--color-surface-1)",
                                borderRadius: "10px",
                                fontSize: "15px",
                                letterSpacing: "-0.15px",
                            }}
                        />
                    </div>
                    <div>
                        <label
                            className="block mb-2"
                            style={{
                                color: "var(--color-ink-muted)",
                                fontSize: "14px",
                                letterSpacing: "-0.14px",
                            }}
                        >
                            Repo URL
                        </label>
                        <input
                            type="url"
                            value={formData.repoUrl}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    repoUrl: e.target.value,
                                })
                            }
                            className="w-full px-4 py-3 rounded-lg bg-transparent border"
                            style={{
                                borderColor: "var(--color-hairline)",
                                color: "var(--color-ink)",
                                backgroundColor: "var(--color-surface-1)",
                                borderRadius: "10px",
                                fontSize: "15px",
                                letterSpacing: "-0.15px",
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-full transition-all duration-200 hover:opacity-80"
                        style={{
                            backgroundColor: "var(--color-surface-2)",
                            color: "var(--color-ink)",
                            borderRadius: "100px",
                            fontSize: "14px",
                            fontWeight: "500",
                            letterSpacing: "-0.14px",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isUploading}
                        className="flex-1 py-3 rounded-full transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-canvas)",
                            borderRadius: "100px",
                            fontSize: "14px",
                            fontWeight: "500",
                            letterSpacing: "-0.14px",
                        }}
                    >
                        {project ? "Save Changes" : "Add Project"}
                    </button>
                </div>
            </form>
        </div>
    );
}
