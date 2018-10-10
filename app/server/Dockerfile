FROM node:10-alpine

ENV PORT 8888

EXPOSE 8888

RUN mkdir -p /usr/bin/server
WORKDIR /usr/bin/server

COPY package.json /usr/bin/server/
COPY .babelrc /usr/bin/server/
COPY src /usr/bin/server/

VOLUME /usr/bin/server/src/

RUN yarn

CMD ["yarn", "dev"]
