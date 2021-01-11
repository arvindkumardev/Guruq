/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Button } from 'native-base';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActionSheet, IconButtonWrapper, Loader } from '../../components';
import routeNames from '../../routes/screenNames';
import { Colors, Images } from '../../theme';
import { getBoxColor } from '../../theme/colors';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { endOfDay, getFullName, getSubjectIcons, printTime, RfH, RfW, startOfDay } from '../../utils/helpers';
import { GET_SCHEDULED_CLASSES } from '../student/booking.query';
import { userType } from '../../apollo/cache';
import { UserTypeEnum } from '../../common/userType.enum';

function CalendarView(props) {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const userTypeVal = useReactiveVar(userType);
  const isStudent = userTypeVal === UserTypeEnum.STUDENT.label;
  const { changeTab } = props;

  const [showHeader, setShowHeader] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduledClasses, setScheduledClasses] = useState([]);
  const [allScheduledClasses, setAllScheduledClasses] = useState([]);
  const [markedDates, setMarkeddates] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [currentView, setCurrentView] = useState(0);

  const [getScheduledClasses, { loading: loadingScheduledClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      setScheduledClasses(data.getScheduledClasses);
      setIsEmpty(data.getScheduledClasses.length === 0);
      setRefresh((refresh) => !refresh);
    },
  });

  const [getScheduledClassesCount, { loading: loadingScheduledCountClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
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
      setRefresh((refresh) => !refresh);
    },
  });

  const classDetailNavigation = (classId) => {
    navigation.navigate(routeNames.STUDENT.SCHEDULED_CLASS_DETAILS, { classId });
  };

  const renderClassItem = (classDetails) => (
    <TouchableWithoutFeedback onPress={() => classDetailNavigation(classDetails.id)}>
      <View
        style={[
          commonStyles.horizontalChildrenStartView,
          { marginBottom: RfH(24), opacity: moment(classDetails.endDate).isBefore(new Date()) ? 0.5 : 1 },
        ]}>
        <View
          style={{
            height: RfH(72),
            width: RfW(72),
            backgroundColor: getBoxColor(classDetails?.offering?.displayName),
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IconButtonWrapper
            iconHeight={RfH(56)}
            iconWidth={RfW(48)}
            styling={{ alignSelf: 'center' }}
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
            {classDetails?.onlineClass ? 'Online' : 'Offline'} {classDetails?.groupClass ? 'Group' : 'Individual'} Class
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

  const getScheduledClassesByDate = (date) => {
    setScheduledClasses([]);
    setSelectedDate(date);
    getScheduledClasses({
      variables: {
        classesSearchDto: {
          startDate: startOfDay(date),
          endDate: endOfDay(date),
        },
      },
    });
  };

  const getScheduledClassesForWeek = (startDate) => {
    getScheduledClassesCount({
      variables: {
        classesSearchDto: {
          startDate,
          endDate: moment(startDate, 'DD-MM-YYYY').add(6, 'days'),
        },
      },
    });
  };

  const changeToListView = () => {
    setCurrentView(1);
    setOpenMenu(false);
    setRefresh((refresh) => !refresh);
  };

  const changeToWeekView = () => {
    setCurrentView(0);
    setOpenMenu(false);
    setRefresh((refresh) => !refresh);
  };

  const changeToMonthView = () => {
    setCurrentView(2);
    setOpenMenu(false);
    setRefresh((refresh) => !refresh);
  };

  const [menuItem, setMenuItem] = useState([
    { label: 'Week View', handler: changeToWeekView, isEnabled: true },
    { label: 'List View', handler: changeToListView, isEnabled: true },
    { label: 'Month View', handler: changeToMonthView, isEnabled: true },
  ]);

  useEffect(() => {
    if (isFocussed) {
      getScheduledClassesByDate(selectedDate);
      getScheduledClassesForWeek(moment());
    }
  }, [isFocussed]);

  return (
    <>
      <Loader isLoading={loadingScheduledClasses} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
        <View style={[commonStyles.horizontalChildrenView, { height: RfH(44), justifyContent: 'center' }]}>
          {showHeader && <Text style={[commonStyles.headingPrimaryText, { alignSelf: 'center' }]}>Your Schedule</Text>}
          <IconButtonWrapper
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
            iconImage={Images.filter}
            submitFunction={() => setOpenMenu(true)}
            styling={{ alignSelf: 'flex-end' }}
          />
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
                onWeekChanged={(start, end) => getScheduledClassesForWeek(start)}
                onDateSelected={(d) => getScheduledClassesByDate(d)}
              />
            </View>

            <View style={commonStyles.lineSeparatorWithVerticalMargin} />
            {isEmpty ? (
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
                    onPress={() => changeTab(3)}>
                    <Text style={commonStyles.textButtonPrimary}>{isStudent ? 'Schedule Now' : 'View Classes'}</Text>
                  </Button>
                )}
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={scheduledClasses}
                renderItem={({ item }) => renderClassItem(item)}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: RfH(170) }}
                extraData={refresh}
              />
            )}
          </ScrollView>
        </View>
        {openMenu && (
          <ActionSheet
            actions={menuItem}
            cancelText="Dismiss"
            handleCancel={() => setOpenMenu(false)}
            isVisible={openMenu}
            topLabel=""
          />
        )}
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
