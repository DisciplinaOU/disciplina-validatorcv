import { ApolloClient, InMemoryCache } from '@apollo/client';

export const GraphQLClient = new ApolloClient({
  uri: '/thegraph',
  cache: new InMemoryCache()
});