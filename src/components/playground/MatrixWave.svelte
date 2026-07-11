<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let container: HTMLDivElement;
  let width = 400;
  let height = 250;
  let animationFrameId: number;

  // State variables for safe rendering
  let isReducedMotion = false;
  let statusText = '● RUNNING';

  onMount(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Browser evaluations are safe here
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isReducedMotion = motionQuery.matches;
    statusText = isReducedMotion ? '● PAUSED (STATIC_MODE)' : '● RUNNING';

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        width = entry.contentRect.width;
        height = 250;
      }
    });

    resizeObserver.observe(container);

    let phase = 0;
    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.lineWidth = 1;

      for (let j = 0; j < 5; j++) {
        ctx.beginPath();
        for (let x = 0; x < width; x += 5) {
          const y = height / 2 + Math.sin(x * 0.01 + phase + j * 0.5) * 40 * Math.cos(phase * 0.5);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      if (motionQuery.matches) {
        return;
      }

      phase += 0.02;
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    const handleMotionChange = () => {
      isReducedMotion = motionQuery.matches;
      statusText = isReducedMotion ? '● PAUSED (STATIC_MODE)' : '● RUNNING';
      if (isReducedMotion) {
        cancelAnimationFrame(animationFrameId);
      } else {
        render();
      }
    };
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  });
</script>

<div bind:this={container} class="w-full border border-(--border-color) bg-(--bg-primary) p-2">
  <div
    class="font-mono text-[9px] text-(--text-muted) uppercase tracking-wider mb-2 flex justify-between"
  >
    <span>[SYS_LAB: GENERATIVE_WAVE]</span>
    <span class={isReducedMotion ? 'text-amber-500' : 'text-emerald-500'}>
      {statusText}
    </span>
  </div>
  <canvas bind:this={canvas} {width} {height} class="w-full block bg-black/40"></canvas>
</div>
