import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon, Input, Item, Label } from 'native-base';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useReactiveVar } from '@apollo/client';
import { isEmpty } from 'lodash';
import commonStyles from '../../../theme/styles';
import Colors from '../../../theme/colors';
import styles from './styles';
import { alertBox, isValidEmail, passwordPolicy, removeToken, RfH, RfW, storeData } from '../../../utils/helpers';
import { SIGNUP_MUTATION } from '../graphql-mutation';
import { DUPLICATE_FOUND } from '../../../common/errorCodes';
import MainContainer from './components/mainContainer';
import { isLoggedIn, userDetails, userType } from '../../../apollo/cache';
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

  const [addUser, { loading: addUserLoading }] = useMutation(SIGNUP_MUTATION, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      const error = e.graphQLErrors[0].extensions.exception.response;
      if (error.errorCode === DUPLICATE_FOUND) {
        alertBox('Email already being used by another user, please use different email!');
      }
    },
    onCompleted: async (data) => {
      if (data) {
        removeToken().then(() => {
          storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, data.signUp.token).then(() => {
            console.log('data.signUp', data.signUp);
            userDetails(data.signUp);
            userType(data.signUp.type);
            isLoggedIn(true);
          });
        });
      }
    },
  });

  const onBackPress = () => {
    navigation.goBack();
  };

  const onClickContinue = () => {
    if (!firstName) {
      alertBox('Please enter first name.');
    } else if (!lastName) {
      alertBox('Please enter last name.');
    } else if (!isValidEmail(email)) {
      alertBox('Please enter a valid email Id');
    } else if (!password) {
      alertBox('Please enter password.');
    } else if (!passwordPolicy(password)) {
      alertBox(
        'Please provide a valid password',
        'Password should be 8 character long with atleast one number and one alphabet'
      );
    } else {
      addUser({
        variables: {
          phoneNumber: {
            countryCode: route.params.countryCode,
            number: route.params.number,
          },
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.toLowerCase().trim(),
          password,
          referCode,
          utmSource: 'App',
          utmMedium: 'Signup',
        },
      });
    }
  };

  const handleChange = (value) => value.replace(/[^A-Za-z0-9.]/g, '');

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
                  <Input onChangeText={(text) => setFirstName(handleChange(text))} value={firstName} />
                </Item>
                <Item floatingLabel style={{ flex: 0.5 }}>
                  <Label>Last Name</Label>
                  <Input onChangeText={(text) => setLastName(handleChange(text))} value={lastName} />
                </Item>
              </View>
              <Item floatingLabel style={{ marginTop: RfH(40) }}>
                <Label>Email</Label>
                <Input onChangeText={(text) => setEmail(text)} keyboardType="email-address" autoCapitalize="none" />
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
              {/* <Text style={styles.applyIcon}>APPLY</Text> */}
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
