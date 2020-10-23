import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { LoggingLink } from 'apollo-logger';
import apolloLogger from 'apollo-link-logger';
import { setContext } from 'apollo-link-context';
import { getToken } from '../utils/helpers';

const logOptions = { logger: console.log };

const GRAPHQL_ENDPOINT = 'http://13.229.107.165:5000/graphql';

// const apolloClient = () => {
//   console.log(token);
//   const link = ApolloLink.from([
//     apolloLogger,
//     new LoggingLink(logOptions),
//     new HttpLink({
//       uri: GRAPHQL_ENDPOINT,
//       headers: {
//         // access_token: '<ENVIRONMENT_SPECIFIC_DELIVERY_TOKEN>',
//         Authorization: token ? `Bearer ${token}` : '',
//       },
//     }),
//   ]);
//
//   return new ApolloClient({
//     link: from([link]),
//     cache: new InMemoryCache(),
//   });
// };

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

const link = authLink.concat(httpLink);

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
    cache: new InMemoryCache(),
  });

export default apolloClient;
