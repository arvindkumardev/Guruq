import { KeyboardAvoidingView, Text, View, ScrollView, Platform, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Input, Item, Label } from 'native-base';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CustomCheckBox, IconButtonWrapper, Loader, ScreenHeader } from '../../../../components';
import commonStyles from '../../../../theme/styles';
import { Colors, Fonts, Images } from '../../../../theme';
import { alertBox, RfH, RfW } from '../../../../utils/helpers';
import { ADD_UPDATE_BUSINESS_DETAILS } from './business.mutation';
import routeNames from '../../../../routes/screenNames';

function AddEditBusinessDetails(props) {
  const businessDetail = props?.route?.params?.businessDetails;
  const navigation = useNavigation();
  const isFocussed = useIsFocused();
  const [panNumber, setPanNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [legalName, setLegalName] = useState('');
  const [gstEligible, setGstEligible] = useState(false);
  const [businessData, setBusinessData] = useState({});

  useEffect(() => {
    if (!isEmpty(businessDetail)) {
      setPanNumber(businessDetail.panNumber);
      setGstNumber(businessDetail.gstNumber);
      setLegalName(businessDetail.businessName);
      setGstEligible(businessDetail.gstEligible);
    }
  }, [businessDetail]);

  const [saveBusinessDetail, { loading: saveBusinessLoading }] = useMutation(ADD_UPDATE_BUSINESS_DETAILS, {
    fetchPolicy: 'no-cache',
    onError: (e) => {
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        const error = e.graphQLErrors[0].extensions.exception.response;
      }
    },
    onCompleted: (data) => {
      if (data) {
        alertBox('Business Details saved successfully!', '', {
          positiveText: 'Ok',
          onPositiveClick: () => navigation.goBack(),
        });
      }
    },
  });

  const onSubmitBusinessDetail = () => {
    if (isEmpty(panNumber)) {
      alertBox('Please provide the PAN number');
    } else if (isEmpty(gstNumber)) {
      alertBox('Please provide the GST number');
    } else if (isEmpty(legalName)) {
      alertBox('Please provide the legal name');
    } else {
      saveBusinessDetail({
        variables: {
          businessDetailsDto: {
            businessName: legalName,
            gstNumber,
            panNumber,
          },
        },
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ android: '', ios: 'padding' })}
      // keyboardVerticalOffset={Platform.OS === 'ios' ? (isDisplayWithNotch() ? 44 : 20) : 0}
      enabled>
      {/* <Loader isLoading={saveBankDetailLoading} /> */}
      <View style={[commonStyles.mainContainer, { backgroundColor: Colors.white, paddingHorizontal: 0 }]}>
        <Loader isLoading={saveBusinessLoading} />
        <ScreenHeader homeIcon label="Business Details" horizontalPadding={RfW(16)} lineVisible={false} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: RfW(16) }}>
          <View style={{ height: RfH(44) }} />
          <Item floatingLabel>
            <Label>PAN Number</Label>
            <Input value={panNumber} onChangeText={(text) => setPanNumber(text)} />
          </Item>
          <View style={{ height: RfH(24) }} />
          <View style={commonStyles.horizontalChildrenSpaceView}>
            <Text style={[commonStyles.regularPrimaryText, { fontFamily: Fonts.semiBold }]}>
              Are you eligible for GST
            </Text>
            <CustomCheckBox enabled={gstEligible} submitFunction={() => setGstEligible(!gstEligible)} />
          </View>
          <View style={{ height: RfH(24) }} />
          <Item floatingLabel>
            <Label>GSTIN</Label>
            <Input value={gstNumber} onChangeText={(text) => setGstNumber(text)} />
          </Item>
          <View style={{ height: RfH(24) }} />
          <View>
            <Item floatingLabel>
              <Label>Legal Name</Label>
              <Input value={legalName} onChangeText={(text) => setLegalName(text)} />
            </Item>
          </View>
          <View style={{ height: RfH(24) }} />
          <TouchableWithoutFeedback onPress={() => navigation.navigate(routeNames.TUTOR.DOCUMENT_LISTING)}>
            <Text>Documents List</Text>
          </TouchableWithoutFeedback>
          <View style={{ height: RfH(24) }} />
          <View>
            <Button
              onPress={() => onSubmitBusinessDetail()}
              block
              style={[commonStyles.buttonPrimary, { alignSelf: 'center' }]}>
              <Text style={commonStyles.textButtonPrimary}>Save</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

export default AddEditBusinessDetails;
