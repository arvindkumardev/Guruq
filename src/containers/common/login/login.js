import { Alert, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import commonStyles from '../../../theme/styles';
import styles from './styles';
import { IND_COUNTRY_OBJ } from '../../../utils/constants';
import { CustomMobileNumber } from '../../../components';
import routeNames from '../../../routes/screenNames';
import { CHECK_USER_QUERY } from '../graphql-query';
import { NOT_FOUND } from '../../../common/errorCodes';
import MainContainer from './components/mainContainer';
import { RfH } from '../../../utils/helpers';

function Login() {
  const navigation = useNavigation();
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

  return (
    <MainContainer isLoading={checkUserLoading} isBackButtonVisible={false} onBackPress={() => {}}>
      <View style={styles.contentMarginTop}>
        <Text style={styles.title}>Login/ Sign Up</Text>
        <Text style={styles.subtitle}>Enter your phone number to continue</Text>
      </View>
      <View style={styles.bottomCard}>
        <CustomMobileNumber
          value={mobileObj}
          topMargin={0}
          onChangeHandler={(m) => setMobileObj(m)}
          returnKeyType="done"
          refKey="mobileNumber"
          placeholder="Mobile number"
          onSubmitEditing={onClickContinue}
          label={' '}
        />
        <View style={{ alignItems: 'center', marginTop: RfH(100) }}>
          <TouchableOpacity
            onPress={onClickContinue}
            style={[!isEmpty(mobileObj.mobile) ? commonStyles.buttonPrimary : commonStyles.disableButton]}>
            <Text style={commonStyles.textButtonPrimary}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </MainContainer>
  );
}

export default Login;
