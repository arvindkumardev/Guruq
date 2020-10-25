import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useQuery } from '@apollo/client';
import NavigationRouteNames from './ScreenNames';
import onboarding from '../containers/common/onboarding/index';
import login from '../containers/common/login/login';
import otpVerification from '../containers/common/login/otpVerification';
import setPassword from '../containers/common/login/setPassword';
import register from '../containers/common/login/register';
import enterPassword from '../containers/common/login/enterPassword';
import studentDashboardContainer from '../containers/student/dashboard/studentDashboardContainer';
import studentTutorSelector from '../containers/common/userOnboarding/studentTutorSelector';
import { ME_QUERY } from '../containers/common/graphql-query';
import splashScreen from '../containers/common/splashScreen/splashScreen';

const Stack = createStackNavigator();

const AuthRoutes = (props) => {
  // const { loading, error, data } = useQuery(ME_QUERY);

  const { state } = props;

  useEffect(() => {
    console.log('state: ', state);
  }, [state]);

  return (
    <Stack.Navigator>
      {state.isLoading && (
        <Stack.Screen
          name={NavigationRouteNames.SPLASH_SCREEN}
          component={splashScreen}
          options={{ headerShown: false }}
        />
      )}
      {state.isSignout ? (
        <>
          <Stack.Screen
            name={NavigationRouteNames.ON_BOARDING}
            component={onboarding}
            options={{ headerShown: false }}
          />
          <Stack.Screen name={NavigationRouteNames.LOGIN} component={login} options={{ headerShown: false }} />
          <Stack.Screen
            name={NavigationRouteNames.ENTER_PASSWORD}
            component={enterPassword}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name={NavigationRouteNames.OTP_VERIFICATION}
            component={otpVerification}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NavigationRouteNames.SET_PASSWORD}
            component={setPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen name={NavigationRouteNames.REGISTER} component={register} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen
            name={NavigationRouteNames.STUDENT.DASHBOARD}
            component={studentDashboardContainer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={NavigationRouteNames.STUDENT.ON_BOARDING}
            component={studentTutorSelector}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
export default AuthRoutes;
