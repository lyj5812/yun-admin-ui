FROM node:latest as builder
ARG env=prod
WORKDIR /build/
COPY package.json /build/
RUN npm config set registry https://registry.npm.taobao.org \
 && npm config set sass_binary_site=https://npm.taobao.org/mirrors/node-sass
RUN npm install
RUN npm run build:prod
COPY . /build/

FROM nginx:latest
WORKDIR /data
EXPOSE 80
COPY default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /build/dist .