/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import ProgressCircle from 'react-native-progress-circle';
import { Button } from 'native-base';
import { useLazyQuery, useMutation } from '@apollo/client';
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
  getFullName,
  getSaveData,
  getSubjectIcons,
  getUserImageUrl,
  removeData,
  RfH,
  RfW,
  storeData,
  titleCaseIfExists,
} from '../../../utils/helpers';
import {
  BackArrow,
  CompareModal,
  IconButtonWrapper,
  Loader,
  TutorImageComponent,
  UserRatings,
  UserReviews,
} from '../../../components';
import { LOCAL_STORAGE_DATA_KEY, STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import AddToCartModal from './components/addToCartModal';
import { MARK_FAVOURITE, REMOVE_FAVOURITE } from '../tutor-mutation';
import PriceMatrixComponent from './components/priceMatrixComponent';
import TutorAvailabilitySlots from '../../../components/TutorAvailabilitySlots';

function TutorDetails(props) {
  const navigation = useNavigation();

  const { route } = props;

  const tutorId = route?.params?.tutorId;
  const tutorDataObj = route?.params?.tutorData;

  const parentOffering = route?.params?.parentOffering;

  const [showDateSlotModal, setShowDateSlotModal] = useState(false);
  const [showClassModePopup, setShowClassModePopup] = useState(false);
  const [hideTutorPersonal, setHideTutorPersonal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState({});
  const [tutorData, setTutorData] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [refreshList, setRefreshList] = useState(false);
  const [compareData, setCompareData] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  // const [overallRating, setOverallRating] = useState(0);
  // const [reviewProgress, setReviewProgress] = useState([
  //   { typeName: 'Course Understanding', image: Images.methodology, percentage: 0, key: 'courseUnderstanding' },
  //   { typeName: 'Helpfulness', image: Images.chat, percentage: 0, key: 'helpfulness' },
  //   { typeName: 'Professional Attitude', image: Images.professional, percentage: 0, key: 'professionalAttitude' },
  //   { typeName: 'Teaching Methodology', image: Images.methodology, percentage: 0, key: 'teachingMethodology' },
  //   { typeName: 'Accessibility', image: Images.thumb_range, percentage: 0, key: 'accessibility' },
  //   { typeName: 'Improvement in Results', image: Images.stats, percentage: 0, key: 'resultImprovement' },
  // ]);
  // const [userReviews, setUserReviews] = useState([]);

  const [getFavouriteTutors, { loading: loadingFavouriteTutors }] = useLazyQuery(GET_FAVOURITE_TUTORS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setIsFavourite(data?.getFavouriteTutors.find((ft) => ft?.tutor?.id === tutorData?.id));
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
        getFavouriteTutors({
          variables: {
            parentOfferingId: parentOffering,
          },
        });
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

  useEffect(() => {
    if (tutorId) {
      getTutors({ variables: { searchDto: { certified: true, active: true, id: tutorId } } });
    } else if (tutorDataObj) {
      getFavouriteTutors({
        variables: {
          parentOfferingId: parentOffering,
        },
      });
      setTutorData(tutorDataObj);
    }
  }, []);

  const [getTutorOffering, { loading: loadingTutorsOffering }] = useLazyQuery(GET_TUTOR_OFFERINGS, {
    fetchPolicy: 'no-cache',
    variables: { tutorId: tutorData?.id, parentOfferingId: parentOffering },
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        const subjectList = data?.getTutorOfferings?.map((item) => ({
          id: item.offering.id,
          displayName: item.offering.displayName,
          offeringId: item.id,
          demoClass: item.demoClass,
          freeDemo: item.freeDemo,
          groupClass: item.groupClass === 0 || item.groupClass === 1,
          onlineClass: item.onlineClass === 0 || item.onlineClass === 1,
          individualClass: item.groupClass === 0 || item.groupClass === 2,
          offlineClass: item.onlineClass === 0 || item.onlineClass === 2,
          budgetDetails: item.budgets,
        }));
        if (!isEmpty(subjectList)) {
          setSelectedSubject(subjectList[0]);
        }
        setSubjects(subjectList);
        setRefreshList(!refreshList);
      }
    },
  });

  // const getPercentage = (value) => value * 20;

  // const [getAverageRating, { loading: ratingLoading }] = useLazyQuery(GET_AVERAGE_RATINGS, {
  //   fetchPolicy: 'no-cache',
  //   onError: (e) => {
  //     if (e.graphQLErrors && e.graphQLErrors.length > 0) {
  //       const error = e.graphQLErrors[0].extensions.exception.response;
  //     }
  //   },
  //   onCompleted: (data) => {
  //     if (data) {
  //       let ratingArray = reviewProgress;
  //       Object.keys(data.getAverageRating).forEach((key) => {
  //         ratingArray = ratingArray.map((item) => ({
  //           ...item,
  //           percentage: item.key === key ? getPercentage(data.getAverageRating[key]) : item.percentage,
  //         }));
  //       });
  //       setReviewProgress(ratingArray);
  //       setOverallRating(data.getAverageRating.overallRating);
  //     }
  //   },
  // });

  // const [searchReview, { loading: reviewLoading }] = useLazyQuery(SEARCH_REVIEW, {
  //   fetchPolicy: 'no-cache',
  //   onError: (e) => {
  //     if (e.graphQLErrors && e.graphQLErrors.length > 0) {
  //       const error = e.graphQLErrors[0].extensions.exception.response;
  //     }
  //   },
  //   onCompleted: (data) => {
  //     if (data) {
  //       const review = [];
  //       for (const obj of data.searchReview.edges) {
  //         const item = {
  //           name: getFullName(obj.createdBy),
  //           icon: obj.createdBy,
  //           rating: obj.overallRating,
  //           date: new Date(obj.createdDate).toDateString(),
  //           description: obj.text,
  //         };
  //         review.push(item);
  //       }
  //       setUserReviews(review);
  //     }
  //   },
  // });

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
      // searchReview({ variables: { reviewSearchDto: { tutorId: tutorData?.id } } });
      // getAverageRating({ variables: { reviewSearchDto: { tutorId: tutorData?.id } } });
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
            height: RfH(70),
            width: RfH(70),
            marginHorizontal: RfW(8),
            borderRadius: RfW(8),
          }}>
          <IconButtonWrapper
            iconWidth={RfW(64)}
            styling={{ alignSelf: 'center' }}
            iconHeight={RfH(64)}
            iconImage={getSubjectIcons(item.displayName, selectedSubject.id !== item.id)}
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

  // const renderProgress = (item) => (
  //   <View style={{ flex: 0.33, alignItems: 'center', marginTop: RfH(16) }}>
  //     <ProgressCircle
  //       percent={item.percentage}
  //       radius={32}
  //       borderWidth={6}
  //       color={Colors.brandBlue2}
  //       shadowColor={Colors.lightGrey}
  //       bgColor={Colors.white}>
  //       <IconButtonWrapper iconWidth={RfW(22)} iconHeight={RfH(22)} imageResizeMode="contain" iconImage={item.image} />
  //     </ProgressCircle>
  //     <Text
  //       style={{
  //         fontSize: RFValue(12, STANDARD_SCREEN_SIZE),
  //         textAlign: 'center',
  //         marginTop: RfH(8),
  //         color: Colors.darkGrey,
  //       }}>
  //       {item.typeName}
  //     </Text>
  //   </View>
  // );

  // const renderReviews = (item) => {
  //   return (
  //     <View
  //       style={{
  //         paddingHorizontal: RfW(16),
  //       }}>
  //       <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
  //         <IconButtonWrapper
  //           iconHeight={RfH(40)}
  //           iconWidth={RfH(40)}
  //           iconImage={getUserImageUrl(
  //             item?.createdBy?.profileImage?.filename,
  //             item?.createdBy?.gender,
  //             item?.createdBy?.id
  //           )}
  //           styling={{ borderRadius: RfH(20) }}
  //         />
  //         <View
  //           style={{
  //             flexDirection: 'column',
  //             justifyContent: 'center',
  //             alignItems: 'flex-start',
  //             marginLeft: RfW(8),
  //           }}>
  //           <Text style={{ fontFamily: 'SegoeUI-Semibold' }}>{item.name}</Text>
  //           <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
  //             {item.date} |{' '}
  //             <IconButtonWrapper
  //               iconWidth={RfW(10)}
  //               iconHeight={RfH(10)}
  //               iconImage={Images.golden_star}
  //               styling={{ alignSelf: 'center' }}
  //             />{' '}
  //             {parseFloat(item.rating).toFixed(1)}
  //           </Text>
  //         </View>
  //       </View>
  //       <Text style={{ marginTop: RfH(8), color: Colors.darkGrey }}>{item.description}</Text>

  //       <View style={[commonStyles.lineSeparator, { marginVertical: RfH(16) }]} />
  //     </View>
  //   );
  // };

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
          iconImage={selectedSubject?.offlineClass ? Images.home_tuition_filled : Images.home_tuition}
          styling={{ marginHorizontal: RfW(16) }}
        />
        <Text style={styles.classMeta}>Offline</Text>
      </View>
    </View>
  );

  const renderRatingsReviews = () => (
    <View>
      <View>
        <Text style={[styles.tutorName, { marginHorizontal: RfW(16), marginTop: RfH(16) }]}>Rating and Reviews</Text>
      </View>
      <UserRatings tutorId={tutorData?.id} />
      <View style={commonStyles.lineSeparatorWithMargin} />
      <View style={{ marginBottom: RfH(34) }}>
        <UserReviews tutorId={tutorData?.id} />
      </View>
    </View>
  );

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    setHideTutorPersonal(scrollPosition > 90);
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
            <TutorImageComponent
              tutor={tutorData}
              width={24}
              height={24}
              styling={{ alignSelf: 'center', borderRadius: RfH(64) }}
              fontSize={15}
            />
            <Text style={[styles.tutorName, { marginLeft: RfW(8), alignSelf: 'center' }]}>
              {getFullName(tutorData.contactDetail)}
            </Text>
          </View>
        )}
      </View>
      <View style={[commonStyles.horizontalChildrenStartView, { justifyContent: 'center', alignItems: 'center' }]}>
        {!hideTutorPersonal && (
          <View>
            <Text>Compare</Text>
          </View>
        )}
        <TouchableOpacity onPress={addToCompare} style={[styles.markFavouriteView]}>
          <IconButtonWrapper
            iconWidth={RfW(16)}
            iconHeight={RfH(16)}
            iconImage={
              compareData.some((item) => item.id === tutorData.id) ? Images.checkbox_selected : Images.checkbox
            }
            imageResizeMode="contain"
            styling={{ marginHorizontal: RfW(8) }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.markFavouriteView} onPress={markFavouriteTutor} activeOpacity={0.8}>
          <IconButtonWrapper
            iconWidth={RfW(16)}
            iconHeight={RfH(16)}
            iconImage={isFavourite ? Images.heartFilled : Images.heart}
            styling={{ marginHorizontal: RfW(8) }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const topProfileView = () => (
    <View style={styles.topContainer}>
      <TutorImageComponent
        tutor={tutorData}
        styling={{ alignSelf: 'center', borderRadius: RfH(80), height: RfH(80), width: RfH(80) }}
      />
      <View style={{ marginLeft: RfW(16), width: '70%' }}>
        <Text style={styles.tutorName}>{getFullName(tutorData?.contactDetail)}</Text>
        <Text style={styles.tutorDetails}>T-{tutorData?.id}</Text>
        {tutorData?.educationDetails?.length > 0 && (
          <Text style={[styles.tutorDetails, { color: Colors.primaryText }]} numberOfLines={1}>
            {titleCaseIfExists(tutorData?.educationDetails[0]?.degree?.degreeLevel)}
            {' - '}
            {titleCaseIfExists(tutorData?.educationDetails[0]?.fieldOfStudy)}
          </Text>
        )}
        <Text style={[styles.tutorDetails, { color: Colors.primaryText }]}>
          {tutorData.teachingExperience ? `${tutorData.teachingExperience} years of Teaching Experience` : ''}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: RfH(8) }}>
          <IconButtonWrapper
            iconImage={tutorData.averageRating > 0 ? Images.filledStar : Images.unFilledStar}
            iconHeight={RfH(15)}
            iconWidth={RfW(15)}
            imageResizeMode="contain"
            styling={{ marginRight: RfW(4) }}
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
    <>
      <Loader
        isLoading={
          favouriteLoading || removeFavouriteLoading || loadingTutors || loadingTutorsOffering || isEmpty(tutorData)
        }
      />
      <SafeAreaView
        style={[
          commonStyles.mainContainer,
          { backgroundColor: Colors.white, paddingHorizontal: 0, padding: 0, paddingBottom: RfH(34) },
        ]}>
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
              <View style={{ marginBottom: RfH(16) }}>
                <Text style={[styles.tutorName, { marginHorizontal: RfW(16), marginTop: RfH(16) }]}>Subjects</Text>
                <ScrollView
                  containerStyle={{ paddingHorizontal: RfW(16) }}
                  horizontal
                  showsHorizontalScrollIndicator={false}>
                  {subjects.map((item, index) => renderSubjects(item, index))}
                </ScrollView>
              </View>

              <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
              <View style={{ paddingHorizontal: RfW(16) }}>
                {selectedSubject && selectedSubject.budgetDetails && (
                  <PriceMatrixComponent
                    budgets={selectedSubject.budgetDetails}
                    showOnline={selectedSubject.onlineClass}
                    showOffline={selectedSubject.offlineClass}
                  />
                )}
              </View>

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
                justifyContent: 'space-evenly',
                paddingVertical: RfH(8),
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
              <Button
                onPress={() => openClassModeModal(false)}
                style={[commonStyles.buttonPrimary, { width: RfW(144) }]}>
                <Text style={commonStyles.textButtonPrimary}>Book Now</Text>
              </Button>
            </View>

            <TutorAvailabilitySlots
              visible={showDateSlotModal}
              onClose={() => setShowDateSlotModal(false)}
              tutorId={tutorData?.id}
            />
            {showClassModePopup && (
              <AddToCartModal
                visible={showClassModePopup}
                onClose={() => setShowClassModePopup(false)}
                selectedSubject={selectedSubject}
                isDemoClass={isDemo}
              />
            )}
            {showCompareModal && (
              <CompareModal
                offeringId={parentOffering}
                visible={showCompareModal}
                onClose={() => setShowCompareModal(false)}
                removeFromCompare={(index) => removeFromCompare(index)}
              />
            )}
          </>
        )}
      </SafeAreaView>
    </>
  );
}

export default TutorDetails;
