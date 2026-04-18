FROM debian:bookworm-slim
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy pre-built binary from CI artifacts
COPY target/release/kochservice /app/kochservice

RUN chmod +x /app/kochservice

EXPOSE 8080

CMD ["./kochservice"]