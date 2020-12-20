/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import Swiper from 'react-native-swiper';
import { offeringsMasterData, studentDetails, userDetails } from '../../../../apollo/cache';
import { IconButtonWrapper } from '../../../../components';
import Loader from '../../../../components/Loader';
import NavigationRouteNames from '../../../../routes/screenNames';
import { Colors, Images } from '../../../../theme';
import Fonts from '../../../../theme/fonts';
import commonStyles from '../../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import { getSubjectIcons, getUserImageUrl, RfH, RfW } from '../../../../utils/helpers';
import { GET_CART_ITEMS, GET_SCHEDULED_CLASSES } from '../../booking.query';
import { MARK_INTERESTED_OFFERING_SELECTED } from '../../dashboard-mutation';
import { GET_INTERESTED_OFFERINGS, GET_OFFERINGS_MASTER_DATA, GET_SPONSORED_TUTORS } from '../../dashboard-query';
import { GET_FAVOURITE_TUTORS } from '../../tutor-query';
import StudentOfferingModal from './studentOfferingModal';
import NotificationRedirection from '../../../notification/notificationRedirection';

function StudentDashboard(props) {
  const navigation = useNavigation();

  const userInfo = useReactiveVar(userDetails);
  const offeringMasterData = useReactiveVar(offeringsMasterData);

  const studentInfo = useReactiveVar(studentDetails);

  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const { refetchStudentOfferings, changeTab } = props;

  const [studentOfferingModalVisible, setStudentOfferingModalVisible] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState({});
  const [favouriteTutors, setFavouriteTutors] = useState([]);
  const [interestedOfferings, setInterestedOfferings] = useState({});
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [sponsoredTutors, setSponsoredTutors] = useState([]);
  const [refreshSponsors, setRefreshSponsors] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [
    getOfferingMasterData,
    { loading: loadingOfferingMasterData, error: offeringMasterError, data: offeringData },
  ] = useLazyQuery(GET_OFFERINGS_MASTER_DATA, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    getOfferingMasterData();
  }, []);

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
        setRefreshSponsors(!refreshSponsors);
      }
    },
  });

  const [getInterestedOfferings, { loading: interestedOfferingsLoading }] = useLazyQuery(GET_INTERESTED_OFFERINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
        navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
      }
    },
    onCompleted: (data) => {
      if (data && data.getInterestedOfferings && data.getInterestedOfferings.length > 0) {
        setInterestedOfferings(data.getInterestedOfferings);
        const selectedOfferingData = data.getInterestedOfferings.find((s) => s.selected);
        setSelectedOffering(selectedOfferingData ? selectedOfferingData.offering : {});
      } else {
        navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
      }
    },
  });

  useEffect(() => {
    getFavouriteTutors();
    getInterestedOfferings();
    getSponsoredTutors();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getFavouriteTutors();
      getInterestedOfferings();
      getSponsoredTutors();
      getCartItems();
    }, [])
  );

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

  useEffect(() => {
    getInterestedOfferings({ fetchPolicy: 'network-only' });
  }, [refetchStudentOfferings]);

  const gotoTutors = (subject) => {
    setShowAllSubjects(false);
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR, { offering: subject });
  };

  const goToTutorDetails = (item) => {
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR_DETAILS, {
      tutorData: item.tutor,
      parentOffering: selectedOffering?.id,
      parentParentOffering: selectedOffering?.parentOffering?.id,
      parentOfferingName: selectedOffering?.displayName,
      parentParentOfferingName: selectedOffering?.parentOffering?.displayName,
    });
  };

  const getTutorImage = (tutor) => {
    return getUserImageUrl(tutor?.profileImage?.filename, tutor?.contactDetail?.gender, tutor?.id);
  };

  const renderSubjects = (item) => (
    <View style={{ marginTop: RfH(20), flex: 1 }}>
      <TouchableWithoutFeedback
        onPress={() => gotoTutors(item)}
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'stretch',
        }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: RfH(64),
            width: RfW(64),
            marginHorizontal: RfW(4),
            borderRadius: RfW(8),
          }}>
          <IconButtonWrapper
            iconWidth={RfW(64)}
            styling={{ alignSelf: 'center' }}
            iconHeight={RfH(64)}
            imageResizeMode="contain"
            iconImage={getSubjectIcons(item.displayName)}
          />
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 12,
            width: RfW(70),
            color: Colors.primaryText,
            marginTop: RfH(5),
          }}>
          {item.displayName}
        </Text>
      </TouchableWithoutFeedback>
    </View>
  );

  const renderSponsoredTutor = (item) => {
    const sub = [];
    item.tutor.tutorOfferings.map((obj) => {
      if (obj.offerings && sub.findIndex((ob) => ob === obj.offerings[2].displayName) === -1) {
        sub.push(obj.offerings[2].displayName);
      }
    });
    return (
      <View style={{ marginTop: RfH(16), flex: 1 }}>
        <TouchableWithoutFeedback
          onPress={() => gotoTutors(item)}
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
                  <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>{sub.join(',')}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const subjectModal = () => (
    <Modal
      animationType="fade"
      transparent
      visible={showAllSubjects}
      onRequestClose={() => {
        setShowAllSubjects(false);
      }}>
      <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'column' }}>
        <View style={{ backgroundColor: Colors.black, opacity: 0.5, flex: 1 }} />
        <View
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            position: 'absolute',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            backgroundColor: Colors.white,
            paddingHorizontal: RfW(16),
            paddingTop: RfH(16),
          }}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.headingPrimaryText}>All Subjects</Text>
            <IconButtonWrapper
              iconHeight={RfH(24)}
              iconWidth={RfW(24)}
              styling={{ alignSelf: 'flex-end', marginVertical: RfH(16) }}
              iconImage={Images.cross}
              submitFunction={() => setShowAllSubjects(false)}
            />
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            numColumns={4}
            data={
              offeringMasterData && offeringMasterData.filter((s) => s?.parentOffering?.id === selectedOffering?.id)
            }
            renderItem={({ item }) => renderSubjects(item)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: RfH(34) }}
          />
        </View>
      </View>
    </Modal>
  );

  const getSubjects = (item) => {
    const subjects = [];

    item.tutor.tutorOfferings.map((obj) => {
      if (obj.offerings.find((o) => o.id === selectedOffering?.id)) {
        subjects.push(obj.offerings[0].displayName);
      }
      // if (
      //   selectedOffering?.parentOffering?.id === obj.offerings[0].id &&
      //   selectedOffering?.id === obj.offerings[1].id
      // ) {
      //   subjects = `${obj.offerings[2].displayName},${subjects}`;
      // }
    });
    return subjects.join(', ');
  };

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

  const renderUpcomingClasses = (item, index) => {
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
              width: index === 0 ? Dimensions.get('window').width - RfW(32) : Dimensions.get('window').width - RfW(54),
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
    <>
      <StatusBar barStyle="dark-content" />

      <Loader isLoading={interestedOfferingsLoading || loadingFavouriteTutors} />
      <NotificationRedirection />

      <View style={[commonStyles.mainContainer]}>
        <View style={{ height: 44, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            {selectedOffering && (
              <Text style={{ color: Colors.primaryText, fontSize: 17, marginTop: RfH(4) }}>
                {selectedOffering?.parentOffering?.displayName} - {selectedOffering?.displayName}
              </Text>
            )}

            <TouchableOpacity onPress={() => setStudentOfferingModalVisible(true)}>
              <Image source={Images.expand_gray} style={{ height: RfH(24), width: RfW(24), marginTop: 4 }} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate(NavigationRouteNames.STUDENT.MY_CART)}
              style={{ paddingHorizontal: RfW(8) }}>
              <IconButtonWrapper
                iconImage={Images.cart}
                iconHeight={RfH(18)}
                iconWidth={RfW(18)}
              />
              {cartCount > 0 && (
                <View
                  style={{
                    backgroundColor: Colors.orangeRed,
                    borderRadius: RfH(20),
                    position: 'absolute',
                    top: RfH(-3),
                    left: RfW(10),
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: RfH(12),
                    width: RfH(12),
                  }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', color: Colors.white }}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(NavigationRouteNames.NOTIFICATIONS)}
              style={{ paddingLeft: RfW(8) }}>
              <IconButtonWrapper iconImage={Images.bell} iconHeight={RfH(18)} iconWidth={RfW(18)} imageResizeMode={'contain'}/>
              <View
                style={{
                  backgroundColor: Colors.orangeRed,
                  borderRadius: RfH(20),
                  position: 'absolute',
                  top: RfH(-3),
                  left: RfW(15),
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: RfH(12),
                  width: RfH(12),
                }}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: Colors.white }}>2</Text>
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
                <IconButtonWrapper iconHeight={RfH(185)} iconWidth={RfW(300)} iconImage={Images.dash_img} />
              </View>
              <View
                style={{
                  backgroundColor: '#ceecfe',
                  borderRadius: 20,
                  marginRight: 8,
                }}>
                <IconButtonWrapper iconHeight={RfH(185)} iconWidth={RfW(300)} iconImage={Images.dash_img} />
              </View>
              <View
                style={{
                  backgroundColor: '#ceecfe',
                  borderRadius: 20,
                  marginRight: 8,
                }}>
                <IconButtonWrapper iconHeight={RfH(185)} iconWidth={RfW(300)} iconImage={Images.dash_img} />
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
              Tutors By Subjects
            </Text>
            <TouchableWithoutFeedback onPress={() => setShowAllSubjects(true)}>
              <Text style={{ color: Colors.brandBlue2, fontSize: RFValue(15, STANDARD_SCREEN_SIZE) }}>View All</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              numColumns={4}
              data={
                offeringMasterData &&
                offeringMasterData.filter((s) => s?.parentOffering?.id === selectedOffering?.id).slice(0, 8)
              }
              renderItem={({ item }) => renderSubjects(item)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
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
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate(NavigationRouteNames.STUDENT.FAVOURITE_TUTOR)}>
                  <Text style={{ color: Colors.brandBlue2, fontSize: RFValue(15, STANDARD_SCREEN_SIZE) }}>
                    View All
                  </Text>
                </TouchableWithoutFeedback>
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
                extraData={refreshSponsors}
                renderItem={({ item, index }) => renderSponsoredTutor(item, index)}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
          <TouchableWithoutFeedback onPress={() => navigation.navigate(NavigationRouteNames.TUTION_NEEDS_LISTING)}>
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
        {subjectModal()}
      </View>

      <StudentOfferingModal
        onClose={setStudentOfferingModalVisible}
        visible={studentOfferingModalVisible}
        onSelect={onOfferingSelect}
        offerings={interestedOfferings}
      />
    </>
  );
}

StudentDashboard.propTypes = {
  refetchStudentOfferings: PropTypes.bool,
  changeTab: PropTypes.func,
};

StudentDashboard.defaultProps = {
  refetchStudentOfferings: false,
  changeTab: null,
};

export default StudentDashboard;
