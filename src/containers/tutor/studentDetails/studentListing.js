import { FlatList, View, Text } from 'react-native';
import React, { useState } from 'react';
import { IconButtonWrapper, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';

function StudentListing() {
  const [students, setStudents] = useState([
    {
      board: 'CBSE',
      class: 'Class 9',
      students: [
        { name: 'Saif Usman Siddqui', board: 'CBSE', subject: 'Physics' },
        { name: 'Riddhi Tiwari', board: 'CBSE', subject: 'English' },
      ],
    },
    {
      board: 'CBSE',
      class: 'Class 8',
      students: [
        { name: 'Sharik Saeed', board: 'CBSE', subject: 'Physics' },
        { name: 'Priya joshi', board: 'CBSE', subject: 'Physics' },
      ],
    },
  ]);

  const renderStudentItem = (item) => {
    return (
      <View style={[commonStyles.horizontalChildrenView, { paddingVertical: RfH(16) }]}>
        <IconButtonWrapper iconWidth={RfW(60)} iconImage={Images.student} iconHeight={RfH(70)} />
        <View style={[commonStyles.verticallyStretchedItemsView, { alignItems: 'flex-start' }]}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>{item.name}</Text>
          <Text style={commonStyles.mediumMutedText}>{item.board}</Text>
          <Text style={commonStyles.mediumMutedText}>{item.subject}</Text>
        </View>
      </View>
    );
  };

  const renderItem = (item) => {
    return (
      <View>
        <View
          style={{
            borderBottomColor: Colors.borderColor,
            borderTopColor: Colors.borderColor,
            borderBottomWidth: 0.5,
            borderTopWidth: 0.5,
            padding: RfH(16),
          }}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
            {item.board} | {item.class}
          </Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={item.students}
          renderItem={({ item }) => renderStudentItem(item)}
          keyExtractor={(index) => index.toString()}
          contentContainerStyle={{ paddingBottom: RfH(34) }}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScreenHeader label="Students" homeIcon />
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={students}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(index) => index.toString()}
          contentContainerStyle={{ paddingBottom: RfH(34) }}
        />
      </View>
    </View>
  );
}

export default StudentListing;
