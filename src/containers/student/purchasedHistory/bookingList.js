import { Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import { Loader, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts } from '../../../theme';
import { enumLabelToText, RfH, RfW } from '../../../utils/helpers';
import routeNames from '../../../routes/screenNames';
import { SEARCH_BOOKINGS } from '../booking.query';
import { OrderStatusEnum } from '../../../components/PaymentMethodModal/paymentMethod.enum';

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
        setBookingData(data?.searchBookings.edges.filter((item) => item.orderStatus !== OrderStatusEnum.PENDING.label));
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
        onPress={() => navigation.navigate(routeNames.STUDENT.VIEW_BOOKING_DETAILS, { bookingId: item.id })}>
        <View
          style={{
            marginHorizontal: RfW(16),
            marginVertical: RfH(8),
            borderWidth: RfW(2),
            borderRadius: RfH(8),
            borderColor: Colors.lightGrey,
            paddingHorizontal: RfW(8),
            paddingVertical: RfH(16),
          }}>
          <View style={[commonStyles.horizontalChildrenSpaceView, { alignItems: 'center' }]}>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Booking Id {item.id}</Text>
            <Text
              style={[
                commonStyles.smallPrimaryText,
                { color: item.orderStatus === OrderStatusEnum.COMPLETE.label ? Colors.green : Colors.orangeRed },
              ]}>
              {enumLabelToText(item.orderStatus)}
            </Text>
          </View>

          <Text style={commonStyles.mediumMutedText}>{new Date(item.createdDate).toDateString()}</Text>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={commonStyles.smallMutedText}>{item?.orderItems && item?.orderItems.length} ORDER ITEM</Text>
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
        ListHeaderComponent={<View style={{ height: RfH(20) }} />}
        showsVerticalScrollIndicator={false}
        data={bookingData}
        renderItem={({ item, index }) => renderDetails(item, index)}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={bookingData.length > 5}
        ListFooterComponent={<View style={{ height: RfH(20) }} />}
      />
    </View>
  );
}

export default BookingList;
