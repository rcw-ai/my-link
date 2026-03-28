# Project Overview: my-link (my-profile)

This project consists of a Next.js web application named `my-profile`, located in the `my-profile/` directory. It is a modern web application built with Next.js, React, and Tailwind CSS.

## Main Technologies
- **Framework:** [Next.js 16.1+](https://nextjs.org/) (App Router)
- **Library:** [React 19+](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with PostCSS
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Linting:** [ESLint](https://eslint.org/)

## Project Structure
- `my-profile/`: The core Next.js application directory.
  - `app/`: Contains the application routes, layouts, and pages (App Router).
  - `public/`: Static assets like images and fonts.
  - `next.config.ts`: Next.js configuration.
  - `tailwind.config.ts` & `postcss.config.mjs`: Styling configurations.
  - `package.json`: Project dependencies and scripts.

## Building and Running
All commands should be executed from within the `my-profile/` directory:

- **Development Server:**
  ```bash
  cd my-profile
  npm run dev
  ```
  Starts the development server at `http://localhost:3000`.

- **Build for Production:**
  ```bash
  cd my-profile
  npm run build
  ```
  Compiles the application for production deployment.

- **Start Production Server:**
  ```bash
  cd my-profile
  npm run start
  ```
  Runs the built application.

- **Linting:**
  ```bash
  cd my-profile
  npm run lint
  ```
  Runs ESLint to check for code quality issues.

## Development Conventions
- **App Router:** New features and pages should be added within the `my-profile/app/` directory following Next.js App Router conventions.
- **Styling:** Use Tailwind CSS utility classes for styling. Global styles are managed in `my-profile/app/globals.css`.
- **Fonts:** The project uses `next/font` with Geist and Geist Mono fonts, configured in `my-profile/app/layout.tsx`.
- **Components:** Functional components are preferred, using React 19 features where applicable.
- **Type Safety:** TypeScript is used throughout the project. Ensure all new components and functions are properly typed.
