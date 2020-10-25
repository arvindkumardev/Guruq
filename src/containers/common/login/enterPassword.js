import { Alert, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Icon, Input, Item, Label } from 'native-base';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import commonStyles from '../../../common/styles';
import styles from './styles';
import { RfH, RfW } from '../../../utils/helpers';
import NavigationRouteNames from '../../../routes/ScreenNames';
import { INVALID_INPUT, NOT_FOUND } from '../../../common/errorCodes';
import { FORGOT_PASSWORD_MUTATION, SIGNIN_MUTATION } from '../graphql-mutation';
import MainContainer from './components/mainContainer';
import { AuthContext } from '../../../common/context';

function enterPassword(props) {
  const { route } = props;

  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const [mobileObj, setMobileObj] = useState(route.params.mobileObj);

  const { signIn: signIn1 } = React.useContext(AuthContext);

  const [signIn, { loading: signInLoading }] = useMutation(SIGNIN_MUTATION, {
    fetchPolicy: 'no-cache',
    variables: { countryCode: mobileObj.country.dialCode, number: mobileObj.mobile, password },

    onError: (e) => {
      const error = e.graphQLErrors[0].extensions.exception.response;
      if (error.errorCode === INVALID_INPUT) {
        // incorrect username/password
        Alert.alert('Incorrect password');
      } else if (error.errorCode === NOT_FOUND) {
        navigation.navigate(NavigationRouteNames.OTP_VERIFICATION, { mobileObj, newUser: true });
      }
    },
    onCompleted: (data) => {
      if (data) {
        signIn1(data.signIn);
      }
    },
  });

  const [forgotPassword, { loading: forgotPasswordLoading }] = useMutation(FORGOT_PASSWORD_MUTATION, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      const error = e.graphQLErrors[0].extensions.exception.response;
      console.log(error);
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
        navigation.navigate(NavigationRouteNames.OTP_VERIFICATION, { mobileObj, newUser: false });
      }
    },
  });

  const onBackPress = () => {
    navigation.goBack();
  };

  const onForgotPasswordClick = () => {
    if (mobileObj.mobile) {
      const countryCode = mobileObj.country.dialCode;
      const number = mobileObj.mobile;
      forgotPassword({
        variables: { countryCode, number },
      });
    } else {
      Alert.alert('Please enter mobile number.');
    }
  };

  return (
    <MainContainer isLoading={signInLoading || forgotPasswordLoading} onBackPress={onBackPress}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.contentMarginTop}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>Enter password to login to your account.</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.bottomCard}>
        <View>
          <Item floatingLabel style={{}}>
            <Label style={{ fontSize: 16 }}>Password</Label>
            <Input secureTextEntry={hidePassword} onChangeText={(text) => setPassword(text)} />
            <Icon
              type="Entypo"
              name={hidePassword ? 'eye' : 'eye-with-line'}
              onPress={() => setHidePassword(!hidePassword)}
              style={styles.eyeIcon}
            />
          </Item>
          <TouchableOpacity onPress={() => onForgotPasswordClick()}>
            <Text style={styles.forgotPassword}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
        {/* )} */}
        <TouchableOpacity
          onPress={() => signIn()}
          style={[
            password ? commonStyles.buttonPrimary : commonStyles.disableButton,
            {
              marginTop: RfH(48),
              alignSelf: 'center',
              width: RfW(144),
            },
          ]}>
          <Text style={commonStyles.textButtonPrimary}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </MainContainer>
  );
}

export default enterPassword;
