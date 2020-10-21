import { StatusBar, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../../common/styles';
import Colors from '../../theme/colors';

function dashboard(props) {
  const navigation = useNavigation();

  const { route } = props;

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
      <StatusBar barStyle="light-content" />
      {/* <Icon onPress={() => onBackPress()} type="MaterialIcons" name="keyboard-backspace" style={{ marginLeft: 16, marginTop: 58, color: Colors.white }} /> */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>This is Dashboard</Text>
      </View>
    </View>
  );
}

export default dashboard;
