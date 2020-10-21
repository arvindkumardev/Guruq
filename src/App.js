import React, { useEffect, useRef } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import apolloClient from './apollo/apollo';
import AppStack from './routes/AppRoutes';

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

  useEffect(() => {
    const state = navigationRef.current.getRootState();
    if (state) {
      routeNameRef.current = getActiveRouteName(state);
    }
  }, []);

  useEffect(() => {
    SplashScreen.hide();
  });

  const onStateChangeHandle = (state) => {
    const currentRouteName = getActiveRouteName(state);
    routeNameRef.current = currentRouteName;
  };

  return (
    <ApolloProvider client={client}>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={onStateChangeHandle}
      >
        <StatusBar barStyle="dark-content" />
        <AppStack />
      </NavigationContainer>
    </ApolloProvider>
  );
}

export default App;
