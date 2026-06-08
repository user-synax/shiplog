"use client";

import { useEffect } from "react";

export default function ThemeProvider({ theme, children }) {
    useEffect(() => {
        if (!theme) return;
        const root = document.documentElement;

        // Map theme keys to CSS variables
        const cssVars = {
            "--color-canvas": theme.bgGradient,
            "--bg-pattern": theme.bgPattern,
            "--bg-pattern-size": theme.bgPatternSize,
            "--color-surface-1": theme.cardColor,
            "--color-surface-2": theme.borderColor,
            "--color-hairline": theme.borderColor,
            "--color-hairline-soft": theme.borderColor,
            "--color-ink": theme.textColor,
            "--color-ink-muted": theme.mutedColor,
            "--color-primary": theme.buttonBg,
            "--color-primary-text": theme.buttonText,
            "--color-primary-hover": theme.buttonHoverBg,
            "--color-primary-hover-shadow": theme.buttonHoverShadow,
            "--color-accent-red": theme.accentGradient,
            "--color-accent-blue": theme.accentGradient,
        };

        // Apply each variable to the root
        Object.entries(cssVars).forEach(([key, value]) => {
            if (value) {
                root.style.setProperty(key, value);
            } else {
                root.style.removeProperty(key);
            }
        });
    }, [theme]);

    return <>{children}</>;
}
