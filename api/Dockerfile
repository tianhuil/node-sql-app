FROM mhart/alpine-node:9.8.0

RUN npm install -g postgraphile@4.0.0-beta.5
ARG API_WORKDIR
WORKDIR $API_WORKDIR

# Cache installation before
COPY start.sh .

CMD [ "sh", "start.sh" ]
