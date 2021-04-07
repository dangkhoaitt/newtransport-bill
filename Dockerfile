
FROM node:12-alpine as BUILD_IMAGE

RUN apk --no-cache add pkgconfig autoconf automake libtool nasm build-base zlib-dev curl

# install node-prune (https://github.com/tj/node-prune)
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /home/ubuntu/newtransport-bill

COPY package*.json ./

COPY yarn.lock ./

COPY . .

RUN yarn

RUN yarn run build

# remove development dependencies
RUN npm prune --production

# run node prune
RUN /usr/local/bin/node-prune

FROM node:12-alpine

# Create a group and user
RUN addgroup -S ubuntu && adduser -S ubuntu -G ubuntu

WORKDIR /home/ubuntu/newtransport-bill

# copy from build image
COPY --chown=ubuntu:ubuntu --from=BUILD_IMAGE /home/ubuntu/newtransport-bill/dist ./dist
COPY --chown=ubuntu:ubuntu --from=BUILD_IMAGE /home/ubuntu/newtransport-bill/node_modules ./node_modules 

EXPOSE 7003

CMD [ "node", "./dist/server.js" ]

