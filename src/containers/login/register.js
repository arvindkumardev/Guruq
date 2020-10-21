import {
  View, Text, TouchableOpacity, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, StatusBar, ScrollView
} from 'react-native';
import {
  Icon, Input, Item, Label
} from 'native-base';
import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../../common/styles';
import Colors from '../../theme/colors';
import styles from './styles';
import { RfH, RfW, storeData } from '../../utils/helpers';
import { LOCAL_STORAGE_DATA_KEY } from '../../utils/constants';
import routeNames from '../../routes/ScreenNames';
import { useMutation } from '@apollo/client';
import { SIGNUP_MUTATION } from './graphql-mutation';

function register(props) {
  const navigation = useNavigation();
  const [fullName, setFullName]= useState('');
  const [firstName, setFirstName]= useState('');
  const [lastName, setLastName]= useState('');
  const [email, setEmail]= useState('');
  const [password, setPassword]= useState('');
  const [referCode, setReferCode]= useState('');

  const { route } = props;

  const [addUser, { loading, data }] = useMutation(SIGNUP_MUTATION, {
    fetchPolicy: 'no-cache',
    variables: { countryCode: route.params.countryCode, number: route.params.number, firstName: firstName, lastName: lastName, email: email, password: password, referCode : referCode },
    onError: (e) => {
      const error = e.graphQLErrors[0].extensions.exception.response;
      console.log(error);
    },
    onCompleted: (data) => {
      if (data) {
        console.log('data', data);
        storeData(LOCAL_STORAGE_DATA_KEY.USER_TOKEN, data.signUp.token);
      }
    },
  });

  const onBackPress = () => {
    navigation.goBack();
  };

  const onClickContinue = () => {
    var first = fullName.lastIndexOf(' '); 
    var fName = fullName.substring(0, first);
    var lName = fullName.substring(first+1);
    setFirstName(fName); 
    setLastName(lName);
    addUser();
  };

  const bottonView = () => (
    <KeyboardAvoidingView behavior="height">
      <View style={{
        backgroundColor: Colors.white, paddingHorizontal: 16, paddingTop: 56, paddingBottom: RfH(56), borderTopLeftRadius: 25, borderTopRightRadius: 25
      }}
      >
        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
          <View>
            <Item>
              <Input placeholder="Full Name" placeholderTextColor={Colors.inputLabel} onChangeText = {(text) => setFullName(text)}/>
            </Item>
            <Item style={{ marginTop: RfH(53.5) }}>
              <Input placeholder="Email ID" placeholderTextColor={Colors.inputLabel} onChangeText = {(text) => setEmail(text)}/>
            </Item>
            <Item style={{ marginTop: RfH(53.5) }}>
              <Input secureTextEntry={true} placeholder="Password" placeholderTextColor={Colors.inputLabel} onChangeText = {(text) => setPassword(text)}/>
            </Item>
            <Item style={{ marginTop: RfH(53.5) }}>
              <Input placeholder="Referral Code" placeholderTextColor={Colors.inputLabel} onChangeText = {(text) => setReferCode(text)}/>
              <Text style={{
                color: '#FF9900', fontSize: 10, marginBottom: 10, alignSelf: 'flex-end'
              }}
              >
                APPLY
              </Text>
            </Item>
          </View>
        </View>
        <TouchableOpacity onPress={() => onClickContinue()} style={[commonStyles.buttonPrimary, { marginTop: RfH(63), alignSelf: 'center', width: RfW(144) }]}>
          <Text style={commonStyles.textButtonPrimary}>
            Submit
          </Text>
        </TouchableOpacity>
        <View style={{ marginTop: RfH(10) }}>
          <Text>
            By Signing up you agree to GuruQ
            {' '}
            <Text style={{ color: Colors.primaryButtonBackground }}>{'Terms & Conditions'}</Text>
            ,
            <Text style={{ color: Colors.primaryButtonBackground }}>Privacy Policy</Text>
            {' '}
            and
            <Text style={{ color: Colors.primaryButtonBackground }}>Cookie Policy</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.onboardBackground }]}>
      <StatusBar barStyle="light-content" />
      <Icon onPress={() => onBackPress()} type="MaterialIcons" name="keyboard-backspace" style={{ marginLeft: 16, marginTop: 58, color: Colors.white }} />
      <ScrollView>
        <KeyboardAvoidingView behavior="height">
          <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={{ marginTop: RfH(36) }}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Sign Up to get started</Text>
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
