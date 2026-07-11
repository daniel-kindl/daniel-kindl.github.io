<script lang="ts">
  let { label = 'Execute Action' } = $props();
</script>

<button
  class="font-display text-xs font-bold uppercase tracking-widest bg-accent text-bg-primary px-8 py-4 rounded-xs transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer hover:bg-text-primary hover:-translate-y-0.5 active:translate-y-0"
>
  {label}
</button>
