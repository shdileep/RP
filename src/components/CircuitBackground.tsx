import { useEffect, useRef } from "react";

interface Track {
  points: { x: number; y: number }[];
  pulseProgress: number;
  pulseSpeed: number;
  active: boolean;
}

export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Set of structural PCB trace lines
    let tracks: Track[] = [];

    const createTracks = () => {
      tracks = [];
      const numTracks = Math.min(32, Math.floor(width / 40));

      for (let i = 0; i < numTracks; i++) {
        const startX = Math.random() * width;
        const startY = Math.random() * height;
        const points = [{ x: startX, y: startY }];

        let curX = startX;
        let curY = startY;
        const segmentCount = 3 + Math.floor(Math.random() * 3);

        for (let j = 0; j < segmentCount; j++) {
          const distance = 40 + Math.random() * 80;
          // Standard PCB angles: 0, 45, 90, 135 deg
          const angleIndex = Math.floor(Math.random() * 4);
          const angle = (angleIndex * Math.PI) / 4;

          curX += distance * Math.cos(angle);
          curY += distance * Math.sin(angle);

          // Bound coordinates inside outer buffer
          if (curX > 0 && curX < width && curY > 0 && curY < height) {
            points.push({ x: curX, y: curY });
          } else {
            break;
          }
        }

        if (points.length > 1) {
          tracks.push({
            points,
            pulseProgress: 0,
            pulseSpeed: 0.003 + Math.random() * 0.006,
            active: Math.random() > 0.2
          });
        }
      }
    };

    createTracks();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createTracks();
    };

    window.addEventListener("resize", handleResize);

    const drawLine = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
      if (!ctx) return;
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    };

    const drawPulse = (track: Track) => {
      if (!ctx || track.points.length < 2) return;

      const totalProgress = track.pulseProgress;
      const totalSegments = track.points.length - 1;
      const segmentIndex = Math.floor(totalProgress * totalSegments);
      const segmentProgress = (totalProgress * totalSegments) % 1;

      if (segmentIndex >= totalSegments) return;

      const p1 = track.points[segmentIndex];
      const p2 = track.points[segmentIndex + 1];

      // Interpolate current position
      const pulseX = p1.x + (p2.x - p1.x) * segmentProgress;
      const pulseY = p1.y + (p2.y - p1.y) * segmentProgress;

      // Draw shiny particle glow
      const grad = ctx.createRadialGradient(pulseX, pulseY, 1, pulseX, pulseY, 8);
      grad.addColorStop(0, "rgba(0, 217, 255, 0.9)");
      grad.addColorStop(0.3, "rgba(0, 217, 255, 0.4)");
      grad.addColorStop(1, "rgba(0, 217, 255, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 8, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw copper copper tracks in dark muted cyan
      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 217, 255, 0.035)";
      ctx.lineWidth = 1.5;

      tracks.forEach((track) => {
        for (let i = 0; i < track.points.length - 1; i++) {
          drawLine(track.points[i], track.points[i + 1]);
        }
      });
      ctx.stroke();

      // 2. Draw copper trace joint circles
      ctx.fillStyle = "rgba(0, 217, 255, 0.05)";
      tracks.forEach((track) => {
        track.points.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // 3. Increment pulse positions and paint electrons (Disabled: No moving sparks or falling particles)
      tracks.forEach((track) => {
        if (!track.active) return;
        track.pulseProgress += track.pulseSpeed;
        if (track.pulseProgress >= 1) {
          track.pulseProgress = 0;
          track.active = Math.random() > 0.15;
        }
        // drawPulse(track); removed to stop all moving/falling graphics in background
      });

      // Maintain background loop safely
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-[#0B0F19]"
    />
  );
}
