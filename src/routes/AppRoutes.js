import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import NavigationRouteNames from './ScreenNames';
import onboarding from '../containers/onboarding/index';
import login from '../containers/login/login';
import otpVerification from '../containers/login/otpVerification';


const Stack = createStackNavigator();

const AppStack = () => {

    return (
            <>
                <Stack.Navigator>
                    <Stack.Screen
                        name={NavigationRouteNames.ONBOARDING}
                        component={onboarding}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name={NavigationRouteNames.LOGIN}
                        component={login}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name={NavigationRouteNames.OTP_VERIFICATION}
                        component={otpVerification}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </>
    );
};
export default AppStack;
