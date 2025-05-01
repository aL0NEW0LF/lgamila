ARG APP_URL=https://kickenhancer.live
ARG BUN_VERSION=1.2.8

FROM oven/bun:${BUN_VERSION} AS base
WORKDIR /usr/src/app

COPY . .
RUN bun install --frozen-lockfile

FROM base AS client-builder
WORKDIR /usr/src/app/apps/client

ENV VITE_API_URL=https://api.kickenhancer.live
ENV VITE_APP_URL=${APP_URL}

RUN bun run build

FROM base AS backend
WORKDIR /usr/src/app/apps/backend

COPY --from=client-builder /usr/src/app/apps/backend/static ./static

USER bun

ENV NODE_ENV=production
ENV PORT=3000
ENV BETTER_AUTH_URL=${APP_URL}

EXPOSE 3000/tcp

ENTRYPOINT [ "bun", "start" ]