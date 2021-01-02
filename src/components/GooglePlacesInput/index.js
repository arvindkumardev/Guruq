// import React from 'react';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import PropTypes from 'prop-types';
// import { Colors } from '../../theme';
// import { GOOGLE_API_KEY } from '../../utils/constants';
// import GoogleAutoCompleteModal from '../GoogleAutoCompleteModal';
//
// navigator.geolocation = require('@react-native-community/geolocation');
// // navigator.geolocation = require('react-native-geolocation-service');
//
// const GooglePlacesInput = (props) => {
//   const { onSelect } = props;
//
//   const handleSelectSuggest = (geoData) => {
//     const latitude = geoData.geometry && geoData.geometry.location ? geoData.geometry.location.lat : 0;
//     const longitude = geoData.geometry && geoData.geometry.location ? geoData.geometry.location.lng : 0;
//
//     const { long_name: country } = geoData.address_components.find((comp) => comp.types.includes('country')) || '';
//
//     const { long_name: state } =
//       geoData.address_components.find((comp) => comp.types.includes('administrative_area_level_1')) || '';
//
//     const { long_name: city } =
//       geoData.address_components.find((comp) => comp.types.includes('locality')) ||
//       geoData.address_components.find((comp) => comp.types.includes('administrative_area_level_2')) ||
//       '';
//
//     const { long_name: region } =
//       geoData.address_components.find((comp) => comp.types.includes('sublocality_level_1')) || '';
//
//     const { long_name: areaT } =
//       geoData.address_components.find((comp) => comp.types.includes('sublocality_level_2')) || '';
//
//     const subArea = [];
//     if (region) {
//       subArea.push(region);
//     }
//     if (areaT) {
//       subArea.push(areaT);
//     }
//
//     const { long_name: postalCode } =
//       geoData.address_components.find((comp) => comp.types.includes('postal_code')) || '';
//
//     if (onSelect) {
//       onSelect({
//         fullAddress: geoData.formatted_address,
//         country,
//         state,
//         city,
//         subArea: subArea.join(', '),
//         postalCode,
//         latitude,
//         longitude,
//       });
//     }
//   };
//
//   return (
//     <GooglePlacesAutocomplete
//       placeholder="Search"
//       fetchDetails
//       currentLocation
//       currentLocationLabel="Current location"
//       minLength={2}
//       debounce={300}
//       onPress={(data, details = null) => {
//         console.log('GooglePlacesAutocomplete: ', data, details);
//         handleSelectSuggest(details);
//       }}
//       styles={{ height: 54, fontSize: 14, borderBottomWidth: 1, borderColor: Colors.darkGrey }}
//       query={{
//         key: GOOGLE_API_KEY,
//         language: 'en',
//       }}
//       enablePoweredByContainer={false}
//     />
//   );
// };
//
// GoogleAutoCompleteModal.propTypes = {
//   onSelect: PropTypes.func,
// };
//
// export default GooglePlacesInput;
