import { StatusBar, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Icon } from 'native-base';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import commonStyles from '../../../theme/styles';
import { Colors } from '../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { RfH, RfW } from '../../../utils/helpers';
import styles from './style';

function ClassSelector() {
  const navigation = useNavigation();

  const onClassClick = () => {
    // navigation.navigate(routeNames.BOARD);
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const renderClassView = (itemtext, backgroundColor) => {
    return (
      <TouchableWithoutFeedback onPress={() => onClassClick()} style={{ alignItems: 'center', flex: 1 }}>
        <View style={[styles.classView, { backgroundColor, marginRight: RfW(8) }]}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.classTitle}>{itemtext}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
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
            fontFamily: 'SegoeUI-Bold',
            color: Colors.primaryText,
            marginLeft: RfH(20),
            alignSelf: 'center',
          }}>
          Select your Class
        </Text>
      </View>
      <View style={[styles.areaParentView, { marginTop: RfH(56) }]}>
        {renderClassView(1, 'rgb(203,231,255)')}
        {renderClassView(2, 'rgb(230,252,231)')}
        {renderClassView(3, 'rgb(231,229,242)')}
      </View>
      <View style={[styles.areaParentView, { marginTop: RfH(24) }]}>
        {renderClassView(4, 'rgb(230,252,231)')}
        {renderClassView(5, 'rgb(203,231,255)')}
        {renderClassView(6, 'rgb(255,247,240)')}
      </View>
      <View style={[styles.areaParentView, { marginTop: RfH(24) }]}>
        {renderClassView(7, 'rgb(231,229,242)')}
        {renderClassView(8, 'rgb(255,247,240)')}
        {renderClassView(9, 'rgb(203,231,255)')}
      </View>
      <View style={[styles.areaParentView, { marginTop: RfH(24) }]}>
        {renderClassView(10, 'rgb(203,231,255)')}
        {renderClassView(11, 'rgb(231,229,242)')}
        {renderClassView(12, 'rgb(230,252,231)')}
      </View>
    </View>
  );
}

export default ClassSelector;
