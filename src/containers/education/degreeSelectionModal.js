import { Modal, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import AlphabetListView from 'react-native-section-alphabet-list';
import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Colors, Fonts, Images } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';
import commonStyles from '../../theme/styles';
import { CustomSearchBar, IconButtonWrapper } from '../../components';

const DegreeModal = (props) => {
  const { degree, onSelectingDegree, handleClose, isVisible } = props;
  const [searchText, setSearchText] = useState('');
  const [degreeData, setDegreeData] = useState('');

  useEffect(() => {
    setDegreeData(degree);
  }, []);
  const ListItem = (item) => {
    return (
      <>
        <TouchableOpacity onPress={() => onSelectingDegree(item)}>
          <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(8) }}>
            <Text>{item.value}</Text>
          </View>
        </TouchableOpacity>
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
      <Text>{section.title}</Text>
    </View>
  );

  const updateSearch = (text) => {
    const newData = degree.filter((item) => {
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setDegreeData(newData);
    setSearchText(text);
  };
  return (
    <Modal animationType="fade" transparent visible={isVisible} onRequestClose={handleClose}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            backgroundColor: Colors.white,
            opacity: 1,
            paddingBottom: RfH(34),
            paddingTop: RfH(16),
          }}>
          <View style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(16) }]}>
            <View style={{ height: RfH(54) }} />
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
              Please select a degree
            </Text>
            <IconButtonWrapper
              styling={{ alignSelf: 'flex-end' }}
              iconHeight={RfH(20)}
              iconWidth={RfW(20)}
              iconImage={Images.cross}
              submitFunction={handleClose}
              imageResizeMode="contain"
            />
          </View>

          <CustomSearchBar placeholder="Search..." value={searchText} onChangeText={(search) => updateSearch(search)} />
          {!isEmpty(degreeData) && (
            <AlphabetListView
              style={{ flex: 1 }}
              data={degreeData.map((item) => ({ key: item.id, value: item.name, data: item }))}
              renderItem={ListItem}
              renderSectionHeader={SectionHeader}
              getItemHeight={() => RfH(44)}
              sectionHeaderHeight={RfH(28)}
              indexLetterColor="#007aff"
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default DegreeModal;
