FROM nginx:alpine

RUN apk update && apk upgrade

COPY www/ /usr/share/nginx/html/
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
