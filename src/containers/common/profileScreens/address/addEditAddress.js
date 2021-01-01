/* eslint-disable radix */
import { Alert, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Input, Item, Label } from 'native-base';
import Geolocation from '@react-native-community/geolocation';
import { IconButtonWrapper, ScreenHeader } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Colors, Images } from '../../../../theme';
import { RfH, RfW } from '../../../../utils/helpers';
import { ADD_UPDATE_STUDENT_ADDRESS } from '../../graphql-mutation';
import { AddressTypeEnum } from '../../enums';
import GoogleAutoCompleteModal from '../../../../components/GoogleAutoCompleteModal';

function AddEditAddress(props) {
  const [address, setAddress] = useState(
    {
      type: AddressTypeEnum.HOME.label,
      street: '',
      subArea: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      latitude: 0,
      longitude: 0,
      landmark: '',
      fullAddress: '',
    } || props.address
  );

  const [saveAddress, { loading: loadingSaveAddress }] = useMutation(ADD_UPDATE_STUDENT_ADDRESS, {
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
        addressDto: { ...address, postalCode: parseInt(address.postalCode, 10) },
      },
    });
  };

  const [showGoogleSearchModal, setShowGoogleSearchModal] = useState(false);

  return (
    <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
      <ScreenHeader homeIcon label="Address" horizontalPadding={RfW(16)} lineVisible={false} />
      <View style={commonStyles.blankViewSmall} />
      <View style={{ paddingHorizontal: RfW(16) }}>
        <View>
          <Text style={commonStyles.regularMutedText}>Set your location</Text>
          <View
            style={[
              commonStyles.horizontalChildrenView,
              { borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, height: RfH(56) },
            ]}>
            <View style={{ flex: 0.9 }}>
              <TouchableWithoutFeedback onPress={() => setShowGoogleSearchModal(true)}>
                <Text>selected place</Text>
              </TouchableWithoutFeedback>
              {/* <GooglePlacesInput onSelect={(address) => console.log(address)} /> */}
            </View>
            <View style={{ flex: 0.1 }}>
              <IconButtonWrapper
                submitFunction={() => Geolocation.getCurrentPosition((info) => console.log(info))}
                iconImage={Images.gprs}
                iconHeight={RfH(24)}
                iconWidth={RfW(24)}
              />
            </View>
          </View>
        </View>
        <View style={commonStyles.blankViewSmall} />
        <View>
          <Item floatingLabel>
            <Label>House no/Building Name</Label>
            <Input
              value={address.street}
              onChangeText={(text) => setAddress({ ...address, street: text })}
              style={commonStyles.regularPrimaryText}
            />
          </Item>
        </View>
        <View style={commonStyles.blankViewSmall} />
        <View>
          <Item floatingLabel>
            <Label>Area , Locality</Label>
            <Input
              value={address.subArea}
              onChangeText={(text) => setAddress({ ...address, subArea: text })}
              style={commonStyles.regularPrimaryText}
            />
          </Item>
        </View>
        <View style={commonStyles.blankViewSmall} />
        <View>
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <View style={{ flex: 0.5, marginRight: RfW(16) }}>
              <Item floatingLabel>
                <Label>City</Label>
                <Input value={address.city} onChangeText={(text) => setAddress({ ...address, city: text })} />
              </Item>
            </View>
            <View style={{ flex: 0.5, marginLeft: RfW(0) }}>
              <Item floatingLabel>
                <Label>State</Label>
                <Input value={address.state} onChangeText={(text) => setAddress({ ...address, state: text })} />
              </Item>
            </View>
          </View>
        </View>
        <View style={commonStyles.blankViewSmall} />
        <View style={commonStyles.horizontalChildrenSpaceView}>
          <View style={{ flex: 0.5, marginRight: RfW(16) }}>
            <Item floatingLabel>
              <Label>Pincode</Label>
              <Input value={address.postalCode} onChangeText={(text) => setAddress({ ...address, postalCode: text })} />
            </Item>
          </View>
          <View style={{ flex: 0.5, marginLeft: RfW(0) }}>
            <Item floatingLabel>
              <Label>Country</Label>
              <Input value={address.country} onChangeText={(text) => setAddress({ ...address, country: text })} />
            </Item>
          </View>
        </View>
        <View style={commonStyles.blankViewSmall} />
        <View>
          <Item floatingLabel>
            <Label>Landmark</Label>
            <Input
              value={address.landmark}
              onChangeText={(text) => setAddress({ ...address, landmark: text })}
              style={commonStyles.regularPrimaryText}
            />
          </Item>
        </View>

        <View style={commonStyles.blankViewMedium} />

        <Text style={commonStyles.regularMutedText}>Save as</Text>
        <View style={[commonStyles.horizontalChildrenStartView, { marginTop: RfH(10) }]}>
          {[AddressTypeEnum.HOME.label, AddressTypeEnum.WORK.label].map((at) => {
            return (
              <TouchableWithoutFeedback onPress={() => setAddress({ ...address, type: at })}>
                <View
                  style={[
                    commonStyles.horizontalChildrenView,
                    {
                      marginRight: RfW(16),
                      // borderBottomWidth: 1,
                      borderBottomColor: address.type === at ? Colors.brandBlue2 : Colors.darkGrey,
                      paddingVertical: RfH(8),
                    },
                  ]}>
                  <IconButtonWrapper
                    iconImage={address.type === at ? Images.radio : Images.radio_button_null}
                    iconWidth={RfW(16)}
                    iconHeight={RfH(16)}
                    imageResizeMode="contain"
                  />
                  <Text
                    style={{
                      marginLeft: RfW(12),
                      color: address.type === at ? Colors.brandBlue2 : Colors.darkGrey,
                    }}>
                    {at}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          })}

          {/* <TouchableWithoutFeedback onPress={() => setAddress({ ...address, type: AddressTypeEnum.WORK.label })}> */}
          {/*  <View */}
          {/*    style={[ */}
          {/*      commonStyles.horizontalChildrenView, */}
          {/*      { */}
          {/*        marginLeft: RfW(16), */}
          {/*        // borderBottomWidth: 1, */}
          {/*        borderBottomColor: address.type === AddressTypeEnum.WORK.label ? Colors.brandBlue2 : Colors.darkGrey, */}
          {/*        paddingVertical: RfH(8), */}
          {/*      }, */}
          {/*    ]}> */}
          {/*    <IconButtonWrapper */}
          {/*      iconImage={Images.radio_button_null} */}
          {/*      iconWidth={RfW(16)} */}
          {/*      iconHeight={RfH(16)} */}
          {/*      imageResizeMode="contain" */}
          {/*    /> */}
          {/*    <Text */}
          {/*      style={{ */}
          {/*        marginLeft: RfW(12), */}
          {/*        color: address.type === AddressTypeEnum.WORK.label ? Colors.brandBlue2 : Colors.darkGrey, */}
          {/*      }}> */}
          {/*      Work */}
          {/*    </Text> */}
          {/*  </View> */}
          {/* </TouchableWithoutFeedback> */}
          {/* <TouchableWithoutFeedback onPress={() => setAddressType(AddressTypeEnum.OTHER.label)}> */}
          {/*  <View */}
          {/*    style={[ */}
          {/*      commonStyles.horizontalChildrenView, */}
          {/*      { */}
          {/*        borderBottomWidth: 1, */}
          {/*        borderBottomColor: addressType === AddressTypeEnum.OTHER.label ? Colors.brandBlue2 : Colors.darkGrey, */}
          {/*        paddingVertical: RfH(8), */}
          {/*      }, */}
          {/*    ]}> */}
          {/*    <IconButtonWrapper */}
          {/*      iconImage={Images.pin} */}
          {/*      iconWidth={RfW(16)} */}
          {/*      iconHeight={RfH(16)} */}
          {/*      imageResizeMode="contain" */}
          {/*    /> */}
          {/*    <Text */}
          {/*      style={{ */}
          {/*        marginLeft: RfW(12), */}
          {/*        color: addressType === AddressTypeEnum.OTHER.label ? Colors.brandBlue2 : Colors.darkGrey, */}
          {/*      }}> */}
          {/*      Other */}
          {/*    </Text> */}
          {/*  </View> */}
          {/* </TouchableWithoutFeedback> */}
        </View>

        <View style={commonStyles.blankViewMedium} />
        <View>
          <Button onPress={() => onSavingAddress()} block style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
            <Text style={commonStyles.textButtonPrimary}>Save</Text>
          </Button>
        </View>
      </View>

      <GoogleAutoCompleteModal
        visible={showGoogleSearchModal}
        onClose={() => setShowGoogleSearchModal(false)}
        onSelect={(address) => {
          setShowGoogleSearchModal(false);

          setAddress(address);
          console.log(address);
        }}
      />
    </View>
  );
}

export default AddEditAddress;
