<script lang="ts">
  let mouseX = 0;
  let mouseY = 0;
  let element: HTMLDivElement;
  let reducedMotion = false;

  if (typeof window !== 'undefined') {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function handleMouseMove(e: MouseEvent) {
    if (!element || reducedMotion) return;
    const rect = element.getBoundingClientRect();
    // Normalize coordinates from -0.5 to 0.5
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseY = (e.clientY - rect.top) / rect.height - 0.5;
  }
</script>

<div
  bind:this={element}
  on:mousemove={handleMouseMove}
  class="absolute inset-0 -z-10 overflow-hidden border-b border-(--border-color) opacity-30 select-none"
  role="presentation"
>
  <div
    class="w-full h-full transition-transform duration-300 ease-out"
    style="transform: perspective(1000px) rotateX({mouseY * 15}deg) rotateY({mouseX *
      15}deg) scale(1.05);"
  >
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,var(--border-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-color)_1px,transparent_1px)] bg-size-[40px_40px]"
    ></div>
  </div>
</div>
