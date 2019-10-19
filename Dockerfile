FROM node:v10.16.1-alpine as build-stage

WORKDIR /app

# 4. 复制代码
RUN mkdir -p /app
ADD . /app

RUN npm config set registry https://registry.npmjs.org/ \
  && npm cache clean --force \
  && npm install --ignore-script \
  && npm run build 


############################

FROM nginx as production

MAINTAINER "shenshuo<191715030@qq.com>"

RUN mkdir -p /var/www/codo

WORKDIR /var/www/codo/

COPY nginx_ops.conf  /etc/nginx/conf.d/codo_frontend.conf
COPY --from=build-stage /app/dist  /var/www/codo

EXPOSE 80
EXPOSE 443

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
