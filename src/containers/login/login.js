import {
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Icon, Item, Input } from 'native-base';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import commonStyles from '../../common/styles';
import Colors from '../../theme/colors';
import styles from './styles';
import { RfH, RfW } from '../../utils/helpers';
import { IND_COUNTRY_OBJ } from '../../utils/constants';
import { CustomMobileNumber } from '../../components';
import routeNames from '../../routes/ScreenNames';
import Loader from '../../components/Loader';
import { CHECK_USER_QUERY } from './graphql-query';
import { NOT_FOUND } from '../../common/errorCodes';

function login() {
  const navigation = useNavigation();
  const [showNext, setShowNext] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [mobileObj, setMobileObj] = useState({
    mobile: '',
    country: IND_COUNTRY_OBJ,
  });

  const [checkUser, { loading, data }] = useLazyQuery(CHECK_USER_QUERY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      const error = e.graphQLErrors[0].extensions.exception.response;
      console.log(error);
      if (error.errorCode === NOT_FOUND) {
        // use not found
        // TODO: take user for otp verification
        navigation.navigate(routeNames.OTP_VERIFICATION, { countryCode: mobileObj.country.dialCode, number: mobileObj.mobile, newUser: true });
      }
    }
  });

  useEffect(() =>{
    if(data){
      setShowPassword(true);
    }
  })

  const onBackPress = () => {
    navigation.goBack();
  };

  const onSubmitEditing = () => {
    setShowNext(true);
  };

  const onClickContinue = () => {
    const countryCode = mobileObj.country.dialCode;
    const number = mobileObj.mobile;
    console.log("Executed");
    checkUser({
      variables: { countryCode, number },
    });
  };

  const bottonView = () => (
    <KeyboardAvoidingView behavior='position'>
      <View
        style={{
          backgroundColor: Colors.white,
          paddingHorizontal: 16,
          paddingVertical: 56,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
      >
        <View>
          <CustomMobileNumber
            value={mobileObj}
            topMargin={0}
            onChangeHandler={(mobileObj) => {
              setMobileObj(mobileObj);
            }}
            returnKeyType="done"
            refKey="mobileNumber"
            placeholder="Mobile number"
            onSubmitEditing={() => onSubmitEditing()}
          />
        </View>
        <View
          style={{
            marginTop: RfH(40),
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.inputLabel,
          }}
        />
        {showPassword && <View>
          <Item style={{ marginTop: RfH(53.5) }}>
              <Input secureTextEntry={true} placeholder="Password" placeholderTextColor={Colors.inputLabel} onChangeText = {(text) => setPassword(text)}/>
            </Item>
        </View>}
        <TouchableOpacity
          onPress={() => onClickContinue()}
          style={[
            showNext
              ? commonStyles.buttonPrimary
              : commonStyles.disableButton,
            {
              marginTop: RfH(63),
              alignSelf: 'center',
              width: RfW(144),
            },
          ]}
        >
          <Text style={commonStyles.textButtonPrimary}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <View
      style={[
        commonStyles.mainContainer,
        { backgroundColor: Colors.onboardBackground },
      ]}
    >
      <Loader isLoading={loading} />
      <StatusBar barStyle="light-content" />
      <Icon
        onPress={() => onBackPress()}
        type="MaterialIcons"
        name="keyboard-backspace"
        style={{ marginLeft: 16, marginTop: 58, color: Colors.white }}
      />
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </View>
      <KeyboardAvoidingView behavior="position">
        <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ marginTop: RfH(36) }}>
              <Text style={styles.title}>Login/ Sign Up</Text>
              <Text style={styles.subtitle}>
                Enter your phone number to continue
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {bottonView()}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default login;
