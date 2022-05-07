# Dockerfile for a raw minimal container (Expected size 1.8MB)
####################################################################################################
## Builder
####################################################################################################
FROM golang:alpine as builder
WORKDIR /app 
COPY . .
# Build the app, strip it (LDFLAGS) and optimize it with UPX
RUN apk add upx && \
 CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ./build/cat-generator -ldflags="-w -s" ./src/ && \
 upx --best --lzma ./build/cat-generator

####################################################################################################
## Final image
####################################################################################################
FROM scratch
# Import certificates from alpine, scratch doesn't have any cert by default 
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder "/app/build/cat-generator" "/app/"
ENTRYPOINT ["/app/cat-generator"]
