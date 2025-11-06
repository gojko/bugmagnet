FROM node:22-bookworm-slim
RUN apt-get update && \
    apt-get install -y firefox-esr chromium && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
RUN npm config set prefix '~/.local/'
ENV PATH=/builder/.local/bin/:$PATH
ENV NODE_OPTIONS="--experimental-vm-modules"
ENV PUPPETEER_ARGS "--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage"
RUN npm config set fund false
ENTRYPOINT /bin/bash

