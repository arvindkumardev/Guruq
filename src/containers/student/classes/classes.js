import { FlatList, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button, Segment } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Images, Colors, Fonts } from '../../../theme';
import routeNames from '../../../routes/screenNames';
import { RfH, RfW } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import styles from './styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { IconButtonWrapper } from '../../../components';

function bookingConfirmed() {
  const navigation = useNavigation();
  const [isHistorySelected, setIsHistorySelected] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [classItems, setClassItems] = useState([
    {
      tutorIcon: Images.kushal,
      subject: 'English Class',
      tutor: 'Gurbani Singh',
      board: 'CBSE',
      class: '9',
      numberOfClass: '05',
      mode: 'Online Individual Class',
      tutorCode: 'GURUS52287',
    },
    {
      tutorIcon: Images.kushal,
      subject: 'Maths Class',
      tutor: 'Priyam',
      board: 'CBSE',
      class: '9',
      numberOfClass: '04',
      mode: 'Online Individual Class',
      tutorCode: 'GURUS52287',
    },
    {
      tutorIcon: Images.kushal,
      subject: 'Physics Class',
      tutor: 'Priyam',
      board: 'CBSE',
      class: '9',
      numberOfClass: '01',
      mode: 'Online Individual Class',
      tutorCode: 'GURUS52287',
    },
    {
      tutorIcon: Images.kushal,
      subject: 'History Class',
      tutor: 'Shipra',
      board: 'CBSE',
      class: '9',
      numberOfClass: '01',
      mode: 'Online Individual Class',
      tutorCode: 'GURUS52287',
    },
  ]);

  const renderClassItem = (item) => {
    return (
      <View>
        <View style={{ height: RfH(40) }} />
        <Text style={commonStyles.headingPrimaryText}>{item.subject}</Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
            {item.board} | Class {item.class}
          </Text>
          {!isHistorySelected && (
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.brandBlue2 }}>Renew Class</Text>
          )}
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(8) }} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(8) }]}>
          <View style={commonStyles.horizontalChildrenStartView}>
            <View style={commonStyles.verticallyStretchedItemsView}>
              <IconButtonWrapper
                styling={{ borderRadius: RfH(32) }}
                iconWidth={RfH(64)}
                iconHeight={RfH(64)}
                iconImage={item.tutorIcon}
              />
              <Text
                style={{
                  marginTop: RfH(4),
                  fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
                  textAlign: 'center',
                }}>
                Detail
              </Text>
            </View>
            <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
              <Text
                style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), fontFamily: Fonts.semiBold, marginTop: RfH(2) }}>
                {item.tutor}
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                {item.tutorCode}
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>{item.mode}</Text>
            </View>
          </View>
          <View style={commonStyles.verticallyCenterItemsView}>
            <Text
              style={[
                commonStyles.headingPrimaryText,
                { backgroundColor: Colors.lightBlue, padding: RfH(8), borderRadius: 8 },
              ]}>
              {item.numberOfClass}
            </Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Total</Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Classes</Text>
          </View>
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(16) }} />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          {!isHistorySelected && (
            <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), textAlign: 'right', color: Colors.darkGrey }}>
              3 Unscheduled Classses
            </Text>
          )}
          <Button
            onPress={() => navigation.navigate(routeNames.STUDENT.SCHEDULE_CLASS)}
            style={[commonStyles.buttonPrimary, { alignSelf: 'flex-end', marginRight: RfH(0), marginLeft: RfW(16) }]}>
            <Text style={commonStyles.textButtonPrimary}>{isHistorySelected ? 'Renew Class' : 'Schedule Class'}</Text>
          </Button>
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5 }} />
      </View>
    );
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;

    if (scrollPosition > 35) {
      setShowHeader(true);
    } else {
      setShowHeader(false);
    }
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
      <View style={{ height: RfH(44), alignItems: 'center', justifyContent: 'center' }}>
        {showHeader && (
          <Text
            style={{
              textAlign: 'center',
              fontFamily: Fonts.regular,
              fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
              alignSelf: 'center',
            }}>
            My Classes
          </Text>
        )}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={(event) => handleScroll(event)}
        stickyHeaderIndices={[1]}
        scrollEventThrottle={16}>
        <View>
          <Text style={commonStyles.pageTitleThirdRow}>My Classes</Text>
        </View>
        <View>
          <View
            style={[
              commonStyles.horizontalChildrenCenterView,
              showHeader
                ? { backgroundColor: Colors.white, paddingBottom: RfH(8) }
                : { paddingTop: RfH(16), backgroundColor: Colors.white },
            ]}>
            <Button
              onPress={() => setIsHistorySelected(false)}
              small
              block
              bordered
              style={isHistorySelected ? styles.inactiveLeftButton : styles.activeLeftButton}>
              <Text style={isHistorySelected ? styles.inactiveButtonText : styles.activeButtonText}>
                Unscheduled Classes
              </Text>
            </Button>
            <Button
              onPress={() => setIsHistorySelected(true)}
              small
              block
              bordered
              style={isHistorySelected ? styles.activeRightButton : styles.inactiveRightButton}>
              <Text style={isHistorySelected ? styles.activeButtonText : styles.inactiveButtonText}>History</Text>
            </Button>
          </View>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={classItems}
          renderItem={({ item }) => renderClassItem(item)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: RfH(170) }}
        />
      </ScrollView>
    </View>
  );
}

export default bookingConfirmed;
