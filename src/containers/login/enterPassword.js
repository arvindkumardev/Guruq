import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Icon, Input, Item, Label } from 'native-base';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import commonStyles from '../../common/styles';
import Colors from '../../theme/colors';
import styles from './styles';
import { removeData, RfH, RfW, storeData } from '../../utils/helpers';
import { IND_COUNTRY_OBJ, LOCAL_STORAGE_DATA_KEY } from '../../utils/constants';
import { CustomMobileNumber } from '../../components';
import routeNames from '../../routes/ScreenNames';
import Loader from '../../components/Loader';
import { CHECK_USER_QUERY } from './graphql-query';
import { INVALID_INPUT, NOT_FOUND } from '../../common/errorCodes';
import { FORGOT_PASSWORD_MUTATION, SIGNIN_MUTATION } from './graphql-mutation';
import MainContainer from './components/mainContainer';

function enterPassword(props) {
  const { route } = props;

  const navigation = useNavigation();
  const [showNext, setShowNext] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showClear, setShowClear] = useState(false);
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [eyeIcon, setEyeIcon] = useState('eye');
  const [showEye, setShowEye] = useState(false);
  const [title, setTitle] = useState('Login/ Sign Up');
  const [subTitle, setSubTitle] = useState('Enter your phone number to continue');

  const [mobileObj, setMobileObj] = useState(route.params.mobileObj);

  const [signIn, { loading: signInLoading }] = useMutation(SIGNIN_MUTATION, {
    fetchPolicy: 'no-cache',
    variables: { countryCode: mobileObj.country.dialCode, number: mobileObj.mobile, password },

    onError: (e) => {
      const error = e.graphQLErrors[0].extensions.exception.response;
      console.log(error);
      if (error.errorCode === INVALID_INPUT) {
        // incorrect username/password
        Alert.alert('Incorrect password');
      } else if (error.errorCode === NOT_FOUND) {
        navigation.navigate(routeNames.OTP_VERIFICATION, { mobileObj, newUser: true });
      }
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
        removeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN);
        storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, data.signIn.token);
        storeData(LOCAL_STORAGE_DATA_KEY.FIRST_NAME, data.signIn.firstName);
        storeData(LOCAL_STORAGE_DATA_KEY.LAST_NAME, data.signIn.lastName);

        if (!data.signIn.isPasswordSet) {
          navigation.navigate(routeNames.SET_PASSWORD);
        } else if (data.signIn.isFirstTime) {
          navigation.navigate(routeNames.USER_ONBOARDING);
        } else {
          navigation.navigate(routeNames.DASHBOARD);
        }
      }
    },
  });

  const [forgotPassword, { loading: forgotPasswordLoading }] = useMutation(FORGOT_PASSWORD_MUTATION, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      const error = e.graphQLErrors[0].extensions.exception.response;
      console.log(error);
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
        navigation.navigate(routeNames.OTP_VERIFICATION, { mobileObj, newUser: false });
      }
    },
  });

  const onBackPress = () => {
    navigation.goBack();
  };

  const onSubmitEditing = () => {
    setShowNext(true);
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

  const onIconPress = () => {
    if (eyeIcon === 'eye') {
      setEyeIcon('eye-with-line');
    } else {
      setEyeIcon('eye');
    }

    if (hidePassword) {
      setHidePassword(false);
    } else {
      setHidePassword(true);
    }
  };

  const onClickContinue = () => {
    signIn();
  };

  const onChangePassword = (text) => {
    setPassword(text);
    if (text) {
      setShowEye(true);
    } else {
      setShowEye(false);
    }
  };

  return (
    <MainContainer isLoading={signInLoading || forgotPasswordLoading} onBackPress={onBackPress}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ marginTop: RfH(36) }}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>Enter password to login to your account.</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.bottomCard}>
        <View>
          <Item floatingLabel style={{}}>
            <Label style={{ fontSize: 16 }}>Password</Label>
            <Input secureTextEntry={hidePassword} onChangeText={(text) => onChangePassword(text)} />
            {showEye && <Icon type="Entypo" name={eyeIcon} onPress={() => onIconPress()} style={styles.eyeIcon} />}
          </Item>
          <TouchableOpacity onPress={() => onForgotPasswordClick()}>
            <Text style={styles.forgotPassword}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
        {/* )} */}
        <TouchableOpacity
          onPress={() => onClickContinue()}
          style={[
            showNext ? commonStyles.buttonPrimary : commonStyles.disableButton,
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

export default enterPassword;
