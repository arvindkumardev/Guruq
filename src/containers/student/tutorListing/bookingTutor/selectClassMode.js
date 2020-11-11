import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback, FlatList } from 'react-native';
import { Switch, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { ScreenHeader, IconButtonWrapper } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Images, Colors } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import routeNames from '../../../../routes/screenNames';
import styles from '../styles';

const selectClassMode = () => {
  const navigation = useNavigation();
  const [numberOfClass, setNumberOfClass] = useState(1);
  const [amount, setAmount] = useState(100);

  const [classPrices, setClassPrices] = useState([
    { classes: 1, pricePerHour: 100, totalPrice: 100 },
    { classes: 5, pricePerHour: 95, totalPrice: 475 },
    { classes: 10, pricePerHour: 90, totalPrice: 900 },
    { classes: 25, pricePerHour: 85, totalPrice: 2125 },
    { classes: 50, pricePerHour: 80, totalPrice: 4000 },
    { classes: 100, pricePerHour: 75, totalPrice: 7500 },
  ]);

  const addClass = () => {
    setNumberOfClass(numberOfClass + 1);
    const cls = numberOfClass + 1;
    if (cls < 5) {
      setAmount(100 * cls);
    } else if (cls > 4 && cls < 10) {
      setAmount(90 * cls);
    } else if (cls > 9 && cls < 20) {
      setAmount(80 * cls);
    } else if (cls > 19) {
      setAmount(70 * cls);
    } else {
      setAmount(0);
    }
  };

  const removeClass = () => {
    if (numberOfClass > 1) {
      setNumberOfClass(numberOfClass - 1);
      const cls = numberOfClass - 1;
      if (cls < 5) {
        setAmount(100 * cls);
      } else if (cls > 4 && cls < 10) {
        setAmount(90 * cls);
      } else if (cls > 9 && cls < 20) {
        setAmount(80 * cls);
      } else if (cls > 19) {
        setAmount(70 * cls);
      } else {
        setAmount(0);
      }
    }
  };

  const renderClasses = (item) => {
    return (
      <View
        style={[
          commonStyles.borderBottom,
          {
            marginTop: RfH(24),
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: RfH(8),
          },
        ]}>
        <View style={{}}>
          <Text style={commonStyles.secondaryText}>{item.classes}</Text>
        </View>
        <View>
          <Text style={commonStyles.secondaryText}>{item.pricePerHour}</Text>
        </View>
        <View>
          <Text style={commonStyles.secondaryText}>{item.totalPrice}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
      <ScreenHeader label="Book Class" homeIcon />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ height: RfH(44) }} />
        <View style={commonStyles.horizontalChildrenStartView}>
          <IconButtonWrapper
            iconWidth={RfW(87)}
            iconHeight={RfH(80)}
            iconImage={Images.kushal}
            imageResizeMode="cover"
            styling={{ borderRadius: 8 }}
          />
          <View style={{ marginLeft: RfW(16) }}>
            <Text style={[styles.compareTutorName, { alignSelf: 'flex-start', marginTop: 0 }]}>Gurbani Singh</Text>
            <Text style={styles.tutorDetails}>English ( Class 6-12 I CBSE)</Text>
            <Text style={styles.tutorDetails}>Mass Communication</Text>
            <Text style={styles.tutorDetails}>3 years of Teaching Experience </Text>
          </View>
        </View>
        <Text style={[styles.compareTutorName, { alignSelf: 'flex-start' }]}>
          Select mode of class and number of Classes
        </Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(12), alignItems: 'flex-start' }]}>
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
        <View
          style={{ marginTop: RfH(16), flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <Text>Classes</Text>
          <Text>Price/Hour</Text>
          <Text>Total Price</Text>
        </View>
        <View style={commonStyles.borderBottom}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={classPrices}
            renderItem={({ item, index }) => renderClasses(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(40) }]}>
          <Text style={[styles.compareTutorName, { marginTop: 0 }]}>Total Classes</Text>
          <View style={styles.bookingSelectorParent}>
            <TouchableWithoutFeedback onPress={() => removeClass()}>
              <IconButtonWrapper
                iconWidth={RfW(12)}
                iconHeight={RfH(12)}
                iconImage={Images.minus_blue}
                submitFunction={() => removeClass()}
              />
            </TouchableWithoutFeedback>
            <Text>{numberOfClass}</Text>
            <IconButtonWrapper
              iconWidth={RfW(12)}
              iconHeight={RfH(12)}
              iconImage={Images.plus_blue}
              submitFunction={() => addClass()}
            />
          </View>
        </View>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
          <Text style={[styles.compareTutorName, { marginTop: 0 }]}>Amount Payable</Text>
          <Text>₹{amount}</Text>
        </View>
        <View style={{ alignSelf: 'center', marginTop: RfH(32), marginBottom: RfH(32) }}>
          <Button
            onPress={() => navigation.navigate(routeNames.STUDENT.MY_CART)}
            style={[commonStyles.buttonPrimary, { width: RfW(144) }]}>
            <Text style={commonStyles.textButtonPrimary}>Add to Cart</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default selectClassMode;
