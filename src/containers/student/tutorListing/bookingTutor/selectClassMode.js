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
import styles from '../styles';

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
          styling={styles.tutorIcon}
        />
        <Text style={styles.compareTutorName}>Gurbani Singh</Text>
        <Text style={[styles.tutorDetails, { alignSelf: 'center' }]}>English ( Class 6-12 I CBSE)</Text>
        <Text style={[styles.compareTutorName, { alignSelf: 'flex-start' }]}>
          Select mode of class and number of Classes
        </Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(36), alignItems: 'flex-start' }]}>
          <Text style={styles.tutorDetails}>Mode of Class</Text>
          <View>
            <Switch value />
            <Text
              style={[
                styles.appliedFilterText,
                {
                  marginTop: RfH(8),
                  alignSelf: 'center',
                },
              ]}>
              Online
            </Text>
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(32) }]}>
          <Text style={{ flex: 0.3 }}>Classes</Text>
          <View style={[commonStyles.horizontalChildrenView, { flex: 0.7 }]}>
            <Text style={styles.classTableText}>1</Text>
            <Text style={styles.classTableText}>5</Text>
            <Text style={styles.classTableText}>10</Text>
            <Text style={styles.classTableText}>20</Text>
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(32) }]}>
          <Text style={{ flex: 0.3 }}>Total Price</Text>
          <View style={[commonStyles.horizontalChildrenView, { flex: 0.7 }]}>
            <Text style={styles.classTableText}>₹100</Text>
            <Text style={styles.classTableText}>₹500</Text>
            <Text style={styles.classTableText}>₹1000</Text>
            <Text style={styles.classTableText}>₹2000</Text>
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(40) }]}>
          <Text style={[styles.compareTutorName, { marginTop: 0 }]}>Total Classes</Text>
          <View style={styles.bookingSelectorParent}>
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
          <Text style={[styles.compareTutorName, { marginTop: 0 }]}>Amount Payable</Text>
          <Text>₹750</Text>
        </View>
        <View style={{ alignSelf: 'center', marginTop: RfH(100) }}>
          <Button style={[commonStyles.buttonPrimary, { width: RfW(144) }]}>
            <Text style={commonStyles.textButtonPrimary}>Add to Cart</Text>
          </Button>
        </View>
      </ScrollView>
      <View style={styles.fabActionParent}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.STUDENT.MY_CART)}>
          <View>
            <IconButtonWrapper iconHeight={RfH(40)} iconImage={Images.cart_white} styling={{ alignSelf: 'center' }} />
            <Text style={styles.cartText}>{numberOfClass}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default selectClassMode;
