/* eslint-disable no-restricted-syntax */
import { Alert, FlatList, Modal, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, CheckBox } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import MapView, { Marker } from 'react-native-maps';
import { useMutation } from '@apollo/client';
import moment from 'moment';
import { getUserImageUrl, RfH, RfW } from '../../../utils/helpers';
import { Colors, Images } from '../../../theme';
import { DateSlotSelectorModal, IconButtonWrapper } from '../../../components';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import NavigationRouteNames from '../../../routes/screenNames';

import styles from '../tutorListing/styles';
import BackArrow from '../../../components/BackArrow';
import { SCHEDULE_CLASS } from '../booking.mutation';
import { DUPLICATE_FOUND } from '../../../common/errorCodes';

function ScheduledClassDetails(props) {
  const navigation = useNavigation();
  const [showReschedulePopup, setShowReschedulePopup] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [startTimes, setStartTimes] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);

  const { route } = props;

  const { classDetails } = route.params;

  useEffect(() => {
    if (route && route.params && route.params.classEnded) {
      navigation.navigate(NavigationRouteNames.STUDENT.RATE_AND_REVIEW, { classDetails });
    }
  }, [route]);

  useEffect(() => {
    const array = [];
    if (classDetails?.classData?.students) {
      for (const obj of classDetails?.classData?.students) {
        const item = {
          icon: Images.kushal,
          studentName: obj.contactDetail.firstName,
          studentId: obj.contactDetail.lastName,
          joined: true,
        };
        array.push(item);
      }
      setAttendees(array);
    }
  }, classDetails?.classData?.students);

  const attachments = [
    {
      icon: Images.pdf,
      chapter: 'Chapter 01.pdf',
      size: '15 KB',
      date: '15 Sept',
    },
    {
      icon: Images.png,
      chapter: 'Chapter 01.png',
      size: '15 KB',
      date: '15 Sept',
    },
    {
      icon: Images.jpg,
      chapter: 'Chapter 01.jpg',
      size: '15 KB',
      date: '15 Sept',
    },
    {
      icon: Images.txt,
      chapter: 'Chapter 01.txt',
      size: '15 KB',
      date: '15 Sept',
    },
  ];

  const [showBackButton, setShowBackButton] = useState(false);
  const [showClassStartedPopup, setShowClassStartedPopup] = useState(false);
  const [showCancelClassStartedPopup, setShowCancelClassStartedPopup] = useState(false);
  const renderAttendees = (item) => {
    return (
      <View style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(16), marginTop: RfH(12) }]}>
        <View style={commonStyles.horizontalChildrenView}>
          <IconButtonWrapper
            iconImage={item.icon}
            iconHeight={RfH(45)}
            iconWidth={RfH(45)}
            styling={{ borderRadius: RfH(22.5) }}
          />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <Text style={commonStyles.headingPrimaryText}>{item.studentName}</Text>
            <Text style={commonStyles.mediumMutedText}>{item.studentId}</Text>
          </View>
        </View>
        <CheckBox checked={item.joined} />
      </View>
    );
  };

  const renderAttachments = (item) => {
    return (
      <View style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(16), marginTop: RfH(16) }]}>
        <View style={commonStyles.horizontalChildrenView}>
          <IconButtonWrapper iconImage={item.icon} iconHeight={RfH(45)} iconWidth={RfH(45)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <Text style={commonStyles.headingPrimaryText}>{item.chapter}</Text>
            <Text style={commonStyles.mediumMutedText}>
              {item.size} | {item.date}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const goToCancelReason = () => {
    setShowCancelClassStartedPopup(false);
    navigation.navigate(NavigationRouteNames.STUDENT.CANCEL_REASON, { classId: classDetails.classData.id });
  };

  const goToOnlineClass = () => {
    setShowClassStartedPopup(false);
    navigation.navigate(NavigationRouteNames.ONLINE_CLASS, { classDetails });
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const openRescheduleModal = () => {
    setShowCancelClassStartedPopup(false);
    setShowReschedulePopup(true);
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;

    if (scrollPosition > 30) {
      setShowBackButton(true);
    } else {
      setShowBackButton(false);
    }
  };

  const [scheduleClass, { loading: scheduleLoading }] = useMutation(SCHEDULE_CLASS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
        if (error.errorCode === DUPLICATE_FOUND) {
          Alert.alert(error.message);
        }
      }
    },
    onCompleted: (data) => {
      if (data) {
        setShowReschedulePopup(false);
      }
    },
  });

  const selectedSlot = (item, index) => {
    if (item.active) {
      const interval = 1;
      const timeArray = [];
      timeArray.push({
        startTime: new Date(item.startDate).setUTCMinutes(new Date(item.startDate).getUTCMinutes() + 15),
      });
      let endTime = new Date(item.startDate).setUTCHours(new Date(item.startDate).getUTCHours() + interval);
      while (endTime < new Date(item.endDate)) {
        timeArray.push({ startTime: new Date(endTime).setUTCMinutes(new Date(endTime).getUTCMinutes() + 15) });
        endTime = new Date(endTime).setUTCMinutes(new Date(endTime).getUTCMinutes() + 15);
      }
      setStartTimes(timeArray);
      const newArray = [];
      availability.map((obj) => {
        obj.selected = false;
        newArray.push(obj);
      });
      let arrayItem = {};
      arrayItem = { ...newArray[index] };
      arrayItem.selected = !arrayItem.selected;
      newArray[index] = arrayItem;
      setAvailability(newArray);
    }
  };

  const selectedClassTime = (value) => {
    setSelectedStartTime(value);
    setSelectedEndTime(moment(value).endOf('day').toDate());
  };

  const onScheduleClass = () => {
    scheduleClass({
      variables: {
        classesCreateDto: {
          orderItemId: classDetails?.classData?.orderItem?.id,
          startDate: selectedStartTime,
          endDate: selectedEndTime,
        },
      },
    });
  };

  return (
    <View style={{ backgroundColor: Colors.white }}>
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => handleScroll(event)}
        scrollEventThrottle={16}>
        <View style={[styles.topView, showBackButton ? { height: RfH(88) } : { height: RfH(98) }]}>
          {showBackButton && (
            <View
              style={{
                height: RfH(88),
                marginTop: RfH(44),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: RfW(16),
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <BackArrow action={onBackPress} />

                <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
                  <Text style={[styles.subjectTitle, { fontSize: RFValue(17, STANDARD_SCREEN_SIZE) }]}>
                    {classDetails?.classTitle}
                  </Text>
                  <Text style={[styles.classText, { fontSize: RFValue(17, STANDARD_SCREEN_SIZE) }]}>
                    {`${classDetails.board} | ${classDetails.class}`}
                  </Text>
                </View>
              </View>
              <View style={{}}>
                <Button
                  block
                  onPress={() => goToOnlineClass()}
                  // setShowClassStartedPopup(true)}
                  style={[
                    commonStyles.buttonPrimary,
                    {
                      height: 36,
                      width: RfH(100),
                      borderRadius: 4,
                      marginHorizontal: 0,
                    },
                  ]}>
                  <IconButtonWrapper
                    iconImage={Images.video}
                    iconHeight={RfH(16)}
                    iconWidth={RfW(16)}
                    styling={{ alignSelf: 'center' }}
                  />
                  <Text style={[commonStyles.textButtonPrimary, { marginLeft: RfW(8) }]}>Join</Text>
                </Button>
              </View>
            </View>
          )}

          {!showBackButton && (
            <View
              style={{
                height: RfH(98),
                marginTop: RfH(68),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: RfW(16),
                backgroundColor: Colors.lightPurple,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'stretch',
                }}>
                <View style={{}}>
                  <BackArrow action={onBackPress} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ height: RfH(54), justifyContent: 'center', paddingHorizontal: RfW(0) }}>
                    <Text style={commonStyles.headingPrimaryText}>{classDetails?.classTitle}</Text>
                    <Text
                      style={[
                        commonStyles.mediumMutedText,
                        { marginTop: RfH(4) },
                      ]}>{`${classDetails.board} | ${classDetails.class}`}</Text>
                  </View>

                  <View style={{}}>
                    <Button
                      block
                      onPress={() => goToOnlineClass()}
                      // setShowClassStartedPopup(true)}
                      style={[
                        commonStyles.buttonPrimary,
                        {
                          width: RfH(100),
                          borderRadius: 4,
                          marginHorizontal: 0,
                        },
                      ]}>
                      <IconButtonWrapper
                        iconImage={Images.video}
                        iconHeight={RfH(16)}
                        iconWidth={RfW(16)}
                        styling={{ alignSelf: 'center' }}
                      />
                      <Text style={[commonStyles.textButtonPrimary, { marginLeft: RfW(8) }]}>Join</Text>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        <View
          style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfW(16), marginTop: RfH(44), height: 44 }]}>
          <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.tutor_icon} />
          <Text style={[commonStyles.headingPrimaryText, { marginLeft: RfW(16) }]}>Tutor</Text>
        </View>
        <View style={[commonStyles.horizontalChildrenView, { margin: RfW(16), marginLeft: 56 }]}>
          <IconButtonWrapper
            iconImage={getUserImageUrl(classDetails?.classData?.tutor)}
            iconHeight={RfH(48)}
            iconWidth={RfH(48)}
            styling={{ borderRadius: RfH(48) }}
          />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <Text style={commonStyles.headingPrimaryText}>
              {classDetails?.classData?.tutor?.contactDetail?.firstName}{' '}
              {classDetails.classData.tutor.contactDetail.lastName}
            </Text>
            <Text style={commonStyles.mediumMutedText}>GURUQT{classDetails.classData.tutor.id}</Text>
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfH(16), height: 60 }]}>
          <IconButtonWrapper iconImage={Images.calendar_icon} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>
              {new Date(classDetails?.classData?.startDate).toDateString()}
            </Text>
            <Text style={commonStyles.mediumMutedText}>{classDetails.timing}</Text>
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfH(16), height: 60 }]}>
          <IconButtonWrapper iconImage={Images.bell} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>Notification alert</Text>
            <Text style={commonStyles.mediumMutedText}>20 minutes before</Text>
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfH(16), height: 60 }]}>
          <IconButtonWrapper iconImage={Images.attendees} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>Attendees</Text>
            <Text style={commonStyles.mediumMutedText}>{attendees.length} participants to join the Class</Text>
          </View>
        </View>
        <FlatList
          style={{ marginBottom: RfH(16), marginLeft: 40 }}
          showsHorizontalScrollIndicator={false}
          data={attendees}
          renderItem={({ item, index }) => renderAttendees(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        {/* <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfH(16), height: 44 }]}>
          <IconButtonWrapper iconImage={Images.attachment} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>Attachments</Text>
          </View>
        </View>

        <FlatList
          style={{ marginBottom: RfH(16), marginLeft: 40 }}
          showsHorizontalScrollIndicator={false}
          data={attachments}
          renderItem={({ item, index }) => renderAttachments(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} /> */}

        <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfH(16), height: 60 }]}>
          <IconButtonWrapper iconImage={Images.pin} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>Class Location </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: RfW(16) }}>
          <Text style={commonStyles.headingPrimaryText}>Block 27</Text>
          <Text style={{ fontSize: RFValue(15, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
            Block 72, , Ashok Nagar, New Delhi, Delhi 110018, India
          </Text>
          <Text style={{ fontSize: RFValue(15, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
            Landmark : Monga Sweets
          </Text>
        </View>

        <View style={{ marginTop: RfH(16) }}>
          <MapView
            style={{ flex: 1, height: 300 }}
            liteMode
            initialRegion={{
              latitude: 28.561929,
              longitude: 77.06681,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker coordinate={{ latitude: 28.561929, longitude: 77.06681 }} />
          </MapView>
        </View>

        {/* <View style={[commonStyles.lineSeparator, { marginTop: 16, marginBottom: 8 }]} /> */}

        <View
          style={[commonStyles.horizontalChildrenView, { marginTop: RfH(16), paddingHorizontal: RfH(16), height: 60 }]}>
          <IconButtonWrapper iconImage={Images.personal} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>Class ID</Text>
            <Text style={commonStyles.mediumMutedText}>
              GURUQC{new Date().getUTCFullYear().toString().substring(2, 4)}
              {new Date().getUTCMonth()}
              {classDetails?.classData?.id}
            </Text>
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithVerticalMargin} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: RfH(16),
            marginBottom: RfH(34),
          }}>
          <Button
            onPress={() => setShowCancelClassStartedPopup(true)}
            block
            style={{ width: RfW(128), backgroundColor: Colors.orangeRed }}>
            <Text style={commonStyles.textButtonPrimary}>Cancel Class</Text>
          </Button>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={false}
        visible={showClassStartedPopup}
        onRequestClose={() => {
          setShowClassStartedPopup(false);
        }}>
        <View style={{ flex: 1, backgroundColor: Colors.black, opacity: 0.6 }}>
          <View style={{ flex: 1 }} />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
              paddingHorizontal: RfW(16),
            }}>
            <View style={{ backgroundColor: Colors.white, opacity: 1, padding: RfW(16) }}>
              <IconButtonWrapper
                iconHeight={RfH(24)}
                iconWidth={RfW(24)}
                styling={{ alignSelf: 'flex-end', marginRight: RfW(16), marginTop: RfH(16) }}
                iconImage={Images.cross}
                submitFunction={() => setShowClassStartedPopup(false)}
              />
              <View style={{ padding: RfH(16) }}>
                <Text style={[commonStyles.mediumMutedText, { fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }]}>
                  Your class has been started. Confirm to continue.
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Button
                  onPress={() => goToOnlineClass()}
                  block
                  style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
                  <Text style={commonStyles.textButtonPrimary}>Continue</Text>
                </Button>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </Modal>
      <Modal
        animationType="fade"
        backdropOpacity={1}
        transparent
        visible={showCancelClassStartedPopup}
        onRequestClose={() => {
          setShowCancelClassStartedPopup(false);
        }}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ flex: 1 }} />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
              paddingHorizontal: RfW(16),
            }}>
            <View style={{ backgroundColor: Colors.white, opacity: 1, padding: RfW(16) }}>
              <IconButtonWrapper
                iconHeight={RfH(24)}
                iconWidth={RfW(24)}
                styling={{ alignSelf: 'flex-end', marginRight: RfW(16), marginTop: RfH(16) }}
                iconImage={Images.cross}
                submitFunction={() => setShowCancelClassStartedPopup(false)}
              />
              <View style={{ padding: RfH(16) }}>
                <Text style={[commonStyles.mediumMutedText, { fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }]}>
                  Do you want to re-schedule your class?
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: RfH(32),
                }}>
                <Button
                  onPress={() => goToCancelReason()}
                  block
                  bordered
                  style={{ flex: 1, height: RfH(40), alignSelf: 'center', marginRight: RfW(8) }}>
                  <Text style={{ color: Colors.brandBlue2, fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}>
                    Cancel Class
                  </Text>
                </Button>
                <Button
                  onPress={() => openRescheduleModal()}
                  block
                  style={{ flex: 1, backgroundColor: Colors.brandBlue2, height: RfH(40) }}>
                  <Text style={commonStyles.textButtonPrimary}>Reschedule</Text>
                </Button>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </Modal>
      <DateSlotSelectorModal
        visible={showReschedulePopup}
        onClose={() => setShowReschedulePopup(false)}
        tutorId={classDetails?.classData?.tutor?.id}
        selectedSlot={(item, index) => selectedSlot(item, index)}
        onSubmit={() => onScheduleClass()}
        times={startTimes}
        selectedClassTime={(value) => selectedClassTime(value)}
      />
    </View>
  );
}

export default ScheduledClassDetails;
