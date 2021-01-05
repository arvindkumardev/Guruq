import { Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import { Loader, ScreenHeader } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Colors, Fonts } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import routeNames from '../../../../routes/screenNames';
import { SEARCH_BOOKINGS } from '../../booking.query';

function BookingList() {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const [bookingData, setBookingData] = useState([]);

  const [searchBookings, { loading: loadingBookings }] = useLazyQuery(SEARCH_BOOKINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        setBookingData(data?.searchBookings.edges);
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      searchBookings({
        variables: {
          searchDto: { showWithAvailableClasses: true },
        },
      });
    }
  }, [isFocussed]);

  const renderDetails = (item) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate(routeNames.STUDENT.VIEW_BOOKING_DETAILS, { bookingData: item })}>
        <View
          style={{
            marginHorizontal: RfW(16),
            marginVertical: RfH(8),
            borderWidth: 1,
            borderRadius: 8,
            borderColor: Colors.darkGrey,
            paddingHorizontal: RfW(8),
            paddingVertical: RfH(16),
          }}>
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Booking Id {item.id}</Text>
          <Text style={commonStyles.mediumMutedText}>{new Date(item.createdDate).toDateString()}</Text>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.smallMutedText}>{item?.orderItems && item?.orderItems[0]?.count} ITEMS</Text>
            <Text style={[commonStyles.mediumPrimaryText, { color: Colors.brandBlue2, fontFamily: Fonts.bold }]}>
              ₹ {parseFloat(item.payableAmount).toFixed(2)}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={(commonStyles.mainContainer, { flex: 1, backgroundColor: Colors.white })}>
      <Loader isLoading={loadingBookings} />
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

export default BookingList;
