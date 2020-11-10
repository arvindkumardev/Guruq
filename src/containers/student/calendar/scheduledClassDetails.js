import { Text, View, FlatList, ScrollView, Modal } from 'react-native';
import React, { useState } from 'react';
import { Button, CheckBox } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { RfH, RfW } from '../../../utils/helpers';
import { Colors, Images } from '../../../theme';
import { IconButtonWrapper, DateSlotSelectorModal } from '../../../components';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import routeNames from '../../../routes/screenNames';

function ScheduledClassDetails() {
  const navigation = useNavigation();
  const [showReschedulePopup, setShowReschedulePopup] = useState(false);
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
            <Text style={commonStyles.headingText}>{item.studentName}</Text>
            <Text style={commonStyles.secondaryText}>{item.studentId}</Text>
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
            <Text style={commonStyles.headingText}>{item.chapter}</Text>
            <Text style={commonStyles.secondaryText}>
              {item.size} | {item.date}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const goToCancelReason = () => {
    setShowCancelClassStartedPopup(false);
    navigation.navigate(routeNames.STUDENT.CANCEL_REASON);
  };

  const goToOnlineClass = () => {
    setShowClassStartedPopup(false);
    navigation.navigate(routeNames.STUDENT.ONLINE_CLASS);
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const openRescheduleModal = () => {
    setShowCancelClassStartedPopup(false);
    setShowReschedulePopup(true);
  };

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            height: RfH(116),
            backgroundColor: Colors.lightPurple,
            paddingTop: RfH(44),
            paddingLeft: RfW(8),
            paddingRight: RfW(16),
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <IconButtonWrapper iconHeight={RfH(24)} iconImage={Images.backArrow} submitFunction={() => onBackPress()} />
          <View style={[commonStyles.horizontalChildrenSpaceView, { flex: 1 }]}>
            <View style={commonStyles.verticallyStretchedItemsView}>
              <Text style={commonStyles.pageTitle}>English Class</Text>
              <Text style={[commonStyles.secondaryText, { marginTop: RfH(4) }]}>CBSE | Class 9</Text>
            </View>
            <View style={{ alignSelf: 'flex-end' }}>
              <Button
                onPress={() => setShowClassStartedPopup(true)}
                style={[commonStyles.buttonPrimary, { width: RfH(144), marginRight: 0 }]}>
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
        <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfW(16), marginTop: RfH(24) }]}>
          <IconButtonWrapper iconHeight={RfH(18)} iconWidth={RfW(18)} iconImage={Images.two_users} />
          <Text style={[commonStyles.headingText, { marginLeft: RfW(16) }]}>Tutor</Text>
        </View>
        <View style={[commonStyles.horizontalChildrenStartView, { marginTop: RfH(12), marginHorizontal: RfW(16) }]}>
          <IconButtonWrapper
            iconImage={Images.kushal}
            iconHeight={RfH(45)}
            iconWidth={RfH(45)}
            styling={{ borderRadius: RfH(22.5) }}
          />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <Text style={commonStyles.headingText}>Simran Kaur gill</Text>
            <Text style={commonStyles.secondaryText}>GURUQT125744</Text>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.darkGrey,
            marginVertical: RfH(16),
            marginHorizontal: RfW(16),
          }}
        />
        <View style={[commonStyles.horizontalChildrenStartView, { paddingHorizontal: RfH(16) }]}>
          <IconButtonWrapper iconImage={Images.personal} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingText}>Class ID</Text>
            <Text style={commonStyles.secondaryText}>GURUQS123JEHDKI3</Text>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.darkGrey,
            marginVertical: RfH(16),
            marginHorizontal: RfW(16),
          }}
        />
        <View style={[commonStyles.horizontalChildrenStartView, { paddingHorizontal: RfH(16) }]}>
          <IconButtonWrapper iconImage={Images.calendar} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingText}>Friday , Sept 15</Text>
            <Text style={commonStyles.secondaryText}>06:00 PM - 07:00 PM</Text>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.darkGrey,
            marginVertical: RfH(16),
            marginHorizontal: RfW(16),
          }}
        />
        <View style={[commonStyles.horizontalChildrenStartView, { paddingHorizontal: RfH(16) }]}>
          <IconButtonWrapper iconImage={Images.bell_light} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingText}>Notification alert</Text>
            <Text style={commonStyles.secondaryText}>20 minutes before</Text>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.darkGrey,
            marginVertical: RfH(16),
            marginHorizontal: RfW(16),
          }}
        />
        <View style={[commonStyles.horizontalChildrenStartView, { paddingHorizontal: RfH(16) }]}>
          <IconButtonWrapper iconImage={Images.two_users} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingText}>04 Attendees</Text>
            <Text style={commonStyles.secondaryText}>04 people about to join the Class</Text>
          </View>
        </View>
        <FlatList
          style={{ marginTop: RfH(16) }}
          showsHorizontalScrollIndicator={false}
          data={attendees}
          renderItem={({ item, index }) => renderAttendees(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.darkGrey,
            marginVertical: RfH(16),
            marginHorizontal: RfW(16),
          }}
        />
        <View style={[commonStyles.horizontalChildrenStartView, { paddingHorizontal: RfH(16) }]}>
          <IconButtonWrapper iconImage={Images.active_blue_circle} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingText}>Attachments</Text>
          </View>
        </View>
        <FlatList
          style={{ marginTop: RfH(16) }}
          showsHorizontalScrollIndicator={false}
          data={attachment}
          renderItem={({ item, index }) => renderAttachments(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
        <View
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.darkGrey,
            marginVertical: RfH(16),
            marginHorizontal: RfW(16),
          }}
        />
        <View style={[commonStyles.horizontalChildrenStartView, { paddingHorizontal: RfH(16) }]}>
          <IconButtonWrapper iconImage={Images.pin_gray} iconWidth={RfW(24)} iconHeight={RfH(24)} />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
            <Text style={commonStyles.headingText}>Class Location </Text>
          </View>
        </View>
        <View style={{ marginLeft: RfW(16), marginTop: RfH(8) }}>
          <Text style={commonStyles.titleText}>Block 27</Text>
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
        animationType="slide"
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
                <Text style={[commonStyles.secondaryText, { fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }]}>
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
        animationType="slide"
        transparent={false}
        visible={showCancelClassStartedPopup}
        onRequestClose={() => {
          setShowCancelClassStartedPopup(false);
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
                submitFunction={() => setShowCancelClassStartedPopup(false)}
              />
              <View style={{ padding: RfH(16) }}>
                <Text style={[commonStyles.secondaryText, { fontSize: RFValue(16, STANDARD_SCREEN_SIZE) }]}>
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
    </View>
  );
}

export default ScheduledClassDetails;
