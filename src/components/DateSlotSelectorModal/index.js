import { useLazyQuery } from '@apollo/client';
import moment from 'moment';
import { Button, Picker } from 'native-base';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Modal, Text, View } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { RFValue } from 'react-native-responsive-fontsize';
import { isEmpty } from 'lodash';
import { IconButtonWrapper, Loader } from '..';
import { GET_TUTOR_AVAILABILITY } from '../../containers/student/class.query';
import { Colors, Images } from '../../theme';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import {endOfDay, RfH, RfW, startOfDay} from '../../utils/helpers';

const DateSlotSelectorModal = (props) => {
  const [selectedSlot, setSelectedSlot] = useState({});
  const [availability, setAvailability] = useState([]);
  const { visible, onClose, onSubmit, tutorId, studentId, isReschedule } = props;

  const [getTutorAvailability, { loading: loaderAvailability }] = useLazyQuery(GET_TUTOR_AVAILABILITY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setAvailability(data.getTutorAvailability);
      }
    },
  });

  const getAvailabilityData = (date) => {
    setSelectedSlot({});
    setAvailability([]);
    getTutorAvailability({
      variables: {
        tutorAvailability: {
          tutorId,
          studentId,
          startDate: startOfDay(date),
          endDate: endOfDay(date),
        },
      },
    });
  };

  useEffect(() => {
    if (visible) {
      getAvailabilityData(new Date());
    }
  }, [visible]);

  return (
    <>
      <Loader isLoading={loaderAvailability} />
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
            paddingBottom: RfH(40),
          }}>
          <View style={[commonStyles.horizontalChildrenSpaceView, { marginHorizontal: RfW(16), marginTop: RfH(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>Available Slots</Text>
            <IconButtonWrapper
              iconHeight={RfH(20)}
              iconWidth={RfW(20)}
              styling={{ alignSelf: 'flex-end' }}
              iconImage={Images.cross}
              submitFunction={() => onClose(false)}
            />
          </View>
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
              onDateSelected={(d) => getAvailabilityData(d)}
            />
          </View>
          {!isEmpty(availability) ? (
            <View>
              <View
                style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(16), marginTop: RfH(20) }]}>
                <Text style={[commonStyles.mediumPrimaryText, { fontWeight: 'bold' }]}>Start Time</Text>
                <Text style={[commonStyles.mediumPrimaryText, { fontWeight: 'bold' }]}>End Time</Text>
              </View>
              <View style={commonStyles.horizontalChildrenSpaceView}>
                <Picker
                  iosHeader="Start Time"
                  Header="Start Time"
                  mode="default"
                  textStyle={{ color: Colors.brandBlue2 }}
                  placeholder="Select Start Time"
                  placeholderStyle={{ fontSize: 15 }}
                  selectedValue={selectedSlot}
                  onValueChange={(value) => setSelectedSlot(value)}>
                  {availability.map((slot, i) => (
                    <Picker.Item label={moment(slot.startDate).format('hh:mm A')} value={slot} key={i} />
                  ))}
                </Picker>
                <Text style={{ marginRight: RfW(16), textAlign: 'center' }}>
                  {!isEmpty(selectedSlot) ? moment(selectedSlot.endDate).format('hh:mm A') : '--'}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: RfH(10) }}>
              <Text style={commonStyles.mediumPrimaryText}> No slots available for the selected date</Text>
            </View>
          )}

          {!isEmpty(selectedSlot) && (
            <View
              style={{
                marginTop: RfH(24),
                marginBottom: RfH(34),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Button onPress={() => onSubmit(selectedSlot)} style={commonStyles.buttonPrimary}>
                <Text style={commonStyles.textButtonPrimary}>
                  {isReschedule ? 'Reschedule Class' : 'Schedule Class'}
                </Text>
              </Button>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

DateSlotSelectorModal.defaultProps = {
  visible: false,
  onClose: null,
  onSubmit: null,
  tutorId: 0,
  isReschedule: false,
};

DateSlotSelectorModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  tutorId: PropTypes.number,
  isReschedule: PropTypes.bool,
};

export default DateSlotSelectorModal;
