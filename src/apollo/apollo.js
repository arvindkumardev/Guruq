import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { LoggingLink } from 'apollo-logger';
import apolloLogger from 'apollo-link-logger';
import { setContext } from 'apollo-link-context';
import { getToken } from '../utils/helpers';

const logOptions = { logger: console.log };

const GRAPHQL_ENDPOINT = 'http://127.0.0.1:5000/graphql';
// const GRAPHQL_ENDPOINT = 'http://13.229.107.165:5000/graphql';

const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT });
const authLink = setContext(async (req, { headers }) => {
  const token = await getToken();

  return {
    ...headers,
    headers: {
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

// const logoutLink = onError(({ networkError }) => {
//   console.log(networkError);
//
//   // if (networkError.statusCode === 401) {
//   //   isLoggedIn(false);
//   //   userDetails({});
//   // }
//   if (networkError) {
//     networkConnectivityError(true);
//   }
// });

const link = authLink.concat(httpLink);

const cache = new InMemoryCache();

const apolloClient = () =>
  new ApolloClient({
    link: ApolloLink.from([
      apolloLogger,
      new LoggingLink(logOptions),
      link,
      // new HttpLink({
      //   uri: GRAPHQL_ENDPOINT,
      //   headers: {
      //     // access_token: '<ENVIRONMENT_SPECIFIC_DELIVERY_TOKEN>',
      //     Authorization: token ? `Bearer ${token}` : '',
      //   },
      // }),
    ]),
    cache,
  });

export default apolloClient;
