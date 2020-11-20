import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView, TouchableWithoutFeedback, FlatList, Modal } from 'react-native';
import { Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { IconButtonWrapper, CustomRadioButton } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Images, Colors } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import routeNames from '../../../../routes/screenNames';
import Loader from '../../../../components/Loader';
import styles from '../styles';
import { ADD_TO_CART } from '../../booking.mutation';
import Fonts from '../../../../theme/fonts';

const classModeSelectModal = (props) => {
  const { visible, onClose, budgetDetails, selectedSubject } = props;
  const navigation = useNavigation();

  const [numberOfClass, setNumberOfClass] = useState(1);
  const [amount, setAmount] = useState(100);
  const [onlineClassMode, setOnlineClassMode] = useState(false);
  const [offlineClassMode, setOfflineClassMode] = useState(false);
  const [onlineClassPrices, setOnlineClassPrices] = useState([]);
  const [offlineClassPrices, setOfflineClassPrices] = useState([]);

  const [addToCart, { loading: cartLoading }] = useMutation(ADD_TO_CART, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        onClose(false);
        navigation.navigate(routeNames.STUDENT.MY_CART);
      }
    },
  });

  useEffect(() => {
    const bdata = [];
    const odata = [];
    for (const b of budgetDetails) {
      if (!b.onlineClass) {
        odata.push({ classes: b.count, pricePerHour: b.price, totalPrice: b.price * b.count });
        setOfflineClassMode(false);
      } else {
        bdata.push({ classes: b.count, pricePerHour: b.price, totalPrice: b.price * b.count });
        setOnlineClassMode(true);
      }
    }
    setOnlineClassPrices(bdata);
    setOfflineClassPrices(odata);
  }, [budgetDetails]);

  const addClass = () => {
    const cls = numberOfClass + 1;
    setNumberOfClass(numberOfClass + 1);
    if (cls < 5) {
      setAmount(100 * cls);
    } else if (cls > 4 && cls < 10) {
      setAmount(100 * cls);
    } else if (cls > 9 && cls < 20) {
      setAmount(100 * cls);
    } else if (cls > 19) {
      setAmount(100 * cls);
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

  const onClassItemClick = (item) => {
    setAmount(item.totalPrice);
    setNumberOfClass(item.classes);
  };

  const renderClasses = (item) => {
    return (
      <TouchableWithoutFeedback onPress={() => onClassItemClick(item)}>
        <View
          style={[
            commonStyles.borderBottom,
            {
              // marginTop: RfH(24),
              height: RfH(44),
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              paddingBottom: RfH(8),
            },
          ]}>
          <View style={{}}>
            <Text style={commonStyles.mediumMutedText}>{item.classes}</Text>
          </View>
          <View>
            <Text style={commonStyles.mediumMutedText}>{item.pricePerHour}</Text>
          </View>
          <View>
            <Text style={commonStyles.mediumMutedText}>{item.totalPrice}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const changeOnlineClassMode = () => {
    setOnlineClassMode(true);
    setOfflineClassMode(false);
    if (onlineClassPrices.length > 0) {
      const odata = [];
      for (const b of budgetDetails) {
        if (b.onlineClass) {
          odata.push({ classes: b.count, pricePerHour: b.price, totalPrice: b.price * b.count });
        }
      }
      setOnlineClassPrices(odata);
    }
  };

  const changeOfflineClassMode = () => {
    setOfflineClassMode(true);
    setOnlineClassMode(false);
    if (offlineClassPrices.length > 0) {
      const odata = [];
      for (const b of budgetDetails) {
        if (!b.onlineClass) {
          odata.push({ classes: b.count, pricePerHour: b.price, totalPrice: b.price * b.count });
        }
      }
      setOfflineClassPrices(odata);
    }
  };

  const onAddingIntoCart = () => {
    const cartCreate = {
      tutorOfferingId: selectedSubject.offeringId,
      count: numberOfClass,
      groupSize: 1,
      demo: false,
      onlineClass: onlineClassMode,
      price: amount,
    };
    addToCart({
      variables: { cartCreateDto: cartCreate },
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={() => {
        onClose(false);
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
        <View
          style={[
            commonStyles.horizontalChildrenSpaceView,
            {
              height: RfH(44),
              paddingHorizontal: RfW(16),
              backgroundColor: Colors.lightBlue
            },
          ]}>
          <Text style={[commonStyles.headingPrimaryText]}>Book Class</Text>
          <IconButtonWrapper
            iconHeight={RfH(24)}
            iconWidth={RfW(24)}
            iconImage={Images.cross}
            submitFunction={() => onClose(false)}
          />
        </View>
        <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
          <Loader isLoading={cartLoading} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[commonStyles.mediumPrimaryText, { marginTop: RfH(16), alignSelf: 'flex-start' }]}>
              Select mode of class and number of Classes
            </Text>
            <View
              style={[
                commonStyles.horizontalChildrenSpaceView,
                {
                  marginTop: RfH(16),
                  alignItems: 'flex-start',
                },
              ]}>
              <Text style={commonStyles.mediumPrimaryText}>Mode of Class</Text>
              <View style={commonStyles.horizontalChildrenCenterView}>
                {onlineClassPrices.length > 0 && (
                  <View style={{ flexDirection: 'row' }}>
                    <CustomRadioButton enabled={onlineClassMode} submitFunction={() => changeOnlineClassMode()} />
                    <Text
                      style={[
                        styles.appliedFilterText,
                        {
                          marginLeft: RfH(8),
                        },
                      ]}>
                      Online
                    </Text>
                  </View>
                )}
                {offlineClassPrices.length > 0 && (
                  <View style={{ flexDirection: 'row', marginLeft: RfW(16) }}>
                    <CustomRadioButton enabled={offlineClassMode} submitFunction={() => changeOfflineClassMode()} />
                    <Text
                      style={[
                        styles.appliedFilterText,
                        {
                          marginLeft: RfH(8),
                        },
                      ]}>
                      Offline
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                marginTop: RfH(16),
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <Text>Classes</Text>
              <Text>Price/Hour</Text>
              <Text>Total Price</Text>
            </View>
            <View style={commonStyles.borderBottom}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={onlineClassMode ? onlineClassPrices : offlineClassPrices}
                renderItem={({ item, index }) => renderClasses(item, index)}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
              <Text style={commonStyles.regularPrimaryText}>Total Classes</Text>
              <View style={styles.bookingSelectorParent}>
                <TouchableWithoutFeedback onPress={() => removeClass()}>
                  <View style={{ paddingHorizontal: RfW(8), paddingVertical: RfH(8) }}>
                    <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.minus_blue} />
                  </View>
                </TouchableWithoutFeedback>

                <Text>{numberOfClass}</Text>

                <TouchableWithoutFeedback onPress={() => addClass()}>
                  <View style={{ paddingHorizontal: RfW(8), paddingVertical: RfH(8) }}>
                    <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.plus_blue} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
              <Text style={commonStyles.regularPrimaryText}>Amount Payable</Text>
              <Text style={commonStyles.headingPrimaryText}>₹{amount}</Text>
            </View>
            <View style={{ alignSelf: 'center', marginTop: RfH(32) }}>
              <Button onPress={() => onAddingIntoCart()} style={[commonStyles.buttonPrimary, { width: RfW(144) }]}>
                <Text style={commonStyles.textButtonPrimary}>Add to Cart</Text>
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

classModeSelectModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  budgetDetails: PropTypes.array,
  selectedSubject: PropTypes.object,
};

classModeSelectModal.defaultProps = {
  visible: false,
  onClose: null,
  budgetDetails: [],
  selectedSubject: {},
};

export default classModeSelectModal;
