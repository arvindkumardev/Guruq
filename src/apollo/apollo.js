// import { ApolloClient } from 'apollo-client';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { createHttpLink } from 'apollo-link-http';
// import { LoggingLink } from 'apollo-logger';
import apolloLogger from 'apollo-link-logger';
// import { setContext } from 'apollo-link-context';
// import { getToken } from '../utils/helpers';
//
// const logOptions = { logger: console.log };

// const GRAPHQL_ENDPOINT = 'http://10.0.0.8:5000/graphql';
// // const GRAPHQL_ENDPOINT = 'http://13.229.107.165:5000/graphql';
//
// let apolloClient = null;

// const httpLink = createHttpLink({ uri: GRAPHQL_ENDPOINT, credentials: 'same-origin' });
// const authLink = setContext(async (req, { headers }) => {
//   const token = await getToken();
//
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : null,
//     },
//   };
// });
// const link = authLink.concat(httpLink);

// const cache = new InMemoryCache();

// function createApolloClient(fetchOptions = {}) {
//   return new ApolloClient({
//     link: authLink.concat(apolloLogger).concat(new LoggingLink(logOptions)).concat(link),
//     cache,
//   });
// }
//
// export default function initializeApollo() {
// const _apolloClient = apolloClient || createApolloClient();
//
// if (!apolloClient) {
//   apolloClient = _apolloClient;
// }
//
// return _apolloClient;
// }

import { ApolloClient, HttpLink, ApolloLink, InMemoryCache, from } from '@apollo/client';

import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import AsyncStorage from '@react-native-community/async-storage';
import { LOCAL_STORAGE_DATA_KEY } from '../utils/constants';

// Update the GraphQL endpoint to any instance of GraphQL that you like
const GRAPHQL_ENDPOINT = 'http://10.0.0.8:5000/graphql';
// // const GRAPHQL_ENDPOINT = 'http://13.229.107.165:5000/graphql';

const link = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

let apolloClient = null;

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'same-origin',
});

// cached storage for the user token
let token;
const withToken = setContext(() => {
  console.log(token);
  // if you have a cached value, return it immediately
  if (token) {
    return { token };
  }

  return AsyncStorage.getItem(LOCAL_STORAGE_DATA_KEY.USER_TOKEN).then((userToken) => {
    token = userToken;
    return { token };
  });
});

const resetToken = onError(({ networkError }) => {
  if (networkError && networkError.name === 'ServerError' && networkError.statusCode === 401) {
    // remove cached token on 401 from the server
    token = null;
  }
});

const authFlowLink = withToken.concat(resetToken);

const authMiddleware = new ApolloLink((operation, forward) => {
  console.log('token', token);
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      // authorization: localStorage.getItem('token') || null,
    },
  }));

  return forward(operation);
});

// const activityMiddleware = new ApolloLink((operation, forward) => {
//   // add the recent-activity custom header to the headers
//   operation.setContext(({ headers = {} }) => ({
//     headers: {
//       ...headers,
//       'recent-activity': localStorage.getItem('lastOnlineTime') || null,
//     },
//   }));
//
//   return forward(operation);
// });

function createApolloClient() {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  const isBrowser = typeof window !== 'undefined';

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([
      authMiddleware,
      // activityMiddleware,
      authFlowLink,
      link,
      apolloLogger,
      httpLink,
    ]),
    connectToDevTools: isBrowser,
  });
}

export function initializeApollo() {
  const _apolloClient = apolloClient || createApolloClient();

  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}
