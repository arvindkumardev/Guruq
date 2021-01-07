import { Alert, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useMutation } from '@apollo/client';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../../../theme/colors';
import styles from './styles';
import { RfH, storeData } from '../../../utils/helpers';
import NavigationRouteNames from '../../../routes/screenNames';
import { INVALID_INPUT, NOT_FOUND } from '../../../common/errorCodes';
import { GENERATE_OTP_MUTATION, VERIFY_PHONE_NUMBER_MUTATION } from '../graphql-mutation';
import MainContainer from './components/mainContainer';
import { LOCAL_STORAGE_DATA_KEY, STANDARD_SCREEN_SIZE } from '../../../utils/constants';

function OtpVerification(props) {
  const navigation = useNavigation();
  const [time, setTime] = useState(60);

  const { route } = props;

  const { mobileObj, newUser } = route.params;

  useEffect(() => {
    const interval = setInterval(() => {
      if (time > 0) {
        setTime((time) => time - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  const [generateOtp, { loading: otpLoading }] = useMutation(GENERATE_OTP_MUTATION, {
    fetchPolicy: 'no-cache',
    variables: { countryCode: mobileObj.country.dialCode, number: mobileObj.mobile },
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
      }
    },
  });

  const [verifyPhoneNumber, { loading: verifyLoading }] = useMutation(VERIFY_PHONE_NUMBER_MUTATION, {
    fetchPolicy: 'no-cache',

    onError: (verifyError) => {
      console.log(verifyError);
      // if (verifyError && verifyError.graphQLErrors && verifyError.graphQLErrors.length > 0) {
      //   const error = verifyError.graphQLErrors[0].extensions.exception.response;
      //   console.log(error);
      //   if (error.errorCode === INVALID_INPUT) {
      //     // incorrect username/password
      //     Alert.alert('Invalid or Incorrect OTP');
      //   } else if (error.errorCode === NOT_FOUND) {
      //     navigation.navigate(NavigationRouteNames.REGISTER, { mobileObj, newUser: true });
      //   }
      // }
    },
    onCompleted: (verifyData) => {
      if (verifyData && verifyData.verifyPhoneNumber) {
        storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, verifyData.verifyPhoneNumber.token).then(() => {
          if (newUser) {
            navigation.navigate(NavigationRouteNames.REGISTER, {
              countryCode: mobileObj.country.dialCode,
              number: mobileObj.mobile,
            });
          } else {
            let {fromChangePassword} = route.params
            navigation.navigate(NavigationRouteNames.SET_PASSWORD,{
              fromChangePassword : fromChangePassword ? fromChangePassword :false
            });
          }
        });
      }
    },
  });

  useEffect(() => {
    generateOtp();
  }, []);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onCodeFilled = (otp) => {
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
      <View style={styles.contentMarginTop}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.otpNumber}>We have sent a Verification code at</Text>
        <Text style={[styles.otpNumber, { marginBottom: RfH(30), marginTop: RfH(3) }]}>
          +{mobileObj.country.dialCode}-{mobileObj.mobile}
        </Text>
      </View>
      <View style={styles.bottomCard}>
        <View style={[styles.setPasswordView, { paddingHorizontal: 64 }]}>
          <View>
            <Text style={{ color: Colors.secondaryText }}>Enter OTP</Text>
          </View>
          <OTPInputView
            style={{
              height: RfH(80),
              marginBottom: 0,
            }}
            pinCount={4}
            autoFocusOnLoad
            codeInputFieldStyle={[styles.underlineStyleBase, { fontSize: RFValue(24, STANDARD_SCREEN_SIZE) }]}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(code) => {
              onCodeFilled(code);
            }}
          />

          <View style={styles.resendParent}>
            {time > 0 ? (
              <Text style={{ color: Colors.secondaryText, fontSize: RFValue(14, STANDARD_SCREEN_SIZE) }}>
                Resend Code in
                <Text style={{ color: Colors.brandBlue2 }}> {time}</Text> Sec{' '}
              </Text>
            ) : (
              <TouchableOpacity onPress={() => onResendOtpClick()}>
                <Text style={{ color: Colors.brandBlue2, fontSize: RFValue(14, STANDARD_SCREEN_SIZE) }}>
                  Resend code
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </MainContainer>
  );
}

export default OtpVerification;
