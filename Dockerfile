# syntax=docker/dockerfile:1.4

# ---------- Base ----------
# Shared base with dependencies installed from the lockfile.
FROM node:16-alpine AS base
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --no-audit


# ---------- Builder ----------
# Produces the production build output at /usr/src/app/build
#
# PUBLIC_URL controls the base path/URL that CRA (Create React App) bakes into the built
# assets (script/link tags in index.html and the asset manifest).
# Defaults to "." so the build can be served from any subpath or opened
# directly from the filesystem. Override at build time, e.g.:
#   docker build --build-arg PUBLIC_URL=/viewer --target=build-output --output=./build .
FROM base AS builder
ARG PUBLIC_URL=.
ENV PUBLIC_URL=${PUBLIC_URL}
COPY . .
RUN npm run build


# ---------- Build artifact ----------
# Minimal stage exposing only the build output. Use with:
#   docker build --target=build-output --output=./build .
FROM scratch AS build-output
COPY --from=builder /usr/src/app/build /


# ---------- Development ----------
# Runs the CRA dev server. `npm run compile` generates the per-locale
# messages.js files that src/constants.js imports; without it the dev build
# fails with "Can't resolve './locales/<lang>/messages.js'".
FROM base AS development
ENV NODE_ENV=development
ENV PORT=3300
COPY . .
EXPOSE 3300
CMD ["sh", "-c", "npm run compile && npm run start"]
