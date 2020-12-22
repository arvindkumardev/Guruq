/* eslint-disable no-restricted-syntax */
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RFValue } from 'react-native-responsive-fontsize';
import moment from 'moment';
import { DUPLICATE_FOUND } from '../../../common/errorCodes';
import { DateSlotSelectorModal, IconButtonWrapper } from '../../../components';
import BackArrow from '../../../components/BackArrow';
import Loader from '../../../components/Loader';
import NavigationRouteNames from '../../../routes/screenNames';
import { Colors, Images } from '../../../theme';
import commonStyles from '../../../theme/styles';
import { API_URL, IMAGES_BASE_URL, STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { getUserImageUrl, printDate, printTime, RfH, RfW } from '../../../utils/helpers';
import {RE_SCHEDULE_CLASS, SCHEDULE_CLASS} from '../booking.mutation';
import { GET_CLASS_DETAILS } from '../class.query';
import styles from '../tutorListing/styles';

function ScheduledClassDetails(props) {
  const navigation = useNavigation();
  const [showReschedulePopup, setShowReschedulePopup] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [showClassStartedPopup, setShowClassStartedPopup] = useState(false);
  const [showCancelClassStartedPopup, setShowCancelClassStartedPopup] = useState(false);
  const [classData, setClassData] = useState({});

  const { route } = props;

  const { classId } = route.params;

  const [getClassDetails, { loading: classDetailsLoading }] = useLazyQuery(GET_CLASS_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      console.log(data);
      if (data) {
        setClassData(data.getClassDetails);
      }
    },
  });

  useEffect(() => {
    if (classId) {
      getClassDetails({ variables: { classId } });
    }
  }, [classId]);

  const getStudentImageUrl = (filename, gender, id) => {
    return filename
      ? `${API_URL}/${filename}`
      : `${IMAGES_BASE_URL}/images/avatars/${gender === 'MALE' ? 'm' : 'f'}${id % 4}.png`;
  };

  const renderAttendees = (item) => (
    <View style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(16), marginTop: RfH(12) }]}>
      <View style={[commonStyles.horizontalChildrenView]}>
        <IconButtonWrapper
          iconImage={getStudentImageUrl(item?.profileImage?.filename, item?.contactDetail?.gender, item.id)}
          iconHeight={RfH(48)}
          iconWidth={RfH(48)}
          styling={{ borderRadius: RfH(8) }}
        />
        <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
          <Text style={commonStyles.headingPrimaryText}>
            {item?.contactDetail?.firstName} {item?.contactDetail?.lastName}
          </Text>
          <Text style={commonStyles.mediumMutedText}>{item?.id}</Text>
        </View>
      </View>
      {/* <CheckBox checked={item.joined} /> */}
    </View>
  );

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
    navigation.navigate(NavigationRouteNames.STUDENT.CANCEL_REASON, { classId });
  };

  const goToOnlineClass = () => {
    setShowClassStartedPopup(false);
    navigation.navigate(NavigationRouteNames.ONLINE_CLASS, { classDetails: classData });
  };

  const getTutorImage = (tutor) => {
    return getUserImageUrl(tutor?.profileImage?.filename, tutor?.contactDetail?.gender, tutor?.id);
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
    setShowBackButton(scrollPosition > 30);
  };

  const [reScheduleClass, { loading: scheduleLoading }] = useMutation(RE_SCHEDULE_CLASS, {
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

  const onScheduleClass = (slot) => {
    reScheduleClass({
      variables: {
        classesCreateDto: {
          id: classData?.classEntity?.id,
          startDate: slot.startDate,
          endDate: slot.endDate,
        },
      },
    });
  };

  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <Loader isLoading={classDetailsLoading} />
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => handleScroll(event)}
        scrollEventThrottle={16}
        scrollEnabled={classData?.students?.length > 2}>
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
                    {`${classData?.classEntity?.offering?.displayName} by ${classData?.classEntity?.tutor?.contactDetail?.firstName} ${classData?.classEntity?.tutor?.contactDetail?.lastName}`}
                  </Text>
                  <Text style={[styles.classText, { fontSize: RFValue(17, STANDARD_SCREEN_SIZE) }]}>
                    {`${classData?.classEntity?.offering?.parentOffering?.displayName} | ${classData?.classEntity?.offering?.parentOffering?.parentOffering?.displayName}`}
                  </Text>
                </View>
              </View>

              {moment(classData.endDate).isAfter(new Date()) && (
                <View style={{}}>
                  <Button
                    block
                    onPress={goToOnlineClass}
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
              )}
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
                  <View
                    style={{
                      height: RfH(54),
                      justifyContent: 'center',
                      paddingHorizontal: RfW(0),
                      marginRight: RfH(16),
                    }}>
                    <Text style={commonStyles.headingPrimaryText} numberOfLines={1}>
                      {`${classData?.classEntity?.offering?.displayName} by ${classData?.classEntity?.tutor?.contactDetail?.firstName} ${classData?.classEntity?.tutor?.contactDetail?.lastName}`}
                    </Text>
                    <Text style={[commonStyles.mediumMutedText, { marginTop: RfH(4) }]}>
                      {`${classData?.classEntity?.offering?.parentOffering?.displayName} | ${classData?.classEntity?.offering?.parentOffering?.parentOffering?.displayName}`}
                    </Text>
                  </View>

                  {moment(classData.endDate).isAfter(new Date()) && (
                    <View>
                      <Button
                        block
                        onPress={goToOnlineClass}
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
                          iconHeight={RfH(20)}
                          iconWidth={RfW(20)}
                          styling={{ alignSelf: 'center' }}
                        />
                        <Text style={[commonStyles.textButtonPrimary, { marginLeft: RfW(8) }]}>Join</Text>
                      </Button>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfW(16), marginTop: RfH(80) }]}>
          <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.tutor_icon} />
          <Text style={[commonStyles.headingPrimaryText, { marginLeft: RfW(16) }]}>Tutor</Text>
        </View>
        <View style={[commonStyles.horizontalChildrenView, { margin: RfW(16), marginLeft: 56 }]}>
          <IconButtonWrapper
            iconImage={getTutorImage(classData?.classEntity?.tutor)}
            iconHeight={RfH(48)}
            iconWidth={RfH(48)}
            styling={{ borderRadius: RfH(8) }}
          />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <Text style={commonStyles.headingPrimaryText}>
              {classData?.classEntity?.tutor?.contactDetail?.firstName}{' '}
              {classData?.classEntity?.tutor?.contactDetail?.lastName}
            </Text>
            <Text style={commonStyles.mediumMutedText}>T{classData?.classEntity?.tutor?.id}</Text>
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfH(16), height: 60 }]}>
          <IconButtonWrapper iconImage={Images.calendar_icon} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>{printDate(classData?.classEntity?.startDate)}</Text>
            <Text style={commonStyles.mediumMutedText}>{printTime(classData?.classEntity?.startDate)}</Text>
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfH(16), height: 60 }]}>
          <IconButtonWrapper
            iconImage={Images.bell}
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            imageResizeMode="contain"
          />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>Notification alert</Text>
            <Text style={commonStyles.mediumMutedText}>20 minutes before</Text>
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfH(16), height: 60 }]}>
          <IconButtonWrapper
            iconImage={Images.attendees}
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            imageResizeMode="contain"
          />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>Attendees</Text>
            <Text style={commonStyles.mediumMutedText}>
              {classData?.classEntity?.students?.length} participants to join the Class
            </Text>
          </View>
        </View>
        <FlatList
          style={{ marginBottom: RfH(16), marginLeft: 40 }}
          showsHorizontalScrollIndicator={false}
          data={classData?.classEntity?.students}
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

        {classData?.classEntity?.address && (
          <>
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
          </>
        )}

        {/* <View style={[commonStyles.lineSeparator, { marginTop: 16, marginBottom: 8 }]} /> */}

        <View
          style={[commonStyles.horizontalChildrenView, { marginTop: RfH(16), paddingHorizontal: RfH(16), height: 60 }]}>
          <IconButtonWrapper
            iconImage={Images.personal}
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            imageResizeMode="contain"
          />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>Class ID</Text>
            <Text style={commonStyles.mediumMutedText}>
              C-{new Date().getFullYear().toString().substring(2, 4)}
              {new Date().getMonth()}
              {classData?.classEntity?.id}
            </Text>
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithVerticalMargin} />

        {(classData?.isRescheduleAllowed || classData?.isCancelAllowed) && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginTop: RfH(16),
              marginBottom: RfH(34),
            }}>
            {classData?.isRescheduleAllowed && (
              <Button
                onPress={openRescheduleModal}
                block
                style={{ width: RfW(150), backgroundColor: Colors.brandBlue2 }}>
                <Text style={commonStyles.textButtonPrimary}>Reschedule Class</Text>
              </Button>
            )}
            {classData?.isCancelAllowed && (
              <Button onPress={goToCancelReason} block style={{ width: RfW(150), backgroundColor: Colors.orangeRed }}>
                <Text style={commonStyles.textButtonPrimary}>Cancel Class</Text>
              </Button>
            )}
          </View>
        )}
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
      {/* <Modal */}
      {/*  animationType="fade" */}
      {/*  backdropOpacity={1} */}
      {/*  transparent */}
      {/*  visible={showCancelClassStartedPopup} */}
      {/*  onRequestClose={() => { */}
      {/*    setShowCancelClassStartedPopup(false); */}
      {/*  }}> */}
      {/*  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}> */}
      {/*    <View style={{ flex: 1 }} /> */}
      {/*    <View */}
      {/*      style={{ */}
      {/*        flexDirection: 'column', */}
      {/*        justifyContent: 'flex-start', */}
      {/*        alignItems: 'stretch', */}
      {/*        paddingHorizontal: RfW(16), */}
      {/*      }}> */}
      {/*      <View style={{ backgroundColor: Colors.white, opacity: 1, padding: RfW(16) }}> */}
      {/*        <IconButtonWrapper */}
      {/*          iconHeight={RfH(24)} */}
      {/*          iconWidth={RfW(24)} */}
      {/*          styling={{ alignSelf: 'flex-end', marginRight: RfW(16), marginTop: RfH(16) }} */}
      {/*          iconImage={Images.cross} */}
      {/*          submitFunction={() => setShowCancelClassStartedPopup(false)} */}
      {/*        /> */}
      {/*        <View style={{ padding: RfH(16) }}> */}
      {/*          <Text style={[commonStyles.mediumMutedText, { fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }]}> */}
      {/*            Do you want to re-schedule your class? */}
      {/*          </Text> */}
      {/*        </View> */}
      {/*        <View */}
      {/*          style={{ */}
      {/*            flexDirection: 'row', */}
      {/*            justifyContent: 'space-between', */}
      {/*            alignItems: 'center', */}
      {/*            marginTop: RfH(32), */}
      {/*          }}> */}
      {/*          <Button */}
      {/*            onPress={goToCancelReason} */}
      {/*            block */}
      {/*            bordered */}
      {/*            style={{ flex: 1, height: RfH(40), alignSelf: 'center', marginRight: RfW(8) }}> */}
      {/*            <Text style={{ color: Colors.brandBlue2, fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }}> */}
      {/*              Cancel Class */}
      {/*            </Text> */}
      {/*          </Button> */}
      {/*          <Button */}
      {/*            onPress={openRescheduleModal} */}
      {/*            block */}
      {/*            style={{ flex: 1, backgroundColor: Colors.brandBlue2, height: RfH(40) }}> */}
      {/*            <Text style={commonStyles.textButtonPrimary}>Reschedule</Text> */}
      {/*          </Button> */}
      {/*        </View> */}
      {/*      </View> */}
      {/*    </View> */}
      {/*    <View style={{ flex: 1 }} /> */}
      {/*  </View> */}
      {/* </Modal> */}
      <DateSlotSelectorModal
        visible={showReschedulePopup}
        onClose={() => setShowReschedulePopup(false)}
        tutorId={classData?.classEntity?.tutor?.id}
        onSubmit={onScheduleClass}
      />
    </View>
  );
}

export default ScheduledClassDetails;
