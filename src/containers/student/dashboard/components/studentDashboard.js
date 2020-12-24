import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import Swiper from 'react-native-swiper';
import { isEmpty } from 'lodash';
import { offeringsMasterData, studentDetails, userDetails, interestingOfferingData } from '../../../../apollo/cache';
import { IconButtonWrapper, SelectSubjectModal, Loader } from '../../../../components';
import NavigationRouteNames from '../../../../routes/screenNames';
import { Colors, Images } from '../../../../theme';
import Fonts from '../../../../theme/fonts';
import commonStyles from '../../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import {
  getSubjectIcons,
  getTutorImage,
  getUserImageUrl,
  printDate,
  printTime,
  RfH,
  RfW,
} from '../../../../utils/helpers';
import { GET_CART_ITEMS, GET_SCHEDULED_CLASSES } from '../../booking.query';
import { MARK_INTERESTED_OFFERING_SELECTED } from '../../dashboard-mutation';
import { GET_INTERESTED_OFFERINGS, GET_OFFERINGS_MASTER_DATA, GET_SPONSORED_TUTORS } from '../../dashboard-query';
import { GET_FAVOURITE_TUTORS } from '../../tutor-query';
import StudentOfferingModal from './studentOfferingModal';
import NotificationRedirection from '../../../notification/notificationRedirection';

