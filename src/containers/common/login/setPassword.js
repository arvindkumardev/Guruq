import { Alert, KeyboardAvoidingView, Text, TouchableOpacity, View } from 'react-native';
import { Icon, Input, Item, Label } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useReactiveVar } from '@apollo/client';
import { isEmpty } from 'lodash';
import commonStyles from '../../../theme/styles';
import styles from './styles';
import { RfH, RfW, storeData } from '../../../utils/helpers';
import { SET_PASSWORD_MUTATION } from '../graphql-mutation';
import MainContainer from './components/mainContainer';
import { isLoggedIn, userDetails, userType } from '../../../apollo/cache';
import { LOCAL_STORAGE_DATA_KEY } from '../../../utils/constants';
import { INVALID_INPUT } from '../../../common/errorCodes';
import LoginCheck from './loginCheck';

function SetPassword({ route }) {
  const navigation = useNavigation();
  const [hidePassword, setHidePassword] = useState(true);
  const [password, setPassword] = useState('');
  const isUserLoggedIn = useReactiveVar(isLoggedIn);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const [setUserPassword, { loading: setPasswordLoading }] = useMutation(SET_PASSWORD_MUTATION, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e && e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
        if (error.errorCode === INVALID_INPUT) {
          Alert.alert('Incorrect password');
        }
      }
    },
    onCompleted: (data) => {
      if (data) {
        const { fromChangePassword } = route.params;
        if (fromChangePassword) {
          navigation.popToTop();
          Alert.alert('Password Changed successfully');
          // navigation.navigate(NavigationRouteNames.OTP_VERIFICATION, { mobileObj, newUser: false });
        } else if (data.setPassword) {
          storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, data.setPassword.token).then(() => {
            isLoggedIn(true);
            // userDetails(data.setPassword);
            // userType(data.setPassword.type);
          });
        }
      }
    },
  });

  const onBackPress = () => {
    navigation.goBack();
  };

  const onClickContinue = () => {
    if (isEmpty(password)) {
      Alert.alert('Please enter the password!');
    } else if (isEmpty(confirmPassword)) {
      Alert.alert('Please enter the confirm password!');
    } else if (password === confirmPassword) {
      setUserPassword({ variables: { password } });
    } else {
      Alert.alert('Password mismatch!');
    }
  };

  return (
    <MainContainer isLoading={setPasswordLoading} onBackPress={onBackPress}>
      {isUserLoggedIn && <LoginCheck />}
      <View style={styles.contentMarginTop}>
        <Text style={styles.title}>Set Password</Text>
        <Text style={styles.subtitle}>Enter the new password and submit</Text>
      </View>

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
            disabled={isEmpty(password) || isEmpty(confirmPassword)}
            style={[
              isEmpty(password) || isEmpty(confirmPassword) ? commonStyles.disableButton : commonStyles.buttonPrimary,
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
