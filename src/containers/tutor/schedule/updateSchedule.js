/* eslint-disable radix */
import { FlatList, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Switch } from 'native-base';
import { useMutation } from '@apollo/client';
import moment from 'moment';
import { isEmpty, max, min } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { CustomSelect, IconButtonWrapper, Loader, ScreenHeader } from '../../../components';
import { alertBox, RfH, RfW } from '../../../utils/helpers';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { UPDATE_AVAILABILITY } from '../tutor.mutation';
import CustomDatePicker from '../../../components/CustomDatePicker';

const SLOT_DATA = [
  { label: '00:00', value: { slot: '00:00', val: 0 } },
  { label: '01:00', value: { slot: '01:00', val: 1 } },
  { label: '02:00', value: { slot: '02:00', val: 2 } },
  { label: '03:00', value: { slot: '03:00', val: 3 } },
  { label: '04:00', value: { slot: '04:00', val: 4 } },
  { label: '05:00', value: { slot: '05:00', val: 5 } },
  { label: '06:00', value: { slot: '06:00', val: 6 } },
  { label: '07:00', value: { slot: '07:00', val: 7 } },
  { label: '08:00', value: { slot: '08:00', val: 8 } },
  { label: '09:00', value: { slot: '09:00', val: 9 } },
  { label: '10:00', value: { slot: '10:00', val: 10 } },
  { label: '11:00', value: { slot: '11:00', val: 11 } },
  { label: '12:00', value: { slot: '12:00', val: 12 } },
  { label: '13:00', value: { slot: '13:00', val: 13 } },
  { label: '14:00', value: { slot: '14:00', val: 14 } },
  { label: '15:00', value: { slot: '15:00', val: 15 } },
  { label: '16:00', value: { slot: '16:00', val: 16 } },
  { label: '17:00', value: { slot: '17:00', val: 17 } },
  { label: '18:00', value: { slot: '18:00', val: 18 } },
  { label: '19:00', value: { slot: '19:00', val: 19 } },
  { label: '20:00', value: { slot: '20:00', val: 20 } },
  { label: '21:00', value: { slot: '21:00', val: 21 } },
  { label: '22:00', value: { slot: '22:00', val: 22 } },
  { label: '23:00', value: { slot: '23:00', val: 23 } },
  { label: '24:00', value: { slot: '23:59:59', val: 24 } },
];

