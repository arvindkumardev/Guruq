import {ApolloClient, InMemoryCache, from, HttpLink} from '@apollo/client';

const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql';

const apolloClient = () => {
  const link = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    headers: {
      // access_token: '<ENVIRONMENT_SPECIFIC_DELIVERY_TOKEN>',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZU5hbWUiOiJBRE1JTiIsImlhdCI6MTYwMjE1NjYyNiwiZXhwIjoxNjAzOTU2NjI2fQ.snXx5A9Feg0k7FkIMkHtUC4rsGvaeOliT9dYl0CHtEY',
    },
  });

  return new ApolloClient({
    link: from([link]),
    cache: new InMemoryCache(),
  });
};
export default apolloClient;
