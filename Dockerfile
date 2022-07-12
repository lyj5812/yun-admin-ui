FROM ccr.ccs.tencentyun.com/golden-cloud/node:14.3-buster as builder
ARG ENV-ACTIVE=prod
WORKDIR /build/
COPY .npmrc /build/
COPY package*.json /build/
RUN set -ex && npm install
COPY . /build/
RUN set -ex && npm run build:"${ENV-ACTIVE}"

FROM ccr.ccs.tencentyun.com/golden-cloud/nginx-base:1.19
ARG ENV-ACTIVE=prod
WORKDIR /data
EXPOSE 80
COPY default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /build/dist  .