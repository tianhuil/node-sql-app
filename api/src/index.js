import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';

import { setup } from './database'
import schema from './schema'

setup()

// Constants
const PORT = process.env.API_PORT
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send(JSON.stringify({
    msg: "Hello World"
  }));
});

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
if (process.env.NODE_ENV == "development") {
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}

app.listen(PORT, HOST, () => {
  console.log(`Go to http://${HOST}:${PORT}/graphiql to run queries!`);
});
