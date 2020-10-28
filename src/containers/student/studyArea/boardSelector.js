import { StatusBar, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Icon, Thumbnail } from 'native-base';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import styles from './style';
import routeNames from '../../../routes/screenNames';

function BoardSelector() {
  const navigation = useNavigation();

  const onBoardClick = () => {
    navigation.navigate(routeNames.STUDENT.CLASS);
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: '#fff' }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.helloView}>
        <Icon
          onPress={() => onBackPress()}
          type="MaterialIcons"
          name="keyboard-backspace"
          style={{ color: Colors.primaryText }}
        />
        <Text
          style={{
            fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
            fontWeight: 'bold',
            color: Colors.primaryText,
            marginLeft: RfH(20),
            alignSelf: 'center',
          }}>
          Select your Board
        </Text>
      </View>
      <View style={styles.areaParentView}>
        <TouchableWithoutFeedback onPress={() => onBoardClick()} style={{ alignItems: 'center', flex: 1 }}>
          <View style={[styles.areaView, { backgroundColor: 'rgb(255,247,240)', marginRight: RfW(8) }]}>
            <View style={{ alignItems: 'center' }}>
              <Thumbnail style={{ height: RfH(70) }} square source={Images.cbse} />
              <Text style={styles.areaTitleOne}>CBSE</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => onBoardClick()} style={{ alignItems: 'center', flex: 1 }}>
          <View style={[styles.areaView, { backgroundColor: 'rgb(230,252,231)', marginLeft: RfW(8) }]}>
            <View style={{ alignItems: 'center' }}>
              <Thumbnail style={{ height: RfH(70) }} square source={Images.icse} />
              <Text style={styles.areaTitleOne}>ICSE</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.areaParentView}>
        <TouchableWithoutFeedback onPress={() => onBoardClick()} style={{ alignItems: 'center', flex: 1 }}>
          <View style={[styles.areaView, { backgroundColor: 'rgb(231,229,242)', marginRight: RfW(8) }]}>
            <View style={{ alignItems: 'center' }}>
              <Thumbnail style={{ height: RfH(70) }} square source={Images.ib} />
              <Text style={styles.areaTitleOne}>IB</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => onBoardClick()} style={{ alignItems: 'center', flex: 1 }}>
          <View style={[styles.areaView, { backgroundColor: 'rgb(203,231,255)', marginLeft: RfW(8) }]}>
            <View style={{ alignItems: 'center' }}>
              <Thumbnail style={{ height: RfH(70) }} square source={Images.igcse} />
              <Text style={styles.areaTitleOne}>IGCSE</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

export default BoardSelector;
