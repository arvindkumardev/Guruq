// import { Input, Item } from 'native-base';
// import PropTypes from 'prop-types';
// import React, { useState } from 'react';
// import { View } from 'react-native';
// import ReactGoogleMapLoader from 'react-google-maps-loader';
// import ReactGooglePlacesSuggest from 'react-google-places-suggest';
// // config variables

// const GoogleLocationAutoSuggest = (props) => {
//   const [config, setConfig] = useState({
//     googleApiKey: 'AIzaSyD8MaEzNhuejY2yBx6No7-TfkAvQ2X_wyk',
//   });
//   const [search, setSearch] = useState('');
//   const [value, setValue] = useState('');
//   const handleInputChange = (value) => {
//     setSearch(value);
//     setValue(value);
//   };
//   const clearText = () => {
//     setSearch('');
//     setValue('');
//   };
//   const handleSelectSuggest = (geoData) => {
//     // first clear the current values
//     if (props.onClear) {
//       props.onClear();
//     }
//     setSearch('');
//     setValue(geoData.formatted_address);
//     const latitude = geoData.geometry && geoData.geometry.location ? geoData.geometry.location.lat() : 0;
//     const longitude = geoData.geometry && geoData.geometry.location ? geoData.geometry.location.lng() : 0;
//     const { long_name: country } = geoData.address_components.find((comp) => comp.types.includes('country')) || '';
//     const { long_name: state } =
//       geoData.address_components.find((comp) => comp.types.includes('administrative_area_level_1')) || '';
//     const { long_name: city } =
//       geoData.address_components.find((comp) => comp.types.includes('locality')) ||
//       geoData.address_components.find((comp) => comp.types.includes('administrative_area_level_2')) ||
//       '';
//     const { long_name: region } =
//       geoData.address_components.find((comp) => comp.types.includes('sublocality_level_1')) || '';
//     const { long_name: areaT } =
//       geoData.address_components.find((comp) => comp.types.includes('sublocality_level_2')) || '';
//     const subArea = [];
//     if (region) {
//       subArea.push(region);
//     }
//     if (areaT) {
//       subArea.push(areaT);
//     }
//     const { long_name: postalCode } =
//       geoData.address_components.find((comp) => comp.types.includes('postal_code')) || '';
//     if (props.onLocationSelect) {
//       props.onLocationSelect({
//         fullAddress: geoData.formatted_address,
//         country,
//         state,
//         city,
//         subArea: subArea.join(', '),
//         postalCode,
//         location: { latitude, longitude },
//       });
//     }
//   };
//   return (
//     <ReactGoogleMapLoader
//       params={{
//         key: config.googleApiKey,
//         libraries: 'places,geocode',
//       }}
//       render={(googleMaps) =>
//         googleMaps && (
//           <View>
//             <ReactGooglePlacesSuggest
//               autocompletionRequest={{ input: search, componentRestrictions: { country: 'in' } }}
//               googleMaps={googleMaps}
//               displayPoweredByGoogle={false}
//               onSelectSuggest={handleSelectSuggest}
//               textNoResults="No Result Found!">
//               <Item>
//                 <Input
//                   type="text"
//                   value={value}
//                   placeholder="Search a location"
//                   onChange={(e) => handleInputChange(e.target.value)}
//                   onFocus={clearText}
//                 />
//               </Item>
//             </ReactGooglePlacesSuggest>
//           </View>
//         )
//       }
//     />
//   );
// };
// GoogleLocationAutoSuggest.propTypes = {
//   onLocationSelect: PropTypes.func,
//   onClear: PropTypes.func,
// };

// GoogleLocationAutoSuggest.defaultProps = {
//   onLocationSelect: null,
//   onClear: null,
// };
// export default GoogleLocationAutoSuggest;
