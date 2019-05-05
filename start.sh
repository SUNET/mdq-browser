#!/bin/bash

# from https://github.com/spujadas/lighttpd-docker/blob/master/start.sh
# this launcher script tails the access and error logs
# to the stdout and stderr, so that `docker logs -f lighthttpd` works.


mdq_url=${MDQ_URL:-"http://${MDQ_HOST}:${MDQ_PORT}/entities/"}
pyff_apis=${PYFF_APIS:-false}
mdq_servername=${MDQ_SERVERNAME:-""}

cat<<EOF>/usr/share/nginx/html/config.json
{
   "mdq_url": "$mdq_url",
   "mdq_servername": "$mdq_servername",
   "pyff_apis": $pyff_apis
}
EOF

nginx -c /etc/nginx/nginx.conf
