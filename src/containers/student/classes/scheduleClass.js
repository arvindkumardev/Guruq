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
  const [availability, setAvailability] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);

  const [getAvailability, { loading: availabilityError }] = useLazyQuery(GET_AVAILABILITY, {
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      const dateObj = [];
      for (const obj of data.getAvailability) {
        const endSlot = new Date(obj.startDate).setUTCHours(new Date(obj.startDate).getUTCHours() + 1);
        dateObj.push({
          startDate: new Date(obj.startDate),
          endDate: new Date(endSlot),
          selected: false,
          active: obj.active,
        });
        while (new Date(obj.endDate).getUTCHours() - new Date(endSlot).getUTCHours() >= 1) {
          dateObj.push({
            startDate: new Date(endSlot),
            endDate: new Date(new Date(endSlot).setUTCHours(new Date(endSlot).getUTCHours() + 1)),
            selected: false,
            active: obj.active,
          });
          endSlot = new Date(endSlot).setUTCHours(new Date(endSlot).getUTCHours() + 1);
        }
      }
      setAvailability(dateObj);
      setShowSlotSelector(true);
    },
  });

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
        setShowSlotSelector(false);
      }
    },
  });

  const onBackPress = () => {
    navigation.goBack();
  };

  const renderTutorDetails = () => {
    return (
      <View>
        <View style={{ height: RfH(44) }} />
        <Text style={commonStyles.headingPrimaryText}>{classData.orderItems[0].offering.name} Class</Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
            {classData.orderItems[0].offering.parentOffering.parentOffering.name} |{' '}
            {classData.orderItems[0].offering.parentOffering.name}
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
                iconImage={getTutorImageUrl(classData.orderItems[0].tutor)}
              />
            </View>
            <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8) }]}>
              <Text
                style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), fontFamily: Fonts.semiBold, marginTop: RfH(2) }}>
                {classData.orderItems[0].tutor.contactDetail.firstName}{' '}
                {classData.orderItems[0].tutor.contactDetail.lastName}
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                GURUS{classData.orderItems[0].tutor.id}
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                {classData.orderItems[0].onlineClass ? 'Online' : 'Offline'} Classes
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const showSlotPopup = () => {
    getAvailability({
      variables: {
        tutorAvailability: {
          tutorId: 45725,
          startDate: new Date(),
          endDate: new Date(),
        },
      },
    });
  };

  const renderClassView = (item) => {
    return (
      <View style={{ flex: 0.5, marginTop: RfH(16) }}>
        <TouchableWithoutFeedback onPress={() => showSlotPopup()}>
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
          orderItemId: classData.orderItems[0].id,
          startDate: selectedStartTime,
          endDate: selectedEndTime,
        },
      },
    });
  };

  const selectedSlot = (item, index) => {
    if (item.active) {
      setSelectedStartTime(item.startDate);
      setSelectedEndTime(item.endDate);
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
        data={classes}
        numColumns={2}
        renderItem={({ item }) => renderClassView(item)}
        keyExtractor={(item, index) => index.toString()}
      />
      <DateSlotSelectorModal
        visible={showSlotSelector}
        onClose={() => setShowSlotSelector(false)}
        availableSlots={availability}
        selectedSlot={(item, index) => selectedSlot(item, index)}
        onSubmit={() => onScheduleClass()}
      />
    </View>
  );
}

export default scheduleClass;
