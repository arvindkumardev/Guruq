import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { isEmpty } from 'lodash';
import { interestingOfferingData, offeringsMasterData, studentDetails, userDetails } from '../../../../apollo/cache';
import {
  IconButtonWrapper,
  Loader,
  SelectSubjectModal,
  TutorImageComponent,
  UpcomingClassComponent,
} from '../../../../components';
import NavigationRouteNames from '../../../../routes/screenNames';
import { Colors, Images } from '../../../../theme';
import Fonts from '../../../../theme/fonts';
import commonStyles from '../../../../theme/styles';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import { alertBox, deviceWidth, getFullName, getSubjectIcons, RfH, RfW } from '../../../../utils/helpers';
import { GET_CART_ITEMS, GET_SCHEDULED_CLASSES } from '../../booking.query';
import { MARK_INTERESTED_OFFERING_SELECTED } from '../../dashboard-mutation';
import { GET_INTERESTED_OFFERINGS, GET_OFFERINGS_MASTER_DATA, GET_SPONSORED_TUTORS } from '../../dashboard-query';
import { GET_FAVOURITE_TUTORS } from '../../tutor-query';
import StudentOfferingModal from './studentOfferingModal';
import NotificationRedirection from '../../../notification/notificationRedirection';
import CustomImage from '../../../../components/CustomImage';
import UserImageComponent from '../../../../components/UserImageComponent';

