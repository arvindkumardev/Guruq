/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
import { Text, View, FlatList, ScrollView, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import ProgressCircle from 'react-native-progress-circle';
import { Button, Icon } from 'native-base';
import CalendarStrip from 'react-native-calendar-strip';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { Rating } from 'react-native-ratings';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import Loader from '../../../components/Loader';
import { GET_AVERAGE_RATINGS, GET_FAVOURITE_TUTORS, GET_TUTOR_OFFERINGS, SEARCH_REVIEW } from '../tutor-query';
import styles from './styles';
import {
  RfH,
  RfW,
  storeData,
  titleCaseIfExists,
  getSaveData,
  removeData,
  getUserImageUrl,
} from '../../../utils/helpers';
import { CompareModal, DateSlotSelectorModal, IconButtonWrapper, Ratings } from '../../../components';
import { LOCAL_STORAGE_DATA_KEY, STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import routeNames from '../../../routes/screenNames';
import Fonts from '../../../theme/fonts';
import ClassModeSelectModal from './components/classModeSelectModal';
import BackArrow from '../../../components/BackArrow';
import { MARK_FAVOURITE, REMOVE_FAVOURITE } from '../tutor-mutation';
import { GET_AVAILABILITY } from '../class.query';
import { ADD_TO_CART } from '../booking.mutation';

function tutorDetails(props) {
  const navigation = useNavigation();

  const { route } = props;

  const tutorData = route?.params?.tutorData;
  const parentOffering = route?.params?.parentOffering;
  const parentParentOffering = route?.params?.parentParentOffering;

  const [showDateSlotModal, setShowDateSlotModal] = useState(false);
  const [showClassModePopup, setShowClassModePopup] = useState(false);
  const [hideTutorPersonal, setHideTutorPersonal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState({});

  const [subjects, setSubjects] = useState([]);
  const [refreshList, setRefreshList] = useState(false);
  const [isFreeDemo, setIsFreeDemo] = useState(false);
  const [priceMatrix, setPriceMatrix] = useState({});
  const [classDetails, setClassDetails] = useState({});
  const [budgets, setBudgets] = useState([]);
  const [compareData, setCompareData] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const [favouriteTutors, setFavouriteTutors] = useState([]);

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

  useEffect(() => {
    getFavouriteTutors();
  }, []);

  const [getTutorOffering, { loading: loadingTutorsOffering }] = useLazyQuery(GET_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    variables: { tutorId: tutorData?.id },
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;

        console.log(error);
      }
    },
    onCompleted: (data) => {
      if (data) {
        const pm = {};
        const sb = {};
        const classData = {};

        data?.getTutorOfferings?.map((item) => {
          if (item.offering && subjects.findIndex((obj) => obj.id === item.offering.id) === -1) {
            if (item.offerings[1].id === parentOffering && item.offerings[2].id === parentParentOffering) {
              classData[`${item.offering.id}`] = {
                individual: false,
                groupClass: false,
                freeDemo: false,
                online: false,
                homeTution: false,
              };
              if (item.freeDemo) {
                classData[`${item.offering.id}`].freeDemo = true;
              }
              subjects.push({
                id: item.offering.id,
                displayName: item.offering.displayName,
                offeringId: item.id,
              });
              pm[`o${item.offering.id}`] = {
                online: { demo: 0, c1: 0, c5: 0, c10: 0, c25: 0, c50: 0 },
                offline: { demo: 0, c1: 0, c5: 0, c10: 0, c25: 0, c50: 0 },
              };

              sb[`${item.offering.id}`] = item.budgets;

              for (const b of item.budgets) {
                if (b.demo) {
                  pm[`o${item.offering.id}`][b.onlineClass ? 'online' : 'offline'].demo = b.price;
                } else {
                  pm[`o${item.offering.id}`][b.onlineClass ? 'online' : 'offline'][`c${b.count}`] = b.price;
                }
                if (b.groupSize === 1) {
                  classData[`${item.offering.id}`].individual = true;
                } else {
                  classData[`${item.offering.id}`].groupClass = true;
                }
                if (b.onlineClass) {
                  classData[`${item.offering.id}`].online = true;
                } else {
                  classData[`${item.offering.id}`].homeTution = true;
                }
              }
            }
          }
        });
        setClassDetails(classData);
        setSelectedSubject({
          id: subjects[0].id,
          name: subjects[0].displayName,
          offeringId: subjects[0].offeringId,
        });
        setPriceMatrix(pm);
        setBudgets(sb);
        setRefreshList(!refreshList);
      }
    },
  });

  useEffect(() => {
    getTutorOffering();
  }, []);

  const [markFavourite, { loading: favouriteLoading }] = useMutation(MARK_FAVOURITE, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setIsFavourite(true);
      }
    },
  });

  const [removeFavourite, { loading: removeFavouriteLoading }] = useMutation(REMOVE_FAVOURITE, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setIsFavourite(false);
      }
    },
  });

  const [reviewProgress, setReviewProgress] = useState([
    { typeName: 'Course Understanding', image: Images.understanding, percentage: 0 },
    { typeName: 'Helpfulness', image: Images.chat, percentage: 0 },
    { typeName: 'Professional Attitude', image: Images.professional, percentage: 0 },
    { typeName: 'Teaching Methodology', image: Images.methodology, percentage: 0 },
    { typeName: 'Accessibility', image: Images.thumb_range, percentage: 0 },
    { typeName: 'Improvement in Results', image: Images.stats, percentage: 0 },
  ]);

  const getPercentage = (value) => {
    return value * 20;
  };

  const [getAverageRating, { loading: ratingLoading }] = useLazyQuery(GET_AVERAGE_RATINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        const ratingArray = [];
        reviewProgress.map((obj) => {
          ratingArray.push(obj);
        });
        if (data.getAverageRating.courseUnderstanding) {
          ratingArray[0].percentage = getPercentage(data.getAverageRating.courseUnderstanding);
        }
        if (data.getAverageRating.helpfulness) {
          ratingArray[1].percentage = getPercentage(data.getAverageRating.helpfulness);
        }
        if (data.getAverageRating.professionalAttitude) {
          ratingArray[2].percentage = getPercentage(data.getAverageRating.professionalAttitude);
        }
        if (data.getAverageRating.teachingMethodology) {
          ratingArray[3].percentage = getPercentage(data.getAverageRating.teachingMethodology);
        }
        if (data.getAverageRating.accessibility) {
          ratingArray[4].percentage = getPercentage(data.getAverageRating.accessibility);
        }
        if (data.getAverageRating.resultImprovement) {
          ratingArray[5].percentage = getPercentage(data.getAverageRating.resultImprovement);
        }
        if (data.getAverageRating.overallRating) {
          setOverallRating(data.getAverageRating.overallRating);
        }
      }
    },
  });

  const [userReviews, setUserReviews] = useState([]);

  const [searchReview, { loading: reviewLoading }] = useLazyQuery(SEARCH_REVIEW, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        const review = [];
        for (const obj of data.searchReview.edges) {
          const item = {
            name: `${obj.createdBy.firstName} ${obj.createdBy.lastName}`,
            icon: obj.createdBy,
            rating: obj.overallRating,
            date: new Date(obj.createdDate).toDateString(),
            description: obj.text,
          };
          review.push(item);
        }
        setUserReviews(review);
      }
    },
  });

  useEffect(() => {
    searchReview({ variables: { reviewSearchDto: { tutorId: tutorData?.id } } });
  }, []);

  useEffect(() => {
    getAverageRating({ variables: { reviewSearchDto: { tutorId: tutorData?.id } } });
  }, []);

  useEffect(() => {
    if (favouriteTutors) {
      setIsFavourite(favouriteTutors.find((ft) => ft?.tutor?.id === tutorData?.id));
    }
  }, [favouriteTutors]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const checkCompare = async () => {
    let compareArray = [];
    compareArray = JSON.parse(await getSaveData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID));
    if (compareArray) {
      setCompareData(compareArray);
    }
  };

  useEffect(() => {
    checkCompare();
  }, []);

  const addToCompare = async () => {
    let compareArray = [];
    compareArray = JSON.parse(await getSaveData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID));
    if (compareArray == null) {
      const newArray = [];
      newArray.push(tutorData);
      await removeData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID);
      storeData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID, JSON.stringify(newArray)).then(() => {
        setShowCompareModal(true);
        setCompareData(newArray);
      });
    } else if (compareArray.length < 2) {
      if (compareArray[0].id === tutorData?.id) {
        setShowCompareModal(true);
      } else {
        compareArray.push(tutorData);
        await removeData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID);
        storeData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID, JSON.stringify(compareArray)).then(() => {
          setShowCompareModal(true);
          setCompareData(compareArray);
        });
      }
    } else {
      setShowCompareModal(true);
    }
  };

  const removeFromCompare = async (index) => {
    let compareArray = [];
    compareArray = JSON.parse(await getSaveData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID));
    compareArray.splice(index, 1);
    await removeData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID);
    if (compareArray.length > 0) {
      storeData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID, JSON.stringify(compareArray)).then(() => {});
    }
    setCompareData(compareArray);
    setShowCompareModal(false);
  };

  const selectSubject = (item) => {
    setSelectedSubject({ id: item.id, name: item.displayName, offeringId: item.offeringId });
  };

  const renderSubjects = (item, index) => {
    return (
      <TouchableWithoutFeedback onPress={() => selectSubject(item)}>
        <View style={{ marginTop: RfH(20), flex: 1 }}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: item.id === selectedSubject.id ? Colors.lightPurple : Colors.lightGrey,
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
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderProgress = (item) => {
    return (
      <View style={{ flex: 0.33, alignItems: 'center', marginTop: RfH(16) }}>
        <ProgressCircle
          percent={item.percentage}
          radius={32}
          borderWidth={6}
          color="rgb(203,231,255)"
          shadowColor={Colors.lightGrey}
          bgColor={Colors.white}>
          <IconButtonWrapper iconWidth={RfW(22)} iconImage={item.image} />
        </ProgressCircle>
        <Text
          style={{
            fontSize: RFValue(12, STANDARD_SCREEN_SIZE),
            textAlign: 'center',
            marginTop: RfH(8),
            color: Colors.darkGrey,
          }}>
          {item.typeName}
        </Text>
      </View>
    );
  };

  const renderReviews = (item) => {
    return (
      <View
        style={{
          paddingHorizontal: RfW(16),
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          <IconButtonWrapper
            iconHeight={RfH(40)}
            iconWidth={RfH(40)}
            iconImage={getUserImageUrl(
              item?.createdBy?.profileImage?.filename,
              item?.createdBy?.gender,
              item?.createdBy?.id
            )}
            styling={{ borderRadius: RfH(20) }}
          />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              marginLeft: RfW(8),
            }}>
            <Text style={{ fontFamily: 'SegoeUI-Semibold' }}>{item.name}</Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
              {item.date} |{' '}
              <IconButtonWrapper
                iconWidth={RfW(10)}
                iconHeight={RfH(10)}
                iconImage={Images.golden_star}
                styling={{ alignSelf: 'center' }}
              />{' '}
              {parseFloat(item.rating).toFixed(1)}
            </Text>
          </View>
        </View>
        <Text style={{ marginTop: RfH(8), color: Colors.darkGrey }}>{item.description}</Text>

        <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
      </View>
    );
  };

  const classView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: RfW(16),
          paddingVertical: RfW(16),
        }}>
        <View style={{ alignItems: 'center' }}>
          {/* <Icon */}
          {/*  type="FontAwesome" */}
          {/*  name="user" */}
          {/*  style={{ fontSize: 15, marginRight: RfW(4), color: Colors.brandBlue2 }} */}
          {/* /> */}
          <IconButtonWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            iconImage={
              classDetails && selectedSubject && selectedSubject.id && classDetails[`${selectedSubject.id}`]?.individual
                ? Images.individual_class_filled
                : Images.individual_class
            }
            styling={{ marginHorizontal: RfW(16) }}
          />
          <Text style={styles.classMeta}>Individual</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          {/* <Icon type="FontAwesome" name="users" style={{ fontSize: 15, marginRight: RfW(4), color: Colors.darkGrey }} /> */}
          <IconButtonWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            iconImage={
              classDetails && selectedSubject && selectedSubject.id && classDetails[`${selectedSubject.id}`]?.groupClass
                ? Images.group_class_filled
                : Images.group_class
            }
            styling={{ marginHorizontal: RfW(16) }}
          />
          <Text style={styles.classMeta}>Group Classes</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          {/* <Icon */}
          {/*  type="FontAwesome" */}
          {/*  name="dollar" */}
          {/*  style={{ fontSize: 15, marginRight: RfW(4), color: Colors.brandBlue2 }} */}
          {/* /> */}
          <IconButtonWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            iconImage={
              classDetails && selectedSubject && selectedSubject.id && classDetails[`${selectedSubject.id}`]?.freeDemo
                ? Images.free_demo_filled
                : Images.free_demo
            }
            styling={{ marginHorizontal: RfW(16) }}
          />
          <Text style={styles.classMeta}>Free Demo</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          {/* <Icon type="FontAwesome" name="tv" style={{ fontSize: 15, marginRight: RfW(4), color: Colors.darkGrey }} /> */}
          <IconButtonWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            iconImage={
              classDetails && selectedSubject && selectedSubject.id && classDetails[`${selectedSubject.id}`]?.online
                ? Images.online_class_filled
                : Images.online_class
            }
            styling={{ marginHorizontal: RfW(16) }}
          />
          <Text style={styles.classMeta}>Online</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <IconButtonWrapper
            iconWidth={RfW(24)}
            iconHeight={RfH(24)}
            iconImage={
              classDetails && selectedSubject && selectedSubject.id && classDetails[`${selectedSubject.id}`]?.homeTution
                ? Images.home_tuition_filled
                : Images.home_tuition
            }
            styling={{ marginHorizontal: RfW(16) }}
          />
          <Text style={styles.classMeta}>Home Tuition</Text>
        </View>
      </View>
    );
  };

  const renderPriceMatrix = () => {
    return (
      <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfW(16) }}>
        <View>
          <Text style={[commonStyles.headingPrimaryText]}>Price Matrix</Text>
        </View>
        <View
          style={[
            commonStyles.horizontalChildrenCenterView,
            {
              marginTop: RfH(16),
              fontFamily: Fonts.semiBold,
            },
          ]}>
          <View style={{ flex: 0.3 }}>
            <Text style={[styles.tutorDetails, { fontFamily: Fonts.bold }]}>Classes</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              flex: 0.7,
            }}>
            <Text style={[styles.tutorDetails, { fontFamily: Fonts.bold, flex: 0.2 }]}>Demo</Text>
            <Text style={[styles.tutorDetails, { fontFamily: Fonts.bold, flex: 0.16 }]}>1</Text>
            <Text style={[styles.tutorDetails, { fontFamily: Fonts.bold, flex: 0.16 }]}>5</Text>
            <Text style={[styles.tutorDetails, { fontFamily: Fonts.bold, flex: 0.16 }]}>10</Text>
            <Text style={[styles.tutorDetails, { fontFamily: Fonts.bold, flex: 0.16 }]}>25</Text>
            <Text style={[styles.tutorDetails, { fontFamily: Fonts.bold, flex: 0.16 }]}>50</Text>
          </View>
        </View>
        {priceMatrix &&
        selectedSubject &&
        selectedSubject.id &&
        priceMatrix[`o${selectedSubject.id}`]?.online.c1 === 0 &&
        priceMatrix[`o${selectedSubject.id}`]?.online.c5 === 0 &&
        priceMatrix[`o${selectedSubject.id}`]?.online.c10 === 0 &&
        priceMatrix[`o${selectedSubject.id}`]?.online.c25 === 0 &&
        priceMatrix[`o${selectedSubject.id}`]?.online.c50 === 0 ? (
          <View />
        ) : (
          <View
            style={[
              commonStyles.horizontalChildrenSpaceView,
              {
                marginTop: RfH(16),
              },
            ]}>
            <View style={{ flex: 0.3 }}>
              <Text style={styles.tutorDetails}>Online Classes</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 0.7,
              }}>
              <Text style={[styles.tutorDetails, { flex: 0.2 }]}>
                {priceMatrix &&
                  selectedSubject &&
                  selectedSubject.id &&
                  priceMatrix[`o${selectedSubject.id}`]?.online.demo}
              </Text>
              <Text style={[styles.tutorDetails, { flex: 0.16 }]}>
                {priceMatrix &&
                  selectedSubject &&
                  selectedSubject.id &&
                  priceMatrix[`o${selectedSubject.id}`]?.online.c1}
              </Text>
              <Text style={[styles.tutorDetails, { flex: 0.16 }]}>
                {priceMatrix &&
                  selectedSubject &&
                  selectedSubject.id &&
                  priceMatrix[`o${selectedSubject.id}`]?.online.c5}
              </Text>
              <Text style={[styles.tutorDetails, { flex: 0.16 }]}>
                {priceMatrix &&
                  selectedSubject &&
                  selectedSubject.id &&
                  priceMatrix[`o${selectedSubject.id}`]?.online.c10}
              </Text>
              <Text style={[styles.tutorDetails, { flex: 0.16 }]}>
                {priceMatrix &&
                  selectedSubject &&
                  selectedSubject.id &&
                  priceMatrix[`o${selectedSubject.id}`]?.online.c25}
              </Text>
              <Text style={[styles.tutorDetails, { flex: 0.16 }]}>
                {priceMatrix &&
                  selectedSubject &&
                  selectedSubject.id &&
                  priceMatrix[`o${selectedSubject.id}`]?.online.c50}
              </Text>
            </View>
          </View>
        )}
        {priceMatrix &&
        selectedSubject &&
        selectedSubject.id &&
        priceMatrix[`o${selectedSubject.id}`]?.offline.c1 === 0 &&
        priceMatrix[`o${selectedSubject.id}`]?.offline.c5 === 0 &&
        priceMatrix[`o${selectedSubject.id}`]?.offline.c10 === 0 &&
        priceMatrix[`o${selectedSubject.id}`]?.offline.c25 === 0 &&
        priceMatrix[`o${selectedSubject.id}`]?.offline.c50 === 0 ? (
          <View />
        ) : (
          <View
            style={[
              commonStyles.horizontalChildrenSpaceView,
              {
                marginTop: RfH(16),
              },
            ]}>
            <View style={{ flex: 0.3 }}>
              <Text style={styles.tutorDetails}>Home Tutions</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 0.7,
              }}>
              <Text style={[styles.tutorDetails, { flex: 0.2 }]}>
                {priceMatrix &&
                  selectedSubject &&
                  selectedSubject.id &&
                  priceMatrix[`o${selectedSubject.id}`]?.offline.demo}
              </Text>
              <Text style={[styles.tutorDetails, { flex: 0.16 }]}>
                {priceMatrix &&
                  selectedSubject &&
                  selectedSubject.id &&
                  priceMatrix[`o${selectedSubject.id}`]?.offline.c1}
              </Text>
              <Text style={[styles.tutorDetails, { flex: 0.16 }]}>
                {priceMatrix &&
                  selectedSubject &&
                  selectedSubject.id &&
                  priceMatrix[`o${selectedSubject.id}`]?.offline.c5}
              </Text>
              <Text style={[styles.tutorDetails, { flex: 0.16 }]}>
                {priceMatrix &&
                  selectedSubject &&
                  selectedSubject.id &&
                  priceMatrix[`o${selectedSubject.id}`]?.offline.c10}
              </Text>
              <Text style={[styles.tutorDetails, { flex: 0.16 }]}>
                {priceMatrix &&
                  selectedSubject &&
                  selectedSubject.id &&
                  priceMatrix[`o${selectedSubject.id}`]?.offline.c25}
              </Text>
              <Text style={[styles.tutorDetails, { flex: 0.16 }]}>
                {priceMatrix &&
                  selectedSubject &&
                  selectedSubject.id &&
                  priceMatrix[`o${selectedSubject.id}`]?.offline.c50}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderRatingsReviews = () => {
    return (
      <View>
        <View>
          <Text style={[styles.tutorName, { marginHorizontal: RfW(16), marginTop: RfH(16) }]}>Rating and Reviews</Text>
        </View>
        <View>
          <Rating
            style={{ paddingVertical: RfH(16), alignSelf: 'flex-start', marginHorizontal: RfW(16) }}
            imageSize={30}
            ratingCount={5}
            readonly
            startingValue={overallRating}
          />
        </View>
        <View style={{ paddingHorizontal: RfW(16) }}>
          <FlatList
            numColumns={3}
            data={reviewProgress}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => renderProgress(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        <View style={commonStyles.lineSeparatorWithMargin} />

        <View style={{ marginBottom: RfH(34) }}>
          <FlatList
            data={userReviews}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => renderReviews(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;

    if (scrollPosition > 90) {
      setHideTutorPersonal(true);
    } else {
      setHideTutorPersonal(false);
    }
  };

  const getTutorImage = (tutor) => {
    return getUserImageUrl(tutor?.profileImage?.filename, tutor?.contactDetail?.gender, tutor.id);
  };

  const markFavouriteTutor = () => {
    if (isFavourite) {
      removeFavourite({
        variables: { tutorFavourite: { tutor: { id: tutorData?.id } } },
      });
    } else {
      markFavourite({
        variables: { tutorFavourite: { tutor: { id: tutorData?.id } } },
      });
    }
  };

  const openClassModeModal = (demo) => {
    setIsDemo(demo);
    setShowClassModePopup(true);
  };

  return (
    <View
      style={[
        commonStyles.mainContainer,
        { backgroundColor: Colors.white, paddingHorizontal: 0, padding: 0, paddingBottom: RfH(34) },
      ]}>
      <Loader
        isLoading={loadingFavouriteTutors || loadingFavouriteTutors || favouriteLoading || removeFavouriteLoading}
      />
      <View
        style={[
          styles.topView,
          {
            backgroundColor: Colors.white,
            height: RfH(88),
            paddingTop: RfH(44),
            paddingHorizontal: RfW(16),
            alignItems: 'center',
            justifyContent: 'flex-start',
          },
        ]}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <BackArrow action={onBackPress} />

          {hideTutorPersonal && (
            <View
              style={[
                commonStyles.horizontalChildrenView,
                {
                  backgroundColor: Colors.white,
                  paddingHorizontal: RfW(16),
                  paddingVertical: RfH(8),
                  justifyContent: 'center',
                },
              ]}>
              <IconButtonWrapper
                iconWidth={RfW(24)}
                iconHeight={RfH(24)}
                iconImage={getTutorImage(tutorData)}
                imageResizeMode="cover"
                styling={{ alignSelf: 'center', borderRadius: RfW(64) }}
              />
              <Text
                style={[
                  styles.tutorName,
                  {
                    marginLeft: RfW(8),
                    alignSelf: 'center',
                  },
                ]}>
                {tutorData.contactDetail.firstName} {tutorData.contactDetail.lastName}
              </Text>
            </View>
          )}
        </View>

        <View style={commonStyles.horizontalChildrenStartView}>
          <TouchableWithoutFeedback onPress={() => addToCompare()}>
            <View
              style={{
                height: RfH(44),
                width: RfW(44),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IconButtonWrapper
                iconWidth={RfW(16)}
                iconHeight={RfH(16)}
                iconImage={
                  compareData.some((item) => item.id === tutorData.id) ? Images.checkbox_selected : Images.checkbox
                }
                styling={{ marginHorizontal: RfW(16) }}
              />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => Alert.alert('Add to Favourite')}>
            <View
              style={{
                height: RfH(44),
                width: RfW(44),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IconButtonWrapper
                iconWidth={RfW(16)}
                iconHeight={RfH(16)}
                iconImage={isFavourite ? Images.heartFilled : Images.heart}
                styling={{ marginHorizontal: RfW(16) }}
                submitFunction={() => markFavouriteTutor()}
              />
            </View>
          </TouchableWithoutFeedback>

          {/* <IconButtonWrapper iconWidth={RfW(16)} iconHeight={RfH(16)} iconImage={Images.share} /> */}
        </View>
      </View>
      <ScrollView
        // stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(event) => handleScroll(event)}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingHorizontal: RfW(16),
            marginBottom: RfH(17),
          }}>
          <IconButtonWrapper
            iconWidth={RfH(98)}
            iconHeight={RfH(98)}
            iconImage={getTutorImage(tutorData)}
            imageResizeMode="cover"
            styling={{ alignSelf: 'center', borderRadius: RfH(49) }}
          />
          <View style={{ marginLeft: RfW(16) }}>
            <Text style={styles.tutorName}>
              {tutorData?.contactDetail?.firstName} {tutorData?.contactDetail?.lastName}
            </Text>
            <Text style={styles.tutorDetails}>GURUQT{tutorData?.id}</Text>
            {tutorData?.educationDetails?.length > 0 && (
              <Text style={[styles.tutorDetails, { color: Colors.primaryText }]}>
                {titleCaseIfExists(tutorData?.educationDetails[0]?.degree?.degreeLevel)}
                {' - '}
                {titleCaseIfExists(tutorData?.educationDetails[0]?.fieldOfStudy)}
              </Text>
            )}
            <Text style={[styles.tutorDetails, { color: Colors.primaryText }]}>
              {tutorData.teachingExperience ? `${tutorData.teachingExperience} years of Teaching Experience` : ''}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: RfH(8) }}>
              <Icon
                type="FontAwesome"
                name={tutorData.averageRating > 0 ? 'star' : 'star-o'}
                style={{ fontSize: 15, marginRight: RfW(4), color: Colors.brandBlue2 }}
              />
              {tutorData.averageRating > 0 ? (
                <Text style={styles.chargeText}>{parseFloat(tutorData.averageRating).toFixed(1)}</Text>
              ) : (
                <Text
                  style={{
                    color: Colors.secondaryText,
                    fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
                  }}>
                  NOT RATED
                </Text>
              )}
              {tutorData.reviewCount > 0 && (
                <Text
                  style={{
                    color: Colors.secondaryText,
                    fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                    marginLeft: RfW(8),
                  }}>
                  {tutorData.reviewCount} Reviews
                </Text>
              )}
            </View>
          </View>
        </View>
        <View style={commonStyles.lineSeparator} />

        {classView()}

        {/* <View style={commonStyles.lineSeparatorWithHorizontalMargin} /> */}

        {/* <View style={{ marginHorizontal: RfW(16), marginVertical: RfH(16) }}> */}
        {/*  <Text style={commonStyles.headingPrimaryText}>Educational Qualification</Text> */}
        {/*  <Text style={[styles.tutorDetails, { marginTop: RfH(8) }]}>Mass Communication</Text> */}
        {/* </View> */}

        <View style={commonStyles.lineSeparator} />
        {/* <View style={[commonStyles.blankViewSmall, { backgroundColor: Colors.lightGrey }]} /> */}
        {/* <View style={commonStyles.lineSeparatorWithHorizontalMargin} /> */}

        <View>
          <Text style={[styles.tutorName, { marginHorizontal: RfW(16), marginTop: RfH(16) }]}>Subjects</Text>
          <View style={{ marginBottom: RfH(16), paddingHorizontal: RfW(16) }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              numColumns={4}
              data={subjects}
              extraData={refreshList}
              renderItem={({ item, index }) => renderSubjects(item, index)}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
        {/* <View style={[commonStyles.blankViewSmall, { backgroundColor: Colors.lightGrey }]} /> */}
        {/* <View style={commonStyles.lineSeparatorWithHorizontalMargin} /> */}

        {renderPriceMatrix()}

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        <View>
          <TouchableWithoutFeedback onPress={() => setShowDateSlotModal(true)}>
            <Text
              style={{
                fontSize: 15,
                marginHorizontal: RfW(16),
                marginVertical: RfH(16),
                color: Colors.brandBlue2,
              }}>
              View Availability of Classes
            </Text>
          </TouchableWithoutFeedback>
        </View>

        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

        {renderRatingsReviews()}
      </ScrollView>

      <View style={commonStyles.lineSeparator} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: RfH(8),
          paddingHorizontal: RfW(16),
        }}>
        <Button
          onPress={() => openClassModeModal(true)}
          style={[commonStyles.buttonOutlinePrimary, { width: RfW(144) }]}>
          <Text style={commonStyles.textButtonOutlinePrimary}>Book {isFreeDemo ? '[Free]' : ''} Demo</Text>
        </Button>

        <Button onPress={() => openClassModeModal(false)} style={[commonStyles.buttonPrimary, { width: RfW(144) }]}>
          <Text style={commonStyles.textButtonPrimary}>Book Now</Text>
        </Button>
      </View>

      <DateSlotSelectorModal
        visible={showDateSlotModal}
        onClose={() => setShowDateSlotModal(false)}
        tutorId={tutorData?.id}
      />
      {showClassModePopup && (
        <ClassModeSelectModal
          visible={showClassModePopup}
          onClose={() => setShowClassModePopup(false)}
          selectedSubject={selectedSubject}
          demo={isDemo}
          budgetDetails={budgets && selectedSubject && selectedSubject.id && budgets[`${selectedSubject.id}`]}
        />
      )}

      {showCompareModal && (
        <CompareModal
          visible={showCompareModal}
          onClose={() => setShowCompareModal(false)}
          removeFromCompare={(index) => removeFromCompare(index)}
        />
      )}
    </View>
  );
}

export default tutorDetails;
