## [1.5.0](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v1.4.1...v1.5.0) (2026-08-11)

### Features

* clarify homepage approach section ([09aae5c](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/09aae5c7a79390f7889b4fdf3d58ce0bc2cf3a9b))
* expand about technical stack ([0ccd67f](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/0ccd67fab36a1b5928b9a70d151b7f7674cf2671))
* update contact and social links ([e77738d](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/e77738db2574b06ab259452287025128716722b3))

### Bug Fixes

* correct skip link focus target ([32b80dc](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/32b80dc329075fb0e75b94574d908ad933b86362))

### Content

* add agentmeter project case study ([d1a529a](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/d1a529a4a26f0c8aaccba74f5595b945f4460009))
* publish README boundaries post ([b93bc0f](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/b93bc0f5e3110312665c37838b928ba90e0afcf5))

## [1.4.1](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v1.4.0...v1.4.1) (2026-08-02)

### Bug Fixes

* dedupe posts whose tags slugify to the same value ([1f5ce01](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/1f5ce01cbfd26be3260983da48b264e561eb5055))
* define the astro-code token variables shiki actually emits ([e848700](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/e8487005f6393d5938a695e03ab9460daf2e8770))
* emit machine-readable time elements for post dates ([bcc1dd1](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/bcc1dd1f2854afba5bd742921100b36d9fb04942))
* exclude code, imports and table markup from reading time ([e7dc431](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/e7dc431cd6b2f8c0c4ead1529dc589c842a9e611))
* give interactive borders a 3:1 contrast token ([72c84dc](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/72c84dc4bbe838b68e6b8558b826595e6a1a51e3))
* index only content pages with pagefind ([b5402b3](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/b5402b3817a6a618a5c2bfd9e17bd2448e14817f))
* initialize page scripts once via astro:page-load ([c44d483](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/c44d4832c0de68e2a619359f900ab6b3d3477d35))
* keep tables semantic and make scrollable prose regions focusable ([5443754](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/5443754bcf25d5a0eaba695e76e69f48498179c1))
* make ThemeScript the only writer of the theme ([08a5e2d](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/08a5e2dff8d72ac3e14142982a1c07646c1b2712))
* name the primary nav and make the skip link focus main ([e5ce1ed](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/e5ce1ed4c601cd48d842afeac00be40cf77a5b53))
* remove the inline code radius the design system forbids ([e18948b](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/e18948b3db24d1d86aade78c4aa7c954a726153f))
* render frontmatter dates in UTC ([3ce40e7](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/3ce40e78c40c2dcacf8a6a904b47dccfdf2026e8))
* restore the missing h2 above the homepage approach section ([4b60b68](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/4b60b6837dddd291e84c418340619b2ebbfbd8ab))
* skip drafts and mirror the loader glob when generating OG images ([9d96676](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/9d96676f00360eb8368ccadbca3ba463759c9a19))
* track scroll direction and tear down the table of contents observer ([f9f75a6](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/f9f75a6ccb65e1cc6af57f1ac2bc09cc40faf212))

### Content

* add post on programming terminology read literally ([50ecaf9](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/50ecaf943e45a201da749ff87c7cb4b5763bb3a6))

### Documentation

* correct stale claims across README, CLAUDE, PRODUCT, colophon and ADR log ([91d38aa](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/91d38aa1b6af4083514848d02f789a3a722bb25f))
* document the prose type register in the design system ([bbf65bd](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/bbf65bdcdab39d1abf4bb92693ea4c56f4a24795))
* supersede the Svelte ADR and correct the stale stack and schema claims ([a1d6c5b](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/a1d6c5b3b124b3b5c5dfad62193c86577ca35c07))

### Chores & Dependencies

* add a content commit type that doesn't trigger a release ([b8f7f7c](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/b8f7f7c5f19c5513f8e98ea98b86034ae9131721))
* add a manual deploy trigger and stop cancelling in-flight releases ([8899337](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/8899337218c345902a8055b020c9aec9cf732b83))
* fail lint on warnings and format staged mdx ([5e5a390](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/5e5a39007fab67f622031251f35a2b17d637961d))
* measure Lighthouse against representative pages only ([dfe0d36](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/dfe0d3634c041b7e9c959d427bb8d077dbd0169c))
* remove the unused Svelte integration and toolchain ([21c3bfd](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/21c3bfdbe134e06c40a57a3df95bf17119408401))

