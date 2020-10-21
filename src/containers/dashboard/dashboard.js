import {
  Button, SafeAreaView, StatusBar, Text, View, Alert
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import commonStyles from '../../common/styles';
import Colors from '../../theme/colors';
import { LOCAL_STORAGE_DATA_KEY } from '../../utils/constants';
import routeNames from '../../routes/ScreenNames';

function dashboard(props) {
  const navigation = useNavigation();

  const { route } = props;

  const onBackPress = () => {
    navigation.goBack();
  };

  const logout = () => {
      Alert.alert('Logout!');
    AsyncStorage.removeItem(LOCAL_STORAGE_DATA_KEY.USER_TOKEN).then(() => {
      navigation.navigate(routeNames.LOGIN);
    });
  };

  return (
    <SafeAreaView style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
      <StatusBar barStyle="light-content" />
      {/* <Icon onPress={() => onBackPress()} type="MaterialIcons" name="keyboard-backspace" style={{ marginLeft: 16, marginTop: 58, color: Colors.white }} /> */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>This is Dashboard</Text>

        <View style={{ marginTop: 40 }}>
          <Button
            title="Logout"
            onPress={() => logout()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default dashboard;
