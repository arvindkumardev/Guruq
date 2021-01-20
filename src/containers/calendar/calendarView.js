/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Button } from 'native-base';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { RFValue } from 'react-native-responsive-fontsize';
import { IconButtonWrapper, Loader } from '../../components';
import routeNames from '../../routes/screenNames';
import { Colors, Images } from '../../theme';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { getFullName, getSubjectIcons, printDate, printTime, RfH, RfW } from '../../utils/helpers';
import { GET_SCHEDULED_CLASSES } from '../student/booking.query';
import { userType } from '../../apollo/cache';
import { UserTypeEnum } from '../../common/userType.enum';

function CalendarView(props) {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const userTypeVal = useReactiveVar(userType);
  const isStudent = userTypeVal === UserTypeEnum.STUDENT.label;

  const [showHeader, setShowHeader] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const [scheduledClasses, setScheduledClasses] = useState([]);
  const [allScheduledClasses, setAllScheduledClasses] = useState([]);
  const [markedDates, setMarkeddates] = useState([]);

  // const [getScheduledClasses, { loading: loadingScheduledClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
  //   fetchPolicy: 'no-cache',
  //   onError: (e) => {
  //     console.log(e);
  //   },
  //   onCompleted: (data) => {
  //     setScheduledClasses(data.getScheduledClasses);
  //     setIsEmpty(data.getScheduledClasses.length === 0);
  //     setRefresh((refresh) => !refresh);
  //   },
  // });

  const [getScheduledClassesForWeek, { loading: loadingScheduledCountClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      const dateArray = [];
      for (const obj of data.getScheduledClasses) {
        const dateObj = {
          date: obj.startDate,
          dots: [
            {
              color: Colors.brandBlue,
              selectedColor: Colors.brandBlue,
            },
          ],
        };
        dateArray.push(dateObj);
      }
      setMarkeddates(dateArray);
      setAllScheduledClasses(data.getScheduledClasses);

      console.log('selectedDate', selectedDate);

      setRefresh((refresh) => !refresh);
    },
  });

  const classDetailNavigation = (uuid) => {
    navigation.navigate(routeNames.SCHEDULED_CLASS_DETAILS, { uuid });
  };

  const renderClassItem = (classDetails) => (
    <TouchableWithoutFeedback onPress={() => classDetailNavigation(classDetails.uuid)}>
      <View
        style={[
          commonStyles.horizontalChildrenStartView,
          { marginBottom: RfH(24), opacity: moment(classDetails.endDate).isBefore(new Date()) ? 0.5 : 1 },
        ]}>
        <View
          style={{
            height: RfH(72),
            width: RfW(72),
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IconButtonWrapper
            iconHeight={RfH(72)}
            iconWidth={RfW(72)}
            styling={{ alignSelf: 'center', borderRadius: RfH(8) }}
            iconImage={getSubjectIcons(classDetails?.offering?.displayName)}
          />
        </View>
        <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8), flex: 1 }]}>
          <Text style={commonStyles.headingPrimaryText} numberOfLines={2}>
            {isStudent
              ? `${classDetails?.offering?.displayName} by ${getFullName(classDetails?.tutor?.contactDetail)}`
              : `${classDetails?.offering?.displayName} Class for ${getFullName(
                  classDetails?.students[0].contactDetail
                )}`}
          </Text>
          <Text style={commonStyles.mediumMutedText} numberOfLines={1}>
            {`${classDetails?.offering?.parentOffering?.displayName} | ${classDetails?.offering?.parentOffering?.parentOffering?.displayName}`}
          </Text>
          <Text style={commonStyles.mediumMutedText}>
            {`${printTime(classDetails.startDate)} - ${printTime(classDetails.endDate)}`}
          </Text>
          <Text style={commonStyles.mediumMutedText}>
            {`${classDetails?.onlineClass ? 'Online' : 'Home Tuition'} ${
              classDetails?.groupClass ? 'Group' : 'Individual'
            } ${classDetails?.demo ? 'Demo' : ''}Class`}
          </Text>
        </View>
        <View />
      </View>
    </TouchableWithoutFeedback>
  );

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    setShowHeader(scrollPosition > 30);
  };

  // const getScheduledClassesByDate = (date) => {
  //   setSelectedDate(date);
  //   // setScheduledClasses(allScheduledClasses.filter((c) => moment(c.startDate).isSame(moment(date), 'date')));
  //   // getScheduledClasses({
  //   //   variables: {
  //   //     classesSearchDto: {
  //   //       startDate: printDate(date),
  //   //       endDate: printDate(date),
  //   //     },
  //   //   },
  //   // });
  // };

  const getScheduledClassesForWeekData = (startDate) => {
    console.log('getScheduledClassesForWeekData', moment(startDate).toDate());

    // setSelectedDate(moment(startDate).toDate());

    getScheduledClassesForWeek({
      variables: {
        classesSearchDto: {
          startDate: moment(startDate).isoWeekday(1).startOf('day'),
          endDate: moment(startDate).isoWeekday(7).endOf('day'),
        },
      },
    });
  };

  useEffect(() => {
    if (isFocussed) {
      // getScheduledClassesByDate(selectedDate);
      getScheduledClassesForWeekData(new Date());
    }
  }, [isFocussed]);

  return (
    <>
      <Loader isLoading={loadingScheduledCountClasses} />

      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
        <View style={[commonStyles.horizontalChildrenEqualSpaceView, { height: RfH(44), justifyContent: 'center' }]}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            {showHeader && <Text style={commonStyles.headingPrimaryText}>Your Schedule</Text>}
          </View>
          {/* <View style={{ alignItems: 'flex-end' }}> */}
          {/*  <IconButtonWrapper */}
          {/*    iconHeight={RfH(24)} */}
          {/*    iconImage={Images.calendar} */}
          {/*    iconWidth={RfW(20 )} */}
          {/*    imageResizeMode="contain" */}
          {/*    submitFunction={() => navigation.navigate(routeNames.MONTH_CALENDAR_VIEW)} */}
          {/*  /> */}
          {/* </View> */}
        </View>
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
                disabledDateNameStyle={{ color: Colors.black }}
                disabledDateNumberStyle={{ color: Colors.black }}
                selectedDate={new Date()}
                dateNameStyle={{
                  fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
                  fontWeight: '400',
                  color: Colors.black,
                }}
                dateNumberStyle={{
                  fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
                  fontWeight: '400',
                  color: Colors.black,
                }}
                style={
                  showHeader
                    ? { height: 102, paddingBottom: 10 }
                    : {
                        height: 102,
                        paddingTop: 20,
                        paddingBottom: 10,
                      }
                }
                calendarAnimation={{ type: 'parallel', duration: 300 }}
                daySelectionAnimation={{ type: 'background', highlightColor: Colors.lightBlue }}
                markedDates={markedDates}
                onHeaderSelected={(a) => console.log(a)}
                onWeekChanged={(start, end) => {
                  getScheduledClassesForWeekData(start);
                }}
                onDateSelected={(d) => {
                  if (!d.isSame(selectedDate, 'day')) {
                    setSelectedDate(d.toDate());
                  }
                }}
              />
            </View>

            <View style={commonStyles.lineSeparatorWithVerticalMargin} />
            {allScheduledClasses &&
            allScheduledClasses.filter((c) => moment(c.startDate).isSame(moment(selectedDate), 'day')).count === 0 ? (
              <View>
                <Image
                  source={Images.empty_schedule}
                  style={{
                    alignSelf: 'center',
                    height: RfH(200),
                    width: RfW(164),
                    marginBottom: RfH(32),
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    commonStyles.pageTitleThirdRow,
                    { fontSize: RFValue(20, STANDARD_SCREEN_SIZE), textAlign: 'center' },
                  ]}>
                  {isStudent ? "You Haven't scheduled class" : "You don't have scheduled classes"}
                </Text>
                <Text
                  style={[
                    commonStyles.regularMutedText,
                    { marginHorizontal: RfW(40), textAlign: 'center', marginTop: RfH(16) },
                  ]}>
                  {isStudent
                    ? 'Looks like you have not scheduled any class yet.'
                    : "Looks like you don't have  scheduled classes for the selected day."}
                </Text>
                <View style={{ height: RfH(40) }} />

                {isStudent && (
                  <Button
                    block
                    style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}
                    onPress={() => navigation.navigate(routeNames.STUDENT.MY_CLASSES)}>
                    <Text style={commonStyles.textButtonPrimary}>{isStudent ? 'Schedule Now' : 'View Classes'}</Text>
                  </Button>
                )}
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={
                  allScheduledClasses &&
                  allScheduledClasses.filter((c) => moment(c.startDate).isSame(moment(selectedDate), 'date'))
                }
                renderItem={({ item }) => renderClassItem(item)}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: RfH(170) }}
                extraData={refresh}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </>
  );
}

CalendarView.propTypes = {
  changeTab: PropTypes.func,
};

CalendarView.defaultProps = {
  changeTab: null,
};

export default CalendarView;
