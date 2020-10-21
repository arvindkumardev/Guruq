import {
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Icon } from 'native-base';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useMutation } from '@apollo/client';
import commonStyles from '../../common/styles';
import Colors from '../../theme/colors';
import styles from './styles';
import { RfH, RfW } from '../../utils/helpers';
import routeNames from '../../routes/ScreenNames';
import { GENERATE_OTP_MUTATION } from './graphql-mutation';

function otpVerification(props) {
  const navigation = useNavigation();

  const { route } = props;

  const [generateOtp, { error, loading, data }] = useMutation(GENERATE_OTP_MUTATION, {
    fetchPolicy: 'no-cache',
    variables: { countryCode: route.params.countryCode, number: route.params.number },
    onError: (e) => {
      console.log(error);
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
      }
    }
  });

  useEffect(() => {
    generateOtp();
  }, []);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onClickContinue = () => {
    navigation.navigate(routeNames.SET_PASSWORD);
  };

  const bottonView = () => (
    <KeyboardAvoidingView>
      <View style={{
        backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 56, borderTopLeftRadius: 25, borderTopRightRadius: 25
      }}
      >
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
          <View style={{ marginLeft: RfW(57) }}>
            <Text style={{ color: Colors.inputLabel }}>Enter OTP</Text>
          </View>
          <OTPInputView
            style={{ marginHorizontal: RfW(59), height: 80, marginBottom: 0 }}
            pinCount={4}
                            // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                            // onCodeChanged = {code => { this.setState({code})}}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={((code) => {
              console.log(`Code is ${code}, you are good to go!`);
            })}
          />
        </View>
        <TouchableOpacity onPress={() => onClickContinue()} style={[commonStyles.buttonPrimary, { marginTop: RfH(50), alignSelf: 'center', width: RfW(144) }]}>
          <Text style={commonStyles.textButtonPrimary}>
            Verify
          </Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', marginTop: RfH(9) }}>
          <Text style={{ color: Colors.inputLabel }}>
            Resend Code in
            <Text style={{ color: Colors.primaryButtonBackground }}>60</Text>
            {' '}
            Sec
            {' '}
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.onboardBackground }]}>
      <StatusBar barStyle="light-content" />
      <Icon onPress={() => onBackPress()} type="MaterialIcons" name="keyboard-backspace" style={{ marginLeft: 16, marginTop: 58, color: Colors.white }} />
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
              <Text style={styles.title}>OTP Verification</Text>
              <Text style={[styles.subtitle, { marginRight: RfW(100) }]}>We have sent a Verification code at +91 -9876543210</Text>
            </View>
          </TouchableWithoutFeedback>
          {bottonView()}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default otpVerification;
