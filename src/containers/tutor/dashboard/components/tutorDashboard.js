/* eslint-disable import/no-duplicates */
/* eslint-disable no-restricted-syntax */
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Swiper from 'react-native-swiper';
import initializeApollo from '../../../../apollo/apollo';
import { isLoggedIn, studentDetails, tutorDetails, userDetails, userType } from '../../../../apollo/cache';
import { IconButtonWrapper } from '../../../../components';
import Loader from '../../../../components/Loader';
import NavigationRouteNames from '../../../../routes/screenNames';
import { Colors, Images } from '../../../../theme';
import { getBoxColor } from '../../../../theme/colors';
import Fonts from '../../../../theme/fonts';
import commonStyles from '../../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import {
  clearAllLocalStorage,
  getSubjectIcons,
  getUserImageUrl,
  removeToken,
  RfH,
  RfW
} from '../../../../utils/helpers';
import { GET_SCHEDULED_CLASSES } from '../../../student/booking.query';
import { GET_TUTOR_OFFERINGS } from '../../../student/tutor-query';
import TutorSubjectsModal from './tutorSubjectsModal';

function TutorDashboard(props) {
  const navigation = useNavigation();
  const [searchLocation, setSearchLocation] = useState('');
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [refreshSubjectList, setRefreshSubjectList] = useState(false);
  const client = initializeApollo();

  const { changeTab } = props;

  const tutorInfo = useReactiveVar(tutorDetails);
  const userInfo = useReactiveVar(userDetails);

  const [getScheduledClasses, { loading: loadingScheduledClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      const array = [];
      for (const obj of data.getScheduledClasses) {
        const startHours = new Date(obj.startDate).getHours();
        const startMinutes = new Date(obj.startDate).getMinutes();
        const endHours = new Date(obj.endDate).getHours();
        const endMinutes = new Date(obj.endDate).getMinutes();
        const timing = `${startHours < 10 ? `0${startHours}` : startHours}:${
          startMinutes < 10 ? `0${startMinutes}` : startMinutes
        } - ${endHours < 10 ? `0${endHours}` : endHours}:${endMinutes < 10 ? `0${endMinutes}` : endMinutes} ${
          endHours < 12 ? `AM` : 'PM'
        }`;
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
          tutorId: tutorInfo.id,
          startDate: moment().toDate(),
          endDate: moment().endOf('day').toDate(),
        },
      },
    });
  }, []);

  const [getTutorOffering, { loading: loadingTutorsOffering }] = useLazyQuery(GET_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    variables: { tutorId: tutorInfo?.id },
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        data?.getTutorOfferings?.map((item) => {
          if (item.offering && subjects.findIndex((obj) => obj.offering.id === item.offering.id) === -1) {
            subjects.push(item);
          }
        });
        setRefreshSubjectList(!refreshSubjectList);
      }
    },
  });

  useEffect(() => {
    getTutorOffering();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getTutorOffering();
    }, [])
  );

  const getTutorImage = (tutor) => {
    return getUserImageUrl(tutor?.profileImage?.filename, tutor?.contactDetail?.gender, tutor?.id);
  };

  const renderUpcomingClasses = (item, index) => {
    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: Colors.lightBlue,
              borderRadius: 20,
              marginTop: RfH(20),
              padding: RfH(16),
              marginRight: RfW(8),
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <View style={{ flex: 0.3 }}>
                <IconButtonWrapper
                  iconWidth={RfH(98)}
                  iconHeight={RfH(98)}
                  iconImage={getTutorImage(item.classData.tutor)}
                  imageResizeMode="cover"
                  styling={{ alignSelf: 'center', borderRadius: RfH(49) }}
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
                  {item.classData?.students[0]?.contactDetail?.firstName}{' '}
                  {item.classData?.students[0]?.contactDetail?.lastName}
                </Text>
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                  {`${item.board} | ${item.class}`}
                </Text>
                <View style={commonStyles.horizontalChildrenSpaceView}>
                  <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                    {item.classTitle}
                  </Text>
                  <IconButtonWrapper
                    iconHeight={RfH(16)}
                    iconWidth={RfW(16)}
                    iconImage={item.classData.onlineClass ? Images.laptop : Images.home}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                    {new Date(item.startDate).toDateString()} | {item.timing}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const renderSubjects = (item, index) => {
    return (
      <View
        style={[
          commonStyles.verticallyStretchedItemsView,
          {
            flex: 0.5,
            backgroundColor: getBoxColor(item?.offering?.displayName),
            padding: RfH(8),
            marginHorizontal: RfW(8),
            marginVertical: RfH(8),
            borderRadius: RfH(8),
          },
        ]}>
        <IconButtonWrapper
          iconWidth={RfW(48)}
          styling={{ alignSelf: 'center' }}
          iconHeight={RfH(56)}
          styling={{ alignSelf: 'flex-start' }}
          iconImage={getSubjectIcons(item?.offering?.displayName)}
        />
        <View style={commonStyles.horizontalChildrenView}>
          <Text style={[commonStyles.mediumPrimaryText, { fontFamily: Fonts.semiBold }]}>
            {item?.offerings[2]?.displayName}
          </Text>
          <Text style={[commonStyles.mediumPrimaryText, { fontFamily: Fonts.semiBold }]}>
            -{item?.offerings[1]?.displayName}
          </Text>
        </View>
        <Text style={commonStyles.smallMutedText}>{item?.offering?.displayName}</Text>
      </View>
    );
  };

  const logout = () => {
    clearAllLocalStorage().then(() => {
      client.cache.reset().then(() => {
        removeToken().then(() => {
          // set in apollo cache
          isLoggedIn(false);
          userType('');
          userDetails({});

          studentDetails({});
          tutorDetails({});
        });
      });
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Loader isLoading={loadingScheduledClasses || loadingTutorsOffering} />

      <View style={commonStyles.mainContainer}>
        <View style={{ height: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }} />
          <View>
            <TouchableOpacity onPress={() => navigation.navigate(NavigationRouteNames.STUDENT.NOTIFICATIONS)}>
              <Image source={Images.bell} style={{ height: RfH(16), width: RfW(14) }} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              height: 54,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text style={{ fontFamily: Fonts.bold, fontSize: 34, color: Colors.primaryText }}>
                Hi {userInfo.firstName}
              </Text>
            </View>
            <View>
              <IconButtonWrapper
                iconHeight={RfH(32)}
                iconWidth={RfH(32)}
                iconImage={getUserImageUrl(userInfo?.profileImage?.filename, userInfo?.gender, userInfo?.id)}
                styling={{ borderRadius: RfH(32) }}
              />
              {/* <Image
                source={Images.user}
                style={{
                  height: RfH(32),
                  width: RfW(32),
                  borderTopLeftRadius: RfH(32),
                  borderTopRightRadius: RfH(32),
                  borderBottomLeftRadius: RfH(32),
                  borderBottomRightRadius: RfH(32),
                }}
              /> */}
            </View>
          </View>

          {/* <View style={{ height: RfH(24) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <View>
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
                color: Colors.primaryText,
              }}>
              Hi
            </Text>
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: RFValue(28, STANDARD_SCREEN_SIZE),
                color: Colors.primaryText,
              }}>
              {userInfo.firstName}
            </Text>
          </View>
          <View>
            <Image
              source={Images.user}
              style={{
                height: RfH(40),
                width: RfH(40),
                borderRadius: RfH(8),
              }}
            />
          </View>
        </View> */}
          <View style={{ height: RfH(220), marginTop: RfH(29) }}>
            <Swiper horizontal style={{ overflow: 'visible' }}>
              <View
                style={{
                  backgroundColor: '#ceecfe',
                  borderRadius: 20,
                  marginRight: 8,
                }}>
                <IconButtonWrapper iconHeight={RfH(185)} iconWidth={RfW(300)} iconImage={Images.dash_tutor_img} />
              </View>
              <View
                style={{
                  backgroundColor: '#ceecfe',
                  borderRadius: 20,
                  marginRight: 8,
                }}>
                <IconButtonWrapper iconHeight={RfH(185)} iconWidth={RfW(300)} iconImage={Images.dash_tutor_img} />
              </View>
              <View
                style={{
                  backgroundColor: '#ceecfe',
                  borderRadius: 20,
                  marginRight: 8,
                }}>
                <IconButtonWrapper iconHeight={RfH(185)} iconWidth={RfW(300)} iconImage={Images.dash_tutor_img} />
              </View>
            </Swiper>
          </View>

          {upcomingClasses.length > 0 && (
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Text style={{ color: Colors.primaryText, fontFamily: Fonts.bold, fontSize: 20 }}>
                  Upcoming Classes
                </Text>
                <TouchableWithoutFeedback onPress={() => changeTab(2)}>
                  <Text style={{ color: Colors.brandBlue2, fontSize: RFValue(15, STANDARD_SCREEN_SIZE) }}>
                    View All
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <View>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={upcomingClasses}
                  renderItem={({ item, index }) => renderUpcomingClasses(item, index)}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          )}

          {subjects.length > 0 && (
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Text style={{ color: Colors.primaryText, fontFamily: Fonts.bold, fontSize: 20 }}>My Subjects</Text>
                <TouchableWithoutFeedback onPress={() => setShowAllSubjects(true)}>
                  <Text style={{ color: Colors.brandBlue2, fontSize: RFValue(15, STANDARD_SCREEN_SIZE) }}>
                    View All
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <View style={{ marginTop: RfH(16) }}>
                <FlatList
                  data={subjects.slice(0, 6)}
                  extraData={refreshSubjectList}
                  numColumns={2}
                  renderItem={({ item, index }) => renderSubjects(item, index)}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          )}
          <TouchableWithoutFeedback onPress={() => navigation.navigate(NavigationRouteNames.TUTION_NEEDS_LISTING)}>
            <View style={{ marginTop: RfH(20) }}>
              <Image
                style={{ width: Dimensions.get('window').width - 32, height: RfH(152) }}
                source={Images.student_requests}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => navigation.navigate(NavigationRouteNames.REFER_EARN)}>
            <View>
              <Image
                style={{ width: Dimensions.get('window').width - 32, height: RfH(184) }}
                source={Images.refer_earn}
              />
            </View>
          </TouchableWithoutFeedback>

          <TutorSubjectsModal visible={showAllSubjects} onClose={() => setShowAllSubjects(false)} subjects={subjects} />
        </ScrollView>
      </View>
    </>
  );
}

TutorDashboard.propTypes = {
  changeTab: PropTypes.func,
};

TutorDashboard.defaultProps = {
  changeTab: null,
};

export default TutorDashboard;
