import { FlatList, Text, View } from 'react-native';
import React, { useState } from 'react';
import commonStyles from '../../theme/styles';
import { IconButtonWrapper, ScreenHeader } from '../../components';
import { Colors, Fonts, Images } from '../../theme';
import { RfH, RfW } from '../../utils/helpers';

function DocumentListing() {
  const [list, setList] = useState([
    { icon: Images.jpg, docName: 'Pan card', size: '0.2 KB', date: '9/9/19' },
    { icon: Images.png, docName: 'ITR- rez', size: '0.3 KB', date: '3/9/19' },
    { icon: Images.pdf, docName: 'Aadhar Card', size: '0.9 KB', date: '5/9/19' },
    { icon: Images.jpg, docName: 'Pan card', size: '0.2 KB', date: '9/9/19' },
    { icon: Images.png, docName: 'ITR- rez', size: '0.3 KB', date: '3/9/19' },
    { icon: Images.pdf, docName: 'Aadhar Card', size: '0.9 KB', date: '5/9/19' },
    { icon: Images.jpg, docName: 'Pan card', size: '0.2 KB', date: '9/9/19' },
    { icon: Images.png, docName: 'ITR- rez', size: '0.3 KB', date: '3/9/19' },
    { icon: Images.pdf, docName: 'Aadhar Card', size: '0.9 KB', date: '5/9/19' },
    { icon: Images.jpg, docName: 'Pan card', size: '0.2 KB', date: '9/9/19' },
    { icon: Images.png, docName: 'ITR- rez', size: '0.3 KB', date: '3/9/19' },
    { icon: Images.pdf, docName: 'Aadhar Card', size: '0.9 KB', date: '5/9/19' },
  ]);

  const renderItem = (item) => {
    return (
      <View>
        <View style={[commonStyles.horizontalChildrenView, { padding: RfH(16) }]}>
          <IconButtonWrapper iconHeight={RfH(32)} iconWidth={RfW(32)} iconImage={item.icon} />
          <View style={[commonStyles.verticallyStretchedItemsView, { flex: 1, marginLeft: RfW(8) }]}>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>{item.docName}</Text>
            <Text style={commonStyles.mediumMutedText}>{item.size}</Text>
          </View>
          <Text style={commonStyles.mediumMutedText}>{item.date}</Text>
        </View>
        <View style={commonStyles.lineSeparatorWithHorizontalMargin} />
      </View>
    );
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, flex: 1, paddingHorizontal: 0 }]}>
      <ScreenHeader
        label="Documents"
        homeIcon
        horizontalPadding={RfW(16)}
        showRightIcon
        rightIcon={Images.searchIcon}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={({ item, index }) => renderItem(item, index)}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

export default DocumentListing;
