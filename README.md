# Recipe Randomizer

A Next.js web application that helps you decide what to cook by randomly selecting recipes based on ingredients and effort level filters.

## Features

- Filter recipes by effort level (1-5 scale)
- Filter by ingredients/tags
- Expandable/collapsible ingredient tag list
- Random recipe selection from filtered results
- Smooth scrolling to selected recipes
- Responsive design with Tailwind CSS

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Heroicons

## Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd recipe-randomizer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── app/              # Next.js app router files
├── components/       # React components
├── data/            # Recipe data
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

## Development

- Edit recipe data in `src/data/recipes.ts`
- Modify styles in `src/app/globals.css` and component files
- Add new components in `src/components/`

## Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

## Deployment

The easiest way to deploy this application is through the [Vercel Platform](https://vercel.com/new).

1. Push your code to a Git repository (GitHub, GitLab, BitBucket)
2. Import your repository on Vercel
3. Vercel will detect it as a Next.js project and automatically configure the build settings
4. Your application will be deployed and you'll receive a production URL

Alternatively, you can deploy to any platform that supports Next.js applications.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
