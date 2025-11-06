FROM ghcr.io/puppeteer/puppeteer:24.29.0
RUN npm config set prefix '~/.local/'
ENV PATH=/builder/.local/bin/:$PATH
ENV NODE_OPTIONS="--experimental-vm-modules"
ENV PUPPETEER_ARGS "--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage"
RUN npm config set fund false
ENTRYPOINT /bin/bash

