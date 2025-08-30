# LGamila Stream Platform

![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/lgamila/lgamila)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/lgamila/lgamila?utm_source=oss&utm_medium=github&utm_campaign=lgamila%2Flgamila&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
[![API Status](https://uptime.betterstack.com/status-badges/v1/monitor/22wjm.svg)](https://status.lgamila.ma/)
[![Web Status](https://uptime.betterstack.com/status-badges/v1/monitor/22wjk.svg)](https://status.lgamila.ma/)

<div align="center">

![LGamila Logo](./apps/web/public/lgamila-live.svg)

### LGamila - Empowering Moroccan Streamers 🇲🇦

_By streamers, for streamers._ A community-driven platform built to empower Moroccan content creators and help them thrive in the streaming ecosystem. We're not just building tools—we're building a movement to elevate Moroccan talent worldwide.

[Download Extension](https://www.lgamila.ma/) · [Report Bug](https://github.com/lgamila/lgamila/issues) · [Request Feature](https://github.com/stormix/lgamila/issues)

</div>

---

## Table of Contents

1. [About the Project](#about-the-project)
2. [Mission & Vision](#-mission--vision)
3. [Screenshots](#screenshots)
4. [What's Inside?](#whats-inside)
5. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
6. [Usage](#usage)
7. [Community Impact](#-community-impact)
8. [Releases](#releases)
9. [Contributing](#contributing)
10. [License](#license)
11. [Contact](#contact)
12. [Acknowledgments](#acknowledgments)

## About the Project

LGamila started as a passion project by Moroccan streamers who wanted to see their community thrive. We recognized that talented Moroccan creators needed better visibility and tools to grow their audience, so we built a comprehensive ecosystem to address these challenges.

**Our story:** Born from the vibrant Moroccan streaming community, LGamila is more than just a technical solution—it's a collective effort to build the infrastructure our creators deserve. We're streamers building for streamers, understanding the unique challenges and opportunities within our community.

## 🎯 Mission & Vision

**Mission:** To provide Moroccan streamers with world-class tools and community support, helping them gain the recognition they deserve and build sustainable streaming careers.

**Vision:** A future where every talented Moroccan streamer has the resources, visibility, and community support needed to thrive on the global stage.

### What Drives Us

- 🤝 **Community First**: Everything we build is designed with our community's needs at the forefront
- 🛠️ **Innovation**: Creating cutting-edge tools that give Moroccan streamers a competitive advantage
- 🌟 **Recognition**: Amplifying Moroccan talent and showcasing our creators to the world
- 🚀 **Growth**: Providing the infrastructure for sustainable streaming careers

### 🚀 Community-Driven Features

- **🔴 Real-time Discovery**: Never miss when your favorite Moroccan streamers go live across Twitch and Kick
- **📱 Browser Extension**: Instant access to live Moroccan streamers with desktop notifications
- **🌐 Community Web Platform**: Discover new creators and connect with fellow community members
- **🎯 Streamer Spotlight**: Community-powered suggestions to help talented creators gain visibility
- **🔄 Multi-Platform Unity**: See all Moroccan streamers in one place, regardless of their platform
- **📊 Growth Analytics**: _(Coming Soon)_ Help streamers understand and grow their audience
- **🤝 Creator Networking**: _(Coming Soon)_ Connect Moroccan streamers for collaboration opportunities

## Screenshots

<!-- Add screenshots here when available -->

_Screenshots coming soon..._

## What's Inside?

This monorepo includes the following packages/apps:

### Apps

- `backend`: A [Hono](https://hono.dev/) + [Bun](https://bun.sh/) API server with real-time stream tracking
- `web`: An [Astro](https://astro.build/) web application for the community platform
- `extension`: A [Plasmo](https://docs.plasmo.com/) browser extension for Chrome

### Packages

- `@lgamila/shared`: Shared utilities and type definitions
- `@lgamila/logging`: Structured logging with context support and Sentry integration
- `@lgamila/design-system`: Shared UI components built with Radix UI and Tailwind CSS
- `@lgamila/typescript-config`: TypeScript configurations

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm (recommended package manager)
- Docker (for local database, optional)
- PostgreSQL database
- Redis server

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/stormix/lgamila.git
   cd lgamila
   ```

2. **Install dependencies:**

   ```bash
   npm install -g pnpm
   pnpm install
   ```

3. **Set up environment variables:**

   Create environment files for the backend and other apps as needed. Refer to the individual app README files for specific environment variable requirements.

4. **Set up the database:**

   ```bash
   # Push database schema
   pnpm --filter backend db:push

   # Generate and run migrations (optional)
   pnpm --filter backend db:generate
   pnpm --filter backend db:migrate
   ```

5. **Start the development servers:**

   ```bash
   # Start all apps
   pnpm dev

   # Or start individual apps
   pnpm --filter backend dev    # Backend API
   pnpm --filter web dev        # Web platform
   pnpm --filter extension dev  # Browser extension
   ```

## Development Commands

### Code Quality

```bash
pnpm lint                  # Run linting across all packages
pnpm format               # Format code across all packages
pnpm check-types          # Type check all packages
```

### Build Commands

```bash
pnpm build                # Build all packages
pnpm --filter web build   # Build only web app
pnpm --filter extension build:all  # Build extension for all browsers
```

## Usage

### Backend API

The backend provides a REST API for accessing streamer data:

- `GET /api/streamers` - Get list of streamers with optional filtering
- `GET /api/streamers/multi` - Get streamers active on multiple platforms
- `POST /api/streamers/suggest` - Suggest a new streamer

### Browser Extension

1. Build the extension using the command from the [Development Commands](#development-commands) section
2. Load the extension in your browser:
   - **Chrome**: Load from `apps/extension/build/chrome-mv3-prod`
   - **Firefox**: Load from `apps/extension/build/firefox-mv2-prod`
3. Get instant notifications when Moroccan streamers go live and never miss your favorite creators

#### Download Extension

Visit our website at [lgamila.ma](https://www.lgamila.ma/) to download the extension for your browser with easy installation instructions.

### Web Platform

Visit [lgamila.ma](https://www.lgamila.ma/) to:

- **Discover** talented Moroccan streamers across all platforms
- **Support** creators by suggesting new streamers to feature
- **Connect** with our growing community of streamers and viewers
- **Learn** about our mission to empower Moroccan creators

## 📈 Community Impact

Since launching, LGamila has been making a tangible impact on the Moroccan streaming community:

- **Growing Network**: Connecting streamers and viewers across Morocco and the diaspora
- **Increased Visibility**: Helping talented creators gain recognition they deserve
- **Cross-Platform Discovery**: Unifying the fragmented streaming landscape for Moroccan content
- **Community Collaboration**: Fostering connections between creators for mutual growth

_Want to be part of our growing community? [Download the extension](https://www.lgamila.ma/) or [suggest a streamer](https://www.lgamila.ma/suggest) today!_

## Releases

Extension releases are automatically built and published via GitHub Actions. Each release includes:

- **Chrome Extension** (Manifest V3) - Compatible with Chrome, Edge, and Chromium browsers
- **Firefox Extension** (Manifest V2) - Compatible with Firefox

### Download Latest Release

Visit [lgamila.ma](https://www.lgamila.ma/) to download the latest extension builds with easy installation for Chrome, Firefox, and other browsers.

### Creating Releases

For maintainers, see [RELEASING.md](RELEASING.md) for detailed release instructions.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Use conventional commits format
- Ensure all checks pass before submitting PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Note**: This project is not affiliated with Twitch, Kick, or any of their parent companies. All trademarks are the property of their respective owners.

## Contact

**Stormix** - [@stormix_dev](https://twitter.com/stormix_dev) - hello@stormix.dev

**Project Link**: [https://github.com/stormix/lgamila](https://github.com/stormix/lgamila)

## 🙏 Acknowledgments

LGamila exists because of the incredible Moroccan streaming community and the open source ecosystem that powers our tools. Special recognition goes to:

### 🇲🇦 Community Heroes

- [Zikoos Jam](https://www.twitch.tv/zikoos_jam) - Original inspiration and the spark that started this journey
- [EKB9816](https://x.com/ekb9816) - Our talented designer who created our beautiful logo and branding
- **Every Moroccan streamer** featured on our platform - You make our community vibrant and inspiring
- **The contributors and supporters** who help us grow and improve every day

### 🛠️ Technology Partners

- [Hono](https://hono.dev/) - Fast web framework
- [Astro](https://astro.build/) - Modern web framework
- [Plasmo](https://docs.plasmo.com/) - Browser extension framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Turborepo](https://turbo.build/repo) - Monorepo management
- [Twitch API](https://dev.twitch.tv/) - Twitch platform integration
- [Kick API](https://kick.com/) - Kick platform integration

---

<p align="center">
  <strong>🇲🇦 Built by streamers, for streamers</strong><br/>
  Made with ❤️ by the Moroccan Streaming Community<br/>
  <em>Empowering creators, one stream at a time</em>
</p>

<p align="center">
  <a href="https://www.lgamila.ma/">🌐 Visit Our Platform</a> •
  <a href="https://www.lgamila.ma/">📱 Download Extension</a> •
  <a href="https://www.lgamila.ma/suggest">🎯 Suggest a Streamer</a>
</p>
