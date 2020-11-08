import { Text, View } from 'react-native';
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../../../theme/styles';
import { RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { IconButtonWrapper } from '../../../components';
import { Images, Colors, Fonts } from '../../../theme';

function scheduleClass() {
  const navigation = useNavigation();

  const onBackPress = () => {
    navigation.goBack();
  };

  const renderTutorDetails = () => {
    return (
      <View>
        <View style={{ height: RfH(44) }} />
        <Text style={commonStyles.titleText}>Physics Class</Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>CBSE | Class 9</Text>
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(8) }} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(8) }]}>
          <View style={commonStyles.horizontalChildrenStartView}>
            <View style={commonStyles.verticallyStretchedItemsView}>
              <IconButtonWrapper
                styling={{ borderRadius: RfH(32) }}
                iconWidth={RfH(64)}
                iconHeight={RfH(64)}
                iconImage={Images.kushal}
              />
            </View>
            <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
              <Text
                style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), fontFamily: Fonts.semiBold, marginTop: RfH(2) }}>
                Rahul Das
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>GURUS52287</Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                Online Classes
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderClassView = () => {
    return (
      <View>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <View
            style={{
              flex: 0.5,
              marginRight: RfW(8),
              height: RfH(96),
              backgroundColor: Colors.lightGrey,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}>
            <Text style={[commonStyles.titleText, { color: Colors.darkGrey }]}>Class 1</Text>
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey, marginTop: RfH(8) }}>
              21 Sept ' 20
            </Text>
          </View>
          <View
            style={{
              flex: 0.5,
              marginLeft: RfW(8),
              height: RfH(96),
              backgroundColor: Colors.lightBlue,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}>
            <Text style={[commonStyles.titleText, { color: Colors.darkGrey }]}>Class 2</Text>
            <IconButtonWrapper
              iconHeight={RfH(20)}
              iconWidth={RfW(24)}
              iconImage={Images.calendar}
              styling={{ marginTop: RfH(8) }}
            />
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
          <View
            style={{
              flex: 0.5,
              marginRight: RfW(8),
              height: RfH(96),
              backgroundColor: Colors.lightBlue,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}>
            <Text style={[commonStyles.titleText, { color: Colors.darkGrey }]}>Class 3</Text>
            <IconButtonWrapper
              iconHeight={RfH(20)}
              iconWidth={RfW(24)}
              iconImage={Images.calendar}
              styling={{ marginTop: RfH(8) }}
            />
          </View>
          <View
            style={{
              flex: 0.5,
              marginLeft: RfW(8),
              height: RfH(96),
              backgroundColor: Colors.lightBlue,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}>
            <Text style={[commonStyles.titleText, { color: Colors.darkGrey }]}>Class 4</Text>
            <IconButtonWrapper
              iconHeight={RfH(20)}
              iconWidth={RfW(24)}
              iconImage={Images.calendar}
              styling={{ marginTop: RfH(8) }}
            />
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={[commonStyles.mainContainer, { paddingTop: RfH(44), backgroundColor: Colors.white }]}>
      <View style={commonStyles.horizontalChildrenSpaceView}>
        <View style={commonStyles.horizontalChildrenView}>
          <IconButtonWrapper
            iconImage={Images.backArrow}
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            submitFunction={() => onBackPress()}
          />
          <Text style={[commonStyles.pageTitle, { marginLeft: RfW(16) }]}>Schedule Class</Text>
        </View>
        <Text style={{ fontSize: RFValue(28, STANDARD_SCREEN_SIZE) }}>+</Text>
      </View>
      {renderTutorDetails()}
      <View style={{ height: RfH(56) }} />
      {renderClassView()}
    </View>
  );
}

export default scheduleClass;
