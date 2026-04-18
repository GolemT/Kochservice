FROM alpine:3.20
WORKDIR /app

RUN apk add --no-cache ca-certificates

COPY target/x86_64-unknown-linux-musl/release/kochservice /app/kochservice

RUN chmod +x /app/kochservice

EXPOSE 8080

CMD ["./kochservice"]