/* eslint-disable radix */
import { KeyboardAvoidingView, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { Button, Input, Item, Label } from 'native-base';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { isEmpty, omit } from 'lodash';
import { IconButtonWrapper, ScreenHeader, Loader } from '../../components';
import commonStyles from '../../theme/styles';
import { Colors, Images } from '../../theme';
import { alertBox, RfH, RfW } from '../../utils/helpers';
import { ADD_UPDATE_STUDENT_ADDRESS, ADD_UPDATE_TUTOR_ADDRESS } from '../common/graphql-mutation';
import { AddressTypeEnum } from '../common/enums';
import GoogleAutoCompleteModal from '../../components/GoogleAutoCompleteModal';
import { UserTypeEnum } from '../../common/userType.enum';
import { userType } from '../../apollo/cache';

function AddEditAddress(props) {
  const { route } = props;
  const { address: editAddress } = route.params;
  const navigation = useNavigation();
  const userTypeVal = useReactiveVar(userType);
  const isStudent = userTypeVal === UserTypeEnum.STUDENT.label;
  const [showGoogleSearchModal, setShowGoogleSearchModal] = useState(false);

  const [address, setAddress] = useState(
    editAddress || {
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
    }
  );

  console.log('address', editAddress);

  const [saveStudentAddress, { loading: loadingSaveStudentAddress }] = useMutation(ADD_UPDATE_STUDENT_ADDRESS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Address saved successfully!', '', {
          positiveText: 'Ok',
          onPositiveClick: () => navigation.goBack(),
        });
      }
    },
  });

  const [saveTutorAddress, { loading: loadingSaveTutorAddress }] = useMutation(ADD_UPDATE_TUTOR_ADDRESS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Address saved successfully!', '', {
          positiveText: 'Ok',
          onPositiveClick: () => navigation.goBack(),
        });
      }
    },
  });

  const onSavingAddress = () => {
    if (isEmpty(address.street)) {
      alertBox('Please provide the House no/Building Name');
      return;
    }
    const variables = {
      variables: {
        addressDto: { ...omit(address, ['__typename']), postalCode: parseInt(address.postalCode, 10) },
      },
    };
    if (isStudent) {
      saveStudentAddress(variables);
    } else {
      saveTutorAddress(variables);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ android: '', ios: 'padding' })} enabled>
      <Loader isLoading={loadingSaveTutorAddress || loadingSaveStudentAddress} />
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <ScreenHeader homeIcon label="Address" horizontalPadding={RfW(16)} lineVisible={false} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: RfW(16) }}>
          <View style={commonStyles.blankViewSmall} />
          <View style={{ paddingHorizontal: RfW(16) }}>
            <View>
              <Text style={commonStyles.regularMutedText}>Search your location</Text>
              <View
                style={[
                  commonStyles.horizontalChildrenView,
                  { borderBottomColor: Colors.darkGrey, borderBottomWidth: 0.5, height: RfH(44) },
                ]}>
                <View style={{ flex: 0.9 }}>
                  <TouchableWithoutFeedback onPress={() => setShowGoogleSearchModal(true)}>
                    <Text>{address.fullAddress || 'Type here to search...'}</Text>
                  </TouchableWithoutFeedback>
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
                <Label style={commonStyles.mediumMutedText}>House no/Building Name</Label>
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
                <Label style={commonStyles.mediumMutedText}>Area , Locality</Label>
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
                    <Label style={commonStyles.mediumMutedText}>City</Label>
                    <Input value={address.city} onChangeText={(text) => setAddress({ ...address, city: text })} />
                  </Item>
                </View>
                <View style={{ flex: 0.5, marginLeft: RfW(0) }}>
                  <Item floatingLabel>
                    <Label style={commonStyles.mediumMutedText}>State</Label>
                    <Input value={address.state} onChangeText={(text) => setAddress({ ...address, state: text })} />
                  </Item>
                </View>
              </View>
            </View>
            <View style={commonStyles.blankViewSmall} />
            <View style={commonStyles.horizontalChildrenSpaceView}>
              <View style={{ flex: 0.5, marginRight: RfW(16) }}>
                <Item floatingLabel>
                  <Label style={commonStyles.mediumMutedText}>Postal Code</Label>
                  <Input
                    value={address.postalCode ? address.postalCode.toString() : ''}
                    onChangeText={(text) => setAddress({ ...address, postalCode: text })}
                  />
                </Item>
              </View>
              <View style={{ flex: 0.5, marginLeft: RfW(0) }}>
                <Item floatingLabel>
                  <Label style={commonStyles.mediumMutedText}>Country</Label>
                  <Input value={address.country} onChangeText={(text) => setAddress({ ...address, country: text })} />
                </Item>
              </View>
            </View>
            <View style={commonStyles.blankViewSmall} />
            <View>
              <Item floatingLabel>
                <Label style={commonStyles.mediumMutedText}>Landmark</Label>
                <Input
                  value={address.landmark}
                  onChangeText={(text) => setAddress({ ...address, landmark: text })}
                  style={commonStyles.regularPrimaryText}
                />
              </Item>
            </View>

            <View style={{ height: RfH(24) }} />

            <Text style={commonStyles.regularMutedText}>Save as</Text>
            <View style={[commonStyles.horizontalChildrenStartView, { marginTop: RfH(10) }]}>
              {[AddressTypeEnum.HOME.label, AddressTypeEnum.WORK.label, AddressTypeEnum.BILLING.label].map((at) => {
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
            </View>

            <View style={commonStyles.blankViewMedium} />
            <View>
              <Button
                onPress={() => onSavingAddress()}
                block
                style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
                <Text style={commonStyles.textButtonPrimary}>Save</Text>
              </Button>
            </View>
          </View>
        </ScrollView>

        <GoogleAutoCompleteModal
          visible={showGoogleSearchModal}
          onClose={() => setShowGoogleSearchModal(false)}
          onSelect={(data) => {
            setShowGoogleSearchModal(false);
            setAddress({ ...address, ...data });
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

export default AddEditAddress;
