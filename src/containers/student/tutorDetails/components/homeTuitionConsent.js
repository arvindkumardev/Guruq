/* eslint-disable no-restricted-syntax */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { CustomCheckBox, IconButtonWrapper } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Colors, Images } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';

const HomeTuitionConsentModal = (props) => {
  const { visible, isSelected, setConsentValue, onClose } = props;

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
              backgroundColor: Colors.lightBlue,
            },
          ]}>
          <View style={{ flex: 1 }}>
            <Text style={[commonStyles.headingPrimaryText, { marginLeft: RfW(16) }]}>Home Tuition Consent</Text>
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
        <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, marginTop: RfH(10) }]}>
          <View style={{ flexDirection: 'row', marginTop: RfH(5), paddingHorizontal: RfW(20) }}>
            <CustomCheckBox enabled={isSelected} iconHeight={18} submitFunction={setConsentValue} />
            <TouchableOpacity style={{ marginLeft: RfW(10) }} activeOpacity={0.8} onPress={setConsentValue}>
              <Text style={[commonStyles.smallMutedText]}>
                {'I acknowledge the contagious nature of COVID -19 and voluntarily assume the risk that me / my child/ my' +
                  'family or friends or any other person who may have contact may be exposed to or be infected by COVID-19.'}
              </Text>
              <Text style={[commonStyles.smallMutedText, { marginTop: RfH(10) }]}>
                {'I will follow all safety guidelines laid down by the government of India and also accept the sole ' +
                  'responsibility for any injury, if caused to me / my child/ my family or friends or any other person'}
              </Text>
              <Text style={[commonStyles.smallMutedText, { marginTop: RfH(10) }]}>
                Please ensure you take all the following safety measures during your Home Tuition classes.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            marginTop: RfH(20),
            marginHorizontal: RfW(20),
            backgroundColor: Colors.lightGrey,
            marginBottom: RfH(30),
            paddingHorizontal: RfW(15),
            paddingVertical: RfH(20),
          }}>
          <Text style={[commonStyles.headingMutedText]}>
            Please ensure you take all the following safety measures during your Home Tuition classes.
          </Text>
          <View style={{ marginTop: RfH(20), marginRight: RfH(10) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <IconButtonWrapper
                iconImage={require('../../../../assets/images/homeTuitionConsent/wearing_mask.png')}
                iconHeight={RfH(20)}
                iconWidth={RfH(20)}
                styling={{ marginRight: RfW(10) }}
                imageResizeMode="contain"
              />
              <Text style={[commonStyles.smallMutedText]}>Wear mask</Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop: RfH(10), alignItems: 'center' }}>
              <IconButtonWrapper
                iconImage={require('../../../../assets/images/homeTuitionConsent/social_distancing.png')}
                iconHeight={RfH(20)}
                iconWidth={RfH(20)}
                styling={{ marginRight: RfW(10) }}
                imageResizeMode="contain"
              />
              <Text style={[commonStyles.smallMutedText]}>Maintain social distancing (6 ft. apart)</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: RfH(10), alignItems: 'center' }}>
              <IconButtonWrapper
                iconImage={require('../../../../assets/images/homeTuitionConsent/temperature_monitoring.png')}
                iconHeight={RfH(20)}
                iconWidth={RfH(20)}
                styling={{ marginRight: RfW(10) }}
                imageResizeMode="contain"
              />
              <Text style={[commonStyles.smallMutedText]}>Monitor temperature before and after class</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: RfH(10), alignItems: 'center' }}>
              <IconButtonWrapper
                iconImage={require('../../../../assets/images/homeTuitionConsent/sanitising_hands.png')}
                iconHeight={RfH(20)}
                iconWidth={RfH(20)}
                styling={{ marginRight: RfW(10) }}
                imageResizeMode="contain"
              />
              <Text style={[commonStyles.smallMutedText]}>Sanitise your hands regularly</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: RfH(10), alignItems: 'center' }}>
              <IconButtonWrapper
                iconImage={require('../../../../assets/images/homeTuitionConsent/reservered_area.png')}
                iconHeight={RfH(20)}
                iconWidth={RfH(20)}
                styling={{ marginRight: RfW(10) }}
                imageResizeMode="contain"
              />
              <Text style={[commonStyles.smallMutedText]}>Sit in reserved area (preferably outside)</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: RfH(10), alignItems: 'center' }}>
              <IconButtonWrapper
                iconImage={require('../../../../assets/images/homeTuitionConsent/consumables.png')}
                iconHeight={RfH(20)}
                iconWidth={RfH(20)}
                styling={{ marginRight: RfW(10) }}
                imageResizeMode="contain"
              />
              <Text style={[commonStyles.smallMutedText]}>Avoid sharing food</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

HomeTuitionConsentModal.propTypes = {
  visible: PropTypes.bool,
  isSelected: PropTypes.bool,
  setConsentValue: PropTypes.func,
  onClose: PropTypes.func,
};

HomeTuitionConsentModal.defaultProps = {
  visible: false,
  isSelected: false,
  setConsentValue: null,
  onClose: null,
};

export default HomeTuitionConsentModal;
