"use client";

import { useState, useEffect } from "react";
import { useLogsStore } from "@/stores/logsStore";

/* ─────────────────────────────────────────────────────────────
   Framer Design System CSS
   No gradients. Canvas → surface-1 → surface-2 → surface-3.
   Pill CTAs only. Inter Variable with full OpenType variants.
───────────────────────────────────────────────────────────── */
const LOGS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

  .lc-root {
    --canvas:        #111110;
    --surface-1:     #1c1c1a;
    --surface-2:     #252522;
    --surface-3:     #2e2e2b;
    --hairline:      rgba(255,255,255,0.08);
    --hairline-soft: rgba(255,255,255,0.05);
    --ink:           #ffffff;
    --ink-muted:     #999999;
    --ink-faint:     #555553;
    --accent-blue:   #0099ff;
    --danger:        #ef4444;
    --success:       #22c55e;

    --r-xs:   4px;
    --r-sm:   6px;
    --r-md:   10px;
    --r-lg:   15px;
    --r-xl:   20px;
    --r-xxl:  30px;
    --r-pill: 100px;
    --r-full: 9999px;

    font-family: 'Inter', system-ui, sans-serif;
    font-feature-settings: "cv01","cv05","cv09","cv11","ss03","ss07","dlig";
    -webkit-font-smoothing: antialiased;
    color: var(--ink);
  }
  .lc-root * { box-sizing: border-box; }

  /* ── Page ── */
  .lc-page {
    max-width: 720px;
    margin: 0 auto;
    padding: 56px 24px 80px;
  }

  /* ── Page header ── */
  .lc-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }
  .lc-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.8px;
    line-height: 1.2;
    color: var(--ink);
  }
  .lc-streak-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    background: var(--surface-1);
    border: 1px solid var(--hairline);
    border-radius: var(--r-pill);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: -0.13px;
    color: var(--ink-muted);
    white-space: nowrap;
  }

  /* ── Form card ── */
  .lc-form-card {
    background: var(--surface-1);
    border: 1px solid var(--hairline);
    border-radius: var(--r-xl);
    padding: 24px;
    margin-bottom: 24px;
  }

  /* ── Already logged state ── */
  .lc-done-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 32px 20px;
    text-align: center;
  }
  .lc-done-icon {
    width: 44px; height: 44px;
    border-radius: var(--r-full);
    background: rgba(34,197,94,0.12);
    border: 1px solid rgba(34,197,94,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .lc-done-title {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: -0.4px;
    color: var(--ink);
  }
  .lc-done-sub {
    font-size: 14px;
    color: var(--ink-muted);
    letter-spacing: -0.14px;
  }

  /* ── Form fields ── */
  .lc-field { margin-bottom: 16px; }
  .lc-field:last-of-type { margin-bottom: 0; }

  .lc-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: -0.13px;
    color: var(--ink-muted);
  }
  .lc-char-count {
    font-size: 12px;
    color: var(--ink-faint);
    letter-spacing: -0.12px;
    font-weight: 400;
  }

  .lc-textarea {
    width: 100%;
    padding: 12px 14px;
    background: var(--surface-2);
    color: var(--ink);
    border: 1px solid var(--hairline);
    border-radius: var(--r-md);
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 15px;
    font-weight: 400;
    letter-spacing: -0.15px;
    line-height: 1.5;
    resize: none;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    -webkit-appearance: none;
  }
  .lc-textarea:focus {
    border-color: rgba(0,153,255,0.4);
    box-shadow: 0 0 0 1px rgba(0,153,255,0.2);
  }
  .lc-textarea::placeholder { color: var(--ink-faint); }

  .lc-input {
    width: 100%;
    padding: 10px 14px;
    background: var(--surface-2);
    color: var(--ink);
    border: 1px solid var(--hairline);
    border-radius: var(--r-md);
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: -0.14px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    -webkit-appearance: none;
  }
  .lc-input:focus {
    border-color: rgba(0,153,255,0.4);
    box-shadow: 0 0 0 1px rgba(0,153,255,0.2);
  }
  .lc-input::placeholder { color: var(--ink-faint); }

  /* ── Mood selector ── */
  .lc-mood-grid {
    display: flex;
    gap: 8px;
  }
  .lc-mood-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 10px 6px;
    background: var(--surface-2);
    border: 1px solid var(--hairline);
    border-radius: var(--r-lg);
    cursor: pointer;
    transition: background 0.12s, border-color 0.12s, transform 0.1s;
    font-family: inherit;
  }
  .lc-mood-btn:hover:not(:disabled) {
    background: var(--surface-3);
    border-color: rgba(255,255,255,0.14);
  }
  .lc-mood-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .lc-mood-btn-active {
    background: var(--surface-2) !important;
    border-color: rgba(255,255,255,0.35) !important;
  }
  .lc-mood-btn:active:not(:disabled) { transform: scale(0.95); }
  .lc-mood-emoji { font-size: 20px; line-height: 1; }
  .lc-mood-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: var(--ink-muted);
    line-height: 1;
  }
  .lc-mood-btn-active .lc-mood-label { color: var(--ink); }

  /* ── Submit button (white pill) ── */
  .lc-submit {
    width: 100%;
    margin-top: 20px;
    padding: 12px 20px;
    background: var(--ink);
    color: var(--canvas);
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.14px;
    line-height: 1;
    border-radius: var(--r-pill);
    border: none;
    cursor: pointer;
    transition: opacity 0.12s, transform 0.1s;
  }
  .lc-submit:hover:not(:disabled) { opacity: 0.88; transform: scale(0.985); }
  .lc-submit:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

  /* ── Divider ── */
  .lc-section-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .lc-section-divider-line {
    flex: 1;
    height: 1px;
    background: var(--hairline-soft);
  }
  .lc-section-divider-label {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-faint);
    white-space: nowrap;
  }

  /* ── Log feed ── */
  .lc-feed { display: flex; flex-direction: column; gap: 8px; }

  .lc-log-card {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 20px;
    background: var(--surface-1);
    border: 1px solid var(--hairline);
    border-radius: var(--r-xl);
    transition: border-color 0.12s;
  }
  .lc-log-card:hover { border-color: rgba(255,255,255,0.12); }

  .lc-log-body { flex: 1; min-width: 0; }

  /* ── Log meta row ── */
  .lc-log-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  .lc-log-mood-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    background: var(--surface-2);
    border: 1px solid var(--hairline);
    border-radius: var(--r-pill);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -0.12px;
    color: var(--ink-muted);
  }
  .lc-log-mood-badge-emoji { font-size: 13px; }
  .lc-log-date {
    font-size: 12px;
    color: var(--ink-faint);
    letter-spacing: -0.12px;
  }

  /* ── Log content ── */
  .lc-log-content {
    font-size: 15px;
    font-weight: 400;
    line-height: 1.55;
    letter-spacing: -0.15px;
    color: var(--ink);
    margin-bottom: 10px;
    word-break: break-word;
  }

  /* ── Tag chips ── */
  .lc-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .lc-tag {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    background: var(--surface-2);
    border: 1px solid var(--hairline);
    border-radius: var(--r-pill);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -0.12px;
    color: var(--ink-muted);
  }

  /* ── Delete button ── */
  .lc-delete-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--r-pill);
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: -0.13px;
    color: var(--ink-faint);
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.12s, border-color 0.12s, background 0.12s;
    flex-shrink: 0;
  }
  .lc-delete-btn:hover {
    color: var(--danger);
    border-color: rgba(239,68,68,0.2);
    background: rgba(239,68,68,0.08);
  }

  /* ── Load more button (secondary pill) ── */
  .lc-load-more {
    width: 100%;
    margin-top: 16px;
    padding: 12px 20px;
    background: var(--surface-1);
    color: var(--ink-muted);
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.14px;
    line-height: 1;
    border-radius: var(--r-pill);
    border: 1px solid var(--hairline);
    cursor: pointer;
    transition: background 0.12s, color 0.12s, transform 0.1s;
  }
  .lc-load-more:hover { background: var(--surface-2); color: var(--ink); transform: scale(0.985); }

  /* ── Empty state ── */
  .lc-empty {
    padding: 40px 20px;
    text-align: center;
    color: var(--ink-faint);
    font-size: 14px;
    letter-spacing: -0.14px;
    border: 1px solid var(--hairline-soft);
    border-radius: var(--r-xl);
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .lc-page { padding: 32px 16px 60px; }
    .lc-mood-grid { gap: 6px; }
    .lc-mood-label { display: none; }
    .lc-mood-btn { padding: 10px 4px; }
    .lc-log-card { padding: 14px 16px; }
    .lc-textarea, .lc-input { font-size: 16px; }
    .lc-delete-btn span { display: none; }
    .lc-delete-btn::after { content: '×'; }
  }
