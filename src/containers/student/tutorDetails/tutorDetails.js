/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
import { FlatList, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import ProgressCircle from 'react-native-progress-circle';
import { Button, Icon } from 'native-base';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Rating } from 'react-native-ratings';
import { isEmpty } from 'lodash';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import {
  GET_AVERAGE_RATINGS,
  GET_FAVOURITE_TUTORS,
  GET_TUTOR_OFFERINGS,
  SEARCH_REVIEW,
  SEARCH_TUTORS,
} from '../tutor-query';
import styles from './styles';
import {
  getSaveData,
  getSubjectIcons,
  getUserImageUrl,
  removeData,
  RfH,
  RfW,
  storeData,
  titleCaseIfExists,
} from '../../../utils/helpers';
import { BackArrow, CompareModal, DateSlotSelectorModal, IconButtonWrapper, Loader } from '../../../components';
import { LOCAL_STORAGE_DATA_KEY, STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import Fonts from '../../../theme/fonts';
import ClassModeSelectModal from './components/classModeSelectModal';
import { MARK_FAVOURITE, REMOVE_FAVOURITE } from '../tutor-mutation';

function TutorDetails(props) {
  const navigation = useNavigation();

  const { route } = props;

  const tutorId = route?.params?.tutorId;
  const tutorDataObj = route?.params?.tutorData;
  const parentOffering = route?.params?.parentOffering;
  const parentParentOffering = route?.params?.parentParentOffering;

  const [showDateSlotModal, setShowDateSlotModal] = useState(false);
  const [showClassModePopup, setShowClassModePopup] = useState(false);
  const [hideTutorPersonal, setHideTutorPersonal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState({});
  const [tutorData, setTutorData] = useState({});

  const [subjects, setSubjects] = useState([]);
  const [refreshList, setRefreshList] = useState(false);
  const [priceMatrix, setPriceMatrix] = useState({});
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
      }
    },
    onCompleted: (data) => {
      if (data) {
        setFavouriteTutors(data?.getFavouriteTutors);
      }
    },
  });

  const [getTutors, { loading: loadingTutors }] = useLazyQuery(SEARCH_TUTORS, {
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setTutorData(data?.searchTutors?.edges[0]);
      }
    },
  });

  useEffect(() => {
    getFavouriteTutors();
    if (tutorId) {
      getTutors({ variables: { searchDto: { certified: true, active: true, id: tutorId } } });
    } else if (tutorDataObj) {
      setTutorData(tutorDataObj);
    }
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
        // const classData = {};
        const subjectList = [];
        data?.getTutorOfferings?.map((item) => {
          if (item.offering && !subjectList.find((sub) => sub.id === item.offering.id)) {
            if (item.offerings[1].id === parentOffering && item.offerings[2].id === parentParentOffering) {
              subjectList.push({
                id: item.offering.id,
                displayName: item.offering.displayName,
                offeringId: item.id,
                demoClass: item.demoClass,
                freeDemo: item.freeDemo,
                groupClass: item.groupClass === 0 || item.groupClass === 1,
                onlineClass: item.onlineClass === 0 || item.onlineClass === 1,
                individualClass: item.groupClass === 0 || item.groupClass === 2,
                homeTution: item.onlineClass === 0 || item.onlineClass === 2,
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
              }
            }
          }
        });
        if (!isEmpty(subjectList)) {
          setSelectedSubject(subjectList[0]);
        }
        setSubjects(subjectList);
        setPriceMatrix(pm);
        setBudgets(sb);
        setRefreshList(!refreshList);
      }
    },
  });

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

  const getPercentage = (value) => value * 20;

  const [reviewProgress, setReviewProgress] = useState([
    { typeName: 'Course Understanding', image: Images.methodology, percentage: 0, key: 'courseUnderstanding' },
    { typeName: 'Helpfulness', image: Images.chat, percentage: 0, key: 'helpfulness' },
    { typeName: 'Professional Attitude', image: Images.professional, percentage: 0, key: 'professionalAttitude' },
    { typeName: 'Teaching Methodology', image: Images.methodology, percentage: 0, key: 'teachingMethodology' },
    { typeName: 'Accessibility', image: Images.thumb_range, percentage: 0, key: 'accessibility' },
    { typeName: 'Improvement in Results', image: Images.stats, percentage: 0, key: 'resultImprovement' },
  ]);

  const [getAverageRating, { loading: ratingLoading }] = useLazyQuery(GET_AVERAGE_RATINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      console.log('data', data);
      if (data) {
        const ratingArray = reviewProgress;

        Object.entries(data.getAverageRating).forEach(([key, value]) => {
          ratingArray.map((item) => ({
            ...item,
            percentage: item.key === key ? getPercentage(value) : item.percentage,
          }));
        });
        setReviewProgress(ratingArray);
        setOverallRating(data.getAverageRating.overallRating);
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
    if (favouriteTutors && !isEmpty(tutorData)) {
      setIsFavourite(favouriteTutors.find((ft) => ft?.tutor?.id === tutorData?.id));
    }
  }, [favouriteTutors, tutorData]);

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
    if (!isEmpty(tutorData)) {
      searchReview({ variables: { reviewSearchDto: { tutorId: tutorData?.id } } });
      getAverageRating({ variables: { reviewSearchDto: { tutorId: tutorData?.id } } });
      getTutorOffering();
      checkCompare();
    }
  }, [tutorData]);

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
    setSelectedSubject(item);
  };

  const renderSubjects = (item) => (
    <TouchableWithoutFeedback onPress={() => selectSubject(item)}>
      <View style={{ marginTop: RfH(20), flex: 1, alignItems: 'center' }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: selectedSubject.id === item.id ? Colors.lightBlue : Colors.lightPurple,
            height: RfH(70),
            width: RfH(70),
            marginHorizontal: RfW(8),
            borderRadius: RfW(8),
          }}>
          <IconButtonWrapper
            iconWidth={RfW(48)}
            styling={{ alignSelf: 'center' }}
            iconHeight={RfH(56)}
            iconImage={getSubjectIcons(item.displayName)}
          />
        </View>
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
    </TouchableWithoutFeedback>
  );

  const renderProgress = (item) => (
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

  const classView = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: RfW(16),
        paddingVertical: RfW(16),
      }}>
      <View style={{ alignItems: 'center' }}>
        <IconButtonWrapper
          iconWidth={RfW(24)}
          iconHeight={RfH(24)}
          iconImage={selectedSubject.individualClass ? Images.individual_class_filled : Images.individual_class}
          styling={{ marginHorizontal: RfW(16) }}
        />
        <Text style={styles.classMeta}>Individual</Text>
      </View>

      <View style={{ alignItems: 'center' }}>
        <IconButtonWrapper
          iconWidth={RfW(24)}
          iconHeight={RfH(24)}
          iconImage={selectedSubject?.groupClass ? Images.group_class_filled : Images.group_class}
          styling={{ marginHorizontal: RfW(16) }}
        />
        <Text style={styles.classMeta}>Group Classes</Text>
      </View>

      <View style={{ alignItems: 'center' }}>
        <IconButtonWrapper
          iconWidth={RfW(24)}
          iconHeight={RfH(24)}
          iconImage={selectedSubject?.freeDemo ? Images.free_demo_filled : Images.free_demo}
          styling={{ marginHorizontal: RfW(16) }}
        />
        <Text style={styles.classMeta}>Free Demo</Text>
      </View>

      <View style={{ alignItems: 'center' }}>
        <IconButtonWrapper
          iconWidth={RfW(24)}
          iconHeight={RfH(24)}
          iconImage={selectedSubject?.onlineClass ? Images.online_class_filled : Images.online_class}
          styling={{ marginHorizontal: RfW(16) }}
        />
        <Text style={styles.classMeta}>Online</Text>
      </View>

      <View style={{ alignItems: 'center' }}>
        <IconButtonWrapper
          iconWidth={RfW(24)}
          iconHeight={RfH(24)}
          iconImage={selectedSubject?.homeTution ? Images.home_tuition_filled : Images.home_tuition}
          styling={{ marginHorizontal: RfW(16) }}
        />
        <Text style={styles.classMeta}>Home Tuition</Text>
      </View>
    </View>
  );

  const renderPriceMatrix = () => (
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
              {priceMatrix && selectedSubject && selectedSubject.id && priceMatrix[`o${selectedSubject.id}`]?.online.c1}
            </Text>
            <Text style={[styles.tutorDetails, { flex: 0.16 }]}>
              {priceMatrix && selectedSubject && selectedSubject.id && priceMatrix[`o${selectedSubject.id}`]?.online.c5}
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

  const topHeaderComponent = () => (
    <View style={styles.topView}>
      <View style={styles.topMainView}>
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
            <Text style={[styles.tutorName, { marginLeft: RfW(8), alignSelf: 'center' }]}>
              {tutorData.contactDetail.firstName} {tutorData.contactDetail.lastName}
            </Text>
          </View>
        )}
      </View>
      <View style={commonStyles.horizontalChildrenStartView}>
        <TouchableOpacity onPress={addToCompare} style={styles.markFavouriteView}>
          <IconButtonWrapper
            iconWidth={RfW(16)}
            iconHeight={RfH(16)}
            iconImage={
              compareData.some((item) => item.id === tutorData.id) ? Images.checkbox_selected : Images.checkbox
            }
            styling={{ marginHorizontal: RfW(16) }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.markFavouriteView} onPress={markFavouriteTutor}>
          <IconButtonWrapper
            iconWidth={RfW(16)}
            iconHeight={RfH(16)}
            iconImage={isFavourite ? Images.heartFilled : Images.heart}
            styling={{ marginHorizontal: RfW(16) }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const topProfileView = () => (
    <View style={styles.topContainer}>
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
  );

  return (
    <SafeAreaView
      style={[
        commonStyles.mainContainer,
        { backgroundColor: Colors.white, paddingHorizontal: 0, padding: 0, paddingBottom: RfH(34) },
      ]}>
      <Loader
        isLoading={
          loadingFavouriteTutors ||
          loadingFavouriteTutors ||
          favouriteLoading ||
          removeFavouriteLoading ||
          loadingTutors
        }
      />
      {!isEmpty(tutorData) && (
        <>
          {topHeaderComponent()}
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(event) => handleScroll(event)}>
            {topProfileView()}
            <View style={commonStyles.lineSeparator} />
            {selectedSubject && classView()}
            <View style={commonStyles.lineSeparator} />
            <View>
              <Text style={[styles.tutorName, { marginHorizontal: RfW(16), marginTop: RfH(16) }]}>Subjects</Text>
              <View style={{ marginBottom: RfH(16), paddingHorizontal: RfW(16) }}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  data={subjects}
                  extraData={refreshList}
                  renderItem={({ item, index }) => renderSubjects(item, index)}
                  keyExtractor={(item, index) => index.toString()}
                  style={{ flex: 1 }}
                />
              </View>
            </View>

            <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

            {renderPriceMatrix()}

            <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
            <TouchableOpacity onPress={() => setShowDateSlotModal(true)} activeOpacity={1}>
              <Text
                style={{
                  fontSize: 15,
                  marginHorizontal: RfW(16),
                  marginVertical: RfH(16),
                  color: Colors.brandBlue2,
                }}>
                View Availability of Classes
              </Text>
            </TouchableOpacity>

            <View style={commonStyles.lineSeparatorWithHorizontalMargin} />

            {renderRatingsReviews()}
          </ScrollView>

          <View style={commonStyles.lineSeparator} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: selectedSubject.demoClass ? 'space-between' : 'center',
              marginTop: RfH(8),
              paddingHorizontal: RfW(30),
            }}>
            {selectedSubject.demoClass && (
              <Button
                onPress={() => openClassModeModal(true)}
                style={[commonStyles.buttonOutlinePrimary, { width: RfW(144) }]}>
                <Text style={commonStyles.textButtonOutlinePrimary}>
                  Book {selectedSubject.freeDemo ? 'Free' : ''} Demo
                </Text>
              </Button>
            )}
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
        </>
      )}
    </SafeAreaView>
  );
}

export default TutorDetails;