## [1.4.0](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v1.3.2...v1.4.0) (2026-08-01)

### Features

* add MDX support and figure/swatch content components ([65c23e5](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/65c23e585bd2aea8d1fb3b996322bfdf16831dd5))
* give case studies a table of contents and reading time ([124c8c8](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/124c8c81fa7ec16755e3fa2c2fa661efa7294e2e))
* restructure the Ocho case study with a phase palette spec table ([9b1685b](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/9b1685bb6b012f77e43d5919938c10533d2d560f))

### Documentation

* record MDX as the format for all content entries ([7dd3a44](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/7dd3a4461cacc7a040eee24120270cbc12a9c56d))
* record media, figure, and MDX conventions across design and content guides ([cc45c54](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/cc45c542b5c1fca5f6214d2d5d965cc56bc53442))

### Chores & Dependencies

* drop the commit hash from the footer build stamp ([8e9598a](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/8e9598a0004d48f22a404697bcb3b1de2d6ff543))
* point the site at the danielkindl.dev custom domain ([7390e1a](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/7390e1aec135a5217198d7b6b45b39c6c26273f5))
* rebrand the DK Timer case study to Ocho ([3363143](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/33631434fa81d55d74f388020504891226a0a364))

## [1.3.2](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v1.3.1...v1.3.2) (2026-07-31)

### Bug Fixes

* add active: press feedback to match every hover: state (DA-6) ([ee0126d](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/ee0126d9d041db2f9ba669448154e3b1bc7b72f9))
* bump search input to 16px on mobile to prevent iOS auto-zoom ([3c44c4c](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/3c44c4c756f507f3944ed169d273f1f6adc6f562))
* give mobile TOC toggle a real 44px touch target ([56d944a](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/56d944af7308b921a32295a6d6060776e6b4048c))
* give phones a compact project status line (DA-7) ([4aa8d5f](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/4aa8d5f4fca32a5eb534edb8ceed44ced020057c))
* harden .prose against ol, h4-h6, table, img and long tokens ([9d00297](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/9d00297f89986e1f5e5a9194110994d07416ec36))
* make Container the single owner of horizontal inset (DA-4) ([a788062](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/a78806222590c42d6a22b514630ccf9cc6a45216))
* move font families into Tailwind 4 theme so utilities resolve correctly ([989cda9](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/989cda9ffd06957dd5b930eeaf9455893cf267ea))
* pin code copy button to a non-scrolling wrapper and bump to 44px ([a40398e](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/a40398eae0a03add3332d6483494fd95388727f9))
* prevent footer link row from overflowing at 320px viewport ([7dc6821](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/7dc6821519c3ed31fbd3dfed1e6b53ac1a4f6103))
* prevent header nav overflow from forcing mobile page zoom-out ([daa2cb1](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/daa2cb16647ef2f66262bc0e705ecf71295172c8))
* promote project summary paragraph off 10px metadata size (DA-2) ([9518ce2](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/9518ce2aa7869e6ab9e9820e7d4e9b3c8f4fb9be))
* remove duplicate nested main landmark on 6 pages ([9b036d7](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/9b036d79b651aa969622178224ba665a0e6dcb12))
* replace tag hit-area expansion with real 44x44 touch target ([6b79f52](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/6b79f52a8272719732a1d3e805c01cd6c16f169e))
* scope hero H1 leading-none to sm: and up (DA-1) ([3426430](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/34264308e298f770a69b4d3d58062598b3df3b7c))
* stack homepage section headers below sm to prevent collision ([936282c](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/936282ca6ebb32beb2fc8ec94275859c649eba8e))
* theme-aware theme-color meta, wrap 404 in Container, swap vh for dvh ([558b698](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/558b69818c5eaad94a764756e2793cdbfed01eb4))
* touch-target sweep for ExternalLink plain variant and TOC links ([b62637c](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/b62637c016a0cdf1411145cdcbd705530f457031))

