FROM node:latest as builder
ARG env=prod
WORKDIR /build/
COPY .npmrc /build/
COPY package*.json /build/
RUN npm install pm2 -g --registry=https://registry.npm.taobao.org
COPY . /build/
RUN npm run build:"${env}"

FROM nginx:latest
WORKDIR /data
EXPOSE 80
COPY default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /build/dist  .