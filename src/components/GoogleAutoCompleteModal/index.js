/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Colors, Images } from '../../theme';
import { deviceHeight, RfH, RfW } from '../../utils/helpers';
import { GOOGLE_API_KEY } from '../../utils/constants';
import ScreenHeader from '../ScreenHeader';

navigator.geolocation = require('@react-native-community/geolocation');

const GoogleAutoCompleteModal = (props) => {
  const navigation = useNavigation();
  const { visible, onClose, onSelect } = props;

  const handleSelectSuggest = (geoData) => {
    const latitude = geoData.geometry && geoData.geometry.location ? geoData.geometry.location.lat : 0;
    const longitude = geoData.geometry && geoData.geometry.location ? geoData.geometry.location.lng : 0;

    const { long_name: country } = geoData.address_components.find((comp) => comp.types.includes('country')) || '';

    const { long_name: state } =
      geoData.address_components.find((comp) => comp.types.includes('administrative_area_level_1')) || '';

    const { long_name: city } =
      geoData.address_components.find((comp) => comp.types.includes('locality')) ||
      geoData.address_components.find((comp) => comp.types.includes('administrative_area_level_2')) ||
      '';

    const { long_name: region } =
      geoData.address_components.find((comp) => comp.types.includes('sublocality_level_1')) || '';

    const { long_name: areaT } =
      geoData.address_components.find((comp) => comp.types.includes('sublocality_level_2')) || '';

    const subArea = [];
    if (region) {
      subArea.push(region);
    }
    if (areaT) {
      subArea.push(areaT);
    }

    const { long_name: postalCode } =
      geoData.address_components.find((comp) => comp.types.includes('postal_code')) || '';

    if (onSelect) {
      onSelect({
        fullAddress: geoData.formatted_address,
        country,
        state,
        city,
        subArea: subArea.join(', '),
        postalCode,
        latitude,
        longitude,
      });
    }
  };

  return (
    <Modal animationType="fade" transparent backdropOpacity={1} visible={visible} onRequestClose={onClose}>
      <View
        style={{
          top: 0,
          left: 0,
          right: 0,
          position: 'absolute',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          backgroundColor: Colors.white,
          opacity: 1,
          // marginBottom: RfH(34),
          // paddingTop: RfH(44),
        }}>
        <ScreenHeader
          homeIcon={false}
          label="Search Place"
          horizontalPadding={RfW(16)}
          showRightIcon
          onRightIconClick={() => {
            console.log('closing google popup');
            onClose();
          }}
          rightIcon={Images.cross}
          lineVisible
        />

        <View
          style={{
            borderBottomWidth: 1,
            borderColor: Colors.darkGrey,
            height: deviceHeight(),
            // paddingVertical: RfH(44),
            // marginBottom: 10,
            // backgroundColor: '#ffffff',
          }}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            fetchDetails
            currentLocation
            currentLocationLabel="Current location"
            minLength={2}
            debounce={300}
            onPress={(data, details = null) => {
              console.log('GooglePlacesAutocomplete', data, details);
              handleSelectSuggest(details);
            }}
            styles={{ height: 54, fontSize: 14, borderBottomWidth: 1, borderColor: Colors.darkGrey }}
            query={{
              key: GOOGLE_API_KEY,
              language: 'en',
            }}
            renderHeaderComponent={() => (
              <View style={{ padding: 8, backgroundColor: Colors.lightGrey }}>
                <Text>Click to select the address</Text>
              </View>
            )}
            enablePoweredByContainer={false}
          />
        </View>
      </View>
    </Modal>
  );
};

GoogleAutoCompleteModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
};

export default GoogleAutoCompleteModal;
