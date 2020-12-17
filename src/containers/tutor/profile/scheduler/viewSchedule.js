import { FlatList, Text, View } from 'react-native';
import React, { useState } from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button, CheckBox, Item, ListItem } from 'native-base';
import { ScreenHeader } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { RfH, RfW } from '../../../../utils/helpers';
import { Colors } from '../../../../theme';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';

function ViewSchedule() {
  const [timeSlots, setTimeSlots] = useState([
    { slot: '9:30- 10:30 AM', isActive: false },
    { slot: '10:30- 11:30 AM', isActive: false },
    { slot: '1:30- 2:30 PM', isActive: true },
    { slot: '3:00- 4:00 PM', isActive: false },
    { slot: '4:00- 5:00 PM', isActive: false },
    { slot: '5:00- 6:00 PM', isActive: true },
    { slot: '7:00- 8:00 PM', isActive: false },
    { slot: '8:00- 9:00 PM', isActive: false },
  ]);

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
            // onDateSelected={(d) => getScheduledClassesbyDay(d)}
          />
        </View>
      </View>
      <View>
        <FlatList
          data={timeSlots}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingLeft: RfW(16) }}
        />
      </View>
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
            <Text style={commonStyles.textButtonPrimary}>Confirm</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default ViewSchedule;
