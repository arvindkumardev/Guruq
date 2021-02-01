import { Alert, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Icon, Input, Item, Label } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useReactiveVar } from '@apollo/client';
import { RFValue } from 'react-native-responsive-fontsize';
import { isEmpty } from 'lodash';
import commonStyles from '../../../theme/styles';
import styles from './styles';
import { RfH, RfW, storeData } from '../../../utils/helpers';
import NavigationRouteNames from '../../../routes/screenNames';
import { INVALID_INPUT, NOT_FOUND } from '../../../common/errorCodes';
import { FORGOT_PASSWORD_MUTATION, SIGNIN_MUTATION } from '../graphql-mutation';
import {isLoggedIn, userDetails, userToken, userType} from '../../../apollo/cache';
import { LOCAL_STORAGE_DATA_KEY, STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import MainContainer from './components/mainContainer';
import LoginCheck from './loginCheck';

function EnterPassword(props) {
  const { route } = props;
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const isUserLoggedIn = useReactiveVar(isLoggedIn);
  const { mobileObj } = route.params;

  // const [loggedIn, setLoggedIn] = useState(false);

  const [signIn, { loading: signInLoading }] = useMutation(SIGNIN_MUTATION, {
    fetchPolicy: 'no-cache',
    variables: { countryCode: mobileObj.country.dialCode, number: mobileObj.mobile, password },

    onError: (e) => {
      if (e && e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
        if (error.errorCode === INVALID_INPUT) {
          Alert.alert('Incorrect password');
        } else if (error.errorCode === NOT_FOUND) {
          navigation.navigate(NavigationRouteNames.OTP_VERIFICATION, { mobileObj, newUser: true });
        }
      }
    },
    onCompleted: (data) => {
      if (data && data.signIn) {
        storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, data.signIn.token).then(() => {
          isLoggedIn(true);
          userToken(data.signIn.token);
          // userDetails(data.me);
          // userType(data.me.type);
          console.log(true);
        });
      }
    },
  });

  const [forgotPassword, { loading: forgotPasswordLoading }] = useMutation(FORGOT_PASSWORD_MUTATION, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
        console.log(error);
      }
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
        navigation.navigate(NavigationRouteNames.OTP_VERIFICATION, { mobileObj, newUser: false });
      }
    },
  });

  const onBackPress = () => {
    navigation.goBack();
  };

  const onForgotPasswordClick = () => {
    if (mobileObj.mobile) {
      const countryCode = mobileObj.country.dialCode;
      const number = mobileObj.mobile;
      forgotPassword({
        variables: { countryCode, number },
      });
    } else {
      Alert.alert('Please enter mobile number.');
    }
  };

  return (
    <MainContainer isLoading={signInLoading || forgotPasswordLoading} onBackPress={onBackPress}>
      {isUserLoggedIn && <LoginCheck />}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.contentMarginTop}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>Enter password to login to your account.</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.bottomCard}>
        <View>
          <Item floatingLabel>
            <Label style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>Password</Label>
            <Input secureTextEntry={hidePassword} onChangeText={(text) => setPassword(text)} />
            {!isEmpty(password) && (
              <Icon
                type="Entypo"
                name={hidePassword ? 'eye' : 'eye-with-line'}
                onPress={() => setHidePassword(!hidePassword)}
                style={styles.eyeIcon}
              />
            )}
          </Item>
          <TouchableOpacity onPress={onForgotPasswordClick} style={{ alignSelf: 'flex-end' }}>
            <Text style={styles.forgotPassword}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={signIn}
          style={[
            password ? commonStyles.buttonPrimary : commonStyles.disableButton,
            {
              marginTop: RfH(48),
              alignSelf: 'center',
              width: RfW(144),
            },
          ]}>
          <Text style={commonStyles.textButtonPrimary}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </MainContainer>
  );
}

export default EnterPassword;
