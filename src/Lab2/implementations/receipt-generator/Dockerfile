####################################################################################################
## Builder
####################################################################################################
FROM rust:1.64.0 AS builder

RUN apt update && apt install -y musl-tools musl-dev pkg-config libssl-dev binutils upx-ucl
# We're targeting alpine, which is using musl instead of the glibc
# So we have to cross-compile for it
RUN rustup target add x86_64-unknown-linux-musl
# Depending on the app dependencies, some ca may break, so better safe than sorry
RUN update-ca-certificates
WORKDIR /app
COPY ./ .
# Build the app
RUN cargo build --target x86_64-unknown-linux-musl --release
# Optimize the app size aggresively by removing symbols (strip) and compressing it (upx)
RUN strip /app/target/x86_64-unknown-linux-musl/release/receipt-generator && \
  upx --best --lzma /app/target/x86_64-unknown-linux-musl/release/receipt-generator

####################################################################################################
## Final image
####################################################################################################
FROM alpine as release
COPY --from=builder  /app/target/x86_64-unknown-linux-musl/release/receipt-generator /

WORKDIR /home/site/wwwroot
EXPOSE 8081
ENTRYPOINT [ "/receipt-generator" ]