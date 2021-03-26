import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, FlatList, Image, Modal, Platform, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styles from '../Loader/style';
import { RfH, RfW } from '../../utils/helpers';
import { LOTTIE_JSON_FILES, STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { Colors } from '../../theme';
import commonStyles from '../../theme/styles';
import Images from '../../theme/images';

const CouponApplied = (props) => {
  const { coupon, couponValue, handleClose } = props;

  const [showAnimation, setShowAnimation] = useState(true);

  return (
    <>
      <Modal visible animationType="fade" backdropOpacity={1} transparent onRequestClose={handleClose}>
        <TouchableWithoutFeedback onPressIn={handleClose} activeOpacity={0.8}>
          <View style={[styles.modalBackground, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
            <View
              style={[
                styles.mainModalContainer,
                {
                  width: RfW(300),
                  backgroundColor: Colors.white,
                  paddingVertical: RfH(20),
                  paddingHorizontal: RfW(20),
                  borderRadius: RfW(8),
                },
              ]}>
              <Image
                source={Images.discount1}
                style={{ position: 'absolute', top: -24, left: '50%', height: RfH(48), width: RfW(48) }}
                resizeMode="contain"
              />
              <View style={[styles.modalContainer]}>
                <View style={[styles.modalInnerContainer, { alignItems: 'center' }]}>
                  {/* <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, alignItems: 'center' }}> */}

                  <Text
                    style={[
                      commonStyles.headingPrimaryText,
                      { fontSize: RFValue(20, STANDARD_SCREEN_SIZE), marginVertical: 20 },
                    ]}>
                    &apos;{coupon.code}&apos; applied
                  </Text>

                  <Text style={commonStyles.pageTitleThirdRow}>₹{couponValue}</Text>
                  <Text style={[commonStyles.regularMutedText]}>savings with this coupon</Text>
                  {/* </View> */}

                  <Text style={[commonStyles.regularPrimaryText, { marginTop: RfH(20) }]}>
                    Your coupon {coupon.code} is successfully applied.
                  </Text>

                  <Text
                    style={[
                      commonStyles.headingPrimaryText,
                      { marginTop: RfH(20), marginBottom: RfH(10), color: Colors.green },
                    ]}>
                    YAY!
                  </Text>

                  {/* <LottieView */}
                  {/*  style={{ */}
                  {/*    height: RfW(100), */}
                  {/*    width: RfW(200), */}
                  {/*    alignSelf: 'center', */}
                  {/*  }} */}
                  {/*  source={LOTTIE_JSON_FILES.fireworks1} */}
                  {/*  resizeMode="contain" */}
                  {/*  // loop={false} */}
                  {/*  autoPlay */}
                  {/*  onAnimationFinish={() => setShowAnimation(false)} */}
                  {/* /> */}
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

CouponApplied.propTypes = {
  coupon: PropTypes.object.isRequired,
  couponValue: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CouponApplied;
