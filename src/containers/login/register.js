import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
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
import commonStyles from '../../common/styles';
import Colors from '../../theme/colors';
import styles from './styles';
import { RfH, RfW, storeData } from '../../utils/helpers';
import { LOCAL_STORAGE_DATA_KEY } from '../../utils/constants';
import routeNames from '../../routes/ScreenNames';
import { SIGNUP_MUTATION } from './graphql-mutation';
import Loader from '../../components/Loader';
import { DUPLICATE_FOUND } from '../../common/errorCodes';

function register(props) {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referCode, setReferCode] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [eyeIcon, setEyeIcon] = useState('eye');
  const [showEye, setShowEye] = useState(false);

  const { route } = props;

  const [addUser, { loading: addUserLoading }] = useMutation(SIGNUP_MUTATION, {
    fetchPolicy: 'no-cache',
    variables: {
      countryCode: route.params.countryCode,
      number: route.params.number,
      firstName,
      lastName,
      email,
      password,
      referCode,
    },
    onError: (e) => {
      const error = e.graphQLErrors[0].extensions.exception.response;
      console.log(error);
      if (error.errorCode === DUPLICATE_FOUND) {
        Alert.alert('User already exists. Please login');
      }
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
        storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, data.signUp.token);
        navigation.navigate(routeNames.DASHBOARD);
      }
    },
  });

  const onBackPress = () => {
    navigation.goBack();
  };

  const onClickContinue = () => {
    if (!fullName) {
      Alert.alert('Please enter fullname.');
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
    const first = fullName.lastIndexOf(' ');
    const fName = fullName.substring(0, first);
    const lName = fullName.substring(first + 1);
    setFirstName(fName);
    setLastName(lName);
    addUser();
  };

  const onIconPress = () => {
    eyeIcon === 'eye' ? setEyeIcon('eye-with-line') : setEyeIcon('eye');
    hidePassword ? setHidePassword(false) : setHidePassword(true);
  };

  const onChangePassword = (text) => {
    setPassword(text);
    text ? setShowEye(true) : setShowEye(false);
  };

  const bottonView = () => (
    <View
      style={{
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingTop: RfH(56),
        paddingBottom: RfH(66),
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
      }}>
      <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
        <View>
          <Item floatingLabel>
            <Label>Full Name</Label>
            <Input onChangeText={(text) => setFullName(text)} />
          </Item>
          <Item floatingLabel style={{ marginTop: RfH(53.5) }}>
            <Label>Email ID</Label>
            <Input onChangeText={(text) => setEmail(text)} />
          </Item>
          <Item floatingLabel style={{ marginTop: RfH(53.5) }}>
            <Label>Password</Label>
            <Input secureTextEntry={hidePassword} onChangeText={(text) => onChangePassword(text)} />
            {showEye && (
              <Icon
                type="Entypo"
                name={eyeIcon}
                onPress={() => onIconPress()}
                style={{ fontSize: 18, color: '#818181' }}
              />
            )}
          </Item>
          <Item floatingLabel style={{ marginTop: RfH(53.5) }}>
            <Label>Referral Code</Label>
            <Input onChangeText={(text) => setReferCode(text)} />
          </Item>
          <Text
            style={{
              color: '#FF9900',
              fontSize: 10,
              marginTop: RfH(-20),
              alignSelf: 'flex-end',
            }}>
            APPLY
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onClickContinue()}
        style={[commonStyles.buttonPrimary, { marginTop: RfH(63), alignSelf: 'center', width: RfW(144) }]}>
        <Text style={commonStyles.textButtonPrimary}>Submit</Text>
      </TouchableOpacity>
      <View style={{ marginTop: RfH(10) }}>
        <Text>
          By Signing up you agree to GuruQ{' '}
          <Text style={{ color: Colors.primaryButtonBackground }}>Terms & Conditions</Text>,
          <Text style={{ color: Colors.primaryButtonBackground }}> Privacy Policy</Text> and
          <Text style={{ color: Colors.primaryButtonBackground }}> Cookie Policy</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.onboardBackground }]}>
      <Loader isLoading={addUserLoading} />
      <StatusBar barStyle="light-content" />
      <Icon
        onPress={() => onBackPress()}
        type="MaterialIcons"
        name="keyboard-backspace"
        style={{ marginLeft: 16, marginTop: 58, color: Colors.white }}
      />
      <ScrollView>
        <KeyboardAvoidingView behavior="padding">
          <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={{ marginTop: RfH(36) }}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={[styles.subtitle, { marginBottom: RfH(25) }]}>Sign Up to get started</Text>
              </View>
            </TouchableWithoutFeedback>
            {bottonView()}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

export default register;
