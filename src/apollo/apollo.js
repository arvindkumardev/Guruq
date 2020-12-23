import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import apolloLogger from 'apollo-link-logger';
import { onError } from '@apollo/client/link/error';
import { getToken } from '../utils/helpers';

// const GRAPHQL_ENDPOINT = 'http://10.0.0.7:5000/graphql';
const GRAPHQL_ENDPOINT = 'http://apiv2.guruq.in/graphql';

let apolloClient = null;

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});
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
const link = ApolloLink.from([errorLink, authLink, httpLink]);

const wsLink = new WebSocketLink({
  uri: GRAPHQL_ENDPOINT.replace('http', 'ws'),
  options: {
    reconnect: true,
    connectionParams: async () => {
      return {
        authToken: await getToken(),
      };
    },
  },
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  link
);

const cache = new InMemoryCache();

function createApolloClient() {
  return new ApolloClient({
    link: apolloLogger.concat(splitLink),
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
