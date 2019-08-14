FROM registry.cn-hangzhou.aliyuncs.com/ss1917/codo-node:v10.16.1

MAINTAINER "shenshuo<191715030@qq.com>"

# 复制代码
RUN mkdir -p /app
WORKDIR /app
ADD . /app

RUN rm -rf /app/node_modules && npm config set registry https://registry.npmjs.org/ \
    && npm cache clean --force \
    && npm install --ignore-script \
    && npm run build \
    && mkdir -p /var/www/codo && cp -r /app/dist/* /var/www/codo/

# 5. 日志
VOLUME /var/log/nginx/

# 6. 准备文件 请注意如果要修改访问的域名，请在编译之前修改nginx_ops.conf 的server_name
# COPY nginx_ops.conf /etc/nginx/conf.d/default.conf

# 开放端口
EXPOSE 80
EXPOSE 443

CMD ["nginx"]