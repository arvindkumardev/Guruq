/* eslint-disable radix */
import { Text, View, FlatList, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import { Button, Input, Item, Picker, Spinner, Switch } from 'native-base';
import { useMutation, useReactiveVar } from '@apollo/client';
import moment from 'moment';
import { range } from 'lodash';
import { IconButtonWrapper, ScreenHeader, CustomSelect } from '../../../components';
import { RfH, RfW } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { tutorDetails } from '../../../apollo/cache';
import { UPDATE_AVAILABILITY } from '../tutor.mutation';
import CustomDatePicker from '../../../components/CustomDatePicker';

// {
//   startTime: '22:00',
//       endTime: '23:59',
//     active: false,
//     isVisible: false,
// },
// {
//   startTime: '00:00',
//       endTime: '06:00',
//     active: false,
//     isVisible: false,
// },
function UpdateSchedule(props) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [refreshSlots, setRefreshSlots] = useState(false);

  const [updateAvailability, { loading: availabilityLoading }] = useMutation(UPDATE_AVAILABILITY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        Alert.alert('Updated!');
      }
    },
  });

  const [slots, setSlots] = useState([
    {
      startTime: '06:00',
      startInt: 6,
      endTime: '22:00',
      endInt: 22,
      active: true,
      isDeleteAllowed: false,
    },
  ]);

  const getDropdownData = (index) => {
    console.log('index', index);
    let slotRange = [];
    if (index === slots.length - 1) {
      slotRange = range(slots[index].startInt + 1, 23);
    } else {
      slotRange = range(slots[index].startInt + 1, slots[index + 1].startInt + 1);
    }
    return slotRange.map((slot) => ({ label: `${`0${slot}`.slice(-2)}:00`, value: `${`0${slot}`.slice(-2)}:00` }));
  };

  const setEndTime = (value, index) => {
    const slotArr = [];
    if (value) {
      slots.forEach((slot, slotIndex) => {
        if (slotIndex < index) {
          slotArr.push(slot);
        } else if (slotIndex === index + 1) {
          slotArr.push({ ...slot, startTime: value, startInt: parseInt(value.replace(':00', '')) });
        } else {
          slotArr.push({ ...slot, endTime: value, endInt: parseInt(value.replace(':00', '')) });
        }
      });
      setSlots(slotArr);
      setRefreshSlots(true);
    }
  };

  const addSlot = () => {
    const lastSlot = slots[slots.length - 1];
    const newSlot = {
      startTime: lastSlot.endTime,
      startInt: lastSlot.endInt,
      endTime: '',
      endInt: 22,
      active: true,
      isDeleteAllowed: true,
    };
    setSlots((slots) => [...slots, newSlot]);
    setRefreshSlots(true);
  };

  const handleDelete = (index) => {
    const slotArray = [...slots];
    slotArray.splice(index, 1);
    setSlots(slotArray);
    setRefreshSlots(true);
  };

  const onUpdating = () => {
    if (!startDate) {
      Alert.alert('Please select start date!');
    } else if (!endDate) {
      Alert.alert('Please select end date!');
    } else {
      const availableArray = [];
      slots.map((obj) => {
        availableArray.push({
          startTime: `${moment(startDate + obj.startTime, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:s')}0+05:30`,
          endTime: `${moment(startDate + (obj.endTime === '24:00' ? '23:59' : obj.endTime), 'YYYY-MM-DDLT').format(
            'YYYY-MM-DDTHH:mm:s'
          )}0+05:30`,
          active: obj.active,
        });
      });
      updateAvailability({
        variables: {
          tutorAvailability: {
            startDate: `${moment(startDate, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:s')}0+05:30`,
            endDate: `${moment(endDate, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:s')}0+05:30`,
            availableTimes: availableArray,
          },
        },
      });
    }
  };

  const renderItem = (item, index) => (
    <View>
      <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(16) }]}>
        <View style={{ flex: 0.32 }}>
          <Text>{item?.startTime}</Text>
        </View>
        <CustomSelect
          data={getDropdownData(index)}
          value={item?.endTime}
          onChangeHandler={(value) => setEndTime(value, index)}
          containerStyle={{
            flex: 0.32,
            backgroundColor: Colors.lightGrey,
            borderRadius: 8,
            height: RfH(44),
            justifyContent: 'center',
            paddingHorizontal: RfW(10),
          }}
        />
        <View>
          <Switch value={item?.active} />
        </View>
        <IconButtonWrapper
          iconWidth={RfW(20)}
          iconHeight={RfH(20)}
          iconImage={Images.plus_blue}
          submitFunction={() => handleDelete(index)}
        />
      </View>
    </View>
  );

  const onStartDateChange = (d) => {
    setStartDate(d);
  };

  const onEndDateChange = (d) => {
    setEndDate(d);
  };

  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
      <ScreenHeader label="Update Availability" homeIcon horizontalPadding={RfW(16)} />
      <View style={{ height: RfH(30) }} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View style={commonStyles.horizontalChildrenView}>
          <View style={[commonStyles.verticallyStretchedItemsView, { flex: 0.5, marginRight: RfW(8) }]}>
            <Text>Start Date</Text>
            <Item
              style={{
                backgroundColor: Colors.lightGrey,
                borderBottomWidth: 0,
                paddingHorizontal: RfW(8),
                marginTop: RfH(8),
                borderRadius: RfH(8),
              }}>
              <CustomDatePicker onChangeHandler={(d) => onStartDateChange(d)} textInputContainer={{ flex: 1 }} />
            </Item>
          </View>
          <View style={[commonStyles.verticallyStretchedItemsView, { flex: 0.5, marginLeft: RfW(8) }]}>
            <Text>End Date</Text>
            <Item
              style={{
                backgroundColor: Colors.lightGrey,
                borderBottomWidth: 0,
                paddingHorizontal: RfW(8),
                marginTop: RfH(8),
                borderRadius: RfH(8),
              }}>
              <CustomDatePicker onChangeHandler={(d) => onEndDateChange(d)} />
            </Item>
          </View>
        </View>
      </View>
      <View style={[commonStyles.blankGreyViewSmall, { marginTop: RfH(16), height: RfH(1) }]} />
      <View style={{ height: RfH(10) }} />
      <View>
        <FlatList
          data={slots}
          extraData={refreshSlots}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: RfH(30) }}
        />
      </View>
      <View style={{ paddingHorizontal: RfW(16), marginTop: RfH(16) }}>
        <Button onPress={addSlot} block style={{ backgroundColor: Colors.lightGrey }}>
          <Text style={{ color: Colors.brandBlue, marginRight: RfW(8) }}>Add New Slot</Text>
          <IconButtonWrapper iconWidth={RfW(20)} iconHeight={RfH(20)} iconImage={Images.plus_blue} />
        </Button>
      </View>
      <View
        style={{
          justifyContent: 'center',
          bottom: RfH(0),
          left: 0,
          right: 0,
          backgroundColor: Colors.white,
          position: 'absolute',
          paddingBottom: RfH(32),
        }}>
        <Text>Slots creation is allowed in between 06:00 A.M to 10 P.M</Text>
        <Button onPress={onUpdating} style={[commonStyles.buttonPrimary, { width: RfW(144), alignSelf: 'center' }]}>
          <Text style={commonStyles.textButtonPrimary}>Save</Text>
        </Button>
      </View>
    </View>
  );
}

export default UpdateSchedule;
