import { useLazyQuery } from '@apollo/client';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Text, View } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { RFValue } from 'react-native-responsive-fontsize';
import { IconButtonWrapper } from '..';
import { GET_AVAILABILITY_DATA } from '../../containers/student/class.query';
import { Colors, Images } from '../../theme';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { endOfDay, printDate, RfH, RfW, startOfDay } from '../../utils/helpers';

const TutorAvailabilitySlots = (props) => {
  const [availability, setAvailability] = useState([]);
  const { visible, onClose, tutorId } = props;
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [getAvailability, { loading: availabilityError }] = useLazyQuery(GET_AVAILABILITY_DATA, {
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      setAvailability([]);
      if (data) {
        const slotData = [...data.getAvailabilityData];
        setAvailability(
          slotData.sort((a, b) => (moment(a.startDate).format('HH:MM') > moment(b.startDate).format('HH:MM') ? 1 : -1))
        );
      }
    },
  });

  const getAvailabilityData = (date) => {
    setSelectedDate(date);

    getAvailability({
      variables: {
        tutorAvailability: {
          tutorId,
          startDate: moment(date).startOf('day'),
          endDate: moment(date).endOf('day'),
        },
      },
    });
  };

  useEffect(() => {
    getAvailabilityData(new Date());
  }, []);

  const renderSlots = (item, index) => (
    <View
      style={{
        backgroundColor: !item.active ? Colors.lightOrange : item.selected ? Colors.lightGreen : Colors.lightGreen,
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
        {moment(item.startDate).format('hh:mm A')}
        {' : '}
        {moment(item.endDate).format('hh:mm A')}
      </Text>
    </View>
  );

  return (
    <Modal animationType="fade" transparent backdropOpacity={1} visible={visible} onRequestClose={onClose}>
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
        <View
          style={[
            commonStyles.horizontalChildrenSpaceView,
            {
              height: RfH(44),
              backgroundColor: Colors.lightBlue,
            },
          ]}>
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.headingPrimaryText, { marginLeft: RfW(16) }]}>Available Slots</Text>
          </View>
          <View style={{ flex: 0.5 }}>
            <IconButtonWrapper
              styling={{ alignSelf: 'flex-end' }}
              containerStyling={{ paddingHorizontal: RfW(16) }}
              iconHeight={RfH(20)}
              iconWidth={RfW(20)}
              iconImage={Images.cross}
              submitFunction={onClose}
              imageResizeMode="contain"
            />
          </View>
        </View>
        <View style={{ paddingHorizontal: RfW(16) }}>
          <CalendarStrip
            calendarHeaderStyle={{
              fontSize: RFValue(17, STANDARD_SCREEN_SIZE),
              alignSelf: 'flex-start',
              paddingBottom: RfH(8),
            }}
            selectedDate={selectedDate}
            highlightDateNumberStyle={{ color: Colors.brandBlue2 }}
            highlightDateNameStyle={{ color: Colors.brandBlue2 }}
            disabledDateNameStyle={{ color: Colors.black }}
            disabledDateNumberStyle={{ color: Colors.black }}
            dateNameStyle={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), fontWeight: '400', color: Colors.black }}
            dateNumberStyle={{ fontSize: RFValue(17, STANDARD_SCREEN_SIZE), fontWeight: '400', color: Colors.black }}
            style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
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
            onDateSelected={(d) => getAvailabilityData(d)}
          />
        </View>
        <View style={{ alignItems: 'center', paddingTop: RfH(24) }}>
          {availability.length > 0 && (
            <FlatList
              style={{ minHeight: RfH(150) }}
              data={availability}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => renderSlots(item, index)}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingHorizontal: RfW(8) }}
            />
          )}
          {availability.length === 0 && (
            <View style={{ height: RfH(150), justifyContent: 'center' }}>
              <Text style={commonStyles.regularMutedText}> No Slots Available</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

TutorAvailabilitySlots.defaultProps = {
  visible: false,
  onClose: null,
  tutorId: 0,
};

TutorAvailabilitySlots.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  tutorId: PropTypes.number,
};

export default TutorAvailabilitySlots;
