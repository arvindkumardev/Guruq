import { Image, Text, View, StatusBar, TouchableWithoutFeedback } from 'react-native';
import { Icon, Thumbnail } from 'native-base';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { getSaveData, RfH, RfW } from '../../../utils/helpers';
import styles from './style';
import routeNames from '../../../routes/ScreenNames';

function studyAreaSelector() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('Sheena');

  const onBackPress = () => {
    navigation.goBack();
  };

  const onAreaClick = () => {
    navigation.navigate(routeNames.BOARD);
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: '#fff' }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.helloView}>
        <Icon
          onPress={() => onBackPress()}
          type="MaterialIcons"
          name="keyboard-backspace"
          style={{ color: Colors.darktitle }}
        />
        <Text style={styles.helloText}>Hello</Text>
      </View>
      <Text style={styles.userName}>{userName}</Text>
      <Text style={[styles.subHeading, { textAlign: 'left', fontWeight: 'bold' }]}>Select Your Study Area</Text>
      <Text style={{ color: Colors.inputLabel }}>To help us find the best tutors for you</Text>
      <View style={styles.areaParentView}>
        <TouchableWithoutFeedback onPress={() => onAreaClick()} style={{ alignItems: 'center', flex: 1 }}>
          <View style={[styles.areaView, { backgroundColor: 'rgb(255,247,240)', marginRight: RfW(8) }]}>
            <View style={{ alignItems: 'center' }}>
              <Thumbnail square source={Images.civic} />
              <Text style={styles.areaTitleOne}>School</Text>
              <Text style={styles.areaTitleTwo}>Education</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => onAreaClick()} style={{ alignItems: 'center', flex: 1 }}>
          <View style={[styles.areaView, { backgroundColor: 'rgb(230,252,231)', marginLeft: RfW(8) }]}>
            <View style={{ alignItems: 'center' }}>
              <Thumbnail square source={Images.civic} />
              <Text style={styles.areaTitleOne}>Competitive</Text>
              <Text style={styles.areaTitleTwo}>Exams</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.areaParentView}>
        <TouchableWithoutFeedback onPress={() => onAreaClick()} style={{ alignItems: 'center', flex: 1 }}>
          <View style={[styles.areaView, { backgroundColor: 'rgb(231,229,242)', marginRight: RfW(8) }]}>
            <View style={{ alignItems: 'center' }}>
              <Thumbnail square source={Images.civic} />
              <Text style={styles.areaTitleOne}>Study</Text>
              <Text style={styles.areaTitleTwo}>Abroad</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => onAreaClick()} style={{ alignItems: 'center', flex: 1 }}>
          <View style={[styles.areaView, { backgroundColor: 'rgb(203,231,255)', marginLeft: RfW(8) }]}>
            <View style={{ alignItems: 'center' }}>
              <Thumbnail square source={Images.civic} />
              <Text style={styles.areaTitleOne}>Language</Text>
              <Text style={styles.areaTitleTwo}>Learning</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

export default studyAreaSelector;
