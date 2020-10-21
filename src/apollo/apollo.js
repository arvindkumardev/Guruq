import {
  ApolloClient,
  InMemoryCache,
  from,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { LoggingLink, wrapPubSub, formatResponse } from 'apollo-logger';
import apolloLogger from 'apollo-link-logger';
import { LOCAL_STORAGE_DATA_KEY } from '../utils/constants';
import { getSaveData } from '../utils/helpers';
import AsyncStorage from '@react-native-community/async-storage';

const logOptions = { logger: console.log };

const GRAPHQL_ENDPOINT = 'http://13.229.107.165:5000/graphql';

const getToken = async () => {
  const token = await AsyncStorage.getItem(LOCAL_STORAGE_DATA_KEY.USER_TOKEN)
  return token
}

const token = getToken();

/*const apolloClient = () => {
  console.log(token);
  var link = ApolloLink.from([
      apolloLogger,
      new LoggingLink(logOptions),
      new HttpLink({
        uri: GRAPHQL_ENDPOINT,
         headers: {
         //access_token: '<ENVIRONMENT_SPECIFIC_DELIVERY_TOKEN>',
         Authorization: token ? `Bearer ${token}` : "",
        },
      }),
    ]);

  return new ApolloClient({
    link: from([link]),
    cache: new InMemoryCache(),
  });
};*/


var link = ApolloLink.from([
  apolloLogger,
  new LoggingLink(logOptions),
  new HttpLink({
    uri: GRAPHQL_ENDPOINT,
     //headers: {
     //access_token: '<ENVIRONMENT_SPECIFIC_DELIVERY_TOKEN>',
     //Authorization: token ? `Bearer ${token}` : "",
    //},
  }),
]);

const authLink = new ApolloLink((operation, forward) => {
  AsyncStorage.getItem(LOCAL_STORAGE_DATA_KEY.USER_TOKEN).then(token => {
    console.log(token);
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    })
  })
  return forward(operation)
})
/*const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(link),
})*/

const apolloClient = () =>{
  return(
    new ApolloClient({
      cache: new InMemoryCache(),
      link: authLink.concat(link),
    })
  )
}
export default apolloClient;
