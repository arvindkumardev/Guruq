import { Alert, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Icon } from 'native-base';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import commonStyles from '../../../theme/styles';
import styles from './styles';
import { RfH, RfW } from '../../../utils/helpers';
import { IND_COUNTRY_OBJ } from '../../../utils/constants';
import { CustomMobileNumber } from '../../../components';
import routeNames from '../../../routes/ScreenNames';
import { CHECK_USER_QUERY } from '../graphql-query';
import { NOT_FOUND } from '../../../common/errorCodes';
import MainContainer from './components/mainContainer';

function login() {
  const navigation = useNavigation();
  const [showNext, setShowNext] = useState(false);
  const [showClear, setShowClear] = useState(false);

  const [mobileObj, setMobileObj] = useState({
    mobile: '',
    country: IND_COUNTRY_OBJ,
  });

  const [checkUser, { loading: checkUserLoading }] = useLazyQuery(CHECK_USER_QUERY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
        if (error.errorCode === NOT_FOUND) {
          navigation.navigate(routeNames.OTP_VERIFICATION, { mobileObj, newUser: true });
        }
      }
    },
    onCompleted: (data) => {
      if (data) {
        if (!data.checkUser.isPasswordSet) {
          navigation.navigate(routeNames.OTP_VERIFICATION, { mobileObj, newUser: false });
        } else {
          navigation.navigate(routeNames.ENTER_PASSWORD, { mobileObj, newUser: false });
        }
      }
    },
  });

  const onBackPress = () => {
    navigation.goBack();
  };

  const onSubmitEditing = () => {
    setShowNext(true);
  };

  const onClickContinue = () => {
    if (mobileObj.mobile) {
      const countryCode = mobileObj.country.dialCode;
      const number = mobileObj.mobile;
      checkUser({
        variables: { countryCode, number },
      });
    } else {
      Alert.alert('Please enter mobile number.');
    }
  };

  const clearMobileNumber = () => {
    setMobileObj({ mobile: '', country: IND_COUNTRY_OBJ });
    setShowClear(false);
  };

  return (
    <MainContainer isLoading={checkUserLoading} onBackPress={onBackPress}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.contentMarginTop}>
          <Text style={styles.title}>Login/ Sign Up</Text>
          <Text style={styles.subtitle}>Enter your phone number to continue</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.bottomCard}>
        <View style={styles.bottomParent}>
          <View style={{ flex: 1 }}>
            <CustomMobileNumber
              value={mobileObj}
              topMargin={0}
              onChangeHandler={(m) => {
                setMobileObj(m);
                setShowClear(true);
                setShowNext(true);
              }}
              returnKeyType="done"
              refKey="mobileNumber"
              placeholder="Mobile number"
              onSubmitEditing={() => onSubmitEditing()}
            />
          </View>
          {showClear && (
            <Icon onPress={() => clearMobileNumber()} style={styles.clearIcon} type="Entypo" name="circle-with-cross" />
          )}
        </View>
        <View style={styles.underlineView} />

        <TouchableOpacity
          onPress={() => onClickContinue()}
          style={[
            showNext ? commonStyles.buttonPrimary : commonStyles.disableButton,
            {
              marginTop: RfH(48),
              alignSelf: 'center',
              width: RfW(144),
            },
          ]}>
          <Text style={commonStyles.textButtonPrimary}>Continue</Text>
        </TouchableOpacity>
      </View>
    </MainContainer>
  );
}

export default login;