`;

/* ─────────────────────────────────
   Mood options
───────────────────────────────── */
const MOOD_OPTIONS = [
    { value: "productive", emoji: "🚀", label: "Productive" },
    { value: "stuck",      emoji: "😵", label: "Stuck"      },
    { value: "learning",   emoji: "📚", label: "Learning"   },
    { value: "shipping",   emoji: "🎉", label: "Shipping"   },
    { value: "grinding",   emoji: "💪", label: "Grinding"   },
];

const getMoodOption = (value) =>
    MOOD_OPTIONS.find((m) => m.value === value) || { emoji: "📝", label: "Log" };

/* ─────────────────────────────────
   SVG icons
───────────────────────────────── */
const IconCheckCircle = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

/* ─────────────────────────────────
   Main Component
───────────────────────────────── */
export default function LogsClient({ initialLogs, userLastLogDate }) {
    const { logs, setLogs, addLog, removeLog, hasMore, currentPage } =
        useLogsStore();

    const [content,     setContent]     = useState("");
    const [mood,        setMood]        = useState("productive");
    const [tags,        setTags]        = useState("");
    const [isSubmitting,setIsSubmitting]= useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        setLogs(initialLogs, true, 1);
    }, [initialLogs, setLogs]);

    /* ── Today check ── */
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastLogNorm = userLastLogDate ? new Date(userLastLogDate) : null;
    if (lastLogNorm) lastLogNorm.setHours(0, 0, 0, 0);
    const alreadyLoggedToday =
        lastLogNorm && lastLogNorm.getTime() === today.getTime();

    /* ── Submit handler ── */
    async function handleSubmit(e) {
        e.preventDefault();
        if (!content.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/logs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: content.trim(),
                    mood,
                    tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                }),
            });
            if (res.ok) {
                const data = await res.json();
                addLog(data.log);
                setContent("");
                setTags("");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    /* ── Delete handler ── */
    async function handleDelete(id) {
        if (!confirm("Delete this log?")) return;
        await fetch(`/api/logs/${id}`, { method: "DELETE" });
        removeLog(id);
    }

    /* ── Load more ── */
    async function handleLoadMore() {
        setLoadingMore(true);
        try {
            const nextPage = currentPage + 1;
            const res  = await fetch(`/api/logs?page=${nextPage}&limit=20`);
            const data = await res.json();
            setLogs([...logs, ...data.logs], data.hasMore, nextPage);
        } finally {
            setLoadingMore(false);
        }
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: LOGS_CSS }} />

            <div className="lc-root">
                <div className="lc-page">

                    {/* ── Page header ── */}
                    <div className="lc-header">
                        <h1 className="lc-title">Build Logs</h1>
                        <div className="lc-streak-chip">
                            {alreadyLoggedToday
                                ? <><span>✓</span> Logged today</>
                                : <><span style={{ color: "var(--ink-faint)" }}>○</span> Not yet logged</>
                            }
                        </div>
                    </div>

                    {/* ════════════════════════════════════
                        COMPOSE CARD
                    ════════════════════════════════════ */}
                    <div className="lc-form-card">
                        {alreadyLoggedToday ? (
                            /* ── Already logged today ── */
                            <div className="lc-done-state">
                                <div className="lc-done-icon">
                                    <IconCheckCircle />
                                </div>
                                <p className="lc-done-title">You&apos;ve logged today</p>
                                <p className="lc-done-sub">
                                    Come back tomorrow to keep the streak alive.
                                </p>
                            </div>
                        ) : (
                            /* ── Log form ── */
                            <form onSubmit={handleSubmit}>

                                {/* Content textarea */}
                                <div className="lc-field">
                                    <div className="lc-label">
                                        <span>What did you build today?</span>
                                        <span className="lc-char-count">{content.length} / 500</span>
                                    </div>
                                    <textarea
                                        className="lc-textarea"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        maxLength={500}
                                        rows={4}
                                        disabled={isSubmitting}
                                        placeholder="Ship something. Learn something. Break something. Log it."
                                    />
                                </div>

                                {/* Mood selector */}
                                <div className="lc-field">
                                    <p className="lc-label">Today&apos;s vibe</p>
                                    <div className="lc-mood-grid">
                                        {MOOD_OPTIONS.map((m) => (
                                            <button
                                                key={m.value}
                                                type="button"
                                                disabled={isSubmitting}
                                                onClick={() => setMood(m.value)}
                                                className={`lc-mood-btn ${mood === m.value ? "lc-mood-btn-active" : ""}`}
                                                title={m.label}
                                            >
                                                <span className="lc-mood-emoji">{m.emoji}</span>
                                                <span className="lc-mood-label">{m.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="lc-field">
                                    <p className="lc-label">Tags</p>
                                    <input
                                        type="text"
                                        className="lc-input"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        disabled={isSubmitting}
                                        placeholder="react, api, bug-fix  — comma separated"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="lc-submit"
                                    disabled={isSubmitting || !content.trim()}
                                >
                                    {isSubmitting ? "Saving…" : "Add Today's Log"}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* ════════════════════════════════════
                        LOG FEED
                    ════════════════════════════════════ */}
                    {logs.length > 0 && (
                        <>
                            <div className="lc-section-divider">
                                <div className="lc-section-divider-line" />
                                <span className="lc-section-divider-label">
                                    {logs.length} {logs.length === 1 ? "entry" : "entries"}
                                </span>
                                <div className="lc-section-divider-line" />
                            </div>

                            <div className="lc-feed">
                                {logs.map((log) => {
                                    const moodOpt = getMoodOption(log.mood);
                                    return (
                                        <div key={log._id} className="lc-log-card">
                                            <div className="lc-log-body">
                                                {/* Meta: mood badge + date */}
                                                <div className="lc-log-meta">
                                                    <span className="lc-log-mood-badge">
                                                        <span className="lc-log-mood-badge-emoji">{moodOpt.emoji}</span>
                                                        {moodOpt.label}
                                                    </span>
                                                    <span className="lc-log-date">
                                                        {new Date(log.createdAt).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                <p className="lc-log-content">{log.content}</p>

                                                {/* Tags */}
                                                {log.tags?.length > 0 && (
                                                    <div className="lc-tags">
                                                        {log.tags.map((tag) => (
                                                            <span key={tag} className="lc-tag">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Delete */}
                                            <button
                                                className="lc-delete-btn"
                                                onClick={() => handleDelete(log._id)}
                                                title="Delete log"
                                            >
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Load more */}
                            {hasMore && (
                                <button
                                    className="lc-load-more"
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                >
                                    {loadingMore ? "Loading…" : "Load more logs"}
                                </button>
                            )}
                        </>
                    )}

                    {/* Empty state */}
                    {logs.length === 0 && !alreadyLoggedToday && (
                        <div className="lc-empty">
                            No logs yet. Write your first entry above to start the streak.
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}