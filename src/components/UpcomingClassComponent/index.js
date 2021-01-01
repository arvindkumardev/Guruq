import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useReactiveVar } from '@apollo/client';
import { Colors } from '../../theme';
import { getFullName, printDate, printTime, RfH, RfW } from '../../utils/helpers';
import { TutorImageComponent } from '../index';
import Fonts from '../../theme/fonts';
import NavigationRouteNames from '../../routes/screenNames';
import { userType } from '../../apollo/cache';
import { UserTypeEnum } from '../../common/userType.enum';

const UpcomingClassComponent = (props) => {
  const { classDetails, index } = props;
  const navigation = useNavigation();
  const userTypeVal = useReactiveVar(userType);
  const isStudent = userTypeVal === UserTypeEnum.STUDENT.label;

  const classDetailNavigation = (classId) => {
    navigation.navigate(NavigationRouteNames.STUDENT.SCHEDULED_CLASS_DETAILS, { classId });
  };

  return (
    <TouchableOpacity onPress={() => classDetailNavigation(classDetails.id)} style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: Colors.lightBlue,
          borderRadius: 20,
          marginTop: RfH(20),
          padding: RfH(16),
          width: index === 0 ? Dimensions.get('window').width - RfW(32) : Dimensions.get('window').width - RfW(54),
          marginRight: RfW(8),
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <View style={{ flex: 0.3 }}>
            <TutorImageComponent
              tutor={isStudent ? classDetails?.tutor : classDetails?.students[0]}
              styling={{ alignSelf: 'center', borderRadius: RfH(49), height: RfH(98), width: RfH(98) }}
            />
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
              {isStudent
                ? `${classDetails?.offering?.displayName} by ${getFullName(classDetails?.tutor?.contactDetail)} `
                : `${classDetails?.offering?.displayName} for ${getFullName(classDetails?.students[0]?.contactDetail)}`}
            </Text>
            <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
              {`${classDetails?.offering?.parentOffering?.displayName} | ${classDetails?.offering?.parentOffering?.parentOffering?.displayName} `}
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
                {printDate(classDetails.startDate)}
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
              <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                {`${printTime(classDetails.startDate)} - ${printTime(classDetails.endDate)}`}
              </Text>
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
                {classDetails.onlineClass ? 'Online' : 'Offline'} Class
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

UpcomingClassComponent.defaultProps = {
  classDetails: {},
  index: 0,
};

UpcomingClassComponent.propTypes = {
  classDetails: PropTypes.object,
  index: PropTypes.number,
};

export default UpcomingClassComponent;
