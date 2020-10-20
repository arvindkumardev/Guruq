import {
  View, Text, TouchableOpacity, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, StatusBar
} from 'react-native';
import {
  Icon, Input, Item, Label
} from 'native-base';
import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../../common/styles';
import Colors from '../../theme/colors';
import styles from './styles';
import { RfH, RfW } from '../../utils/helpers';
import routeNames from '../../routes/ScreenNames';

function register() {
  const navigation = useNavigation();

  const onBackPress = () => {
    navigation.goBack();
  };

  const onClickContinue = () => {
    // navigation.navigate(routeNames.OTP_VERIFICATION);
  };

  const bottonView = () => (
    <KeyboardAvoidingView behavior="padding">
      <View style={{
        backgroundColor: Colors.white, paddingHorizontal: 16, paddingTop: 56, paddingBottom: RfH(56), borderTopLeftRadius: 25, borderTopRightRadius: 25
      }}
      >
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
          <View>
            <Item>
              <Input placeholder="Full Name" placeholderTextColor={Colors.inputLabel} />
            </Item>
            <Item style={{ marginTop: RfH(53.5) }}>
              <Input placeholder="Email ID" placeholderTextColor={Colors.inputLabel} />
            </Item>
            <Item style={{ marginTop: RfH(53.5) }}>
              <Input placeholder="Password" placeholderTextColor={Colors.inputLabel} />
            </Item>
            <Item style={{ marginTop: RfH(53.5) }}>
              <Input placeholder="Referral Code" placeholderTextColor={Colors.inputLabel} />
              <Text style={{
                color: '#FF9900', fontSize: 10, marginBottom: 10, alignSelf: 'flex-end'
              }}
              >
APPLY
</Text>
            </Item>
          </View>
        </View>
        <TouchableOpacity onPress={() => onClickContinue()} style={[commonStyles.buttonPrimary, { marginTop: RfH(63), alignSelf: 'center', width: RfW(144) }]}>
          <Text style={commonStyles.textButtonPrimary}>
            Submit
          </Text>
        </TouchableOpacity>
        <View style={{ marginTop: RfH(10) }}>
          <Text>
            By Signing up you agree to GuruQ
            {' '}
            <Text style={{ color: Colors.primaryButtonBackground }}>Terms & Conditions</Text>
            ,
            <Text style={{ color: Colors.primaryButtonBackground }}>Privacy Policy</Text>
            {' '}
            and
            <Text style={{ color: Colors.primaryButtonBackground }}>Cookie Policy</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.onboardBackground }]}>
      <StatusBar barStyle="light-content" />
      <Icon onPress={() => onBackPress()} type="MaterialIcons" name="keyboard-backspace" style={{ marginLeft: 16, marginTop: 58, color: Colors.white }} />
      <KeyboardAvoidingView behavior="padding">
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ marginTop: RfH(36) }}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign Up to get started</Text>
            </View>
          </TouchableWithoutFeedback>
          {bottonView()}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default register;
