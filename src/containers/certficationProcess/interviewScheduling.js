import { Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button } from 'native-base';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { GET_INTERVIEW_SCHEDULE_AVAILABILITY } from '../tutor/tutor.query';
import { tutorDetails } from '../../apollo/cache';
import { ADD_INTERVIEW_DETAILS } from '../tutor/tutor.mutation';
import { InterviewMode, InterviewStatus } from '../tutor/enums';
import Colors from '../../theme/colors';
import { alertBox, printTime, RfH, RfW } from '../../utils/helpers';
import { CustomDatePicker, CustomSelect, Loader, ScreenHeader } from '../../components';
import commonStyles from '../../theme/styles';

function InterviewScheduling() {
  const navigation = useNavigation();
  const tutorInfo = useReactiveVar(tutorDetails);

  const [interviewDate, setInterviewDate] = useState();
  const [selectedTime, setSelectedTime] = useState({});
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
          const availableSlots = data.getAvailabilityForInterview.filter((item) => item.active);
          if (availableSlots.length === 0) {
            alertBox(' No slots are  available for the selected date');
          } else {
            setAvailableTimes(
              availableSlots.map((item) => ({
                label: `${printTime(item.startDate)} - ${printTime(item.endDate)}`,
                value: item,
              }))
            );
          }
        }
      },
    }
  );

  const [addInterviewDetails, { loading: addInterviewLoading }] = useMutation(ADD_INTERVIEW_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Interview scheduled successfully!', '', {
          positiveText: 'Ok',
          onPositiveClick: () => navigation.goBack(),
        });
      }
    },
  });

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

  const onAddingDetails = () => {
    if (!interviewDate) {
      alertBox('Please select the interview date');
    } else if (!selectedTime || !selectedTime.startDate) {
      alertBox('Please select the interview time');
    } else {
      addInterviewDetails({
        variables: {
          interviewDto: {
            startDate: selectedTime.startDate,
            endDate: selectedTime.endDate,
            status: InterviewStatus.SCHEDULED.label,
            mode: InterviewMode.ONLINE.label,
            tutor: {
              id: tutorInfo?.id,
            },
          },
        },
      });
    }
  };
  return (
    <>
      <Loader isLoading={loadingAvailability || addInterviewLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0, flex: 1 }]}>
        <ScreenHeader label="Schedule Your Interview" horizontalPadding={RfW(8)} homeIcon />
        <View style={{ paddingHorizontal: RfW(16), marginTop: RfH(20) }}>
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
                  paddingHorizontal: RfW(22),
                }}>
                <CustomDatePicker
                  value={interviewDate}
                  onChangeHandler={(text) => getAvailability(text)}
                  minimumDate={new Date()}
                />
              </View>
            </View>
            <View style={{ flex: 0.5 }}>
              <Text style={commonStyles.mediumMutedText}>Interview Time</Text>
              <View
                style={[
                  commonStyles.horizontalChildrenView,
                  {
                    borderWidth: 1,
                    borderColor: Colors.darkGrey,
                    paddingRight: RfH(8),
                    marginTop: RfH(16),
                    borderRadius: RfH(4),
                    paddingHorizontal: RfW(8),
                  },
                ]}>
                <CustomSelect
                  data={availableTimes}
                  value={selectedTime}
                  onChangeHandler={(value) => setSelectedTime(value)}
                  placeholder="Please select time"
                  containerStyle={{
                    flex: 1,
                    height: RfH(44),
                    justifyContent: 'center',
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{ marginTop: RfH(40) }}>
            <Button onPress={onAddingDetails} style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
              <Text style={commonStyles.textButtonPrimary}>Schedule Interview</Text>
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}

export default InterviewScheduling;
