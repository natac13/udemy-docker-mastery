FROM node:12.2.0-alpine as base

LABEL org.opencontainers.image.authors="sean.campbell13@gmail.com"
LABEL org.opencontainers.image.title="Docker Network Understanding."
LABEL org.opencontainers.image.licenses=MIT
LABEL com.natac.nodeversion=$NODE_VERSION

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

RUN mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app

COPY --chown=node:node package*.json ./

# Add Tini
RUN apk add --no-cache tini curl
# Tini is now available at /sbin/tini

RUN npm config list \
  && npm ci \
  && npm cache clean --force

ENTRYPOINT ["/sbin/tini", "--"]


# Development Stage
FROM base as dev

#  Add curl

ENV NODE_ENV=develoment

ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app

RUN npm install --only=development

USER node

CMD ["nodemon", "./index.js"]
# "--inspect=0.0.0.0:9229",
# Interrmediate Stage to copy code into the image

# Testing Stage
FROM dev as test

USER root

WORKDIR /app

# Will not include node_modules as it appear in the .dockerignore file
COPY --chown=node:node . /app

ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH

# this copies all dependencies (prod+dev)
COPY --from=dev /app/node_modules /app/node_modules

RUN npm audit

FROM test as cleanup

RUN rm -rf /app/node_modules

# Final Stage - Production grade Image
FROM base as prod

ENV NODE_ENV=production
WORKDIR /app
# Will not copy the node_modules from cleanup as it was deleted.
# However, the base image(which includes prod node_modules) will be merged with
# this prod image as to have the nesseccary packages. 
COPY --chown=node:node --from=cleanup /app /app

# HEALTHCHECK --interval=3m --timeout=30s --start-period=5s --retries=3 CMD [ "curl", "-f", "http://127.0.0.1", "||", "exit 1" ]

USER node

CMD ["node", "index.js"]