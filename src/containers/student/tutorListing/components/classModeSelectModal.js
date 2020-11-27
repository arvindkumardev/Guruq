/* eslint-disable no-restricted-syntax */
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
  const { visible, onClose, budgetDetails, selectedSubject, demo } = props;
  const navigation = useNavigation();

  const [numberOfClass, setNumberOfClass] = useState(1);
  const [amount, setAmount] = useState(0);
  const [onlineClassMode, setOnlineClassMode] = useState(false);
  const [offlineClassMode, setOfflineClassMode] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
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
    if (demo) {
      if (budgetDetails.find((ob) => ob?.demo === true)) {
        for (const obj of budgetDetails) {
          if (obj.demo) {
            setAmount(obj.price);
            if (!obj.onlineClass) {
              odata.push({ classes: obj.count, pricePerHour: obj.price, totalPrice: obj.price * obj.count });
            } else {
              bdata.push({ classes: obj.count, pricePerHour: obj.price, totalPrice: obj.price * obj.count });
            }
          }
        }
      } else {
        for (const obj of budgetDetails) {
          if (obj.count === 1) {
            setAmount(obj.price);
            if (!obj.onlineClass) {
              odata.push({ classes: obj.count, pricePerHour: obj.price, totalPrice: obj.price * obj.count });
            } else {
              bdata.push({ classes: obj.count, pricePerHour: obj.price, totalPrice: obj.price * obj.count });
            }
          }
        }
      }
    } else {
      for (const b of budgetDetails) {
        if (!b.demo && b.count === 1) {
          setAmount(b.price);
        }
        if (!b.demo) {
          if (!b.onlineClass) {
            odata.push({ classes: b.count, pricePerHour: b.price, totalPrice: b.price * b.count });
          } else {
            bdata.push({ classes: b.count, pricePerHour: b.price, totalPrice: b.price * b.count });
          }
        }
      }
    }
    if (bdata.length > 0) {
      setOnlineClassMode(true);
      setOfflineClassMode(false);
    } else {
      setOnlineClassMode(false);
      setOfflineClassMode(true);
    }
    setOnlineClassPrices(bdata);
    setOfflineClassPrices(odata);
    setRefreshList(!refreshList);
  }, [budgetDetails]);

  const addClass = () => {
    const cls = numberOfClass + 1;
    setNumberOfClass(numberOfClass + 1);
    let amt = 0;
    for (const b of budgetDetails) {
      if (cls < 5 && b.count < 5) {
        amt = b.price;
        break;
      } else if (cls > 4 && cls < 10 && b.count > 4 && b.count < 10) {
        amt = b.price;
        break;
      } else if (cls > 9 && cls < 25 && b.count > 9 && b.count < 25) {
        amt = b.price;
        break;
      } else if (cls > 24 && cls < 50 && b.count > 24 && b.count < 50) {
        amt = b.price;
        break;
      } else {
        amt = b.price;
      }
    }
    setAmount(amt * cls);
  };

  const removeClass = () => {
    if (numberOfClass > 1) {
      setNumberOfClass(numberOfClass - 1);
      const cls = numberOfClass - 1;
      let amt = 0;
      for (const b of budgetDetails) {
        if (cls < 5 && b.count < 5) {
          amt = b.price;
          break;
        } else if (cls > 4 && cls < 10 && b.count > 4 && b.count < 10) {
          amt = b.price;
          break;
        } else if (cls > 9 && cls < 25 && b.count > 9 && b.count < 25) {
          amt = b.price;
          break;
        } else if (cls > 24 && cls < 50 && b.count > 24 && b.count < 50) {
          amt = b.price;
          break;
        } else {
          amt = b.price;
        }
      }
      setAmount(amt * cls);
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
      setAmount(budgetDetails[0].price);
      setNumberOfClass(1);
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
      setAmount(budgetDetails[0].price);
      setNumberOfClass(1);
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
      <Loader isLoading={cartLoading} />
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
              backgroundColor: Colors.lightBlue,
            },
          ]}>
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.headingPrimaryText, { marginLeft: RfW(16) }]}>Book Class</Text>
          </View>
          <View style={{ flex: 0.5, paddingHorizontal: RfW(16) }}>
            <IconButtonWrapper
              styling={{ alignSelf: 'flex-end' }}
              iconHeight={RfH(24)}
              iconWidth={RfW(24)}
              iconImage={Images.cross}
              submitFunction={() => onClose(false)}
            />
          </View>
        </View>
        <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
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
                extraData={refreshList}
                renderItem={({ item, index }) => renderClasses(item, index)}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            {!demo && (
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
            )}
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
  demo: PropTypes.bool,
};

classModeSelectModal.defaultProps = {
  visible: false,
  onClose: null,
  budgetDetails: [],
  selectedSubject: {},
  demo: false,
};

export default classModeSelectModal;
