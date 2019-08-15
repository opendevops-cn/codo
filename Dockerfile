FROM nginx

MAINTAINER "shenshuo<191715030@qq.com>"

VOLUME /var/log/nginx/
VOLUME /var/www/codo/

EXPOSE 80
EXPOSE 443

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]