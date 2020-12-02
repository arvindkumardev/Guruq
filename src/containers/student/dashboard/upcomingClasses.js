/* eslint-disable no-restricted-syntax */
import { Image, Text, View, FlatList, TouchableWithoutFeedback, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Icon } from 'native-base';
import moment from 'moment';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { Images, Colors } from '../../../theme';
import commonStyles from '../../../theme/styles';
import { RfH, RfW } from '../../../utils/helpers';
import { ScreenHeader } from '../../../components';
import NavigationRouteNames from '../../../routes/screenNames';
import { studentDetails } from '../../../apollo/cache';
import { GET_SCHEDULED_CLASSES } from '../booking.query';
import Fonts from '../../../theme/fonts';
import Loader from '../../../components/Loader';

function UpcomingClasses() {
  const navigation = useNavigation();

  const studentInfo = useReactiveVar(studentDetails);
  const [upcomingClasses, setUpcomingClasses] = useState([]);

  const [getScheduledClasses, { loading: loadingScheduledClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      const array = [];
      for (const obj of data.getScheduledClasses) {
        const startHours = new Date(obj.startDate).getUTCHours();
        const startMinutes = new Date(obj.startDate).getUTCMinutes();
        const endHours = new Date(obj.endDate).getUTCHours();
        const endMinutes = new Date(obj.endDate).getUTCMinutes();
        const timing = `${startHours < 10 ? `0${startHours}` : startHours}:${
          startMinutes < 10 ? `0${startMinutes}` : startMinutes
        } ${startHours < 12 ? `AM` : 'PM'} - ${endHours < 10 ? `0${endHours}` : endHours}:${
          endMinutes < 10 ? `0${endMinutes}` : endMinutes
        } ${endHours < 12 ? `AM` : 'PM'}`;
        const item = {
          startDate: obj.startDate,
          uuid: obj.uuid,
          classTitle: obj.offering.displayName,
          board: obj.offering.parentOffering.parentOffering.displayName,
          class: obj.offering.parentOffering.displayName,
          timing,
          classData: obj,
        };
        array.push(item);
      }
      setUpcomingClasses(array);
    },
  });

  useEffect(() => {
    getScheduledClasses({
      variables: {
        classesSearchDto: {
          studentId: studentInfo.id,
          startDate: moment().toDate(),
          endDate: moment().endOf('day').toDate(),
        },
      },
    });
  }, []);

  const renderUpcomingClasses = (item) => {
    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate(NavigationRouteNames.STUDENT.SCHEDULED_CLASS_DETAILS, { classDetails: item })
          }>
          <View
            style={{
              backgroundColor: Colors.lightBlue,
              borderRadius: 20,
              marginTop: RfH(20),
              padding: RfH(16),
              width: Dimensions.get('window').width - 32,
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <View style={{ flex: 0.3 }}>
                <Image style={{ height: RfH(88), width: RfW(78), zIndex: 5, borderRadius: 8 }} source={Images.kushal} />
              </View>
              <View
                style={{
                  flex: 0.7,
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'stretch',
                  marginLeft: RfW(8),
                }}>
                <Text style={{ fontSize: 16, color: Colors.primaryText, fontFamily: Fonts.semiBold }}>
                  {item.classTitle} by {item.classData?.tutor?.contactDetail?.firstName}{' '}
                  {item.classData?.tutor?.contactDetail?.lastName}
                </Text>
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                  {`${item.board} | ${item.class}`}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <Icon
                    type="FontAwesome"
                    name="calendar-o"
                    style={{ fontSize: 15, marginRight: RfW(8), color: Colors.brandBlue2 }}
                  />
                  <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                    {new Date(item.startDate).toDateString()}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <Icon
                    type="Feather"
                    name="clock"
                    style={{ fontSize: 15, marginRight: RfW(8), color: Colors.brandBlue2 }}
                  />
                  <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>{item.timing}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <Icon
                    type="MaterialIcons"
                    name="computer"
                    style={{ fontSize: 15, marginRight: RfW(8), color: Colors.brandBlue2 }}
                  />
                  <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                    {item.classData.onlineClass ? 'Online' : 'Offline'} Class
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader label="Upcoming Classes" homeIcon horizontalPadding={RfW(16)} />
      <Loader isLoading={loadingScheduledClasses} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={upcomingClasses}
          renderItem={({ item }) => renderUpcomingClasses(item)}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ marginBottom: RfH(64) }}
        />
      </View>
    </View>
  );
}

export default UpcomingClasses;
