import { Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AlphabetList from 'react-native-section-alphabet-list';
import PropTypes from 'prop-types';
import Flags from './country/flags';
import styles from './style';
import IconButtonWrapper from '../IconWrapper';
import Images from '../../theme/images';
import { RfH, RfW } from '../../utils/helpers';
import CustomSearchBar from '../CustomSearchBar';
import BackArrow from '../BackArrow';

const countryData = require('./country/countries.json').map((item) => ({ ...item, key: item.name, value: item.name }));

function NationalityDropdown(props) {
  const getFlag = (iso2) => Flags.get(iso2);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const { modalVisible, toggleModal, onCountrySelect, modalTitle, showDialcode } = props;
  const [original, setOriginal] = useState([]);

  const updateSearch = (text) => {
    const newData = original.filter((item) => {
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setData(newData);
    setSearchText(text);
  };

  const ListItem = (item) => {
    const countryFlag = getFlag(item.iso2);
    return (
      <>
        {countryFlag && (
          <TouchableOpacity style={styles.itemContainer} onPress={() => onCountrySelect(item)}>
            <IconButtonWrapper iconHeight={20} iconWidth={25} iconImage={countryFlag} />
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              {showDialcode && <Text style={styles.itemText}>{`  (+${item.dialCode})`}</Text>}
            </View>
          </TouchableOpacity>
        )}
      </>
    );
  };

  const SectionHeader = (section) => (
    <View
      style={{
        paddingLeft: 10,
        backgroundColor: '#f1f2f3',
        paddingVertical: 5,
      }}>
      <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
    </View>
  );

  useEffect(() => {
    setData(countryData);
    setOriginal(countryData);
  }, [countryData]);

  return (
    <Modal visible={modalVisible} animationType="fade" onRequestClose={() => toggleModal()} transparent>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <BackArrow action={toggleModal} />
          <Text style={styles.headerText}>{modalTitle}</Text>
        </View>
        <CustomSearchBar placeholder="Search..." value={searchText} onChangeText={(search) => updateSearch(search)} />
        <AlphabetList
          style={{ flex: 1 }}
          data={data}
          renderItem={ListItem}
          renderSectionHeader={SectionHeader}
          getItemHeight={() => RfH(44)}
          sectionHeaderHeight={RfH(28)}
          indexLetterColor="#007aff"
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    </Modal>
  );
}

NationalityDropdown.propTypes = {
  modalVisible: PropTypes.bool,
  toggleModal: PropTypes.func,
  onCountrySelect: PropTypes.func,
  modalTitle: PropTypes.string,
  showDialcode: PropTypes.bool,
};
NationalityDropdown.defaultProps = {
  modalVisible: false,
  toggleModal: null,
  onCountrySelect: null,
  modalTitle: 'Select country',
  showDialcode: true,
};

export default React.memo(NationalityDropdown);
