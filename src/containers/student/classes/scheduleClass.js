/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-const-assign */
/* eslint-disable no-plusplus */
import { Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import commonStyles from '../../../theme/styles';
import { getTutorImageUrl, RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { DateSlotSelectorModal, IconButtonWrapper } from '../../../components';
import { Images, Colors, Fonts } from '../../../theme';
import BackArrow from '../../../components/BackArrow';
import { GET_AVAILABILITY } from '../class.query';
import { SCHEDULE_CLASS } from '../class.mutation';

function scheduleClass(props) {
  const navigation = useNavigation();
  const { route } = props;
  const classData = route?.params?.classData;
  const classes = route?.params?.classes;

  const [showSlotSelector, setShowSlotSelector] = useState(false);
  // const [availability, setAvailability] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [tutorClasses, setTutorClasses] = useState([]);
  const [startTimes, setStartTimes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);

  // const [getAvailability, { loading: availabilityError }] = useLazyQuery(GET_AVAILABILITY, {
  //   onError: (e) => {
  //     if (e.graphQLErrors && e.graphQLErrors.length > 0) {
  //       const error = e.graphQLErrors[0].extensions.exception.response;
  //     }
  //   },
  //   onCompleted: (data) => {
  //     const dateObj = [];
  //     for (const obj of data.getAvailability) {
  //       dateObj.push({
  //         startDate: new Date(obj.startDate),
  //         endDate: new Date(obj.endDate),
  //         selected: false,
  //         active: obj.active,
  //       });
  //     }
  //     setAvailability(dateObj);
  //     setShowSlotSelector(true);
  //   },
  // });

  const [scheduleClass, { loading: scheduleLoading }] = useMutation(SCHEDULE_CLASS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        console.log(data);
        const array = [];
        classes.map((obj) => {
          array.push(obj);
        });
        array[setSelectedIndex].date = data.scheduleClass.startDate;
        setTutorClasses(array);
        setShowSlotSelector(false);
      }
    },
  });

  useEffect(() => {
    if (classes) {
      setTutorClasses(classes);
    }
  }, [classes]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const renderTutorDetails = () => {
    return (
      <View>
        <View style={{ height: RfH(44) }} />
        <Text style={commonStyles.headingPrimaryText}>{classData.orderItem?.offering.name} Class</Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
            {classData.orderItem?.offering.parentOffering.parentOffering.name} |{' '}
            {classData.orderItem?.offering.parentOffering.name}
          </Text>
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(8) }} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(8) }]}>
          <View style={commonStyles.horizontalChildrenStartView}>
            <View style={commonStyles.verticallyStretchedItemsView}>
              <IconButtonWrapper
                styling={{ borderRadius: RfH(32) }}
                iconWidth={RfH(64)}
                iconHeight={RfH(64)}
                iconImage={getTutorImageUrl(classData.orderItem?.tutor)}
              />
            </View>
            <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
              <Text
                style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), fontFamily: Fonts.semiBold, marginTop: RfH(2) }}>
                {classData.orderItem?.tutor.contactDetail.firstName} {classData.orderItem?.tutor.contactDetail.lastName}
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                GURUS{classData.orderItem?.tutor.id}
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                {classData.orderItem?.onlineClass ? 'Online' : 'Offline'} Classes
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const showSlotPopup = (index) => {
    setSelectedIndex(index);
    setShowSlotSelector(true);
  };

  const renderClassView = (item, index) => {
    return (
      <View style={{ flex: 0.5, marginTop: RfH(16) }}>
        <TouchableWithoutFeedback onPress={() => showSlotPopup(index)}>
          <View>
            <View
              style={{
                marginRight: RfW(8),
                marginLeft: RfW(8),
                height: RfH(96),
                backgroundColor: Colors.lightGrey,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
              }}>
              <Text style={[commonStyles.headingPrimaryText, { color: Colors.darkGrey }]}>{item.class}</Text>
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
                  style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey, marginTop: RfH(8) }}>
                  {item.date}
                </Text>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const onScheduleClass = () => {
    scheduleClass({
      variables: {
        classesCreateDto: {
          orderItemId: classData.orderItem?.id,
          startDate: selectedStartTime,
          endDate: selectedEndTime,
        },
      },
    });
  };

  const selectedSlot = (item, index) => {
    if (item.active) {
      const interval = 1;
      const timeArray = [];
      timeArray.push({ startTime: item.startDate });
      let endTime = new Date(item.startDate).setUTCHours(new Date(item.startDate).getUTCHours() + interval);
      while (endTime < new Date(item.endDate)) {
        timeArray.push({ startTime: new Date(endTime) });
        endTime = new Date(endTime).setUTCHours(new Date(endTime).getUTCHours() + interval);
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
    setSelectedEndTime(new Date(new Date(value).setUTCHours(new Date(value).getUTCHours() + 1)));
  };

  return (
    <View style={[commonStyles.mainContainer, { paddingTop: RfH(44), backgroundColor: Colors.white }]}>
      <View style={commonStyles.horizontalChildrenSpaceView}>
        <View style={commonStyles.horizontalChildrenView}>
          <BackArrow action={onBackPress} />
          <Text style={[commonStyles.headingPrimaryText, { marginLeft: RfW(16) }]}>Schedule Class</Text>
        </View>
        <Text style={{ fontSize: RFValue(28, STANDARD_SCREEN_SIZE) }}>+</Text>
      </View>
      {renderTutorDetails()}
      <View style={{ height: RfH(56) }} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={tutorClasses}
        numColumns={2}
        renderItem={({ item, index }) => renderClassView(item, index)}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: RfH(34) }}
      />
      <DateSlotSelectorModal
        visible={showSlotSelector}
        onClose={() => setShowSlotSelector(false)}
        tutorId={classData.orderItem.tutor.id}
        selectedSlot={(item, index) => selectedSlot(item, index)}
        onSubmit={() => onScheduleClass()}
        times={startTimes}
        selectedClassTime={(value) => selectedClassTime(value)}
      />
    </View>
  );
}

export default scheduleClass;
