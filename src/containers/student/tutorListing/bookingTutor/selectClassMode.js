import React, { useEffect, useState } from 'react';
import { Modal, View, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Switch, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader, IconButtonWrapper } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Images, Colors } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import { STANDARD_SCREEN_SIZE } from '../../../../utils/constants';
import routeNames from '../../../../routes/screenNames';

const selectClassMode = () => {
  const navigation = useNavigation();
  const [numberOfClass, setNumberOfClass] = useState(0);

  const addClass = () => {
    setNumberOfClass(numberOfClass + 1);
  };

  const removeClass = () => {
    setNumberOfClass(numberOfClass - 1);
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
      <ScrollView>
        <ScreenHeader label="Book Class" homeIcon />
        <IconButtonWrapper
          iconWidth={RfW(95)}
          iconHeight={RfH(100)}
          iconImage={Images.kushal}
          imageResizeMode="cover"
          styling={{ alignSelf: 'center', marginTop: RfH(48), borderRadius: RfW(16) }}
        />
        <Text
          style={{
            fontSize: RFValue(16, STANDARD_SCREEN_SIZE),
            fontFamily: 'SegoeUI-Semibold',
            alignSelf: 'center',
            marginTop: RfH(16),
          }}>
          Gurbani Singh
        </Text>
        <Text style={{ alignSelf: 'center', color: Colors.darkGrey }}>English ( Class 6-12 I CBSE)</Text>
        <Text
          style={{ marginTop: RfH(16), fontSize: RFValue(16, STANDARD_SCREEN_SIZE), fontFamily: 'SegoeUI-Semibold' }}>
          Select mode of class and number of Classes
        </Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(36), alignItems: 'flex-start' }]}>
          <Text style={{ color: Colors.darkGrey }}>Mode of Class</Text>
          <View>
            <Switch value />
            <Text
              style={{
                marginTop: RfH(8),
                fontSize: RFValue(12, STANDARD_SCREEN_SIZE),
                alignSelf: 'center',
                color: Colors.darkGrey,
              }}>
              Online
            </Text>
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(32) }]}>
          <Text style={{ flex: 0.3 }}>Classes</Text>
          <View style={{ flex: 0.7, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ flex: 0.25, color: Colors.darkGrey, textAlign: 'center' }}>1</Text>
            <Text style={{ flex: 0.25, color: Colors.darkGrey, textAlign: 'center' }}>5</Text>
            <Text style={{ flex: 0.25, color: Colors.darkGrey, textAlign: 'center' }}>10</Text>
            <Text style={{ flex: 0.25, color: Colors.darkGrey, textAlign: 'center' }}>20</Text>
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(32) }]}>
          <Text style={{ flex: 0.3 }}>Total Price</Text>
          <View style={{ flex: 0.7, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ flex: 0.25, color: Colors.darkGrey, textAlign: 'center' }}>₹100</Text>
            <Text style={{ flex: 0.25, color: Colors.darkGrey, textAlign: 'center' }}>₹500</Text>
            <Text style={{ flex: 0.25, color: Colors.darkGrey, textAlign: 'center' }}>₹1000</Text>
            <Text style={{ flex: 0.25, color: Colors.darkGrey, textAlign: 'center' }}>₹2000</Text>
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(40) }]}>
          <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), fontFamily: 'SegoeUI-Semibold' }}>
            Total Classes
          </Text>
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
            }}>
            <IconButtonWrapper
              iconWidth={RfW(12)}
              iconHeight={RfH(12)}
              iconImage={Images.minus_blue}
              submitFunction={() => removeClass()}
            />
            <Text>{numberOfClass}</Text>
            <IconButtonWrapper
              iconWidth={RfW(12)}
              iconHeight={RfH(12)}
              iconImage={Images.plus_blue}
              submitFunction={() => addClass()}
            />
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(32) }]}>
          <Text style={{ fontSize: RFValue(16, STANDARD_SCREEN_SIZE), fontFamily: 'SegoeUI-Semibold' }}>
            Amount Payable
          </Text>
          <Text>₹750</Text>
        </View>
        <View style={{ alignSelf: 'center', marginTop: RfH(100) }}>
          <Button style={[commonStyles.buttonPrimary, { width: RfW(144) }]}>
            <Text style={commonStyles.textButtonPrimary}>Add to Cart</Text>
          </Button>
        </View>
      </ScrollView>
      <View
        style={{
          bottom: RfH(84),
          right: RfW(16),
          position: 'absolute',
          height: RfH(56),
          width: RfW(56),
          borderRadius: 28,
          backgroundColor: Colors.orange,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.STUDENT.MY_CART)}>
          <View>
            <IconButtonWrapper iconHeight={RfH(32)} iconImage={Images.cart} />
            <Text style={{ marginTop: RfH(-30), color: Colors.white }}>{numberOfClass}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default selectClassMode;
