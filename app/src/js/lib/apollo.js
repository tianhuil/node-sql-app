import ApolloClient from "apollo-boost";

export function newClient() {
  const API_HOST = process.env.API_HOST,
        API_PORT = process.env.API_PORT

  return new ApolloClient({
    uri: `http://localhost:9000/graphql`
  });
}
