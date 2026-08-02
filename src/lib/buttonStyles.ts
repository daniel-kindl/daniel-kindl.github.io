/** `plain` lives here rather than being widened inline by ExternalLink. */
export type ButtonVariant = 'primary' | 'secondary' | 'link' | 'plain';

export const focusRingStyles =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--text-primary)';

export const buttonBaseStyles = `inline-flex items-center justify-center font-mono text-xs uppercase tracking-tight transition-all duration-150 ease-out cursor-pointer ${focusRingStyles}`;

/**
 * 44x44 tap targets, except `link`: it sits inline at the start of a line, where
 * the width and horizontal padding would push the text visibly off the margin.
 * Keeping that here is what removes the `min-w-0! px-0!` overrides from callers.
 */
const sizing: Record<ButtonVariant, string> = {
  primary: 'min-h-[44px] min-w-[44px] px-4 py-2',
  secondary: 'min-h-[44px] min-w-[44px] px-4 py-2',
  link: 'min-h-[44px] py-2',
  plain: 'min-h-[44px] min-w-[44px]',
};

const underlinedLink =
  'text-(--text-muted) hover:text-(--text-primary) underline underline-offset-4 decoration-(--border-color) hover:decoration-(--text-primary) active:text-(--text-primary) active:decoration-(--text-primary)';

const appearance: Record<ButtonVariant, string> = {
  primary:
    'border border-(--text-muted) text-(--text-primary) bg-(--bg-primary) hover:bg-(--text-primary) hover:text-(--bg-primary) active:bg-(--text-primary) active:text-(--bg-primary)',
  secondary: underlinedLink,
  link: underlinedLink,
  plain: '',
};

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: `${sizing.primary} ${appearance.primary}`,
  secondary: `${sizing.secondary} ${appearance.secondary}`,
  link: `${sizing.link} ${appearance.link}`,
  plain: sizing.plain,
};
