"use client";

import "./heroButton.css";
import { useRef } from "react";

export default function HeroButton() {
    const buttonRef = useRef(null);

    const handleMouseMove = (e) => {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        buttonRef.current.style.setProperty("--x", `${x}px`);
        buttonRef.current.style.setProperty("--y", `${y}px`);
    };

    return (
        <div className="btn-wrapper" style={{ maxWidth: "260px" }}>
            <button
                ref={buttonRef}
                className="btn-spotlight btn-size-2"
                onMouseMove={handleMouseMove}
            >
                <div className="spotlight-beam"></div>

                <span
                    style={{
                        position: "relative",
                        pointerEvents: "none",
                    }}
                >
                    Join Now
                </span>
            </button>
        </div>
    );
}
