import { FlatList, Modal, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, CheckBox } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import MapView, { Marker } from 'react-native-maps';
import { RfH, RfW } from '../../../utils/helpers';
import { Colors, Images } from '../../../theme';
import { DateSlotSelectorModal, IconButtonWrapper, RateReview } from '../../../components';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import NavigationRouteNames from '../../../routes/screenNames';

import styles from '../tutorListing/styles';
import BackArrow from '../../../components/BackArrow';

function ScheduledClassDetails(props) {
  const navigation = useNavigation();
  const [showReschedulePopup, setShowReschedulePopup] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);

  // const [startPosition, setStartPosition] = useState(new Animated.ValueXY({ x: 10, y: 450 }));

  const { route } = props;

  const { classDetails } = route.params;

  useEffect(() => {
    if (route && route.params && route.params.classEnded) {
      navigation.navigate(NavigationRouteNames.STUDENT.RATE_AND_REVIEW, { classDetails });
    }
  }, [route]);

  const [attendees, setAttendees] = useState([
    {
      icon: Images.kushal,
      studentName: 'Sheena ',
      studentId: 'GURUQS4528',
      joined: true,
    },
    {
      icon: Images.kushal,
      studentName: 'Tanushree Dutta ',
      studentId: 'GURUQS4528',
      joined: false,
    },
    {
      icon: Images.kushal,
      studentName: 'Trasha Hemani ',
      studentId: 'GURUQS4528',
      joined: false,
    },
    {
      icon: Images.kushal,
      studentName: 'Xavi Marique ',
      studentId: 'GURUQS4528',
      joined: false,
    },
  ]);
  const [attachment, setAttachment] = useState([
    {
      icon: Images.pdf,
      chapter: 'Chapter 01.pdf',
      size: '15 KB',
      date: '15 Sept',
    },
    {
      icon: Images.xls,
      chapter: 'Chapter 02 Notes.xlsx',
      size: '15 KB',
      date: '15 Sept',
    },
  ]);
  const [showBackButton, setShowBackButton] = useState(false);
  const [showClassStartedPopup, setShowClassStartedPopup] = useState(false);
  const [showCancelClassStartedPopup, setShowCancelClassStartedPopup] = useState(false);
  const renderAttendees = (item) => {
    return (
      <View style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(16), marginTop: RfH(12) }]}>
        <View style={commonStyles.horizontalChildrenStartView}>
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
        <View style={commonStyles.horizontalChildrenStartView}>
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
    navigation.navigate(NavigationRouteNames.STUDENT.CANCEL_REASON);
  };

  const goToOnlineClass = () => {
    setShowClassStartedPopup(false);
    navigation.navigate(NavigationRouteNames.ONLINE_CLASS, { classDetails: {} });
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
                height: RfH(44),
                marginTop: RfH(8),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: RfW(16),
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <BackArrow action={onBackPress} />

                <View style={commonStyles.verticallyStretchedItemsView}>
                  <Text style={[styles.subjectTitle, { fontSize: RFValue(17, STANDARD_SCREEN_SIZE) }]}>
                    English Class
                  </Text>
                  <Text style={[styles.classText, { fontSize: RFValue(17, STANDARD_SCREEN_SIZE) }]}>
                    CBSE | Class 9
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
                      width: RfH(116),
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
                  <Text style={[commonStyles.textButtonPrimary, { marginLeft: RfW(8) }]}>Start Class</Text>
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
                    <Text style={commonStyles.headingPrimaryText}>English Class</Text>
                    <Text style={[commonStyles.mediumMutedText, { marginTop: RfH(4) }]}>CBSE | Class 9</Text>
                  </View>

                  <View style={{}}>
                    <Button
                      block
                      onPress={() => goToOnlineClass()}
                      // setShowClassStartedPopup(true)}
                      style={[
                        commonStyles.buttonPrimary,
                        {
                          width: RfH(116),
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
                      <Text style={[commonStyles.textButtonPrimary, { marginLeft: RfW(8) }]}>Start Class</Text>
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfW(16), marginTop: RfH(54) }]}>
          <IconButtonWrapper iconHeight={RfH(18)} iconWidth={RfW(18)} iconImage={Images.two_users} />
          <Text style={[commonStyles.headingPrimaryText, { marginLeft: RfW(16) }]}>Tutor</Text>
        </View>
        <View style={[commonStyles.horizontalChildrenStartView, { marginTop: RfH(12), marginHorizontal: RfW(16) }]}>
          <IconButtonWrapper
            iconImage={Images.kushal}
            iconHeight={RfH(45)}
            iconWidth={RfH(45)}
            styling={{ borderRadius: RfH(22.5) }}
          />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <Text style={commonStyles.headingPrimaryText}>Simran Kaur gill</Text>
            <Text style={commonStyles.mediumMutedText}>GURUQT125744</Text>
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithMargin} />

        <View style={[commonStyles.horizontalChildrenStartView, { paddingHorizontal: RfH(16) }]}>
          <IconButtonWrapper iconImage={Images.personal} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>Class ID</Text>
            <Text style={commonStyles.mediumMutedText}>GURUQS123JEHDKI3</Text>
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithMargin} />

        <View style={[commonStyles.horizontalChildrenStartView, { paddingHorizontal: RfH(16) }]}>
          <IconButtonWrapper iconImage={Images.calendar} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>Friday , Sept 15</Text>
            <Text style={commonStyles.mediumMutedText}>06:00 PM - 07:00 PM</Text>
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithMargin} />

        <View style={[commonStyles.horizontalChildrenStartView, { paddingHorizontal: RfH(16) }]}>
          <IconButtonWrapper iconImage={Images.bell_light} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>Notification alert</Text>
            <Text style={commonStyles.mediumMutedText}>20 minutes before</Text>
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithMargin} />

        <View style={[commonStyles.horizontalChildrenStartView, { paddingHorizontal: RfH(16) }]}>
          <IconButtonWrapper iconImage={Images.two_users} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>04 Attendees</Text>
            <Text style={commonStyles.mediumMutedText}>04 people about to join the Class</Text>
          </View>
        </View>
        <FlatList
          style={{ marginTop: RfH(16) }}
          showsHorizontalScrollIndicator={false}
          data={attendees}
          renderItem={({ item, index }) => renderAttendees(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />

        <View style={commonStyles.lineSeparatorWithMargin} />

        <View style={[commonStyles.horizontalChildrenStartView, { paddingHorizontal: RfH(16) }]}>
          <IconButtonWrapper iconImage={Images.active_blue_circle} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>Attachments</Text>
          </View>
        </View>
        <FlatList
          style={{ marginTop: RfH(16) }}
          showsHorizontalScrollIndicator={false}
          data={attachment}
          renderItem={({ item, index }) => renderAttachments(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />

        <View style={commonStyles.lineSeparatorWithMargin} />

        <View style={[commonStyles.horizontalChildrenStartView, { paddingHorizontal: RfH(16) }]}>
          <IconButtonWrapper iconImage={Images.pin_gray} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingPrimaryText}>Class Location </Text>
          </View>
        </View>

        <View style={{ marginTop: RfH(8) }}>
          <MapView
            style={{ flex: 1, height: 500 }}
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

        <View style={{ marginLeft: RfW(16), marginTop: RfH(8) }}>
          <Text style={commonStyles.headingPrimaryText}>Block 27</Text>
          <Text style={{ fontSize: RFValue(12, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
            Block 72, , Ashok Nagar, New Delhi, Delhi 110018, India
          </Text>
          <Text style={{ fontSize: RFValue(12, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
            Landmark : Monga Sweets
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: RfH(24),
            marginBottom: RfH(24),
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
      <DateSlotSelectorModal visible={showReschedulePopup} onClose={() => setShowReschedulePopup(false)} />
      <RateReview visible={showReviewPopup} onClose={() => setShowReviewPopup(false)} />
    </View>
  );
}

export default ScheduledClassDetails;
