/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from 'native-base';
import analytics from '@react-native-firebase/analytics';

import { useNavigation } from '@react-navigation/native';
import { useMutation, useReactiveVar } from '@apollo/client';
import { isEmpty } from 'lodash';
import { IconButtonWrapper, Loader, CustomCheckBox } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Colors, Fonts, Images } from '../../../../theme';
import { alertBox, printCurrency, RfH, RfW } from '../../../../utils/helpers';
import routeNames from '../../../../routes/screenNames';
import styles from './styles';
import { ADD_TO_CART } from '../../booking.mutation';
import PriceMatrixComponent from './priceMatrixComponent';
import { studentDetails } from '../../../../apollo/cache';
import HomeTuitionConsentModal from './homeTuitionConsent';
import { DUPLICATE_FOUND } from '../../../../common/errorCodes';

const AddToCartModal = (props) => {
  const { visible, onClose, selectedSubject, isDemoClass, isRenewal, noOfClass, isOnlineRenewal } = props;
  const { budgetDetails } = selectedSubject;
  const studentInfo = useReactiveVar(studentDetails);
  const navigation = useNavigation();
  const [numberOfClass, setNumberOfClass] = useState(noOfClass);
  const [amount, setAmount] = useState(0);
  const [classPrice, setClassPrice] = useState(0);
  const [offlineClassConsent, setOfflineClassConsent] = useState(false);
  const [isOnlineClassMode, setIsOnlineClassMode] = useState(selectedSubject.onlineClass && isOnlineRenewal);
  const demoClassPrice = budgetDetails.filter((budget) => budget.demo === true);
  const [showHomeConsent, setShowHomeConsent] = useState(false);

  const [addToCart, { loading: cartLoading }] = useMutation(ADD_TO_CART, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      console.log(e);
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
        if (error.errorCode === DUPLICATE_FOUND) {
          alertBox(error.message);
        }
      }
    },
    onCompleted: (data) => {
      if (data) {
        onClose(false);
        fireLogEvent(data);
        navigation.navigate(routeNames.STUDENT.MY_CART);
      }
    },
  });
  const fireLogEvent = async (data) => {
    const { tutorOffering, count, onlineClass } = data.addToCart;
    const payload = {
      tutorOfferingId: tutorOffering.id,
      classCount: count,
      classMode: onlineClass ? 'online' : 'offline',
      studentId: studentInfo.id,
    };
    await analytics().logEvent('add_to_cart', payload);
  };
  const calculateAmount = (noClasses, isOnline) => {
    const applicableBudgets = budgetDetails
      .filter((budget) => budget.onlineClass === isOnline && budget.demo === isDemoClass)
      .sort((a, b) => a.count > b.count);
    let perClassPrice = 0;
    applicableBudgets.forEach((budget) => {
      if (noClasses >= budget.count && budget.price !== 0) {
        perClassPrice = budget.price;
      }
    });

    setClassPrice(perClassPrice);
    return noClasses * perClassPrice;
  };

  useEffect(() => {
    if (visible) {
      if (isDemoClass) {
        const isOnlineFreeClass =
          selectedSubject.onlineClass && (!isEmpty(demoClassPrice) || demoClassPrice.some((item) => item.onlineClass));
        setIsOnlineClassMode(isOnlineFreeClass);
        setAmount(calculateAmount(noOfClass, isOnlineFreeClass));
      } else {
        setAmount(calculateAmount(noOfClass, isOnlineClassMode));
      }
    }
  }, [visible]);

  const addClass = () => {
    const noCls = numberOfClass + 1;
    setNumberOfClass(noCls);
    setAmount(calculateAmount(noCls, isOnlineClassMode));
  };

  const removeClass = () => {
    if (numberOfClass > 1) {
      const noCls = numberOfClass - 1;
      setNumberOfClass(noCls);
      setAmount(calculateAmount(noCls, isOnlineClassMode));
    }
  };

  const changeClassMode = (isOnline) => {
    if (isOnlineClassMode !== isOnline) {
      setIsOnlineClassMode(isOnline);
      setAmount(calculateAmount(numberOfClass, isOnline));
    }
  };

  const onAddingIntoCart = () => {
    if (amount === 0 && !isDemoClass) {
      alertBox('Error', 'Amount should be greater than zero for booking');
    } else if (!isOnlineClassMode && !offlineClassConsent) {
      alertBox('Please provide your consent for home tuition.');
    } else {
      const cartCreate = {
        tutorOfferingId: selectedSubject.offeringId,
        count: numberOfClass,
        groupSize: 1,
        demo: isDemoClass,
        onlineClass: isOnlineClassMode,
        price: amount,
        renewal: isRenewal,
      };
      addToCart({
        variables: { cartCreateDto: cartCreate },
      });
    }
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
            <Text style={[commonStyles.headingPrimaryText, { marginLeft: RfW(16) }]}>
              Book {selectedSubject.displayName} Class
            </Text>
          </View>
          <View style={{ flex: 0.5 }}>
            <IconButtonWrapper
              styling={{ alignSelf: 'flex-end' }}
              containerStyling={{ paddingHorizontal: RfW(16) }}
              iconHeight={RfH(20)}
              iconWidth={RfW(20)}
              iconImage={Images.cross}
              submitFunction={() => onClose(false)}
              imageResizeMode="contain"
            />
          </View>
        </View>
        <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
          <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16), alignItems: 'center' }]}>
            <Text style={commonStyles.mediumPrimaryText}>{`Mode of ${isDemoClass ? 'Demo ' : ''}Class`}</Text>
            <View style={[commonStyles.horizontalChildrenCenterView, { flex: 1 }]}>
              {selectedSubject.onlineClass > 0 && (
                <TouchableWithoutFeedback onPress={() => changeClassMode(true)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 8,
                    }}>
                    <IconButtonWrapper
                      iconImage={isOnlineClassMode ? Images.radio : Images.radio_button_null}
                      iconWidth={20}
                      iconHeight={20}
                    />
                    <Text style={[styles.appliedFilterText, { marginLeft: RfH(8) }]}>Online</Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
              {selectedSubject.offlineClass && (
                <TouchableWithoutFeedback onPress={() => changeClassMode(false)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: RfW(16),
                      alignItems: 'center',
                      paddingVertical: 8,
                    }}>
                    <IconButtonWrapper
                      iconImage={!isOnlineClassMode ? Images.radio : Images.radio_button_null}
                      iconWidth={20}
                      iconHeight={20}
                    />
                    <Text style={[styles.appliedFilterText, { marginLeft: RfH(8) }]}>Home Tuition</Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          </View>
        </View>

        {!isOnlineClassMode && (
          <View
            style={{
              flexDirection: 'row',
              marginTop: RfH(10),
              backgroundColor: Colors.lightGrey,
              padding: RfW(16),
            }}>
            <CustomCheckBox
              enabled={offlineClassConsent}
              iconHeight={20}
              submitFunction={() => setOfflineClassConsent((offlineClassConsent) => !offlineClassConsent)}
            />
            <Text style={[commonStyles.mediumMutedText, { marginLeft: RfW(10), flex: 1 }]}>
              I hereby give my consent to the GuruQ certified tutor for conducting home classes for me/ my child at my
              given residential address.{' '}
              <TouchableWithoutFeedback onPress={() => setShowHomeConsent(true)}>
                <Text style={[commonStyles.mediumPrimaryText, { color: Colors.brandBlue }]}>Read More</Text>
              </TouchableWithoutFeedback>
            </Text>
          </View>
        )}

        <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white }]}>
          {!isDemoClass && (
            <PriceMatrixComponent
              budgets={selectedSubject.budgetDetails}
              showOnline={isOnlineClassMode}
              showOffline={!isOnlineClassMode}
            />
          )}
          {!isDemoClass && (
            <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16) }]}>
              <Text style={commonStyles.regularPrimaryText}>Number of Classes</Text>
              <View style={styles.bookingSelectorParent}>
                <TouchableWithoutFeedback onPress={removeClass}>
                  <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(10) }}>
                    <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.minus_blue} />
                  </View>
                </TouchableWithoutFeedback>

                <Text style={{ fontFamily: Fonts.semiBold }}>{numberOfClass}</Text>

                <TouchableWithoutFeedback onPress={addClass}>
                  <View style={{ paddingHorizontal: RfW(16), paddingVertical: RfH(10) }}>
                    <IconButtonWrapper iconWidth={RfW(12)} iconHeight={RfH(12)} iconImage={Images.plus_blue} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          )}
          {/* {amount !== 0 && ( */}
          <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(16), marginBottom: RfH(34) }]}>
            <Text style={commonStyles.regularPrimaryText}>Total Amount</Text>
            <Text style={commonStyles.headingPrimaryText}>
              {numberOfClass} x ₹{classPrice} = ₹{printCurrency(amount)}
            </Text>
          </View>
          {/* )} */}
        </View>

        <View style={commonStyles.lineSeparator} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // alignSelf: 'center',
            alignContent: 'center',
            paddingVertical: RfH(8),
            paddingHorizontal: RfW(16),
          }}>
          <View style={{ alignSelf: 'center' }}>
            <Text style={commonStyles.headingPrimaryText}>₹{printCurrency(amount)}</Text>
            <Text style={commonStyles.smallMutedText}>Item Price</Text>
          </View>
          <Button onPress={onAddingIntoCart} style={[commonStyles.buttonPrimary, { width: RfW(144) }]}>
            <Text style={commonStyles.textButtonPrimary}>Add to Cart</Text>
          </Button>
        </View>
      </View>
      <HomeTuitionConsentModal
        isSelected={offlineClassConsent}
        setConsentValue={() => setOfflineClassConsent((offlineClassConsent) => !offlineClassConsent)}
        onClose={() => setShowHomeConsent(false)}
        visible={showHomeConsent}
      />
    </Modal>
  );
};

AddToCartModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  selectedSubject: PropTypes.object,
  isDemoClass: PropTypes.bool,
  isRenewal: PropTypes.bool,
  noOfClass: PropTypes.number,
  isOnlineRenewal: PropTypes.bool,
};

AddToCartModal.defaultProps = {
  visible: false,
  onClose: null,
  selectedSubject: {},
  isDemoClass: false,
  isRenewal: false,
  noOfClass: 1,
  isOnlineRenewal: true,
};

export default AddToCartModal;
