import { useMutation } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { BackArrow, DateSlotSelectorModal, IconButtonWrapper, Loader } from '../../../components';
import { Colors, Fonts, Images } from '../../../theme';
import commonStyles from '../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { getUserImageUrl, RfH, RfW } from '../../../utils/helpers';
import { SCHEDULE_CLASS } from '../class.mutation';
import NavigationRouteNames from '../../../routes/screenNames';

function ScheduleClass(props) {
  const navigation = useNavigation();
  const { route } = props;
  const classData = route?.params?.classData;
  const classes = [];
  const [showSlotSelector, setShowSlotSelector] = useState(false);
  const [tutorClasses, setTutorClasses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [scheduleClass, { loading: scheduleLoading }] = useMutation(SCHEDULE_CLASS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setShowSlotSelector(false);
        navigation.navigate(NavigationRouteNames.STUDENT.MY_CLASSES);
        // const array = [];
        // classes.map((obj) => {
        //   array.push(obj);
        // });
        // array[selectedIndex].date = new Date(data.scheduleClass.startDate).toDateString();
        // setTutorClasses(array);
        // setShowSlotSelector(false);
      }
    },
  });

  useEffect(() => {
    if (classData) {
      const classes = [];
      for (let i = 1; i <= classData.availableClasses; i++) {
        classes.push({ class: `${i}`, date: '', startTime: '' });
      }
      setTutorClasses(classes);
    }
  }, [classData]);
  //
  // const [getScheduledClasses, { loading: loadingScheduledClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
  //   onError: (e) => {
  //     if (e.graphQLErrors && e.graphQLErrors.length > 0) {
  //       const error = e.graphQLErrors[0].extensions.exception.response;
  //     }
  //   },
  //   onCompleted: (data) => {
  //     const array = [];
  //     classes.map((obj) => {
  //       array.push(obj);
  //     });
  //     console.log("data.getScheduledClasses",data.getScheduledClasses)
  //     for (let i = 0; i < data.getScheduledClasses.length; i++) {
  //       if (parseInt(array[i].class) === i + 1) {
  //         array[i].date = new Date(data.getScheduledClasses[i].startDate).toDateString();
  //       }
  //     }
  //     setTutorClasses(array);
  //   },
  // });
  //
  // useEffect(() => {
  //   getScheduledClasses({
  //     variables: {
  //       classesSearchDto: {
  //         orderItemId: classData.id,
  //         startDate: moment().toDate(),
  //         endDate: moment().endOf('day').toDate(),
  //       },
  //     },
  //   });
  // }, []);

  const onBackPress = () => {
    navigation.goBack();
  };

  const getTutorImage = (tutor) => {
    return getUserImageUrl(tutor?.profileImage?.filename, tutor?.contactDetail?.gender, tutor.id);
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

  const showSlotPopup = (item, index) => {
    if (!item.date) {
      setSelectedIndex(index);
      setShowSlotSelector(true);
    }
  };

  const renderClassView = (item, index) => {
    return (
      <View style={{ flex: 0.5, marginTop: RfH(16) }}>
        <TouchableWithoutFeedback onPress={() => showSlotPopup(item, index)}>
          <View>
            <View
              style={{
                marginRight: RfW(8),
                marginLeft: RfW(8),
                height: RfH(96),
                backgroundColor: !item.date ? Colors.lightBlue : Colors.lightGrey,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
              }}>
              <Text style={[commonStyles.headingPrimaryText, { color: Colors.darkGrey }]}>Class {item.class}</Text>
              {item.date === '' && (
                <IconButtonWrapper
                  iconHeight={RfH(20)}
                  iconWidth={RfW(24)}
                  iconImage={Images.calendar}
                  styling={{ marginTop: RfH(8) }}
                />
              )}
              {item.date !== '' && (
                <Text
                  style={{
                    fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
                    color: Colors.darkGrey,
                    marginTop: RfH(8),
                  }}>
                  {item.date}
                </Text>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
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

  return (
    <>
      <Loader isLoading={scheduleLoading} />
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
        />
        <DateSlotSelectorModal
          visible={showSlotSelector}
          onClose={() => setShowSlotSelector(false)}
          tutorId={classData?.tutor?.id}
          onSubmit={onScheduleClass}
        />
      </View>
    </>
  );
}

export default ScheduleClass;
