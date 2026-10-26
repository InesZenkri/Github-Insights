# GitHub Insights

A terminal-style GitHub statistics frontend built with React, TypeScript and Vite. Search for a GitHub username to view public profile information, repository totals and a language chart, then download the stats card as a PNG.

## Data and limitations

- **Real GitHub data:** profile details, public repositories, stars and forks come from the GitHub REST API.
- **Simulated statistics:** contribution totals, current streak and longest streak are calculated from randomly generated demo data, not the user's GitHub contribution history. The current app displays these alongside real data without labelling them as simulated.
- Repository totals cover the first page of up to 100 repositories, not necessarily the user's full account.
- The language chart counts repositories by their primary language. It does not measure lines of code or language proficiency.
- The visitor counter uses an external service and falls back to `1` when that service fails.

This is a frontend demo, not a reliable contribution-history report.

## Features

- Search public GitHub profiles by username.
- Display repository, star and fork totals for the fetched repositories.
- Show the five most common primary repository languages.
- Download the displayed stats card as a PNG.
- Open LinkedIn sharing for the app's URL.

## Run locally

Install Node.js with npm and Git, then:

```bash
git clone https://github.com/InesZenkri/Github-Insights.git
cd Github-Insights
npm ci
npm run dev
```

Open the local URL printed by Vite.

The app can request public GitHub data without a token, subject to GitHub's unauthenticated API rate limits. Do not put a personal access token in `VITE_GITHUB_TOKEN` for a public deployment: Vite environment variables used by frontend code are exposed to the browser.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Stack

React, TypeScript, Vite, Tailwind CSS, React Query, Axios, Recharts and html-to-image. This repository contains the frontend, not a Python/Flask backend.

## License

[MIT](LICENSE)
