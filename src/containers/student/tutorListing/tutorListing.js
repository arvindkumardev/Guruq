/* eslint-disable no-plusplus */
import { Alert, FlatList, ScrollView, StatusBar, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Icon, Thumbnail } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useMutation } from '@apollo/client';
import { RFValue } from 'react-native-responsive-fontsize';
import { isEmpty } from 'lodash';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { getSaveData, removeData, RfH, RfW, storeData, titleCaseIfExists } from '../../../utils/helpers';
import styles from './styles';
import routeNames from '../../../routes/screenNames';
import { CompareModal, IconButtonWrapper } from '../../../components';
import { GET_FAVOURITE_TUTORS, SEARCH_TUTORS } from '../tutor-query';
import Loader from '../../../components/Loader';
import Fonts from '../../../theme/fonts';
import { LOCAL_STORAGE_DATA_KEY, STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { MARK_FAVOURITE, REMOVE_FAVOURITE } from '../tutor-mutation';
import BackArrow from '../../../components/BackArrow';
import FilterComponent from './components/filterComponent';
import { TEMP_FILTER_DATA } from './components/filterComponent/constant';

function TutorListing(props) {
  const navigation = useNavigation();
  const { route } = props;
  const offering = route?.params?.offering;
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [topHeaderSticky, setTopHeaderSticky] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  const [filterValues, setFilterValues] = useState({
    certified: true,
    offeringId: offering?.id,
    degreeLevel: 0,
    experience: 0,
    averageRating: 0,
    minBudget: 0,
    maxBudget: 0,
    teachingMode: 0,
    page: 1,
    size: 20,
    sortBy: 'teachingExperience',
    sortOrder: 'desc',
    active: true,
  });

  const [filterObj, setFilterObj] = useState({ ...TEMP_FILTER_DATA });
  const [refreshTutorList, setRefreshTutorList] = useState(false);
  const [tutorsData, setTutorsData] = useState([]);
  const [favourites, setFavourites] = useState([]);

  const openCompareTutor = async () => {
    let compareArray = [];
    compareArray = JSON.parse(await getSaveData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID));
    if (compareArray == null) {
      Alert.alert('Add tutors before compare');
    } else {
      setShowCompareModal(true);
    }
  };

  const [getTutors, { loading: loadingTutors }] = useLazyQuery(SEARCH_TUTORS, {
    variables: { searchDto: filterValues },
    onError: (e) => {
      console.log(e);
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setTutorsData(data);
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
        setFavourites(!isEmpty(data?.getFavouriteTutors) && data.getFavouriteTutors.map((item) => item?.tutor?.id));
      }
    },
  });

  useEffect(() => {
    getTutors();
    getFavouriteTutors();
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
        let fTutors = [];
        fTutors = favourites;
        fTutors.push(data.markFavourite.tutor.id);
        setFavourites(fTutors);
        setRefreshTutorList(!refreshTutorList);
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
        let fTutors = [];
        let index = 0;
        fTutors = favourites;
        index = fTutors.indexOf(data.removeFromFavourite[0].tutor.id);
        if (index !== -1) {
          fTutors.splice(index, 1);
          setFavourites(fTutors);
          setRefreshTutorList(!refreshTutorList);
        }
      }
    },
  });

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const favTutors = [];
  //     if (favouriteTutors) {
  //       for (let i = 0; i < favouriteTutors.length; i++) {
  //         favTutors.push(favouriteTutors[i].tutor.id);
  //       }
  //       setFavourites(favTutors);
  //       setRefreshTutorList(!refreshTutorList);
  //     }
  //   }, [favouriteTutors])
  // );

  const onBackPress = () => {
    navigation.goBack();
  };

  const getTutorImage = (tutor) => {
    return tutor && tutor.profileImage && tutor.profileImage.filename
      ? { uri: `https://guruq.in/api/${tutor?.profileImage?.filename}` }
      : {
          uri: `https://guruq.in/guruq-new/images/avatars/${tutor?.contactDetail?.gender === 'MALE' ? 'm' : 'f'}${
            tutor.id % 4
          }.png`,
        };
  };

  const markFavouriteTutor = (tutorId) => {
    if (favourites.includes(tutorId)) {
      removeFavourite({
        variables: { tutorFavourite: { tutor: { id: tutorId } } },
      });
    } else {
      markFavourite({
        variables: { tutorFavourite: { tutor: { id: tutorId } } },
      });
    }
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    setTopHeaderSticky(scrollPosition > 30);
  };

  useEffect(() => {
    if (filterValues) {
      getTutors();
    }
  }, [filterValues]);

  const setFilterValuesHandle = (data) => {
    let actualFilterData = {};
    Object.entries(data).forEach(([key, value]) => {
      actualFilterData = { ...actualFilterData, ...value.filterData };
    });
    setFilterValues((filterValues) => ({ ...filterValues, ...actualFilterData }));
  };

  const applyFilters = (filterObjData) => {
    setShowFilterPopup(false);
    setIsFilterApplied(true);
    setFilterObj(filterObjData);
    setFilterValuesHandle(filterObjData);
  };

  const clearFilters = () => {
    setFilterObj({ ...TEMP_FILTER_DATA });
    setFilterValuesHandle(TEMP_FILTER_DATA);
  };

  const removeFilter = (key) => {
    const filterObjData = { ...filterObj, [key]: TEMP_FILTER_DATA[key] };
    setFilterObj(filterObjData);
    setFilterValuesHandle(filterObjData);
  };

  const removeFromCompare = async (index) => {
    let compareArray = [];
    compareArray = JSON.parse(await getSaveData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID));
    compareArray.splice(index, 1);
    await removeData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID);
    if (compareArray.length > 0) {
      storeData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID, JSON.stringify(compareArray)).then(() => {});
    }
    setShowCompareModal(false);
  };

  const goToTutorDetails = (item) => {
    navigation.navigate(routeNames.STUDENT.TUTOR_DETAILS, {
      tutorData: item,
      parentOffering: offering?.parentOffering?.id,
      parentParentOffering: offering?.parentOffering?.parentOffering?.id,
      parentOfferingName: offering?.parentOffering?.displayName,
      parentParentOfferingName: offering?.parentOffering?.parentOffering?.displayName,
    });
  };

  const getTutorBudget = (item) => {
    const tutorOffering =
      item.tutorOfferings && item.tutorOfferings.find((s) => s.offerings.find((o) => o.id === offering.id));
    const onlineBudget = tutorOffering?.budgets.find((s) => s.onlineClass === true);
    const offlineBudget = tutorOffering?.budgets.find((s) => s.onlineClass === false);
    if (onlineBudget && offlineBudget) {
      return onlineBudget.price > offlineBudget.price ? offlineBudget.price : onlineBudget.price;
    }
    if (onlineBudget) {
      return onlineBudget.price;
    }
    if (offlineBudget) {
      return offlineBudget.price;
    }
    return 0;
  };

  const getFreeDemoClassView = (item) => {
    const tutorOffering =
      item.tutorOfferings && item.tutorOfferings.find((s) => s.offerings.find((o) => o.id === offering.id));
    return (
      tutorOffering?.freeDemo && (
        <View style={{ marginHorizontal: RfW(8), marginTop: RfH(8) }}>
          <View style={commonStyles.lineSeparator} />
          <Text
            style={{
              fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
              color: Colors.secondaryText,
            }}>
            Free Demo Class
          </Text>
        </View>
      )
    );
  };

  const renderItem = (item) => (
    <View style={styles.listItemParent}>
      <TouchableWithoutFeedback onPress={() => goToTutorDetails(item)}>
        <View style={[commonStyles.horizontalChildrenStartView]}>
          <View style={styles.userIconParent}>
            <Thumbnail square style={styles.userIcon} source={getTutorImage(item)} />
            {item.id % 7 === 0 && (
              <View
                style={{
                  position: 'absolute',
                  bottom: -5,
                  left: 0,
                  zIndex: 100,
                  borderRadius: RfW(20),
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: RfW(8),
                }}>
                <View
                  style={{
                    backgroundColor: Colors.orange,
                    borderRadius: RfW(2),
                    paddingVertical: RfH(2),
                    paddingHorizontal: RfW(4),
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      textTransform: 'uppercase',
                      color: Colors.white,
                      fontFamily: Fonts.bold,
                    }}>
                    Sponsored
                  </Text>
                </View>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={[commonStyles.verticallyStretchedItemsView, { flex: 1, marginLeft: RfW(8) }]}>
                <Text style={styles.tutorName}>
                  {item.contactDetail.firstName} {item.contactDetail.lastName}
                </Text>
                {item.educationDetails.length > 0 && (
                  <Text style={styles.tutorDetails} numberOfLines={1}>
                    {titleCaseIfExists(item.educationDetails[0].degree?.degreeLevel)}
                    {' - '}
                    {titleCaseIfExists(item.educationDetails[0].fieldOfStudy)}
                  </Text>
                )}
                <Text style={styles.tutorDetails}>{item.teachingExperience} Years of Experience</Text>
                <View style={[styles.iconsView, { marginTop: RfH(8) }]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}>
                    <Icon
                      type="FontAwesome"
                      name={item.averageRating > 0 ? 'star' : 'star-o'}
                      style={{ fontSize: 15, marginRight: RfW(4), color: Colors.brandBlue2 }}
                    />
                    {item.averageRating > 0 ? (
                      <Text style={styles.chargeText}>{parseFloat(item.averageRating).toFixed(1)}</Text>
                    ) : (
                      <Text
                        style={{
                          color: Colors.secondaryText,
                          fontSize: RFValue(13, STANDARD_SCREEN_SIZE),
                        }}>
                        NOT RATED
                      </Text>
                    )}

                    {item.reviewCount > 0 && (
                      <Text
                        style={{
                          color: Colors.secondaryText,
                          fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                          marginLeft: RfW(8),
                        }}>
                        {item.reviewCount} Reviews
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  alignSelf: 'flex-start',
                }}>
                <TouchableWithoutFeedback onPress={() => markFavouriteTutor(item.id)}>
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
                      iconImage={favourites.includes(item.id) ? Images.heartFilled : Images.heart}
                      styling={{ marginHorizontal: RfW(16) }}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <View>
                  <Text style={styles.chargeText}>₹ {getTutorBudget(item)}/Hr</Text>
                </View>
              </View>
            </View>
            {getFreeDemoClassView(item)}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  const filtersView = () => (
    <View
      style={[
        commonStyles.horizontalChildrenView,
        {
          marginTop: RfH(isFilterApplied ? 100 : 16),
          height: RfH(44),
        },
      ]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: RfW(16) }}>
        {Object.entries(filterObj).map(([key, value]) => (
          <>
            {!isEmpty(value.displayValue) && (
              <View style={styles.filterButton}>
                <Text style={styles.appliedFilterText}>{value.displayValue}</Text>
                <IconButtonWrapper
                  iconWidth={RfW(16)}
                  iconHeight={RfH(16)}
                  iconImage={Images.blue_cross}
                  styling={{ marginLeft: RfW(12) }}
                  submitFunction={() => removeFilter(key)}
                />
              </View>
            )}
          </>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0, padding: 0 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <Loader isLoading={loadingTutors || loadingFavouriteTutors || favouriteLoading || removeFavouriteLoading} />
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => handleScroll(event)}
        scrollEventThrottle={16}>
        <View style={[styles.topView, { paddingTop: RfH(44) }]}>
          {topHeaderSticky && (
            <View
              style={{
                height: RfH(44),
                marginTop: RfH(16),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: RfW(16),
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <BackArrow action={onBackPress} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.subjectTitle, { fontSize: RFValue(17, STANDARD_SCREEN_SIZE) }]}>
                    {offering?.displayName} Tutors
                  </Text>
                  <Text
                    style={[
                      styles.classText,
                      {
                        fontSize: RFValue(15, STANDARD_SCREEN_SIZE),
                        marginLeft: RfW(8),
                      },
                    ]}>
                    {offering?.parentOffering?.parentOffering?.displayName}
                    {' | '}
                    {offering?.parentOffering?.displayName}
                  </Text>
                </View>
              </View>
              <IconButtonWrapper styling={[styles.bookIcon, { height: 40 }]} iconImage={Images.book} />
            </View>
          )}
          {!topHeaderSticky && (
            <View
              style={{
                height: RfH(98),
                marginTop: RfH(88),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: RfW(16),
                backgroundColor: Colors.lightPurple,
              }}>
              <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                <View style={{}}>
                  <BackArrow action={onBackPress} />
                </View>
                <View style={{ height: RfH(54), justifyContent: 'center', paddingHorizontal: RfW(0) }}>
                  <Text style={[styles.subjectTitle, { fontSize: RFValue(20, STANDARD_SCREEN_SIZE) }]}>
                    {offering?.displayName} Tutors
                  </Text>
                  <Text style={[styles.classText, { fontSize: RFValue(15, STANDARD_SCREEN_SIZE) }]}>
                    {offering?.parentOffering?.parentOffering?.displayName}
                    {' | '}
                    {offering?.parentOffering?.displayName}
                  </Text>
                </View>
              </View>
              <IconButtonWrapper
                styling={[styles.bookIcon, { height: 40, alignSelf: 'flex-end' }]}
                iconImage={Images.book}
              />
            </View>
          )}

          <View
            style={[
              styles.filterParentView,
              commonStyles.borderBottom,
              { paddingLeft: RfW(16), backgroundColor: Colors.white },
            ]}>
            <Text style={styles.tutorCountText}>{tutorsData?.searchTutors?.pageInfo?.count} TUTORS</Text>

            <TouchableWithoutFeedback onPress={openCompareTutor}>
              <Text style={{ fontSize: RFValue(17, STANDARD_SCREEN_SIZE), color: Colors.brandBlue2 }}>
                Compare Tutors
              </Text>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => setShowFilterPopup(true)}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: RfW(16),
                  paddingVertical: RfW(10),
                }}>
                <IconButtonWrapper iconHeight={15} iconWidth={15} iconImage={Images.filter} />
                <Text style={styles.filterText}>Sort / Filters</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        {filtersView()}
        <View>
          <FlatList
            data={tutorsData?.searchTutors?.edges}
            showsVerticalScrollIndicator={false}
            extraData={refreshTutorList}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: RfH(16), marginTop: RfH(34), marginBottom: RfH(34) }}
          />
        </View>
      </ScrollView>

      <FilterComponent
        showFilterPopup={showFilterPopup}
        closeFilterComponent={() => setShowFilterPopup(false)}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        filterDataObj={filterObj}
      />

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

export default TutorListing;