function StudentDashboard(props) {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const { changeTab } = props;

  const userInfo = useReactiveVar(userDetails);
  const offeringMasterData = useReactiveVar(offeringsMasterData);
  const interestedOfferings = useReactiveVar(interestingOfferingData);
  const studentInfo = useReactiveVar(studentDetails);

  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [studentOfferingModalVisible, setStudentOfferingModalVisible] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState({});
  const [favouriteTutors, setFavouriteTutors] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [sponsoredTutors, setSponsoredTutors] = useState([]);
  const [selectedOfferingSubjects, setSelectedOfferingSubjects] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const [
    getOfferingMasterData,
    { loading: loadingOfferingMasterData, error: offeringMasterError, data: offeringData },
  ] = useLazyQuery(GET_OFFERINGS_MASTER_DATA, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    if (offeringData && offeringData.offerings && offeringData.offerings.edges) {
      offeringsMasterData(offeringData.offerings.edges);
    }
  }, [offeringData]);

  const [getCartItems, { loading: cartLoading }] = useLazyQuery(GET_CART_ITEMS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setCartCount(data.getCartItems.length);
      }
    },
  });

  const [getFavouriteTutors, { loading: loadingFavouriteTutors }] = useLazyQuery(GET_FAVOURITE_TUTORS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setFavouriteTutors(data?.getFavouriteTutors);
      }
    },
  });

  const [getSponsoredTutors, { loading: loadingSponsoredTutors }] = useLazyQuery(GET_SPONSORED_TUTORS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setSponsoredTutors(data?.getSponsoredTutors);
      }
    },
  });

  const [getInterestedOfferings, { loading: interestedOfferingsLoading }] = useLazyQuery(GET_INTERESTED_OFFERINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        // const error = e.graphQLErrors[0].extensions.exception.response;
        navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
      }
    },
    onCompleted: (data) => {
      if (data && data.getInterestedOfferings && data.getInterestedOfferings.length > 0) {
        interestingOfferingData(data.getInterestedOfferings);
        setSelectedOffering(data.getInterestedOfferings.find((s) => s.selected)?.offering);
      } else {
        navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
      }
    },
  });

  const [getScheduledClasses, { loading: loadingScheduledClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      setUpcomingClasses(data.getScheduledClasses);
    },
  });

  useEffect(() => {
    if (isEmpty(offeringMasterData)) {
      getOfferingMasterData();
    }
  }, []);

  useEffect(() => {
    if (selectedOffering) {
      getFavouriteTutors({
        variables: {
          parentOfferingId: selectedOffering?.id,
        },
      });
      getSponsoredTutors({
        variables: {
          parentOfferingId: selectedOffering?.id,
        },
      });
    }
  }, [selectedOffering]);

  useEffect(() => {
    if (!isEmpty(selectedOffering) && !isEmpty(offeringMasterData)) {
      setSelectedOfferingSubjects(offeringMasterData.filter((s) => s?.parentOffering?.id === selectedOffering?.id));
    }
  }, [offeringMasterData, selectedOffering]);

  useEffect(() => {
    if (isFocussed) {
      if (isEmpty(interestedOfferings)) {
        getInterestedOfferings();
      } else {
        setSelectedOffering(interestedOfferings.find((s) => s.selected)?.offering);
      }
      getFavouriteTutors({
        variables: {
          parentOfferingId: selectedOffering?.id,
        },
      });

      getCartItems();
      getScheduledClasses({
        variables: {
          classesSearchDto: {
            studentId: studentInfo.id,
            startDate: moment().toDate(),
            endDate: moment().endOf('day').toDate(),
          },
        },
      });
    }
  }, [isFocussed]);

  const [markInterestedOffering] = useMutation(MARK_INTERESTED_OFFERING_SELECTED, {
    fetchPolicy: 'no-cache',

    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
      }
    },
    onCompleted: (data) => {
      if (data) {
        getInterestedOfferings({ fetchPolicy: 'network-only' });
      }
    },
  });

  const onOfferingSelect = (offering) => {
    setStudentOfferingModalVisible(false);
    setSelectedOffering(offering);
    markInterestedOffering({ variables: { offeringId: offering.id } });
  };

  const gotoTutors = (subject) => {
    setShowAllSubjects(false);
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR, { offering: subject });
  };

  const goToTutorDetails = (item) => {
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR_DETAILS, {
      tutorData: item.tutor,
      parentOffering: selectedOffering?.id,
      parentParentOffering: selectedOffering?.parentOffering?.id,
      parentOfferingName: selectedOffering?.parentOffering?.displayName,
      parentParentOfferingName: selectedOffering?.parentOffering?.parentOffering?.displayName,
    });
  };

  const getSubjects = (item) => {
    const subjects = [];
    item.tutor.tutorOfferings.map((obj) => {
      if (
        obj.offerings.find((o) => o.id === selectedOffering?.id) &&
        !subjects.includes(obj.offerings[0].displayName)
      ) {
        subjects.push(obj.offerings[0].displayName);
      }
    });
    return subjects.join(', ');
  };

  const renderSubjects = (item) => (
    <TouchableOpacity
      onPress={() => gotoTutors(item)}
      style={{
        flexDirection: 'column',
        marginTop: RfH(20),
        flex: 0.25,
      }}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: RfW(5),
          borderRadius: RfW(8),
        }}>
        <IconButtonWrapper
          iconWidth={RfW(64)}
          styling={{ alignSelf: 'center' }}
          iconHeight={RfH(64)}
          imageResizeMode="contain"
          iconImage={getSubjectIcons(item.displayName)}
        />
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: Colors.primaryText,
            marginTop: RfH(5),
          }}>
          {item.displayName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSponsoredTutor = (item) => (
    <View style={{ marginTop: RfH(16), flex: 1 }}>
      <TouchableWithoutFeedback
        onPress={() => goToTutorDetails(item)}
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'stretch',
        }}>
        <View
          style={{
            backgroundColor: 'rgb(230,252,231)',
            borderRadius: 8,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              paddingVertical: RfH(13),
              marginRight: RfW(16),
            }}>
            <View
              style={{
                flex: 0.3,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <IconButtonWrapper iconHeight={RfH(70)} iconImage={getTutorImage(item?.tutor)} iconWidth={RfW(70)} />
            </View>
            <View
              style={{
                flex: 0.7,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 16, color: 'rgb(49,48,48)' }}>
                  {item?.tutor?.contactDetail?.firstName} {item?.tutor?.contactDetail?.lastName}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Icon
                    type="FontAwesome"
                    name="star"
                    style={{ fontSize: 20, marginRight: RfW(8), color: Colors.brandBlue2 }}
                  />
                  <Text
                    style={{
                      alignSelf: 'center',
                      color: Colors.primaryText,
                      fontWeight: '600',
                    }}>
                    {parseFloat(item?.tutor?.averageRating)}
                  </Text>
                </View>
              </View>
              <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                {item?.tutor?.teachingExperience ? `${item?.tutor?.teachingExperience} years of Experience` : ''}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                  {getSubjects(item)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  const renderTutors = (item) => (
    <TouchableWithoutFeedback onPress={() => goToTutorDetails(item)}>
      <View
        style={{
          width: RfW(80),
          borderRadius: 8,
          marginHorizontal: RfW(10),
          marginTop: RfH(20),
        }}>
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <IconButtonWrapper
            iconWidth={RfH(80)}
            iconHeight={RfH(80)}
            iconImage={getTutorImage(item.tutor)}
            imageResizeMode="cover"
            styling={{ alignSelf: 'center', borderRadius: RfH(49) }}
          />
          <Text
            numberOfLines={2}
            style={{ marginTop: 8, fontSize: 13, color: Colors.primaryText, textAlign: 'center' }}>
            {item?.tutor?.contactDetail?.firstName} {item?.tutor?.contactDetail?.lastName}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              marginTop: 1,
              color: Colors.secondaryText,
              fontSize: 13,
              marginBottom: RfH(16),
              textAlign: 'center',
            }}>
            {getSubjects(item)}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const classDetailNavigation = (classId) => {
    navigation.navigate(NavigationRouteNames.STUDENT.SCHEDULED_CLASS_DETAILS, { classId });
  };

  const renderUpcomingClasses = (classDetails, index) => {
    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => classDetailNavigation(classDetails.id)}>
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
                <IconButtonWrapper
                  iconWidth={RfH(98)}
                  iconHeight={RfH(98)}
                  iconImage={getTutorImage(classDetails.tutor)}
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
                  {`${classDetails?.offering?.displayName} by ${classDetails?.tutor?.contactDetail?.firstName} ${classDetails?.tutor?.contactDetail?.lastName}`}
                </Text>
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                  {`${classDetails?.offering?.parentOffering?.displayName} | ${classDetails?.offering?.parentOffering?.parentOffering?.displayName}`}
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
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <Loader isLoading={interestedOfferingsLoading} />
      <NotificationRedirection />

      <View style={[commonStyles.mainContainer]}>
        <View style={{ height: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => setStudentOfferingModalVisible(true)}>
            {selectedOffering && (
              <Text style={{ color: Colors.primaryText, fontSize: 17, marginTop: RfH(4) }}>
                {selectedOffering?.parentOffering?.displayName} - {selectedOffering?.displayName}
              </Text>
            )}
            <Image source={Images.expand_gray} style={{ height: RfH(24), width: RfW(24), marginTop: 4 }} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate(NavigationRouteNames.STUDENT.MY_CART)}
              style={{ paddingHorizontal: RfW(8) }}>
              <IconButtonWrapper iconImage={Images.cart} iconHeight={RfH(18)} iconWidth={RfW(18)} />
              {cartCount > 0 && (
                <View
                  style={{
                    backgroundColor: Colors.brandBlue2,
                    borderRadius: RfH(20),
                    position: 'absolute',
                    top: RfH(-10),
                    left: RfW(0),
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: RfH(16),
                    width: RfH(16),
                  }}>
                  <Text style={{ fontSize: 10, font: Fonts.bold, color: Colors.white }}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(NavigationRouteNames.NOTIFICATIONS)}
              style={{ paddingLeft: RfW(8) }}>
              <IconButtonWrapper
                iconImage={Images.bell}
                iconHeight={RfH(18)}
                iconWidth={RfW(18)}
                imageResizeMode="contain"
              />
              <View
                style={{
                  backgroundColor: Colors.orange,
                  borderRadius: RfH(20),
                  position: 'absolute',
                  top: RfH(-10),
                  left: RfW(0),
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: RfH(16),
                  width: RfH(16),
                }}>
                <Text style={{ fontSize: 10, font: Fonts.bold, color: Colors.white }}>2</Text>
              </View>
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
                submitFunction={() => changeTab(5)}
              />
            </View>
          </View>
          <View style={{ height: RfH(220), marginTop: RfH(29) }}>
            <Swiper horizontal style={{ overflow: 'visible' }}>
              <View
                style={{
                  backgroundColor: '#ceecfe',
                  borderRadius: 20,
                  marginRight: 8,
                }}>
                <IconButtonWrapper iconHeight={RfH(185)} iconWidth={RfW(300)} iconImage={Images.dash_img1} />
              </View>
              <View
                style={{
                  backgroundColor: '#ceecfe',
                  borderRadius: 20,
                  marginRight: 8,
                }}>
                <IconButtonWrapper iconHeight={RfH(185)} iconWidth={RfW(300)} iconImage={Images.dash_img2} />
              </View>
              <View
                style={{
                  backgroundColor: '#ceecfe',
                  borderRadius: 20,
                  marginRight: 8,
                }}>
                <IconButtonWrapper iconHeight={RfH(185)} iconWidth={RfW(300)} iconImage={Images.dash_img3} />
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

          {!interestedOfferingsLoading && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: RfH(25),
                }}>
                <Text
                  style={{
                    color: Colors.primaryText,
                    fontFamily: Fonts.bold,
                    fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
                  }}>
                  Tutors By Subjects
                </Text>
                <TouchableWithoutFeedback onPress={() => setShowAllSubjects(true)}>
                  <Text style={{ color: Colors.brandBlue2, fontSize: RFValue(15, STANDARD_SCREEN_SIZE) }}>
                    View All
                  </Text>
                </TouchableWithoutFeedback>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  numColumns={4}
                  data={selectedOfferingSubjects.slice(0, 8)}
                  renderItem={({ item }) => renderSubjects(item)}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </>
          )}
          {favouriteTutors.length > 0 && (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginTop: RfH(25),
                }}>
                <Text
                  style={{
                    color: Colors.primaryText,
                    fontFamily: Fonts.bold,
                    fontSize: RFValue(20, STANDARD_SCREEN_SIZE),
                  }}>
                  Favourite Tutors
                </Text>
                {favouriteTutors.length > 3 && (
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate(NavigationRouteNames.STUDENT.FAVOURITE_TUTOR)}>
                    <Text style={{ color: Colors.brandBlue2, fontSize: RFValue(15, STANDARD_SCREEN_SIZE) }}>
                      View All
                    </Text>
                  </TouchableWithoutFeedback>
                )}
              </View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={favouriteTutors}
                renderItem={({ item }) => renderTutors(item)}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
          {sponsoredTutors.length > 0 && (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-end',
                  marginTop: RfH(25),
                }}>
                <Text style={{ color: Colors.primaryText, fontFamily: Fonts.bold, fontSize: 20 }}>
                  Recommended Tutors
                </Text>
              </View>
              <View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={sponsoredTutors}
                  renderItem={({ item, index }) => renderSponsoredTutor(item, index)}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          )}
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate(NavigationRouteNames.TUTION_NEEDS_LISTING, { selectedOffering })}>
            <View style={{ marginTop: RfH(20) }}>
              <Image
                style={{ width: Dimensions.get('window').width - 32, height: RfH(152) }}
                source={Images.post_needs}
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
        </ScrollView>
      </View>

      <StudentOfferingModal
        onClose={setStudentOfferingModalVisible}
        visible={studentOfferingModalVisible}
        onSelect={onOfferingSelect}
        offerings={interestedOfferings}
      />

      <SelectSubjectModal
        onClose={() => setShowAllSubjects(false)}
        onSelectSubject={gotoTutors}
        visible={showAllSubjects}
      />
    </>
  );
}

StudentDashboard.propTypes = {
  changeTab: PropTypes.func,
};

StudentDashboard.defaultProps = {
  changeTab: null,
};

export default StudentDashboard;
