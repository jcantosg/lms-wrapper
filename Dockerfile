#checkov:skip=CKV_DOCKER_2: Not aligned with security posture

##############
# Base Image #
##############
FROM public.ecr.aws/docker/library/node:20.14.0-alpine AS base
LABEL maintainer "Miguel Ángel Tomé Villas <ma.tome@qualoom.es>"

RUN apk upgrade --no-cache

WORKDIR /universae360

#####################
# Development build #
#####################
FROM base AS build-dev
LABEL maintainer "Miguel Ángel Tomé Villas <ma.tome@qualoom.es>"

COPY package*.json ./
RUN npm ci \
    && npm rebuild bcrypt

COPY . .
RUN npm run build

####################
# Production build #
####################
FROM build-dev AS build-pro
LABEL maintainer "Miguel Ángel Tomé Villas <ma.tome@qualoom.es>"

ENV NODE_ENV production

# Trim dev dependencies
COPY package*.json ./
RUN npm ci --production --ignore-scripts \
    && npm prune \
    && npm cache clean --force \
    && npm rebuild bcrypt

##############
# Cron Image #
##############
FROM base AS cron
LABEL maintainer "Miguel Ángel Tomé Villas <ma.tome@qualoom.es>"

ENV NODE_ENV production

RUN apk add --no-cache make postgresql16-client aws-cli

# Import dev dependencies, required for NPM tasks
COPY --chown=node:node --from=build-dev /universae360/node_modules ./node_modules

# Copy artifacts
COPY . .
COPY docker/cron/crontab /var/spool/cron/crontabs/root
COPY docker/cron/entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "/usr/sbin/crond", "-f", "-d", "6" ]

#############
# API Image #
#############
FROM base AS api
LABEL maintainer "Miguel Ángel Tomé Villas <ma.tome@qualoom.es>"

ENV NODE_ENV production

WORKDIR /universae360

# Import modules and artifacts from production build image
COPY --chown=node:node --from=build-pro /universae360/node_modules ./node_modules
COPY --chown=node:node --from=build-pro /universae360/dist .

USER node

EXPOSE 3000

CMD [ "node", "src/main.js" ]

#######################
# Load Balancer Image #
#######################
FROM public.ecr.aws/nginx/nginx:1.26.1 AS load-balancer
LABEL maintainer "Miguel Ángel Tomé Villas <ma.tome@qualoom.es>"

ENV DNS_RESOLVER="auto"
ENV CERT_CN="local.universae.com"
ENV REMOTE_URL_API="http://api:3000"

# Install available patches and package dependencies
RUN apt-get update -qq \
    && apt-get upgrade -y -qq \
    && apt-get install openssl -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Deploy configuration templates
RUN mkdir /template && mkdir /ssl
COPY docker/load-balancer/cert.conf /template/cert.conf
COPY docker/load-balancer/templates /etc/nginx/templates

# Custom Entrypoint
COPY docker/load-balancer/entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]