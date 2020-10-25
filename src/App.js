import React, { useEffect, useRef, useState } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import GlobalFont from 'react-native-global-font';
import { createStackNavigator } from '@react-navigation/stack';
import apolloClient from './apollo/apollo';
import AppStack from './routes/AppRoutes';
import StudentAppStack from './routes/StudentAppRoutes';
import { getToken } from './utils/helpers';
import NavigationRouteNames from './routes/ScreenNames';

const getActiveRouteName = (state) => {
  const route = state.routes[state.index];
  if (route.state) {
    return getActiveRouteName(route.state);
  }
  return route.name;
};

const Stack = createStackNavigator();
function App() {
  const routeNameRef = useRef();
  const navigationRef = useRef();
  const client = apolloClient();

  const [token, setToken] = useState();

  const getUserToken = async () => {
    const t = await getToken();
    setToken(t);
  };
  useEffect(() => {
    const state = navigationRef.current.getRootState();
    if (state) {
      routeNameRef.current = getActiveRouteName(state);
    }

    GlobalFont.applyGlobal('SegoeUI');

    // getUserToken();
  }, []);

  // const getAppStack = () => {
  //   return (
  //     <Stack.Navigator>
  //       <Stack.Screen name={NavigationRouteNames.SPLASH_SCREEN} component={AppStack} />
  //       {token && <Stack.Screen name="student-dashboard" component={StudentAppStack} />}
  //     </Stack.Navigator>
  //   );
  // };

  useEffect(() => {
    SplashScreen.hide();
  });

  const onStateChangeHandle = async (state) => {
    const currentRouteName = getActiveRouteName(state);
    routeNameRef.current = currentRouteName;
  };

  return (
    <ApolloProvider client={client}>
      <NavigationContainer ref={navigationRef} onStateChange={onStateChangeHandle}>
        <StatusBar barStyle="light-content" />

        <AppStack />

      </NavigationContainer>
    </ApolloProvider>
  );
}

export default App;
