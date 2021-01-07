import React, { useEffect, useRef } from 'react';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';
import SplashScreen from 'react-native-splash-screen';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import GlobalFont from 'react-native-global-font';
import { Root } from 'native-base';
import { getToken } from './utils/helpers';
import { isLoggedIn, isSplashScreenVisible, isTokenLoading, userType } from './apollo/cache';
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
  const showSplashScreen = useReactiveVar(isSplashScreenVisible);
  // const userInfo = useReactiveVar(userDetails);
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
    }
  };

  useEffect(() => {
    // clearAllLocalStorage();
    // Fetch the token from storage then navigate to our appropriate place
    bootstrapAsync();

    // FIXME: TO CLEAR CACHE - TEMP CODE ONLY TO BE USED IN DEV MODE
    // const client = initializeApollo();
    // clearAllLocalStorage().then(() => {
    //   client.resetStore().then(() => {
    //     removeToken().then(() => {
    //       // // set in apollo cache
    //       isTokenLoading(true);
    //       isLoggedIn(false);
    //       isSplashScreenVisible(true);
    //       userType('');
    //       networkConnectivityError(false);
    //       userDetails({});
    //       studentDetails({});
    //       tutorDetails({});
    //       userLocation({});
    //       offeringsMasterData([]);
    //       interestingOfferingData([]);
    //       notificationPayload({});
    //     });
    //   });
    // });
  }, []);

  const onStateChangeHandle = async (state) => {
    routeNameRef.current = getActiveRouteName(state);
    console.log('getActiveRouteName(state)', getActiveRouteName(state));
  };

  return (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <NavigationContainer ref={navigationRef} onStateChange={onStateChangeHandle}>
          <StatusBar barStyle="light-content" />
          <Root>
            <AppStack
              isUserLoggedIn={isUserLoggedIn}
              isUserTokenLoading={isUserTokenLoading}
              userType={userTypeVal}
              showSplashScreen={showSplashScreen}
              // isNetworkConnectivityError={isNetworkConnectivityError}
            />
          </Root>
        </NavigationContainer>
      </ApolloHooksProvider>
    </ApolloProvider>
  );
}

export default App;
