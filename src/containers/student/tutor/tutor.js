/* eslint-disable no-plusplus */
import { Text, View, StatusBar, Switch, FlatList, Modal, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Thumbnail, Button } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import commonStyles from '../../../theme/styles';
import { Colors, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';
import styles from './styles';
import { IconButtonWrapper, CustomRadioButton, CustomRangeSelector } from '../../../components';

function Tutor() {
  const [isTutor, setIsTutor] = useState(true);
  const [showBackButton, setShowBackButton] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [refreshItemList, setRefreshItemList] = useState(false);
  const [isRadioViewEnabled, setIsRadioViewEnabled] = useState(true);
  const [selectedFilterBubble, setSelectedFilterBubble] = useState(0);
  const [selectedFilterLabel, setSelectedFilterLabel] = useState('');
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

  const renderItem = (item) => {
    return (
      <View style={styles.listItemParent}>
        <View style={styles.deatilsParent}>
          <View style={styles.userIconParent}>
            <Thumbnail square style={styles.userIcon} source={item.imageUrl} />
          </View>
          <View style={[styles.subjectTitleView, { flex: 0.7 }]}>
            <Text style={styles.tutorName}>{item.name}</Text>
            <Text style={styles.tutorDetails}>{item.qualification}</Text>
            <Text style={styles.tutorDetails}>{item.experience} years of Experience</Text>
            <View style={styles.iconsView}>
              <Text style={styles.chargeText}>{item.rating}</Text>
              <Text style={styles.chargeText}>{item.charge}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;

    if (scrollPosition > 150) {
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
      <TouchableOpacity onPress={() => setItemChecked(item, index)}>
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
      </TouchableOpacity>
    );
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
              <TouchableWithoutFeedback onPress={() => setShowFilterPopup(false)} style={{ paddingRight: RfW(8) }}>
                <IconButtonWrapper iconImage={Images.cross} iconWidth={RfW(24)} iconHeight={RfH(24)} />
              </TouchableWithoutFeedback>
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
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'stretch',
                      justifyContent: 'center',
                    }}>
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
              <Button bordered style={styles.borderButton}>
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
              <Button block style={styles.solidButton}>
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

  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0, padding: 0 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => handleScroll(event)}
        scrollEventThrottle={16}>
        <View style={{}}>
          <View style={[styles.topView, { paddingHorizontal: RfW(16), height: showBackButton ? 60 : 98 }]}>
            {/* <IconButtonWrapper */}
            {/*  iconHeight={RfH(20)} */}
            {/*  iconWidth={RfW(20)} */}
            {/*  styling={styles.backButton} */}
            {/*  iconImage={Images.arrowRight} */}
            {/* /> */}
            <View>
              <Text style={[styles.subjectTitle, { fontSize: showBackButton ? 17 : 20 }]}>English Tutors</Text>
              <Text style={styles.classText}>CBSE | Class 9</Text>
            </View>
            <IconButtonWrapper
              styling={[styles.bookIcon, { height: showBackButton ? 40 : 80 }]}
              iconImage={Images.book}
            />
          </View>

          {showBackButton && (
            <View style={[styles.filterParentView, { marginTop: 0, backgroundColor: Colors.white }]}>
              <Text style={styles.filterText}>20 TUTORS</Text>
              <TouchableOpacity onPress={() => setShowFilterPopup(true)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IconButtonWrapper iconHeight={10} iconWidth={10} iconImage={Images.filter} />
                  <Text style={styles.filterText}>Filters</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View>
          <View style={{ paddingTop: RfH(0), backgroundColor: Colors.white }}>
            <View style={styles.subjectTitleView}>
              {/* <View */}
              {/*  style={{ */}
              {/*    flexDirection: 'row', */}
              {/*    justifyContent: 'flex-start', */}
              {/*    alignItems: 'center', */}
              {/*  }}> */}
              {/*  /!*{showBackButton && (*!/ */}
              {/*  /!*  <IconButtonWrapper*!/ */}
              {/*  /!*    iconHeight={RfH(20)}*!/ */}
              {/*  /!*    iconWidth={RfW(20)}*!/ */}
              {/*  /!*    styling={[styles.backButton, { marginLeft: RfW(16), marginTop: RfH(4) }]}*!/ */}
              {/*  /!*    iconImage={Images.arrowRight}*!/ */}
              {/*  /!*  />*!/ */}
              {/*  /!*)}*!/ */}
              {/*  <View> */}
              {/*    <Text style={styles.subjectTitle}>English Tutors</Text> */}
              {/*    <Text style={styles.classText}>CBSE | Class 9</Text> */}
              {/*  </View> */}
              {/* </View> */}
              <View style={styles.filterParentView}>
                <Text style={styles.filterText}>20 TUTORS</Text>
                {/*<View style={styles.switchView}>*/}
                {/*  <Text style={styles.switchText}>TUTORS</Text>*/}
                {/*  <Switch onValueChange={() => setIsTutor(!isTutor)} value={isTutor} />*/}
                {/*  <Text style={styles.switchText}>INSTITUTES</Text>*/}
                {/*</View>*/}

                <TouchableOpacity onPress={() => setShowFilterPopup(true)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButtonWrapper iconHeight={10} iconWidth={10} iconImage={Images.filter} />
                    <Text style={styles.filterText}>Filters</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View>
          <FlatList
            data={tutorData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: RfH(16) }}
          />
        </View>
      </ScrollView>
      {showFilterModel()}
    </View>
  );
}

export default Tutor;
