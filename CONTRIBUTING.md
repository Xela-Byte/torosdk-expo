# Contributing to ToroForge

Thank you for your interest in contributing to ToroForge! We believe open-source collaboration is key to building a robust decentralized ecosystem. Whether you're fixing a bug, proposing a new hook, or improving documentation, your contributions are highly valued.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Get Started](#how-to-get-started)
- [Repository Structure](#repository-structure)
- [Development Workflow](#development-workflow)
- [Contributing to a Specific SDK](#contributing-to-a-specific-sdk)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Commit Message Convention](#commit-message-convention)

---

## Code of Conduct

By participating in this project, you agree to be respectful, constructive, and inclusive. Harassment or abuse of any kind will not be tolerated. Our goal is a welcoming environment for contributors of all experience levels.

---

## How to Get Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** >= 18.x
- **pnpm** >= 8.x (preferred) or npm/yarn
- **Git**

### Clone the Repository

```bash
git clone https://github.com/toroforge/reactforge.git
cd reactforge
```

### Install Dependencies

This is a Turborepo monorepo. Install all dependencies from the root:

```bash
pnpm install
```

### Run the Documentation Dashboard Locally

```bash
pnpm dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to preview the documentation and your changes live.

---

## Repository Structure

```text
reactforge/
├── apps/
│   └── dashboard/              # Next.js interactive documentation dashboard
│       ├── app/
│       │   ├── react-web/      # React Web SDK documentation pages
│       │   └── react-native/   # React Native SDK documentation pages
│       └── components/         # Shared UI components (Sidebar, Navbar, CodeBlock, etc.)
├── packages/
│   ├── sdk-adapter/            # Core TypeScript networking & signing logic
│   ├── react/                  # @reactforge/react — Web Hooks SDK
│   │   └── src/hooks/          # All useToroXxx.ts hook files live here
│   └── react-native/           # @reactforge/react-native — Mobile Hooks SDK
│       └── src/react/hooks/    # All useXxx.ts mobile hook files live here
├── scratch/                    # Temporary helper scripts (not for production)
├── CONTRIBUTING.md             # This file
└── README.md                   # Project overview
```

---

## Development Workflow

### 1. Create a Feature Branch

Always create a branch from `main`:

```bash
git checkout -b feat/your-feature-name
```

### 2. Make Your Changes

- **For SDK hooks** (new or updated hooks), edit files in `packages/react/src/hooks/` or `packages/react-native/src/react/hooks/`.
- **For documentation**, add or edit pages in `apps/dashboard/app/react-web/` or `apps/dashboard/app/react-native/`.
- **For core networking logic**, work in `packages/sdk-adapter/src/`.

### 3. Build and Lint

Before submitting, ensure the project builds cleanly:

```bash
pnpm build
pnpm lint
```

---

## Contributing to a Specific SDK

### Adding a New React Web Hook

1. Create your hook file in `packages/react/src/hooks/useToroYourHook.ts`.
2. Export it from `packages/react/src/hooks/index.ts`.
3. Add a corresponding documentation page in `apps/dashboard/app/react-web/<category>/useToroYourHook/page.tsx`.
4. Add the link to `apps/dashboard/components/Sidebar.tsx` under the appropriate section.

### Adding a New React Native Hook

1. Create your hook file in `packages/react-native/src/react/hooks/useYourHook.ts`.
2. Export it from `packages/react-native/src/react/index.ts`.
3. Add a documentation page in `apps/dashboard/app/react-native/<category>/useYourHook/page.tsx`.
4. Add the link to `apps/dashboard/components/SidebarRN.tsx` under the appropriate section.

### Documentation Style Guide

All documentation pages must follow these rules, which match the existing codebase:

- **Background:** Pure black `#000000`
- **Body text:** Zinc `#a1a1aa`
- **Code references / accent:** Toronet Green `#16A34A`
- **NO gradient buttons or backgrounds** — only solid accent colors
- Use the `<PageHeader title="..." description="..." />` component for the page header
- Use the `<TryItLab title="..." codeSnippet={...} />` component for code examples
- Use `<CodeBlock code={...} language="tsx" />` for static code blocks

---

## Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch.
3. Fill out the PR template describing what you changed and why.
4. Request a review from a maintainer.
5. Once approved and all checks pass, your PR will be merged.

---

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

| Type | Description |
|---|---|
| `feat` | A new hook, feature, or documentation page |
| `fix` | A bug fix in an SDK hook or UI component |
| `docs` | Changes to documentation only |
| `refactor` | Code refactoring without feature/bug changes |
| `chore` | Build system, tooling, or dependency changes |

**Examples:**
```
feat(react): add useToroVoting hook for on-chain governance
fix(react-native): correct biometric prompt fallback logic
docs(dashboard): add useExchangeRates page to react-native docs
```

---

Thank you for contributing to ToroForge and helping build the future of decentralized mobile and web finance! 🌿
