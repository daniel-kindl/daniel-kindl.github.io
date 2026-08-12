import { getYearsOfExperience } from '@lib/experience';

const careerStartDate = new Date('2023-07-01');

export const technicalProfile = {
  name: 'Daniel Kindl',
  role: 'Software Engineer',
  summary: `Software engineer who likes turning ideas and annoying problems into finished software. ${getYearsOfExperience(careerStartDate)}+ years building software with C#/.NET, Kotlin, Go, and TypeScript. Most of my work has been desktop applications and backend services, alongside Android apps, web projects, and developer tools.`,
  skills: {
    languages: ['C#', 'Go', 'TypeScript', 'JavaScript', 'Delphi'],
    frameworks: ['.NET', 'Android'],
    desktopUI: ['Avalonia UI', 'MVVM'],
    mobile: ['Kotlin', 'Jetpack Compose', 'Hilt'],
    frontend: ['HTML/CSS/JS', 'Svelte 5', 'Astro', 'Tailwind CSS'],
    backend: ['REST API', 'SignalR', 'Go'],
    databases: ['SQL Server', 'PostgreSQL', 'SQLite'],
    testing: ['xUnit'],
    devops: ['Git', 'GitHub Actions', 'GitHub Pages', 'OneDev', 'Docker', 'CI/CD Pipeline'],
  },
  experience: [
    {
      company: 'SPS software s.r.o.',
      role: 'Software Engineer',
      period: '2026 - Present',
      achievements: [
        'Led complex features from design through production with high autonomy.',
        'Engineered customer device integrations using non-standard protocols.',
        'Led architectural modernization efforts and mentored junior engineers through code review.',
        'Managed internal Git infrastructure and CI/CD pipelines.',
      ],
    },
    {
      company: 'SPS software s.r.o.',
      role: 'Junior Software Engineer',
      period: '2023 - 2026',
      achievements: [
        'Maintained and extended industrial measurement applications in Delphi and .NET.',
        'Modernized system modules to reduce technical debt and improve stability.',
        'Implemented user interfaces with Avalonia UI and integrated real-time data services.',
      ],
    },
  ],
};
