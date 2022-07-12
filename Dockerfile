FROM node:latest as builder
ARG env=prod
WORKDIR /build/
COPY .npmrc /build/
COPY package*.json /build/
RUN set -ex && npm install pm2 -g --registry=https://registry.npm.taobao.org
COPY . /build/
RUN set -ex && npm run build:prod

FROM nginx:latest
WORKDIR /data
EXPOSE 80
COPY default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /build/dist  .