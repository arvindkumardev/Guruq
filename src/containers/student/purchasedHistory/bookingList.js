import { Text, View, FlatList, TouchableWithoutFeedback, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useLazyQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { Loader, ScreenHeader, SelectSubjectModal } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts, Images } from '../../../theme';
import { enumLabelToText, printCurrency, printDateTime, RfH, RfW } from '../../../utils/helpers';
import { SEARCH_BOOKINGS } from '../booking.query';
import { OrderStatusEnum } from '../../../components/PaymentMethodModal/paymentMethod.enum';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import NavigationRouteNames from '../../../routes/screenNames';

function BookingList() {
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const [bookingData, setBookingData] = useState([]);
  const [isListEmpty, setIsListEmpty] = useState(false);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  const [searchBookings, { loading: loadingBookings }] = useLazyQuery(SEARCH_BOOKINGS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        const bookingDataList = data?.searchBookings.edges.filter(
          (item) => item.orderStatus !== OrderStatusEnum.PENDING.label
        );
        setBookingData(bookingDataList);
        setIsListEmpty(isEmpty(bookingDataList));
        setRefreshData(!refreshData);
      }
    },
  });

  useEffect(() => {
    if (isFocussed) {
      searchBookings({
        variables: {
          searchDto: { showWithAvailableClasses: true, size: 100 },
        },
      });
    }
  }, [isFocussed]);

  const gotoTutors = (subject) => {
    setShowAllSubjects(false);
    navigation.navigate(NavigationRouteNames.STUDENT.TUTOR, { offering: subject });
  };

  const renderDetails = (item) => (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate(NavigationRouteNames.STUDENT.VIEW_BOOKING_DETAILS, { bookingId: item.id })}>
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
          <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
            Booking Id {item.orderId}
          </Text>
          <Text
            style={[
              commonStyles.smallPrimaryText,
              { color: item.orderStatus === OrderStatusEnum.COMPLETE.label ? Colors.green : Colors.orangeRed },
            ]}>
            {enumLabelToText(item.orderStatus)}
          </Text>
        </View>

        <Text style={commonStyles.mediumMutedText}>{printDateTime(item?.createdDate)}</Text>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={commonStyles.smallMutedText}>{item?.orderItems && item?.orderItems.length} ORDER ITEM</Text>
          <Text style={[commonStyles.mediumPrimaryText, { color: Colors.brandBlue2, fontFamily: Fonts.bold }]}>
            ₹ {printCurrency(item?.payableAmount)}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={(commonStyles.mainContainer, { flex: 1, backgroundColor: Colors.white })}>
      <Loader isLoading={loadingBookings} />
      <ScreenHeader label="Purchase History" homeIcon horizontalPadding={RfW(16)} />
      {!isListEmpty ? (
        <FlatList
          ListHeaderComponent={<View style={{ height: RfH(20) }} />}
          showsVerticalScrollIndicator={false}
          data={bookingData}
          renderItem={({ item, index }) => renderDetails(item, index)}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={bookingData.length > 5}
          ListFooterComponent={<View style={{ height: RfH(20) }} />}
          extraData={refreshData}
        />
      ) : (
        <View style={{ flex: 1, paddingTop: RfH(70), alignItems: 'center' }}>
          <Image
            source={Images.empty_cart}
            style={{
              height: RfH(264),
              width: RfW(248),
              marginBottom: RfH(32),
            }}
            resizeMode="contain"
          />
          <Text
            style={[
              commonStyles.pageTitleThirdRow,
              { fontSize: RFValue(20, STANDARD_SCREEN_SIZE), textAlign: 'center' },
            ]}>
            No data found
          </Text>
          <Text
            style={[
              commonStyles.regularMutedText,
              { marginHorizontal: RfW(80), textAlign: 'center', marginTop: RfH(16) },
            ]}>
            Looks like you haven't purchased any classes yet.
          </Text>
          <Button
            onPress={() => setShowAllSubjects(true)}
            style={[commonStyles.buttonPrimary, { alignSelf: 'center', marginTop: RfH(64), width: RfW(190) }]}>
            <Text style={commonStyles.textButtonPrimary}>Start Booking</Text>
          </Button>
        </View>
      )}
      <SelectSubjectModal
        onClose={() => setShowAllSubjects(false)}
        onSelectSubject={gotoTutors}
        visible={showAllSubjects}
      />
    </View>
  );
}

export default BookingList;
