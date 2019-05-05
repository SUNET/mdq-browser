FROM debian:stable
MAINTAINER Leif Johansson <leifj@sunet.se>
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections
RUN apt-get -q update && apt-get -y upgrade && apt-get -y install lighttpd jq
COPY dist/ /var/www/html/
ADD start.sh /
RUN chmod a+rx /start.sh
ENTRYPOINT ["/start.sh"]
