import React, { useEffect, useRef } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import GlobalFont from 'react-native-global-font';
import { useReactiveVar } from '@apollo/client';
import apolloClient from './apollo/apollo';
import AppStack from './routes/AppRoutes';
import { getToken } from './utils/helpers';
import { isLoggedIn, isTokenLoading } from './apollo/cache';

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
  const client = apolloClient();

  const isUserLoggedIn = useReactiveVar(isLoggedIn);
  const isUserTokenLoading = useReactiveVar(isTokenLoading);

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
      <NavigationContainer ref={navigationRef} onStateChange={onStateChangeHandle}>
        <StatusBar barStyle="light-content" />

        <AppStack isUserLoggedIn={isUserLoggedIn} isUserTokenLoading={isUserTokenLoading} />
      </NavigationContainer>
    </ApolloProvider>
  );
}

export default App;
