/* eslint-disable no-restricted-syntax */
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RFValue } from 'react-native-responsive-fontsize';
import { isEmpty } from 'lodash';
import { DUPLICATE_FOUND } from '../../common/errorCodes';
import { DateSlotSelectorModal, IconButtonWrapper, RateReview, TutorImageComponent } from '../../components';
import BackArrow from '../../components/BackArrow';
import Loader from '../../components/Loader';
import NavigationRouteNames from '../../routes/screenNames';
import { Colors, Images } from '../../theme';
import commonStyles from '../../theme/styles';
import { API_URL, STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { alertBox, getFullName, getToken, printDate, printTime, RfH, RfW } from '../../utils/helpers';
import { ADD_DOCUMENT_TO_CLASS, RE_SCHEDULE_CLASS } from '../student/booking.mutation';
import { GET_CLASS_DETAILS_BY_UUID } from '../student/class.query';
import styles from '../student/tutorListing/styles';
import { userType } from '../../apollo/cache';
import { UserTypeEnum } from '../../common/userType.enum';
import VideoMessagingModal from '../onlineClass/components/videoMessagingModal';
import ActionSheet from '../../components/ActionSheet';
import UploadDocument from '../../components/UploadDocument';
import { DocumentTypeEnum } from '../common/enums';
import CustomModalDocumentViewer from '../../components/CustomModalDocumentViewer';

function ScheduledClassDetails(props) {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const { route } = props;
  const { uuid } = route.params;

  const userTypeVal = useReactiveVar(userType);
  const isStudent = userTypeVal === UserTypeEnum.STUDENT.label;

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReschedulePopup, setShowReschedulePopup] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [viewDocument, setViewDocument] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState({});
  const [classData, setClassData] = useState({});
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [menuItem, setMenuItem] = useState([]);
  const [token, setToken] = useState();

  useEffect(() => {
    getToken().then((tk) => {
      setToken(tk);
    });
  }, []);

  const [getClassDetails, { loading: classDetailsLoading }] = useLazyQuery(GET_CLASS_DETAILS_BY_UUID, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        setClassData(data.classDetails);
      }
    },
  });

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
        alertBox('Class rescheduled successfully', '', {
          positiveText: 'Ok',
          onPositiveClick: () => {
            setShowReschedulePopup(false);
            getClassDetails({ variables: { uuid } });
          },
        });
      }
    },
  });

  const [addDocumentRequest, { loading: addDocumentLoading }] = useMutation(ADD_DOCUMENT_TO_CLASS, {
    fetchPolicy: 'no-cache',
    onError(e) {
      console.log(e);
    },
    onCompleted(data) {
      if (data) {
        getClassDetails({ variables: { uuid } });
      }
    },
  });

  const handleAcceptedFiles = async (file) => {
    setIsUploadModalOpen(false);
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', `multipart/form-data`);
    const formdata = new FormData();
    formdata.append('file', file);
    setIsFileUploading(true);

    try {
      const res = await fetch(`${API_URL}/upload/file`, {
        headers,
        method: 'POST',
        body: formdata,
      }).then((response) => response.json());

      const documentDto = {
        attachment: {
          name: res.filename,
          type: res.type,
          filename: res.filename,
          size: res.size,
        },
      };

      if (userTypeVal === UserTypeEnum.TUTOR.label) {
        documentDto.tutor = {
          id: classData?.classEntity?.tutor?.id,
        };
      }

      documentDto.name = file?.name || 'Class Document';
      documentDto.type = DocumentTypeEnum.OTHER.label;

      if (documentDto.type) {
        addDocumentRequest({ variables: { documentDto, classId: classData?.classEntity?.id } });
      }
      setIsFileUploading(false);
    } catch (error) {
      setIsFileUploading(false);
    }
  };

  useEffect(() => {
    if (uuid && isFocussed) {
      getClassDetails({ variables: { uuid } });
    }
  }, [uuid, isFocussed]);

  useEffect(() => {
    if (route.params.showReviewModal && isFocussed && isStudent) {
      setShowReviewPopup(true);
    }
  }, [route.params.showReviewModal, isFocussed]);

  const handleTutorDetail = () => {
    const selectedOffering = classData?.classEntity?.offering;
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR_DETAILS, {
      tutorData: classData?.classEntity.tutor,
      parentOffering: selectedOffering?.parentOffering?.id,
      parentParentOffering: selectedOffering?.parentOffering?.parentOffering?.id,
      parentOfferingName: selectedOffering?.displayName,
      parentParentOfferingName: selectedOffering?.parentOffering?.displayName,
    });
  };

  const goToCancelReason = () => {
    setOpenMenu(false);
    navigation.navigate(NavigationRouteNames.CANCEL_REASON, { classId: classData?.classEntity?.id });
  };
  const goToHelp = () => {
    setOpenMenu(false);
    navigation.navigate(NavigationRouteNames.CUSTOMER_CARE, { classId: classData?.classEntity?.id });
  };

  const goToOnlineClass = () => {
    navigation.navigate(NavigationRouteNames.ONLINE_CLASS, { uuid: classData?.classEntity?.uuid });
  };

  const openRescheduleModal = () => {
    setOpenMenu(false);
    setShowReschedulePopup(true);
  };

  useEffect(() => {
    if (!isEmpty(classData)) {
      const menuItemData = [
        { label: 'Reschedule Class', handler: openRescheduleModal, isEnabled: classData?.isRescheduleAllowed },
        { label: 'Cancel Class', handler: goToCancelReason, isEnabled: classData?.isCancelAllowed },
        { label: 'Help', handler: goToHelp, isEnabled: true },
      ];
      setMenuItem(menuItemData);
    }
  }, [classData]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    // setShowBackButton(scrollPosition > 30);
  };

  const onScheduleClass = (slot) => {
    reScheduleClass({
      variables: {
        classesCreateDto: {
          id: classData?.classEntity?.id,
          startDate: slot.startDate,
          endDate: slot.endDate,
          orderItemId: classData?.classEntity?.orderItem?.id,
        },
      },
    });
  };

  const renderAttendees = (item) => (
    <View style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(16), marginTop: RfH(12) }]}>
      <View style={[commonStyles.horizontalChildrenView]}>
        <TutorImageComponent tutor={item} height={36} width={36} fontSize={16} styling={{ borderRadius: RfH(36) }} />
        <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
          <Text style={commonStyles.headingPrimaryText}>{getFullName(item?.contactDetail)}</Text>
          <Text style={commonStyles.mediumMutedText}>S-{item?.id}</Text>
        </View>
      </View>
    </View>
  );

  const renderAttachments = (item) => {
    return (
      <View style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(16), marginTop: RfH(16) }]}>
        <View style={commonStyles.horizontalChildrenView}>
          <IconButtonWrapper
            iconImage={item.attachment.type === 'application/pdf' ? Images.pdf : Images.jpg}
            iconHeight={RfH(45)}
            iconWidth={RfH(45)}
            submitFunction={() => {
              setViewDocument(true);
              setSelectedDoc(item);
            }}
          />
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <Text style={commonStyles.headingPrimaryText}>{item?.name}</Text>
            <Text style={commonStyles.mediumMutedText}>
              {item?.attachment?.type.split('/')[1]} | {Math.round(item?.attachment?.size / 1000)}KB |{' '}
              {printDate(item?.createdDate)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={{ backgroundColor: Colors.white, flex: 1 }} activeOpacity={1}>
        <Loader isLoading={isFileUploading || classDetailsLoading || scheduleLoading || addDocumentLoading} />
        {!isEmpty(classData) && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={(event) => handleScroll(event)}
            scrollEventThrottle={16}>
            <View style={[styles.topView]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: RfW(16),
                  flex: 1,
                }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: RfH(15) }}>
                  <BackArrow action={onBackPress} />
                  <View
                    style={[
                      commonStyles.verticallyStretchedItemsView,
                      {
                        marginLeft: RfW(16),
                        flex: 0.9,
                      },
                    ]}>
                    <Text
                      style={[styles.subjectTitle, { fontSize: RFValue(17, STANDARD_SCREEN_SIZE) }]}
                      numberOfLines={1}>
                      {`${classData?.classEntity?.offering?.displayName} by ${getFullName(
                        classData?.classEntity?.tutor?.contactDetail
                      )}`}
                    </Text>
                    <Text style={[styles.classText, { fontSize: RFValue(17, STANDARD_SCREEN_SIZE) }]} numberOfLines={1}>
                      {`${classData?.classEntity?.offering?.parentOffering?.displayName} | ${classData?.classEntity?.offering?.parentOffering?.parentOffering?.displayName}`}
                    </Text>
                  </View>
                </View>

                <View>
                  {(classData?.isRescheduleAllowed || classData?.isCancelAllowed) && (
                    <IconButtonWrapper
                      iconImage={Images.vertical_dots_b}
                      iconHeight={RfH(20)}
                      iconWidth={RfW(20)}
                      submitFunction={() => setOpenMenu(!openMenu)}
                      styling={{ alignSelf: 'center' }}
                    />
                  )}
                  {/* {openMenu && ( */}
                  {/*  <View */}
                  {/*    style={{ */}
                  {/*      position: 'absolute', */}
                  {/*      top: RfH(24), */}
                  {/*      right: RfW(0), */}
                  {/*      backgroundColor: Colors.white, */}
                  {/*      width: 180, */}
                  {/*      paddingVertical: RfH(8), */}

                  {/*      borderWidth: 0.5, */}
                  {/*      borderColor: Colors.darkGrey, */}
                  {/*      zIndex: 99, */}
                  {/*    }}> */}
                  {/*    {classData?.isRescheduleAllowed && ( */}
                  {/*      <TouchableOpacity */}
                  {/*        onPress={openRescheduleModal} */}
                  {/*        style={{ */}
                  {/*          paddingHorizontal: RfH(16), */}
                  {/*          paddingBottom: RfH(10), */}
                  {/*          borderBottomWidth: 0.5, */}
                  {/*          borderColor: Colors.lightGrey, */}
                  {/*        }}> */}
                  {/*        <Text style={[commonStyles.regularPrimaryText, { color: Colors.black }]}>Reschedule Class</Text> */}
                  {/*      </TouchableOpacity> */}
                  {/*    )} */}
                  {/*    {classData?.isCancelAllowed && ( */}
                  {/*      <TouchableOpacity */}
                  {/*        onPress={goToCancelReason} */}
                  {/*        style={{ paddingHorizontal: RfH(16), paddingTop: RfH(10) }}> */}
                  {/*        <Text style={[commonStyles.regularPrimaryText, { color: Colors.black }]}>Cancel Class</Text> */}
                  {/*      </TouchableOpacity> */}
                  {/*    )} */}
                  {/*    <TouchableOpacity */}
                  {/*      onPress={goToHelp} */}
                  {/*      style={{ paddingHorizontal: RfH(16), paddingTop: RfH(16), paddingBottom: RfH(10) }}> */}
                  {/*      <Text style={[commonStyles.regularPrimaryText, { color: Colors.black }]}>Help</Text> */}
                  {/*    </TouchableOpacity> */}
                  {/*  </View> */}
                  {/* )} */}
                </View>
              </View>
            </View>
            <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfW(16), marginTop: RfH(25) }]}>
              <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(16)} iconImage={Images.tutor_icon} />
              <Text style={[commonStyles.headingPrimaryText, { marginLeft: RfW(16) }]}>Tutor</Text>
            </View>
            {!isEmpty(classData) && (
              <TouchableOpacity
                style={[commonStyles.horizontalChildrenView, { margin: RfW(16), marginLeft: 56 }]}
                activeOpacity={0.8}
                onPress={handleTutorDetail}
                disabled={!isStudent}>
                <TutorImageComponent
                  tutor={classData?.classEntity?.tutor}
                  height={36}
                  width={36}
                  fontSize={16}
                  styling={{ borderRadius: RfH(36) }}
                />
                <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
                  <Text style={commonStyles.headingPrimaryText}>
                    {getFullName(classData?.classEntity?.tutor?.contactDetail)}
                  </Text>
                  <Text style={commonStyles.mediumMutedText}>T-{classData?.classEntity?.tutor?.id}</Text>
                </View>
              </TouchableOpacity>
            )}
            <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
            <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfH(16), height: 60 }]}>
              <IconButtonWrapper iconImage={Images.calendar_icon} iconWidth={RfW(16)} iconHeight={RfH(16)} />
              <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
                <Text style={commonStyles.headingPrimaryText}>{printDate(classData?.classEntity?.startDate)}</Text>
                <Text style={commonStyles.mediumMutedText}>
                  {printTime(classData?.classEntity?.startDate)} - {printTime(classData?.classEntity?.endDate)}
                </Text>
              </View>
            </View>

            <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
            <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfH(16), height: 60 }]}>
              <IconButtonWrapper
                iconImage={classData?.classEntity?.onlineClass ? Images.laptop : Images.home}
                iconWidth={RfW(16)}
                iconHeight={RfH(16)}
                imageResizeMode="contain"
              />
              <View style={commonStyles.horizontalChildrenSpaceView}>
                <View style={[commonStyles.verticallyStretchedItemsView, { flex: 1, marginLeft: RfW(16) }]}>
                  <Text style={commonStyles.headingPrimaryText}>Class Mode</Text>
                  <Text style={commonStyles.mediumMutedText}>
                    {classData?.classEntity?.onlineClass ? 'Online ' : 'Offline '}Class
                  </Text>
                </View>

                {classData?.classEntity?.demoClass && (
                  <View
                    style={{
                      backgroundColor: Colors.orange,
                      marginRight: RfW(16),
                      paddingHorizontal: RfW(8),
                      paddingVertical: RfH(4),
                      borderRadius: RfH(8),
                    }}>
                    <Text style={[commonStyles.mediumPrimaryText, { color: Colors.white }]}>Demo</Text>
                  </View>
                )}
              </View>
            </View>

            {/* <View style={commonStyles.lineSeparatorWithHorizontalMargin} /> */}
            {/* <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfH(16), height: 60 }]}> */}
            {/*  <IconButtonWrapper */}
            {/*    iconImage={Images.bell} */}
            {/*    iconWidth={RfW(16)} */}
            {/*    iconHeight={RfH(16)} */}
            {/*    imageResizeMode="contain" */}
            {/*  /> */}
            {/*  <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}> */}
            {/*    <Text style={commonStyles.headingPrimaryText}>Notification alert</Text> */}
            {/*    <Text style={commonStyles.mediumMutedText}>20 minutes before</Text> */}
            {/*  </View> */}
            {/* </View> */}

            <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
            <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfH(16), height: 60 }]}>
              <IconButtonWrapper
                iconImage={Images.attendees}
                iconWidth={RfW(16)}
                iconHeight={RfH(16)}
                imageResizeMode="contain"
              />
              <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16), flex: 1 }]}>
                <Text style={commonStyles.headingPrimaryText}>Attendees</Text>
                <Text style={commonStyles.mediumMutedText}>
                  {classData?.classEntity?.students?.length} participants to join the Class
                </Text>
              </View>
              {classData?.isMessagingAllowed && (
                <View>
                  <IconButtonWrapper
                    iconImage={Images.messaging}
                    iconHeight={24}
                    iconWidth={24}
                    submitFunction={() => setShowMessageModal(true)}
                  />
                </View>
              )}
            </View>
            <FlatList
              style={{ marginBottom: RfH(16), marginLeft: 40 }}
              showsHorizontalScrollIndicator={false}
              data={classData?.classEntity?.students}
              renderItem={({ item, index }) => renderAttendees(item, index)}
              keyExtractor={(item, index) => index.toString()}
            />
            <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

            <View
              style={[
                commonStyles.horizontalChildrenSpaceView,
                { paddingHorizontal: RfH(16), paddingTop: RfH(10), alignItems: 'center' },
              ]}>
              <View style={{ flexDirection: 'row' }}>
                <IconButtonWrapper iconImage={Images.attachment} iconWidth={RfW(16)} iconHeight={RfH(16)} />
                <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
                  <Text style={commonStyles.headingPrimaryText}>Attachments</Text>
                </View>
              </View>
              <View>
                {classData?.isUploadAttachmentAllowed && (
                  <IconButtonWrapper
                    iconImage={Images.add}
                    iconWidth={20}
                    iconHeight={20}
                    imageResizeMode="contain"
                    submitFunction={() => setIsUploadModalOpen(true)}
                  />
                )}
              </View>
            </View>

            {!isEmpty(classData?.classEntity?.documents) ? (
              <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfW(16) }]}>
                <FlatList
                  style={{ marginBottom: RfH(16), marginLeft: 40 }}
                  showsHorizontalScrollIndicator={false}
                  data={classData?.classEntity?.documents.sort((a, b) => (a.id < b.id ? 1 : -1))}
                  renderItem={({ item, index }) => renderAttachments(item, index)}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            ) : (
              <View style={[commonStyles.horizontalChildrenView, { paddingLeft: RfW(50), padding: RfW(16) }]}>
                <Text>No documents uploaded by the tutor.</Text>
              </View>
            )}

            <View style={commonStyles.lineSeparatorWithMargin} />

            {classData?.classEntity?.address && (
              <>
                <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfH(16), height: 60 }]}>
                  <IconButtonWrapper iconImage={Images.pin} iconWidth={RfW(16)} iconHeight={RfH(16)} />
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

            <View style={[commonStyles.horizontalChildrenView, { paddingHorizontal: RfH(16) }]}>
              <IconButtonWrapper
                iconImage={Images.personal}
                iconWidth={RfW(16)}
                iconHeight={RfH(16)}
                imageResizeMode="contain"
              />
              <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(16) }]}>
                <Text style={commonStyles.headingPrimaryText}>Class ID</Text>
                <Text style={commonStyles.mediumMutedText}>C-{classData?.classEntity?.id}</Text>
                {/* <Text style={commonStyles.mediumMutedText}>classData?. */}
                {/* </Text> */}
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
              {!classData?.isClassEnded ? (
                <Button
                  block
                  onPress={() =>
                    classData?.isClassJoinAllowed
                      ? goToOnlineClass()
                      : alertBox('You can join the class 15 mins before the start time.')
                  }
                  style={[
                    classData?.isClassJoinAllowed ? commonStyles.buttonPrimary : commonStyles.disableButton,
                    {
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
                  <Text style={[commonStyles.textButtonPrimary, { marginLeft: RfW(8) }]}>Join Class</Text>
                </Button>
              ) : (
                <Text>Class Has Ended!</Text>
              )}
            </View>
          </ScrollView>
        )}
        {classData && classData?.classEntity?.uuid && (
          <VideoMessagingModal
            onClose={() => setShowMessageModal(false)}
            visible={showMessageModal}
            channelName={classData?.classEntity?.uuid}
          />
        )}

        {showReschedulePopup && (
          <DateSlotSelectorModal
            visible={showReschedulePopup}
            onClose={() => setShowReschedulePopup(false)}
            tutorId={classData?.classEntity?.tutor?.id}
            onSubmit={onScheduleClass}
            isReschedule
          />
        )}

        {showReviewPopup && (
          <RateReview
            visible={showReviewPopup}
            onClose={() => setShowReviewPopup(false)}
            classDetails={classData?.classEntity}
          />
        )}

        <ActionSheet
          actions={menuItem}
          cancelText="Dismiss"
          handleCancel={() => setOpenMenu(false)}
          isVisible={openMenu}
          topLabel="Action"
        />

        {isUploadModalOpen && (
          <UploadDocument
            isVisible={isUploadModalOpen}
            handleClose={() => setIsUploadModalOpen(!isUploadModalOpen)}
            isFilePickerVisible
            handleUpload={handleAcceptedFiles}
            snapCount={1}
          />
        )}
      </View>
      {viewDocument && !isEmpty(selectedDoc) && (
        <CustomModalDocumentViewer
          document={selectedDoc}
          modalVisible={viewDocument}
          backButtonHandler={() => setViewDocument(false)}
        />
      )}
    </>
  );
}

export default ScheduledClassDetails;
