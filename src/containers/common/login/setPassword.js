import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Icon, Input, Item, Label } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useReactiveVar } from '@apollo/client';
import commonStyles from '../../../theme/styles';
import styles from './styles';
import { RfH, RfW, storeData } from '../../../utils/helpers';
import { SET_PASSWORD_MUTATION } from '../graphql-mutation';
import MainContainer from './components/mainContainer';
import { isLoggedIn } from '../../../apollo/cache';
import { LOCAL_STORAGE_DATA_KEY } from '../../../utils/constants';
import { INVALID_INPUT } from '../../../common/errorCodes';
import LoginCheck from './loginCheck';

function SetPassword() {
  const navigation = useNavigation();
  const [hidePassword, setHidePassword] = useState(true);
  const [password, setPassword] = useState('');
  const isUserLoggedIn = useReactiveVar(isLoggedIn);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const [
    setUserPassword,
    { data: setPasswordData, error: setPasswordError, loading: setPasswordLoading },
  ] = useMutation(SET_PASSWORD_MUTATION, {
    fetchPolicy: 'no-cache',
    variables: { password },
  });
  //
  //   onError: (e) => {
  //     if (e.graphQLErrors && e.graphQLErrors.length > 0) {
  //       const error = e.graphQLErrors[0].extensions.exception.response;
  //       console.log(error);
  //     }
  //   },
  //   onCompleted: (data) => {
  //     if (data) {
  //       storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, data.setPassword.token).then(() => {
  //         isLoggedIn(true);
  //         userDetails(data.setPassword);
  //       });
  //
  //       // if (data.type === UserTypeEnum.OTHER.label) {
  //       //   navigation.navigate(NavigationRouteNames.USER_TYPE_SELECTOR, { user: data.SetPassword });
  //       // } else {
  //       // set in apollo cache
  //       // }
  //     }
  //   },
  // });

  useEffect(() => {
    if (setPasswordError && setPasswordError.graphQLErrors && setPasswordError.graphQLErrors.length > 0) {
      const error = setPasswordError.graphQLErrors[0].extensions.exception.response;
      if (error.errorCode === INVALID_INPUT) {
        Alert.alert('Incorrect password');
      }
    }
  }, [setPasswordError]);

  useEffect(() => {
    if (setPasswordData && setPasswordData.setPassword) {
      storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, setPasswordData.setPassword.token).then(() => {
        isLoggedIn(true);
      });
    }
  }, [setPasswordData]);

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

  return (
    <MainContainer isLoading={setPasswordLoading} onBackPress={onBackPress}>
      {isUserLoggedIn && <LoginCheck />}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                <Input secureTextEntry={hidePassword} onChangeText={(text) => setPassword(text)} />
                <Icon
                  type="Entypo"
                  name={hidePassword ? 'eye' : 'eye-with-line'}
                  onPress={() => setHidePassword(!hidePassword)}
                  style={styles.eyeIcon}
                />
              </Item>
            </View>
            <View style={{ marginTop: RfH(40) }}>
              <Item floatingLabel>
                <Label>Confirm Password</Label>
                <Input secureTextEntry={hideConfirmPassword} onChangeText={(text) => setConfirmPassword(text)} />
                <Icon
                  type="Entypo"
                  name={hideConfirmPassword ? 'eye' : 'eye-with-line'}
                  onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
                  style={styles.eyeIcon}
                />
              </Item>
            </View>
          </View>
          <TouchableOpacity
            onPress={onClickContinue}
            style={[
              commonStyles.buttonPrimary,
              {
                marginTop: RfH(48),
                alignSelf: 'center',
                width: RfW(144),
              },
            ]}>
            <Text style={commonStyles.textButtonPrimary}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
}

export default SetPassword;
