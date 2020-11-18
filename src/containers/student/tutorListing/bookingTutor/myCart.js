/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Button } from 'native-base';
import { useLazyQuery } from '@apollo/client';
import { IconButtonWrapper, ScreenHeader } from '../../../../components';
import { Colors, Fonts, Images } from '../../../../theme';
import commonStyles from '../../../../theme/styles';
import styles from '../styles';
import { RfH, RfW } from '../../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import QPointPayModal from '../components/qPointPayModal';
import CouponModal from '../components/couponModal';
import routeNames from '../../../../routes/screenNames';
import Loader from '../../../../components/Loader';
import { GET_CART_ITEMS } from '../../booking.query';

const myCart = () => {
  const navigation = useNavigation();
  const [showQPointPayModal, setShowQPointPayModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [getCartItems, { loading: cartLoading }] = useLazyQuery(GET_CART_ITEMS, {
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      setCartItems(data.getCartItems);
    },
  });

  useEffect(() => {
    getCartItems();
  }, {});

  const [cartItems, setCartItems] = useState([]);

  const getTutorImage = (tutor) => {
    return tutor && tutor.profileImage && tutor.profileImage.filename
      ? `https://guruq.in/api/${tutor?.profileImage?.filename}`
      : `https://guruq.in/guruq-new/images/avatars/${tutor?.contactDetail?.gender === 'MALE' ? 'm' : 'f'}${
          tutor.id % 4
        }.png`;
  };

  const renderCartItems = (item, index) => {
    return (
      <View style={[commonStyles.horizontalChildrenStartView, { marginTop: RfH(32) }]}>
        <IconButtonWrapper
          iconHeight={RfH(90)}
          iconWidth={RfW(80)}
          iconImage={getTutorImage(item.tutor)}
          styling={{ flex: 0.3, borderRadius: 16 }}
        />
        <View style={([commonStyles.verticallyCenterItemsView], { flex: 1, marginLeft: RfW(16) })}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View>
              <Text style={styles.buttonText}>{item.offering.name}</Text>
              <Text style={styles.buttonText}>
                by {item.tutor.contactDetail.firstName} {item.tutor.contactDetail.lastName}
              </Text>
            </View>
            <View style={styles.bookingSelectorParent}>
              <IconButtonWrapper
                iconWidth={RfW(12)}
                iconHeight={RfH(12)}
                iconImage={Images.minus_blue}
                submitFunction={() => removeClass(index)}
              />
              <Text>{item.count}</Text>
              <IconButtonWrapper
                iconWidth={RfW(12)}
                iconHeight={RfH(12)}
                iconImage={Images.plus_blue}
                submitFunction={() => addClass(index)}
              />
            </View>
          </View>
          <Text style={styles.tutorDetails}>
            {item.offering.parentOffering.parentOffering.name}, {item.offering.parentOffering.name}
          </Text>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={styles.tutorDetails}>{item.mode}</Text>
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), fontFamily: 'SegoeUI-Bold' }}>
              ₹{item.price}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderQPointView = () => {
    return (
      <TouchableWithoutFeedback onPress={() => setShowQPointPayModal(true)}>
        <View style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(16) }]}>
          <View style={commonStyles.horizontalChildrenStartView}>
            <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(16)} iconImage={Images.logo_yellow} />
            <Text
              style={[
                styles.compareTutorName,
                {
                  fontFamily: 'SegoeUI-Bold',
                  color: Colors.orange,
                  marginLeft: RfW(8),
                  marginTop: 0,
                },
              ]}>
              Apply Q Points
            </Text>
          </View>
          <IconButtonWrapper
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
            iconImage={Images.chevronRight}
            submitFunction={() => setShowQPointPayModal(true)}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderCouponView = () => {
    return (
      <TouchableWithoutFeedback onPress={() => setShowCouponModal(true)}>
        <View style={[commonStyles.horizontalChildrenSpaceView, { paddingHorizontal: RfW(16) }]}>
          <View style={commonStyles.horizontalChildrenStartView}>
            <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(16)} iconImage={Images.logo_yellow} />
            <Text
              style={[
                styles.compareTutorName,
                {
                  fontFamily: Fonts.semiBold,
                  color: Colors.black,
                  marginLeft: RfW(8),
                  marginTop: 0,
                },
              ]}>
              Apply Coupon
            </Text>
          </View>
          <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(24)} iconImage={Images.chevronRight} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderCartDetails = () => {
    return (
      <View style={{ marginHorizontal: RfW(16) }}>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={styles.tutorDetails}>Amount</Text>
          <Text style={styles.tutorDetails}>₹1200</Text>
        </View>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={styles.tutorDetails}>Convenience charges</Text>
          <Text style={styles.tutorDetails}>₹100</Text>
        </View>
        <View style={{ borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, marginTop: RfH(16) }} />
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
          <Text
            style={[
              styles.tutorDetails,
              {
                fontFamily: 'SegoeUI-Bold',
              },
            ]}>
            Total Amount
          </Text>
          <Text
            style={[
              styles.tutorDetails,
              {
                fontFamily: 'SegoeUI-Bold',
              },
            ]}>
            ₹1200
          </Text>
        </View>
      </View>
    );
  };

  const addClass = (index) => {
    let newArray = [];
    newArray = cartItems;
    newArray[index].numberOfClass = newArray[index].numberOfClass + 1;
    setCartItems(newArray);
    setRefreshList(!refreshList);
  };

  const removeClass = (index) => {
    let newArray = [];
    newArray = cartItems;
    if (newArray[index].numberOfClass > 0) {
      newArray[index].numberOfClass = newArray[index].numberOfClass - 1;
      setCartItems(newArray);
      setRefreshList(!refreshList);
    }
  };

  const payNow = () => {
    setShowQPointPayModal(false);
    navigation.navigate(routeNames.STUDENT.PAYMENT_METHOD);
  };
  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
      <View style={{ marginHorizontal: RfW(16) }}>
        <Loader isLoading={cartLoading} />
        <ScreenHeader label="My Cart" homeIcon />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.itemView,
            {
              marginTop: RfH(8),
              paddingVertical: RfH(8),
              paddingLeft: RfW(48),
            },
          ]}>
          <Text style={styles.appliedFilterText}>{cartItems.length} ITEMS</Text>
        </View>
        <View style={{ marginHorizontal: RfW(16) }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={cartItems}
            extraData={refreshList}
            renderItem={({ item, index }) => renderCartItems(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>

        <View style={commonStyles.lineSeparatorWithMargin} />

        {renderQPointView()}

        <View style={commonStyles.lineSeparatorWithMargin} />

        {renderCouponView()}

        <View style={commonStyles.lineSeparatorWithMargin} />

        <Text style={[styles.chargeText, { margin: RfH(16), marginLeft: RfW(16) }]}>CART DETAILS (4 Items)</Text>
        {renderCartDetails()}
        <View
          style={[
            commonStyles.horizontalChildrenSpaceView,
            {
              marginHorizontal: RfW(16),
              marginBottom: RfH(34),
            },
          ]}>
          <View style={{ marginTop: RfH(30) }}>
            <Text style={styles.buttonText}>₹1300</Text>
            <Text style={{ fontSize: RFValue(10, STANDARD_SCREEN_SIZE), color: Colors.brandBlue2 }}>View Details</Text>
          </View>
          <View style={{ marginTop: RfH(30) }}>
            <Button
              onPress={() => payNow()}
              style={[
                commonStyles.buttonPrimary,
                {
                  width: RfW(144),
                  alignSelf: 'flex-end',
                  marginHorizontal: 0,
                },
              ]}>
              <Text style={commonStyles.textButtonPrimary}>Pay Now</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
      <QPointPayModal
        visible={showQPointPayModal}
        onClose={() => setShowQPointPayModal(false)}
        amount={1200}
        deductedAgaintQPoint={300}
        convenienceCharge={100}
        totalAmount={1500}
        qPoint={300}
        amountToPayAfterQPoint={900}
        onPayNow={() => payNow()}
      />
      <CouponModal visible={showCouponModal} onClose={() => setShowCouponModal(false)} />
    </View>
  );
};

export default myCart;
