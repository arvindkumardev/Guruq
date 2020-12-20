/* eslint-disable no-restricted-syntax */
import { FlatList, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button, CheckBox, Item, ListItem } from 'native-base';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import moment from 'moment';
import { ScreenHeader } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { RfH, RfW } from '../../../../utils/helpers';
import { Colors } from '../../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import { GET_AVAILABILITY } from '../../../student/class.query';
import { tutorDetails } from '../../../../apollo/cache';

function ViewSchedule() {
  const [timeSlots, setTimeSlots] = useState([]);
  const tutorInfo = useReactiveVar(tutorDetails);

  const [getAvailability, { loading: availabilityError }] = useLazyQuery(GET_AVAILABILITY, {
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      setTimeSlots([]);
      const dateObj = [];
      for (const obj of data.getAvailability) {
        const sHours = new Date(obj.startDate).getHours();
        const sMin = new Date(obj.startDate).getMinutes();
        const eHours = new Date(obj.endDate).getHours();
        const eMin = new Date(obj.endDate).getMinutes();
        dateObj.push({
          slot: `${`${sHours < 10 ? `0${sHours}` : sHours}:${sMin < 10 ? `0${sMin}` : sMin}`} - ${`${
            eHours < 10 ? `0${eHours}` : eHours
          }:${eMin < 10 ? `0${eMin}` : eMin}`}`,
          isActive: obj.active,
        });
      }
      setTimeSlots(dateObj);
    },
  });

  const getAvailabilityData = (date) => {
    getAvailability({
      variables: {
        tutorAvailability: {
          tutorId: tutorInfo?.id,
          startDate: moment(date).toDate(),
          endDate: moment(date).endOf('day').toDate(),
        },
      },
    });
  };

  useEffect(() => {
    getAvailabilityData(new Date());
  }, []);

  const onCheckPressed = (index) => {
    const arrSlots = [];
    timeSlots.map((obj) => {
      arrSlots.push(obj);
    });
    arrSlots[index].isActive = !arrSlots[index].isActive;
    console.log(arrSlots);
    setTimeSlots(arrSlots);
  };

  const renderItem = (item, index) => {
    return (
      <View>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text>{item.slot}</Text>
          <View>
            <ListItem underline={false} style={{ borderBottomWidth: 0 }}>
              <CheckBox checked={item.isActive} onPress={() => onCheckPressed(index)} />
            </ListItem>
          </View>
        </View>
        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
      </View>
    );
  };

  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: RfW(0), backgroundColor: Colors.white }]}>
      <ScreenHeader homeIcon label="Scheduler" horizontalPadding={RfW(16)} />
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
            disabledDateNameStyle={{ color: Colors.darkGrey }}
            disabledDateNumberStyle={{ color: Colors.darkGrey }}
            selectedDate={new Date()}
            dateNameStyle={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), fontWeight: '400' }}
            dateNumberStyle={{ fontSize: RFValue(17, STANDARD_SCREEN_SIZE), fontWeight: '400' }}
            style={{ height: 102, paddingBottom: 10 }}
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
            onDateSelected={(d) => getAvailabilityData(d)}
          />
        </View>
      </View>
      <FlatList
        data={timeSlots}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => renderItem(item, index)}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingLeft: RfW(16), paddingBottom: RfH(84) }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          bottom: 0,
          backgroundColor: Colors.white,
          left: 0,
          right: 0,
          position: 'absolute',
        }}>
        <View style={{ paddingBottom: RfH(32), paddingTop: RfH(8) }}>
          <Button style={[commonStyles.buttonPrimary, { width: RfW(144), alignSelf: 'center' }]}>
            <Text style={commonStyles.textButtonPrimary}>Edit Availability</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default ViewSchedule;
