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
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useMutation } from '@apollo/client';
import commonStyles from '../../common/styles';
import Colors from '../../theme/colors';
import styles from './styles';
import { RfH, RfW } from '../../utils/helpers';
import routeNames from '../../routes/ScreenNames';
import Loader from '../../components/Loader';
import { INVALID_INPUT } from '../../common/errorCodes';
import { GENERATE_OTP_MUTATION, VERIFY_PHONE_NUMBER_MUTATION } from './graphql-mutation';

function otpVerification(props) {
  const navigation = useNavigation();
  const [code, setCode] = useState(0);
  const [time, setTime] = useState(60);

  const { route } = props;

  useEffect(() => {
    const interval = setInterval(() => {
      if (time > 0) {
        setTime((time) => time - 1);
      } else {
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const [generateOtp, { error, loading: otpLoading }] = useMutation(GENERATE_OTP_MUTATION, {
    fetchPolicy: 'no-cache',
    variables: { countryCode: route.params.countryCode, number: route.params.number },
    onError: (e) => {
      console.log(error);
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
      }
    },
  });

  const [verifyPhoneNumber, { loading: verifyLoading }] = useMutation(VERIFY_PHONE_NUMBER_MUTATION, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      const error = e.graphQLErrors[0].extensions.exception.response;
      console.log(error);
      if (error.errorCode === INVALID_INPUT) {
        // incorrect username/password
        Alert.alert('Invalid OTP');
      }
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
        if (route.params.newUser) {
          navigation.navigate(routeNames.REGISTER, {
            countryCode: route.params.countryCode,
            number: route.params.number,
          });
        } else {
          navigation.navigate(routeNames.SET_PASSWORD);
        }
      }
    },
  });

  useEffect(() => {
    generateOtp();
  }, []);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onClickContinue = () => {
    if (code) {
      verifyPhoneNumber({
        variables: { countryCode: route.params.countryCode, number: route.params.number, otp: code },
      });
    } else {
      Alert.alert('Enter OTP to verify.');
    }
  };

  const onCodeFilled = (otp) => {
    setCode(otp);
    verifyPhoneNumber({
      variables: { countryCode: route.params.countryCode, number: route.params.number, otp },
    });
  };

  const onResendOtpClick = () => {
    setTime(60);
    generateOtp();
  };

  const bottonView = () => (
    <View
      style={styles.buttonView}>
      <View style={styles.setPasswordView}>
        <View style={{ marginLeft: RfW(57) }}>
          <Text style={{ color: Colors.inputLabel }}>Enter OTP</Text>
        </View>
        <OTPInputView
          style={{
            marginHorizontal: RfW(59), 
            height: RfH(80), 
            marginBottom: 0
          }}
          pinCount={4}
          autoFocusOnLoad
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={(code) => {
            onCodeFilled(code);
          }}
        />
      </View>
      <TouchableOpacity
        onPress={() => onClickContinue()}
        style={[commonStyles.buttonPrimary, { marginTop: RfH(50), alignSelf: 'center', width: RfW(144) }]}>
        <Text style={commonStyles.textButtonPrimary}>Verify</Text>
      </TouchableOpacity>
      <View style={styles.resendParent}>
        {time > 0 ? (
          <Text style={{ color: Colors.inputLabel }}>
            Resend Code in
            <Text style={{ color: Colors.primaryButtonBackground }}> {time}</Text> Sec{' '}
          </Text>
        ) : (
          <TouchableOpacity onPress={() => onResendOtpClick()}>
            <Text style={{ color: Colors.primaryButtonBackground }}>Resend code</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.onboardBackground }]}>
      <Loader isLoading={verifyLoading || otpLoading} />
      <StatusBar barStyle="light-content" />
      <Icon
        onPress={() => onBackPress()}
        type="MaterialIcons"
        name="keyboard-backspace"
        style={styles.backIcon}
      />
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </View>
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.setPasswordView}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
              <Text style={styles.title}>OTP Verification</Text>
              <Text style={styles.otpNumber}>
                We have sent a Verification code at
              </Text>
              <Text style={[styles.otpNumber,{marginBottom:RfH(51), marginTop:RfH(6)}]}>+{route.params.countryCode} -{route.params.number}</Text>
            </View>
          </TouchableWithoutFeedback>
          {bottonView()}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default otpVerification;
