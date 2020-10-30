/* eslint-disable no-plusplus */
import { FlatList, Modal, ScrollView, StatusBar, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Icon, Thumbnail } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import styles from './styles';
import routeNames from '../../../routes/screenNames';
import { CustomRadioButton, CustomRangeSelector, IconButtonWrapper } from '../../../components';

function TutorListing() {
  const navigation = useNavigation();
  const [isTutor, setIsTutor] = useState(true);

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
    qualification: '',
    experience: '',
    price: '',
    rating: 0,
    sortBy: '',
    studyMode: '',
  });
  const [minFilterValue, setMinFilterValue] = useState('');
  const [maxFilterValue, setMaxFilterValue] = useState('');
  const [filterDataArray, setFilterDataArray] = useState([]);
  const [filterOptions, setFilterOptions] = useState([
    { name: 'Bachelors', checked: true },
    { name: 'Diploma', checked: false },
    { name: 'Masters', checked: false },
    { name: 'Certification', checked: false },
  ]);
  const [filterItems, setFilterItems] = useState([
    { name: 'Qualifications', checked: true },
    { name: 'Experience', checked: false },
    { name: 'Price', checked: false },
    { name: 'Rating', checked: false },
    { name: 'Sort By', checked: false },
    { name: 'Mode of Study', checked: false },
  ]);
  const [tutorData, setTutorData] = useState([
    {
      name: 'Ritesh Jain',
      qualification: 'Commerce Stream',
      imageUrl: Images.kushal,
      experience: 3,
      rating: 4.5,
      charge: '₹ 150/Hr',
    },
    {
      name: 'Simran Rai',
      qualification: 'B.tech',
      imageUrl: Images.user,
      experience: 2,
      rating: 4,
      charge: '₹ 250/Hr',
    },
    {
      name: 'Priyam',
      qualification: 'Mass Communication',
      imageUrl: Images.kushal,
      experience: 5,
      rating: 3,
      charge: '₹ 350/Hr',
    },
    {
      name: 'Ritesh Jain',
      qualification: 'Commerce Stream',
      imageUrl: Images.kushal,
      experience: 3,
      rating: 4.5,
      charge: '₹ 150/Hr',
    },
    {
      name: 'Simran Rai',
      qualification: 'B.tech',
      imageUrl: Images.user,
      experience: 2,
      rating: 4,
      charge: '₹ 250/Hr',
    },
    {
      name: 'Priyam',
      qualification: 'Mass Communication',
      imageUrl: Images.kushal,
      experience: 5,
      rating: 3,
      charge: '₹ 350/Hr',
    },
    {
      name: 'Ritesh Jain',
      qualification: 'Commerce Stream',
      imageUrl: Images.kushal,
      experience: 3,
      rating: 4.5,
      charge: '₹ 150/Hr',
    },
    {
      name: 'Simran Rai',
      qualification: 'B.tech',
      imageUrl: Images.user,
      experience: 2,
      rating: 4,
      charge: '₹ 250/Hr',
    },
    {
      name: 'Priyam',
      qualification: 'Mass Communication',
      imageUrl: Images.kushal,
      experience: 5,
      rating: 3,
      charge: '₹ 350/Hr',
    },
  ]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const renderItem = (item) => {
    return (
      <View style={styles.listItemParent}>
        <View style={[commonStyles.horizontalChildrenStartView]}>
          <View style={styles.userIconParent}>
            <Thumbnail square style={styles.userIcon} source={item.imageUrl} />
          </View>
          <View style={[commonStyles.verticallyStretchedItemsView, { flex: 1, marginLeft: RfW(8) }]}>
            <Text style={styles.tutorName}>{item.name}</Text>
            <Text style={styles.tutorDetails}>{item.qualification}</Text>
            <Text style={styles.tutorDetails}>{item.experience} Years of Experience</Text>
            <View style={styles.iconsView}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: RfH(4) }}>
                <IconButtonWrapper iconHeight={RfH(16)} iconWidth={RfW(18)} iconImage={Images.blue_star} />
                <Text style={styles.chargeText}>{parseFloat(item.rating).toFixed(1)}</Text>
                <IconButtonWrapper
                  iconHeight={RfH(15)}
                  iconWidth={RfW(10)}
                  iconImage={Images.single_user}
                  styling={{ marginLeft: RfW(20) }}
                />
                <IconButtonWrapper
                  iconHeight={RfH(15)}
                  iconWidth={RfW(19)}
                  iconImage={Images.multiple_user}
                  styling={{ marginLeft: RfW(10) }}
                />
                <IconButtonWrapper
                  iconHeight={RfH(17)}
                  iconWidth={RfW(18)}
                  iconImage={Images.user_board}
                  styling={{ marginLeft: RfW(10) }}
                />
              </View>
            </View>
          </View>
          <View>
            <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <Text style={styles.chargeText}>{item.charge}</Text>
              <Text style={styles.chargeText}>{item.charge}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;

    if (scrollPosition > 100) {
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
        filterValues.qualification = filterArr[index].name;
        break;
      case 4:
        filterValues.sortBy = filterArr[index].name;
        break;
      case 5:
        filterValues.studyMode = filterArr[index].name;
        break;
      default:
        filterValues.qualification = '';
        filterValues.experience = '';
        filterValues.price = '';
        filterValues.rating = 0;
        filterValues.sortBy = '';
        filterValues.studyMode = '';
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
          { name: 'Bachelors', checked: true },
          { name: 'Diploma', checked: false },
          { name: 'Masters', checked: false },
          { name: 'Certification', checked: false },
        ];
        setIsRadioViewEnabled(true);
        break;
      case 1:
        setFilterDataArray(['10+', '7+', '3+', '2+', 'Any']);
        setSelectedFilterLabel('Experience');
        setMinFilterValue('');
        setMaxFilterValue('');
        setIsRadioViewEnabled(false);
        break;
      case 2:
        setFilterDataArray(['Maximum cost', 'Minimum cost']);
        setSelectedFilterLabel('₹0 - Any');
        setMinFilterValue('₹ 200');
        setMaxFilterValue('Any');
        setIsRadioViewEnabled(false);
        break;
      case 3:
        setFilterDataArray(['5', '4', '3', '2', 'Any']);
        setSelectedFilterLabel('Any +');
        setMinFilterValue('');
        setMaxFilterValue('Any');
        setIsRadioViewEnabled(false);
        break;
      case 4:
        options = [
          { name: 'Budget- High to Low', checked: true },
          { name: 'Budget- Low to High', checked: false },
          { name: 'Experience', checked: false },
        ];
        setIsRadioViewEnabled(true);
        break;
      case 5:
        options = [
          { name: 'Online', checked: true },
          { name: 'Offline', checked: false },
          { name: 'Any', checked: false },
        ];
        setIsRadioViewEnabled(true);
        break;
      default:
        options = [
          { name: 'Bachelors', checked: true },
          { name: 'Diploma', checked: false },
          { name: 'Masters', checked: false },
          { name: 'Certification', checked: false },
        ];
        setIsRadioViewEnabled(true);
        break;
    }
    setFilterOptions(options);
    setRefreshItemList(!refreshItemList);
    setRefreshList(!refreshList);
  };

  const selectRange = (item, index) => {
    setSelectedFilterBubble(item);
    switch (filterIndex) {
      case 1:
        filterValues.experience = item;
        break;
      case 2:
        filterValues.price = item;
        break;
      case 3:
        filterValues.rating = item;
        break;
      default:
        filterValues.qualification = '';
        filterValues.experience = '';
        filterValues.price = '';
        filterValues.rating = 0;
        filterValues.sortBy = '';
        filterValues.studyMode = '';
        break;
    }
    setFilterValues(filterValues);
  };

  const renderOptionsItem = (item, index) => {
    return (
      <View style={{ paddingLeft: RfW(16), marginTop: RfH(24) }}>
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
  };

  const clearFilters = () => {
    filterValues.qualification = '';
    filterValues.experience = '';
    filterValues.price = '';
    filterValues.rating = 0;
    filterValues.sortBy = '';
    filterValues.studyMode = '';
    setFilterValues(filterValues);

    setIsFilterApplied(false);
  };

  const showFilterModel = () => {
    return (
      <Modal
        animationType="slide"
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
              <View style={{ flex: 0.6 }}>
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
            <View style={styles.filterButttonParent}>
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
        filterValues.qualification = '';
        break;
      case 2:
        filterValues.experience = '';
        break;
      case 3:
        filterValues.price = '';
        break;
      case 4:
        filterValues.rating = 0;
        break;
      case 5:
        filterValues.sortBy = '';
        break;
      case 6:
        filterValues.studyMode = '';
        break;
      default:
        break;
    }
    setFilterValues(filterValues);
    setRefreshList(!refreshList);
  };

  const filtersView = () => {
    return (
      <View
        style={[commonStyles.horizontalChildrenView, { marginTop: RfH(isFilterApplied ? 62 : 16), height: RfH(44) }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: RfW(16) }}>
          {filterValues.qualification ? (
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
          {filterValues.price ? (
            <View style={styles.filterButton}>
              <Text style={styles.appliedFilterText}>{filterValues.price}</Text>
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
          {filterValues.rating ? (
            <View style={styles.filterButton}>
              <Text style={styles.appliedFilterText}>Rating {filterValues.rating}</Text>
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
          {filterValues.studyMode ? (
            <View style={styles.filterButton}>
              <Text style={styles.appliedFilterText}>{filterValues.studyMode}</Text>
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
                // marginTop: RfH(44),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: RfW(16),
              }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Icon
                  onPress={() => onBackPress()}
                  type="MaterialIcons"
                  name="keyboard-backspace"
                  style={[styles.backIcon, { alignSelf: 'flex-start' }]}
                />
                {/* {showBackButton && ( */}
                <View style={{ height: 44, paddingHorizontal: RfW(16) }}>
                  <Text style={[styles.subjectTitle, { fontSize: 17 }]}>English Tutors</Text>
                  <Text style={[styles.classText, { fontSize: 13 }]}>CBSE | Class 9</Text>
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
                marginTop: RfH(44),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: RfW(16),
                backgroundColor: Colors.lightPurple,
              }}>
              <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                <View style={{}}>
                  <Icon
                    onPress={() => onBackPress()}
                    type="MaterialIcons"
                    name="keyboard-backspace"
                    style={[styles.backIcon, { alignSelf: 'flex-start' }]}
                  />
                </View>
                {/* {showBackButton && ( */}
                <View style={{ height: RfH(54), paddingHorizontal: RfW(0) }}>
                  <Text style={[styles.subjectTitle, { fontSize: 20 }]}>English Tutors</Text>
                  <Text style={[styles.classText, { fontSize: 15 }]}>CBSE | Class 9</Text>
                </View>
                {/* )} */}
              </View>

              <IconButtonWrapper styling={[styles.bookIcon, { height: 80 }]} iconImage={Images.book} />
            </View>
          )}

          {/* {!showBackButton && ( */}
          {/*  <View style={{ padding: RfW(16) }}> */}
          {/*    <Text style={[styles.subjectTitle, { fontSize: showBackButton ? 17 : 20 }]}>English Tutors</Text> */}
          {/*    <Text style={styles.classText}>CBSE | Class 9</Text> */}
          {/*  </View> */}
          {/* )} */}

          {/* {showBackButton && ( */}
          <View
            style={[
              styles.filterParentView,
              commonStyles.borderBottom,
              { paddingHorizontal: RfW(16), backgroundColor: Colors.lightGrey },
            ]}>
            <Text style={styles.tutorCountText}>20 TUTORS</Text>

            <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.STUDENT.COMPARE_TUTORS)}>
              <Text style={{ color: Colors.brandBlue2 }}>Compare Tutors</Text>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => setShowFilterPopup(true)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButtonWrapper iconHeight={10} iconWidth={10} iconImage={Images.filter} />
                <Text style={styles.filterText}>Filters</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          {/* )} */}
          {/* </View> */}
        </View>

        {/* <View> */}
        {/*  <View style={{ paddingTop: RfH(0), backgroundColor: Colors.white }}> */}
        {/*    <View style={styles.subjectTitleView}> */}
        {/*      <View style={styles.filterParentView}> */}
        {/*        <Text style={styles.filterText}>20 TUTORS</Text> */}

        {/*        <TouchableWithoutFeedback onPress={() => setShowFilterPopup(true)}> */}
        {/*          <View style={{ flexDirection: 'row', alignItems: 'center' }}> */}
        {/*            <IconButtonWrapper iconHeight={10} iconWidth={10} iconImage={Images.filter} /> */}
        {/*            <Text style={styles.filterText}>Filters</Text> */}
        {/*          </View> */}
        {/*        </TouchableWithoutFeedback> */}
        {/*      </View> */}
        {/*    </View> */}
        {/*  </View> */}
        {/* </View> */}

        <View>{filtersView()}</View>

        <View>
          <FlatList
            data={tutorData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: RfH(16), marginTop: RfH(16), marginBottom: RfH(34) }}
          />
        </View>
      </ScrollView>
      {showFilterModel()}
    </View>
  );
}

export default TutorListing;
