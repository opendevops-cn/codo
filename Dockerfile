FROM centos:7
# 设置编码
ENV LANG en_US.UTF-8
# 同步时间
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 1. 安装基本依赖和nginx
RUN yum update -y && yum install epel-release -y && yum update -y && yum install wget nginx  git -y
WORKDIR /app

# 2. 准备node 
RUN wget -q -c  https://npm.taobao.org/mirrors/node/v10.16.1/node-v10.16.1-linux-x64.tar.xz && tar xf node-v10.16.1-linux-x64.tar.xz -C  /usr/local/
RUN rm -rf /usr/local/bin/node && rm -rf /usr/local/bin/npm \
    && ln -s /usr/local/node-v10.16.1-linux-x64/bin/node /usr/local/bin/node \
    && ln -s /usr/local/node-v10.16.1-linux-x64/bin/node /usr/bin/node \
    && ln -s /usr/local/node-v10.16.1-linux-x64/bin/npm  /usr/local/bin/npm \
    && ln -s /usr/local/node-v10.16.1-linux-x64/bin/npm  /usr/bin/npm

# 4. 复制代码
RUN mkdir -p /app
ADD . /app

RUN rm -rf /app/node_modules && npm config set registry https://registry.npmjs.org/ \
    && npm cache clean --force  \
    && npm install --ignore-script  \
    && npm run build \
    && mkdir -p /var/www/codo && cp -r /app/dist/* /var/www/codo/

# 5. 日志
VOLUME /var/log/

# 6. 准备文件
COPY nginx_ops.conf /etc/nginx/conf.d/default.conf

# 开放端口
EXPOSE 80
EXPOSE 443

CMD ["nginx"]