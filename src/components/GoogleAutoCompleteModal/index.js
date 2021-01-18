/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Text, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Colors, Images } from '../../theme';
import { deviceHeight, processGeoData, RfH, RfW } from '../../utils/helpers';
import { GOOGLE_API_KEY } from '../../utils/constants';
import ScreenHeader from '../ScreenHeader';

navigator.geolocation = require('@react-native-community/geolocation');

const GoogleAutoCompleteModal = (props) => {
  const { visible, onClose, onSelect } = props;

  const handleSelectSuggest = (geoData) => {
    const address = processGeoData(geoData);

    if (onSelect) {
      onSelect(address);
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
        }}>
        <ScreenHeader
          homeIcon={false}
          label="Search Place"
          horizontalPadding={RfW(16)}
          showRightIcon
          onRightIconClick={onClose}
          rightIcon={Images.cross}
          lineVisible
        />

        <View
          style={{
            borderBottomWidth: 1,
            borderColor: Colors.darkGrey,
            height: deviceHeight(),
            backgroundColor: '#dddddd',
          }}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            fetchDetails
            // currentLocation
            // currentLocationLabel="Current location"
            minLength={2}
            debounce={300}
            onPress={(data, details = null) => {
              handleSelectSuggest(details);
            }}
            styles={{ height: RfH(54), fontSize: 14, borderBottomWidth: 1, borderColor: Colors.darkGrey }}
            query={{
              key: GOOGLE_API_KEY,
              language: 'en',
            }}
            textInputProps={{
              ref: (textInput) => (textInput ? textInput.focus() : () => {}),
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
