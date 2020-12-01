import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon, Input, Item, Label } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useReactiveVar } from '@apollo/client';
import commonStyles from '../../../theme/styles';
import Colors from '../../../theme/colors';
import styles from './styles';
import { RfH, RfW, storeData } from '../../../utils/helpers';
import { SIGNUP_MUTATION } from '../graphql-mutation';
import { DUPLICATE_FOUND } from '../../../common/errorCodes';
import MainContainer from './components/mainContainer';
import { isLoggedIn } from '../../../apollo/cache';
import { LOCAL_STORAGE_DATA_KEY } from '../../../utils/constants';
import LoginCheck from './loginCheck';

function SignUp(props) {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referCode, setReferCode] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const isUserLoggedIn = useReactiveVar(isLoggedIn);

  const { route } = props;

  const [addUser, { data: addUserData, error: addUserError, loading: addUserLoading }] = useMutation(SIGNUP_MUTATION, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (addUserError && addUserError.graphQLErrors && addUserError.graphQLErrors.length > 0) {
      const error = addUserError.graphQLErrors[0].extensions.exception.response;
      if (error.errorCode === DUPLICATE_FOUND) {
        Alert.alert('Email already being used by another user, please use different email!');
      }
    }
  }, [addUserError]);

  useEffect(() => {
    if (addUserData && addUserData.signUp) {
      storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, addUserData.signUp.token).then(() => {
        isLoggedIn(true);
      });
    }
  }, [addUserData]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onClickContinue = () => {
    if (!firstName) {
      Alert.alert('Please enter first name.');
      return;
    }
    if (!lastName) {
      Alert.alert('Please enter last name.');
      return;
    }
    if (!email) {
      Alert.alert('Please enter email.');
      return;
    }
    if (!password) {
      Alert.alert('Please enter password.');
      return;
    }
    addUser({
      variables: {
        phoneNumber: {
          countryCode: route.params.mobileObj.country.dialCode,
          number: route.params.mobileObj.mobile,
        },
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password,
        referCode,
      },
    });
  };

  return (
    <MainContainer isLoading={addUserLoading} onBackPress={onBackPress}>
      {isUserLoggedIn && <LoginCheck />}
      <ScrollView>
        <View style={styles.contentMarginTop}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign Up to get started</Text>
        </View>
        <View style={styles.bottomCard}>
          <View style={styles.setPasswordView}>
            <View>
              <View style={{ flexDirection: 'row' }}>
                <Item floatingLabel style={{ flex: 0.5 }}>
                  <Label>First Name</Label>
                  <Input onChangeText={(text) => setFirstName(text)} />
                </Item>
                <Item floatingLabel style={{ flex: 0.5 }}>
                  <Label>Last Name</Label>
                  <Input onChangeText={(text) => setLastName(text)} />
                </Item>
              </View>
              <Item floatingLabel style={{ marginTop: RfH(40) }}>
                <Label>Email</Label>
                <Input onChangeText={(text) => setEmail(text)} />
              </Item>
              <Item floatingLabel style={{ marginTop: RfH(40) }}>
                <Label>Password</Label>
                <Input secureTextEntry={hidePassword} onChangeText={(text) => setPassword(text)} />
                <Icon
                  type="Entypo"
                  name={hidePassword ? 'eye' : 'eye-with-line'}
                  onPress={() => setHidePassword(!hidePassword)}
                  style={styles.eyeIcon}
                />
              </Item>
              <Item floatingLabel style={{ marginTop: RfH(40) }}>
                <Label>Referral Code</Label>
                <Input onChangeText={(text) => setReferCode(text)} />
              </Item>
              <Text style={styles.applyIcon}>APPLY</Text>
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
          <View style={{ marginTop: RfH(8) }}>
            <Text style={{ textAlign: 'center' }}>
              By Signing up you agree to GuruQ <Text style={{ color: Colors.brandBlue2 }}>Terms & Conditions</Text>,
              <Text style={{ color: Colors.brandBlue2, marginTop: RfH(4) }}> Privacy Policy</Text> and
              <Text style={{ color: Colors.brandBlue2 }}> Cookie Policy</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </MainContainer>
  );
}

export default SignUp;
