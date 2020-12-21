/* eslint-disable no-plusplus */
import {
  Alert,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLazyQuery, useMutation } from '@apollo/client';
import { RFValue } from 'react-native-responsive-fontsize';
import { isEmpty } from 'lodash';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { getSaveData, getSubjectIcons, removeData, RfH, RfW, storeData } from '../../../utils/helpers';
import styles from './styles';
import { CompareModal, IconButtonWrapper } from '../../../components';
import { GET_FAVOURITE_TUTORS, SEARCH_TUTORS } from '../tutor-query';
import Loader from '../../../components/Loader';
import { LOCAL_STORAGE_DATA_KEY, STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { MARK_FAVOURITE, REMOVE_FAVOURITE } from '../tutor-mutation';
import BackArrow from '../../../components/BackArrow';
import FilterComponent from './components/filterComponent';
import { TEMP_FILTER_DATA } from './components/filterComponent/constant';
import TutorListCard from './components/TutorListCard';

function TutorListing(props) {
  const navigation = useNavigation();
  const { route } = props;
  const offering = route?.params?.offering;
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [topHeaderSticky, setTopHeaderSticky] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [appendData, setAppendData] = useState(false);
  const [tutorList, setTutorList] = useState([]);
  const [loadMoreButton, setLoadMoreButton] = useState(true);

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
    size: 50,
    sortBy: 'teachingExperience',
    sortOrder: 'desc',
    active: true,
  });

  const [filterObj, setFilterObj] = useState({ ...TEMP_FILTER_DATA });
  const [refreshTutorList, setRefreshTutorList] = useState(false);
  const [tutorsData, setTutorsData] = useState([]);
  const [favourites, setFavourites] = useState([]);

  const openCompareTutor = async () => {
    if (JSON.parse(await getSaveData(LOCAL_STORAGE_DATA_KEY.COMPARE_TUTOR_ID)) == null) {
      Alert.alert('Add tutors before compare');
    } else {
      setShowCompareModal(true);
    }
  };

  const [getTutors, { loading: loadingTutors }] = useLazyQuery(SEARCH_TUTORS, {
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setTutorsData(data);
        const tutors = data?.searchTutors?.edges;
        setLoadMoreButton(tutors.length > 0);
        setTutorList((tutorList) => (appendData ? [...tutorList, ...tutors] : tutors));
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
        setFavourites(!isEmpty(data?.getFavouriteTutors) ? data.getFavouriteTutors.map((item) => item?.tutor?.id) : []);
      }
    },
  });

  useEffect(() => {
    getTutors({ variables: { searchDto: filterValues } });
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
        setFavourites((favourites) => [...favourites, data.markFavourite.tutor.id]);
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

  const onBackPress = () => {
    navigation.goBack();
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
      getTutors({ variables: { searchDto: filterValues } });
    }
  }, [filterValues]);

  const setFilterValuesHandle = (data) => {
    let actualFilterData = {};
    setAppendData(false);
    Object.entries(data).forEach(([key, value]) => {
      actualFilterData = { ...actualFilterData, ...value.filterData };
    });
    setFilterValues((filterValues) => ({ ...filterValues, ...actualFilterData, page: 1 }));
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

  const loadMore = () => {
    setAppendData(true);
    setFilterValues((filterValues) => ({ ...filterValues, page: filterValues.page + 1 }));
  };

  const filtersView = () => (
    <View
      style={[commonStyles.horizontalChildrenView, { marginTop: RfH(isFilterApplied ? 100 : 16), height: RfH(44) }]}>
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
        <View style={styles.topView}>
          {topHeaderSticky && (
            <View style={styles.headerComponent}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <BackArrow action={onBackPress} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.subjectTitle, { fontSize: RFValue(17, STANDARD_SCREEN_SIZE) }]}>
                    {offering?.displayName} Tutors
                  </Text>
                  <Text style={[styles.classText, { marginLeft: RfW(8) }]}>
                    {offering?.parentOffering?.parentOffering?.displayName}
                    {' | '}
                    {offering?.parentOffering?.displayName}
                  </Text>
                </View>
              </View>
              <IconButtonWrapper styling={styles.bookIcon} iconImage={getSubjectIcons(offering?.displayName)} />
            </View>
          )}
          {!topHeaderSticky && (
            <View style={styles.stickyHeader}>
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
                styling={[styles.bookIcon, { alignSelf: 'flex-end' }]}
                iconImage={getSubjectIcons(offering?.displayName)}
              />
            </View>
          )}

          <View style={styles.filterParentView}>
            <Text style={styles.tutorCountText}>{tutorsData?.searchTutors?.pageInfo?.count} TUTORS</Text>
            <TouchableWithoutFeedback onPress={openCompareTutor}>
              <Text style={{ fontSize: RFValue(17, STANDARD_SCREEN_SIZE), color: Colors.brandBlue2 }}>
                Compare Tutors
              </Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setShowFilterPopup(true)}>
              <View style={styles.filterContainer}>
                <IconButtonWrapper iconHeight={15} iconWidth={15} iconImage={Images.filter} />
                <Text style={styles.filterText}>Sort / Filters</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        {filtersView()}
        <FlatList
          data={tutorList}
          showsVerticalScrollIndicator={false}
          extraData={refreshTutorList}
          renderItem={({ item }) => (
            <TutorListCard
              tutor={item}
              offering={offering}
              isFavourite={favourites.includes(item.id)}
              markFavouriteTutor={() => markFavouriteTutor(item.id)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.tutorListContainer}
          ListFooterComponent={
            <>
              {loadMoreButton && !isEmpty(tutorList) && (
                <TouchableOpacity style={styles.footerLoadMore} onPress={loadMore}>
                  <Text> Load More</Text>
                </TouchableOpacity>
              )}
            </>
          }
        />
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
