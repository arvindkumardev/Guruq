import React, { useEffect, useRef } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import GlobalFont from 'react-native-global-font';
import apolloClient from './apollo/apollo';
import AppStack from './routes/AppRoutes';
import { getToken, removeData, storeData } from './utils/helpers';
import { AuthContext } from './common/context';
import { LOCAL_STORAGE_DATA_KEY } from './utils/constants';

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

    GlobalFont.applyGlobal('SegoeUI');

    // getUserToken();
  }, []);

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isSignout: action.isSignout,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
        default:
          return {
            isLoading: true,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: true,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await getToken();
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps
      // CALL BACKEND AND VALIDATE TOKEN

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken, isSignout: false });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        await removeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN);
        await storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, data.token);
        await storeData(LOCAL_STORAGE_DATA_KEY.FIRST_NAME, data.firstName);
        await storeData(LOCAL_STORAGE_DATA_KEY.LAST_NAME, data.lastName);

        dispatch({ type: 'SIGN_IN', token: data.token });
      },
      signOut: async () => {
        await removeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN);
        await removeData(LOCAL_STORAGE_DATA_KEY.FIRST_NAME);
        await removeData(LOCAL_STORAGE_DATA_KEY.LAST_NAME);

        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        await removeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN);
        await storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, data.token);
        await storeData(LOCAL_STORAGE_DATA_KEY.FIRST_NAME, data.firstName);
        await storeData(LOCAL_STORAGE_DATA_KEY.LAST_NAME, data.lastName);

        dispatch({ type: 'SIGN_IN', token: data.token });
      },
    }),
    []
  );

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

        <AuthContext.Provider value={authContext}>
          <AppStack state={state} />
        </AuthContext.Provider>
      </NavigationContainer>
    </ApolloProvider>
  );
}

export default App;
