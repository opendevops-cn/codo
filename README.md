## Install

```bash
// install dependencies
npm install --ignore-script
```

### Run

#### Development

```bash
npm run dev
```

#### Production(Build)

```bash
npm run build
```

### Docker 方式部署

**修改`CODO_VER`release为最新的版本，静态文件的最终路径为 `/var/www/codo/`**

```bash
echo -e "\033[32m [INFO]: codo(项目前端) Start install. \033[0m"
CODO_VER="codo-beta-0.3.4"
if ! which wget &>/dev/null; then yum install -y wget >/dev/null 2>&1;fi
[ ! -d /var/www ] && mkdir -p /var/www
cd /var/www && wget https://github.com/opendevops-cn/codo/releases/download/${CODO_VER}/${CODO_VER}.tar.gz
tar zxf ${CODO_VER}.tar.gz
if [ $? == 0 ];then
    echo -e "\033[32m [INFO]: codo(项目前端) install success. \033[0m"
else
    echo -e "\033[31m [ERROR]: codo(项目前端) install faild \033[0m"
    exit -8
fi
```

**放置`nginx`配置文件，如果想使用https请自行修改nginx的配置文件，也可以参考项目下的`nginx_ops.conf`文件。**

**如果需要修改前端的访问域名可以直接修改配置文件中的server_name，proxy_pass对应的地址为网关地址，一定要和网关地址端口进行对应。**

```bash
mkdir -p /my/nginx/conf.d/
cat >/my/nginx/conf.d/codo-init.conf<<\EOF
server {
        listen       80;
        server_name demo-init.opendevops.cn;
        access_log /var/log/nginx/codo-access.log;
        error_log  /var/log/nginx/codo-error.log;

        location / {
                    root /var/www/codo;
                    index index.html index.htm;
                    try_files $uri $uri/ /index.html;
        }
        location /api {
                ### ws 支持
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

                add_header 'Access-Control-Allow-Origin' '*';
                proxy_pass http://gw.opendevops.cn:8888;
        }

        location ~ /(.svn|.git|admin|manage|.sh|.bash)$ {
            return 403;
        }
}
EOF
```

```bash
#bulid 镜像
docker build . -t codo_image
#启动
docker-compose up -d
```

- 测试一下 `ls /var/www/codo/index.html` 看下前端文件是不是存在
- 测试一下 `ls /my/nginx/conf.d/codo-init.conf` 看下nginx配置文件是不是存在
- swagger-ui 复制到/var/www/codo/目录即可，详情请参考安装文档。 命令如下：cd /opt/codo/codo && \cp -r swagger-ui/ /var/www/codo/ 

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016-present, iView
