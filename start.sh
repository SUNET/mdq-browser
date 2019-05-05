#!/bin/bash

# from https://github.com/spujadas/lighttpd-docker/blob/master/start.sh
# this launcher script tails the access and error logs
# to the stdout and stderr, so that `docker logs -f lighthttpd` works.


mdq_url=${MDQ_URL:-"https://${HOSTNAME}/entities/"}
pyff_apis=${PYFF_APIS:-false}
mdq_servername=${MDQ_SERVERNAME:-""}

jq -n --arg mdq_url "$mdq_url" --arg pyff_apis "$pyff_apis" --arg mdq_servername "$mdq_servername" \
   '{mdq_url: $mdq_url, mdq_servername: $mdq_servername, pyff_apis: $pyff_apis}' > /var/www/html/config.json


tail -F /var/log/lighttpd/access.log 2>/dev/null &
tail -F /var/log/lighttpd/error.log 2>/dev/null 1>&2 &
lighttpd -D -f /etc/lighttpd/lighttpd.conf
