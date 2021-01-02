import { Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Colors, Fonts } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import routeNames from '../../../../routes/screenNames';

function BookingDetails() {
  const navigation = useNavigation();
  const [bookingData, setBookingData] = useState([
    { title: 'Booking Id 73829', date: '25 Sept 2020', count: 4, amount: '800.00' },
    { title: 'Booking Id 73829', date: '25 Sept 2020', count: 4, amount: '800.00' },
    { title: 'Booking Id 73829', date: '25 Sept 2020', count: 4, amount: '800.00' },
    { title: 'Booking Id 73829', date: '25 Sept 2020', count: 4, amount: '800.00' },
  ]);

  const renderDetails = (item) => {
    return (
      <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.STUDENT.VIEW_BOOKING_DETAILS)}>
        <View
          style={{
            marginHorizontal: RfW(16),
            marginVertical: RfH(8),
            borderWidth: 1,
            borderRadius: 8,
            borderColor: Colors.lightGrey,
            paddingHorizontal: RfW(8),
            paddingVertical: RfH(16),
          }}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>{item.title}</Text>
          <Text style={commonStyles.mediumMutedText}>{item.date}</Text>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.smallMutedText}>{item.count} ITEMS</Text>
            <Text style={[commonStyles.mediumPrimaryText, { color: Colors.brandBlue2, fontFamily: Fonts.bold }]}>
              ₹ {item.amount}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={(commonStyles.mainContainer, { flex: 1, backgroundColor: Colors.white })}>
      <ScreenHeader label="Booking Details" homeIcon horizontalPadding={RfW(16)} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={bookingData}
        renderItem={({ item, index }) => renderDetails(item, index)}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

export default BookingDetails;
