FROM nginx:1.19-alpine

LABEL maintainer="Ahmad Tahani <ahmad.tahani@gmail.com>"

COPY ./build /var/www
COPY ./deploy/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]