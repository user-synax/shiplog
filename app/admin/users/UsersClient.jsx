"use client";

import { useState } from "react";

export default function UsersClient({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [toast, setToast] = useState(null);

  const handleTogglePro = async (userId, currentIsPro) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isPro: !currentIsPro }),
      });
      const data = await res.json();
      if (data.success) {
        // Update user with new pro subscription data
        setUsers(users.map(u => u._id === userId ? { ...u, isPro: !currentIsPro, proSubscription: !currentIsPro ? data.user.proSubscription : null } : u));
        setToast({ type: "success", message: `User ${currentIsPro ? "removed from" : "granted"} Pro` });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Failed to update user" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      try {
        const res = await fetch("/api/admin/users", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        const data = await res.json();
        if (data.success) {
          setUsers(users.filter(u => u._id !== userId));
          setToast({ type: "success", message: "User deleted successfully" });
          setTimeout(() => setToast(null), 3000);
        }
      } catch (err) {
        console.error(err);
        setToast({ type: "error", message: "Failed to delete user" });
        setTimeout(() => setToast(null), 3000);
      }
    }
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: toast.type === "success"
              ? "rgba(74,222,128,0.12)"
              : "rgba(248,113,113,0.12)",
            color: toast.type === "success"
              ? "var(--color-semantic-success)"
              : "var(--color-semantic-error)",
            border: "1px solid",
            borderColor: toast.type === "success"
              ? "rgba(74,222,128,0.3)"
              : "rgba(248,113,113,0.3)"
          }}
        >
          {toast.message}
        </div>
      )}
      
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface-1)",
          border: "1px solid var(--color-hairline)"
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: "var(--color-surface-2)" }}>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  Name
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  Email
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  Username
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  Streak
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  Projects
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  Logs
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  Pro
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  Joined
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--color-hairline)" }}>
              {users.map((user) => (
                <tr key={user._id} className="hover:opacity-80">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm font-medium"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {user.name || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm"
                      style={{ color: "var(--color-ink-muted)" }}
                    >
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm"
                      style={{ color: "var(--color-ink)" }}
                    >
                      @{user.username || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm font-medium"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {user.currentStreak}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm"
                      style={{ color: "var(--color-ink-muted)" }}
                    >
                      {user.totalProjects || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm"
                      style={{ color: "var(--color-ink-muted)" }}
                    >
                      {user.totalLogs || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: user.isPro
                            ? "rgba(139,92,246,0.15)"
                            : "var(--color-surface-2)",
                          color: user.isPro
                            ? "var(--color-gradient-violet)"
                            : "var(--color-ink-muted)"
                        }}
                      >
                        {user.isPro ? "Pro" : "Free"}
                      </span>
                      {user.isPro && user.proSubscription?.expiresAt && (
                        <span className="text-xs" style={{ color: "var(--color-ink-muted)" }}>
                          Expires: {new Date(user.proSubscription.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm"
                      style={{ color: "var(--color-ink-muted)" }}
                    >
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleTogglePro(user._id, user.isPro)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          backgroundColor: "var(--color-surface-2)",
                          color: user.isPro ? "var(--color-ink)" : "var(--color-gradient-violet)"
                        }}
                      >
                        {user.isPro ? "Remove Pro" : "Grant Pro (1 Week)"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id, user.username || user.email)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          backgroundColor: "rgba(248,113,113,0.12)",
                          color: "var(--color-semantic-error)"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
