/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
import { Text, View, FlatList, TouchableWithoutFeedback, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import commonStyles from '../../theme/styles';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../components';
import { userType } from '../../apollo/cache';
import { UserTypeEnum } from '../../common/userType.enum';
import { GET_SCHEDULED_CLASSES } from '../student/booking.query';
import { getFullName, getSubjectIcons, printTime, RfH, RfW } from '../../utils/helpers';
import Colors, { getBoxColor } from '../../theme/colors';
import { Fonts } from '../../theme';

function MonthCalendarView() {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const userTypeVal = useReactiveVar(userType);
  const isStudent = userTypeVal === UserTypeEnum.STUDENT.label;
  const [refresh, setRefresh] = useState(false);
  const [allScheduledClasses, setAllScheduledClasses] = useState([]);
  const [markedDates, setMarkeddates] = useState({});

  const [getScheduledClassesCount, { loading: loadingScheduledlasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      const dateArray = {};
      for (const obj of data.getScheduledClasses) {
        dateArray[moment(obj.startDate).format('YYYY-MM-DD')] = {
          marked: true,
          selectedColor: Colors.brandBlue,
        };
      }
      setMarkeddates(dateArray);
      console.log(dateArray);
      setAllScheduledClasses(data.getScheduledClasses);
      setRefresh((refresh) => !refresh);
    },
  });

  const renderClassItem = (classDetails) => (
    <TouchableWithoutFeedback onPress={() => classDetailNavigation(classDetails.id)}>
      <View
        style={[
          commonStyles.horizontalChildrenStartView,
          { marginBottom: RfH(24), opacity: moment(classDetails.endDate).isBefore(new Date()) ? 0.5 : 1 },
        ]}>
        <View
          style={{
            height: RfH(72),
            width: RfW(72),
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IconButtonWrapper
            iconHeight={RfH(72)}
            iconWidth={RfW(72)}
            styling={{ alignSelf: 'center' }}
            iconImage={getSubjectIcons(classDetails?.offering?.displayName)}
          />
        </View>
        <View style={[commonStyles.verticallyStretchedItemsView, { marginLeft: RfW(8), flex: 1 }]}>
          <Text style={commonStyles.headingPrimaryText} numberOfLines={2}>
            {isStudent
              ? `${classDetails?.offering?.displayName} by ${getFullName(classDetails?.tutor?.contactDetail)}`
              : `${classDetails?.offering?.displayName} Class for ${getFullName(
                  classDetails?.students[0].contactDetail
                )}`}
          </Text>
          <Text style={commonStyles.mediumMutedText} numberOfLines={1}>
            {`${classDetails?.offering?.parentOffering?.displayName} | ${classDetails?.offering?.parentOffering?.parentOffering?.displayName}`}
          </Text>
          <Text style={commonStyles.mediumMutedText}>
            {`${printTime(classDetails.startDate)} - ${printTime(classDetails.endDate)}`}
          </Text>
          <Text style={commonStyles.mediumMutedText}>
            {classDetails?.onlineClass ? 'Online' : 'Offline'} {classDetails?.groupClass ? 'Group' : 'Individual'} Class
          </Text>
        </View>
        <View />
      </View>
    </TouchableWithoutFeedback>
  );

  const getScheduledClassesForMonth = (startDate) => {
    getScheduledClassesCount({
      variables: {
        classesSearchDto: {
          startDate,
          endDate: moment(startDate, 'DD-MM-YYYY').add(30, 'days'),
        },
      },
    });
  };

  useEffect(() => {
    if (isFocussed) {
      getScheduledClassesForMonth(moment());
    }
  }, [isFocussed]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScreenHeader label="Your Schedule" homeIcon horizontalPadding={RfW(16)} />
      <Loader isLoading={loadingScheduledlasses} />
      <View style={commonStyles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Calendar markedDates={markedDates || {}} />
            <View style={{ height: RfH(24) }} />
            <View>
              <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Classes</Text>
            </View>
            <View style={{ height: RfH(24) }} />
            <FlatList
              showsVerticalScrollIndicator={false}
              data={allScheduledClasses}
              renderItem={({ item }) => renderClassItem(item)}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: RfH(34) }}
              extraData={refresh}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default MonthCalendarView;
