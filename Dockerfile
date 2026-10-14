# Stage 1: Build & Prepare
FROM alpine:3.21 AS builder

WORKDIR /build

# Copy static web assets
COPY public/ ./public/

# Strip test files and exclude firmware binaries to minimize image size.
# Firmware and config.json are mounted as volumes at runtime.
RUN rm -rf ./public/js/*.test.js ./public/test.html ./public/firmware/* \
    && mkdir -p ./public/firmware \
    && echo "{}" > ./public/firmware/index.json

# Stage 2: Runtime Web Server
FROM nginx:alpine

# Copy prepared static files to nginx document root
COPY --from=builder /build/public /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
