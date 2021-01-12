import { FlatList, View, Text, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { IconButtonWrapper, ScreenHeader, UserReviews } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts, Images } from '../../../theme';
import { RfH, RfW } from '../../../utils/helpers';

function StudentDetails() {
  const [students, setStudents] = useState([
    {
      date: 'September 15',
      students: [{ name: 'Riddhi Tiwari', board: 'CBSE', subject: 'English' }],
    },
    {
      date: 'September 13',
      students: [
        { name: 'Sharik Saeed', board: 'CBSE', subject: 'Physics' },
        { name: 'Priya joshi', board: 'CBSE', subject: 'Physics' },
      ],
    },
  ]);

  const renderStudentItem = (item) => {
    return (
      <View
        style={[
          commonStyles.horizontalChildrenView,
          { paddingVertical: RfH(16), borderBottomWidth: 0.5, borderBottomColor: Colors.borderColor },
        ]}>
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
        <View style={{ padding: RfH(16) }}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>{item.date}</Text>
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScreenHeader
          homeIcon
          horizontalPadding={RfW(16)}
          lineVisible={false}
          style={{ backgroundColor: Colors.lightGrey }}
        />
        <View style={{ height: RfH(102), backgroundColor: Colors.lightGrey }} />
        <View style={{ alignItems: 'center', marginBottom: RfH(16) }}>
          <Image source={Images.student} style={{ height: RfH(128), width: RfW(120), marginTop: RfH(-102) }} />
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold, marginTop: RfH(12) }]}>
            Saif Usman Siddqui
          </Text>
          <Text style={commonStyles.mediumMutedText}>GURUQS133567</Text>
          <Text style={commonStyles.mediumMutedText}>CBSE | Class 9</Text>
        </View>
        <View
          style={{
            borderBottomColor: Colors.borderColor,
            borderTopColor: Colors.borderColor,
            borderBottomWidth: 0.5,
            borderTopWidth: 0.5,
            padding: RfH(16),
          }}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Subjects</Text>
        </View>
        <View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={students}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(index) => index.toString()}
            contentContainerStyle={{ paddingBottom: RfH(34) }}
          />
        </View>
        <View>
          <UserReviews />
        </View>
      </ScrollView>
    </View>
  );
}

export default StudentDetails;
