/* eslint-disable react/no-typos */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Button } from 'native-base';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { RFValue } from 'react-native-responsive-fontsize';
import { tutorDetails } from '../../../apollo/cache';
import { IconButtonWrapper } from '../../../components';
import routeNames from '../../../routes/screenNames';
import { Colors, Images } from '../../../theme';
import { getBoxColor } from '../../../theme/colors';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { getFullName, getSubjectIcons, monthNames, RfH, RfW } from '../../../utils/helpers';
import { GET_SCHEDULED_CLASSES } from '../../student/booking.query';

function CalendarView(props) {
  const navigation = useNavigation();
  const [showHeader, setShowHeader] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const { changeTab } = props;

  const tutorInfo = useReactiveVar(tutorDetails);

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
        const startHours = new Date(obj.startDate).getHours();
        const startMinutes = new Date(obj.startDate).getMinutes();
        const endHours = new Date(obj.endDate).getHours();
        const endMinutes = new Date(obj.endDate).getMinutes();
        const timing = `${startHours < 10 ? `0${startHours}` : startHours}:${
          startMinutes < 10 ? `0${startMinutes}` : startMinutes
        } ${startHours < 12 ? `AM` : 'PM'} - ${endHours < 10 ? `0${endHours}` : endHours}:${
          endMinutes < 10 ? `0${endMinutes}` : endMinutes
        } ${endHours < 12 ? `AM` : 'PM'}`;
        const item = {
          date: new Date(obj.startDate).getDate(),
          month: new Date(obj.startDate).getMonth(),
          classes: [
            {
              uuid: obj.uuid,
              classTitle: obj.offering.displayName,
              board: obj.offering.parentOffering.parentOffering.displayName,
              class: obj.offering.parentOffering.displayName,
              timing,
              id: obj.id,
              students: obj.students,
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

  const renderClassItem = (item) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate(routeNames.STUDENT.SCHEDULED_CLASS_DETAILS, { classDetails: item })}>
        <View style={[commonStyles.horizontalChildrenStartView, { marginTop: RfH(32) }]}>
          <View
            style={{
              height: RfH(72),
              width: RfW(72),
              backgroundColor: getBoxColor(item.classTitle),
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <IconButtonWrapper
              iconHeight={RfH(56)}
              iconWidth={RfW(48)}
              styling={{ alignSelf: 'center' }}
              iconImage={getSubjectIcons(item.classTitle)}
            />
          </View>
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <Text style={commonStyles.headingPrimaryText}>
              {item.classTitle}{' '}
              {item.students.length > 1 ? 'Group Class' : `Class for ${getFullName(item.students[0].contactDetail)}`}
            </Text>
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

  const getScheduledClassesbyDay = (date) => {
    getScheduledClasses({
      variables: {
        classesSearchDto: {
          tutorId: tutorInfo.id,
          startDate: moment(date).startOf('day').toDate(),
          endDate: moment(date).endOf('day').toDate(),
        },
      },
    });
  };

  useEffect(() => {
    getScheduledClasses(new Date());
  }, []);

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
      <View style={{ height: RfH(44), alignItems: 'center', justifyContent: 'center' }}>
        {showHeader && <Text style={commonStyles.headingPrimaryText}>Your Schedule</Text>}
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
              disabledDateNameStyle={{ color: Colors.darkGrey }}
              disabledDateNumberStyle={{ color: Colors.darkGrey }}
              selectedDate={new Date()}
              dateNameStyle={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), fontWeight: '400' }}
              dateNumberStyle={{ fontSize: RFValue(17, STANDARD_SCREEN_SIZE), fontWeight: '400' }}
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
              onDateSelected={(d) => getScheduledClassesbyDay(d)}
            />
          </View>
          {isEmpty ? (
            <View>
              <Image
                source={Images.empty_schedule}
                style={{
                  margin: RfH(56),
                  alignSelf: 'center',
                  height: RfH(200),
                  width: RfW(164),
                  marginBottom: RfH(32),
                }}
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
              <View style={{ height: RfH(40) }} />
              <Button block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]} onPress={() => changeTab(3)}>
                <Text style={commonStyles.textButtonPrimary}>Schedule Now</Text>
              </Button>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={monthData}
              renderItem={({ item }) => renderListItem(item)}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingBottom: RfH(170) }}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
}

CalendarView.propTypes = {
  changeTab: PropTypes.func,
};

CalendarView.defaultProps = {
  changeTab: null,
};

export default CalendarView;
