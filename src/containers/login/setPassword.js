import {
  View, Text, TouchableOpacity, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, StatusBar, Alert
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
import { SET_PASSWORD_MUTATION } from './graphql-mutation';
import { useMutation } from '@apollo/client';
import Loader from '../../components/Loader';

function setPassword() {
  const navigation = useNavigation();
  const [eyeIcon, setEyeIcon] = useState('eye');
  const [confirmEyeIcon, setConfirmEyeIcon] = useState('eye');
  const [hidePassword, setHidePassword] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [showEye, setShowEye] = useState(false);
  const [showConfirmEye, setShowConfirmEye] = useState(false);

  const [setUserPassword, { loading: setPasswordLoading }] = useMutation(SET_PASSWORD_MUTATION, {
    fetchPolicy: 'no-cache',
    variables: { password: password },
    onError: (e) => {
      const error = e.graphQLErrors[0].extensions.exception.response;
      console.log(error);
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
        navigation.navigate(routeNames.DASHBOARD);
      }
    },
  });


  const onBackPress = () => {
    navigation.goBack();
  };

  const onClickContinue = () => {
    if(password === confirmPassword){
      setUserPassword();
    }else{
      Alert.alert('Password mismatch!');
    }
  };

  const onIconPress = () => {
    (eyeIcon === 'eye') ? setEyeIcon('eye-with-line') : setEyeIcon('eye');
    (hidePassword) ? setHidePassword(false) : setHidePassword(true);
  };

  const onConfirmIconPress = () => {
    (confirmEyeIcon === 'eye') ? setConfirmEyeIcon('eye-with-line') : setConfirmEyeIcon('eye');
    (hideConfirmPassword) ? setHideConfirmPassword(false) : setHideConfirmPassword(true);
  };

  const onChangePassword = (text) =>{
    setPassword(text);
    text ? setShowEye(true) : setShowEye(false);
  }

  const onChangeConfirmPassword = (text) =>{
    setConfirmPassword(text);
    text ? setShowConfirmEye(true) : setShowConfirmEye(false);
  }

  const bottonView = () => (
    <KeyboardAvoidingView>
      <View style={{
        backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 56, borderTopLeftRadius: 25, borderTopRightRadius: 25
      }}
      >
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
          <View>
            <Item>
              <Input secureTextEntry={hidePassword} placeholder="New Password" onChangeText = {(text) => onChangePassword(text)} />
              {showEye && <Icon type="Entypo" name={eyeIcon} onPress={() => onIconPress()} style={{ fontSize: 18, color: '#818181' }} />}
            </Item>
          </View>
          <View style={{ marginTop: RfH(53.5) }}>
            <Item>
              <Input secureTextEntry={hideConfirmPassword} placeholder="Confirm Password" onChangeText = {(text) => onChangeConfirmPassword(text)}/>
              {showConfirmEye && <Icon type="Entypo" name={confirmEyeIcon} onPress={() => onConfirmIconPress()} style={{ fontSize: 18, color: '#818181' }} />}
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
      <Loader isLoading={setPasswordLoading} />
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
