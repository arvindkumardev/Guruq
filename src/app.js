import React, { useEffect, useRef } from 'react';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import GlobalFont from 'react-native-global-font';

import { getToken } from './utils/helpers';
import {isLoggedIn, isTokenLoading, userDetails, userType} from './apollo/cache';
import AppStack from './routes/appRoutes';
import initializeApollo from './apollo/apollo';

const getActiveRouteName = (state) => {
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRouteName(route.state);
  }
  return route.name;
};

function App() {
  const routeNameRef = useRef();
  const navigationRef = useRef();
  const client = initializeApollo();

  const isUserLoggedIn = useReactiveVar(isLoggedIn);
  const isUserTokenLoading = useReactiveVar(isTokenLoading);
  const userInfo = useReactiveVar(userDetails);
  const userTypeVal = useReactiveVar(userType);
  // const isNetworkConnectivityError = useReactiveVar(networkConnectivityError);

  // const netInfo = useNetInfo({
  //   reachabilityUrl: 'http://localhost:5000',
  //   reachabilityTest: async (response) => response.status === 204,
  //   reachabilityLongTimeout: 60 * 1000, // 60s
  //   reachabilityShortTimeout: 5 * 1000, // 5s
  //   reachabilityRequestTimeout: 15 * 1000, // 15s
  // });
  //
  // // Subscribe
  // const unsubscribe = NetInfo.addEventListener((state) => {
  //   console.log('Connection type', state.type);
  //   console.log('Is connected?', state.isConnected);
  //   console.log('State: ', state);
  //
  //   networkConnectivityError(!state.isConnected);
  // });

  useEffect(() => {
    const state = navigationRef.current.getRootState();
    if (state) {
      routeNameRef.current = getActiveRouteName(state);
    }

    GlobalFont.applyGlobal('SegoeUI');
  }, []);

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await getToken();

        console.log('userToken', userToken);

        if (userToken) {
          console.log('I am here...');

          isLoggedIn(true);
        }
      } catch (e) {
        // Restoring token failed
        isLoggedIn(false);
      } finally {
        SplashScreen.hide();
        // isTokenLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const onStateChangeHandle = async (state) => {
    const currentRouteName = getActiveRouteName(state);
    routeNameRef.current = currentRouteName;
  };

  return (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <NavigationContainer ref={navigationRef} onStateChange={onStateChangeHandle}>
          <StatusBar barStyle="dark-content" />
          <AppStack
            isUserLoggedIn={isUserLoggedIn}
            isUserTokenLoading={isUserTokenLoading}
            userType={userTypeVal}
            // isNetworkConnectivityError={isNetworkConnectivityError}
          />
        </NavigationContainer>
      </ApolloHooksProvider>
    </ApolloProvider>
  );
}

export default App;
