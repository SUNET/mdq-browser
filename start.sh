#!/bin/bash

mdq_url=${MDQ_URL:-"http://${HOSTPORT}/entities/"}
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
