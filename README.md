# Hono fullstack template

This is how I usually structure my side projects, it's a simple template to get started with a fullstack app using Hono, Drizzle, and Vite.

## Project Structure

This Turborepo includes the following packages/apps:

### Apps

- `backend`: Backend service
- `client`: Web client application

### Packages

- `@moroccan-stream/typescript-config`: TypeScript configurations used throughout the monorepo

## Tech Stack

- [Turborepo](https://turbo.build/repo) for monorepo management
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Bun](https://bun.sh/) as the package manager and runtime
- [Drizzle](https://orm.drizzle.team/) for database access
- [Hono](https://hono.dev/) for the API
- [Vite](https://vitejs.dev/) for the frontend build
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://react.dev/) for the frontend

## Getting Started

### Prerequisites

- Node.js >= 18
- Bun >= 1.2.8
- Docker (optional, for local development)

### Installation

1. Clone the repository
2. Install dependencies:
   ```sh
   bun install
   ```

### Development

To start development:

```sh
# Start all apps in development mode
bun dev

# Start with Docker
bun docker
```

### Build

To build all apps and packages:

```sh
bun build
```

### Other Commands

```sh
# Run linting
bun lint

# Run type checking
bun check-types

# Format code
bun format
```

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
