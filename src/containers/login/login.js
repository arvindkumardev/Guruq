import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Icon, Input, Item } from 'native-base';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import commonStyles from '../../common/styles';
import Colors from '../../theme/colors';
import styles from './styles';
import { RfH, RfW, storeData } from '../../utils/helpers';
import { IND_COUNTRY_OBJ, LOCAL_STORAGE_DATA_KEY } from '../../utils/constants';
import { CustomMobileNumber } from '../../components';
import routeNames from '../../routes/ScreenNames';
import Loader from '../../components/Loader';
import { CHECK_USER_QUERY } from './graphql-query';
import { INVALID_INPUT, NOT_FOUND } from '../../common/errorCodes';
import { FORGOT_PASSWORD_MUTATION, SIGNIN_MUTATION } from './graphql-mutation';

function login() {
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

  const [mobileObj, setMobileObj] = useState({
    mobile: '',
    country: IND_COUNTRY_OBJ,
  });

  const [checkUser, { loading: checkUserLoading }] = useLazyQuery(CHECK_USER_QUERY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      const error = e.graphQLErrors[0].extensions.exception.response;
      console.log(error);
      if (error.errorCode === NOT_FOUND) {
        // use not found
        // TODO: take user for otp verification
        navigation.navigate(routeNames.OTP_VERIFICATION, {
          countryCode: mobileObj.country.dialCode,
          number: mobileObj.mobile,
          newUser: true,
        });
      }
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
        if (!data.checkUser.isPasswordSet) {
          navigation.navigate(routeNames.OTP_VERIFICATION, {
            countryCode: mobileObj.country.dialCode,
            number: mobileObj.mobile,
            newUser: false,
          });
        } else {
          setShowPassword(true);
          setTitle('Welcome back!');
          setSubTitle('Login to your account.');
        }
      }
    },
  });

  const [signIn, { loading: signInLoading }] = useMutation(SIGNIN_MUTATION, {
    fetchPolicy: 'no-cache',
    variables: { countryCode: mobileObj.country.dialCode, number: mobileObj.mobile, password },
    onError: (e) => {
      const error = e.graphQLErrors[0].extensions.exception.response;
      console.log(error);
      if (error.errorCode === INVALID_INPUT) {
        // incorrect username/password
        Alert.alert('Incorrect password');
      }
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
        AsyncStorage.removeItem(LOCAL_STORAGE_DATA_KEY.USER_TOKEN);
        storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, data.signIn.token);

        if (!data.signIn.isPasswordSet) {
          navigation.navigate(routeNames.SET_PASSWORD);
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
        navigation.navigate(routeNames.SET_PASSWORD);
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
    if(mobileObj.mobile){
      const countryCode = mobileObj.country.dialCode;
      const number = mobileObj.mobile;
      forgotPassword({
        variables: { countryCode, number },
      });
    }else{
      Alert.alert('Please enter mobile number.');
    }
  };

  const onIconPress = () => {
    (eyeIcon === 'eye') ? setEyeIcon('eye-with-line') : setEyeIcon('eye');
    (hidePassword) ? setHidePassword(false) : setHidePassword(true);
  };

  const onClickContinue = () => {
    if(mobileObj.mobile){
      const countryCode = mobileObj.country.dialCode;
      const number = mobileObj.mobile;
      if (!showPassword) {
        checkUser({
          variables: { countryCode, number },
        });
      } else {
        signIn();
      }
    }else{
      Alert.alert('Please enter mobile number.');
    }
  };

  const clearMobileNumber = () =>{
    setMobileObj({mobile: '', country: IND_COUNTRY_OBJ});
    setShowClear(false);
  }

  const onChangePassword = (text) =>{
    setPassword(text);
    text ? setShowEye(true) : setShowEye(false);
  }

  const bottonView = () => (
      <View
        style={{
          backgroundColor: Colors.white,
          paddingHorizontal: 16,
          paddingVertical: 56,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
      >
        <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
          <View style={{flex:0.95}}><CustomMobileNumber
            value={mobileObj}
            topMargin={0}
            onChangeHandler={(mobileObj) => {
              setMobileObj(mobileObj);
              setShowClear(true);
              setShowNext(true);
            }}
            returnKeyType="done"
            refKey="mobileNumber"
            placeholder="Mobile number"
            onSubmitEditing={() => onSubmitEditing()}
          /></View>
          {showClear && <Icon onPress={() => clearMobileNumber()} style={{flex:0.05, marginBottom:RfH(-30), fontSize:18, color:Colors.inputLabel}} type="Entypo" name="circle-with-cross"></Icon>}
        </View>
        <View
          style={{
            marginTop: RfH(40),
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.inputLabel,
          }}
        />
        {showPassword && (
        <View>
          <Item style={{ marginTop: RfH(53.5) }}>
            <Input
              secureTextEntry={hidePassword}
              placeholder="Password"
              placeholderTextColor={Colors.inputLabel}
              onChangeText={(text) => onChangePassword(text)}
            />
            {showEye && <Icon type="Entypo" name={eyeIcon} onPress={() => onIconPress()} style={{ fontSize: 18, color: '#818181' }} />}
          </Item>
          <TouchableOpacity onPress={() => onForgotPasswordClick()}>
            <Text style={{ color: Colors.primaryButtonBackground, textAlign: 'right', marginTop: RfH(6) }}>
              Forgot
              Password?
            </Text>
          </TouchableOpacity>
        </View>
        )}
        <TouchableOpacity
          onPress={() => onClickContinue()}
          style={[
            showNext
              ? commonStyles.buttonPrimary
              : commonStyles.disableButton,
            {
              marginTop: RfH(63),
              alignSelf: 'center',
              width: RfW(144),
            },
          ]}
        >
          <Text style={commonStyles.textButtonPrimary}>Continue</Text>
        </TouchableOpacity>
      </View>
  );

  return (
    <View
      style={[
        commonStyles.mainContainer,
        { backgroundColor: Colors.onboardBackground },
      ]}
    >
      <Loader isLoading={checkUserLoading || signInLoading || forgotPasswordLoading} />
      <StatusBar barStyle="light-content" />
      <Icon
        onPress={() => onBackPress()}
        type="MaterialIcons"
        name="keyboard-backspace"
        style={{ marginLeft: 16, marginTop: 58, color: Colors.white }}
      />
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </View>
      <KeyboardAvoidingView behavior="padding">
        <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ marginTop: RfH(36) }}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>
                {subTitle}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {bottonView()}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default login;
