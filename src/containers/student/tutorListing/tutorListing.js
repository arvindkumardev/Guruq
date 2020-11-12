/* eslint-disable no-plusplus */
import { FlatList, Modal, ScrollView, StatusBar, Text, TouchableWithoutFeedback, View, Animated } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Button, Icon, Thumbnail } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useLazyQuery } from '@apollo/client';
import { RFValue } from 'react-native-responsive-fontsize';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW, titleCaseIfExists } from '../../../utils/helpers';
import styles from './styles';
import routeNames from '../../../routes/screenNames';
import { CustomRadioButton, CustomRangeSelector, IconButtonWrapper } from '../../../components';
import { SEARCH_TUTORS } from '../tutor-query';
import Loader from '../../../components/Loader';
import Fonts from '../../../theme/fonts';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';

function TutorListing(props) {
  const navigation = useNavigation();
  const [isTutor, setIsTutor] = useState(true);

  const { route } = props;

  const offering = route?.params?.offering;

  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const [showBackButton, setShowBackButton] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [refreshItemList, setRefreshItemList] = useState(false);
  const [isRadioViewEnabled, setIsRadioViewEnabled] = useState(true);
  const [selectedFilterBubble, setSelectedFilterBubble] = useState(0);
  const [filterIndex, setFilterIndex] = useState(0);
  const [selectedFilterLabel, setSelectedFilterLabel] = useState('');
  const [filterValues, setFilterValues] = useState({
    certified: true,
    offeringId: offering?.id,

    degreeLevel: 0,

    experience: 0,
    // maxExperience: 0,

    averageRating: 0,

    minBudget: 0,
    maxBudget: 0,

    teachingMode: 0,

    page: 1,
    size: 20,
    sortBy: 'teachingExperience',
    sortOrder: 'desc',

    active: true,
    // qualification: '',
    // experience: '',
    // price: '',
    // rating: 0,
    // sortBy: '',
    // studyMode: '',
  });
  const [minFilterValue, setMinFilterValue] = useState('');
  const [maxFilterValue, setMaxFilterValue] = useState('');
  const [filterDataArray, setFilterDataArray] = useState([]);
  const [filterOptions, setFilterOptions] = useState([
    { name: 'Experience', checked: true, value: 'teachingExperience' },
    { name: 'Budget - High to Low', checked: false, value: 'budgets.price', order: 'DESC' },
    { name: 'Budget - Low to High', checked: false, value: 'budgets.price', order: 'ASC' },
  ]);
  const [tutorsData, setTutorsData] = useState([]);

  const [filterItems, setFilterItems] = useState([
    { name: 'Qualifications', checked: false },
    { name: 'Experience', checked: false },
    { name: 'Price', checked: false },
    { name: 'Rating', checked: false },
    { name: 'Mode of Class', checked: false },
    { name: 'Sort By', checked: true },
  ]);

  // const { loading: loadingTutors, error: errorTutors, data: tutorsData } = useQuery(SEARCH_TUTORS, {
  //   variables: {
  //     searchDto: filterValues,
  //   },
  // });

  const [getTutors, { loading: loadingTutors }] = useLazyQuery(SEARCH_TUTORS, {
    onError: (e) => {
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

  useEffect(() => {
    getTutors({
      variables: { searchDto: filterValues },
    });
  }, []);

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

  const renderItem = (item) => {
    const onlineBudget = item.tutorOfferings && item.tutorOfferings[0].budgets.find((s) => s.onlineClass === true);
    const offlineBudget = item.tutorOfferings && item.tutorOfferings[0].budgets.find((s) => s.onlineClass === false);

    return (
      <View style={styles.listItemParent}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.STUDENT.TUTOR_DETAILS)}>
          <View style={[commonStyles.horizontalChildrenStartView]}>
            <View style={styles.userIconParent}>
              <View
                style={{
                  // padding: RfW(8),
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 100,
                  height: RfW(28),
                  width: RfW(28),
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  borderRadius: RfW(24),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  type="FontAwesome"
                  name="heart"
                  style={{
                    fontSize: 15,
                    color: item.id % 7 !== 0 ? Colors.darkGrey : Colors.orangeRed,
                  }}
                />
              </View>
              <Thumbnail square style={styles.userIcon} source={getTutorImage(item)} />

              {item.id % 7 === 0 && (
                <View
                  style={{
                    // padding: RfW(8),
                    position: 'absolute',
                    bottom: -5,
                    left: 0,
                    zIndex: 100,
                    borderRadius: RfW(20),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // width: RfW(60),
                    marginHorizontal: RfW(8),
                  }}>
                  <View
                    style={{
                      backgroundColor: Colors.orange,

                      borderRadius: RfW(2),
                      // alignSelf: 'center',
                      // justifySelf:"center",
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
                    <Text style={styles.tutorDetails}>
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
                        marginTop: RfH(4),
                      }}>
                      <Icon
                        type="FontAwesome"
                        name="star"
                        style={{ fontSize: 15, marginRight: RfW(4), color: Colors.brandBlue2 }}
                      />
                      <Text style={styles.chargeText}>{parseFloat(item.averageRating).toFixed(1)}</Text>

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {onlineBudget && (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginLeft: RfW(16),
                            }}>
                            <Icon
                              type="FontAwesome"
                              name="tv"
                              style={{
                                fontSize: 13,
                                marginRight: RfW(4),
                                color: Colors.darkGrey,
                              }}
                            />
                            <Text style={styles.chargeText}>₹ {onlineBudget.price}/Hr</Text>
                          </View>
                        )}
                        {offlineBudget && (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginLeft: RfW(16),
                            }}>
                            <Icon
                              type="FontAwesome"
                              name="home"
                              style={{
                                fontSize: 13,
                                marginRight: RfW(4),
                                color: Colors.darkGrey,
                              }}
                            />
                            <Text style={styles.chargeText}>₹ {offlineBudget.price}/Hr</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignSelf: 'flex-start',
                  }}>
                  <View style={{ alignSelf: 'flex-end', marginBottom: RfH(17) }}>
                    <Icon
                      type="FontAwesome"
                      name="thumbs-up"
                      style={{ fontSize: 13, marginRight: RfW(4), color: Colors.darkGrey }}
                    />
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <IconButtonWrapper
                      iconHeight={RfH(14)}
                      iconWidth={RfW(14)}
                      iconImage={Images.single_user}
                      styling={{ marginLeft: RfW(20) }}
                    />
                    <IconButtonWrapper
                      iconHeight={RfH(16)}
                      iconWidth={RfW(16)}
                      iconImage={Images.multiple_user}
                      styling={{ marginLeft: RfW(10) }}
                    />
                    <IconButtonWrapper
                      iconHeight={RfH(16)}
                      iconWidth={RfW(16)}
                      iconImage={Images.user_board}
                      styling={{ marginLeft: RfW(10) }}
                    />
                  </View>
                </View>
              </View>

              <View style={{ marginHorizontal: RfW(8), marginTop: RfH(8) }}>
                <View style={commonStyles.lineSeparator} />
                <Text style={{ fontSize: 13, color: Colors.secondaryText }}>Free Demo Class</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;

    if (scrollPosition > 30) {
      setShowBackButton(true);
    } else {
      setShowBackButton(false);
    }
  };

  const setChecked = (item, index) => {
    const filterArr = filterOptions;
    for (let i = 0; i < filterArr.length; i++) {
      filterArr[i].checked = false;
    }
    filterArr[index].checked = !filterArr[index].checked;
    switch (filterIndex) {
      case 0:
        // filterValues.qualification = filterArr[index].name;
        filterValues.degreeLevel = item.value;
        break;
      case 2:
        // filterValues.price = item.name;
        filterValues.maxBudget = item.value.max;
        filterValues.minBudget = item.value.min;
        break;
      case 4:
        filterValues.sortBy = item.name;
        break;
      case 5:
        filterValues.teachingMode = item.value;
        break;
      default:
        // filterValues.qualification = '';
        filterValues.experience = '';
        // filterValues.price = '';
        filterValues.averageRating = 0;
        filterValues.sortBy = '';
        filterValues.teachingMode = '';
        break;
    }
    setFilterValues(filterValues);
    setFilterOptions(filterArr);
    setRefreshList(!refreshList);
  };

  const setItemChecked = (item, index) => {
    const filterArr = filterItems;
    for (let i = 0; i < filterArr.length; i++) {
      filterArr[i].checked = false;
    }
    filterArr[index].checked = !filterArr[index].checked;
    setFilterItems(filterArr);
    let options = [];
    setFilterIndex(index);
    switch (index) {
      case 0:
        options = [
          { name: 'All Qualifications', checked: true, value: 0 },
          { name: 'Secondary', checked: false, value: 1 },
          { name: 'Higher Secondary', checked: false, value: 2 },
          { name: 'Diploma', checked: false, value: 3 },
          { name: 'Bachelors', checked: false, value: 4 },
          { name: 'PG Diploma', checked: false, value: 5 },
          { name: 'Masters', checked: false, value: 6 },
          { name: 'Doctoral', checked: false, value: 7 },
          { name: 'Other', checked: false, value: 8 },
        ];
        setIsRadioViewEnabled(true);
        break;
      case 1:
        setFilterDataArray([
          { name: '10+', value: 10 },
          { name: '7+', value: 7 },
          { name: '3+', value: 3 },
          { name: '2+', value: 2 },
          { name: 'Any', value: 0 },
        ]);
        setSelectedFilterLabel('Experience');
        setMinFilterValue('Any');
        setMaxFilterValue('10');
        setIsRadioViewEnabled(false);
        break;
      case 2:
        options = [
          { name: 'All Prices', checked: true, value: { min: 0, max: 0 } },
          { name: 'Under ₹250', checked: false, value: { min: 0, max: 250 } },
          { name: '₹250 - ₹500', checked: false, value: { min: 250, max: 500 } },
          { name: '₹500 - ₹750', checked: false, value: { min: 500, max: 750 } },
          { name: '₹750 - ₹1000', checked: false, value: { min: 750, max: 1000 } },
          { name: '₹1000 - ₹1500', checked: false, value: { min: 1000, max: 1500 } },
          { name: '₹1500 - ₹2000', checked: false, value: { min: 1500, max: 2000 } },
          { name: 'Over ₹2000', checked: false, value: { min: 2000, max: 10000 } },
        ];
        setIsRadioViewEnabled(true);
        // setFilterDataArray(['Maximum cost', 'Minimum cost']);
        // setSelectedFilterLabel('₹0 - Any');
        // setMinFilterValue('₹ 200');
        // setMaxFilterValue('Any');
        // setIsRadioViewEnabled(false);
        break;
      case 3:
        setFilterDataArray([
          { name: '5', value: 5 },
          { name: '4', value: 4 },
          { name: '3', value: 3 },
          { name: '2', value: 2 },
          { name: 'Any', value: 0 },
        ]);
        setSelectedFilterLabel('Any +');
        setMinFilterValue('Any');
        setMaxFilterValue('5');
        setIsRadioViewEnabled(false);
        break;
      case 4:
        options = [
          { name: 'Experience', checked: true, value: 'teachingExperience' },
          { name: 'Budget - High to Low', checked: false, value: 'budgets.price', order: 'DESC' },
          { name: 'Budget - Low to High', checked: false, value: 'budgets.price', order: 'ASC' },
        ];
        setIsRadioViewEnabled(true);
        break;
      case 5:
        options = [
          { name: 'Any', checked: true, value: 0 },
          { name: 'Online', checked: false, value: 1 },
          { name: 'Offline', checked: false, value: 2 },
        ];
        setIsRadioViewEnabled(true);
        break;
      default:
        options = [
          { name: 'All Qualifications', checked: false, value: 0 },
          { name: 'Secondary', checked: false, value: 1 },
          { name: 'Higher Secondary', checked: false, value: 2 },
          { name: 'Diploma', checked: false, value: 3 },
          { name: 'Bachelors', checked: false, value: 4 },
          { name: 'PG Diploma', checked: false, value: 5 },
          { name: 'Masters', checked: false, value: 6 },
          { name: 'Doctoral', checked: false, value: 7 },
          { name: 'Other', checked: false, value: 8 },
        ];
        setIsRadioViewEnabled(true);
        break;
    }
    setFilterOptions(options);
    setRefreshItemList(!refreshItemList);
    setRefreshList(!refreshList);
  };

  const selectRange = (item, index) => {
    setSelectedFilterBubble(item.value);
    switch (filterIndex) {
      case 1:
        filterValues.experience = item.value;
        break;
      case 3:
        filterValues.averageRating = item.value;
        break;
      default:
        // filterValues.qualification = '';
        filterValues.experience = '';
        // filterValues.price = '';
        filterValues.averageRating = 0;
        filterValues.sortBy = '';
        // filterValues.studyMode = '';
        break;
    }
    setFilterValues(filterValues);
  };

  const renderOptionsItem = (item, index) => {
    return (
      <View style={{ paddingLeft: RfW(16), marginTop: RfH(16) }}>
        <View style={{ flexDirection: 'row' }}>
          <CustomRadioButton enabled={item.checked} submitFunction={() => setChecked(item, index)} />
          <Text style={{ color: Colors.inputLabel, marginLeft: RfW(8) }}>{item.name}</Text>
        </View>
      </View>
    );
  };

  const renderFilterItem = (item, index) => {
    return (
      <TouchableWithoutFeedback onPress={() => setItemChecked(item, index)}>
        <View style={item.checked ? styles.activeFilterItem : styles.disableFilterItem}>
          <View
            style={
              item.checked
                ? [styles.indicatorView, { backgroundColor: Colors.brandBlue2 }]
                : [styles.indicatorView, { backgroundColor: Colors.lightGrey }]
            }
          />
          <Text
            style={
              item.checked
                ? { color: Colors.brandBlue2, paddingLeft: RfW(16) }
                : { color: Colors.black, paddingLeft: RfW(16) }
            }>
            {item.name}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const applyFilters = () => {
    setShowFilterPopup(false);
    setIsFilterApplied(true);
    getTutors({
      variables: { searchDto: filterValues },
    });
    setRefreshList(!refreshList);
  };

  const clearFilters = () => {
    filterValues.qualification = '';
    filterValues.experience = '';
    filterValues.price = '';
    filterValues.averageRating = 0;
    filterValues.sortBy = '';
    filterValues.teachingMode = '';
    setFilterValues(filterValues);

    setIsFilterApplied(false);
  };

  const showFilterModel = () => {
    return (
      <Modal
        animationType="fade"
        transparent
        visible={showFilterPopup}
        onRequestClose={() => {
          setShowFilterPopup(false);
        }}>
        <View style={styles.filterPopupParentView}>
          <View style={styles.transparentTopView} />
          <View style={styles.bottomViewParent}>
            <View style={styles.popupHeaderView}>
              <Text style={[styles.switchText, { marginLeft: RfW(16) }]}>Filters</Text>
              <IconButtonWrapper
                submitFunction={() => setShowFilterPopup(false)}
                iconImage={Images.cross}
                iconWidth={RfW(24)}
                iconHeight={RfH(24)}
                styling={{ marginRight: RfW(8) }}
              />
            </View>
            <View style={styles.filterContentView}>
              <View style={styles.filterItemView}>
                <FlatList
                  data={filterItems}
                  extraData={refreshItemList}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => renderFilterItem(item, index)}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
              <View style={{ flex: 0.6, paddingBottom: RfH(40) }}>
                {isRadioViewEnabled ? (
                  <FlatList
                    data={filterOptions}
                    extraData={refreshList}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => renderOptionsItem(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                  />
                ) : (
                  <View style={commonStyles.horizontalChildrenCenterView}>
                    <CustomRangeSelector
                      height={RfH(250)}
                      dataValue={filterDataArray}
                      activeIndex={selectedFilterBubble}
                      label={selectedFilterLabel}
                      minValue={minFilterValue}
                      maxValue={maxFilterValue}
                      submitFunction={(item, index) => selectRange(item, index)}
                    />
                  </View>
                )}
              </View>
            </View>
            <View style={styles.filterButtonParent}>
              <Button onPress={() => clearFilters()} bordered style={styles.borderButton}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: Colors.brandBlue2,
                    },
                  ]}>
                  Clear All
                </Text>
              </Button>
              <Button onPress={() => applyFilters()} block style={styles.solidButton}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: Colors.white,
                    },
                  ]}>
                  Apply
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const removeFilter = (filter) => {
    switch (filter) {
      case 1:
        filterValues.degreeLevel = 0;
        break;
      case 2:
        filterValues.experience = 0;
        break;
      case 3:
        filterValues.maxBudget = 0;
        filterValues.minBudget = 0;
        break;
      case 4:
        filterValues.averageRating = 0;
        break;
      case 5:
        filterValues.sortBy = '';
        break;
      case 6:
        filterValues.teachingMode = 0;
        break;
      default:
        break;
    }
    setFilterValues(filterValues);
    getTutors({
      variables: { searchDto: filterValues },
    });
    setRefreshList(!refreshList);
  };

  const filtersView = () => {
    return (
      <View
        style={[
          commonStyles.horizontalChildrenView,
          {
            marginTop: RfH(isFilterApplied ? 100 : 16),
            height: RfH(44),
          },
        ]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: RfW(16) }}>
          {filterValues.degreeLevel ? (
            <View style={styles.filterButton}>
              <Text style={styles.appliedFilterText}>{filterValues.qualification}</Text>
              <IconButtonWrapper
                iconWidth={RfW(16)}
                iconHeight={RfH(16)}
                iconImage={Images.blue_cross}
                styling={{ marginLeft: RfW(12) }}
                submitFunction={() => removeFilter(1)}
              />
            </View>
          ) : (
            <View />
          )}
          {filterValues.experience ? (
            <View style={styles.filterButton}>
              <Text style={styles.appliedFilterText}>{filterValues.experience} years</Text>
              <IconButtonWrapper
                iconWidth={RfW(15)}
                iconHeight={RfH(15)}
                iconImage={Images.blue_cross}
                styling={{ marginLeft: RfW(12) }}
                submitFunction={() => removeFilter(2)}
              />
            </View>
          ) : (
            <View />
          )}
          {filterValues.minBudget ? (
            <View style={styles.filterButton}>
              <Text style={styles.appliedFilterText}>
                {filterValues.minBudget} - {filterValues.maxBudget}
              </Text>
              <IconButtonWrapper
                iconWidth={RfW(15)}
                iconHeight={RfH(15)}
                iconImage={Images.blue_cross}
                styling={{ marginLeft: RfW(12) }}
                submitFunction={() => removeFilter(3)}
              />
            </View>
          ) : (
            <View />
          )}
          {filterValues.averageRating ? (
            <View style={styles.filterButton}>
              <Text style={styles.appliedFilterText}>Rating {filterValues.averageRating}</Text>
              <IconButtonWrapper
                iconWidth={RfW(15)}
                iconHeight={RfH(15)}
                iconImage={Images.blue_cross}
                styling={{ marginLeft: RfW(12) }}
                submitFunction={() => removeFilter(4)}
              />
            </View>
          ) : (
            <View />
          )}
          {filterValues.sortBy ? (
            <View style={styles.filterButton}>
              <Text style={styles.appliedFilterText}>{filterValues.sortBy}</Text>
              <IconButtonWrapper
                iconWidth={RfW(15)}
                iconHeight={RfH(15)}
                iconImage={Images.blue_cross}
                styling={{ marginLeft: RfW(12) }}
                submitFunction={() => removeFilter(5)}
              />
            </View>
          ) : (
            <View />
          )}
          {filterValues.teachingMode ? (
            <View style={styles.filterButton}>
              <Text style={styles.appliedFilterText}>
                {filterValues.teachingMode === 0 ? 'Any' : filterValues.teachingMode === 1 ? 'Online' : 'Offline'}
              </Text>
              <IconButtonWrapper
                iconWidth={RfW(15)}
                iconHeight={RfH(15)}
                iconImage={Images.blue_cross}
                styling={{ marginLeft: RfW(12) }}
                submitFunction={() => removeFilter(6)}
              />
            </View>
          ) : (
            <View />
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0, padding: 0 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <Loader isLoading={loadingTutors} />
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => handleScroll(event)}
        scrollEventThrottle={16}>
        {/* <View> */}
        <View style={[styles.topView, { paddingTop: RfH(44) }]}>
          {showBackButton && (
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
                <IconButtonWrapper
                  styling={{ marginRight: RfW(16) }}
                  iconImage={Images.backArrow}
                  iconHeight={RfH(20)}
                  iconWidth={RfW(20)}
                  submitFunction={() => onBackPress()}
                />
                {/* {showBackButton && ( */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.subjectTitle, { fontSize: RFValue(17, STANDARD_SCREEN_SIZE) }]}>
                    {offering?.displayName} Tutors
                  </Text>
                  <Text style={[styles.classText, { fontSize: RFValue(15, STANDARD_SCREEN_SIZE), marginLeft: RfW(8) }]}>
                    {offering?.parentOffering?.parentOffering?.displayName}
                    {' | '}
                    {offering?.parentOffering?.displayName}
                  </Text>
                </View>
                {/* )} */}
              </View>
              <IconButtonWrapper styling={[styles.bookIcon, { height: 40 }]} iconImage={Images.book} />
            </View>
          )}

          {!showBackButton && (
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
                  <IconButtonWrapper
                    styling={{ marginRight: RfW(16) }}
                    iconImage={Images.backArrow}
                    iconHeight={RfH(20)}
                    iconWidth={RfW(20)}
                    submitFunction={() => onBackPress()}
                  />
                </View>
                {/* {showBackButton && ( */}
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
                {/* )} */}
              </View>

              <IconButtonWrapper styling={[styles.bookIcon, { height: 80 }]} iconImage={Images.book} />
            </View>
          )}

          <View
            style={[
              styles.filterParentView,
              commonStyles.borderBottom,
              { paddingLeft: RfW(16), backgroundColor: Colors.white },
            ]}>
            <Text style={styles.tutorCountText}>{tutorsData?.searchTutors?.pageInfo?.count} TUTORS</Text>

            <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.STUDENT.COMPARE_TUTORS)}>
              <Text style={{ fontSize: RFValue(17, STANDARD_SCREEN_SIZE), color: Colors.brandBlue2 }}>Compare Tutors</Text>
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

        <View>{filtersView()}</View>

        <View>
          <FlatList
            data={tutorsData?.searchTutors?.edges}
            showsVerticalScrollIndicator={false}
            extraData={refreshList}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: RfH(16), marginTop: RfH(34), marginBottom: RfH(34) }}
          />
        </View>
      </ScrollView>
      {showFilterModel()}
    </View>
  );
}

export default TutorListing;
