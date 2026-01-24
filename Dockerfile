# Dockerfile for Anan Sketchbook Discord Bot
# Multi-stage build for smaller final image

# ========================================
# Stage 1: Build
# ========================================
FROM node:22-slim AS builder

# Enable corepack for pnpm
RUN corepack enable

WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN pnpm build

# ========================================
# Stage 2: Production
# ========================================
FROM node:22-slim AS production

# Install dependencies required for canvas and sharp
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgif7 \
    libjpeg62-turbo \
    librsvg2-2 \
    libvips42 \
    && rm -rf /var/lib/apt/lists/*

# Enable corepack for pnpm
RUN corepack enable

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy assets (required for the bot to function)
COPY assets ./assets

# Create data directory for database
RUN mkdir -p /app/data

# Set environment variables
ENV NODE_ENV=production
ENV DATA_DIR=/app/data
ENV ASSETS_DIR=/app/assets

# Create non-root user for security
RUN groupadd -r bot && useradd -r -g bot bot
RUN chown -R bot:bot /app
USER bot

# Start the bot
CMD ["node", "dist/index.js"]
