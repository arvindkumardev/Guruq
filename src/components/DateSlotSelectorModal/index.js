/* eslint-disable no-restricted-syntax */
/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, View, FlatList, Text, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CalendarStrip from 'react-native-calendar-strip';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button, Picker } from 'native-base';
import { timing } from 'react-native-reanimated';
import { useLazyQuery } from '@apollo/client';
import { Colors, Images } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import { IconButtonWrapper } from '..';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import commonStyles from '../../theme/styles';
import { GET_AVAILABILITY } from '../../containers/student/class.query';

const dateSlotModal = (props) => {
  const navigation = useNavigation();
  const [selectedTime, setSelectedTime] = useState(null);
  const [availability, setAvailability] = useState([]);
  const { visible, onClose, selectedSlot, onDateChange, onSubmit, times, selectedClassTime, tutorId } = props;

  const [getAvailability, { loading: availabilityError }] = useLazyQuery(GET_AVAILABILITY, {
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      const dateObj = [];
      for (const obj of data.getAvailability) {
        dateObj.push({
          startDate: new Date(obj.startDate),
          endDate: new Date(obj.endDate),
          selected: false,
          active: obj.active,
        });
      }
      setAvailability(dateObj);
    },
  });

  useEffect(() => {
    getAvailability({
      variables: {
        tutorAvailability: {
          tutorId,
          startDate: new Date(),
          endDate: new Date(),
        },
      },
    });
  }, []);

  useEffect(() => {
    if (times) {
      setSelectedTime(times[0]?.startTime);
    }
  }, [times]);

  const selectedClassSlot = (item, index) => {
    if (selectedSlot) {
      selectedSlot(item, index);
    }
  };

  const renderSlots = (item, index) => {
    const startHours = new Date(item.startDate).getUTCHours();
    const startMinutes = new Date(item.startDate).getUTCMinutes();
    const endHours = new Date(item.endDate).getUTCHours();
    const endMinutes = new Date(item.endDate).getUTCMinutes();
    return (
      <TouchableWithoutFeedback onPress={() => selectedClassSlot(item, index)}>
        <View
          style={{
            backgroundColor: !item.active ? Colors.lightGrey : item.selected ? Colors.lightGreen : Colors.lightBlue,
            padding: 8,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            marginHorizontal: RfW(4),
            marginVertical: RfH(4),
          }}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
            }}>
            {startHours < 10 ? `0${startHours}` : startHours}:{startMinutes < 10 ? `0${startMinutes}` : startMinutes}{' '}
            {startHours < 12 ? 'AM' : 'PM'} - {endHours < 10 ? `0${endHours}` : endHours}:
            {endMinutes < 10 ? `0${endMinutes}` : endMinutes} {endHours < 12 ? 'AM' : 'PM'}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const selectedStartTime = (value) => {
    setSelectedTime(value);
    selectedClassTime(value);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      backdropOpacity={1}
      visible={visible}
      onRequestClose={() => {
        onClose(false);
      }}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'column' }} />
      <View
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          position: 'absolute',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          backgroundColor: Colors.white,
          opacity: 1,
          paddingBottom: RfH(34),
        }}>
        <IconButtonWrapper
          iconHeight={RfH(24)}
          iconWidth={RfW(24)}
          styling={{ alignSelf: 'flex-end', marginRight: RfW(16), marginTop: RfH(16) }}
          iconImage={Images.cross}
          submitFunction={() => onClose(false)}
        />
        <View style={{ paddingHorizontal: RfW(16) }}>
          <CalendarStrip
            calendarHeaderStyle={{
              fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
              alignSelf: 'flex-start',
              paddingBottom: RfH(8),
            }}
            selectedDate={new Date()}
            highlightDateNumberStyle={{ color: Colors.brandBlue2 }}
            highlightDateNameStyle={{ color: Colors.brandBlue2 }}
            disabledDateNameStyle={{ color: Colors.darkGrey }}
            disabledDateNumberStyle={{ color: Colors.darkGrey }}
            dateNameStyle={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), fontWeight: '400' }}
            dateNumberStyle={{ fontSize: RFValue(17, STANDARD_SCREEN_SIZE), fontWeight: '400' }}
            style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
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
        <View style={{ paddingHorizontal: RfW(16), marginTop: RfH(48) }}>
          <Text style={{ fontFamily: 'SegoeUI-Bold', fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>Select Slot</Text>
        </View>
        <View style={{ alignItems: 'center', paddingTop: RfH(24) }}>
          <FlatList
            style={{ height: RfH(200) }}
            data={availability}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => renderSlots(item, index)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: RfW(8) }}
          />
        </View>
        {times.length > 0 && (
          <View>
            <View style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(16) }]}>
              <Text style={{ fontFamily: 'SegoeUI-Bold', fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>
                Select Start Time
              </Text>
              <Text style={{ fontFamily: 'SegoeUI-Bold', fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>End Time</Text>
            </View>
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <Picker
                iosHeader="Start Time"
                Header="Start Time"
                mode="dropdown"
                textStyle={{ color: Colors.brandBlue2 }}
                placeholder="Select Start Time"
                selectedValue={selectedTime}
                onValueChange={(value) => selectedStartTime(value)}>
                {times.map((obj, i) => {
                  return (
                    <Picker.Item
                      label={`${new Date(obj.startTime).getUTCHours()}:${new Date(obj.startTime).getUTCMinutes()}`}
                      value={obj.startTime}
                      key={i}
                    />
                  );
                })}
              </Picker>
              <Text style={{ marginRight: RfW(16) }}>
                {`${new Date(
                  new Date(selectedTime).setUTCHours(new Date(selectedTime).getUTCHours() + 1)
                ).getUTCHours()}:${new Date(
                  new Date(selectedTime).setUTCHours(new Date(selectedTime).getUTCHours() + 1)
                ).getUTCMinutes()}`}
              </Text>
            </View>
          </View>
        )}
        {onSubmit && (
          <View
            style={{
              marginTop: RfH(24),
              marginBottom: RfH(34),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Button onPress={() => onSubmit()} style={commonStyles.buttonPrimary} block>
              <Text style={commonStyles.textButtonPrimary}>Schedule Class</Text>
            </Button>
          </View>
        )}
      </View>
    </Modal>
  );
};

dateSlotModal.defaultProps = {
  visible: false,
  onClose: null,
  times: [],
  selectedSlot: null,
  onDateChange: null,
  onSubmit: null,
  selectedClassTime: null,
  tutorId: 0,
};

dateSlotModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  times: PropTypes.array,
  selectedSlot: PropTypes.func,
  onDateChange: PropTypes.func,
  onSubmit: PropTypes.func,
  selectedClassTime: PropTypes.func,
  tutorId: PropTypes.number,
};

export default dateSlotModal;
