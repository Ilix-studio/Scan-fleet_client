import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

// Compact Wave Component for Card
export const CompactWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noise = createNoise3D();
    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    let nt = 0;
    let animationId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, w, h);

      nt += 0.001;

      const colors = ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"];

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.lineWidth = 30;
        ctx.strokeStyle = colors[i];
        ctx.globalAlpha = 0.3;

        for (let x = 0; x < w; x += 5) {
          const y = noise(x / 800, 0.3 * i, nt) * 50;
          ctx.lineTo(x, y + h * 0.5);
        }

        ctx.stroke();
        ctx.closePath();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className='absolute inset-0 w-full h-full'
      style={{ filter: "blur(8px)" }}
    />
  );
};
