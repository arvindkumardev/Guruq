/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Button } from 'native-base';
import { IconButtonWrapper, ScreenHeader } from '../../../../components';
import { Colors, Images } from '../../../../theme';
import commonStyles from '../../../../theme/styles';
import styles from '../styles';
import { RfH, RfW } from '../../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import QPointPayModal from '../components/qPointPayModal';
import routeNames from '../../../../routes/screenNames';

const myCart = () => {
  const navigation = useNavigation();
  const [showQPointPayModal, setShowQPointPayModal] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      tutorIcon: Images.kushal,
      subject: 'English Class',
      tutor: 'Gurbani',
      board: 'CBSE',
      class: '9',
      numberOfClass: 5,
      mode: 'Online Individual Class',
      amount: '₹ 750',
    },
    {
      tutorIcon: Images.kushal,
      subject: 'Maths Class',
      tutor: 'Priyam',
      board: 'CBSE',
      class: '9',
      numberOfClass: 1,
      mode: 'Online Individual Class',
      amount: '₹ 150',
    },
    {
      tutorIcon: Images.kushal,
      subject: 'Physics Class',
      tutor: 'Priyam',
      board: 'CBSE',
      class: '9',
      numberOfClass: 1,
      mode: 'Online Individual Class',
      amount: '₹ 150',
    },
    {
      tutorIcon: Images.kushal,
      subject: 'History Class',
      tutor: 'Shipra',
      board: 'CBSE',
      class: '9',
      numberOfClass: 1,
      mode: 'Online Individual Class',
      amount: '₹ 150',
    },
  ]);

  const renderCartItems = (item, index) => {
    return (
      <View style={[commonStyles.horizontalChildrenStartView, { marginTop: RfH(32) }]}>
        <IconButtonWrapper
          iconHeight={RfH(90)}
          iconWidth={RfW(80)}
          iconImage={item.tutorIcon}
          styling={{ flex: 0.3, borderRadius: 16 }}
        />
        <View style={([commonStyles.verticallyCenterItemsView], { flex: 1, marginLeft: RfW(16) })}>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View>
              <Text style={styles.buttonText}>{item.subject}</Text>
              <Text style={styles.buttonText}>by {item.tutor}</Text>
            </View>
            <View style={styles.bookingSelectorParent}>
              <IconButtonWrapper
                iconWidth={RfW(12)}
                iconHeight={RfH(12)}
                iconImage={Images.minus_blue}
                submitFunction={() => removeClass(index)}
              />
              <Text>{item.numberOfClass}</Text>
              <IconButtonWrapper
                iconWidth={RfW(12)}
                iconHeight={RfH(12)}
                iconImage={Images.plus_blue}
                submitFunction={() => addClass(index)}
              />
            </View>
          </View>
          <Text style={styles.tutorDetails}>
            {item.board}, Class {item.class}
          </Text>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={styles.tutorDetails}>{item.mode}</Text>
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), fontFamily: 'SegoeUI-Bold' }}>
              {item.amount}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderQPointView = () => {
    return (
      <TouchableWithoutFeedback onPress={() => setShowQPointPayModal(true)}>
        <View
          style={[
            commonStyles.horizontalChildrenSpaceView,
            {
              borderTopWidth: 0.5,
              borderBottomWidth: 0.5,
              borderColor: Colors.darkGrey,
              marginTop: RfH(32),
              paddingVertical: RfH(16),
              marginHorizontal: RfW(16),
            },
          ]}>
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
          <Text style={styles.appliedFilterText}>4 ITEMS</Text>
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
        {renderQPointView()}
        <Text style={[styles.chargeText, { margin: RfH(16), marginLeft: RfW(16) }]}>CART DETAILS (4 Items)</Text>
        {renderCartDetails()}
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginHorizontal: RfW(16), marginBottom: RfH(34) }]}>
          <View style={{ marginTop: RfH(30) }}>
            <Text style={styles.buttonText}>₹1300</Text>
            <Text style={styles.buttonText}>View Details</Text>
          </View>
          <View style={{ marginTop: RfH(30) }}>
            <Button
              onPress={() => payNow()}
              style={[commonStyles.buttonPrimary, { width: RfW(144), alignSelf: 'flex-end', marginHorizontal: 0 }]}>
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
        totalAmount={1500}
        qPoint={300}
        amountToPayAfterQPoint={900}
        onPayNow={() => payNow()}
      />
    </View>
  );
};

export default myCart;
