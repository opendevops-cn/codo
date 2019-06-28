FROM node:alpine AS builder

COPY . /app

WORKDIR /app

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org; cnpm install; npm run build

FROM opencodo/nginx

ENV TZ=Asia/Shanghai

RUN mkdir -pv /var/www/coduui && rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /var/www/coduui

COPY hack/nginx/ui.conf /etc/nginx/conf.d/ui.conf

