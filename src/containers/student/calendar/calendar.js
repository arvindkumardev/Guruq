import { Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import { RFValue } from 'react-native-responsive-fontsize';
import { Agenda } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../../../theme/styles';
import routeNames from '../../../routes/screenNames';
import { RfH, RfW } from '../../../utils/helpers';
import { Colors, Images } from '../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { IconButtonWrapper } from '../../../components';

function Calendar() {
  const navigation = useNavigation();
  const [monthData, setMonthData] = useState([
    {
      date: 13,
      month: 'September',
      classes: [
        {
          classTitle: 'Physics Class by Gurbani Singh',
          board: 'CBSE',
          class: 'Class 9',
          timing: '06:00 PM - 07:00 PM',
          tutors: [{ tutor: Images.kushal }],
        },
      ],
    },
    {
      date: 15,
      month: 'September',
      classes: [
        {
          classTitle: 'Chemistry Class by Simran',
          board: 'CBSE',
          class: 'Class 9',
          timing: '06:00 PM - 07:00 PM',
          tutors: [{ tutor: Images.kushal }],
        },
        {
          classTitle: 'Physics Class by Rimmi Sinha ',
          board: 'CBSE',
          class: 'Class 9',
          timing: '06:00 PM - 07:00 PM',
          tutors: [{ tutor: Images.kushal }],
        },
      ],
    },
  ]);

  const renderClassItem = (item) => {
    return (
      <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.STUDENT.SCHEDULED_CLASS_DETAILS)}>
        <View style={[commonStyles.horizontalChildrenStartView, { marginTop: RfH(32) }]}>
          <View
            style={{
              height: RfH(72),
              width: RfW(72),
              backgroundColor: Colors.lightPurple,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <IconButtonWrapper
              iconHeight={RfH(48)}
              iconWidth={RfW(32)}
              styling={{ alignSelf: 'center' }}
              iconImage={Images.book}
            />
          </View>
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <Text style={commonStyles.headingText}>{item.classTitle}</Text>
            <Text style={commonStyles.secondaryText}>
              {item.board} | {item.class}
            </Text>
            <Text style={commonStyles.secondaryText}>{item.timing}</Text>
          </View>
          <View>
            <IconButtonWrapper />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderListItem = (item) => {
    return (
      <View style={{ marginTop: RfH(32) }}>
        <View>
          <Text style={commonStyles.titleText}>
            {item.date} {item.month}
          </Text>
        </View>
        <View>
          <View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={item.classes}
              renderItem={({ item }) => renderClassItem(item)}
              keyExtractor={(index) => index.toString()}
              contentContainerStyle={{ paddingBottom: RfH(170) }}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[commonStyles.mainContainer, { paddingTop: RfH(44) }]}>
      <View style={{ height: RfH(44) }} />
      <Text style={commonStyles.pageTitleThirdRow}>Your Schedule</Text>
      <CalendarStrip
        calendarHeaderStyle={{ alignSelf: 'flex-start', paddingBottom: RfH(8) }}
        highlightDateNumberStyle={{ color: Colors.brandBlue2 }}
        highlightDateNameStyle={{ color: Colors.brandBlue2 }}
        disabledDateNameStyle={{ color: Colors.darkGrey }}
        disabledDateNumberStyle={{ color: Colors.darkGrey }}
        dateNumberStyle={{ fontSize: RFValue(18, STANDARD_SCREEN_SIZE) }}
        style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={monthData}
        renderItem={({ item }) => renderListItem(item)}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: RfH(170) }}
      />
    </View>
  );
}

export default Calendar;
