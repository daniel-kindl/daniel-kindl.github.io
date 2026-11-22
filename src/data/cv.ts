import { getYearsOfExperience } from '@lib/experience';

const careerStartDate = new Date('2023-07-01');
const years = `${getYearsOfExperience(careerStartDate)}+`;

export interface EvidenceLink {
  label: string;
  href: string;
}

export interface Principle {
  title: string;
  body: string;
  evidence: EvidenceLink[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  achievements: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

/**
 * The single source for /about and /cv. Every claim here was confirmed by the
 * owner; add nothing that the owner has not stated or that a public repo
 * cannot show.
 */
export const technicalProfile = {
  name: 'Daniel Kindl',
  role: 'Software Engineer',
  location: 'Czechia',
  experienceYears: years,
  coreStack: ['C#', '.NET', 'Avalonia UI'],
  now: 'Frontend of the new-generation test software at SPS software',
  /** Meta description and the CV summary line. */
  summary: `Software engineer in Czechia. C# and .NET first, across desktop, web, mobile, backend services and developer tools. ${years} years of professional experience.`,
  intro: [
    'I’m a software engineer based in Czechia. I build in C# and .NET first, and I work across the stack: desktop, web, mobile, backend services and developer tools.',
    'I care about the code as much as about what it does. That means clear architecture, a structure that the next person can follow, and code that stays easy to change. I also care about finishing. An idea or an annoying problem is only solved when the software ships.',
    `At SPS software, I’m responsible for the complete frontend, UI and UX, of the new generation of their industrial test software, and I work on the backend, the database and the infrastructure when needed. I’ve worked there for ${years} years. In my own projects I build Android apps, .NET tools, and workflows for AI coding agents.`,
  ],
  principles: [
    {
      title: 'Structure first',
      body: 'I decide the architecture and the boundaries before I add features, and I write down the decisions that a later reader would question. The result is code that stays easy to change.',
      evidence: [
        { label: 'AxView', href: '/projects/axview' },
        { label: 'Folium', href: '/projects/folium' },
      ],
    },
    {
      title: 'Write it so it can’t be misread',
      body: 'I write docs, commit messages and agent rules in Simplified Technical English, for people and for AI coding agents. The agents get the work, and the decisions stay with people.',
      evidence: [
        {
          label: 'Why I use Simplified Technical English',
          href: '/writing/why-i-use-simplified-technical-english',
        },
        { label: 'dkstack', href: '/projects/dkstack' },
        {
          label: 'AI-assisted development, day to day',
          href: '/writing/ai-assisted-development-workflow',
        },
      ],
    },
    {
      title: 'Safe by default',
      body: 'A crash, a lost connection or a full disk must not corrupt data or leave the user guessing. I write to a temporary file, then move it into place, and I check before anything destructive.',
      evidence: [
        { label: 'dirsync', href: '/projects/directory-sync-tool' },
        { label: 'Folium', href: '/projects/folium' },
      ],
    },
    {
      title: 'Prove it works',
      body: 'Tests check behavior, not implementation, and CI blocks a change that breaks a rule. Where it pays off, I add mutation testing and coverage gates.',
      evidence: [
        {
          label: 'Proving a specification is implemented',
          href: '/writing/spec-traceability-with-tdd',
        },
        { label: 'Folium', href: '/projects/folium' },
      ],
    },
  ] satisfies Principle[],
  focus: {
    work: 'I’m responsible for the complete frontend, UI and UX, of the new generation of industrial test software at SPS software.',
    exploring:
      'A software factory: infrastructure where AI agents do the work on their own, inside strict guardrails and a verification engine. A person steps in only when something blocks the work, or when a change would be hard to revert.',
    sideIntro: 'I build games and tools that are not public yet:',
    side: [
      'a roguelike tower-defence game',
      'a game about running a software startup, in C# with no game engine',
      'a platform for PC game discovery and price comparison',
      'an offline editor for plain text, Markdown and Textile',
    ],
  },
  employer: {
    name: 'SPS software s.r.o.',
    location: 'Chomutov',
    context:
      'Part of the SPS electronic group, a German maker of electrical test equipment since 1980. We build the software that runs SPS test systems for the windings in electric motors, generators and transformers: test programmes, automated test runs, live waveform analysis, results databases and reports.',
  },
  experience: [
    {
      company: 'SPS software s.r.o.',
      role: 'Software Engineer',
      period: '2026 - Present',
      achievements: [
        'Responsible for the complete frontend, UI and UX, of the new generation of the test software: a new product, separate from the existing Delphi software.',
        'Building it in C# and .NET with Avalonia UI, running in the browser through WebAssembly, on MVVM with ReactiveUI. LiveCharts for charts, Serilog for logging, GNU gettext for localization.',
        'Set up the CI/CD quality-gate pipeline in OneDev for the new generation, after the team tested it as a new platform.',
        'Work across the rest of the stack when needed: backend, database, DevOps and infrastructure.',
      ],
    },
    {
      company: 'SPS software s.r.o.',
      role: 'Junior Software Engineer',
      period: '2023 - 2026',
      achievements: [
        'Maintained and extended the test software in Delphi and .NET.',
        'Helped migrate the Delphi codebase from Delphi 7 to Delphi 12.',
        'Integrated a third-party power source into the test software, using its existing device communication layer.',
      ],
    },
  ] satisfies ExperienceEntry[],
  skills: [
    { label: 'Languages', items: ['C#', 'Delphi', 'SQL', 'HTML/CSS'] },
    {
      label: '.NET',
      items: [
        '.NET',
        'ASP.NET Core',
        'Avalonia UI',
        'WebAssembly',
        'MVVM',
        'ReactiveUI',
        'LiveCharts',
        'Serilog',
        'GNU gettext',
      ],
    },
    { label: 'Data', items: ['SQL Server', 'PostgreSQL', 'SQLite', 'REST APIs'] },
    {
      label: 'Quality & Delivery',
      items: ['xUnit', 'Stryker.NET', 'Git', 'GitHub Actions', 'OneDev'],
    },
    {
      label: 'AI Software Development',
      items: [
        'Agentic workflows',
        'Agent rules and skills',
        'Guardrails and verification gates',
        'Spec-driven tasks',
        'Vendor-neutral tooling',
      ],
    },
  ] satisfies SkillGroup[],
  /** Stacks that AI agents wrote under the owner's direction. Not core skills. */
  agentBuilt: [
    { stack: 'Kotlin and Jetpack Compose', where: 'Ocho', href: '/projects/ocho' },
    { stack: 'Astro, TypeScript and Tailwind CSS', where: 'this site' },
  ] as { stack: string; where: string; href?: string }[],
};
