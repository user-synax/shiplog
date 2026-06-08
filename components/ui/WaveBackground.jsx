"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    float t = iTime * 0.4;

    float n = 0.0;
    n += sin(uv.x * 4.0 + t);
    n += sin((uv.y + uv.x) * 5.0 - t * 1.2);
    n += sin(length(uv * 3.0) * 6.0 - t * 2.0);
    n += sin((uv.x - uv.y) * 7.0 + t * 1.5);

    n /= 4.0;

    float glow = smoothstep(-0.3, 0.8, n);

    vec3 dark = vec3(0.03, 0.01, 0.01);
    vec3 red = vec3(1.0, 0.30, 0.31);   // #ff4d4f
    vec3 bright = vec3(1.0, 0.65, 0.45);

    vec3 col = mix(dark, red, glow);
    col = mix(col, bright, pow(glow, 3.0));

    fragColor = vec4(col, 1.0);
}
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

const blurClassMap = {
    none: "backdrop-blur-none",
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
    "2xl": "backdrop-blur-2xl",
    "3xl": "backdrop-blur-3xl",
};

function WaveBackground({ backdropBlurAmount = "sm", className = "" }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const isInView = useInView(containerRef);
    const visibilityRef = useRef(true);

    useEffect(() => {
        visibilityRef.current = isInView;
    }, [isInView]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl");
        if (!gl) {
            console.error("WebGL not supported");
            return;
        }

        const compileShader = (type, source) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(
                    "Shader compilation error:",
                    gl.getShaderInfoLog(shader),
                );
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(
            gl.VERTEX_SHADER,
            vertexShaderSource,
        );
        const fragmentShader = compileShader(
            gl.FRAGMENT_SHADER,
            fragmentShaderSource,
        );

        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(
                "Program linking error:",
                gl.getProgramInfoLog(program),
            );
            return;
        }

        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW,
        );

        const positionLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const iResolutionLocation = gl.getUniformLocation(
            program,
            "iResolution",
        );
        const iTimeLocation = gl.getUniformLocation(program, "iTime");

        let startTime = Date.now();
        let animationFrameId;

        const render = () => {
            if (!visibilityRef.current) {
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            canvas.width = width;
            canvas.height = height;

            gl.useProgram(program);
            gl.viewport(0, 0, width, height);

            const currentTime = (Date.now() - startTime) / 1000;

            gl.uniform2f(iResolutionLocation, width, height);
            gl.uniform1f(iTimeLocation, currentTime);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(positionBuffer);
        };
    }, []);

    const finalBlurClass =
        blurClassMap[backdropBlurAmount] || blurClassMap["sm"];

    return (
        <div
            ref={containerRef}
            className={`w-full max-w-screen h-full overflow-hidden ${className}`}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full max-w-screen h-full overflow-hidden"
                style={{ display: "block" }}
            />
            <div className={`absolute inset-0 ${finalBlurClass}`} />
        </div>
    );
}

export default WaveBackground;
