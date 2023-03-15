FROM registry.myalgotech.io/algo-node:18.13.0-alpine

WORKDIR /app

RUN npm i -g ionic && \ 
    npm i -g cordova && \ 
    apt-get install -y lftp

COPY .npmrc ./
COPY package.json ./

RUN npm i

COPY . .
RUN npm run translation
ENV NODE_OPTIONS=--max_old_space_size=8192

EXPOSE 8100
CMD ["ionic", "serve", "--", "--host=0.0.0.0", "--disable-host-check"]
