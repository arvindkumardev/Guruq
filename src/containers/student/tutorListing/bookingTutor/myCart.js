import React, { useEffect, useState } from 'react';
import { Modal, View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'native-base';
import { IconButtonWrapper, ScreenHeader } from '../../../../components';
import { Colors, Images } from '../../../../theme';
import commonStyles from '../../../../theme/styles';
import { RfH, RfW } from '../../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';

const myCart = () => {
  const [showQPointPayModal, setShowQPointPayModal] = useState(false);
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

  const renderCartItems = (item) => {
    return (
      <View style={[commonStyles.horizontalChildrenStartView, { marginTop: RfH(32) }]}>
        <IconButtonWrapper
          iconHeight={RfH(90)}
          iconWidth={RfW(80)}
          iconImage={item.tutorIcon}
          styling={{ flex: 0.3, borderRadius: 16 }}
        />
        <View style={([commonStyles.verticallyCenterItemsView], { flex: 1, marginLeft: RfW(16) })}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), fontFamily: 'SegoeUI-Semibold' }}>
                {item.subject}
              </Text>
              <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), fontFamily: 'SegoeUI-Semibold' }}>
                by {item.tutor}
              </Text>
            </View>
            <View
              style={{
                borderRadius: 8,
                width: RfW(72),
                height: RfH(32),
                borderWidth: 1,
                borderColor: Colors.brandBlue2,
                justifyContent: 'space-evenly',
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-end',
              }}>
              <IconButtonWrapper
                iconWidth={RfW(12)}
                iconHeight={RfH(12)}
                iconImage={Images.minus_blue}
                submitFunction={() => removeClass()}
              />
              <Text>{item.numberOfClass}</Text>
              <IconButtonWrapper
                iconWidth={RfW(12)}
                iconHeight={RfH(12)}
                iconImage={Images.plus_blue}
                submitFunction={() => addClass()}
              />
            </View>
          </View>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
            {item.board}, Class {item.class}
          </Text>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>{item.mode}</Text>
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
            style={{
              fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
              fontFamily: 'SegoeUI-Bold',
              color: Colors.orange,
              marginLeft: RfW(8),
            }}>
            Use Q Points
          </Text>
        </View>
        <IconButtonWrapper
          iconHeight={RfH(24)}
          iconWidth={RfW(24)}
          iconImage={Images.chevronRight}
          submitFunction={() => setShowQPointPayModal(true)}
        />
      </View>
    );
  };

  const renderCartDetails = () => {
    return (
      <View style={{ marginHorizontal: RfW(16) }}>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Amount</Text>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>₹1200</Text>
        </View>
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Amount Payable</Text>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>₹1200</Text>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
          <Text
            style={{
              fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
              color: Colors.darkGrey,
              fontFamily: 'SegoeUI-Bold',
            }}>
            Total Amount
          </Text>
          <Text
            style={{
              fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
              color: Colors.darkGrey,
              fontFamily: 'SegoeUI-Bold',
            }}>
            ₹1200
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[commonStyles.mainContainer, { paddingHorizontal: 0, backgroundColor: Colors.white }]}>
      <View style={{ marginHorizontal: RfW(16) }}>
        <ScreenHeader label="My Cart" homeIcon />
      </View>
      <ScrollView>
        <View
          style={{
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            borderColor: Colors.darkGrey,
            marginTop: RfH(8),
            paddingVertical: RfH(8),
            paddingLeft: RfW(48),
          }}>
          <Text style={{ fontSize: RFValue(12, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>4 ITEMS</Text>
        </View>
        <View style={{ marginHorizontal: RfW(16) }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={cartItems}
            renderItem={({ item }) => renderCartItems(item)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        {renderQPointView()}
        <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), fontFamily: 'SegoeUI-Bold', margin: RfH(16) }}>
          CART DETAILS (4 Items)
        </Text>
        {renderCartDetails()}
        <View style={{ alignSelf: 'center', marginTop: RfH(30), marginBottom: RfH(34) }}>
          <Button style={[commonStyles.buttonPrimary, { width: RfW(144) }]}>
            <Text style={commonStyles.textButtonPrimary}>Pay Now</Text>
          </Button>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent
        visible={showQPointPayModal}
        onRequestClose={() => {
          setShowQPointPayModal(false);
        }}>
        <View style={{ flex: 1, backgroundColor: Colors.black, opacity: 0.5, flexDirection: 'column' }} />
        <View
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            position: 'absolute',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            backgroundColor: Colors.white,
            opacity: 1,
            paddingBottom: RfH(34),
          }}>
          <IconButtonWrapper
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
            styling={{ alignSelf: 'flex-end', marginRight: RfW(16), marginTop: RfH(16) }}
            iconImage={Images.cross}
            submitFunction={() => setShowQPointPayModal(false)}
          />
          <View
            style={[
              commonStyles.horizontalChildrenSpaceView,
              {
                borderBottomWidth: 0.5,
                borderColor: Colors.darkGrey,
                paddingVertical: RfH(16),
                marginHorizontal: RfW(16),
              },
            ]}>
            <View style={commonStyles.horizontalChildrenStartView}>
              <IconButtonWrapper iconHeight={RfH(24)} iconWidth={RfW(16)} iconImage={Images.logo_yellow} />
              <Text
                style={{
                  fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                  fontFamily: 'SegoeUI-Bold',
                  color: Colors.orange,
                  marginLeft: RfW(8),
                }}>
                Use Q Points
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                  color: Colors.orange,
                  fontFamily: 'SegoeUI-Bold',
                }}>
                300
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
              color: Colors.darkGrey,
              alignSelf: 'flex-end',
              marginRight: RfW(16),
              marginTop: RfH(-20),
            }}>
            Redeem
          </Text>
          <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), fontFamily: 'SegoeUI-Bold', margin: RfH(16) }}>
            CART DETAILS (4 Items)
          </Text>
          <View style={{ marginHorizontal: RfW(16) }}>
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>Amount</Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>₹1200</Text>
            </View>
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>
                Deduction against Q points
              </Text>
              <Text style={{ fontSize: RFValue(14, STANDARD_SCREEN_SIZE), color: Colors.darkGrey }}>₹300</Text>
            </View>
            <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
              <Text
                style={{
                  fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
                  color: Colors.darkGrey,
                  fontFamily: 'SegoeUI-Bold',
                }}>
                Total Amount
              </Text>
              <Text
                style={{
                  fontSize: RFValue(14, STANDARD_SCREEN_SIZE),
                  color: Colors.darkGrey,
                  fontFamily: 'SegoeUI-Bold',
                }}>
                ₹1500
              </Text>
            </View>
          </View>
          <View style={[commonStyles.horizontalChildrenSpaceView, { marginHorizontal: RfW(16) }]}>
            <View style={{ marginTop: RfH(30) }}>
              <Text
                style={{
                  fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
                  fontFamily: 'SegoeUI-Semibold',
                }}>
                ₹900
              </Text>
              <Text
                style={{
                  fontSize: RFValue(10, STANDARD_SCREEN_SIZE),
                  color: Colors.brandBlue2,
                }}>
                View Details
              </Text>
            </View>
            <View style={{ marginTop: RfH(30) }}>
              <Button
                style={[commonStyles.buttonPrimary, { width: RfW(144), alignSelf: 'flex-end', marginHorizontal: 0 }]}>
                <Text style={commonStyles.textButtonPrimary}>Pay Now</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default myCart;
