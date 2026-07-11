<script lang="ts">
  import { onMount } from 'svelte';

  let isDark = $state(false);

  onMount(() => {
    isDark = document.documentElement.classList.contains('dark');
  });

  function toggleTheme() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
</script>

<button
  onclick={toggleTheme}
  class="font-mono text-[11px] font-bold uppercase tracking-widest border border-border px-5 py-2.5 bg-bg-secondary text-text-primary cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-text-primary hover:text-bg-primary hover:-translate-y-0.5"
  aria-label="Toggle system interface mode"
>
  View: {isDark ? 'Dark' : 'Light'}
</button>
