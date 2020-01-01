#FROM centos:7 as build-stage
FROM node:10.18.0-jessie as build-stage

WORKDIR /app
# 1. 安装依赖
COPY package.json .
RUN npm install --ignore-script
# 2. 编译
COPY . /app
RUN npm run build 

############################
FROM nginx as production
MAINTAINER "shenshuo<191715030@qq.com>"

# 设置编码
ENV LANG en_US.UTF-8
# 同步时间
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /var/www/codo/
COPY nginx_ops.conf  /etc/nginx/conf.d/codo_frontend.conf
COPY --from=build-stage /app/dist  /var/www/codo