### Chores & Dependencies

* exclude .remember/ plugin data from lint and format checks ([1be44a3](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/1be44a360b3a9ee460ab076bb2d12d0c3e88edf0))
* tighten Lighthouse CI budget with measured perf/resource assertions ([cdc1816](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/cdc1816162c4a7ff203f79be1a885d03b940b992))

## [1.3.1](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v1.3.0...v1.3.1) (2026-07-30)

### Bug Fixes

* bump postcss to patch path traversal vulnerability (Dependabot [#5](https://github.com/daniel-kindl/daniel-kindl.github.io/issues/5)) ([9c5c017](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/9c5c017734885ead1f3b13b6171876723859cc45))

### Chores & Dependencies

* add .gitattributes to normalize line endings to LF ([3802aea](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/3802aeae3764c1b90becd0c2b57537e3ec847f2c))
* merge upstream release commit from GitHub ([7b03851](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/7b03851e446cee137dc4dde452349e920ee8ae8f))

## [1.3.0](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v1.2.2...v1.3.0) (2026-07-30)

### Features

* add DK Timer project case study ([5839e79](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/5839e79a573a0846688f38ca1508a2536cfeadaa))
* cite Lighthouse CI budget with a passing run link in the portfolio case study ([b138ae1](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/b138ae10807ee7d18fed44381f8d616cbec9d8f1))

### Bug Fixes

* announce search results and empty state to screen readers ([8462f97](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/8462f975acac4a318238878d41d18f3724dfd775))
* darken copy-code focus ring for WCAG 3:1 contrast in light mode ([37363d5](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/37363d5890230ab94438a4cd8a30cf854b2f1c1c))
* fill Timeline anchor dot with text-primary for visible contrast ([3c9c03c](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/3c9c03c804c46ca18d037e12b439dc33d64e83b3))

## [1.2.2](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v1.2.1...v1.2.2) (2026-07-30)

### Bug Fixes

* correct CI shield badge showing no status in README ([d3efab1](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/d3efab140ccd9de95e18ce3c116f87d76b98dd40))

### Chores & Dependencies

* bump the npm-minor-patch group across 1 directory with 6 updates ([#14](https://github.com/daniel-kindl/daniel-kindl.github.io/issues/14)) ([16bb9f7](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/16bb9f7be6207d37997b33ea7cf61f7293b86e87))

## [1.2.1](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v1.2.0...v1.2.1) (2026-07-29)

### Bug Fixes

* exclude generated CHANGELOG.md from prettier format:check ([67edf07](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/67edf07efeec4be4d4330f625258bcac2cae29ec))

## [1.2.0](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v1.1.1...v1.2.0) (2026-07-29)

### Features

* add a primary contact CTA to the homepage ([a3e7875](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/a3e78756fe72805bd4064e124aaf29b08f42c677))
* automate semver releases with semantic-release ([acb8fae](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/acb8fae2b9536631d2277427d54cf36c7a4f7764))
* give project metadata band the readout-rail treatment and real link evidence ([1f193c0](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/1f193c07f0a1a1d218d3f11b26482ba4616af0fa))
* surface promotion continuity between same-company CV entries ([a8753a3](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/a8753a354b9fe6deb6268ac09ef7b2c7cc19e9ab))
* surface real project/write-up counts in hero ([d3b2378](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/d3b23784b0748cdc427dc33db21945d0a8c74e1c))

### Bug Fixes

* add focus-visible ring and larger tap target to Tag links ([2aa135a](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/2aa135ab0e61e76f943c6d163012839ec791866c))
* align project metadata band font size with documented mono step ([5063f9e](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/5063f9ee71ac78dcc083e6354ad620cc5646f28e))
* allow project CTA row to wrap on narrow viewports ([f89ac8f](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/f89ac8f65c1ce3f17871fccbe902abac044c2379))
* always render a closing element on writing posts ([dee10b6](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/dee10b6363d6f76f75b35f07ec120ac2b22df6fe))
* assign project primary CTA by evidentiary weight, not field order ([8a10996](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/8a1099635453618284ae8a174afe565e7944fb8a))
* collapse writing-post grid to full width when there is no ToC ([d16fb03](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/d16fb0360722966ff62483a89892f3a3aadeb72e))
* give Timeline explicit list semantics for assistive tech ([7b5fe37](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/7b5fe37f784c794994c5ffcac885e480a2be660c))
* keep code-copy button visible on touch devices ([5232952](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/52329523e6a03271e0f88b91d1e7ba0297ad60e6))
* lead About page with Experience ahead of Skills ([24421c4](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/24421c468aa45bda657002517e599117c0a0549d))
* map project status enum to considered display labels ([c05c5b8](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/c05c5b88134e39aa239d21202d7514cf0c25e0f3))
* pluralize stack technology count correctly ([9bf5de8](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/9bf5de87e1d7e51f99bfe9b5ae3cb946085b24a2))
* reduce homepage decision overload (dedupe CTA, cap tags, group footer links) ([e0f67b9](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/e0f67b9e63f18e6f3205d81eb82b7c4b7e447339))
* remove brackets from permanent hero eyebrow label ([7a1f986](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/7a1f98666eeda5d97e849785e35ffc3a7f8ee93d))
* restore documented type contract in article prose ([af653c7](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/af653c7813551cd770eeb47eb7ea47dcee3bd386))
* show project summary and related writing on mobile ([5a36302](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/5a363026a402922831df9cc37d79a2e164530992))
* split oversized Frontend skill group into Desktop UI and Frontend ([8520b8a](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/8520b8ae31beb7cf3d9cb585f4bc89d9cadf755c))
* use project role instead of raw slug in case-study eyebrow ([7fde3ec](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/7fde3ec8ea03549801bb0419393219bdcb40d4bd))

### Documentation

* add PRODUCT.md and DESIGN.md, ignore Impeccable local state ([758d228](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/758d228f60ecb1ee3ae2555d8f6f1a8319355bb3))
* document the 10px mono/meta type step already used sitewide ([f289c0f](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/f289c0f9465cde5e3b69bfac24b3d1b89d96f312))

### Chores & Dependencies

* bump astro from 7.0.9 to 7.1.3 ([3826f16](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/3826f1620c155649fd319625fc33bd2f373084d9))
* bump fast-uri from 3.1.3 to 3.1.4 ([ed3566c](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/ed3566c661a0c08aa10b90177c2072eccd24f85b))
* bump fast-xml-parser from 5.10.0 to 5.10.1 ([b62c97e](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/b62c97efcc20e6413d7b237d409b2169a70ff6e4))
* bump svgo from 4.0.1 to 4.0.2 ([96c476c](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/96c476c7acec861025cc0801fe9de765c1d5fb3d))
* bump the npm-minor-patch group with 8 updates ([074c0ee](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/074c0ee10328a62cb6a5e366d6bdcf111c9d578e))
* bump treosh/lighthouse-ci-action ([d75f0c7](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/d75f0c7041bb6ef3a13da30584872417308312f2))

# Changelog

All notable changes to this project are documented here.

## [1.1.1](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v1.1.0...v1.1.1) (2026-07-19)

### Features

- wire up Space Grotesk as the heading and eyebrow typeface ([a64a612](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/a64a612))

### Bug Fixes

- harden CI/CD pipeline and remove version/deploy drift risk ([f01da2d](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/f01da2d))

### Chores & Dependencies

- bump version to 1.1.1 [skip ci] ([896dd9e](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/896dd9e))

## [1.1.0](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v0.3.1...v1.1.0) (2026-07-18)

### Features

- add colophon page and build-time version/commit footer detail ([83efda3](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/83efda3))
- publish post on the AI-assisted development workflow behind this site ([be88353](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/be88353))

### Chores & Dependencies

- correct version to reflect pre-automation history, mark site as maintaining ([be4b2c0](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/be4b2c0))
- bump version to 1.1.0 [skip ci] ([cfab8ad](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/cfab8ad))

## [0.3.1](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v0.3.0...v0.3.1) (2026-07-18)

### Bug Fixes

- handle search failures, document innerHTML safety, split long OG function ([c54cafb](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/c54cafb))

### Documentation

- expand README with features overview and status badges ([a5322e2](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/a5322e2))

### Chores & Dependencies

- bump version to 0.3.1 [skip ci] ([1368322](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/1368322))

## [0.3.0](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v0.2.0...v0.3.0) (2026-07-18)

### Features

- add RSS feed link to footer ([74a7ca7](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/74a7ca7))
- add copy-to-clipboard button on code blocks ([1975117](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/1975117))
- add reading time and last-updated to writing posts ([00de499](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/00de499))
- generate per-entry social share (OG) images ([0e3f930](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/0e3f930))
- add site search with Pagefind ([17cf3da](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/17cf3da))
- move writing post TOC to sticky sidebar with mobile disclosure ([953c157](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/953c157))

### Chores & Dependencies

- stop tracking generated icon/OG assets in git ([7b246a9](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/7b246a9))
- bump version to 0.3.0 [skip ci] ([4223043](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/4223043))

## [0.2.0](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v0.1.0...v0.2.0) (2026-07-18)

### Features

- auto-calculate years of experience on about page ([6e1a020](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/6e1a020))

### Chores & Dependencies

- bump version to 0.2.0 [skip ci] ([cf1dad4](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/cf1dad4))

## [0.1.0](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v0.0.4...v0.1.0) (2026-07-18)

### Features

- expand project status enum with finished and maintaining states ([f815b27](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/f815b27))
- add writing post on TDD-based requirements traceability ([36fe892](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/36fe892))

### Chores & Dependencies

- bump version to 0.1.0 [skip ci] ([53c0068](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/53c0068))

## [0.0.4](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v0.0.3...v0.0.4) (2026-07-18)

### Features

- highlight active nav item in header ([a21f3a8](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/a21f3a8))
- add pipe divider between nav and theme toggle ([c01a86a](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/c01a86a))
- add recent writing section to homepage ([2dca82b](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/2dca82b))
- add subtle scroll-reveal motion to homepage sections and cards ([dc0dd9f](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/dc0dd9f))

### Bug Fixes

- enforce 44px touch targets on nav, footer, and theme toggle ([ead2c1d](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/ead2c1d))
- raise button and tag border contrast to meet WCAG 1.4.11 ([e397340](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/e397340))
- indicate active theme state and wrap header nav on narrow viewports ([108af52](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/108af52))
- plain-language 404 copy, tighten CTA/heading wording, correct brand names ([14d1c8b](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/14d1c8b))
- tighten hero subhead, remove redundant clause and unclear pronoun ([6469ad0](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/6469ad0))
- add on-brand focus rings to header and move theme toggle out of nav landmark ([0fb6ee0](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/0fb6ee0))
- tighten About page wording, reuse Tag component, balance skills grid ([4e946b4](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/4e946b4))
- reuse ProjectCard on projects listing, fix same-year date range, trim wording ([9d261dc](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/9d261dc))
- add post-count subhead to tag pages, fix h2 size gap, unify back-link wording ([198c0d1](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/198c0d1))
- render copyright symbol correctly, add footer focus rings, add logo hover state ([3b3c00c](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/3b3c00c))
- correct homepage heading hierarchy, switch hero to dvh, tighten Approach wording ([12f90be](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/12f90be))
- even out nav link spacing, restyle theme toggle as plain bracketed text ([0d04a78](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/0d04a78))
- remove AI-sounding writing patterns from content and CV copy ([3e1f3f5](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/3e1f3f5))

### Chores & Dependencies

- bump version to 0.0.4 [skip ci] ([367fe15](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/367fe15))

## [0.0.3](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/v0.0.2...v0.0.3) (2026-07-15)

### Bug Fixes

- set explicit read-only permissions on CI workflow ([6ff8e29](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/6ff8e29))

### Documentation

- add SECURITY.md ([efba888](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/efba888))

### Chores & Dependencies

- bump version to 0.0.3 [skip ci] ([c22f82d](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/c22f82d))

## [0.0.2](https://github.com/daniel-kindl/daniel-kindl.github.io/compare/1dbedc3...v0.0.2) (2026-07-15)

### Features

- implement fluid swiss typography system with adaptive light/dark mode tokens (#2) ([c5febee](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/c5febee))
- implement content collection schemas and image strategy (#3) ([8dfcc5e](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/8dfcc5e))
- implement base layouts, theme mechanics, seo utility, and routing systems (#4) ([ba903cd](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/ba903cd))
- implement core typography, interactive primitives, display modules, and theme tokens (#5) ([453d026](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/453d026))
- implement homepage, project details, profile, sandbox, and sitemap/robots automation (#6) ([4c5f02b](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/4c5f02b))
- implement MatrixWave canvas experiment with deferred lazy hydration (#7) ([f14d471](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/f14d471))
- finalize portfolio content and go-live cleanup (#11) ([8a40da7](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/8a40da7))
- add directory-sync case study ([53f56ed](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/53f56ed))
- render repository and production links on project pages ([f3eff67](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/f3eff67))
- add blog feature with RSS feed and prose styling (#12) ([762a7fd](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/762a7fd))
- add blog post about homelab setup ([d7833bf](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/d7833bf))
- add ExternalLink component for consistent external link handling (#13) ([098393f](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/098393f))
- add browsable tag pages for writing ([1ddbffa](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/1ddbffa))
- link related projects and writing posts ([af166e7](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/af166e7))
- auto-bump package version on deploy and update dependencies ([14ac4b3](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/14ac4b3))

### Bug Fixes

- improve accessibility motion and font loading baseline (#10) ([839a974](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/839a974))
- ensure github pages serves _astro assets ([0c3b374](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/0c3b374))
- address code review findings across content, dead code, and CI ([2ca9721](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/2ca9721))
- commit version bump before push in deploy workflow ([123994a](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/123994a))
- pass commit message via env to prevent script injection in bump-version ([efe13e2](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/efe13e2))

### Performance Improvements

- subset self-hosted fonts to fix Lighthouse performance budget ([34009cc](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/34009cc))

### Documentation

- record epic 0 tech decisions and completion summary (#1) ([03acf96](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/03acf96))
- record typeface fonts decisions (#2) ([e560fe6](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/e560fe6))
- document commands and architecture for agentic development ([6c116b6](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/6c116b6))
- document commit message conventions ([9aa1ca2](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/9aa1ca2))
- expand README with full script list, CI/CD, and doc links ([c9dec46](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/c9dec46))

### Chores & Dependencies

- initialize astro project with strict typescript (#1) ([1dbedc3](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/1dbedc3))
- configure eslint and prettier for astro/ts/svelte (#1) ([f0c6d83](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/f0c6d83))
- add husky and commitlint for conventional commits (#1) ([20a820e](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/20a820e))
- add tsconfig path aliases, fix baseUrl and tseslint deprecations (#1) ([1f2d9f5](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/1f2d9f5))
- self-host space grotesk, jetbrains mono, and ibm plex sans (#2) ([39505d3](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/39505d3))
- implement automated asset generation script and configure global SEO meta layout tags (#8) ([362bacc](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/362bacc))
- configure github pages actions, lighthouse ci configurations, and root site url mappings (#9) ([0e2743d](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/0e2743d))
- upgrade github actions node runtime to 24 ([4c14084](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/4c14084))
- update Approach section copy to match general SWE positioning ([eabcf88](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/eabcf88))
- update hero text on index page ([36e0064](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/36e0064))
- raise dependabot github-actions PR limit to 10 ([2f65f0d](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/2f65f0d))
- ignore typescript major bumps in dependabot per ADR-10 ([7f484ce](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/7f484ce))
- bump actions/configure-pages from 5 to 6 ([5899056](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/5899056))
- bump actions/checkout from 4 to 7 ([c034d7f](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/c034d7f))
- bump actions/setup-node from 4 to 7 ([3071056](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/3071056))
- bump actions/deploy-pages from 4 to 5 ([ee56a0c](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/ee56a0c))
- bump actions/upload-pages-artifact from 3 to 5 ([701eb7c](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/701eb7c))
- bump prettier-plugin-tailwindcss in the npm-minor-patch group ([c755796](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/c755796))
- bump version to 0.0.2 [skip ci] ([906d23b](https://github.com/daniel-kindl/daniel-kindl.github.io/commit/906d23b))
