FROM node:8-alpine as build
WORKDIR /app
COPY . .
RUN npm install && ./node_modules/.bin/tsc

FROM node:8-alpine as prod
WORKDIR /app
COPY --from=build /app/dist /app
COPY --from=build /app/package.json /app
RUN npm install --only=prod 
EXPOSE 3000
CMD [ "node", "/app/app.js" ]
