/* eslint-disable radix */
import { Alert, Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { Button, Input, Item, Label } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { IconButtonWrapper, ScreenHeader } from '../../../../components';
import { userDetails } from '../../../../apollo/cache';
import commonStyles from '../../../../theme/styles';
import { Colors, Images } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import routeNames from '../../../../routes/screenNames';
import { ADD_UPDATE_STUDENT_ADDRESS } from '../../graphql-mutation';
import { AddressTypeEnum } from '../../enums';

function AddEditAddress() {
  const navigation = useNavigation();
  const userInfo = useReactiveVar(userDetails);
  const [addressType, setAddressType] = useState(AddressTypeEnum.HOME.label);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setstate] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('');
  const [area, setArea] = useState('');
  const [fullAddress, setFullAddress] = useState('Delhi, India.');

  const [saveAddress, { loading: studentAddressLoading }] = useMutation(ADD_UPDATE_STUDENT_ADDRESS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        Alert.alert('Details updated!');
      }
    },
  });

  const onSavingAddress = () => {
    saveAddress({
      variables: {
        addressDto: {
          type: addressType,
          street,
          city,
          state,
          subArea: area,
          country,
          postalCode: parseInt(pincode),
          fullAddress,
          location: {
            latitude: 28.23456788997,
            longitude: 77.23445667784,
          },
        },
      },
    });
  };

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader homeIcon label="Address" horizontalPadding={RfW(16)} lineVisible={false} />
      <View style={{ height: RfH(24) }} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View>
          <Text style={commonStyles.regularMutedText}>Set your location</Text>
          <View
            style={[
              commonStyles.horizontalChildrenView,
              { borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, height: RfH(56) },
            ]}>
            <View style={{ flex: 0.9 }}>
              <GooglePlacesAutocomplete
                placeholder="Search"
                fetchDetails
                onPress={(data, details = null) => {
                  console.log('ddddd', data, details);
                }}
                query={{
                  key: 'AIzaSyD8MaEzNhuejY2yBx6No7-TfkAvQ2X_wyk',
                  language: 'en',
                }}
              />
            </View>
            <View style={{ flex: 0.1 }}>
              <IconButtonWrapper
                // submitFunction={() => navigation.navigate(routeNames.ADDRESS_MAP_VIEW)}
                iconImage={Images.gprs}
                iconHeight={RfH(24)}
                iconWidth={RfW(24)}
              />
            </View>
          </View>
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <Item floatingLabel>
            <Label>House no/Building Name</Label>
            <Input value={street} onChangeText={(text) => setStreet(text)} style={commonStyles.regularPrimaryText} />
          </Item>
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <Item floatingLabel>
            <Label>Area , Locality</Label>
            <Input value={area} onChangeText={(text) => setArea(text)} style={commonStyles.regularPrimaryText} />
          </Item>
        </View>
        <View style={{ height: RfH(24) }} />
        <View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View style={{ flex: 0.5, marginRight: RfW(16) }}>
              <Item floatingLabel>
                <Label>City</Label>
                <Input value={city} onChangeText={(text) => setCity(text)} />
              </Item>
            </View>
            <View style={{ flex: 0.5, marfinLeft: RfW(16) }}>
              <Item floatingLabel>
                <Label>State</Label>
                <Input value={state} onChangeText={(text) => setstate(text)} />
              </Item>
            </View>
          </View>
        </View>
        <View style={{ height: RfH(24) }} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <View style={{ flex: 0.5, marginRight: RfW(16) }}>
            <Item floatingLabel>
              <Label>Pincode</Label>
              <Input value={pincode} onChangeText={(text) => setPincode(text)} />
            </Item>
          </View>
          <View style={{ flex: 0.5, marfinLeft: RfW(16) }}>
            <Item floatingLabel>
              <Label>Country</Label>
              <Input value={country} onChangeText={(text) => setCountry(text)} />
            </Item>
          </View>
        </View>
        <View style={{ height: RfH(24) }} />
        <Text style={commonStyles.smallMutedText}>Save as</Text>
        <View style={[commonStyles.horizontalChildrenSpaceView, { marginTop: RfH(10) }]}>
          <TouchableWithoutFeedback onPress={() => setAddressType(AddressTypeEnum.HOME.label)}>
            <View
              style={[
                commonStyles.horizontalChildrenView,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: addressType === AddressTypeEnum.HOME.label ? Colors.brandBlue2 : Colors.darkGrey,
                  paddingVertical: RfH(8),
                },
              ]}>
              <IconButtonWrapper
                iconImage={addressType === AddressTypeEnum.HOME.label ? Images.home_active : Images.home}
                iconWidth={RfW(16)}
                iconHeight={RfH(16)}
                imageResizeMode="contain"
              />
              <Text
                style={{
                  marginLeft: RfW(12),
                  color: addressType === AddressTypeEnum.HOME.label ? Colors.brandBlue2 : Colors.darkGrey,
                }}>
                Home
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setAddressType(AddressTypeEnum.WORK.label)}>
            <View
              style={[
                commonStyles.horizontalChildrenView,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: addressType === AddressTypeEnum.WORK.label ? Colors.brandBlue2 : Colors.darkGrey,
                  paddingVertical: RfH(8),
                },
              ]}>
              <IconButtonWrapper
                iconImage={Images.work_office}
                iconWidth={RfW(16)}
                iconHeight={RfH(16)}
                imageResizeMode="contain"
              />
              <Text
                style={{
                  marginLeft: RfW(12),
                  color: addressType === AddressTypeEnum.WORK.label ? Colors.brandBlue2 : Colors.darkGrey,
                }}>
                Work
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setAddressType(AddressTypeEnum.OTHER.label)}>
            <View
              style={[
                commonStyles.horizontalChildrenView,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: addressType === AddressTypeEnum.OTHER.label ? Colors.brandBlue2 : Colors.darkGrey,
                  paddingVertical: RfH(8),
                },
              ]}>
              <IconButtonWrapper
                iconImage={Images.pin}
                iconWidth={RfW(16)}
                iconHeight={RfH(16)}
                imageResizeMode="contain"
              />
              <Text
                style={{
                  marginLeft: RfW(12),
                  color: addressType === AddressTypeEnum.OTHER.label ? Colors.brandBlue2 : Colors.darkGrey,
                }}>
                Other
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ height: RfH(40) }} />
        <View>
          <Button onPress={() => onSavingAddress()} block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
            <Text style={commonStyles.textButtonPrimary}>Save</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export default AddEditAddress;
