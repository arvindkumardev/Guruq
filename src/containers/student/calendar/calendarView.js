/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import { FlatList, ScrollView, Text, TouchableWithoutFeedback, View, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useQuery, useReactiveVar } from '@apollo/client';
import { Button } from 'native-base';
import commonStyles from '../../../theme/styles';
import routeNames from '../../../routes/screenNames';
import { RfH, RfW, monthNames } from '../../../utils/helpers';
import { Colors, Fonts, Images } from '../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';

import { IconButtonWrapper } from '../../../components';
import { GET_SCHEDULED_CLASSES } from '../booking.query';
import { studentDetails } from '../../../apollo/cache';

function CalendarView() {
  const navigation = useNavigation();
  const [showHeader, setShowHeader] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const studentInfo = useReactiveVar(studentDetails);

  const [monthData, setMonthData] = useState([]);

  const [getScheduledClasses, { loading: loadingScheduledClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      const array = [];
      for (const obj of data.getScheduledClasses) {
        const startHours = new Date(obj.startDate).getUTCHours();
        const startMinutes = new Date(obj.startDate).getUTCMinutes();
        const endHours = new Date(obj.endDate).getUTCHours();
        const endMinutes = new Date(obj.endDate).getUTCMinutes();
        const timing = `${startHours < 10 ? `0${startHours}` : startHours}:${
          startMinutes < 10 ? `0${startMinutes}` : startMinutes
        } ${startHours < 12 ? `AM` : 'PM'} - ${endHours < 10 ? `0${endHours}` : endHours}:${
          endMinutes < 10 ? `0${endMinutes}` : endMinutes
        } ${endHours < 12 ? `AM` : 'PM'}`;
        const item = {
          date: new Date(obj.startDate).getUTCDate(),
          month: new Date(obj.startDate).getUTCMonth(),
          classes: [
            {
              classTitle: obj.offering.displayName,
              board: obj.offering.parentOffering.parentOffering.displayName,
              class: obj.offering.parentOffering.displayName,
              timing,
              tutors: [{ tutor: Images.kushal }],
            },
          ],
        };
        array.push(item);
      }
      setMonthData(array);
      if (array.length > 0) {
        setIsEmpty(false);
      } else {
        setIsEmpty(true);
      }
    },
  });

  useEffect(() => {
    getScheduledClasses({
      variables: {
        classesSearchDto: {
          studentId: studentInfo.id,
          startDate: new Date(),
          endDate: new Date().setDate(new Date().getDate() + 1),
        },
      },
    });
  }, monthData);

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
            {item.date} {monthNames[item.month]}
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
      {isEmpty ? (
        <View>
          <Image
            source={Images.empty_schedule}
            style={{ margin: RfH(56), alignSelf: 'center', height: RfH(264), width: RfW(224), marginBottom: RfH(32) }}
          />
          <Text
            style={[
              commonStyles.pageTitleThirdRow,
              { fontSize: RFValue(20, STANDARD_SCREEN_SIZE), textAlign: 'center' },
            ]}>
            You Haven't scheduled class
          </Text>
          <Text
            style={[
              commonStyles.regularMutedText,
              { marginHorizontal: RfW(60), textAlign: 'center', marginTop: RfH(16) },
            ]}>
            Looks like you have not scheduled any class yet.
          </Text>
          <View style={{ height: RfH(64) }} />
          <Button block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
            <Text style={commonStyles.textButtonPrimary}>Schedule Now</Text>
          </Button>
        </View>
      ) : (
        <View>
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
                style={
                  showHeader ? { height: 102, paddingBottom: 10 } : { height: 102, paddingTop: 20, paddingBottom: 10 }
                }
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
      )}
    </View>
  );
}

export default CalendarView;