const carouselItems = [Images.dash_img1, Images.dash_img2, Images.dash_img3];

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
  const [activeSlide, setActiveSlide] = useState(0);

  const SLIDER_WIDTH = Dimensions.get('window').width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.85);
  const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 4);

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
      console.log(e);
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
      console.log(e);
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
      console.log(e);
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
        navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
      }
    },
    onCompleted: (data) => {
      if (data && data.getInterestedOfferings && data.getInterestedOfferings.length > 0) {
        interestingOfferingData(data.getInterestedOfferings);
        const interestedOffering = data.getInterestedOfferings.find((s) => s.selected)?.offering;
        setSelectedOffering(interestedOffering);
        setStudentOfferingModalVisible(isEmpty(interestedOffering) && !isEmpty(data.getInterestedOfferings));
      } else {
        navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
      }
    },
  });

  const [getScheduledClasses, { loading: loadingScheduledClasses }] = useLazyQuery(GET_SCHEDULED_CLASSES, {
    onError: (e) => {
      console.log(e);
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
    if (!isEmpty(selectedOffering) && isFocussed) {
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
  }, [selectedOffering, isFocussed]);

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
        <View>
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
              <TutorImageComponent tutor={item?.tutor} height={64} width={64} styling={{ borderRadius: RfH(64) }} />
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
                <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
                  {getFullName(item?.tutor?.contactDetail)}
                </Text>
              </View>
              <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                {item?.tutor?.teachingExperience ? `${item?.tutor?.teachingExperience} years of Experience` : ''}
              </Text>

              <View style={{ flexDirection: 'row', marginTop: RfH(8) }}>
                <IconButtonWrapper
                  iconImage={item.tutor.averageRating > 0 ? Images.filledStar : Images.unFilledStar}
                  iconHeight={RfH(16)}
                  iconWidth={RfW(16)}
                  imageResizeMode="contain"
                  styling={{ marginRight: RfW(8) }}
                />
                {item?.tutor?.averageRating > 0 ? (
                  <Text
                    style={{
                      alignSelf: 'center',
                      color: Colors.primaryText,
                      fontFamily: Fonts.bold,
                    }}>
                    {parseFloat(item?.tutor?.averageRating)}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: Colors.secondaryText,
                      fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
                    }}>
                    NOT RATED
                  </Text>
                )}
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
          <TutorImageComponent
            tutor={item?.tutor}
            styling={{ alignSelf: 'center', borderRadius: RfH(64), width: RfH(64), height: RfH(64) }}
          />

          <Text
            numberOfLines={1}
            style={[commonStyles.mediumPrimaryText, { marginTop: 8, fontFamily: Fonts.semiBold, textAlign: 'center' }]}>
            {getFullName(item?.tutor?.contactDetail)}
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

  const handleStudentOfferingModal = () => {
    if (isEmpty(selectedOffering)) {
      alertBox('Please select the interesting offering');
    } else {
      setStudentOfferingModalVisible(false);
    }
  };

  const renderCardItem = (item) => (
    <View style={{ width: ITEM_WIDTH, alignItems: 'center', justifyContent: 'center' }}>
      <CustomImage
        image={item}
        imageWidth={ITEM_WIDTH}
        imageHeight={ITEM_HEIGHT}
        imageResizeMode="contain"
        styling={{ borderRadius: RfW(3) }}
      />
    </View>
  );

  const pagination = () => (
    <Pagination
      dotsLength={carouselItems.length}
      activeDotIndex={activeSlide}
      containerStyle={{ paddingVertical: RfH(4) }}
      dotStyle={{
        width: RfH(10),
        height: RfH(10),
        borderRadius: RfH(5),
        marginHorizontal: RfW(1),
        backgroundColor: Colors.brandBlue2,
      }}
      inactiveDotStyle={
        {
          // Define styles for inactive dots here
        }
      }
      inactiveDotOpacity={0.4}
      inactiveDotScale={0.6}
    />
  );

  const topCarousel = () => (
    <>
      <Carousel
        layout="default"
        data={carouselItems}
        renderItem={({ item, index }) => renderCardItem(item, index)}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={(index) => setActiveSlide(index)}
        // autoplay
        // autoplayDelay={100}
        // autoplayInterval={5000}
        // loop
      />
      {pagination()}
    </>
  );
  return (
    <>
      <StatusBar barStyle="dark-content" />

      <Loader isLoading={interestedOfferingsLoading} />
      <NotificationRedirection />

      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
        <View
          style={{
            height: RfH(44),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: RfW(16),
          }}>
          <View style={{ flex: 0.7 }}>
            <TouchableOpacity onPress={() => setStudentOfferingModalVisible(true)}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                {selectedOffering && (
                  <Text style={{ color: Colors.primaryText, fontSize: 17, marginTop: RfH(4) }} numberOfLines={1}>
                    {selectedOffering?.parentOffering?.displayName} - {selectedOffering?.displayName}
                  </Text>
                )}
                <Image source={Images.expand_gray} style={{ height: RfH(24), width: RfW(24), marginTop: 4 }} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', flex: 0.3, justifyContent: 'flex-end' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate(NavigationRouteNames.STUDENT.MY_CART)}
              style={{ paddingHorizontal: RfW(8) }}>
              <IconButtonWrapper
                iconImage={Images.cart}
                iconHeight={RfH(25)}
                iconWidth={RfW(25)}
                imageResizeMode="contain"
              />
              {cartCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: RfH(0),
                    left: RfW(16),
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: RfH(13),
                    width: RfH(13),
                  }}>
                  <Text style={{ font: Fonts.bold, fontSize: 11, color: Colors.brandBlue }}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            {/* <TouchableOpacity */}
            {/*  onPress={() => navigation.navigate(NavigationRouteNames.NOTIFICATIONS)} */}
            {/*  style={{ paddingLeft: RfW(8) }}> */}
            {/*  <IconButtonWrapper */}
            {/*    iconImage={Images.bell} */}
            {/*    iconHeight={RfH(20)} */}
            {/*    iconWidth={RfW(20)} */}
            {/*    imageResizeMode="contain" */}
            {/*  /> */}
            {/*  <View */}
            {/*    style={{ */}
            {/*      backgroundColor: Colors.orange, */}
            {/*      borderRadius: RfH(20), */}
            {/*      position: 'absolute', */}
            {/*      top: RfH(-10), */}
            {/*      left: RfW(0), */}
            {/*      alignItems: 'center', */}
            {/*      justifyContent: 'center', */}
            {/*      height: RfH(16), */}
            {/*      width: RfH(16), */}
            {/*    }}> */}
            {/*    <Text style={{ fontSize: 10, font: Fonts.bold, color: Colors.white }}>2</Text> */}
            {/*  </View> */}
            {/* </TouchableOpacity> */}
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              minHeight: RfH(55),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: RfW(16),
            }}>
            <View style={{ flex: 0.7 }}>
              <Text style={{ fontFamily: Fonts.bold, fontSize: 34, color: Colors.primaryText }} numberOfLines={1}>
                Hi {userInfo?.firstName}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', flex: 0.3, justifyContent: 'flex-end' }}>
              <TouchableWithoutFeedback onPress={() => changeTab(5)}>
                <UserImageComponent height={40} width={40} fontSize={16} styling={{ borderRadius: RfH(40) }} />
              </TouchableWithoutFeedback>
            </View>
          </View>

          {topCarousel()}
          <View style={{ paddingHorizontal: RfW(16) }}>
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
                    renderItem={({ item, index }) => <UpcomingClassComponent classDetails={item} index={index} />}
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
            <TouchableOpacity
              onPress={() => navigation.navigate(NavigationRouteNames.PYTN_LISTING, { selectedOffering })}
              style={{ marginTop: RfH(20) }}
              activeOpacity={0.8}>
              <Image
                style={{ width: deviceWidth() - RfW(32), height: 200 }}
                source={Images.post_needs}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate(NavigationRouteNames.REFER_EARN)}
              style={{ marginBottom: RfH(16) }}
              activeOpacity={0.8}>
              <Image
                style={{ width: deviceWidth() - RfW(32), height: 200 }}
                source={Images.refer_earn_new}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <StudentOfferingModal
        onClose={handleStudentOfferingModal}
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
