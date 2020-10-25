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
import { useMutation } from '@apollo/client';
import commonStyles from '../../../common/styles';
import Colors from '../../../theme/colors';
import styles from './styles';
import { removeData, RfH, RfW, storeData } from '../../../utils/helpers';
import routeNames from '../../../routes/ScreenNames';
import { SET_PASSWORD_MUTATION } from '../graphql-mutation';
import Loader from '../../../components/Loader';
import MainContainer from './components/mainContainer';
import { LOCAL_STORAGE_DATA_KEY } from '../../../utils/constants';
import NavigationRouteNames from '../../../routes/ScreenNames';

function setPassword() {
  const navigation = useNavigation();
  const [eyeIcon, setEyeIcon] = useState('eye');
  const [confirmEyeIcon, setConfirmEyeIcon] = useState('eye');
  const [hidePassword, setHidePassword] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [showEye, setShowEye] = useState(false);
  const [showTick, setShowTick] = useState(false);
  const [showConfirmEye, setShowConfirmEye] = useState(false);

  const [setUserPassword, { loading: setPasswordLoading }] = useMutation(SET_PASSWORD_MUTATION, {
    fetchPolicy: 'no-cache',
    variables: { password },
    onError: (e) => {
      const error = e.graphQLErrors[0].extensions.exception.response;
      console.log(error);
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
        removeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN);
        storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, data.setPassword.token);
        storeData(LOCAL_STORAGE_DATA_KEY.FIRST_NAME, data.setPassword.firstName);
        storeData(LOCAL_STORAGE_DATA_KEY.LAST_NAME, data.setPassword.lastName);

        // TODO: check user type and send to corresponding dashboard
        navigation.navigate(NavigationRouteNames.STUDENT.DASHBOARD);
      }
    },
  });

  const onBackPress = () => {
    navigation.goBack();
  };

  const onClickContinue = () => {
    if (password === confirmPassword) {
      setUserPassword();
    } else {
      Alert.alert('Password mismatch!');
    }
  };

  const onIconPress = () => {
    if (eyeIcon === 'eye') {
      setEyeIcon('eye-with-line');
    } else {
      setEyeIcon('eye');
    }

    if (hidePassword) setHidePassword(false);
    else setHidePassword(true);
  };

  const onConfirmIconPress = () => {
    if (confirmEyeIcon === 'eye') setConfirmEyeIcon('eye-with-line');
    else setConfirmEyeIcon('eye');
    if (hideConfirmPassword) setHideConfirmPassword(false);
    else setHideConfirmPassword(true);
  };

  const onChangePassword = (text) => {
    setPassword(text);
    if (text) setShowEye(true);
    else setShowEye(false);
  };

  const onChangeConfirmPassword = (text) => {
    setConfirmPassword(text);
    if (text) setShowConfirmEye(true);
    else setShowConfirmEye(false);
  };

  return (
    <MainContainer isLoading={setPasswordLoading} onBackPress={onBackPress}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.contentMarginTop}>
          <Text style={styles.title}>Set Password</Text>
          <Text style={styles.subtitle}>Enter the new password and submit</Text>
        </View>
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView>
        <View style={styles.bottomCard}>
          <View style={styles.setPasswordView}>
            <View>
              <Item floatingLabel>
                <Label>New Password</Label>
                <Input secureTextEntry={hidePassword} onChangeText={(text) => onChangePassword(text)} />
                {showEye && <Icon type="Entypo" name={eyeIcon} onPress={() => onIconPress()} style={styles.eyeIcon} />}
              </Item>
            </View>
            <View style={{ marginTop: RfH(40) }}>
              <Item floatingLabel>
                <Label>Confirm Password</Label>
                <Input secureTextEntry={hideConfirmPassword} onChangeText={(text) => onChangeConfirmPassword(text)} />
                {showConfirmEye && (
                  <Icon
                    type="Entypo"
                    name={confirmEyeIcon}
                    onPress={() => onConfirmIconPress()}
                    style={styles.eyeIcon}
                  />
                )}
              </Item>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => onClickContinue()}
            style={[commonStyles.buttonPrimary, { marginTop: RfH(48), alignSelf: 'center', width: RfW(144) }]}>
            <Text style={commonStyles.textButtonPrimary}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
}

export default setPassword;
