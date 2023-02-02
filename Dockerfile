FROM node:18-alpine AS build

LABEL maintainer="Satit Rianpit <rianpit@gmail.com>"

WORKDIR /app

RUN apk update && \
  apk upgrade && \
  apk add --no-cache \
  python3 \
  tzdata \
  build-base \
  libtool \
  autoconf \
  automake \
  g++ \
  make && \
  cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && \
  echo "Asia/Bangkok" > /etc/timezone

RUN npm i -g @mapbox/node-pre-gyp

COPY . .

RUN npm i && npm rebuild bcrypt && npm run build

RUN rm -rf node_modules/gulp && \
    rm -rf node_modules/gulp-clean && \
    rm -rf node_modules/gulp-cli && \
    rm -rf node_modules/gulp-sourcemaps && \
    rm -rf node_modules/gulp-typescript && \
    rm -rf node_modules/gulp-uglify && \
    rm -rf node_modules/nodemon &&\
    rm -rf node_modules/readable-stream

FROM keymetrics/pm2:18-slim

ENV NODE_ENV === 'production'

COPY --from=build /app /app

EXPOSE 3000

# CMD ["node", "/app/dist/server.js"]
CMD ["pm2-runtime", "--json", "/app/process.json"]
