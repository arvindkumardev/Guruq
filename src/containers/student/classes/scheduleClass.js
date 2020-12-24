import { useMutation } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import moment from 'moment';
import { BackArrow, DateSlotSelectorModal, IconButtonWrapper, Loader } from '../../../components';
import { Colors, Fonts, Images } from '../../../theme';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { getUserImageUrl, RfH, RfW } from '../../../utils/helpers';
import { SCHEDULE_CLASS } from '../class.mutation';
import { GET_SCHEDULED_CLASSES } from '../booking.query';
import { studentDetails } from '../../../apollo/cache';
import routeNames from '../../../routes/screenNames';

function ScheduleClass(props) {
  const navigation = useNavigation();
  const { route } = props;
  const studentInfo = useReactiveVar(studentDetails);
  const classData = route?.params?.classData;

  const [showSlotSelector, setShowSlotSelector] = useState(false);
  const [tutorClasses, setTutorClasses] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [getScheduledClasses, { loading: loadingScheduledClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
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
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
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

  const onBackPress = () => {
    navigation.goBack();
  };

  const getTutorImage = (tutor) => {
    return getUserImageUrl(tutor?.profileImage?.filename, tutor?.contactDetail?.gender, tutor.id);
  };

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
    navigation.navigate(routeNames.STUDENT.SCHEDULED_CLASS_DETAILS, { classId });
  };

  const renderTutorDetails = () => (
    <View>
      <View style={{ height: RfH(30) }} />
      <Text style={commonStyles.headingPrimaryText}>{classData?.offering?.displayName} Class</Text>
      <View style={commonStyles.horizontalChildrenSpaceView}>
        <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
          {classData?.offering?.parentOffering?.parentOffering?.displayName} |{' '}
          {classData?.offering?.parentOffering?.displayName}
        </Text>
      </View>
      <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(8) }} />
      <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(20) }]}>
        <View style={commonStyles.horizontalChildrenStartView}>
          <View style={commonStyles.verticallyStretchedItemsView}>
            <IconButtonWrapper
              styling={{ borderRadius: RfH(32) }}
              iconWidth={RfH(64)}
              iconHeight={RfH(64)}
              imageResizeMode="cover"
              iconImage={getTutorImage(classData?.tutor)}
            />
          </View>
          <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
            <Text
              style={{
                fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                fontFamily: Fonts.semiBold,
                marginTop: RfH(2),
              }}>
              {classData?.tutor?.contactDetail?.firstName} {classData?.tutor?.contactDetail?.lastName}
            </Text>
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
              T{classData?.tutor.id}
            </Text>
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
              {classData?.onlineClass ? 'Online' : 'Offline'} Classes
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderClassView = (item, index) => (
    <View style={{ flex: 0.5, marginTop: RfH(16) }}>
      <TouchableWithoutFeedback
        onPress={() => (item.isScheduled ? classDetailNavigation(item.classId) : showSlotPopup())}>
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
            {!item.isScheduled && (
              <IconButtonWrapper
                iconHeight={RfH(20)}
                iconWidth={RfW(24)}
                iconImage={Images.calendar}
                styling={{ marginTop: RfH(8) }}
              />
            )}
            {item.isScheduled && (
              <>
                <Text
                  style={{
                    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
                    color: Colors.darkGrey,
                    marginTop: RfH(8),
                  }}>
                  {moment(item.startDate).format('DD-MMM-YYYY')}
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
                    color: Colors.darkGrey,
                    marginTop: RfH(8),
                  }}>
                  {moment(item.startDate).format('HH:MM A')}
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
      <View style={[commonStyles.mainContainer, { paddingTop: RfH(44), backgroundColor: Colors.white }]}>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <View style={commonStyles.horizontalChildrenView}>
            <BackArrow action={onBackPress} />
            <Text style={[commonStyles.headingPrimaryText, { marginLeft: RfW(16) }]}>Schedule Class</Text>
          </View>
        </View>
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
        <DateSlotSelectorModal
          visible={showSlotSelector}
          onClose={() => setShowSlotSelector(false)}
          tutorId={classData?.tutor?.id}
          onSubmit={onScheduleClass}
          studentId={studentInfo?.id}
        />
      </View>
    </>
  );
}

export default ScheduleClass;
