import React, { useEffect, useRef, useState } from 'react';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';
import SplashScreen from 'react-native-splash-screen';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import GlobalFont from 'react-native-global-font';
import { Root } from 'native-base';
// import TestFairy from 'react-native-testfairy';
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
  // const navigation = useNavigation();
  const userTypeVal = useReactiveVar(userType);
  // const isStudent = userTypeVal === UserTypeEnum.STUDENT.label;

  const isUserLoggedIn = useReactiveVar(isLoggedIn);
  const isUserTokenLoading = useReactiveVar(isTokenLoading);
  const showSplashScreen = useReactiveVar(isSplashScreenVisible);
  const [isForceUpdate, setIsForceUpdate] = useState(false);

  useEffect(() => {
    // TestFairy.begin('SDK-qsAp4Nav');
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
