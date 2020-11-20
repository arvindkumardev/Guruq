import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

import { setContext } from '@apollo/client/link/context';

import apolloLogger from 'apollo-link-logger';
import { getToken } from '../utils/helpers';

const GRAPHQL_ENDPOINT = 'http://10.0.0.8:5000/graphql';
// const GRAPHQL_ENDPOINT = 'http://13.229.107.165:5000/graphql';

let apolloClient = null;

const httpLink = createHttpLink({ uri: GRAPHQL_ENDPOINT, credentials: 'same-origin' });
const authLink = setContext(async (req, { headers }) => {
  const token = await getToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});
const link = authLink.concat(httpLink);

const cache = new InMemoryCache();

function createApolloClient() {
  return new ApolloClient({
    link: authLink.concat(apolloLogger).concat(link),
    cache,
  });
}

export default function initializeApollo() {
  // eslint-disable-next-line no-underscore-dangle
  const _apolloClient = apolloClient || createApolloClient();

  // Create the Apollo Client once in the client
  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}
