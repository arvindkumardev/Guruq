/* eslint-disable radix */
import { Text, View, FlatList, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import { Button, Input, Item, Picker, Spinner, Switch } from 'native-base';
import { useMutation, useReactiveVar } from '@apollo/client';
import moment from 'moment';
import { IconButtonWrapper, ScreenHeader } from '../../../../components';
import { RfH, RfW } from '../../../../utils/helpers';
import commonStyles from '../../../../theme/styles';
import { Colors, Images } from '../../../../theme';
import { tutorDetails } from '../../../../apollo/cache';
import { UPDATE_AVAILABILITY } from '../../tutor.mutation';
import CustomDatePicker from '../../../../components/CustomDatePicker';

function UpdateSchedule() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const tutorInfo = useReactiveVar(tutorDetails);

  const getHour = (hoursString) => {
    const [hoursPart, minutesPart] = hoursString.split(':');
    return Number(hoursPart);
  };

  const getMinutes = (hoursString) => {
    const [hoursPart, minutesPart] = hoursString.split(':');
    return Number(minutesPart);
  };

  const [slots, setSlots] = useState([
    {
      startTime: '00:00',
      endTime: '08:00',
      active: false,
    },
    {
      startTime: '08:00',
      endTime: '13:00',
      active: true,
    },
    {
      startTime: '13:00',
      endTime: '18:00',
      active: true,
    },
    {
      startTime: '18:00',
      endTime: '23:59',
      active: false,
    },
  ]);

  const getEndTime = (time, endTimeLabel, index) => {
    const endTime = [];
    if (time && endTimeLabel) {
      let sTime = getHour(time);
      const eTime = parseInt(getHour(endTimeLabel));
      const sMinutes = getMinutes(time);
      if (sTime === 24) {
        sTime = 0;
      }
      for (let i = sTime + 1; i <= eTime; i++) {
        endTime.push({ time: `${i < 10 ? `0${i}` : i}:${sMinutes < 10 ? `0${sMinutes}` : sMinutes}` });
      }
      if (index === slots.length - 1) {
        endTime.push({ time: '23:59' });
      }
    }
    return endTime;
  };

  const setEndTime = (value, index) => {
    const arrTime = [];
    slots.map((obj) => {
      arrTime.push(obj);
    });
    arrTime[index].endTime = value;
    if (arrTime[index + 1]) {
      const sTime = parseInt(getHour(value)) + 1;
      const eTime = getMinutes(value);
      arrTime[index + 1].startTime = `${sTime < 10 ? `0${sTime}` : sTime}:${eTime < 10 ? `0${eTime}` : eTime}`;
    }
    setSlots(arrTime);
  };

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

  const onUpdating = () => {
    const availableArray = [];
    slots.map((obj) => {
      availableArray.push({
        startTime: `${moment(startDate + obj.startTime, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:s')}0+05:30`,
        endTime: `${moment(startDate + obj.endTime, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:s')}0+05:30`,
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
  };

  const addSlot = () => {
    const arrTime = [];
    slots.map((obj) => {
      arrTime.push(obj);
    });
    arrTime.splice(slots.length - 1, 1);
    const sTime = parseInt(getHour(arrTime[slots.length - 2].endTime));
    const eTime = parseInt(getMinutes(arrTime[slots.length - 2].endTime));
    const endStartTime = sTime + 1;
    const newObj = {
      startName: `${sTime < 10 ? `0${sTime}` : sTime}:${eTime < 10 ? `0${eTime}` : eTime}`,
      endDate: `${endStartTime < 10 ? `0${endStartTime}` : endStartTime}:${eTime < 10 ? `0${eTime}` : eTime}`,
      active: true,
    };
    arrTime.push(newObj);
    const lastObj = {
      startName: `${endStartTime < 10 ? `0${endStartTime}` : endStartTime}:${eTime < 10 ? `0${eTime}` : eTime}`,
      endDate: '24:00',
      active: true,
    };
    arrTime.push(lastObj);
    setSlots(arrTime);
  };

  const renderItem = (item, index) => {
    const endTime = getEndTime(item?.startTime, item?.endTime, index);
    return (
      <View>
        {index === slots.length - 1 && (
          <View style={{ paddingHorizontal: RfW(16), marginTop: RfH(16) }}>
            <Button onPress={() => addSlot()} block style={{ backgroundColor: Colors.lightGrey }}>
              <Text style={{ color: Colors.brandBlue, marginRight: RfW(8) }}>Add Slot</Text>
              <IconButtonWrapper iconWidth={RfW(20)} iconHeight={RfH(20)} iconImage={Images.plus_blue} />
            </Button>
          </View>
        )}
        <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(16) }]}>
          <View style={[commonStyles.horizontalChildrenSpaceView, { flex: 0.33 }]}>
            <Text>{item?.startTime}</Text>
            <Text>-</Text>
          </View>
          <View style={[commonStyles.horizontalChildrenView, { backgroundColor: Colors.lightGrey, borderRadius: 8 }]}>
            <Picker selectedValue={item?.endTime} onValueChange={(value) => setEndTime(value, index)}>
              {endTime.map((obj) => {
                return <Picker.Item label={obj?.time} value={obj?.time} />;
              })}
            </Picker>
            <IconButtonWrapper iconImage={Images.expand} iconHeight={RfH(24)} iconWidth={RfW(24)} />
          </View>
          <View>
            <Switch value={item?.active} />
          </View>
        </View>
      </View>
    );
  };

  const onStartDateChange = (d) => {
    setStartDate(d);
  };

  const onEndDateChange = (d) => {
    setEndDate(d);
  };

  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
      <ScreenHeader label="Update Availability" homeIcon horizontalPadding={RfW(16)} />
      <View style={{ height: RfH(44) }} />
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
              <Input value={startDate} onChangeText={(text) => setStartDate(text)} />
              <CustomDatePicker value={startDate} onChangeHandler={(d) => onStartDateChange(d)} />
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
              <Input value={endDate} onChangeText={(text) => setEndDate(text)} />
              <CustomDatePicker value={endDate} onChangeHandler={(d) => onEndDateChange(d)} />
            </Item>
          </View>
        </View>
      </View>
      <View style={[commonStyles.blankGreyViewSmall, { marginTop: RfH(16), height: RfH(8) }]} />
      <View style={{ height: RfH(24) }} />
      <View>
        <FlatList
          data={slots}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          bottom: RfH(32),
          left: 0,
          right: 0,
          position: 'absolute',
        }}>
        <Button
          onPress={() => onUpdating()}
          style={[commonStyles.buttonPrimary, { width: RfW(144), alignSelf: 'center' }]}>
          <Text style={commonStyles.textButtonPrimary}>Save</Text>
        </Button>
      </View>
    </View>
  );
}

export default UpdateSchedule;
