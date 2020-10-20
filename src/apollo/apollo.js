import {
  ApolloClient,
  InMemoryCache,
  from,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { LoggingLink, wrapPubSub, formatResponse } from 'apollo-logger';
import apolloLogger from 'apollo-link-logger';

const logOptions = { logger: console.log };

const GRAPHQL_ENDPOINT = 'http://13.229.107.165:5000/graphql';

const apolloClient = () => {
  const link = ApolloLink.from([
    apolloLogger,
    new LoggingLink(logOptions),
    new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      // headers: {
      // access_token: '<ENVIRONMENT_SPECIFIC_DELIVERY_TOKEN>',
      // Authorization:
      //   'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZU5hbWUiOiJBRE1JTiIsImlhdCI6MTYwMjE1NjYyNiwiZXhwIjoxNjAzOTU2NjI2fQ.snXx5A9Feg0k7FkIMkHtUC4rsGvaeOliT9dYl0CHtEY',
      // },
    }),
  ]);

  return new ApolloClient({
    link: from([link]),
    cache: new InMemoryCache(),
  });
};
export default apolloClient;
