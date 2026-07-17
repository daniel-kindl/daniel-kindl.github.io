export type ButtonVariant = 'primary' | 'secondary';

export const focusRingStyles =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--text-primary)';

export const buttonBaseStyles = `inline-flex items-center justify-center font-mono text-xs uppercase tracking-tight transition-all duration-150 ease-out min-h-[44px] min-w-[44px] px-4 py-2 cursor-pointer ${focusRingStyles}`;

export const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'border border-[var(--text-muted)] text-[var(--text-primary)] bg-[var(--bg-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]',
  secondary:
    'text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-4 decoration-[var(--border-color)] hover:decoration-[var(--text-primary)]',
};
