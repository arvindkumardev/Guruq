import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, View, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CalendarStrip from 'react-native-calendar-strip';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Images } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import { IconButtonWrapper } from '..';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';

const dateSlotModal = (props) => {
  const navigation = useNavigation();
  const [availableSlots, setAvailableSlots] = useState([
    '09:30 - 10:30 AM',
    '10:30 - 11:30 AM',
    '01:30 - 02:30 PM',
    '03:00 - 04:00 PM',
    '04:00 - 05:00 PM',
    '05:00 - 06:00 PM',
  ]);

  const { visible, onClose } = props;

  const renderSlots = (item) => {
    return (
      <View
        style={{
          backgroundColor: Colors.lightGreen,
          padding: 8,
          borderRadius: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: RfW(4),
          marginVertical: RfH(4),
        }}>
        <Text style={{ alignSelf: 'center', fontSize: RFValue(14, STANDARD_SCREEN_SIZE) }}>{item}</Text>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={() => {
        onClose(false);
      }}>
      <View style={{ flex: 1, backgroundColor: Colors.black, opacity: 0.5, flexDirection: 'column' }} />
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
            calendarHeaderStyle={{ alignSelf: 'flex-start', paddingBottom: RfH(8) }}
            highlightDateNumberStyle={{ color: Colors.brandBlue2 }}
            highlightDateNameStyle={{ color: Colors.brandBlue2 }}
            disabledDateNameStyle={{ color: Colors.darkGrey }}
            disabledDateNumberStyle={{ color: Colors.darkGrey }}
            dateNumberStyle={{ fontSize: RFValue(18, STANDARD_SCREEN_SIZE) }}
            style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
          />
        </View>
        <View style={{ paddingHorizontal: RfW(16), marginTop: RfH(48) }}>
          <Text style={{ fontFamily: 'SegoeUI-Bold', fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>Select Slot</Text>
        </View>
        <View style={{ alignItems: 'center', paddingTop: RfH(24) }}>
          <FlatList
            data={availableSlots}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => renderSlots(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </Modal>
  );
};

dateSlotModal.defaultProps = {
  visible: false,
  onClose: null,
};

dateSlotModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default dateSlotModal;
