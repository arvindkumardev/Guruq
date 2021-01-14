import { useMutation } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { DateSlotSelectorModal, IconButtonWrapper, Loader, ScreenHeader, TutorImageComponent } from '../../components';
import { Colors, Fonts, Images } from '../../theme';
import commonStyles from '../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { alertBox, getFullName, printDate, printTime, RfH, RfW } from '../../utils/helpers';
import { SCHEDULE_CLASS } from '../student/class.mutation';
import { GET_SCHEDULED_CLASSES } from '../student/booking.query';
import { studentDetails, userType } from '../../apollo/cache';
import NavigationRouteNames from '../../routes/screenNames';
import { UserTypeEnum } from '../../common/userType.enum';

function ScheduleClass(props) {
  const navigation = useNavigation();
  const { route } = props;
  const studentInfo = useReactiveVar(studentDetails);
  const classData = route?.params?.classData;

  const [showSlotSelector, setShowSlotSelector] = useState(false);
  const [tutorClasses, setTutorClasses] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const userTypeVal = useReactiveVar(userType);
  const isStudent = userTypeVal === UserTypeEnum.STUDENT.label;

  const [getScheduledClasses, { loading: loadingScheduledClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data && data.getScheduledClasses) {
        const scheduledClasses = data.getScheduledClasses.map((item) => ({
          startDate: item.startDate,
          classId: item.id,
        }));
        const classes = tutorClasses;
        for (let i = 0; i < scheduledClasses.length; i++) {
          classes[i] = { ...scheduledClasses[i], isScheduled: true };
        }
        console.log('classes', classes);
        setTutorClasses(classes);
        setRefresh(!refresh);
      }
    },
  });

  const getScheduleClassCall = () => {
    getScheduledClasses({
      variables: {
        classesSearchDto: {
          orderItemId: classData.id,
        },
      },
    });
  };

  const [scheduleClass, { loading: scheduleLoading }] = useMutation(SCHEDULE_CLASS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
      alertBox('There is a conflict at this time, please choose another time slot.');
    },
    onCompleted: (data) => {
      if (data) {
        getScheduleClassCall();
        setShowSlotSelector(false);
      }
    },
  });

  useEffect(() => {
    if (classData) {
      const classes = [];
      for (let i = 0; i < classData.count; i++) {
        classes.push({ startDate: '', isScheduled: false, classId: '' });
      }
      setTutorClasses(classes);
      getScheduleClassCall();
    }
  }, [classData]);

  const showSlotPopup = () => {
    setShowSlotSelector(true);
  };

  const onScheduleClass = (slot) => {
    scheduleClass({
      variables: {
        classesCreateDto: {
          orderItemId: classData?.id,
          startDate: slot.startDate,
          endDate: slot.endDate,
        },
      },
    });
  };

  const classDetailNavigation = (classId) => {
    navigation.navigate(NavigationRouteNames.STUDENT.SCHEDULED_CLASS_DETAILS, { classId });
  };

  const tutorDetail = (item) => {
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR_DETAILS, {
      tutorId: item.tutor.id,
      parentOffering: item.offering?.parentOffering?.id,
      parentParentOffering: item.offering?.parentOffering?.parentOffering?.id,
      parentOfferingName: item.offering?.parentOffering?.displayName,
      parentParentOfferingName: item.offering?.parentOffering?.parentOffering?.displayName,
    });
  };

  const renderTutorDetails = () => (
    <View>
      <View style={{ height: RfH(30) }} />
      <Text style={commonStyles.headingPrimaryText}>
        {classData?.offering?.displayName ? classData?.offering?.displayName : classData?.offering?.name} Class
      </Text>
      <View style={commonStyles.horizontalChildrenSpaceView}>
        <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
          {classData?.offering?.parentOffering?.parentOffering?.displayName
            ? classData?.offering?.parentOffering?.parentOffering?.displayName
            : classData?.offering?.parentOffering?.parentOffering?.name}{' '}
          |{' '}
          {classData?.offering?.parentOffering?.displayName
            ? classData?.offering?.parentOffering?.displayName
            : classData?.offering?.parentOffering?.name}
        </Text>
      </View>
      <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(8) }} />
      <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(20) }]}>
        <TouchableOpacity
          style={commonStyles.horizontalChildrenStartView}
          onPress={() => tutorDetail(classData)}
          disabled={!isStudent}>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <TutorImageComponent
              tutor={isStudent ? classData?.tutor : { contactDetail: classData?.createdBy }}
              styling={{ borderRadius: RfH(32), width: RfH(64), height: RfH(64) }}
            />
          </View>
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <Text
              style={{
                fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                fontFamily: Fonts.semiBold,
                marginTop: RfH(2),
              }}>
              {isStudent ? `${getFullName(classData?.tutor?.contactDetail)}` : `${getFullName(classData?.createdBy)}`}
            </Text>
            {isStudent && (
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                T-{classData?.tutor.id}
              </Text>
            )}
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
              {classData?.onlineClass ? 'Online' : 'Offline'} Classes
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderClassView = (item, index) => (
    <View style={{ flex: 0.5, marginTop: RfH(16) }}>
      <TouchableWithoutFeedback
        onPress={() => (item.isScheduled ? classDetailNavigation(item.classId) : isStudent ? showSlotPopup() : null)}
        activeOpacity={0.8}>
        <View>
          <View
            style={{
              marginRight: RfW(8),
              marginLeft: RfW(8),
              height: RfH(96),
              backgroundColor: !item.isScheduled ? Colors.lightBlue : Colors.lightGrey,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}>
            <Text style={[commonStyles.headingPrimaryText, { color: Colors.darkGrey }]}>Class {index + 1}</Text>
            {!item.isScheduled && isStudent && (
              <IconButtonWrapper
                iconHeight={RfH(20)}
                iconWidth={RfH(24)}
                iconImage={Images.calendar}
                styling={{ marginTop: RfH(8) }}
              />
            )}
            {!item.isScheduled && !isStudent && (
              <Text
                style={{
                  fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
                  color: Colors.darkGrey,
                  marginTop: RfH(8),
                }}>
                Not Scheduled
              </Text>
            )}
            {item.isScheduled && (
              <>
                <Text
                  style={{
                    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
                    color: Colors.darkGrey,
                    marginTop: RfH(8),
                  }}>
                  {printDate(item.startDate)}
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
                    color: Colors.darkGrey,
                    marginTop: RfH(8),
                  }}>
                  {printTime(item.startDate)}
                </Text>
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  return (
    <>
      <Loader isLoading={scheduleLoading || loadingScheduledClasses} />
      <ScreenHeader label="Schedule Class" homeIcon horizontalPadding={RfW(16)} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
        {renderTutorDetails()}
        <View style={{ height: RfH(20) }} />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={tutorClasses}
          numColumns={2}
          renderItem={({ item, index }) => renderClassView(item, index)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: RfH(34) }}
          scrollEnabled={tutorClasses.length > 6}
          extraData={refresh}
        />
      </View>
      <DateSlotSelectorModal
        visible={showSlotSelector}
        onClose={() => setShowSlotSelector(false)}
        tutorId={classData?.tutor?.id}
        onSubmit={onScheduleClass}
        studentId={studentInfo?.id}
      />
    </>
  );
}

export default ScheduleClass;
