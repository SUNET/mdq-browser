MDQ browser
===

This is an HTML5/JS application that closely mirrors (and improves upon) the built-in HTML app
in pyFF.io. The intent is that this application be useful as a frontend to any MDQ server but
mostly useful to servers that implement at least the pyff webfinger extension to MDQ.

Build
---

```
# npm install
# npm run build
```

alternatively via the Makefile targets:

```
# make setup all
```

Build docker image
---

```
# make docker_build
```

Run docker image
---

```
# docker run -p 8080:80 -e MDQ_HOST=some.mdq.host -e MDQ_PORT=9999 -e PYFF_APIS=true mdq-browser:1.0.0
```

In addition to letting you navigate the MDQ server the contents is proxied on localhost:8080 for convenience. When the PYFF_APIS environment variable is set additional functions are available.

Configuration
---

The app looks for /config.json with the following entries:
```json
{
   "mdq_url": "<URL to the /entities context of the MDQ server>",
   "mdq_servername": "Some user-friendly name",
   "pyff_apis": true|false
}
```

The docker image entrypoint generates this file from environment variables (cf above).
