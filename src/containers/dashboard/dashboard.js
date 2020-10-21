import {
    View, Text, TouchableOpacity, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, StatusBar, ScrollView
  } from 'react-native';
  import {
    Icon
  } from 'native-base';
  import React, { useRef, useState } from 'react';
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
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.onboardBackground }]}>
        <StatusBar barStyle="light-content" />
        <Icon onPress={() => onBackPress()} type="MaterialIcons" name="keyboard-backspace" style={{ marginLeft: 16, marginTop: 58, color: Colors.white }} />
      </View>
    );
  }
  
  export default dashboard;
  