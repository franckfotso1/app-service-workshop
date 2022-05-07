# Expected Final size: 133MB
####################################################################################################
## Build image
####################################################################################################
FROM denoland/deno:alpine-1.18.2 as builder
WORKDIR /app
ADD . .
RUN deno compile --allow-env --allow-net --allow-read /app/src/server.ts

####################################################################################################
## Final image
####################################################################################################
FROM denoland/deno:alpine-1.18.2 as release
RUN adduser -HD -s /bin/ash app
COPY --from=builder --chown=app:app /app/server /
EXPOSE 8080
ENTRYPOINT [ "/server" ]
