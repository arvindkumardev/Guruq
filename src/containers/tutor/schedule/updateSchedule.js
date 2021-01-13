/* eslint-disable radix */
import { FlatList, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Switch } from 'native-base';
import { useMutation } from '@apollo/client';
import moment from 'moment';
import { isEmpty, range } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { CustomSelect, IconButtonWrapper, Loader, ScreenHeader } from '../../../components';
import { alertBox, RfH, RfW } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { UPDATE_AVAILABILITY } from '../tutor.mutation';
import CustomDatePicker from '../../../components/CustomDatePicker';

const DEFAULT_SLOT = {
  startTime: '00:00',
  startInt: 0,
  endTime: '24:00',
  endInt: 24,
  active: true,
};

function UpdateSchedule(props) {
  const navigation = useNavigation();
  const timeSlots = props?.route?.params.timeSlots;
  const selectedDate = props?.route?.params.selectedDate;
  const [startDate, setStartDate] = useState(selectedDate);
  const [endDate, setEndDate] = useState(selectedDate);
  const [refreshSlots, setRefreshSlots] = useState(false);
  const [slots, setSlots] = useState([]);

  const [updateAvailability, { loading: availabilityLoading }] = useMutation(UPDATE_AVAILABILITY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Scheduled saved successfully!', '', {
          positiveText: 'Ok',
          onPositiveClick: () => navigation.goBack(),
        });
      }
    },
  });

  useEffect(() => {
    if (!isEmpty(timeSlots)) {
      const slotArr = [];
      timeSlots.forEach((slot) => {
        const startTime = moment(slot.startDate).format('HH:mm');
        const endTime = moment(slot.endDate).format('HH:mm');
        slotArr.push({
          startTime,
          startInt: parseInt(startTime.replace(':00', '')),
          endTime,
          endInt: parseInt(endTime.replace(':00', '')),
          active: slot.active,
        });
      });
      setSlots(slotArr);
    } else {
      setSlots([DEFAULT_SLOT]);
    }
    setRefreshSlots(true);
  }, []);

  const getDropdownData = (index) => {
    let slotRange = [];
    if (index === slots.length - 1) {
      slotRange = range(slots[index].startInt + 1, 25);
    } else {
      slotRange = range(slots[index].startInt + 1, slots[index + 1].startInt + 1);
    }
    return slotRange.map((slot) => ({
      label: `${`0${slot}`.slice(-2)}:00`,
      value: `${`0${slot}`.slice(-2)}:00`,
    }));
  };

  const setEndTime = (value, index) => {
    const slotArr = [];
    slots.forEach((slot, slotIndex) => {
      if (slotIndex < index && value) {
        slotArr.push(slot);
      } else if (slotIndex === index + 1 && value) {
        slotArr.push({ ...slot, startTime: value, startInt: parseInt(value.replace(':00', '')) });
      } else {
        slotArr.push({ ...slot, endTime: value, endInt: value ? parseInt(value.replace(':00', '')) : 0 });
      }
    });
    setSlots(slotArr);
    setRefreshSlots(true);
  };

  const addSlot = () => {
    if (!isEmpty(slots)) {
      const lastSlot = slots[slots.length - 1];
      if (!isEmpty(lastSlot.endTime) && lastSlot.endInt !== 24) {
        const newSlot = {
          startTime: lastSlot.endTime,
          startInt: lastSlot.endInt,
          endTime: '',
          endInt: 24,
          active: true,
        };
        setSlots((slots) => [...slots, newSlot]);
      } else if (lastSlot.endInt === 24) {
        alertBox('You have selected the maximum possible slot', '');
      } else {
        alertBox('Please provide the end time for the previous slot', '');
      }
    } else {
      setSlots([DEFAULT_SLOT]);
    }

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
      alertBox('Please select start date!');
    } else if (!endDate) {
      alertBox('Please select end date!');
    } else if (slots.some((slot) => isEmpty(slot.endTime))) {
      alertBox('Please provide end time for all the slots!');
    } else {
      const availableArray = [];
      const startDateStr = moment(startDate).format('YYYY-MM-DD');
      const endDateStr = moment(endDate).format('YYYY-MM-DD');
      slots.forEach((obj) => {
        availableArray.push({
          startTime: `${moment(startDateStr + obj.startTime, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:s')}0+05:30`,
          endTime: `${moment(startDateStr + obj.endTime, 'YYYY-MM-DDLT').format('YYYY-MM-DDTHH:mm:s')}0+05:30`,
          active: obj.active,
        });
      });
      updateAvailability({
        variables: {
          tutorAvailability: {
            startDate: startDateStr,
            endDate: endDateStr,
            availableTimes: availableArray,
          },
        },
      });
    }
  };

  const markActiveInactive = (index, val) => {
    const slotArr = [...slots];
    slotArr[index].active = val;
    setSlots(slotArr);
    setRefreshSlots(true);
  };

  const renderItem = (item, index) => (
    <View>
      <View style={[commonStyles.horizontalChildrenEqualSpaceView, { marginTop: RfH(16) }]}>
        <View style={{ flex: 0.2, alignItems: 'center' }}>
          <Text style={commonStyles.regularPrimaryText}>{item?.startTime}</Text>
        </View>
        <CustomSelect
          data={getDropdownData(index)}
          value={item?.endTime}
          onChangeHandler={(value) => setEndTime(value, index)}
          placeholder="Select end time"
          containerStyle={{
            flex: 0.32,
            backgroundColor: Colors.lightGrey,
            borderRadius: 8,
            height: RfH(44),
            justifyContent: 'center',
            paddingHorizontal: RfW(10),
          }}
        />
        <View style={{ flex: 0.2 }}>
          <Switch value={item?.active} onValueChange={(val) => markActiveInactive(index, val)} />
        </View>
        {index !== 0 ? (
          <IconButtonWrapper
            iconWidth={RfW(20)}
            iconHeight={RfH(20)}
            iconImage={Images.delete}
            submitFunction={() => handleDelete(index)}
          />
        ) : (
          <View style={{ width: RfW(20) }} />
        )}
      </View>
    </View>
  );

  return (
    <>
      <Loader isLoading={availabilityLoading} />
      <View style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
        <ScreenHeader label="Update Availability" homeIcon horizontalPadding={RfW(16)} />
        <View style={{ height: RfH(30) }} />
        <View style={{ paddingHorizontal: RfW(16) }}>
          <View style={commonStyles.horizontalChildrenView}>
            <View style={[commonStyles.verticallyStretchedItemsView, { flex: 0.5, marginRight: RfW(8) }]}>
              <Text style={commonStyles.headingPrimaryText}>Start Date</Text>
              <View
                style={{
                  backgroundColor: Colors.lightGrey,
                  paddingHorizontal: RfW(8),
                  borderRadius: RfH(8),
                  marginTop: RfH(8),
                }}>
                <CustomDatePicker
                  value={startDate}
                  placeholder="Please select the start date"
                  onChangeHandler={(d) => setStartDate(d)}
                  textInputContainer={{ flex: 1 }}
                  textInputStyle={commonStyles.regularPrimaryText}
                  minimumDate={new Date()}
                />
              </View>
            </View>
            <View style={[commonStyles.verticallyStretchedItemsView, { flex: 0.5, marginLeft: RfW(8) }]}>
              <Text style={commonStyles.headingPrimaryText}>End Date</Text>
              <View
                style={{
                  backgroundColor: Colors.lightGrey,
                  paddingHorizontal: RfW(8),
                  borderRadius: RfH(8),
                  marginTop: RfH(8),
                }}>
                <CustomDatePicker
                  placeholder="Please select the end date"
                  value={endDate}
                  onChangeHandler={(d) => setEndDate(d)}
                  textInputContainer={{ flex: 1 }}
                  textInputStyle={commonStyles.regularPrimaryText}
                  minimumDate={new Date(startDate)}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={[commonStyles.blankGreyViewSmall, { marginTop: RfH(16), height: RfH(1) }]} />
        <View style={{ height: RfH(10) }} />
        <View style={{ flexDirection: 'row', marginTop: RfH(20) }}>
          <View style={{ flex: 0.32, alignItems: 'center' }}>
            <Text style={commonStyles.headingPrimaryText}> Start Time*</Text>
          </View>
          <View style={{ flex: 0.32, alignItems: 'center' }}>
            <Text style={commonStyles.headingPrimaryText}> End Time*</Text>
          </View>
          <View style={{ flex: 0.26, alignItems: 'center' }}>
            <Text style={commonStyles.headingPrimaryText}>Active**</Text>
          </View>
        </View>
        <View>
          <FlatList
            data={slots}
            extraData={refreshSlots}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: RfH(30) }}
            scrollEnabled={slots.length > 5}
          />
        </View>
        <View style={{ paddingHorizontal: RfW(40), marginTop: RfH(16) }}>
          <Button onPress={addSlot} block style={{ backgroundColor: Colors.lightGrey }}>
            <Text style={{ color: Colors.brandBlue, marginRight: RfW(8) }}>Add New Slot</Text>
            <IconButtonWrapper iconWidth={RfW(20)} iconHeight={RfH(20)} iconImage={Images.plus_blue} />
          </Button>
        </View>
        <View style={{ marginTop: RfH(20), paddingHorizontal: RfW(10) }}>
          {/* <Text style={[commonStyles.smallMutedText, { marginTop: RfH(20) }]}> */}
          {/*  *Slots creation is only allowed in between 06:00 A.M to 10 P.M. */}
          {/* </Text> */}
          <Text style={[commonStyles.smallMutedText, { marginTop: RfH(5) }]}>
            **Please mark slots as in active if you are not available.
          </Text>
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
          <Button onPress={onUpdating} style={[commonStyles.buttonPrimary, { width: RfW(144), alignSelf: 'center' }]}>
            <Text style={commonStyles.textButtonPrimary}>Submit</Text>
          </Button>
        </View>
      </View>
    </>
  );
}

export default UpdateSchedule;