function UpdateSchedule(props) {
  const navigation = useNavigation();
  const selectedDate = props?.route?.params.selectedDate;
  const [startDate, setStartDate] = useState(selectedDate);
  const [endDate, setEndDate] = useState(selectedDate);
  const [refreshSlots, setRefreshSlots] = useState(false);
  const [slots, setSlots] = useState([]);
  const [startSlot, setStartSlot] = useState();
  const [endSlot, setEndSlot] = useState();
  const [showAddButton, setShowAddButton] = useState(false);

  console.log(startDate, 'endDate', endDate);
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
    } else {
      const availableArray = [];
      const startDateStr = moment(startDate).format('YYYY-MM-DD');
      const endDateStr = moment(endDate).format('YYYY-MM-DD');
      slots.forEach((obj) => {
        availableArray.push({
          startTime: obj.startSlot.slot + moment().format('Z'),
          endTime: obj.endSlot.slot + moment().format('Z'),
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

  const checkSlotConflict = () => {
    let isConflict = false;
    for (const slot of slots) {
      if (Math.max(slot.startSlot.val, startSlot.val) >= Math.min(slot.endSlot.val, endSlot.val)) {
        isConflict = false;
      } else {
        isConflict = true;
        break;
      }
    }
    return isConflict;
  };

  const handleSave = () => {
    if (isEmpty(startSlot)) {
      alertBox('Please provide the start time');
    } else if (isEmpty(endSlot)) {
      alertBox('Please provide the end time');
    } else if (startSlot.val >= endSlot.val) {
      alertBox('Start time should be less than the end time');
    } else if (checkSlotConflict()) {
      alertBox('Slots are overlapping please check');
    } else {
      const slotsArray = [...slots, { startSlot, endSlot, active: true }];
      setSlots(slotsArray.sort((a, b) => (a.startSlot.val < b.startSlot.val ? -1 : 1)));
      setStartSlot({});
      setEndSlot({});
      setShowAddButton(true);
    }
  };

  const renderItem = (item, index) => (
    <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
      <View style={{ flex: 0.32, alignItems: 'center' }}>
        <Text>{item.startSlot.slot}</Text>
      </View>
      <View style={{ flex: 0.32, alignItems: 'center' }}>
        <Text>{item.endSlot.slot}</Text>
      </View>
      <View style={{ flex: 0.32, alignItems: 'center' }}>
        <IconButtonWrapper
          iconWidth={RfW(20)}
          iconHeight={RfH(20)}
          iconImage={Images.delete}
          submitFunction={() => handleDelete(index)}
        />
      </View>
    </View>
  );

  const renderAddSlot = () => (
    <View>
      <View style={[commonStyles.horizontalChildrenEqualSpaceView]}>
        <CustomSelect
          data={SLOT_DATA}
          value={startSlot}
          onChangeHandler={(value) => setStartSlot(value)}
          placeholder="Select start time"
          containerStyle={{
            flex: 0.33,
            backgroundColor: Colors.lightGrey,
            borderRadius: 8,
            height: RfH(44),
            justifyContent: 'center',
            paddingHorizontal: RfW(10),
          }}
        />
        <CustomSelect
          data={SLOT_DATA}
          value={endSlot}
          onChangeHandler={(value) => setEndSlot(value)}
          placeholder="Select end time"
          containerStyle={{
            flex: 0.33,
            backgroundColor: Colors.lightGrey,
            borderRadius: 8,
            height: RfH(44),
            justifyContent: 'center',
            paddingHorizontal: RfW(10),
          }}
        />
        <View style={{ flex: 0.2 }}>
          <Button style={[commonStyles.buttonPrimary, { width: RfW(50), alignSelf: 'center' }]} onPress={handleSave}>
            <Text style={commonStyles.textButtonPrimary}>Save</Text>
          </Button>
        </View>
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
                  placeholder="Select start date"
                  onChangeHandler={(d) => {
                    setStartDate(d);
                    setEndDate(endDate > d ? endDate : d);
                  }}
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
                  placeholder="Select end date"
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
        {!isEmpty(slots) && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: RfH(20) }}>
            <View style={{ flex: 0.32, alignItems: 'center' }}>
              <Text style={commonStyles.headingPrimaryText}> Start Time*</Text>
            </View>
            <View style={{ flex: 0.32, alignItems: 'center' }}>
              <Text style={commonStyles.headingPrimaryText}> End Time*</Text>
            </View>
            <View style={{ flex: 0.32, alignItems: 'center' }}>
              <Text style={commonStyles.headingPrimaryText}>Action</Text>
            </View>
          </View>
        )}
        {isEmpty(slots) && (
          <View style={{ marginTop: RfH(10), paddingHorizontal: RfW(10) }}>
            <Text style={[commonStyles.regularMutedText, { alignSelf: 'center' }]}>
              Please provide you availability
            </Text>
          </View>
        )}
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
          {!showAddButton && renderAddSlot()}
        </View>
        {showAddButton && (
          <View style={{ paddingHorizontal: RfW(40), marginTop: RfH(16) }}>
            <Button onPress={() => setShowAddButton(false)} block style={{ backgroundColor: Colors.lightGrey }}>
              <Text style={{ color: Colors.brandBlue, marginRight: RfW(8) }}>Add New Slot</Text>
              <IconButtonWrapper iconWidth={RfW(20)} iconHeight={RfH(20)} iconImage={Images.plus_blue} />
            </Button>
          </View>
        )}
        {!isEmpty(slots) && (
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
        )}
      </View>
    </>
  );
}

export default UpdateSchedule;
