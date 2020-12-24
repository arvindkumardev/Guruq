import { FlatList, Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button } from 'native-base';
import { Colors, Images } from '../../../../../theme';
import styles from '../../styles';
import { RfH, RfW } from '../../../../../utils/helpers';
import { CustomRadioButton, CustomRangeSelector, IconButtonWrapper } from '../../../../../components';
import commonStyles from '../../../../../theme/styles';
import { FILTER_DATA, TEMP_FILTER_DATA } from './constant';

function FilterComponent(props) {
  const { showFilterPopup, closeFilterComponent, applyFilters, clearFilters, filterDataObj } = props;
  const [filterItems, setFilterItems] = useState([...FILTER_DATA]);
  const [selectedFilterItem, setSelectedFilterItem] = useState(FILTER_DATA.find((item) => item.id === 6));
  const [refreshFilterItem, setRefreshFilterItem] = useState(false);
  const [refreshFilterItemData, setRefreshFilterItemData] = useState(false);
  const [tempFilterList, setTempFilterList] = useState();

  useEffect(() => {
    setTempFilterList(filterDataObj);
  }, [showFilterPopup]);

  const handleCloseFilter = () => {
    const actualFilterData = {};
    filterItems.forEach((value) => {
      actualFilterData[value.id] = value.data.find((item) => item.checked);
    });
    setTempFilterList(actualFilterData);
    closeFilterComponent();
  };

  const handleClearFilters = () => {
    setFilterItems([...FILTER_DATA]);
    // setTempFilterList([...TEMP_FILTER_DATA]);
    setSelectedFilterItem(FILTER_DATA.find((item) => item.id === 6));
    clearFilters();
  };

  const handleApplyFilters = () => {
    setFilterItems((filterItems) =>
      filterItems.map((item) => ({
        ...item,
        data: item.data.map((dataItem) => ({ ...dataItem, checked: dataItem.id === tempFilterList[item.id].id })),
      }))
    );
    applyFilters(tempFilterList);
  };

  const setSelectedFilter = (item) => {
    setFilterItems((filterItems) =>
      filterItems.map((filterItem) => ({ ...filterItem, checked: filterItem.id === item.id }))
    );
    setSelectedFilterItem({ ...item, checked: true });
    setRefreshFilterItem((refreshFilterItem) => !refreshFilterItem);
    setRefreshFilterItemData((refreshFilterItemData) => !refreshFilterItemData);
  };

  const setSelectedRadioButton = (filterId, item) => {
    setTempFilterList((tempFilterList) => ({
      ...tempFilterList,
      [filterId]: item,
    }));
  };

  const setRangeFilterValue = (filterId, item) => {
    setTempFilterList((tempFilterList) => ({
      ...tempFilterList,
      [filterId]: item,
    }));
  };

  const renderFilterItem = (item) => (
    <TouchableWithoutFeedback onPress={() => setSelectedFilter(item)}>
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

  const renderOptionsItem = (filterId, item) => (
    <View style={{ paddingLeft: RfW(16), marginTop: RfH(16) }}>
      <View style={{ flexDirection: 'row' }}>
        <CustomRadioButton
          enabled={item.id === tempFilterList[filterId].id}
          submitFunction={() => setSelectedRadioButton(filterId, item)}
        />
        <Text style={{ color: Colors.inputLabel, marginLeft: RfW(8) }}>{item.name}</Text>
      </View>
    </View>
  );

  return (
    <Modal animationType="fade" transparent visible={showFilterPopup} onRequestClose={handleCloseFilter}>
      <View style={styles.filterPopupParentView}>
        <View style={styles.transparentTopView} />
        <View style={styles.bottomViewParent}>
          <View style={styles.popupHeaderView}>
            <Text style={[styles.switchText, { marginLeft: RfW(16) }]}>Filters</Text>
            <IconButtonWrapper
              submitFunction={handleCloseFilter}
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
                extraData={refreshFilterItem}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => renderFilterItem(item, index)}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View style={{ flex: 0.6, paddingBottom: RfH(40) }}>
              {selectedFilterItem.filterType === 'radio' ? (
                <FlatList
                  data={selectedFilterItem.data}
                  extraData={refreshFilterItemData}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => renderOptionsItem(selectedFilterItem.id, item)}
                  keyExtractor={(item, index) => index.toString()}
                />
              ) : (
                <View style={commonStyles.horizontalChildrenCenterView}>
                  <CustomRangeSelector
                    height={RfH(250)}
                    dataValue={selectedFilterItem.data}
                    activeIndex={tempFilterList[selectedFilterItem.id]?.id}
                    label={selectedFilterItem.filterLabel}
                    minValue={selectedFilterItem.minVal}
                    maxValue={selectedFilterItem.maxVal}
                    submitFunction={(item) => setRangeFilterValue(selectedFilterItem.id, item)}
                  />
                </View>
              )}
            </View>
          </View>
          <View style={styles.filterButtonParent}>
            <Button onPress={handleClearFilters} bordered style={styles.borderButton}>
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
            <Button onPress={handleApplyFilters} block style={styles.solidButton}>
              <Text style={[styles.buttonText, { color: Colors.white }]}>Apply</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default FilterComponent;
