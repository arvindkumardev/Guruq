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
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import commonStyles from '../../../common/styles';
import styles from './styles';
import { RfH, RfW } from '../../../utils/helpers';
import { SET_PASSWORD_MUTATION } from '../graphql-mutation';
import MainContainer from './components/mainContainer';
import { AuthContext } from '../../../common/context';

function setPassword() {
  const navigation = useNavigation();
  const [hidePassword, setHidePassword] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const { signIn } = React.useContext(AuthContext);

  const [setUserPassword, { loading: setPasswordLoading }] = useMutation(SET_PASSWORD_MUTATION, {
    fetchPolicy: 'no-cache',
    variables: { password },
    onError: (e) => {
      const error = e.graphQLErrors[0].extensions.exception.response;
      console.log(error);
    },
    onCompleted: (data) => {
      if (data) {
        signIn(data.setPassword);
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
