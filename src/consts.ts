// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import type { SocialInfo } from "./types";

export const SITE_TITLE = "Barti's";
export const AUTHOR = "Barti";
export const SITE_DESCRIPTION = "Welcome to my website!";
export const GITHUB_URL = "https://github.com/bartivs";

export const DEFAULT_SOCIAL_IMAGE = "/social-cover.png";
export const DEFAULT_SITE_PROFILE = {
  siteTitle: "Barti's",
  displayName: "Oscar Bartolome Valdim Sarubby",
  schemaName: "Oscar Bartolome Valdrama Sarubbi",
  summary:
    "AI-driven engineer with production RAG and cloud-native delivery. 5+ years in React, Vue, Laravel, Django, Ionic, ASP.NET. PostgreSQL, Docker, AWS-certified. Paraguay-based, remote for US/Canada.",
  linkedinUrl: "https://www.linkedin.com/in/oscar-bartolome-valdim-sarubby-80a3a5168/",
  githubUrl: "https://github.com/bartivs",
  resumeUrl: "https://resume.bartokiaching.com/english",
  schemaResumeUrl: "https://resume.barticode.com/english",
  skills: [
    "RAG",
    "LangChain",
    "React",
    "Vue",
    "Django",
    "Laravel",
    "ASP.NET",
    "Ionic",
    "PostgreSQL",
    "Docker",
    "AWS",
  ],
} as const;

export const DEFAULT_HOME_PAGE = {
  seoTitle:
    "Oscar Bartolome Valdez Sarubbi — AI-Driven FullStack Engineer | RAG, LLM APIs & Cloud-Native",
  seoDescription: DEFAULT_SITE_PROFILE.summary,
  heroTitle: "Oscar Bartolome Valdim Sarubby — AI-Driven FullStack Engineer",
  heroBody:
    "I build web products end to end, from user-facing interfaces to backend services and deployment pipelines. My recent work leans heavily into AI-assisted delivery, production RAG workflows, and cloud-native systems while staying grounded in solid full-stack engineering.",
  skillsText: DEFAULT_SITE_PROFILE.skills.join(", "),
} as const;

export const DEFAULT_ABOUT_PAGE = {
  seoTitle: "Oscar Bartolome Valdim Sarubby — AI Engineer | RAG, LLM, Cloud-Native",
  seoDescription: DEFAULT_SITE_PROFILE.summary,
};

// export const SOCIAL_LINKS: SocialInfo[] = [{
//     url:"https://github.com/bartivs",astro_icon:"social/github"
// }, {
//     url:"https://m.webtoo.ls/@astro",astro_icon:"social/mastodon"
// }]
