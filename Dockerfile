FROM node:alpine AS builder

COPY . /app

WORKDIR /app

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org; cnpm install; npm run build

FROM nginx

ENV TZ=Asia/Shanghai

RUN set -x \
    && apt-get update \
    && apt-get install --no-install-recommends --no-install-suggests -y ca-certificates procps curl net-tools \
    && rm -rf /var/lib/apt/lists/* 

COPY --from=builder /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=5s --timeout=3s CMD curl -fs http://localhost/ || exit 1