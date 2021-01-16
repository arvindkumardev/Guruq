import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/react-hooks';
import { useLazyQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { IconButtonWrapper, Loader, ScreenHeader } from '../../../components';
import commonStyles from '../../../theme/styles';
import { Colors, Fonts } from '../../../theme';
import { alertBox, getSubjectIcons, RfH, RfW } from '../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../utils/constants';
import { CANCEL_ORDER_ITEMS } from '../booking.mutation';
import NavigationRouteNames from '../../../routes/screenNames';
import CancellationOrderModal from './cancellationReasonModal';
import { GET_CANCELLATION_SUMMARY } from '../booking.query';

function Refund(props) {
  const navigation = useNavigation();
  const { route } = props;
  const { orderData } = route?.params;
  const cancelSummaryData = route?.params.cancelSummary;
  const [cancelSummary, setCancelSummary] = useState({});
  const [showCancelReason, setShowCancelReason] = useState(false);

  const [getCancellationSummary, { loading: cancellationSummaryLoading }] = useLazyQuery(GET_CANCELLATION_SUMMARY, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
    },
    onCompleted: (data) => {
      if (data) {
        setCancelSummary(data.cancelOrderItemSummary);
      }
    },
  });

  const [cancelOrderItem, { loading: cancelLoading }] = useMutation(CANCEL_ORDER_ITEMS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log('dddd', e);
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Order cancelled successfully', '', {
          positiveText: 'Ok',
          onPositiveClick: () => {
            setShowCancelReason(false);
            navigation.navigate(NavigationRouteNames.STUDENT.BOOKING_DETAILS);
          },
        });
      }
    },
  });

  const cancellationConfirmation = () => {
    alertBox('Do you really want to cancel the order?', '', {
      positiveText: 'Yes',
      onPositiveClick: () => {
        setShowCancelReason(true);
      },
      negativeText: 'No',
    });
  };

  const handleCancelOrder = (cancelReason, otherComments) => {
    setShowCancelReason(false);
    cancelOrderItem({
      variables: {
        orderItemId: orderData?.id,
        cancelReason,
        comments: String(otherComments),
      },
    });
  };

  useEffect(() => {
    if (cancelSummaryData) {
      setCancelSummary(cancelSummaryData);
    } else {
      getCancellationSummary({ variables: { orderItemId: orderData.id } });
    }
  }, []);

  return (
    <>
      <Loader isLoading={cancelLoading || cancellationSummaryLoading} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader label="Refund Details" homeIcon horizontalPadding={RfW(16)} />
        <View style={{ paddingHorizontal: RfW(16) }}>
          <View style={{ height: RfH(32) }} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.bold }]}>Order Details</Text>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
              ₹ {orderData?.price ? parseFloat(orderData?.price).toFixed(2) : '0.00'}
            </Text>
          </View>
          <Text style={commonStyles.mediumMutedText}>
            {orderData?.offering?.parentOffering?.parentOffering?.displayName} |{' '}
            {orderData?.offering?.parentOffering?.displayName}
          </Text>
          <View style={[commonStyles.lineSeparator, { marginTop: RfH(8) }]} />
          <View
            style={[commonStyles.horizontalChildrenSpaceView, { paddingVertical: RfH(16), alignItems: 'flex-start' }]}>
            <View style={commonStyles.horizontalChildrenView}>
              <IconButtonWrapper
                iconHeight={RfH(52)}
                iconWidth={RfH(52)}
                iconImage={getSubjectIcons(orderData?.offering?.displayName)}
                styling={{ borderRadius: RfH(8) }}
              />
              <View style={{ marginLeft: RfH(8) }}>
                <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
                  {orderData?.offering?.displayName}
                </Text>
                <Text style={commonStyles.mediumMutedText}>₹{orderData?.mrp}/per class</Text>
              </View>
            </View>
            <View style={[commonStyles.verticallyCenterItemsView, { alignSelf: 'flex-end' }]}>
              <Text
                style={[
                  commonStyles.headingPrimaryText,
                  { backgroundColor: Colors.lightBlue, padding: RfH(8), borderRadius: 8 },
                ]}>
                {cancelSummary?.total}
              </Text>
              <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Total</Text>
              <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Classes</Text>
            </View>
          </View>
          <View style={commonStyles.lineSeparator} />
          <View style={[commonStyles.horizontalChildrenSpaceView, { paddingVertical: RfH(12) }]}>
            <Text style={commonStyles.mediumMutedText}>Classes Taken</Text>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>{cancelSummary.taken}</Text>
          </View>
          <View style={commonStyles.lineSeparator} />
          <View style={[commonStyles.horizontalChildrenSpaceView, { paddingVertical: RfH(12) }]}>
            <Text style={commonStyles.mediumMutedText}>Classes Scheduled</Text>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
              {cancelSummary.scheduled}
            </Text>
          </View>
          <View style={commonStyles.lineSeparator} />
          <View style={[commonStyles.horizontalChildrenSpaceView, { paddingVertical: RfH(12) }]}>
            <Text style={commonStyles.mediumMutedText}>Classes UnScheduled</Text>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
              {cancelSummary.unscheduled}
            </Text>
          </View>
          {cancelSummary.scheduled > 0 && isEmpty(orderData.refund) && (
            <View style={{ marginBottom: RfH(15) }}>
              <Text style={[commonStyles.smallPrimaryText, { color: Colors.orangeRed }]}>
                All scheduled classes will be cancelled.
              </Text>
            </View>
          )}
        </View>
        <View style={commonStyles.blankGreyViewSmall} />
        <View style={[commonStyles.mainContainer, { flex: 0 }]}>
          <View style={[commonStyles.horizontalChildrenSpaceView, { paddingVertical: RfH(12) }]}>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>Refundable amount</Text>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
              ₹ {cancelSummary?.refund}
            </Text>
          </View>
        </View>
        <View style={commonStyles.blankGreyViewSmall} />
        {isEmpty(orderData.refund) && (
          <View
            style={[
              commonStyles.horizontalChildrenEqualSpaceView,
              { bottom: 0, left: 0, right: 0, position: 'absolute', paddingBottom: RfH(32) },
            ]}>
            <Button style={commonStyles.buttonPrimary} onPress={() => navigation.goBack()}>
              <Text style={commonStyles.textButtonPrimary}>Don't Cancel</Text>
            </Button>
            <Button style={commonStyles.buttonOutlinePrimary} onPress={cancellationConfirmation}>
              <Text style={commonStyles.textButtonOutlinePrimary}>Initiate Refund</Text>
            </Button>
          </View>
        )}
        <CancellationOrderModal
          isVisible={showCancelReason}
          handleClose={() => setShowCancelReason(false)}
          handleCancelOrder={handleCancelOrder}
        />
      </View>
    </>
  );
}

export default Refund;
