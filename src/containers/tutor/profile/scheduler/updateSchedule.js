/* eslint-disable radix */
import { Text, View, FlatList, SegmentedControlIOSComponent } from 'react-native';
import React, { useState } from 'react';
import { Button, Input, Item, Picker, Spinner, Switch } from 'native-base';
import { IconButtonWrapper, ScreenHeader } from '../../../../components';
import { RfH, RfW } from '../../../../utils/helpers';
import commonStyles from '../../../../theme/styles';
import { Colors, Images } from '../../../../theme';

function UpdateSchedule() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
      enabled: false,
    },
    {
      startTime: '08:00',
      endTime: '13:00',
      enabled: true,
    },
    {
      startTime: '13:00',
      endTime: '18:00',
      enabled: true,
    },
    {
      startTime: '18:00',
      endTime: '23:59',
      enabled: false,
    },
  ]);

  const getEndTime = (time, endTimeLabel, index) => {
    const endTime = [];
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

  const renderItem = (item, index) => {
    const endTime = getEndTime(item.startTime, item.endTime, index);
    return (
      <View>
        {index === slots.length - 1 && (
          <View style={{ paddingHorizontal: RfW(16), marginTop: RfH(16) }}>
            <Button block style={{ backgroundColor: Colors.lightGrey }}>
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
            <Picker selectedValue={item.endTime} onValueChange={(value) => setEndTime(value, index)}>
              {endTime.map((obj) => {
                return <Picker.Item label={obj?.time} value={obj?.time} />;
              })}
            </Picker>
            <IconButtonWrapper iconImage={Images.expand} iconHeight={RfH(24)} iconWidth={RfW(24)} />
          </View>
          <View>
            <Switch value={item.enabled} />
          </View>
        </View>
      </View>
    );
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
              <IconButtonWrapper iconImage={Images.calendar} iconWidth={RfW(20)} iconHeight={RfH(20)} />
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
              <IconButtonWrapper iconImage={Images.calendar} iconWidth={RfW(20)} iconHeight={RfH(20)} />
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
        <Button style={[commonStyles.buttonPrimary, { width: RfW(144), alignSelf: 'center' }]}>
          <Text style={commonStyles.textButtonPrimary}>Save</Text>
        </Button>
      </View>
    </View>
  );
}

export default UpdateSchedule;
