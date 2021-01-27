/* eslint-disable no-restricted-syntax */
import { FlatList, Image, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Loader, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { print24Time, RfH, RfW } from '../../../utils/helpers';
import { Colors, Images } from '../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { GET_AVAILABILITY_DATA } from '../../student/class.query';
import { tutorDetails } from '../../../apollo/cache';
import NavigationRouteNames from '../../../routes/screenNames';

function ViewSchedule() {
  const isFocussed = useIsFocused();
  const navigation = useNavigation();
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [isListEmpty, setIsListEmpty] = useState(false);
  const tutorInfo = useReactiveVar(tutorDetails);

  const [getAvailability, { loading: getAvailabilityLoader }] = useLazyQuery(GET_AVAILABILITY_DATA, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      setTimeSlots(
        data.getAvailabilityData.sort((a, b) =>
          moment(a.startDate).format('HH:MM') > moment(b.startDate).format('HH:MM') ? 1 : -1
        )
      );
      setIsListEmpty(data.getAvailabilityData.length === 0);
    },
  });

  const getAvailabilityData = (date) => {
    setSelectedDate(date);

    getAvailability({
      variables: {
        tutorAvailability: {
          tutorId: tutorInfo?.id,
          startDate: moment(date).startOf('day').toDate(),
          endDate: moment(date).endOf('day').toDate(),
        },
      },
    });
  };

  useEffect(() => {
    if (isFocussed) {
      getAvailabilityData(selectedDate);
    }
  }, [isFocussed]);

  const handleCreateSchedule = (selectedDate, timeSlots) => {
    navigation.navigate(NavigationRouteNames.TUTOR.UPDATE_SCHEDULE, { selectedDate, timeSlots });
  };

  const renderItem = (item) => {
    return (
      <View style={{ marginTop: RfH(16) }}>
        <View style={[commonStyles.horizontalChildrenSpaceView, { paddingVertical: RfH(10) }]}>
          <Text style={commonStyles.regularPrimaryText}>
            {print24Time(item.startDate)} - {print24Time(item.endDate)}
          </Text>
          <Text style={[commonStyles.regularPrimaryText, { color: item.active ? Colors.green : Colors.orangeRed }]}>
            {item.active ? (item.classScheduled ? 'Class Scheduled' : 'Active') : 'Inactive'}
          </Text>
        </View>
        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
      </View>
    );
  };

  return (
    <>
      <Loader isLoading={getAvailabilityLoader} />
      <View style={[commonStyles.mainContainer, { paddingHorizontal: RfW(0), backgroundColor: Colors.white }]}>
        <ScreenHeader
          homeIcon
          label="My Availability"
          horizontalPadding={RfW(16)}
          showRightIcon
          rightIcon={Images.add}
          onRightIconClick={() => handleCreateSchedule(new Date(), {})}
        />
        <View style={{ height: RfH(44) }} />
        <View style={{ paddingHorizontal: RfW(16) }}>
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
              selectedDate={selectedDate}
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
              style={{ height: 102, paddingBottom: 10 }}
              calendarAnimation={{ type: 'parallel', duration: 300 }}
              daySelectionAnimation={{ type: 'background', highlightColor: Colors.lightBlue }}
              // markedDates={[
              //   {
              //     date: new Date(),
              //     dots: [
              //       {
              //         color: Colors.brandBlue,
              //         selectedColor: Colors.brandBlue,
              //       },
              //     ],
              //   },
              // ]}
              onHeaderSelected={(a) => console.log(a)}
              onDateSelected={(d) => getAvailabilityData(d)}
            />
          </View>
        </View>
        {!isListEmpty ? (
          <FlatList
            data={timeSlots}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: RfW(16), paddingBottom: RfH(84) }}
          />
        ) : (
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
              Availability Not Marked
            </Text>
            <Text
              style={[
                commonStyles.regularMutedText,
                { marginHorizontal: RfW(60), textAlign: 'center', marginTop: RfH(16) },
              ]}>
              Let students know when you are available. Mark your Availability now!
            </Text>
            <View style={{ height: RfH(40) }} />
            {moment(selectedDate).isSameOrAfter() && (
              <Button
                block
                style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}
                onPress={() => handleCreateSchedule(selectedDate, {})}>
                <Text style={commonStyles.textButtonPrimary}>Create Schedule</Text>
              </Button>
            )}
          </View>
        )}
        {/* {isListEmpty && moment(selectedDate).isSameOrAfter() && ( */}
        {/*  <View */}
        {/*    style={{ */}
        {/*      flexDirection: 'row', */}
        {/*      justifyContent: 'center', */}
        {/*      bottom: 0, */}
        {/*      backgroundColor: Colors.white, */}
        {/*      left: 0, */}
        {/*      right: 0, */}
        {/*      position: 'absolute', */}
        {/*    }}> */}
        {/*    <View style={{ paddingBottom: RfH(32), paddingTop: RfH(8) }}> */}
        {/*      <Button */}
        {/*        style={[commonStyles.buttonPrimary, { width: RfW(144), alignSelf: 'center' }]} */}
        {/*        onPress={() => handleCreateSchedule(selectedDate, timeSlots)}> */}
        {/*        <Text style={commonStyles.textButtonPrimary}>Add Availability</Text> */}
        {/*      </Button> */}
        {/*    </View> */}
        {/*  </View> */}
        {/* )} */}
      </View>
    </>
  );
}

export default ViewSchedule;
