import { Alert, Keyboard, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Icon, Input, Item, Label } from 'native-base';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import commonStyles from '../../../common/styles';
import Colors from '../../../theme/colors';
import styles from './styles';
import { RfH, RfW } from '../../../utils/helpers';
import { SIGNUP_MUTATION } from '../graphql-mutation';
import { DUPLICATE_FOUND } from '../../../common/errorCodes';
import MainContainer from './components/mainContainer';
import { AuthContext } from '../../../common/context';

function register(props) {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referCode, setReferCode] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const { route } = props;

  const { signIn } = React.useContext(AuthContext);

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
      if (error.errorCode === DUPLICATE_FOUND) {
        Alert.alert('User already exists. Please login');
      }
    },
    onCompleted: (data) => {
      if (data) {
        signIn(data.signUp);
      }
    },
  });

  const onBackPress = () => {
    navigation.goBack();
  };

  const onClickContinue = () => {
    if (!fullName) {
      Alert.alert('Please enter full name.');
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

  return (
    <MainContainer isLoading={addUserLoading} onBackPress={onBackPress}>
      <ScrollView>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.contentMarginTop}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign Up to get started</Text>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.bottomCard}>
          <View style={styles.setPasswordView}>
            <View>
              <Item floatingLabel>
                <Label>Full Name</Label>
                <Input onChangeText={(text) => setFullName(text)} />
              </Item>
              <Item floatingLabel style={{ marginTop: RfH(40) }}>
                <Label>Email ID</Label>
                <Input onChangeText={(text) => setEmail(text)} />
              </Item>
              <Item floatingLabel style={{ marginTop: RfH(40) }}>
                <Label>Password</Label>
                <Input secureTextEntry={hidePassword} onChangeText={(text) => setPassword(text)} />
                {password && (
                  <Icon
                    type="Entypo"
                    name={hidePassword ? 'eye' : 'eye-with-line'}
                    onPress={() => setHidePassword(!hidePassword)}
                    style={styles.eyeIcon}
                  />
                )}
              </Item>
              <Item floatingLabel style={{ marginTop: RfH(40) }}>
                <Label>Referral Code</Label>
                <Input onChangeText={(text) => setReferCode(text)} />
              </Item>
              <Text style={styles.applyIcon}>APPLY</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => onClickContinue()}
            style={[commonStyles.buttonPrimary, { marginTop: RfH(48), alignSelf: 'center', width: RfW(144) }]}>
            <Text style={commonStyles.textButtonPrimary}>Submit</Text>
          </TouchableOpacity>
          <View style={{ marginTop: RfH(8) }}>
            <Text style={{ textAlign: 'center' }}>
              By Signing up you agree to GuruQ{' '}
              <Text style={{ color: Colors.primaryButtonBackground }}>Terms & Conditions</Text>,
              <Text style={{ color: Colors.primaryButtonBackground, marginTop: RfH(4) }}> Privacy Policy</Text> and
              <Text style={{ color: Colors.primaryButtonBackground }}> Cookie Policy</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </MainContainer>
  );
}

export default register;
