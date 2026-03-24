# AGENTS.md

## Project Overview

This is Barti's personal blog site built with Astro, React, and Tailwind CSS. Content is fetched from a Strapi CMS at build time. The project uses static site generation (SSG) to build pages from the CMS API.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run astro        # Run Astro CLI commands
```

### Running a Single Test

This project does not currently have a test framework configured. Tests are not required.

## Code Style Guidelines

### General Conventions

- **Framework**: Astro (v2) with React components for interactive elements
- **Styling**: Tailwind CSS classes (utility-first approach)
- **Types**: TypeScript throughout
- **Package Manager**: npm (not yarn or pnpm)

### Project Structure

```
src/
├── components/       # Reusable UI components (.astro files)
├── content/          # Astro content collections (blog posts)
├── interfaces/       # TypeScript interfaces for API data
├── layouts/          # Page layouts
├── lib/              # Utility functions (API calls, helpers)
├── pages/            # Astro pages (file-based routing)
│   ├── posts/        # Blog post pages including [...slug].astro
│   ├── topics/       # Topic filter pages
│   └── about/        # About page
├── styles/           # Global styles
├── consts.ts         # Global constants
└── types.ts          # Shared TypeScript types
```

### Imports

**Astro components**: Use relative paths with `../../` pattern
```astro
import BaseHead from "../../components/BaseHead.astro";
import TopicContainer from "../../components/TopicContainer.astro";
```

**TypeScript interfaces**: Import from `../../interfaces/strapi`
```typescript
import type { Post, Topic, Reference } from "../../interfaces/strapi";
```

### TypeScript Conventions

- Use `interface` for object shapes, `type` for unions/primitives
- Always import types explicitly: `import type { ... }`
- Use `any` sparingly; prefer proper typing from interfaces

```typescript
// Good
interface Props {
    references: Reference[];
}
const { references } = Astro.props;

// Avoid when possible
const content: any = ...
```

### Astro Component Patterns

**Frontmatter (server-side)**:
```astro
---
import type { Post } from "../../interfaces/strapi";
import Page from "../../components/Page.astro";

interface Props = Post;

const post = Astro.props;
---
```

**Template**: Use Tailwind classes for all styling
```astro
<div class="mt-8 pt-8 border-t border-slate-600">
    <slot />
</div>
```

### Tailwind CSS Conventions

- Use `slate-*` colors for dark theme (background `slate-800`, borders `slate-600`)
- Text colors: `slate-100` for primary, `slate-400` for secondary
- Responsive prefixes: `md:`, `lg:` for breakpoints
- Use existing color palette, don't add custom colors

### Naming Conventions

- **Components**: PascalCase `.astro` files (e.g., `TopicContainer.astro`, `References.astro`)
- **Interfaces**: PascalCase (e.g., `Post`, `Topic`, `Reference`)
- **Variables/Props**: camelCase
- **CSS Classes**: kebab-case (Tailwind handles this)

### Error Handling

- API calls wrapped in try/catch where appropriate
- Graceful handling of optional data (use optional chaining `?.` and nullish coalescing `||`)
- Return empty/default UI when data is unavailable

### Code Patterns

**Conditional rendering in Astro**:
```astro
{post.references && post.references.length > 0 && (
    <References references={post.references} />
)}
```

**Mapping arrays**:
```astro
{post.topics?.map((topic: Topic) => (
    <TopicContainer topic={topic} />
))}
```

**Links with external targets**:
```astro
<a href={url} target="_blank" rel="noopener noreferrer">
```

## API Integration

- Strapi REST API at `http://192.168.1.161:1337/api`
- API functions in `src/lib/strapi.ts`
- Populate relations: `populate=references`, `populate=topics`, `populate=thumbnail`
- Response wrapped in `StrapiResponse<T>` interface

## Adding New Features

1. **New page**: Create in `src/pages/` following file-based routing
2. **New component**: Create in `src/components/` as `.astro` file
3. **New data type**: Add interface in `src/interfaces/strapi.ts`
4. **Styling**: Use existing Tailwind classes, prefer existing color scheme

## Build Notes

- Static site generation - all data fetched at build time
- Sitemap auto-generated via `@astrojs/sitemap`
- RSS feed at `/rss.xml`
