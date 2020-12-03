/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
import { Dimensions, FlatList, Image, Modal, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Thumbnail } from 'native-base';
import Swiper from 'react-native-swiper';
import moment from 'moment';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import commonStyles from '../../../../theme/styles';
import { Colors, Images } from '../../../../theme';
import { getUserImageUrl, RfH, RfW } from '../../../../utils/helpers';
import { IconButtonWrapper } from '../../../../components';
import { offeringsMasterData, userDetails, studentDetails } from '../../../../apollo/cache';
import NavigationRouteNames from '../../../../routes/screenNames';
import Fonts from '../../../../theme/fonts';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import StudentOfferingModal from './studentOfferingModal';
import { GET_INTERESTED_OFFERINGS, GET_OFFERINGS_MASTER_DATA } from '../../dashboard-query';
import { MARK_INTERESTED_OFFERING_SELECTED } from '../../dashboard-mutation';
import Loader from '../../../../components/Loader';
import { GET_FAVOURITE_TUTORS } from '../../tutor-query';
import { getBoxColor } from '../../../../theme/colors';
import { GET_SCHEDULED_CLASSES } from '../../booking.query';

function StudentDashboard(props) {
  const navigation = useNavigation();

  const userInfo = useReactiveVar(userDetails);
  const offeringMasterData = useReactiveVar(offeringsMasterData);

  const studentInfo = useReactiveVar(studentDetails);

  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const { refetchStudentOfferings, changeTab } = props;

  const [studentOfferingModalVisible, setStudentOfferingModalVisible] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState({});

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

      // after fetching this, push the user to dashboard
    }
  }, [offeringData]);

  const [favouriteTutors, setFavouriteTutors] = useState([]);
  const [interestedOfferings, setInterestedOfferings] = useState({});
  const [upcomingClasses, setUpcomingClasses] = useState([]);

  const [getFavouriteTutors, { loading: loadingFavouriteTutors }] = useLazyQuery(GET_FAVOURITE_TUTORS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;

        console.log(error);
      }
    },
    onCompleted: (data) => {
      if (data) {
        setFavouriteTutors(data?.getFavouriteTutors);
      }
    },
  });

  const [getInterestedOfferings, { loading: interestedOfferingsLoading }] = useLazyQuery(GET_INTERESTED_OFFERINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;

        console.log(error);
        navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
      }
    },
    onCompleted: (data) => {
      if (data && data.getInterestedOfferings && data.getInterestedOfferings.length > 0) {
        console.log(
          'data.getInterestedOfferings.find((s) => s.selected)',
          data.getInterestedOfferings.find((s) => s.selected)
        );

        setInterestedOfferings(data.getInterestedOfferings);

        const selectedOffering = data.getInterestedOfferings.find((s) => s.selected);
        setSelectedOffering(selectedOffering ? selectedOffering.offering : {});
      } else {
        navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
      }
    },
  });

  // const [
  //   ,
  //   {
  //     loading: ,
  //     error: interestedOfferingsError,
  //     data: interestedOfferings,
  //     refetch: _refetchInterestedOffering,
  //   },
  // ] = useLazyQuery();
  // const refetchInterestedOffering = (args) => _refetchInterestedOffering(args);

  useEffect(() => {
    getFavouriteTutors();
    getInterestedOfferings();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getFavouriteTutors();
      getInterestedOfferings();
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

  // useEffect(() => {
  //   console.log(interestedOfferingsError);
  //   if (
  //     interestedOfferingsError &&
  //     interestedOfferingsError.graphQLErrors &&
  //     interestedOfferingsError.graphQLErrors.length > 0
  //   ) {
  //     navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
  //   }
  // }, [interestedOfferingsError]);

  // useEffect(() => {
  //   console.log(interestedOfferings);
  //
  //   if (
  //     interestedOfferings &&
  //     interestedOfferings.getInterestedOfferings &&
  //     interestedOfferings.getInterestedOfferings.length > 0
  //   ) {
  //     const selectedOffering = interestedOfferings.getInterestedOfferings.find((s) => s.selected);
  //     console.log('interestedOfferings.getInterestedOfferings.find((s) => s.selected)', selectedOffering);
  //     setSelectedOffering(selectedOffering ? selectedOffering.offering : {});
  //   } else if (!interestedOfferingsLoading && interestedOfferings.getInterestedOfferings.length === 0) {
  //     navigation.navigate(NavigationRouteNames.STUDENT.STUDY_AREA);
  //   }
  // }, [interestedOfferings]);

  const onOfferingSelect = (offering) => {
    setStudentOfferingModalVisible(false);

    setSelectedOffering(offering);

    console.log('offering selected', offering);

    // call mutation
    markInterestedOffering({ variables: { offeringId: offering.id } });

    // refetchOffering();
  };

  useEffect(() => {
    getInterestedOfferings({ fetchPolicy: 'network-only' });
    // console.log('refetchStudentOfferings', refetchStudentOfferings);
  }, [refetchStudentOfferings]);

  // useEffect(() => {
  //   // refetch everything
  //
  //   console.log('selectedOffering updated', selectedOffering);
  // }, [selectedOffering]);

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
    return getUserImageUrl(tutor?.profileImage?.filename, tutor?.contactDetail?.gender, tutor.id);
  };

  const renderSubjects = (item) => {
    return (
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
              backgroundColor: getBoxColor(item.id),
              height: RfH(67),
              width: RfW(70),
              marginHorizontal: RfW(4),
              borderRadius: RfW(8),
            }}>
            <IconButtonWrapper
              iconWidth={RfW(24.5)}
              styling={{ alignSelf: 'center' }}
              iconHeight={RfH(34.2)}
              iconImage={Images.book}
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
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('English')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#E7E5F2',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.book}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
              English
            </Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('Physics')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFF7F0',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.physics}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
              Physics
            </Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('English')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgb(230,252,231)',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.beaker}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
              Chemistry
            </Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('English')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgb(203,231,255)',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.dna}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
              Biology
            </Text>
          </TouchableWithoutFeedback>
        </View> */}

        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginTop: RfH(20),
          }}>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('English')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgb(230,252,231)',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.math}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
              Maths
            </Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('English')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#E7E5F2',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.civic}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
              Civics
            </Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('English')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgb(203,231,255)',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.history}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
              History
            </Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => gotoTutors('English')}
            style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFF7F0',
                height: RfH(67),
                width: RfW(67),
                borderRadius: RfW(8),
              }}>
              <IconButtonWrapper
                iconWidth={RfW(24.5)}
                styling={{ alignSelf: 'center' }}
                iconHeight={RfH(34.2)}
                iconImage={Images.geo}
              />
            </View>
            <Text style={{ textAlign: 'center', fontSize: 12, color: Colors.primaryText, marginTop: RfH(5) }}>
              Geography
            </Text>
          </TouchableWithoutFeedback>
        </View> */}
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
            iconWidth={RfH(98)}
            iconHeight={RfH(98)}
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
              width: Dimensions.get('window').width - RfW(54),
              marginRight: RfW(8),
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
    <>
      <StatusBar barStyle="dark-content" />

      <Loader isLoading={interestedOfferingsLoading || loadingFavouriteTutors} />

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
          <View>
            <TouchableOpacity onPress={() => {}}>
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
              {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}> */}
              {/*  <Text style={{ color: Colors.darkGrey, fontSize: 16, marginTop: RfH(4) }}>CBSE Class 9</Text> */}
              {/*  <TouchableOpacity onPress={() => setStudyAreaModalVisible(true)}> */}
              {/*    /!* <Icon *!/ */}
              {/*    /!*  type="MaterialIcons" *!/ */}
              {/*    /!*  name="keyboard-arrow-down" *!/ */}
              {/*    /!*  style={{ marginTop: RfH(8), marginLeft: RfW(4), color: Colors.secondaryText }} *!/ */}
              {/*    /!* /> *!/ */}
              {/*    <Image source={Images.expand_gray} style={{ height: RfH(24), width: RfW(24), marginTop: 4 }} /> */}
              {/*  </TouchableOpacity> */}
              {/* </View> */}
            </View>
            <View>
              <Image
                source={Images.user}
                style={{
                  height: RfH(32),
                  width: RfW(32),
                  borderTopLeftRadius: RfH(32),
                  borderTopRightRadius: RfH(32),
                  borderBottomLeftRadius: RfH(32),
                  borderBottomRightRadius: RfH(32),
                }}
              />
            </View>
          </View>

          {/* <View style={{ height: 44 }}> */}
          {/*  <Item */}
          {/*    style={{ */}
          {/*      backgroundColor: '#F3F4F9', */}
          {/*      borderRadius: 10, */}
          {/*      paddingHorizontal: RfW(10), */}
          {/*      borderColor: 'transparent', */}
          {/*      height: RfH(36), */}
          {/*      marginTop: 4, */}
          {/*      marginBottom: 4, */}
          {/*    }}> */}
          {/*    <Icon type="MaterialIcons" name="search" style={{ color: Colors.brandBlue2 }} /> */}
          {/*    <Input placeholder="Search" /> */}
          {/*  </Item> */}
          {/* </View> */}

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
                  renderItem={({ item }) => renderUpcomingClasses(item)}
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
                <Text style={{ color: Colors.brandBlue2, fontSize: RFValue(15, STANDARD_SCREEN_SIZE) }}>View All</Text>
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

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
              marginTop: RfH(25),
            }}>
            <Text style={{ color: Colors.primaryText, fontFamily: Fonts.bold, fontSize: 20 }}>Recommended Tutors</Text>
          </View>
          <View
            style={{
              height: RfH(92),
              backgroundColor: 'rgb(230,252,231)',
              borderRadius: 8,
              marginTop: RfH(20),
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
                <Thumbnail style={{ height: RfH(70), width: RfW(70), borderRadius: 35 }} source={Images.kushal} />
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
                  <Text style={{ fontSize: 16, color: 'rgb(49,48,48)' }}>Gurbani Singh</Text>
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
                      4.5
                    </Text>
                  </View>
                </View>
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                  3 years of Experience
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                    English, Maths , Science
                  </Text>
                  <Icon
                    type="MaterialIcons"
                    name="computer"
                    style={{ fontSize: 20, marginRight: RfW(8), color: Colors.secondaryText }}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              height: RfH(92),
              backgroundColor: 'rgb(231,229,242)',
              borderRadius: 8,
              marginTop: RfH(20),
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
                <Thumbnail style={{ height: RfH(70), width: RfW(70), borderRadius: 35 }} source={Images.kushal} />
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
                  <Text style={{ fontSize: 16, color: 'rgb(49,48,48)' }}>Tushar Das</Text>
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
                      4.5
                    </Text>
                  </View>
                </View>
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                  3 years of Experience
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                    English, Maths , Science
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon
                      type="AntDesign"
                      name="home"
                      style={{ fontSize: 18, marginRight: RfW(8), color: Colors.secondaryText }}
                    />
                    <Icon
                      type="MaterialIcons"
                      name="computer"
                      style={{ fontSize: 20, marginRight: RfW(8), color: Colors.secondaryText }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              height: RfH(92),
              backgroundColor: 'rgb(255,247,240)',
              borderRadius: 8,
              marginTop: RfH(20),
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
                <Thumbnail style={{ height: RfH(70), width: RfW(70), borderRadius: 35 }} source={Images.kushal} />
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
                  <Text style={{ fontSize: 16, color: 'rgb(49,48,48)' }}>Gurbani Singh</Text>
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
                      4.5
                    </Text>
                  </View>
                </View>
                <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                  3 years of Experience
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={{ color: Colors.secondaryText, fontSize: 14, marginTop: RfH(2) }}>
                    English, Maths , Science
                  </Text>
                  <Icon
                    type="MaterialIcons"
                    name="computer"
                    style={{ fontSize: 20, marginRight: RfW(8), color: Colors.secondaryText }}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={{ marginTop: RfH(20) }}>
            <Image source={Images.post_needs} />
          </View>
          <View>
            <Image source={Images.refer_earn} />
          </View>
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
