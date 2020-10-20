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

function setPassword() {
  const navigation = useNavigation();
  const [eyeIcon, setEyeIcon] = useState('eye');
  const [confirmEyeIcon, setConfirmEyeIcon] = useState('eye');
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onClickContinue = () => {
    navigation.navigate(routeNames.REGISTER);
  };

  const onIconPress = () => {
    (eyeIcon === 'eye') ? setEyeIcon('eye-with-line') : setEyeIcon('eye');
    (hidePassword) ? setHidePassword(false) : setHidePassword(true);
  };

  const onConfirmIconPress = () => {
    (confirmEyeIcon === 'eye') ? setConfirmEyeIcon('eye-with-line') : setConfirmEyeIcon('eye');
    (hideConfirmPassword) ? setHideConfirmPassword(false) : setHideConfirmPassword(true);
  };

  const bottonView = () => (
    <KeyboardAvoidingView>
      <View style={{
        backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 56, borderTopLeftRadius: 25, borderTopRightRadius: 25
      }}
      >
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
          <View>
            <Item>
              <Input secureTextEntry={hidePassword} placeholder="New Password" />
              <Icon type="Entypo" name={eyeIcon} onPress={() => onIconPress()} style={{ fontSize: 18, color: '#818181' }} />
            </Item>
          </View>
          <View style={{ marginTop: RfH(53.5) }}>
            <Item>
              <Input secureTextEntry={hideConfirmPassword} placeholder="Confirm Password" />
              <Icon type="Entypo" name={confirmEyeIcon} onPress={() => onConfirmIconPress()} style={{ fontSize: 18, color: '#818181' }} />
            </Item>
          </View>
        </View>
        <TouchableOpacity onPress={() => onClickContinue()} style={[commonStyles.buttonPrimary, { marginTop: RfH(63), alignSelf: 'center', width: RfW(144) }]}>
          <Text style={commonStyles.textButtonPrimary}>
            Submit
          </Text>
        </TouchableOpacity>
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
      <KeyboardAvoidingView behavior="position">
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ marginTop: RfH(36) }}>
              <Text style={styles.title}>Set Password</Text>
              <Text style={styles.subtitle}>Enter the new password and submit</Text>
            </View>
          </TouchableWithoutFeedback>
          {bottonView()}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default setPassword;
