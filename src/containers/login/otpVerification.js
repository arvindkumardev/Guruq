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
import MainContainer from './components/mainContainer';

function otpVerification(props) {
  const navigation = useNavigation();
  const [code, setCode] = useState(0);
  const [time, setTime] = useState(60);

  const { route } = props;

  const { mobileObj, newUser } = route.params;

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
  }, [time]);

  const [generateOtp, { error, loading: otpLoading }] = useMutation(GENERATE_OTP_MUTATION, {
    fetchPolicy: 'no-cache',
    variables: { countryCode: mobileObj.country.dialCode, number: mobileObj.mobile },
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
        Alert.alert('Invalid or Incorrect OTP');
      }
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
        if (newUser) {
          navigation.navigate(routeNames.REGISTER, {
            countryCode: mobileObj.country.dialCode,
            number: mobileObj.mobile,
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
        variables: { countryCode: mobileObj.country.dialCode, number: mobileObj.mobile, otp: code },
      });
    } else {
      Alert.alert('Enter OTP to verify.');
    }
  };

  const onCodeFilled = (otp) => {
    setCode(otp);
    verifyPhoneNumber({
      variables: { countryCode: mobileObj.country.dialCode, number: mobileObj.mobile, otp },
    });
  };

  const onResendOtpClick = () => {
    setTime(60);
    generateOtp();
  };

  return (
    <MainContainer isLoading={verifyLoading || otpLoading} onBackPress={onBackPress}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.otpNumber}>We have sent a Verification code at</Text>
          <Text style={[styles.otpNumber, { marginBottom: RfH(40), marginTop: RfH(6) }]}>
            +{mobileObj.country.dialCode}-{mobileObj.mobile}
          </Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.bottomCard}>
        <View style={[styles.setPasswordView, { paddingHorizontal: 64 }]}>
          <View>
            <Text style={{ color: Colors.inputLabel }}>Enter OTP</Text>
          </View>
          <OTPInputView
            style={{
              height: RfH(80),
              marginBottom: 0,
            }}
            pinCount={4}
            autoFocusOnLoad
            codeInputFieldStyle={[styles.underlineStyleBase, { fontSize: 24 }]}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(code) => {
              onCodeFilled(code);
            }}
          />

          <View style={styles.resendParent}>
            {time > 0 ? (
              <Text style={{ color: Colors.inputLabel, fontSize: 14 }}>
                Resend Code in
                <Text style={{ color: Colors.primaryButtonBackground }}> {time}</Text> Sec{' '}
              </Text>
            ) : (
              <TouchableOpacity onPress={() => onResendOtpClick()}>
                <Text style={{ color: Colors.primaryButtonBackground, fontSize: 14 }}>Resend code</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => onClickContinue()}
          style={[commonStyles.buttonPrimary, { marginTop: RfH(48), alignSelf: 'center', width: RfW(144) }]}>
          <Text style={commonStyles.textButtonPrimary}>Verify</Text>
        </TouchableOpacity>
      </View>
    </MainContainer>
  );
}

export default otpVerification;
