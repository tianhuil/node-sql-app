FROM mhart/alpine-node:9.8.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY index.js ./

EXPOSE 80

CMD [ "npm", "start" ]
