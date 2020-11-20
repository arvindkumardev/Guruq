import { FlatList, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useQuery, useReactiveVar } from '@apollo/client';
import commonStyles from '../../../theme/styles';
import routeNames from '../../../routes/screenNames';
import { RfH, RfW } from '../../../utils/helpers';
import { Colors, Fonts, Images } from '../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { IconButtonWrapper } from '../../../components';
import { GET_SCHEDULED_CLASSES } from '../booking.query';
import { studentDetails } from '../../../apollo/cache';

function CalendarView() {
  const navigation = useNavigation();
  const [showHeader, setShowHeader] = useState(false);

  const studentInfo = useReactiveVar(studentDetails);
  console.log(studentInfo);

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

  const { loading: loadingScheduledClasses, error: scheduledClassesError, data: scheduledClassesData } = useQuery(
    GET_SCHEDULED_CLASSES,
    {
      variables: {
        classesSearchDto: {
          studentId: studentInfo.id,
          startDate: '2020-10-09T00:00:00Z',
          endDate: '2020-11-19T17:00:00Z',
        },
      },
    }
  );

  const renderClassItem = (item) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate(routeNames.STUDENT.SCHEDULED_CLASS_DETAILS, { classDetails: item })}>
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
            <Text style={commonStyles.headingPrimaryText}>{item.classTitle}</Text>
            <Text style={commonStyles.mediumMutedText}>
              {item.board} | {item.class}
            </Text>
            <Text style={commonStyles.mediumMutedText}>{item.timing}</Text>
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
          <Text style={commonStyles.headingPrimaryText}>
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

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;

    if (scrollPosition > 30) {
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
            }}>
            Your Schedule
          </Text>
        )}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={(event) => handleScroll(event)}
        stickyHeaderIndices={[1]}
        scrollEventThrottle={16}>
        <Text style={commonStyles.pageTitleThirdRow}>Your Schedule</Text>
        <View style={{ backgroundColor: Colors.white }}>
          <CalendarStrip
            calendarHeaderStyle={{
              fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
              alignSelf: 'flex-start',
              paddingBottom: RfH(8),
            }}
            highlightDateNumberStyle={{ color: Colors.brandBlue2 }}
            highlightDateNameStyle={{ color: Colors.brandBlue2 }}
            disabledDateNameStyle={{ color: Colors.darkGrey }}
            disabledDateNumberStyle={{ color: Colors.darkGrey }}
            selectedDate={new Date()}
            dateNameStyle={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), fontWeight: '400' }}
            dateNumberStyle={{ fontSize: RFValue(17, STANDARD_SCREEN_SIZE), fontWeight: '400' }}
            style={showHeader ? { height: 102, paddingBottom: 10 } : { height: 102, paddingTop: 20, paddingBottom: 10 }}
            calendarAnimation={{ type: 'parallel', duration: 300 }}
            daySelectionAnimation={{ type: 'background', highlightColor: Colors.lightBlue }}
            markedDates={[
              {
                date: new Date(),
                dots: [
                  {
                    color: Colors.brandBlue,
                    selectedColor: Colors.brandBlue,
                  },
                ],
              },
            ]}
            onHeaderSelected={(a) => console.log(a)}
          />
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={monthData}
          renderItem={({ item }) => renderListItem(item)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: RfH(170) }}
        />
      </ScrollView>
    </View>
  );
}

export default CalendarView;
