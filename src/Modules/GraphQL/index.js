import { ApolloClient, InMemoryCache } from '@apollo/client';

const baseUrl = process.env.NODE_ENV === "development"
  ? "/thegraph" :
  process.env.SUBGRAPH_API_URL;

console.log(baseUrl);
export const GraphQLClient = new ApolloClient({
  uri: baseUrl,
  cache: new InMemoryCache()
});