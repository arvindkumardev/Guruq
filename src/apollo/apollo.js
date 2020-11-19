import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { LoggingLink } from 'apollo-logger';
import apolloLogger from 'apollo-link-logger';
import { setContext } from 'apollo-link-context';
import { getToken } from '../utils/helpers';

const logOptions = { logger: console.log };

const GRAPHQL_ENDPOINT = 'http://10.0.0.10:5000/graphql';
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

function createApolloClient(fetchOptions = {}) {
  return new ApolloClient({
    link: authLink.concat(apolloLogger).concat(new LoggingLink(logOptions)).concat(link),
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
