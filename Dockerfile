FROM debian:stable
MAINTAINER Leif Johansson <leifj@sunet.se>
RUN apt-get update -q && apt-get install -yy libnginx-mod-http-lua nginx-extras
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
ADD start.sh /
RUN chmod a+rx /start.sh
ENTRYPOINT ["/start.sh"]
