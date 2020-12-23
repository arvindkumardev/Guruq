import { View, Text, TouchableWithoutFeedback, ScrollView, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { Button, Input, Item, Picker } from 'native-base';
import { useLazyQuery } from '@apollo/client';
import moment from 'moment';
import { CustomRadioButton, IconButtonWrapper, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import CustomDatePicker from '../../../components/CustomDatePicker';
import { GET_INTERVIEW_SCHEDULE_AVAILABILITY } from '../tutor.query';

function InterviewPending() {
  const [interviewDate, setInterviewDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('Select');
  const [selectedId, setSelectedId] = useState(1);
  const [addressId, setAddressId] = useState(1);

  const [availableTimes, setAvailableTimes] = useState([]);

  const [getInterviewAvailability, { loading: loadingAvailability }] = useLazyQuery(
    GET_INTERVIEW_SCHEDULE_AVAILABILITY,
    {
      fetchPolicy: 'no-cache',
      onError: (e) => {
        if (e.graphQLErrors && e.graphQLErrors.length > 0) {
          const error = e.graphQLErrors[0].extensions.exception.response;
        }
      },
      onCompleted: (data) => {
        if (data) {
          const times = [];
          data.getAvailabilityForInterview.map((obj) => {
            if (obj.active) {
              times.push(obj);
            }
          });
          setAvailableTimes(times);
          setSelectedTime(new Date(times[0].startDate).toLocaleTimeString());
        }
      },
    }
  );

  const getAvailability = (value) => {
    setInterviewDate(value);
    getInterviewAvailability({
      variables: {
        availabilityDto: {
          startDate: moment.utc(new Date(value)).format('YYYY-MM-DD'),
          endDate: moment.utc(new Date(value)).add(1, 'day').format('YYYY-MM-DD'),
        },
      },
    });
  };
  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader label="Schedule Your Interview" horizontalPadding={RfW(8)} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingBottom: RfH(32) }}>
        <View style={{ paddingHorizontal: RfW(16) }}>
          <View style={{ height: RfH(24) }} />
          <View style={[commonStyles.horizontalChildrenStartView]}>
            <View style={{ flex: 0.5, paddingRight: RfW(16) }}>
              <Text style={commonStyles.mediumMutedText}>Interview Date</Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.darkGrey,
                  paddingRight: RfH(8),
                  marginTop: RfH(16),
                  borderRadius: RfH(4),
                }}>
                <Item style={{ borderBottomWidth: 0 }}>
                  <Input
                    style={{ borderWidth: 0, height: RfH(48) }}
                    value={interviewDate}
                    onChangeText={(text) => setInterviewDate(text)}
                  />
                  <CustomDatePicker value={interviewDate} onChangeHandler={(text) => getAvailability(text)} />
                </Item>
              </View>
            </View>
            <View style={{ flex: 0.5 }}>
              <Text style={commonStyles.mediumMutedText}>Interview Time</Text>
              <View
                style={[
                  commonStyles.horizontalChildrenSpaceView,
                  {
                    borderWidth: 1,
                    borderColor: Colors.darkGrey,
                    paddingRight: RfH(8),
                    marginTop: RfH(16),
                    borderRadius: RfH(4),
                  },
                ]}>
                <Picker
                  selectedValue={selectedTime}
                  style={{ height: RfH(48) }}
                  onValueChange={(value) => setSelectedTime(value)}>
                  {availableTimes.map((obj) => {
                    return <Picker.Item label={new Date(obj?.startDate).toLocaleTimeString()} value={obj?.startDate} />;
                  })}
                </Picker>
                <View style={[commonStyles.horizontalChildrenView, { justifyContent: 'center' }]}>
                  <Text style={{ alignSelf: 'center' }}>|</Text>
                  <IconButtonWrapper iconWidth={RfW(24)} iconHeight={RfH(16)} iconImage={Images.expand_gray} />
                </View>
              </View>
            </View>
          </View>
          <View style={{ marginTop: RfH(24) }}>
            <Button style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
              <Text style={commonStyles.textButtonPrimary}>Schedule Interview</Text>
            </Button>
          </View>
        </View>
        <View style={[commonStyles.blankGreyViewSmall, { marginTop: RfH(16) }]} />
        <View style={{ padding: RfW(16), paddingBottom: RfH(16) }}>
          <View>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Documents</Text>
            <Text style={[commonStyles.mediumMutedText, { marginTop: RfH(8) }]}>
              Please Upload all the documents listed below
            </Text>
          </View>
          <View style={{ height: RfH(24) }} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Attach Documents</Text>
            <Text style={commonStyles.regularMutedText}>Click to upload</Text>
          </View>
          <View style={[commonStyles.lineSeparator, { marginTop: RfH(32), marginBottom: RfH(16) }]} />
          <Text>ID Proof</Text>
          <View style={{ height: RfH(16) }} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View>
              <TouchableWithoutFeedback onPress={() => setSelectedId(1)}>
                <View style={commonStyles.horizontalChildrenView}>
                  <CustomRadioButton submitFunction={() => setSelectedId(1)} enabled={selectedId === 1} />
                  <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Aadhaar card</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => setSelectedId(2)}>
                <View style={[commonStyles.horizontalChildrenView, { marginTop: RfH(8) }]}>
                  <CustomRadioButton submitFunction={() => setSelectedId(2)} enabled={selectedId === 2} />
                  <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Driving license</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View>
              <View
                style={{
                  padding: RfH(24),
                  borderRadius: RfH(8),
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: Colors.darkGrey,
                }}>
                <IconButtonWrapper iconWidth={RfW(32)} iconHeight={RfH(16)} iconImage={Images.expand_gray} />
              </View>
            </View>
          </View>
          <View style={[commonStyles.lineSeparator, { marginTop: RfH(32), marginBottom: RfH(16) }]} />
          <Text>Address Proof</Text>
          <View style={{ height: RfH(16) }} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View>
              <TouchableWithoutFeedback onPress={() => setAddressId(1)}>
                <View style={commonStyles.horizontalChildrenView}>
                  <CustomRadioButton submitFunction={() => setAddressId(1)} enabled={addressId === 1} />
                  <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Aadhaar card</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => setAddressId(2)}>
                <View style={[commonStyles.horizontalChildrenView, { marginTop: RfH(8) }]}>
                  <CustomRadioButton submitFunction={() => setAddressId(2)} enabled={addressId === 2} />
                  <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Voter ID</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => setAddressId(3)}>
                <View style={[commonStyles.horizontalChildrenView, { marginTop: RfH(8) }]}>
                  <CustomRadioButton submitFunction={() => setAddressId(3)} enabled={addressId === 3} />
                  <Text style={[commonStyles.regularPrimaryText, { marginLeft: RfW(8) }]}>Passport</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View>
              <View
                style={{
                  padding: RfH(24),
                  borderRadius: RfH(8),
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: Colors.darkGrey,
                }}>
                <IconButtonWrapper iconWidth={RfW(32)} iconHeight={RfH(16)} iconImage={Images.expand_gray} />
              </View>
            </View>
          </View>
          <View style={[commonStyles.lineSeparator, { marginTop: RfH(32), marginBottom: RfH(16) }]} />
          <View style={{ height: RfH(16) }} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View>
              <View style={commonStyles.horizontalChildrenView}>
                <Text style={commonStyles.regularPrimaryText}>Pan card</Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  padding: RfH(24),
                  borderRadius: RfH(8),
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: Colors.darkGrey,
                }}>
                <IconButtonWrapper iconWidth={RfW(32)} iconHeight={RfH(16)} iconImage={Images.expand_gray} />
              </View>
            </View>
          </View>
          <View style={[commonStyles.lineSeparator, { marginTop: RfH(32), marginBottom: RfH(16) }]} />
          <View style={{ height: RfH(16) }} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View>
              <Text style={commonStyles.regularPrimaryText}>Highest Qualification</Text>
              <Text style={commonStyles.mediumPrimaryText}>(Degree/Marksheet)</Text>
            </View>
            <View>
              <View
                style={{
                  padding: RfH(24),
                  borderRadius: RfH(8),
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: Colors.darkGrey,
                }}>
                <IconButtonWrapper iconWidth={RfW(32)} iconHeight={RfH(16)} iconImage={Images.expand_gray} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default InterviewPending;
