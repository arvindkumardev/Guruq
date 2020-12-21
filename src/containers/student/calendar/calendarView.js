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
import { studentDetails } from '../../../apollo/cache';
import { IconButtonWrapper } from '../../../components';
import routeNames from '../../../routes/screenNames';
import { Colors, Images } from '../../../theme';
import { getBoxColor } from '../../../theme/colors';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { getSubjectIcons, printTime, RfH, RfW } from '../../../utils/helpers';
import { GET_SCHEDULED_CLASSES } from '../booking.query';

function CalendarView(props) {
  const navigation = useNavigation();
  const [showHeader, setShowHeader] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const { changeTab } = props;

  const studentInfo = useReactiveVar(studentDetails);

  const [scheduledClasses, setScheduledClasses] = useState([]);

  const [getScheduledClasses, { loading: loadingScheduledClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    fetch_policy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      setScheduledClasses(data.getScheduledClasses);
      setIsEmpty(data.getScheduledClasses.length === 0);
    },
  });

  const renderClassItem = (classDetails) => (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate(routeNames.STUDENT.SCHEDULED_CLASS_DETAILS, { classDetails })}>
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
        <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
          <Text style={commonStyles.headingPrimaryText}>
            {`${classDetails?.offering?.displayName} by ${classDetails?.tutor?.contactDetail?.firstName} ${classDetails?.tutor?.contactDetail?.lastName}`}
          </Text>
          <Text style={commonStyles.mediumMutedText}>
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
    getScheduledClasses({
      variables: {
        classesSearchDto: {
          studentId: studentInfo.id,
          startDate: moment(date).startOf('day').toDate(),
          endDate: moment(date).endOf('day').toDate(),
        },
      },
    });
  };

  useEffect(() => {
    getScheduledClassesByDate(new Date());
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
              data={scheduledClasses}
              renderItem={({ item }) => renderClassItem(item)}
              keyExtractor={(index) => index.toString()}
              contentContainerStyle={{ paddingBottom: RfH(170) }}
            />
            // <FlatList
            //   showsVerticalScrollIndicator={false}
            //   data={monthData}
            //   renderItem={({ item }) => renderListItem(item)}
            //   keyExtractor={(item, index) => index.toString()}
            //   contentContainerStyle={{ paddingBottom: RfH(170) }}
            // />
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
