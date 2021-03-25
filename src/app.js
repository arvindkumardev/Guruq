import React, { useEffect, useRef, useState } from 'react';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';
import SplashScreen from 'react-native-splash-screen';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, Linking } from 'react-native';
import GlobalFont from 'react-native-global-font';
import { Root } from 'native-base';
import DeepLinking from 'react-native-deep-linking';
import { getToken } from './utils/helpers';
import { appMetaData, isLoggedIn, isSplashScreenVisible, isTokenLoading, userToken, userType } from './apollo/cache';
import AppStack from './routes/appRoutes';
import initializeApollo from './apollo/apollo';
import { APP_BUILD_VERSION, urlConfig } from './utils/constants';

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
  const userTypeVal = useReactiveVar(userType);
  const [isForceUpdate, setIsForceUpdate] = useState(false);

  useEffect(() => {
    const state = navigationRef.current.getRootState();
    if (state) {
      routeNameRef.current = getActiveRouteName(state);
    }
    GlobalFont.applyGlobal('SegoeUI');
  }, []);

  const bootstrapAsync = async () => {
    let jwtToken;
    try {
      jwtToken = await getToken();
      if (jwtToken) {
        isLoggedIn(true);
        // set token in cache
        userToken(jwtToken);
      }
    } catch (e) {
      // Restoring token failed
      isLoggedIn(false);
      userToken('');
    } finally {
      SplashScreen.hide();
      crashlytics().log('App mounted.');
    }
  };

  const handleUrl = ({ url }) => {
    console.log('DeepLinking.handleUrl', url);
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  };

  useEffect(() => {
    DeepLinking.addScheme('guruq://');
    DeepLinking.addScheme('https://');
    Linking.addEventListener('url', handleUrl);

    DeepLinking.addRoute('/abc', (response) => {
      // example://test
      console.log(response);
    });

    DeepLinking.addRoute('/test', (response) => {
      // example://test
      console.log(response);
    });

    DeepLinking.addRoute('/test/:id', (response) => {
      // example://test/23
      console.log(response);
    });

    DeepLinking.addRoute('/test/:id/details', (response) => {
      // example://test/100/details
      console.log(response);
    });

    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));

    return () => Linking.removeEventListener('url', handleUrl);
  }, []);

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

  const getAppMetaData = async () => {
    const res = await fetch(`${urlConfig.DASHBOARD_URL}/app-version.json?${new Date().getTime()}`, {
      method: 'GET',
    }).then((response) => response.json());
    const appData = res[Platform.OS.toLowerCase()];
    appMetaData(appData);
    if (appData.isUnderMaintenance) {
      setIsForceUpdate(true);
    } else if (appData.buildNumber > APP_BUILD_VERSION && appData.isForceUpdate) {
      setIsForceUpdate(true);
    }
  };

  useEffect(() => {
    console.log('APP_BUILD_VERSION', APP_BUILD_VERSION);
    getAppMetaData();
  }, []);

  const onStateChangeHandle = async (state) => {
    routeNameRef.current = getActiveRouteName(state);
    const previousRouteName = routeNameRef.current;
    const currentRouteName = getActiveRouteName(state);
    await analytics().logScreenView({
      screen_name: currentRouteName,
      screen_class: currentRouteName,
    });
    console.log('getActiveRouteName(state)', getActiveRouteName(state));
  };

  return (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <NavigationContainer ref={navigationRef} onStateChange={onStateChangeHandle}>
          <StatusBar barStyle="dark-content" />
          <Root>
            <AppStack
              isUserLoggedIn={isUserLoggedIn}
              isUserTokenLoading={isUserTokenLoading}
              userType={userTypeVal}
              showSplashScreen={showSplashScreen}
              isForceUpdate={isForceUpdate}
              // isNetworkConnectivityError={isNetworkConnectivityError}
            />
          </Root>
        </NavigationContainer>
      </ApolloHooksProvider>
    </ApolloProvider>
  );
}

export default App;
